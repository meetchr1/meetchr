// Supabase Edge Function: match-teacher
// Implements Big Five (OCEAN) weighted matching algorithm from the Question Weighting spreadsheet.
//
// Deploy with: supabase functions deploy match-teacher

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SurveyRow {
  user_id: string;
  role: string;
  // Logistics
  grade_level: string | null;
  elementary_grade_level: string | null;
  subject_area: string | null;
  district_environment: string | null;
  // Personality (Q10-Q41 stored as snake_case)
  desk_situation: string | null;
  lesson_planning_style: string | null;
  classroom_management: string | null;
  superpower: string | null;
  bad_day_protocol: string | null;
  feedback_style: string | null;
  goal: string | null;
  communication_style: string | null;
  teacher_archetype: string | null;
  professional_boundaries: string | null;
  introvert_extrovert: string | null;
  morning_energy: string | null;
  red_flag: string | null;
  conflict_style: string | null;
  student_advocacy: string | null;
  standards_change: string | null;
  sunday_funday: string | null;
  grading_marathon: string | null;
  admin_alert: string | null;
  meeting_vibe: string | null;
  summer_fun: string | null;
  respect_check: string | null;
  pivot_potential: string | null;
  lightbulb_moment: string | null;
  standardized_struggle: string | null;
  rule_follower: string | null;
  social_battery: string | null;
  master_of_messiness: string | null;
  pd_preference: string | null;
  grouping_game: string | null;
  failed_test_funk: string | null;
  pop_in_panic: string | null;
}

type TraitName = "openness" | "conscientiousness" | "extroversion" | "agreeableness" | "neuroticism";

interface TraitQuestion {
  column: keyof SurveyRow;
  weight: number;
  /** Score for each answer value. Keys are the DB-stored answer strings. */
  scores: Record<string, number>;
}

interface TraitVector {
  openness: number;
  conscientiousness: number;
  extroversion: number;
  agreeableness: number;
  neuroticism: number;
}

// ─── Answer-value → A/B/C mapping ────────────────────────────────────────────
// Each question's stored DB values mapped to their spreadsheet position (A, B, C).
// Values from the Survey.tsx updateFormData() calls.

const ANSWER_POSITION: Record<string, Record<string, "A" | "B" | "C">> = {
  desk_situation:          { pristine: "A", chaotic: "B" },
  lesson_planning_style:   { detailed: "A", flexible: "B" },
  classroom_management:    { silence: "A", chaos: "B" },
  superpower:              { patience: "A", speed: "B", whisperer: "C" },
  bad_day_protocol:        { "action-plan": "A", vent: "B", humor: "C" },
  feedback_style:          { direct: "A", encouraging: "B" },
  goal:                    { "workplace-bestie": "A", "strategic-coach": "B" },
  communication_style:     { "quick-texts": "A", "scheduled-calls": "B" },
  teacher_archetype:       { "traditional-pillar": "A", "creative-rebel": "B", "tech-innovator": "B" },
  professional_boundaries: { "work-at-school": "A", "grading-at-night": "B" },
  introvert_extrovert:     { introvert: "A", extrovert: "B" },
  morning_energy:          { "early-bird": "A", "just-in-time": "B" },
  red_flag:                { "unnecessary-meetings": "A", "disorganized-admin": "B", "lack-of-discipline": "C" },
  conflict_style:          { immediate: "A", process: "B" },
  student_advocacy:        { "strict-rules": "A", "flexible-grace": "B" },
  standards_change:        { "challenge-accepted": "A", frustration: "B" },
  sunday_funday:           { excited: "A", stressed: "B" },
  grading_marathon:        { machine: "A", philosopher: "B" },
  admin_alert:             { "roll-eyes": "A", worry: "B" },
  meeting_vibe:            { entertainer: "A", scribe: "B" },
  summer_fun:              { "already-planning": "A", "shut-off": "B" },
  respect_check:           { "logical-consequence": "A", sidebar: "B" },
  pivot_potential:         { "scrap-and-try": "A", "save-for-later": "B" },
  lightbulb_moment:        { "explain-again": "A", "hands-on": "B" },
  standardized_struggle:   { "necessary-metric": "A", "stressful-hurdle": "B" },
  rule_follower:           { "ignore-it": "A", "follow-rules": "B" },
  social_battery:          { drained: "A", energized: "B" },
  master_of_messiness:     { "creative-learning": "A", distraction: "B" },
  pd_preference:           { "formal-workshop": "A", "beach-books": "B" },
  grouping_game:           { "by-data": "A", "by-vibe": "B" },
  failed_test_funk:        { "review-teaching": "A", "rough-week": "B" },
  pop_in_panic:            { "show-off": "A", nightmare: "B" },
};

