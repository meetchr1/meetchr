"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProductNav } from "@/app/components/ProductNav";

type Course = {
  id: string;
  title: string;
  description: string | null;
};

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
};

type Progress = {
  lesson_id: string;
  completed: boolean;
};

export default function AcademyPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<Map<string, boolean>>(new Map());

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login?redirect=/academy");
      return;
    }
    setUserId(user.id);

    const [{ data: courseRows }, { data: lessonRows }, { data: enrollRows }, { data: progressRows }] =
      await Promise.all([
        supabase.from("courses").select("id, title, description").order("title"),
        supabase.from("lessons").select("id, course_id, title, sort_order").order("sort_order"),
        supabase.from("enrollments").select("course_id").eq("user_id", user.id),
        supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user.id),
      ]);

    setCourses((courseRows ?? []) as Course[]);
    setLessons((lessonRows ?? []) as Lesson[]);
    setEnrolledIds(new Set((enrollRows ?? []).map((row) => row.course_id)));
    setProgress(
      new Map((progressRows ?? []).map((row) => [row.lesson_id, row.completed]))
    );
  }, [router, supabase]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await load();
      if (active) {
        setLoading(false);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [load]);

  const enroll = async (courseId: string) => {
    if (!userId) return;
    setBusy(true);
    setError(null);
    const { error: enrollError } = await supabase.from("enrollments").upsert(
      {
        user_id: userId,
        course_id: courseId,
      },
      { onConflict: "user_id,course_id" }
    );
    if (enrollError) {
      setError(enrollError.message);
    } else {
      await load();
    }
    setBusy(false);
  };

  const toggleLesson = async (lessonId: string, completed: boolean) => {
    if (!userId) return;
    setBusy(true);
    setError(null);
    const { error: progressError } = await supabase.from("lesson_progress").upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        completed: !completed,
        completed_at: !completed ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,lesson_id" }
    );
    if (progressError) {
      setError(progressError.message);
    } else {
      await load();
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Academy</h1>
          <p className="text-sm text-gray-600">
            Bite-sized courses you can complete between classes.
          </p>
          <ProductNav current="/academy" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {courses.map((course) => {
          const courseLessons = lessons.filter((lesson) => lesson.course_id === course.id);
          const enrolled = enrolledIds.has(course.id);
          return (
            <section key={course.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{course.title}</h2>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => enroll(course.id)}
                  disabled={busy}
                  className="px-3 py-2 text-sm rounded-lg border border-pink-300 text-pink-700 hover:bg-pink-50 disabled:opacity-50"
                >
                  {enrolled ? "Enrolled" : "Enroll"}
                </button>
              </div>

              {enrolled && (
                <ul className="space-y-2">
                  {courseLessons.map((lesson) => {
                    const done = Boolean(progress.get(lesson.id));
                    return (
                      <li key={lesson.id} className="flex items-center gap-2 text-sm text-gray-700">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => toggleLesson(lesson.id, done)}
                          />
                          <span>
                            {lesson.sort_order}. {lesson.title}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
