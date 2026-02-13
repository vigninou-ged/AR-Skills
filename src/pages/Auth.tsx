import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Glasses, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get("mode") === "register";
  const [mode, setMode] = useState<"login" | "register">(isRegister ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "register") {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Compte créé !", description: "Vérifiez votre email pour confirmer votre inscription." });
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        navigate("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Glasses className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {mode === "login" ? "Bon retour !" : "Créer un compte"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "Connectez-vous pour continuer" : "Rejoignez AR Skills aujourd'hui"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-5">
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" placeholder="Thomas Dupont" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="thomas@email.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full gradient-primary border-0 text-primary-foreground shadow-button gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {mode === "login" ? "Se connecter" : "Créer mon compte"} {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-primary font-medium hover:underline"
              >
                {mode === "login" ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
