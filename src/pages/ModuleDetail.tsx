import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, Star, Lock, Play, FileText, Glasses, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Layout } from "@/components/Layout";
import { useModuleDetail } from "@/hooks/useModuleDetail";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

const contentIcons: Record<string, any> = { video: Play, AR: Glasses, pdf: FileText };

export default function ModuleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { mod, lessons: moduleLessons, quizCount, loading } = useModuleDetail(id);
  const { completedLessonIds, toggleLesson } = useLessonProgress(id);
  const { progress: allProgress } = useUserProgress();
  const progress = allProgress.find((p) => p.module_id === id);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        </div>
      </Layout>
    );
  }

  if (!mod) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">Module introuvable</p>
          <Link to="/catalogue"><Button variant="outline" className="mt-4">Retour au catalogue</Button></Link>
        </div>
      </Layout>
    );
  }

  const completionPct = moduleLessons.length > 0
    ? Math.round((completedLessonIds.size / moduleLessons.length) * 100)
    : (progress?.completion_percentage ?? 0);

  return (
    <Layout>
      {/* Header */}
      <div className="gradient-hero py-16">
        <div className="container mx-auto px-4">
          <Link to="/catalogue" className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour au catalogue
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">{mod.category}</Badge>
              <Badge variant="outline" className="text-xs border-primary-foreground/20 text-primary-foreground/70">{mod.level}</Badge>
              {mod.is_premium && (
                <Badge className="bg-premium text-premium-foreground border-0 text-xs gap-1">
                  <Lock className="w-3 h-3" /> Premium
                </Badge>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">{mod.title}</h1>
            <p className="text-primary-foreground/70 mb-6">{mod.description}</p>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {mod.duration}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {mod.students} étudiants</span>
              <span className="flex items-center gap-1 text-warning"><Star className="w-4 h-4 fill-current" /> {mod.rating}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lessons */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            {user && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-card-foreground">Votre progression</h3>
                  <span className="text-sm font-medium text-primary">{completionPct}%</span>
                </div>
                <Progress value={completionPct} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {completedLessonIds.size}/{moduleLessons.length} leçons complétées
                  {progress?.score ? ` · Score : ${progress.score}/100` : ""}
                </p>
              </motion.div>
            )}

            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Contenu du module</h2>
              <div className="space-y-2">
                {moduleLessons.map((lesson, i) => {
                  const Icon = contentIcons[lesson.content_type] || Play;
                  const completed = completedLessonIds.has(lesson.id);
                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
                        completed ? "bg-success/5 border-success/20" : "bg-card border-border hover:border-primary/30"
                      }`}
                      onClick={() => user && toggleLesson(lesson.id)}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${completed ? "bg-success/10" : "bg-secondary"}`}>
                        {completed ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Icon className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-card-foreground">{lesson.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-[10px] px-1.5">{lesson.content_type.toUpperCase()}</Badge>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        </div>
                      </div>
                      {user && (
                        <span className="text-xs text-muted-foreground">
                          {completed ? "Terminé ✓" : "Marquer terminé"}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quiz preview */}
            {quizCount > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-4">Quiz ({quizCount} questions)</h2>
                <Link to={`/module/${id}/quiz`}>
                  <Button className="gradient-primary border-0 text-primary-foreground shadow-button gap-2">
                    Lancer le quiz <Play className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-6 shadow-card sticky top-24">
              {mod.is_premium ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-premium" />
                    <span className="font-display font-semibold text-card-foreground">Module Premium</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Abonnez-vous pour débloquer ce module et tous les contenus premium.</p>
                  <Link to="/abonnement">
                    <Button className="w-full gradient-primary border-0 text-primary-foreground shadow-button">
                      Voir les abonnements
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">Ce module est gratuit. Commencez dès maintenant !</p>
                  <Button className="w-full gradient-primary border-0 text-primary-foreground shadow-button">
                    Commencer le module
                  </Button>
                </>
              )}

              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Leçons</span><span className="font-medium text-card-foreground">{moduleLessons.length}</span></div>
                <div className="flex justify-between"><span>Durée totale</span><span className="font-medium text-card-foreground">{mod.duration}</span></div>
                <div className="flex justify-between"><span>Niveau</span><span className="font-medium text-card-foreground">{mod.level}</span></div>
                <div className="flex justify-between"><span>Certificat</span><span className="font-medium text-card-foreground">Oui</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
