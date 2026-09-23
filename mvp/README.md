# Onchain Mega MVP

This is a non-monetary Solana devnet product prototype. It demonstrates the number picker, wallet connection, devnet memo receipts, and the financial state machine without accepting funds, requesting production randomness, or paying prizes.

## Run

```bash
node mvp/server.mjs
```

Open `http://127.0.0.1:4173`.

The server uses Solana's public devnet RPC by default. To use Helius without exposing its key to the browser:

```powershell
$env:HELIUS_API_KEY="your-key"
node mvp/server.mjs
```

Connect Phantom or Backpack, ensure the address has devnet SOL, choose six numbers, and submit the demo entry. The resulting memo transaction links to Solana Explorer with `cluster=devnet`.

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

- custom Solana devnet program and PDA vaults;
- full Wallet Standard discovery beyond the Phantom and Backpack injected providers;
- USDC transfers (intentionally disabled pending licensing);
- multi-source verifiable randomness;
- ticket accumulator and winner settlement;
- Helius RPC/indexing;
- identity, age, sanctions, geolocation, and responsible-gaming controls.

The production flag must remain disabled until the target market, licence, game rules, treasury reserve, audit, and player-protection requirements have been approved.

