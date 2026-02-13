import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Target, TrendingUp, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Layout } from "@/components/Layout";
import { useModules } from "@/hooks/useModules";
import { useUserProgress } from "@/hooks/useUserProgress";

const stats = [
  { label: "Modules en cours", value: "2", icon: BookOpen, color: "gradient-primary" },
  { label: "Modules terminés", value: "1", icon: CheckCircle2, color: "gradient-accent" },
  { label: "Score moyen", value: "82%", icon: Target, color: "gradient-primary" },
  { label: "Heures apprises", value: "18h", icon: TrendingUp, color: "gradient-accent" },
];

export default function Dashboard() {
  const { modules } = useModules();
  const { progress } = useUserProgress();

  const enrolledModules = progress.map((p) => {
    const mod = modules.find((m) => m.id === p.module_id);
    return { ...p, module: mod };
  }).filter((p) => p.module);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Bonjour, Thomas 👋</h1>
          <p className="text-muted-foreground mt-1">Continuez votre apprentissage là où vous vous êtes arrêté.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-xl p-5 shadow-card"
            >
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="font-display text-2xl font-bold text-card-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* In Progress */}
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Modules en cours</h2>
          {enrolledModules.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-10 text-center shadow-card">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Vous n'avez pas encore commencé de module.</p>
              <Link to="/catalogue"><Button className="gradient-primary border-0 text-primary-foreground shadow-button">Explorer le catalogue</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrolledModules.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-card-foreground truncate">{item.module!.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.module!.category} · {item.module!.level}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{item.completion_percentage}%</p>
                        <p className="text-xs text-muted-foreground">Score: {item.score}</p>
                      </div>
                      <Link to={`/module/${item.module_id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Play className="w-3.5 h-3.5" /> Reprendre
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Progress value={item.completion_percentage} className="h-1.5 mt-3" />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Recommandé pour vous</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {modules.filter((m) => !progress.find((p) => p.module_id === m.id)).slice(0, 2).map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/module/${mod.id}`} className="flex gap-4 bg-card border border-border rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Trophy className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-card-foreground group-hover:text-primary transition-colors text-sm">{mod.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{mod.category} · {mod.duration} · {mod.level}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
