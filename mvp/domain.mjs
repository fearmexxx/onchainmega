export const DEFAULT_CONFIG = Object.freeze({
  ticketPriceCents: 100,
  prizeAllocationBps: 6000,
  jackpotFloorCents: 1_000_000,
  jackpotCapCents: 100_000_000,
  numbersPerLine: 6,
  maximumNumber: 45,
});

export function assertConfig(config = DEFAULT_CONFIG) {
  if (!Number.isSafeInteger(config.ticketPriceCents) || config.ticketPriceCents <= 0) {
    throw new Error("ticket price must be a positive integer");
  }
  if (!Number.isSafeInteger(config.prizeAllocationBps) || config.prizeAllocationBps < 0 || config.prizeAllocationBps > 10_000) {
    throw new Error("prize allocation must be between 0 and 10,000 bps");
  }
  if (config.jackpotFloorCents <= 0 || config.jackpotCapCents < config.jackpotFloorCents) {
    throw new Error("jackpot cap must be at least the floor");
  }
  return config;
}

export function validateLine(numbers, config = DEFAULT_CONFIG) {
  assertConfig(config);
  if (!Array.isArray(numbers) || numbers.length !== config.numbersPerLine) {
    return { ok: false, error: `Choose exactly ${config.numbersPerLine} numbers.` };
  }
  if (!numbers.every(Number.isSafeInteger)) return { ok: false, error: "Numbers must be integers." };
  if (new Set(numbers).size !== numbers.length) return { ok: false, error: "Numbers must be unique." };
  if (numbers.some((number) => number < 1 || number > config.maximumNumber)) {
    return { ok: false, error: `Numbers must be between 1 and ${config.maximumNumber}.` };
  }
  return { ok: true, numbers: [...numbers].sort((a, b) => a - b) };
}

export function allocationForTickets(ticketCount, config = DEFAULT_CONFIG) {
  assertConfig(config);
  if (!Number.isSafeInteger(ticketCount) || ticketCount < 0) throw new Error("ticket count must be a non-negative integer");
  const grossCents = ticketCount * config.ticketPriceCents;
  const prizeCents = Math.floor((grossCents * config.prizeAllocationBps) / 10_000);
  return { grossCents, prizeCents, protocolCents: grossCents - prizeCents };
}

export function applyTicketSales(state, ticketCount, config = DEFAULT_CONFIG) {
  const allocation = allocationForTickets(ticketCount, config);
  const room = Math.max(0, config.jackpotCapCents - state.jackpotCents);
  const toJackpotCents = Math.min(room, allocation.prizeCents);
  const toOverflowCents = allocation.prizeCents - toJackpotCents;
  return {
    ...state,
    ticketsSold: state.ticketsSold + ticketCount,
    grossSalesCents: state.grossSalesCents + allocation.grossCents,
    jackpotCents: state.jackpotCents + toJackpotCents,
    playerBenefitOverflowCents: state.playerBenefitOverflowCents + toOverflowCents,
    protocolAccruedCents: state.protocolAccruedCents + allocation.protocolCents,
  };
}

export function seedFromReserve(state, config = DEFAULT_CONFIG) {
  assertConfig(config);
  const requiredCents = Math.max(0, config.jackpotFloorCents - state.jackpotCents);
  if (state.reserveCents < requiredCents) throw new Error("reserve cannot fund the jackpot floor");
  return {
    ...state,
    reserveCents: state.reserveCents - requiredCents,
    jackpotCents: state.jackpotCents + requiredCents,
  };
}

export function canOpenFirstDraw(state, config = DEFAULT_CONFIG) {
  assertConfig(config);
  return state.jackpotCents >= config.jackpotFloorCents && state.vaultCents >= state.jackpotCents;
}

export function settleJackpotWinner(state, config = DEFAULT_CONFIG) {
  assertConfig(config);
  if (state.vaultCents < state.jackpotCents) throw new Error("insolvent vault");
  const paidCents = state.jackpotCents;
  const afterPayment = {
    ...state,
    vaultCents: state.vaultCents - paidCents,
    jackpotCents: 0,
    lastJackpotPaidCents: paidCents,
  };
  return { paidCents, state: seedFromReserve(afterPayment, config) };
}

export function createDemoState(overrides = {}) {
  return {
    ticketsSold: 0,
    grossSalesCents: 0,
    jackpotCents: 0,
    playerBenefitOverflowCents: 0,
    protocolAccruedCents: 0,
    reserveCents: 1_000_000,
    vaultCents: 1_000_000,
    lastJackpotPaidCents: 0,
    ...overrides,
  };
}

export function formatUsd(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}

