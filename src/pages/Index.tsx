import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Glasses, BookOpen, Trophy, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { ModuleCard } from "@/components/ModuleCard";
import { modules, categories } from "@/data/mockData";
import heroImage from "@/assets/hero-ar.jpg";

const features = [
  { icon: Glasses, title: "Réalité Augmentée", desc: "Pratiquez sur des équipements virtuels avec des overlays AR interactifs." },
  { icon: BookOpen, title: "Modules Certifiants", desc: "Progressez à votre rythme avec des parcours structurés et validés." },
  { icon: Trophy, title: "Quiz & Scores", desc: "Évaluez vos compétences et suivez votre progression en temps réel." },
  { icon: Shield, title: "Adapté Pros", desc: "Contenu aligné sur les normes professionnelles et certifications." },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 opacity-30">
          <img src={heroImage} alt="AR Skills Hero" className="w-full h-full object-cover" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground/90 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary/30">
              <Glasses className="w-4 h-4" /> Plateforme AR Éducative
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Apprenez les métiers techniques avec la{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-accent)" }}>
                réalité augmentée
              </span>
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg">
              Plomberie, électricité, mécanique — pratiquez avec des simulations AR immersives et obtenez vos certifications.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth?mode=register">
                <Button size="lg" className="gradient-primary border-0 text-primary-foreground shadow-button gap-2 text-base">
                  Commencer gratuitement <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/catalogue">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-base">
                  Voir le catalogue
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">Pourquoi AR Skills ?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Une plateforme complète pour apprendre les métiers techniques de demain.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-card-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Métiers disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/catalogue?category=${cat.name}`}
                  className="bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col items-center gap-3 group"
                >
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="font-display font-semibold text-card-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.count} modules</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular modules */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">Modules populaires</h2>
          <Link to="/catalogue" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.slice(0, 3).map((m, i) => (
            <ModuleCard key={m.id} module={m} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Prêt à développer vos compétences ?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
              Rejoignez des milliers d'apprenants et accédez à nos modules AR dès aujourd'hui.
            </p>
            <Link to="/auth?mode=register">
              <Button size="lg" className="gradient-primary border-0 text-primary-foreground shadow-button gap-2">
                Créer mon compte <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
