import test from "node:test";
import assert from "node:assert/strict";
import { fetchClaudeCoachReply, parseCoachReply } from "./coach";

test("parseCoachReply accepts strict expected JSON shape", () => {
  const result = parseCoachReply(
    JSON.stringify({
      text: "You are doing a hard thing well.",
      meta: {
        tone: "validation",
        suggested_action: "Take two deep breaths before next class.",
        escalate: false,
        crisis_flag: false,
      },
    })
  );

  assert.equal(result.meta.tone, "validation");
  assert.equal(result.meta.escalate, false);
});

test("fetchClaudeCoachReply uses mocked Claude response", async () => {
  process.env.CLAUDE_API_KEY = "test-key";

  const mockFetch: typeof fetch = (async () =>
    new Response(
      JSON.stringify({
        content: [
          {
            type: "text",
            text: JSON.stringify({
              text: "Let's ground this in one small next step.",
              meta: {
                tone: "calm",
                suggested_action:
                  "Write one sentence for tomorrow's lesson objective.",
                escalate: false,
                crisis_flag: false,
              },
            }),
          },
        ],
      }),
      { status: 200 }
    )) as typeof fetch;

  const reply = await fetchClaudeCoachReply("I'm overwhelmed today", mockFetch);
  assert.equal(reply.meta.tone, "calm");
  assert.match(reply.text, /small next step/i);
});
