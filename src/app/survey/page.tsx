"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Survey } from "@/app/components/Survey";
import { Loader2 } from "lucide-react";

export default function SurveyPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSurveyStatus = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          // No auth — show survey in demo mode
          setChecking(false);
          return;
        }

        // Check if survey is already completed
        const { data: profile } = await supabase
          .from("profiles")
          .select("survey_completed")
          .eq("id", user.id)
          .single();

        if (profile?.survey_completed) {
          router.push("/portal");
          return;
        }

        setChecking(false);
      } catch {
        // Supabase unavailable — show survey in demo mode
        setChecking(false);
      }
    };

    checkSurveyStatus();
  }, [router]);

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
        router.push("/portal");
        router.refresh();
      }}
    />
  );
}
