/**
 * Matching survey is required after sign-up so we can pair teachers.
 * Users waiting for a peer match still use the portal and other features.
 */

export const MATCHING_SURVEY_PATH = "/survey";

/** Routes that require auth and a completed matching survey. */
export const ROUTES_REQUIRING_MATCHING_SURVEY = [
  "/hub",
  "/app",
  "/portal",
  "/coach",
  "/academy",
  "/help",
  "/admin",
] as const;

export function pathnameRequiresMatchingSurvey(pathname: string): boolean {
  return ROUTES_REQUIRING_MATCHING_SURVEY.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Only allow same-origin relative paths (avoid open redirects).
 */
export function safeAfterSurveyPath(raw: string | null, fallback = "/portal"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return fallback;
  }
  return raw;
}

export function isSurveyCompleted(
  value: boolean | null | undefined
): value is true {
  return value === true;
}