// Helper: get the numeric score for a question given a DB answer value
function answerScore(column: string, dbValue: string | null, posScores: Record<string, number>): number {
  if (!dbValue) return 0;
  const pos = ANSWER_POSITION[column]?.[dbValue];
  if (!pos) return 0;
  return posScores[pos] ?? 0;
}

// ─── Big Five trait definitions (from Question Weighting.xlsx) ────────────────
// Each entry: { column, weight, scores: { A: n, B: n, C?: n } }

function makeTraitQ(
  column: keyof SurveyRow,
  weight: number,
  a: number,
  b: number,
  c: number = 0,
): TraitQuestion {
  return { column, weight, scores: { A: a, B: b, C: c } };
}

const OPENNESS: TraitQuestion[] = [
  makeTraitQ("teacher_archetype",      12,   -1,  1),
  makeTraitQ("student_advocacy",        6.5, -1,  1),
  makeTraitQ("superpower",             12,    1,  0,  0),
  makeTraitQ("standardized_struggle",  10.5,  0,  1),
  makeTraitQ("standards_change",       10.5,  1, -1),
  makeTraitQ("lightbulb_moment",        8,    0,  1),
  makeTraitQ("pivot_potential",         8,    1, -1),
  makeTraitQ("pop_in_panic",            8,    1,  0),
  makeTraitQ("rule_follower",           8,    1, -1),
  makeTraitQ("professional_boundaries", 5,    0,  1),
  makeTraitQ("summer_fun",              6.5,  1, -1),
  makeTraitQ("sunday_funday",           5,    1,  0),
];

const CONSCIENTIOUSNESS: TraitQuestion[] = [
  makeTraitQ("grouping_game",          8,     1,  0),
  makeTraitQ("failed_test_funk",       8,     1,  0),
  makeTraitQ("pd_preference",          7,     1, -1),
  makeTraitQ("communication_style",    7,     0,  1),
  makeTraitQ("lesson_planning_style",  7,     1, -1),
  makeTraitQ("grading_marathon",       7,     1,  0),
  makeTraitQ("standards_change",       7,     0,  1),
  makeTraitQ("desk_situation",         6,     1, -1),
  makeTraitQ("master_of_messiness",    6,    -1,  1),
  makeTraitQ("superpower",            6,     0,  1,  0),
  makeTraitQ("red_flag",              6,     0,  1,  0),
  makeTraitQ("meeting_vibe",          6,    -1,  1),
  makeTraitQ("rule_follower",         5,     0,  1),
  makeTraitQ("bad_day_protocol",      3.75,  1,  0,  0),
  makeTraitQ("standardized_struggle", 3.75,  1,  0),
  makeTraitQ("admin_alert",           3.75,  1,  0),
  makeTraitQ("teacher_archetype",     2.75,  1,  0),
];

const EXTROVERSION: TraitQuestion[] = [
  makeTraitQ("introvert_extrovert",   15,   -1,  1),
  makeTraitQ("social_battery",        13.5, -1,  1),
  makeTraitQ("conflict_style",        12,    1, -1),
  makeTraitQ("meeting_vibe",          12,    1,  0),
  makeTraitQ("bad_day_protocol",       9.1,  0,  1,  0),
  makeTraitQ("pop_in_panic",          11.1,  1,  0),
  makeTraitQ("communication_style",    8.1,  1,  1),
  makeTraitQ("goal",                  11.1,  1,  0),
  makeTraitQ("classroom_management",   8.1,  0,  1),
];

const AGREEABLENESS: TraitQuestion[] = [
  makeTraitQ("conflict_style",         7.5,  1,  1),
  makeTraitQ("grouping_game",          8,    0,  1),
  makeTraitQ("introvert_extrovert",    8,    0,  1),
  makeTraitQ("classroom_management",  10,    0,  1),
  makeTraitQ("failed_test_funk",      12,    0,  1),
  makeTraitQ("goal",                  10,    1,  0),
  makeTraitQ("respect_check",         11,   -1,  1),
  makeTraitQ("superpower",            10.5,  0,  0,  1),
  makeTraitQ("feedback_style",        12,    0,  1),
  makeTraitQ("student_advocacy",      11,   -1,  1),
];

