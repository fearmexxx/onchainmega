# Onchain Mega MVP

This is a non-monetary, local/devnet product prototype. It demonstrates the number picker and the financial state machine without accepting funds, connecting a wallet, requesting randomness, or paying prizes.

## Run

```bash
node mvp/server.mjs
```

Open `http://127.0.0.1:4173`.

## Test

```bash
node --test mvp/domain.test.mjs
```

## Encoded economics

- one demo line: $1 equivalent in play credits;
- 60% of ticket value allocated to player prizes;
- first draw locked until the jackpot is at least $10,000 and fully backed;
- separate reserve required to seed or reseed the $10,000 floor;
- jackpot growth capped at $1 million;
- allocation above the cap is held for a disclosed player-benefit use, not reclassified as protocol revenue.

## Not yet implemented

- Solana devnet program and PDA vaults;
- Wallet Standard integration;
- USDC transfers (intentionally disabled pending licensing);
- multi-source verifiable randomness;
- ticket accumulator and winner settlement;
- Helius RPC/indexing;
- identity, age, sanctions, geolocation, and responsible-gaming controls.

The production flag must remain disabled until the target market, licence, game rules, treasury reserve, audit, and player-protection requirements have been approved.

