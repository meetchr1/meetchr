// Database types matching the Supabase schema

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  survey_completed: boolean;
  matched: boolean;
  created_at: string;
  updated_at: string;
}

export interface SurveyResponse {
  id: string;
  user_id: string;

  // Logistics
  district: string | null;
  school: string | null;
  role: "mentor" | "novice";
  grade_level: string | null;
  elementary_grade_level: string | null;
  subject_area: string | null;
  district_environment: string | null;
  district_size: string | null;
  title_1: string | null;
  time_commitment: string | null;

  // Personality & Methodology
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

  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  mentor_id: string;
  novice_id: string;
  compatibility_score: number;
  status: "pending" | "active" | "completed" | "cancelled";
  matched_at: string;
}

// Type for the matching function response
export interface MatchResult {
  success: boolean;
  match_id?: string;
  matched_with?: string;
  compatibility_score?: number;
  breakdown?: {
    personality: number;
    gradeLevel: number;
    subjectArea: number;
  };
  error?: string;
}

// Helper: Convert camelCase form data to snake_case for database
export function formDataToDbRow(
  formData: Record<string, string>,
  userId: string
): Omit<SurveyResponse, "id" | "created_at" | "updated_at"> {
  return {
    user_id: userId,
    district: formData.district || null,
    school: formData.school || null,
    role: formData.role?.toLowerCase().startsWith("mentor") ? "mentor" : "novice",
    grade_level: formData.gradeLevel || null,
    elementary_grade_level: formData.elementaryGradeLevel || null,
    subject_area: formData.subjectArea || null,
    district_environment: formData.districtEnvironment || null,
    district_size: formData.districtSize || null,
    title_1: formData.title1 || null,
    time_commitment: formData.timeCommitment || null,
    desk_situation: formData.deskSituation || null,
    lesson_planning_style: formData.lessonPlanningStyle || null,
    classroom_management: formData.classroomManagement || null,
    superpower: formData.superpower || null,
    bad_day_protocol: formData.badDayProtocol || null,
    feedback_style: formData.feedbackStyle || null,
    goal: formData.goal || null,
    communication_style: formData.communicationStyle || null,
    teacher_archetype: formData.teacherArchetype || null,
    professional_boundaries: formData.professionalBoundaries || null,
    introvert_extrovert: formData.introvertExtrovert || null,
    morning_energy: formData.morningEnergy || null,
    red_flag: formData.redFlag || null,
    conflict_style: formData.conflictStyle || null,
    student_advocacy: formData.studentAdvocacy || null,
    standards_change: formData.standardsChange || null,
    sunday_funday: formData.sundayFunday || null,
    grading_marathon: formData.gradingMarathon || null,
    admin_alert: formData.adminAlert || null,
    meeting_vibe: formData.meetingVibe || null,
    summer_fun: formData.summerFun || null,
    respect_check: formData.respectCheck || null,
    pivot_potential: formData.pivotPotential || null,
    lightbulb_moment: formData.lightbulbMoment || null,
    standardized_struggle: formData.standardizedStruggle || null,
    rule_follower: formData.ruleFollower || null,
    social_battery: formData.socialBattery || null,
    master_of_messiness: formData.masterOfMessiness || null,
    pd_preference: formData.pdPreference || null,
    grouping_game: formData.groupingGame || null,
    failed_test_funk: formData.failedTestFunk || null,
    pop_in_panic: formData.popInPanic || null,
  };
}
