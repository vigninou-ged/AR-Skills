import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, LayoutDashboard, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/catalogue", label: "Catalogue", icon: BookOpen },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profil", label: "Profil", icon: User },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">AR</span>
          </div>
          AR Skills
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{profile?.name || user.email}</span>
              <Button variant="outline" size="sm" className="gap-2" onClick={signOut}>
                <LogOut className="w-4 h-4" /> Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" /> Connexion
                </Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button size="sm" className="gradient-primary border-0 text-primary-foreground shadow-button">
                  S'inscrire
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 glass"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <link.icon className="w-4 h-4 text-muted-foreground" />
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                {user ? (
                  <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => { signOut(); setOpen(false); }}>
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </Button>
                ) : (
                  <>
                    <Link to="/auth" className="flex-1" onClick={() => setOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">Connexion</Button>
                    </Link>
                    <Link to="/auth?mode=register" className="flex-1" onClick={() => setOpen(false)}>
                      <Button size="sm" className="w-full gradient-primary border-0 text-primary-foreground">S'inscrire</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
