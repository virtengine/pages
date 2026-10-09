import test from "node:test";
import assert from "node:assert/strict";
import { initialState, request, decide, revoke, restoreConsent } from "../src/lib/pilot-demo.ts";

test("reuse requires a fresh consent for each service and discloses only the membership claim", () => {
  let state = decide(request(initialState(), "workspace", "valid"), true);
  assert.equal(state.result, "accepted");
  assert.deepEqual(state.receipts[0].disclosed, { membership_active: true });
  state = request(state, "learning", "valid");
  assert.equal(state.pending, true);
  assert.equal(state.receipts.length, 1);
  state = decide(state, true);
  assert.equal(state.receipts.length, 2);
  assert.notEqual(state.receipts[0].requestId, state.receipts[1].requestId);
});
test("decline never creates a successful presentation", () => {
  const state = decide(request(initialState(), "workspace", "valid"), false);
  assert.equal(state.result, "declined");
  assert.deepEqual(state.receipts, []);
});
test("invalid credentials, unknown issuers, missing credentials, lost devices and stale requests fail closed", () => {
  for (const scenario of ["expired", "revoked", "unknown", "missing", "lost", "interrupted"]) {
    const state = decide(request(initialState(), "workspace", scenario), true);
    assert.notEqual(state.result, "accepted");
    assert.deepEqual(state.receipts, []);
  }
});
test("revocation blocks future sharing, preserves receipts and does not affect a different service", () => {
  let state = revoke(decide(request(initialState(), "workspace", "valid"), true));
  state = decide(request(state, "workspace", "valid"), true);
  assert.equal(state.result, "consent-revoked");
  assert.equal(state.receipts.length, 1);
  state = decide(request(state, "learning", "valid"), true);
  assert.equal(state.result, "accepted");
  state = request(state, "workspace", "valid");
  state = restoreConsent(state);
  assert.equal(state.pending, false);
  state = decide(state, true);
  assert.equal(state.receipts.length, 2);
  state = decide(request(state, "workspace", "valid"), true);
  assert.equal(state.receipts.length, 3);
});
test("double approval or approval without a pending request cannot share again", () => {
  assert.deepEqual(decide(initialState(), true), initialState());
  const state = decide(request(initialState(), "workspace", "valid"), true);
  assert.deepEqual(decide(state, true), state);
});
