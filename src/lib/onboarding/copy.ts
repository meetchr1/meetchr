/**
 * Central UX copy for the Meetchr onboarding flow.
 * Voice: calm, human, non-corporate; supportive without being sentimental.
 */

export const onboardingCopy = {
  entry: {
    headline: "Welcome to Meetchr",
    subline:
      "A little space for teachers to get unstuck—together or with a gentle nudge from AI.",
    primaryCta: "Continue",
    secondaryCta: "What is this?",
    whatIsThisBody:
      "Meetchr helps you name what you need, then points you toward the right kind of help. No big setup first.",
  },

  privacy: {
    headline: "Your story stays yours",
    body: "We only ask what helps us match you with the right support. You can skip anything that doesn’t feel right. Nothing here is used to judge you or your teaching.",
    bullets: [
      "You choose what to share",
      "You can use a name that isn’t your real one",
      "You can leave anytime",
    ],
    primaryCta: "I’m ready",
    skipCta: "Skip for now",
  },

  role: {
    headline: "A quick snapshot of you",
    subline: "This helps us speak your language—not label you.",
    helper: "Pick what fits best. Rough answers are fine.",
    primaryCta: "Next",
    /** Labels for data fields (pair with your form controls) */
    fields: {
      role: "Role",
      gradeBand: "Grade band",
      subject: "Subject",
      yearsTeaching: "Years in the classroom",
    },
  },

  emotionalState: {
    headline: "How are you showing up today?",
    subline:
      "There’s no wrong answer. We’re not taking notes on you—just trying to meet you where you are.",
    primaryCta: "Continue",
    /** Example option labels—wire to your enum values */
    options: {
      steady: "Steady",
      tiredButOkay: "Tired but okay",
      overwhelmed: "Overwhelmed",
      notSure: "Not sure",
    },
  },

  needs: {
    headline: "What would help most right now?",
    subline: "One thing is enough. You can change your mind later.",
    helper:
      "Think small and concrete—a lesson, a conversation, a moment to breathe.",
    primaryCta: "Next",
  },

  firstSupportAi: {
    headline: "Here’s something to hold onto",
    subline: "Short, practical, and for you—not a generic pep talk.",
    cardIntro: "A little support, based on what you shared:",
    cardFooter:
      "If this misses the mark, that’s okay. You can try another angle in a moment.",
    primaryCta: "Continue",
    secondaryCta: "Something different",
  },

  firstSupportPeer: {
    headline: "You’re not fixing this alone",
    subline:
      "Other teachers have been in a similar spot. Here’s a simple way peer support can help with what you picked.",
    intro:
      "Peer support can mean a quick tip, a shared resource, or someone who gets the day-to-day.",
    primaryCta: "Continue",
  },

  profileOptional: {
    headline: "Want to add a bit more?",
    subline: "Totally optional. You can go straight in and fill this in whenever you like.",
    fields: {
      pseudonym: {
        label: "What we call you",
        hint: "Use a first name, nickname, or anything you’re comfortable with.",
      },
      strengths: {
        label: "Strengths",
        hint: "What you’re often good at or willing to share (lesson ideas, classroom calm, tech basics…).",
      },
      availability: {
        label: "Availability",
        hint: "Rough sense of when you might connect—no pressure to commit.",
      },
    },
    primaryCta: "Save and enter Meetchr",
    secondaryCta: "Skip for now",
    footer: "You can always edit or remove this later.",
  },

  common: {
    back: "Back",
    next: "Next",
    continue: "Continue",
    saved: "Saved",
    validationError: "Please pick one option so we can keep going.",
    progressAlmostThere: "Almost there",
  },
} as const;

export type OnboardingCopy = typeof onboardingCopy;
