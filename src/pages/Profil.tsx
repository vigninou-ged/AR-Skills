import { motion } from "framer-motion";
import { User, Mail, School, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";

export default function Profil() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Mon profil</h1>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-card-foreground">Thomas Dupont</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">Étudiant</Badge>
                <Badge className="bg-premium text-premium-foreground border-0 text-xs">Premium</Badge>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input defaultValue="Thomas Dupont" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input defaultValue="thomas@email.com" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>École</Label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input defaultValue="Lycée Technique Paris" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Membre depuis</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input defaultValue="Janvier 2026" className="pl-10" disabled />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { label: "Modules complétés", value: "1" },
              { label: "Score moyen", value: "82%" },
              { label: "Certificats", value: "1" },
            ].map((s) => (
              <div key={s.label} className="bg-secondary rounded-xl p-4 text-center">
                <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button className="gradient-primary border-0 text-primary-foreground shadow-button">Sauvegarder</Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
