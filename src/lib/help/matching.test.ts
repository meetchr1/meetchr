import test from "node:test";
import assert from "node:assert/strict";
import { rankPeerMentors } from "./matching";

test("rankPeerMentors prioritizes overlap and fast availability", () => {
  const ranked = rankPeerMentors(
    [
      {
        user_id: "a",
        specialties: ["planning"],
        availability_status: "available",
        response_time_estimate: "under_1h",
      },
      {
        user_id: "b",
        specialties: ["classroom"],
        availability_status: "available",
        response_time_estimate: "within_24h",
      },
      {
        user_id: "c",
        specialties: ["planning"],
        availability_status: "away",
        response_time_estimate: "within_24h",
      },
    ],
    "planning"
  );

  assert.equal(ranked[0]?.user_id, "a");
  assert.ok(ranked[0]?.reasonTags.includes("category_overlap"));
  assert.ok(ranked[0]?.reasonTags.includes("fast_response"));
});
