export type MentorCandidate = {
  user_id: string;
  specialties: string[] | null;
  availability_status: string;
  response_time_estimate: string;
};

export type RankedMentor = MentorCandidate & {
  score: number;
  reasonTags: string[];
};

export function rankPeerMentors(
  mentors: MentorCandidate[],
  category: string
): RankedMentor[] {
  const scored = mentors.map((mentor) => {
    const reasonTags: string[] = [];
    let score = 0;

    if (mentor.specialties?.includes(category)) {
      score += 2;
      reasonTags.push("category_overlap");
    }
    if (mentor.availability_status === "available") {
      score += 1;
      reasonTags.push("available_now");
    }
    if (
      mentor.response_time_estimate === "under_1h" ||
      mentor.response_time_estimate === "same_day"
    ) {
      score += 1;
      reasonTags.push("fast_response");
    }

    return { ...mentor, score, reasonTags };
  });

  scored.sort((a, b) => b.score - a.score);
  const maxResults = Math.min(5, Math.max(3, scored.length));
  return scored.slice(0, maxResults);
}
