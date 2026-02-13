import { motion } from "framer-motion";
import { Check, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

const plans = [
  {
    name: "Individual",
    price: "14,99€",
    period: "/mois",
    icon: Zap,
    desc: "Accès complet pour un apprenant",
    features: ["Tous les modules premium", "Quiz illimités", "Certificats de compétence", "Assistant IA pédagogique", "Suivi de progression avancé"],
    cta: "Commencer l'essai gratuit",
    popular: true,
  },
  {
    name: "School",
    price: "9,99€",
    period: "/élève/mois",
    icon: Building2,
    desc: "Pour les établissements et écoles",
    features: ["Tout du plan Individual", "Dashboard enseignant", "Gestion des élèves", "Rapports de progression", "Support prioritaire", "Facturation centralisée"],
    cta: "Contacter les ventes",
    popular: false,
  },
];

export default function Abonnement() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Tarifs simples et transparents</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Débloquez tous les modules premium et accélérez votre apprentissage.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`relative bg-card rounded-2xl border p-8 shadow-card ${
                plan.popular ? "border-primary shadow-card-hover" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                  Populaire
                </div>
              )}
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <plan.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold text-card-foreground">{plan.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-card-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-card-foreground">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "gradient-primary border-0 text-primary-foreground shadow-button"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
