import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      if (!user?.id) {
        setProgress([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setProgress(
          data.map((p) => ({
            id: p.id,
            user_id: p.user_id,
            module_id: p.module_id,
            completion_percentage: p.completion_percentage,
            score: p.score,
          }))
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load progress");
        setProgress([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user?.id]);

  return { progress, loading, error };
}
