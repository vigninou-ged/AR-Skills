import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Module, Lesson, QuizQuestion } from "@/data/mockData";

export function useModuleDetail(moduleId: string | undefined) {
  const [mod, setMod] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizCount, setQuizCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleId) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      const [modRes, lessonsRes, quizRes] = await Promise.all([
        supabase.from("modules").select("*").eq("id", moduleId).single(),
        supabase.from("lessons").select("*").eq("module_id", moduleId).order("order_index"),
        supabase.from("quiz_questions").select("id").eq("module_id", moduleId),
      ]);

      if (modRes.data) {
        setMod({
          id: modRes.data.id,
          title: modRes.data.title,
          category: modRes.data.category,
          level: modRes.data.level as Module["level"],
          description: modRes.data.description,
          is_premium: modRes.data.is_premium,
          thumbnail_url: modRes.data.thumbnail_url ?? "",
          lessons_count: modRes.data.lessons_count,
          duration: modRes.data.duration ?? "",
          rating: modRes.data.rating ?? 0,
          students: modRes.data.students ?? 0,
        });
      }

      if (lessonsRes.data) {
        setLessons(
          lessonsRes.data.map((l) => ({
            id: l.id,
            module_id: l.module_id,
            title: l.title,
            content_type: l.content_type as Lesson["content_type"],
            content_url: l.content_url ?? "",
            order_index: l.order_index,
            duration: l.duration ?? "",
          }))
        );
      }

      setQuizCount(quizRes.data?.length ?? 0);
      setLoading(false);
    };

    fetch();
  }, [moduleId]);

  return { mod, lessons, quizCount, loading };
}
