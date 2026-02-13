import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">AR</span>
            </div>
            AR Skills
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/catalogue" className="hover:text-foreground transition-colors">Catalogue</Link>
            <Link to="/abonnement" className="hover:text-foreground transition-colors">Tarifs</Link>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 AR Skills. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
