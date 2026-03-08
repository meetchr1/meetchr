import { z } from "zod";

export const coachReplySchema = z.object({
  text: z.string().min(1),
  meta: z.object({
    tone: z.enum(["validation", "calm"]),
    suggested_action: z.string().min(1),
    escalate: z.boolean(),
    crisis_flag: z.boolean(),
  }),
});

export type CoachReply = z.infer<typeof coachReplySchema>;

export function parseCoachReply(raw: string): CoachReply {
  const parsed = JSON.parse(raw);
  return coachReplySchema.parse(parsed);
}

export function hasSelfHarmKeywords(input: string): boolean {
  const text = input.toLowerCase();
  const keywords = [
    "kill myself",
    "end my life",
    "suicide",
    "self harm",
    "hurt myself",
    "don't want to live",
    "not want to live",
    "want to die",
  ];
  return keywords.some((keyword) => text.includes(keyword));
}

export async function fetchClaudeCoachReply(
  userMessage: string,
  fetchImpl: typeof fetch = fetch
): Promise<CoachReply> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error("CLAUDE_API_KEY is not configured.");
  }

  const model = process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-latest";
  const response = await fetchImpl("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      temperature: 0.2,
      system:
        "You are a calm, supportive teacher coach. Output STRICT JSON only (no markdown, no prose outside JSON) with shape: {\"text\": string, \"meta\": {\"tone\": \"validation\"|\"calm\", \"suggested_action\": string, \"escalate\": boolean, \"crisis_flag\": boolean}}.",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error (${response.status})`);
  }

  const json = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };
  const textBlock = json.content?.find((block) => block.type === "text");
  const raw = textBlock?.text ?? "";

  return parseCoachReply(raw);
}
