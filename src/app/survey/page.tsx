"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Survey } from "@/app/components/Survey";
import { Loader2 } from "lucide-react";
import { safeAfterSurveyPath } from "@/lib/auth/matchingSurvey";

export default function SurveyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-coral-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SurveyPageContent />
    </Suspense>
  );
}

function SurveyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);
  const afterSurvey = safeAfterSurveyPath(
    searchParams.get("redirect"),
    "/portal"
  );

  useEffect(() => {
    const checkSurveyStatus = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setChecking(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("survey_completed")
          .eq("id", user.id)
          .single();

        if (profile?.survey_completed) {
          router.replace(afterSurvey);
          return;
        }

        setChecking(false);
      } catch {
        setChecking(false);
      }
    };

    void checkSurveyStatus();
  }, [router, afterSurvey]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-coral-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Survey
      onComplete={() => {
        router.push(afterSurvey);
        router.refresh();
      }}
    />
  );
}
