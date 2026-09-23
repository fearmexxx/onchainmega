# Onchain state machine: MVP specification

## Classification boundary

This specification describes a chance-based number draw. Product naming cannot change its legal classification. Real-money operation is disabled until licensed-market approval.

## Accounts

- `PlatformConfig`: authorities, stablecoin mint, allocation bps, floor, cap, pause flag.
- `Game`: number range, selection count, draw schedule, active rules hash.
- `Draw`: lifecycle, cutoff, ticket count/root, jackpot, entropy commitments, result.
- `PrizeVault`: player-liability assets; cannot be withdrawn as earned revenue.
- `ReserveVault`: operator capital used only to seed/reseed the disclosed floor.
- `RevenueVault`: the non-prize allocation after a ticket becomes final.
- `TicketBatch`: owner, draw, packed lines, purchase amount, claimed bitmap.

## Draw lifecycle

`FUNDING → OPEN → LOCKED → RANDOMNESS_PENDING → FINALIZED → SETTLING → CLOSED`

Failure paths are `CANCELLED_REFUNDING → REFUNDED`. Admin pause stops new tickets but cannot redirect prize liabilities.

## Invariants

1. Exactly 6 unique integers in `[1,45]` per line.
2. Ticket price is stored in stablecoin base units and all math is integer math.
3. Prize allocation is exactly 6,000 basis points of finalized ticket sales.
4. `OPEN` requires the prize vault to cover every advertised and accrued prize liability.
5. The first draw requires an advertised jackpot of at least $10,000.
6. A jackpot win pays the finalized jackpot and reseeds only from the reserve vault.
7. A draw cannot reopen if the reserve cannot cover the advertised floor.
8. Jackpot growth stops at $1 million; overflow remains a separately accounted player liability until rules specify its player-benefit distribution.
9. Closed-draw rules, cutoff, entropy sources, and mapping algorithm are immutable.
10. Each ticket can be settled or refunded at most once.

## Program-level launch gates

- production stablecoin mint allowlisted;
- licence/jurisdiction configuration hash set;
- upgrade authority multisig and timelock active;
- audited randomness adapters configured;
- reserve and prize coverage checks pass;
- independent audit has no unresolved critical/high findings.

