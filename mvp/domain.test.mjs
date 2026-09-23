import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CONFIG,
  allocationForTickets,
  applyTicketSales,
  canOpenFirstDraw,
  createDemoState,
  seedFromReserve,
  settleJackpotWinner,
  validateLine,
} from "./domain.mjs";

test("validates a six-number line", () => {
  assert.deepEqual(validateLine([45, 1, 9, 12, 22, 31]), { ok: true, numbers: [1, 9, 12, 22, 31, 45] });
  assert.equal(validateLine([1, 1, 2, 3, 4, 5]).ok, false);
  assert.equal(validateLine([0, 1, 2, 3, 4, 5]).ok, false);
});

test("allocates 60 percent of one-dollar tickets to player prizes", () => {
  assert.deepEqual(allocationForTickets(10), { grossCents: 1000, prizeCents: 600, protocolCents: 400 });
});

test("first draw cannot open before a fully covered ten-thousand-dollar jackpot", () => {
  const empty = createDemoState({ reserveCents: 1_000_000, vaultCents: 0 });
  assert.equal(canOpenFirstDraw(empty), false);
  const seeded = seedFromReserve({ ...empty, vaultCents: 1_000_000 });
  assert.equal(seeded.jackpotCents, DEFAULT_CONFIG.jackpotFloorCents);
  assert.equal(canOpenFirstDraw(seeded), true);
});

test("sales stop growing the jackpot at one million and preserve overflow for players", () => {
  const state = createDemoState({ jackpotCents: 99_999_950, reserveCents: 0 });
  const next = applyTicketSales(state, 10);
  assert.equal(next.jackpotCents, DEFAULT_CONFIG.jackpotCapCents);
  assert.equal(next.playerBenefitOverflowCents, 550);
});

test("winner receives jackpot and reserve reseeds the floor", () => {
  const state = createDemoState({ jackpotCents: 2_500_000, vaultCents: 3_500_000, reserveCents: 1_000_000 });
  const result = settleJackpotWinner(state);
  assert.equal(result.paidCents, 2_500_000);
  assert.equal(result.state.jackpotCents, 1_000_000);
  assert.equal(result.state.reserveCents, 0);
  assert.equal(result.state.vaultCents, 1_000_000);
});

test("winner settlement fails rather than creating an underfunded liability", () => {
  const state = createDemoState({ jackpotCents: 2_500_000, vaultCents: 2_000_000 });
  assert.throws(() => settleJackpotWinner(state), /insolvent vault/);
});

