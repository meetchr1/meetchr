import { createClient } from "@/lib/supabase/server";
import { formDataToDbRow } from "@/lib/types/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to submit a survey." },
        { status: 401 }
      );
    }

    // Parse the form data from the request body
    const formData = await request.json();

    // Validate that role is provided
    const roleLower = formData.role?.toLowerCase() || "";
    if (!roleLower.startsWith("mentor") && !roleLower.startsWith("novice")) {
      return NextResponse.json(
        { error: 'Role must be either "mentor" or "novice".' },
        { status: 400 }
      );
    }

    // Convert camelCase form data to snake_case DB row
    const dbRow = formDataToDbRow(formData, user.id);

    // Insert survey response (upsert to allow re-submission)
    const { error: surveyError } = await supabase
      .from("survey_responses")
      .upsert(dbRow, { onConflict: "user_id" });

    if (surveyError) {
      console.error("Survey insert error:", surveyError);
      return NextResponse.json(
        {
          error: `Failed to save survey response: ${surveyError.message}`,
          code: surveyError.code,
          details: surveyError.details,
        },
        { status: 500 }
      );
    }

    // Mark the user's profile as having completed the survey
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ survey_completed: true })
      .eq("id", user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
      return NextResponse.json(
        {
          error: `Failed to update profile: ${profileError.message}`,
          code: profileError.code,
          details: profileError.details,
        },
        { status: 500 }
      );
    }

    // Attempt to find a match using the Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    try {
      const matchResponse = await fetch(
        `${supabaseUrl}/functions/v1/match-teacher`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ user_id: user.id }),
        }
      );

      const matchResult = await matchResponse.json();

      return NextResponse.json({
        success: true,
        message: matchResult?.success
          ? "Survey saved and you have been matched!"
          : "Survey saved! You will be matched when a compatible teacher completes their survey.",
        match: matchResult,
      });
    } catch (matchError) {
      console.error("Matching error:", matchError);
      // Survey was saved successfully even if matching fails
      return NextResponse.json({
        success: true,
        message:
          "Survey saved! Matching is temporarily unavailable. You will be matched soon.",
        match: null,
      });
    }
  } catch (error) {
    console.error("Survey API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
