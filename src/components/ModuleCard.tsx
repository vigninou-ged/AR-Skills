import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, Star, Lock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Module } from "@/data/mockData";

const categoryColors: Record<string, string> = {
  "Plomberie": "bg-primary/10 text-primary",
  "Électricité": "bg-warning/10 text-warning",
  "Mécanique": "bg-accent/10 text-accent",
  "Soudure": "bg-destructive/10 text-destructive",
};

export function ModuleCard({ module, index = 0 }: { module: Module; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link to={`/module/${module.id}`} className="block group">
        <div className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
          {/* Thumbnail placeholder */}
          <div className="relative h-40 bg-secondary overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-12 h-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
            </div>
            {module.is_premium && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-premium text-premium-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
                <Lock className="w-3 h-3" /> Premium
              </div>
            )}
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className={`${categoryColors[module.category] || "bg-secondary text-secondary-foreground"} border-0 text-xs`}>
                {module.category}
              </Badge>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <h3 className="font-display font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
              {module.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{module.description}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {module.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {module.students}</span>
              </div>
              <span className="flex items-center gap-1 text-warning">
                <Star className="w-3.5 h-3.5 fill-current" /> {module.rating}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Badge variant="outline" className="text-xs">{module.level}</Badge>
              <span className="text-xs text-muted-foreground">{module.lessons_count} leçons</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