const NEUROTICISM: TraitQuestion[] = [
  makeTraitQ("standards_change",      11.1, -1,  1),
  makeTraitQ("sunday_funday",         11.1, -1,  1),
  makeTraitQ("conflict_style",        9.35,  0,  1),
  makeTraitQ("bad_day_protocol",      9.45,  0,  1,  1),
  makeTraitQ("grading_marathon",      9.35,  0,  1),
  makeTraitQ("classroom_management",  9.35,  1, -1),
  makeTraitQ("lesson_planning_style", 11.1,  1, -1),
  makeTraitQ("admin_alert",           14.1,  0,  1),
  makeTraitQ("pop_in_panic",          15.1, -1,  1),
];

const ALL_TRAITS: Record<TraitName, TraitQuestion[]> = {
  openness:            OPENNESS,
  conscientiousness:   CONSCIENTIOUSNESS,
  extroversion:        EXTROVERSION,
  agreeableness:       AGREEABLENESS,
  neuroticism:         NEUROTICISM,
};

// ─── Scoring engine ──────────────────────────────────────────────────────────

/** Compute the raw Big Five trait vector for a teacher's survey response. */
function computeTraitVector(survey: SurveyRow): TraitVector {
  const result: Record<string, number> = {};

  for (const [traitName, questions] of Object.entries(ALL_TRAITS)) {
    let score = 0;
    for (const q of questions) {
      const val = survey[q.column] as string | null;
      score += q.weight * answerScore(q.column as string, val, q.scores);
    }
    result[traitName] = score;
  }

  return result as unknown as TraitVector;
}

/** Compute min/max possible score for a trait (for normalization). */
function traitRange(questions: TraitQuestion[]): { min: number; max: number } {
  let min = 0;
  let max = 0;

  for (const q of questions) {
    const scoreValues = Object.values(q.scores);
    const lo = Math.min(...scoreValues);
    const hi = Math.max(...scoreValues);
    min += q.weight * lo;
    max += q.weight * hi;
  }

  return { min, max };
}

/** Normalize a raw trait score to 0–1 range. */
function normalize(raw: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (raw - min) / (max - min);
}

/** Compute trait ranges once for all traits. */
const TRAIT_RANGES: Record<TraitName, { min: number; max: number }> = {
  openness:          traitRange(OPENNESS),
  conscientiousness: traitRange(CONSCIENTIOUSNESS),
  extroversion:      traitRange(EXTROVERSION),
  agreeableness:     traitRange(AGREEABLENESS),
  neuroticism:       traitRange(NEUROTICISM),
};

/**
 * Compute the compatibility percentage between two teachers.
 *
 * Breakdown:
 *  - 70% from Big Five personality similarity (inverse of normalized distance)
 *  - 15% from grade-level match
 *  - 15% from subject-area match
 *
 * Returns a value from 0 to 100.
 */
function computeCompatibility(novice: SurveyRow, mentor: SurveyRow): {
  score: number;
  traitScores: { novice: TraitVector; mentor: TraitVector };
  breakdown: { personality: number; gradeLevel: number; subjectArea: number };
} {
  const noviceTraits = computeTraitVector(novice);
  const mentorTraits = computeTraitVector(mentor);

  // Normalize each trait to 0–1, then compute per-trait similarity
  const traitNames = Object.keys(ALL_TRAITS) as TraitName[];
  let totalSimilarity = 0;

  for (const t of traitNames) {
    const range = TRAIT_RANGES[t];
    const nNorm = normalize(noviceTraits[t], range.min, range.max);
    const mNorm = normalize(mentorTraits[t], range.min, range.max);
    // Per-trait similarity: 1 minus the absolute distance (both in 0–1)
    totalSimilarity += 1 - Math.abs(nNorm - mNorm);
  }

  // Average across 5 traits → 0–1
  const personalityScore = totalSimilarity / traitNames.length;

  // Grade-level match (0 or 1)
  let gradeLevelMatch = 0;
  if (novice.grade_level && mentor.grade_level) {
    if (novice.grade_level === mentor.grade_level) {
      gradeLevelMatch = 1;
      // Bonus for matching elementary sub-grade
      if (
        novice.grade_level === "Elementary" &&
        novice.elementary_grade_level &&
        mentor.elementary_grade_level &&
        novice.elementary_grade_level === mentor.elementary_grade_level
      ) {
        gradeLevelMatch = 1; // already 1, stays 1
      }
    }
  }

  // Subject-area match (0 or 1, case-insensitive)
  let subjectMatch = 0;
  if (novice.subject_area && mentor.subject_area) {
    if (novice.subject_area.toLowerCase().trim() === mentor.subject_area.toLowerCase().trim()) {
      subjectMatch = 1;
    }
  }

  // Weighted final score
  const personality = personalityScore * 70;
  const gradeLevel  = gradeLevelMatch * 15;
  const subjectArea = subjectMatch * 15;
  const finalScore  = Math.round((personality + gradeLevel + subjectArea) * 100) / 100;

  return {
    score: Math.min(finalScore, 100),
    traitScores: { novice: noviceTraits, mentor: mentorTraits },
    breakdown: {
      personality: Math.round(personality * 100) / 100,
      gradeLevel,
      subjectArea,
    },
  };
}

