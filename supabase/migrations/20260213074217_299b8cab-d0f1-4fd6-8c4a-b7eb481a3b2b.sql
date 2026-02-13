
-- Track individual lesson completions
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson progress"
  ON public.lesson_progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own lesson progress"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own lesson progress"
  ON public.lesson_progress FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Teachers can view school lesson progress"
  ON public.lesson_progress FOR SELECT
  USING (has_role(auth.uid(), 'teacher'::app_role));

-- Function to auto-update module progress when a lesson is completed
CREATE OR REPLACE FUNCTION public.update_module_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  total_lessons INT;
  completed_lessons INT;
  new_percentage INT;
BEGIN
  SELECT COUNT(*) INTO total_lessons FROM lessons WHERE module_id = NEW.module_id;
  SELECT COUNT(*) INTO completed_lessons FROM lesson_progress WHERE user_id = NEW.user_id AND module_id = NEW.module_id;

  new_percentage := CASE WHEN total_lessons > 0 THEN ROUND((completed_lessons::NUMERIC / total_lessons) * 100) ELSE 0 END;

  INSERT INTO progress (user_id, module_id, completion_percentage, score)
  VALUES (NEW.user_id, NEW.module_id, new_percentage, 0)
  ON CONFLICT (user_id, module_id)
  DO UPDATE SET completion_percentage = new_percentage, updated_at = now();

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_lesson_completed
  AFTER INSERT ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_module_progress();

-- Add unique constraint on progress for upsert
ALTER TABLE public.progress ADD CONSTRAINT progress_user_module_unique UNIQUE (user_id, module_id);
