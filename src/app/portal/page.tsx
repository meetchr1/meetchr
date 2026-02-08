"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Portal } from "@/app/components/Portal";
import { Loader2 } from "lucide-react";

interface PortalData {
  userName: string;
  partnerName: string;
  userType: "novice" | "veteran";
  isMatched: boolean;
}

export default function PortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [portalData, setPortalData] = useState<PortalData | null>(null);

  useEffect(() => {
    const loadPortalData = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          // No auth available — fall back to demo mode
          setPortalData({
            userName: "Sarah",
            partnerName: "Ms. Rodriguez",
            userType: "novice",
            isMatched: true,
          });
          setLoading(false);
          return;
        }

        // Fetch user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, survey_completed, matched")
          .eq("id", user.id)
          .single();

        if (!profile?.survey_completed) {
          router.push("/survey");
          return;
        }

        const userName = profile.full_name || user.email?.split("@")[0] || "Teacher";

        // Fetch user's survey response for role
        const { data: survey } = await supabase
          .from("survey_responses")
          .select("role")
          .eq("user_id", user.id)
          .single();

        const userType: "novice" | "veteran" = survey?.role === "mentor" ? "veteran" : "novice";

        // Check if user has an active match
        let partnerName = "";
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
            const partnerId = match.mentor_id === user.id ? match.novice_id : match.mentor_id;

            const { data: partnerProfile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", partnerId)
              .single();

            partnerName = partnerProfile?.full_name || "Your Partner";
          }
        }

        setPortalData({
          userName,
          partnerName,
          userType,
          isMatched,
        });
      } catch {
        // Supabase connection failed — fall back to demo mode
        setPortalData({
          userName: "Sarah",
          partnerName: "Ms. Rodriguez",
          userType: "novice",
          isMatched: true,
        });
      }
      setLoading(false);
    };

    loadPortalData();
  }, [router]);

  if (loading || !portalData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-coral-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your portal...</p>
        </div>
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