// ─── Edge Function handler ───────────────────────────────────────────────────

Deno.serve(async (req) => {
  // CORS headers for browser invocations
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ success: false, error: "user_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Create a Supabase client with the service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // ── 1. Check if user is already matched ──────────────────────────────
    const { data: existingMatch } = await supabase
      .from("matches")
      .select("*")
      .or(`mentor_id.eq.${user_id},novice_id.eq.${user_id}`)
      .in("status", ["pending", "active"])
      .maybeSingle();

    if (existingMatch) {
      return new Response(
        JSON.stringify({ success: false, error: "User already has an active match" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 2. Fetch the requesting teacher's survey ─────────────────────────
    const { data: userSurvey, error: userErr } = await supabase
      .from("survey_responses")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (userErr || !userSurvey) {
      return new Response(
        JSON.stringify({ success: false, error: "No survey response found for this user" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userRole = userSurvey.role; // "mentor" or "novice"
    const oppositeRole = userRole === "mentor" ? "novice" : "mentor";

    // ── 3. Fetch all available candidates (opposite role, unmatched) ─────
    const { data: candidates, error: candErr } = await supabase
      .from("survey_responses")
      .select("*")
      .eq("role", oppositeRole)
      .not("user_id", "eq", user_id);

    if (candErr || !candidates || candidates.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No available match found. You will be matched when a compatible teacher completes their survey.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Filter out candidates who already have an active match
    const { data: activeMatches } = await supabase
      .from("matches")
      .select("mentor_id, novice_id")
      .in("status", ["pending", "active"]);

    const matchedUserIds = new Set<string>();
    if (activeMatches) {
      for (const m of activeMatches) {
        matchedUserIds.add(m.mentor_id);
        matchedUserIds.add(m.novice_id);
      }
    }

    const availableCandidates = candidates.filter(
      (c: SurveyRow) => !matchedUserIds.has(c.user_id),
    );

    if (availableCandidates.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No available match found. You will be matched when a compatible teacher completes their survey.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 4. Score every candidate using the Big Five algorithm ────────────
    let bestCandidate: SurveyRow | null = null;
    let bestResult: ReturnType<typeof computeCompatibility> | null = null;

    for (const candidate of availableCandidates) {
      const result = computeCompatibility(userSurvey as SurveyRow, candidate as SurveyRow);
      if (!bestResult || result.score > bestResult.score) {
        bestResult = result;
        bestCandidate = candidate as SurveyRow;
      }
    }

    if (!bestCandidate || !bestResult) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No available match found. You will be matched when a compatible teacher completes their survey.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 5. Create the match row ──────────────────────────────────────────
    const mentorId = userRole === "mentor" ? user_id : bestCandidate.user_id;
    const noviceId = userRole === "novice" ? user_id : bestCandidate.user_id;

    const { data: matchRow, error: matchErr } = await supabase
      .from("matches")
      .insert({
        mentor_id: mentorId,
        novice_id: noviceId,
        compatibility_score: bestResult.score,
        status: "pending",
      })
      .select()
      .single();

    if (matchErr) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create match: " + matchErr.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 6. Mark both profiles as matched ─────────────────────────────────
    await supabase.from("profiles").update({ matched: true }).eq("id", user_id);
    await supabase.from("profiles").update({ matched: true }).eq("id", bestCandidate.user_id);

    // ── 7. Return the result ─────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        success: true,
        match_id: matchRow.id,
        matched_with: bestCandidate.user_id,
        compatibility_score: bestResult.score,
        breakdown: bestResult.breakdown,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
