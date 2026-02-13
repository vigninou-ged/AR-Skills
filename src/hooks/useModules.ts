import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Module } from "@/data/mockData";

export function useModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModules() {
      try {
        const { data, error } = await supabase
          .from("modules")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setModules(
          data.map((m) => ({
            id: m.id,
            title: m.title,
            category: m.category,
            level: m.level as "Débutant" | "Intermédiaire" | "Avancé",
            description: m.description,
            is_premium: m.is_premium,
            thumbnail_url: m.thumbnail_url || "",
            lessons_count: m.lessons_count,
            duration: m.duration || "",
            rating: m.rating || 0,
            students: m.students || 0,
          }))
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load modules");
        setModules([]);
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, []);

  return { modules, loading, error };
}
