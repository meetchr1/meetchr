const HELP_CATEGORIES = ["classroom", "planning", "parents", "admin", "self"] as const;

export type HelpCategory = (typeof HELP_CATEGORIES)[number];

export function toHelpCategory(input: string): HelpCategory {
  if (HELP_CATEGORIES.includes(input as HelpCategory)) {
    return input as HelpCategory;
  }
  return "classroom";
}

export function buildHelpRequestUrl(category: HelpCategory): string {
  return `/help?category=${encodeURIComponent(category)}`;
}
