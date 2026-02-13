import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useLessonProgress(moduleId: string | undefined) {
  const { user } = useAuth();
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !moduleId) {
      setCompletedLessonIds(new Set());
      setLoading(false);
      return;
    }

    const fetch = async () => {
      const { data } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("module_id", moduleId);

      setCompletedLessonIds(new Set((data ?? []).map((d) => d.lesson_id)));
      setLoading(false);
    };

    fetch();

    // Realtime subscription
    const channel = supabase
      .channel(`lesson-progress-${moduleId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lesson_progress",
          filter: `module_id=eq.${moduleId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT" && (payload.new as any).user_id === user.id) {
            setCompletedLessonIds((prev) => new Set([...prev, (payload.new as any).lesson_id]));
          }
          if (payload.eventType === "DELETE" && (payload.old as any).user_id === user.id) {
            setCompletedLessonIds((prev) => {
              const next = new Set(prev);
              next.delete((payload.old as any).lesson_id);
              return next;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, moduleId]);

  const toggleLesson = useCallback(
    async (lessonId: string) => {
      if (!user?.id || !moduleId) return;

      if (completedLessonIds.has(lessonId)) {
        // Uncomplete
        await supabase
          .from("lesson_progress")
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId);
        setCompletedLessonIds((prev) => {
          const next = new Set(prev);
          next.delete(lessonId);
          return next;
        });
      } else {
        // Complete
        await supabase.from("lesson_progress").insert({
          user_id: user.id,
          lesson_id: lessonId,
          module_id: moduleId,
        });
        setCompletedLessonIds((prev) => new Set([...prev, lessonId]));
      }
    },
    [user?.id, moduleId, completedLessonIds]
  );

  return { completedLessonIds, loading, toggleLesson };
}
