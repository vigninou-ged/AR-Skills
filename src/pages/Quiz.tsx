import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { quizQuestions, modules } from "@/data/mockData";

export default function Quiz() {
  const { id } = useParams();
  const mod = modules.find((m) => m.id === id);
  const questions = quizQuestions.filter((q) => q.module_id === id);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);

  if (!mod || questions.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Aucun quiz disponible pour ce module.</p>
          <Link to={`/module/${id}`}><Button variant="outline" className="mt-4">Retour au module</Button></Link>
        </div>
      </Layout>
    );
  }

  const q = questions[current];
  const isCorrect = selected === q.correct_answer;
  const answered = selected !== null;

  const handleNext = () => {
    setAnswers([...answers, selected]);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const score = [...answers, selected].filter((a, i) => a === questions[i]?.correct_answer).length;

  if (showResult) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-md">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-foreground font-display text-2xl font-bold">{Math.round((score / questions.length) * 100)}%</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Quiz terminé !</h1>
            <p className="text-muted-foreground mb-6">{score}/{questions.length} réponses correctes</p>
            <div className="flex gap-3 justify-center">
              <Link to={`/module/${id}`}><Button variant="outline">Retour au module</Button></Link>
              <Link to="/dashboard"><Button className="gradient-primary border-0 text-primary-foreground shadow-button">Dashboard</Button></Link>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Link to={`/module/${id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour au module
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-xl font-bold text-foreground">Quiz : {mod.title}</h1>
          <span className="text-sm text-muted-foreground">{current + 1}/{questions.length}</span>
        </div>

        <div className="w-full bg-secondary rounded-full h-1.5 mb-8">
          <div className="h-1.5 rounded-full gradient-primary transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-6">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let style = "bg-card border-border hover:border-primary/40";
                if (answered) {
                  if (i === q.correct_answer) style = "bg-success/5 border-success";
                  else if (i === selected) style = "bg-destructive/5 border-destructive";
                }
                return (
                  <button
                    key={i}
                    onClick={() => !answered && setSelected(i)}
                    disabled={answered}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${style}`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-medium text-secondary-foreground shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm text-card-foreground">{opt}</span>
                    {answered && i === q.correct_answer && <CheckCircle2 className="w-5 h-5 text-success ml-auto" />}
                    {answered && i === selected && i !== q.correct_answer && <XCircle className="w-5 h-5 text-destructive ml-auto" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex justify-end">
                <Button onClick={handleNext} className="gradient-primary border-0 text-primary-foreground shadow-button gap-2">
                  {current + 1 < questions.length ? "Question suivante" : "Voir le résultat"} <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
}
