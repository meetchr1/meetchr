"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProductNav } from "@/app/components/ProductNav";

type DashboardAggregates = {
  heaviness_trends: Array<{ date: string; heaviness: string; count: number }>;
  top_help_categories: Array<{ category: string; count: number }>;
  course_enrollment_counts: Array<{ course: string; count: number }>;
  survey_completion: Array<{
    survey: string;
    responses: number;
    respondents: number;
  }>;
};

type LikertAggregates = Array<{
  survey: string;
  question_id: string;
  prompt: string;
  likert_value: number;
  count: number;
}>;

export default function AdminPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardAggregates | null>(null);
  const [likert, setLikert] = useState<LikertAggregates>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setError(null);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login?redirect=/admin");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        router.replace("/portal");
        return;
      }

      const [{ data: aggregates, error: aggError }, { data: likertData, error: likertError }] =
        await Promise.all([
          supabase.rpc("get_admin_dashboard_aggregates"),
          supabase.rpc("get_admin_survey_likert_aggregates"),
        ]);

      if (aggError || likertError) {
        setError(aggError?.message ?? likertError?.message ?? "Failed to load admin dashboard");
      } else {
        setData((aggregates ?? null) as DashboardAggregates | null);
        setLikert((likertData ?? []) as LikertAggregates);
      }

      if (active) {
        setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            Privacy-safe trends and aggregate outcomes only.
          </p>
          <ProductNav current="/admin" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!data ? null : (
          <>
            <section className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Heaviness trends (30d)</h2>
              <ul className="text-sm text-gray-700 space-y-1">
                {data.heaviness_trends.slice(0, 20).map((item, index) => (
                  <li key={`${item.date}-${item.heaviness}-${index}`}>
                    {item.date} - {item.heaviness}: {item.count}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Top help categories</h2>
              <ul className="text-sm text-gray-700 space-y-1">
                {data.top_help_categories.map((item) => (
                  <li key={item.category}>
                    {item.category}: {item.count}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Course enrollment counts</h2>
              <ul className="text-sm text-gray-700 space-y-1">
                {data.course_enrollment_counts.map((item) => (
                  <li key={item.course}>
                    {item.course}: {item.count}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Survey completion</h2>
              <ul className="text-sm text-gray-700 space-y-1">
                {data.survey_completion.map((item) => (
                  <li key={item.survey}>
                    {item.survey}: {item.respondents} respondents ({item.responses} responses)
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Survey likert aggregates (no free-text)
              </h2>
              <ul className="text-sm text-gray-700 space-y-1">
                {likert.slice(0, 40).map((item, index) => (
                  <li key={`${item.question_id}-${item.likert_value}-${index}`}>
                    {item.survey} - {item.prompt} - {item.likert_value}: {item.count}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
