
-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'school_admin', 'super_admin');

-- 2. Schools table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subscription_plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE(user_id, role)
);

-- 5. Modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'Débutant',
  description TEXT NOT NULL DEFAULT '',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  thumbnail_url TEXT DEFAULT '',
  lessons_count INTEGER NOT NULL DEFAULT 0,
  duration TEXT DEFAULT '',
  rating NUMERIC(2,1) DEFAULT 0,
  students INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'video',
  content_url TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  duration TEXT DEFAULT ''
);

-- 7. Quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INTEGER NOT NULL DEFAULT 0
);

-- 8. Progress table
CREATE TABLE public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- 9. Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL DEFAULT 'individual',
  status TEXT NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper: check role (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = _user_id AND status = 'active'
  )
$$;

-- Trigger: auto-create profile + student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (auth_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, '')
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON public.progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS: profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth_id = auth.uid());
CREATE POLICY "Super admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS: user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Super admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS: modules (public read for free, premium gated)
CREATE POLICY "Anyone can view free modules" ON public.modules FOR SELECT TO authenticated USING (is_premium = false);
CREATE POLICY "Subscribed users can view premium modules" ON public.modules FOR SELECT TO authenticated USING (is_premium = true AND public.has_active_subscription(auth.uid()));
CREATE POLICY "Super admins can manage modules" ON public.modules FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS: lessons
CREATE POLICY "Authenticated can view lessons of accessible modules" ON public.lessons FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.modules m WHERE m.id = module_id AND (m.is_premium = false OR public.has_active_subscription(auth.uid()))
  ));
CREATE POLICY "Super admins can manage lessons" ON public.lessons FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS: quiz_questions
CREATE POLICY "Authenticated can view quiz questions of accessible modules" ON public.quiz_questions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.modules m WHERE m.id = module_id AND (m.is_premium = false OR public.has_active_subscription(auth.uid()))
  ));
CREATE POLICY "Super admins can manage quiz questions" ON public.quiz_questions FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS: progress
CREATE POLICY "Users can view own progress" ON public.progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own progress" ON public.progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON public.progress FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Teachers can view school progress" ON public.progress FOR SELECT USING (public.has_role(auth.uid(), 'teacher'));

-- RLS: subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Super admins can manage subscriptions" ON public.subscriptions FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS: schools
CREATE POLICY "Authenticated can view schools" ON public.schools FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admins can manage schools" ON public.schools FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Seed modules data
INSERT INTO public.modules (title, category, level, description, is_premium, lessons_count, duration, rating, students) VALUES
('Plomberie : Les Fondamentaux', 'Plomberie', 'Débutant', 'Apprenez les bases de la plomberie résidentielle avec des exercices pratiques en réalité augmentée.', false, 12, '6h', 4.8, 1245),
('Électricité Résidentielle', 'Électricité', 'Débutant', 'Maîtrisez l''installation électrique domestique avec des simulations AR interactives.', false, 15, '8h', 4.9, 2103),
('Mécanique Automobile Avancée', 'Mécanique', 'Avancé', 'Diagnostic moteur et réparations complexes guidés par AR. Certification incluse.', true, 20, '12h', 4.7, 867),
('Soudure Industrielle', 'Mécanique', 'Intermédiaire', 'Techniques de soudure MIG/TIG avec feedback AR en temps réel sur vos gestes.', true, 10, '5h', 4.6, 534),
('Installation Sanitaire', 'Plomberie', 'Intermédiaire', 'Installation complète de salles de bain et cuisines avec guide AR pas à pas.', true, 14, '7h', 4.8, 921),
('Câblage Tableau Électrique', 'Électricité', 'Intermédiaire', 'Apprenez à câbler et configurer un tableau électrique conforme aux normes NF.', false, 8, '4h', 4.5, 1567);
