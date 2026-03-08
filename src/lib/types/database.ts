// Database types matching the Supabase schema
// Updated to include all feature tables from 002_add_feature_tables.sql

// ============================================================
// 1. PROFILES
// ============================================================
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  pseudonym: string | null;
  role: string | null;
  survey_completed: boolean;
  matched: boolean;
  // Extended fields (from 002 migration)
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  years_experience: number | null;
  teaching_focus: string[];
  availability: string | null;
  preferred_meeting_type: "video" | "chat" | "both";
  created_at: string;
  updated_at: string;
}

// ============================================================
// 2. SURVEY RESPONSES
// ============================================================
export interface SurveyResponse {
  id: string;
  user_id: string;

  // Logistics (Questions 1-9)
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

  // Personality & Methodology (Questions 10-41)
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

// ============================================================
// 3. MATCHES
// ============================================================
export interface Match {
  id: string;
  mentor_id: string;
  novice_id: string;
  compatibility_score: number;
  status: "pending" | "active" | "completed" | "cancelled";
  matched_at: string;
}

// ============================================================
// 4. CHECK-INS (Weekly Vibe Checks)
// ============================================================
export interface CheckIn {
  id: string;
  user_id: string;
  confidence: number;
  energy: number;
  note: string | null;
  week_of: string;
  created_at: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  date: string;
  heaviness: "light" | "manageable" | "heavy" | "not_ok";
  theme: "classroom" | "planning" | "parents" | "admin" | "self";
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  owner_id: string;
  provider: "ai" | "peer";
  status: string;
  last_message_at: string;
  coach_summary: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CoachMessage {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  content_type: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface MentorProfile {
  user_id: string;
  bio: string | null;
  specialties: string[];
  availability_status: string;
  response_time_estimate: string;
  created_at: string;
  updated_at: string;
}

export interface HelpRequest {
  id: string;
  requester_id: string;
  category: string;
  format: "async" | "micro_session";
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PeerMatch {
  id: string;
  help_request_id: string;
  matched_user_id: string;
  rank: number;
  reason_tags: string[];
  created_at: string;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
  created_at: string;
}

export interface PeerMessage {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  content_type: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Survey {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  survey_id: string;
  prompt: string;
  kind: "likert" | "free_text";
  sort_order: number;
  created_at: string;
}

export interface Response {
  id: string;
  survey_id: string;
  question_id: string;
  respondent_id: string;
  likert_value: number | null;
  free_text: string | null;
  created_at: string;
}

// ============================================================
// 5. MESSAGES (Chat)
// ============================================================
export type SosCategory =
  | "vent_session"
  | "email_proofread"
  | "lesson_pivot"
  | "classroom_crisis"
  | "observation_prep"
  | "tech_support"
  | "fresh_eyes_review";

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  message_type: "normal" | "sos";
  sos_category: SosCategory | null;
  read_at: string | null;
  created_at: string;
}

// ============================================================
// 6. VIDEO SESSIONS
// ============================================================
export interface VideoSession {
  id: string;
  match_id: string;
  initiated_by: string | null;
  room_url: string | null;
  room_id: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  status: "pending" | "active" | "ended" | "cancelled";
  created_at: string;
}

// ============================================================
// 7. SHARED FILES (Workspace)
// ============================================================
export interface SharedFile {
  id: string;
  match_id: string;
  uploaded_by: string;
  file_name: string;
  file_type: "document" | "image" | "spreadsheet" | "presentation" | "pdf" | "other" | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  storage_path: string;
  created_at: string;
}

// ============================================================
// 8. RESOURCES (System-wide Resource Library)
// ============================================================
export interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: "article" | "video" | "guide" | "template" | "link" | null;
  category: string;
  url: string | null;
  duration: string | null;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 9. RESOURCE BOOKMARKS
// ============================================================
export interface ResourceBookmark {
  id: string;
  user_id: string;
  resource_id: string;
  created_at: string;
}

// ============================================================
// 10. SCHEDULED SESSIONS (Calendar)
// ============================================================
export type SessionType = "video" | "chat" | "check-in" | "observation" | "planning" | "open";
export type SessionStatus = "upcoming" | "completed" | "cancelled";
export type ReminderSetting = "none" | "15min" | "30min" | "1hr" | "1day";

export interface ScheduledSession {
  id: string;
  match_id: string;
  created_by: string;
  title: string;
  session_type: SessionType | null;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: SessionStatus;
  reminder: ReminderSetting;
  confirmed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 11. GOALS
// ============================================================
export type GoalCategory =
  | "classroom-management"
  | "instruction"
  | "student-relationships"
  | "professional-development"
  | "other";

export type GoalStatus = "in-progress" | "completed" | "overdue";

export interface Goal {
  id: string;
  match_id: string;
  created_by: string;
  title: string;
  description: string | null;
  category: GoalCategory | null;
  target_date: string | null;
  progress: number;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 12. GOAL MILESTONES
// ============================================================
export interface GoalMilestone {
  id: string;
  goal_id: string;
  text: string;
  completed: boolean;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
}

// ============================================================
// 13. SESSION NOTES
// ============================================================
export interface ActionItem {
  text: string;
  completed: boolean;
}

export interface SessionNote {
  id: string;
  match_id: string;
  created_by: string;
  session_date: string;
  session_type: "video" | "chat" | null;
  duration_minutes: number | null;
  topics: string[];
  summary: string | null;
  key_takeaways: string[];
  action_items: ActionItem[];
  created_at: string;
  updated_at: string;
}

// ============================================================
// 14. GUIDED PROMPTS
// ============================================================
export interface GuidedPromptCategory {
  id: string;
  key: string;
  label: string;
  icon_name: string | null;
  color: string | null;
  bg_color: string | null;
  sort_order: number;
}

export interface GuidedPrompt {
  id: string;
  category_id: string;
  prompt_text: string;
  sort_order: number;
  created_at: string;
}

// ============================================================
// 15. ACHIEVEMENTS
// ============================================================
export interface Achievement {
  id: string;
  user_id: string;
  achievement_key: string;
  title: string;
  description: string | null;
  earned_at: string;
}

// ============================================================
// 16. MATCH REQUESTS
// ============================================================
export interface MatchRequest {
  id: string;
  user_id: string;
  current_match_id: string | null;
  reason: string;
  status: "pending" | "reviewed" | "approved" | "denied";
  reviewed_at: string | null;
  created_at: string;
}

// ============================================================
// 17. NOTIFICATION PREFERENCES
// ============================================================
export interface NotificationPreferences {
  user_id: string;
  email_notifications: boolean;
  session_reminders: boolean;
  weekly_progress: boolean;
  sos_alerts: boolean;
  updated_at: string;
}

// ============================================================
// 18. PARTNERSHIP STATS
// ============================================================
export interface PartnershipStats {
  match_id: string;
  total_messages: number;
  total_video_calls: number;
  total_video_minutes: number;
  total_files_shared: number;
  total_sessions_completed: number;
  total_goals_completed: number;
  current_streak_weeks: number;
  longest_streak_weeks: number;
  last_activity_at: string | null;
  updated_at: string;
}

// ============================================================
// MATCHING FUNCTION RESPONSE
// ============================================================
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

// ============================================================
// HELPER: Convert camelCase form data to snake_case for database
// ============================================================
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
