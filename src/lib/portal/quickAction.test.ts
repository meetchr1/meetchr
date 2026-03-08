import test from "node:test";
import assert from "node:assert/strict";
import { buildHelpRequestUrl, toHelpCategory } from "./quickAction";

test("toHelpCategory falls back to classroom for invalid category", () => {
  assert.equal(toHelpCategory("classroom"), "classroom");
  assert.equal(toHelpCategory("not_real"), "classroom");
});

test("buildHelpRequestUrl returns encoded /help query URL", () => {
  assert.equal(buildHelpRequestUrl("parents"), "/help?category=parents");
});
