"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Portal } from "@/app/components/Portal";

type PortalData = {
  userName: string;
  partnerName: string;
  userType: "novice" | "veteran";
  isMatched: boolean;
};

export default function ClassicMentorshipSuitePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portalData, setPortalData] = useState<PortalData | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/login?redirect=/hub/classic");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, display_name, pseudonym, survey_completed, matched")
          .eq("id", user.id)
          .single();

        if (!profile?.survey_completed) {
          router.replace("/survey?redirect=/hub/classic");
          return;
        }

        const userName =
          profile.display_name ||
          profile.full_name ||
          profile.pseudonym ||
          user.email?.split("@")[0] ||
          "Teacher";

        const { data: survey } = await supabase
          .from("survey_responses")
          .select("role")
          .eq("user_id", user.id)
          .single();

        const userType: "novice" | "veteran" =
          survey?.role === "mentor" ? "veteran" : "novice";

        let partnerName = "Your Partner";
        let isMatched = false;

        if (profile.matched) {
          const { data: match } = await supabase
            .from("matches")
            .select("mentor_id, novice_id, status")
            .or(`mentor_id.eq.${user.id},novice_id.eq.${user.id}`)
            .in("status", ["pending", "active"])
            .limit(1)
            .single();

          if (match) {
            isMatched = true;
            const partnerId =
              match.mentor_id === user.id ? match.novice_id : match.mentor_id;

            const { data: partnerProfile } = await supabase
              .from("profiles")
              .select("full_name, display_name, pseudonym")
              .eq("id", partnerId)
              .single();

            partnerName =
              partnerProfile?.display_name ||
              partnerProfile?.full_name ||
              partnerProfile?.pseudonym ||
              "Your Partner";
          }
        }

        if (active) {
          setPortalData({ userName, partnerName, userType, isMatched });
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load suite.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
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

  if (error || !portalData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="text-sm text-red-600">{error ?? "Unable to open suite."}</p>
      </div>
    );
  }

  return (
    <Portal
      userType={portalData.userType}
      userName={portalData.userName}
      partnerName={portalData.partnerName}
      isMatched={portalData.isMatched}
    />
  );
}
