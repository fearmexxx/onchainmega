# Business Requirements Document: Global Onchain Lottery Platform

**Working title:** Project Atlas Lottery  
**Document status:** Draft for founder review (planning only; not legal, tax, or investment advice)  
**Version:** 0.1  
**Date:** 23 September 2026  

## 1. Executive decision summary

Build a jurisdiction-gated, non-custodial lottery platform on Solana, beginning with one daily 6-from-45 game priced at **1 USDC per line**. The product should feel as simple as a mainstream mobile lottery while making ticket issuance, draw inputs, results, liabilities, and payouts independently auditable.

The revised business model allocates **60% of ticket sales to player prizes** and 40% to gross operator revenue before gaming duties, compliance, acquisition, infrastructure, support, oracle, audit, payment costs, and reserve replenishment. The target is a 10% net operating margin; it is not guaranteed and must be validated market by market.

Do not launch as literally “global.” Lottery and remote-gambling permission is market-specific. The launch must begin with a licensed entity, approved countries/regions, age and identity verification, sanctions screening, geofencing, responsible-gambling controls, and segregated player/prize funds. The European Commission notes that EU countries maintain different gambling regimes, and the UK regulator separately requires a remote lottery licence for qualifying remote lotteries ([European Commission](https://single-market-economy.ec.europa.eu/sectors/online-gambling_en), [UK Gambling Commission](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/remote-lotteries)).

Do not make a speculative token mandatory for purchasing tickets or receiving prizes. Launch with USDC settlement and non-transferable loyalty points. Introduce a transferable ecosystem token only after jurisdiction-by-jurisdiction gaming, securities, consumer, tax, AML, and marketing opinions.

## 2. Product vision

Create a family of transparent number-draw products whose common trust layer consists of:

- one verified player identity and responsible-gaming profile;
- one wallet and fiat/stablecoin payment experience;
- a common draw-verification protocol;
- an onchain ticket and settlement standard;
- shared loyalty and reputation;
- a public treasury, reserve, and liability dashboard;
- reusable compliance, support, analytics, and affiliate services.

The flagship game is **Mega 6/45 Daily**. It is inspired by the familiar select-six model of Vietnam's Mega 6/45, not presented as an official Vietlott product or a clone. Vietlott's published rules describe selection of six numbers from 01–45, a VND 10,000 base play, four prize tiers, and jackpot rollover ([Vietlott rules PDF](https://media.vietlott.vn/vi/04.2019/system/archivedate/the-le-mega-6.45.pdf)). Brand, rules, schedules, visual identity, and market claims require separate intellectual-property review.

## 3. Goals and non-goals

### Goals

1. Sell a valid $1 line in fewer than 30 seconds to a returning verified player.
2. Make it impossible for the operator alone to choose or change a winning result.
3. Prove every ticket was accepted before cutoff and every prize was calculated from published rules.
4. Maintain prize solvency under jackpot rollover, oracle failure, traffic spikes, and delayed settlement.
5. Achieve a 10% gross take while reporting actual net margin transparently.
6. Provide a platform architecture capable of launching additional draw products without reimplementing custody, identity, wallets, randomness, or settlement.

### Non-goals for v1

- unrestricted worldwide availability;
- anonymous gambling;
- ticket purchase with a volatile platform token;
- promises of guaranteed token appreciation, yield, dividends, or revenue share;
- a claim that Solana or the complete system is quantum-resistant;
- DAO control of live draw results, prize liabilities, KYC, sanctions, or emergency safety actions;
- onchain storage of personally identifiable information.

## 4. Users and stakeholders

| Actor | Primary need |
|---|---|
| Player | Simple entry, clear odds, provable draw, fast payout, spend controls |
| Operator | Licensed distribution, predictable liabilities, fraud controls, sustainable unit economics |
| Regulator/auditor | Immutable evidence, rules versioning, player protection, AML records, fund segregation |
| Draw observer | Reproduce the winning numbers from public inputs and program code |
| Affiliate | Attributable acquisition without influencing odds or player outcomes |
| Treasury/reserve manager | Exact real-time liabilities, multisig controls, reconciliations, emergency procedures |
| Product publisher | Reuse approved game, ticket, draw, and settlement primitives |

## 5. Flagship game: Mega 6/45 Daily

### 5.1 Player rules

- A line contains six distinct integers from 1 through 45.
- Price is **1 USDC**, displayed locally as approximately US$1 where legally permitted. “Ticker” in the concept is interpreted as **ticket/line**.
- Players choose numbers manually, use Quick Pick, repeat a prior selection, or buy multiple future draws where permitted.
- Sales close at **23:55 UTC** and the target draw time is **00:00 UTC daily**. Exact time is a configurable, rules-versioned field.
- A ticket is valid only after the onchain program accepts it before the cutoff. A wallet signature or failed transaction is not a ticket.
- Results are six unique numbers derived without replacement from finalized draw entropy. Sorting is for display only.
- Proposed tiers: 6 matches (Jackpot), 5 matches, 4 matches, and 3 matches.
- Claims below the jurisdictional enhanced-due-diligence threshold settle automatically after finalization; larger prizes enter a compliant claim workflow before release.

### 5.2 Combinatorial odds

There are `C(45,6) = 8,145,060` possible lines.

| Match | Winning combinations for one line | Approximate odds |
|---|---:|---:|
| 6 | 1 | 1 in 8,145,060 |
| 5 | `C(6,5) × C(39,1) = 234` | 1 in 34,808 |
| 4 | `C(6,4) × C(39,2) = 11,115` | 1 in 733 |
| 3 | `C(6,3) × C(39,3) = 182,780` | 1 in 44.6 |

The UI must display the actual odds and payout method before purchase. It must not describe a pari-mutuel estimate as guaranteed.

### 5.3 Recommended prize accounting

For every 1.00 USDC line in the MVP:

| Allocation | Amount | Treatment |
|---|---:|---|
| Player prize pool | 0.60 | Accrues to the advertised jackpot in the initial MVP, capped at $1 million |
| Gross operator allocation | 0.40 | Revenue before costs, duties, taxes, and reserve funding |

This yields a contractual **60% prize allocation / 40% gross operator allocation**. A later multi-tier launch must define how the 60% is divided among jackpot and lower tiers before ticket sales begin. The reserve must never be represented as available profit.

Alternative fixed lower-tier prizes may be introduced only after simulations across ticket volumes and correlated popular-number selection show an acceptable 99.9th-percentile liability. Fixed payouts without a cap can create insolvency when many players select the same winning line.

### 5.4 Jackpot seed, reset, and cap

- The first paid draw stays locked until the prize vault fully covers a $10,000 advertised jackpot.
- The $10,000 launch seed is operator-funded reserve capital, explicitly recorded and never taken from unrelated player liabilities.
- Jackpot balance equals prior rollover plus the current jackpot allocation less paid jackpot prizes.
- After a jackpot winner is paid, the next jackpot resets to $10,000 using a separate ring-fenced reserve. If the reserve cannot fully fund it, the next draw cannot open.
- The jackpot is capped at $1 million. Further prize allocation moves according to pre-published rules: boost lower tiers, fund a special draw, or enter a player-benefit reserve. It must not silently become operator revenue.
- Multiple jackpot winners split the jackpot equally, subject to jurisdictional rounding rules.

## 6. Unit economics and profitability

Let `T` be ticket revenue. Prize liability is `0.60T`; gross operator revenue is `0.40T`.

`Net operating profit = 0.40T + ancillary revenue − reserve contributions − operating costs − gaming duties − payment losses − promotions`

Illustrative steady-state scenario, not a forecast:

| Daily lines | Ticket sales | Prize liability | Gross protocol revenue |
|---:|---:|---:|---:|
| 100,000 | $100,000 | $60,000 | $40,000 |
| 1,000,000 | $1,000,000 | $600,000 | $400,000 |

Required pre-launch financial model:

- jurisdiction-specific gaming duty and corporate tax;
- KYC/AML and geolocation cost per active/depositing player;
- fiat on-ramp, stablecoin, chargeback, and treasury-spread costs;
- affiliate and promotional cost per acquired payer;
- RPC, indexing, oracle, relayer, audit, security, support, and insurance costs;
- unclaimed-prize treatment by jurisdiction;
- minimum working capital and jackpot reserve;
- token-related legal, exchange, market-making, disclosure, and accounting costs, if any.

**Decision gate:** the model must demonstrate a sustainable 10% net margin after all costs, taxes, duties, and reserve funding. If it does not, choose among (a) revising the disclosed allocation for future draws where lawful, (b) sponsorship/white-label/B2B revenue, (c) lower acquisition cost, or (d) no launch. Do not reduce already accrued prize liabilities.

## 7. Draw integrity and randomness

### 7.1 Security objective

After the sales cutoff, no player, operator, oracle, validator, or small colluding subset should be able to predict or bias the result beyond a documented threat threshold. After the draw, any observer should be able to verify inputs and reproduce the six numbers.

### 7.2 Recommended multi-source draw protocol

1. **Rules commitment:** Before sales open, publish the draw ID, rules hash, cutoff slot/time, oracle set, fallback order, domain separator, and deterministic number-mapping algorithm onchain.
2. **Operator commitment:** Before cutoff, commit `SHA-256(operator_secret)` without revealing the secret.
3. **Ticket accumulator:** At cutoff, freeze the ticket Merkle root/count and gross sales/liability totals.
4. **Independent entropy:** Request entropy from at least two independently operated verifiable-randomness providers after cutoff. ORAO describes its Solana VRF v2 as a multi-node, EdDSA-based quorum whose submitted values are combined onchain ([ORAO](https://orao.network/solana-vrf)). A second provider must pass legal, security, decentralization, liveness, cost, and mainnet-history diligence before selection.
5. **Future chain value:** Include a precommitted future finalized Solana slot hash only as an additional source, never as the sole source.
6. **Optional quantum entropy:** Commit before cutoff to the identifier/hash of a future output from an independent quantum random-number service or public beacon. Treat this as diversity of entropy, not proof that the chain is post-quantum.
7. **Reveal and combine:** After all mandatory inputs are available, compute `SHA-256(domain || draw_id || ticket_root || operator_secret || vrf_A || vrf_B || future_slot_hash || optional_qrng)`.
8. **Unbiased mapping:** Use rejection sampling to turn the digest stream into six unique numbers from 1–45. Never use naive modulo mapping.
9. **Finalization:** Store all source references, proofs, output, settlement root, and program version onchain. The public verifier must reproduce the result from these inputs.

The XOR/hash combiner must be designed so one honest, unpredictable source preserves unpredictability. A formal cryptographic review is required; this prose is not a proof.

### 7.3 Liveness and failure rules

- The fallback path must be committed before ticket sales; operators cannot select a fallback after seeing candidate randomness.
- If a mandatory oracle misses its deadline, use the precommitted fallback schedule and visibly mark the draw delayed.
- If entropy or chain finality remains unavailable, cancel the draw and refund principal automatically. Never draw from an operator-selected seed.
- The operator reveal must have a fixed deadline. Failure to reveal triggers a precommitted path and a financial penalty/bond; it cannot block the draw indefinitely.
- Oracle/provider upgrades require a timelocked rules change and cannot affect an open draw.

### 7.4 Quantum-resistance statement

The product must not claim “quantum-proof” or “quantum-resistant Solana lottery.” Solana transaction fees explicitly account for Ed25519 signature verification ([Solana fee structure](https://solana.com/docs/core/fees/fee-structure)), while NIST's finalized post-quantum standards use algorithms such as ML-KEM, ML-DSA, and SLH-DSA ([NIST PQC](https://www.nist.gov/pqc)). A dApp cannot replace the base chain's signature scheme.

Permissible positioning, subject to counsel and audit: **“multi-source, publicly verifiable randomness with optional quantum-generated entropy and a crypto-agile migration design.”** Hash commitments using a 256-bit hash offer a conservative quantum security margin against generic search, but the complete system inherits non-post-quantum components from Solana, wallets, oracle signatures, frontends, and custody operations.

## 8. Solana system architecture

### 8.1 Onchain programs

- **Game Registry:** approved products, rules versions, schedules, jurisdiction configuration hashes, pause state.
- **Draw Manager:** open/cutoff/finalize/cancel lifecycle; entropy commitments; deadlines; winning numbers.
- **Ticket Program:** accepts USDC, validates six unique values and draw status, emits compact ticket receipt, updates sales and liability counters.
- **Prize Vault:** segregated PDA-controlled USDC vaults per game/draw or accounting epoch; prohibits operator withdrawal of accrued liabilities.
- **Settlement/Claims:** verifies ticket eligibility and prevents double claims; supports automatic and reviewed payout paths.
- **Reserve/Treasury:** separate reserve and earned-revenue vaults; role-separated withdrawals via institutional multisig and timelock.
- **Loyalty Attestation:** non-transferable points/credentials in v1, with no cash redemption or effect on draw odds.

### 8.2 Ticket representation and scale

Avoid minting one NFT per $1 line. It increases account creation, indexing, UX, and rent overhead. Prefer compact program accounts batched by buyer/draw or a compressed receipt design, while emitting canonical events for indexing. The authoritative ticket state and claim-prevention state must remain onchain.

At cutoff, commit a deterministic ticket accumulator. Settlement options to benchmark:

- direct per-ticket matching for small volume;
- batched settlement roots with permissionless proof verification;
- claim-on-demand for winners, plus automatic notifications from the indexer.

No solution may make the backend database authoritative over ticket validity or winnings.

### 8.3 Offchain services

- KYC/age/sanctions/geolocation and responsible-gaming policy engine;
- encrypted player profile and jurisdiction entitlement store;
- ticket indexer, draw observer, notification, and support tooling;
- reconciliation service comparing chain vaults, issued tickets, accrued liabilities, and payouts;
- public verifier and transparency API;
- affiliate attribution with self-exclusion and marketing-consent enforcement;
- anomaly/fraud engine for wallet clusters, bonus abuse, account takeover, and laundering patterns.

PII stays offchain. Onchain data should contain only pseudonymous references and minimal compliance attestations designed with privacy counsel.

### 8.4 Helius usage

Use the provided Helius key only in server-side secrets, never in browser bundles or committed files. Recommended uses:

- primary/secondary RPC routing and transaction submission;
- WebSocket or webhook monitoring of game programs and vaults;
- transaction history/backfill and reconciliation;
- wallet activity and ticket-status refresh;
- alerting on draw, settlement, or vault events.

Helius documents real-time account/transaction streams and webhooks with raw or parsed payloads ([Helius streams/webhooks](https://www.helius.dev/solana-webhooks-websockets)) and APIs for historical transactions, transfers, DAS, and enhanced/parsed data ([Helius data APIs](https://www.helius.dev/docs/getting-data)). Helius is infrastructure, not the randomness authority or source of truth. Run a second RPC path and periodically reconcile from finalized chain state.

## 9. Wallet, payment, and user experience

### 9.1 Wallet support

- Use Solana Wallet Standard discovery so Phantom, Backpack, Solflare, and other conforming wallets work without bespoke code. Solana's guidance says Wallet Standard supports major wallets out of the box ([Solana wallet guide](https://solana.com/zh/developers/courses/intro-to-solana/interact-with-wallets/)).
- Support desktop extension, mobile deep-link, in-app browser, WalletConnect-compatible path where necessary, and an optional embedded wallet only after custody/recovery review.
- Provide sponsored network fees for eligible actions so a USDC-only player does not need SOL; rate-limit and fraud-protect the fee payer.
- Simulate transactions and show exact USDC debit, network sponsor, draw ID, ticket numbers, and cutoff before signature.

### 9.2 Core UX

Home should answer four things without scrolling: current jackpot, time to cutoff, $1 price, and “Play” action. The purchase journey is:

`Connect/sign in → eligibility check → choose/quick-pick numbers → review spend/odds → sign → confirmed ticket receipt`

Required screens:

- game lobby with jackpot and countdown;
- number picker with clear selected-state and Quick Pick;
- cart supporting multiple lines without dark patterns;
- ticket wallet showing pending/won/not-won/claim-review states;
- live draw/result and “verify this draw” view;
- public reserve/liability dashboard;
- spend/deposit/time limits, cooling-off, self-exclusion, and help;
- rules, odds, prize allocation, token disclosures, and jurisdiction terms.

Accessibility target: WCAG 2.2 AA. Mobile-first target: usable at 320 px, large touch targets, no color-only result meaning, localized number/date/currency formats, and a reduced-motion option.

## 10. Ecosystem token strategy

### 10.1 Recommended staged design

**Stage 1 — no transferable token:** issue non-transferable loyalty points for permitted behaviors such as completed identity verification, product education, referrals that become eligible players, and long-term participation. Points may unlock cosmetics, fee sponsorship, early access, or merchandise; they do not change odds, prize entitlement, loss recovery, or responsible-gaming limits.

**Stage 2 — legal and product validation:** obtain written gaming, securities, payments, tax, consumer, sanctions, privacy, and advertising opinions for every target market. Publish token purpose, supply, vesting, governance limits, treasury policy, conflicts, and risk disclosures.

**Stage 3 — optional ecosystem token:** if approved, use a capped Solana token for cross-product loyalty redemption, governance of community grants/content, and partner integrations. Keep ticket price and prize accounting in USDC. Never require token staking to claim a prize or bypass KYC/limits.

### 10.2 Explicit token exclusions

- no promise of a 10% yield, protocol-profit share, dividend, or buyback-supported price;
- no sale framed as funding a jackpot or guaranteeing liquidity;
- no preferential odds for holders;
- no transferrable “loss rebate” that encourages chasing losses;
- no unilateral admin minting; any retained authority must be disclosed, multisig-controlled, and timelocked;
- no transfer-tax token in v1. Solana supports Token-2022 transfer fees, but such fees add authority, accounting, integration, and consumer-disclosure complexity ([Solana transfer-fee extension](https://solana.com/docs/tokens/extensions/transfer-fees)).

This design still “binds” the product family through identity, loyalty, shared verification, and common benefits without making gambling depend on a volatile asset.

## 11. Compliance and responsible-gaming requirements

### 11.1 Market-entry gate

Before enabling a country/state/province, counsel must document:

- whether the product is classified as lottery, remote gambling, pool betting, prize gaming, or prohibited activity;
- operator, supplier, software, key-person, and payment licences;
- whether private/commercial lotteries are allowed or restricted to state/charitable operators;
- age, residency, geolocation, advertising, language, and local-hosting requirements;
- permitted crypto/stablecoin funding and prize methods;
- gaming duty, withholding, reporting, unclaimed prizes, and jackpot rules;
- required testing laboratory, RNG certification, source-code escrow, audit, and incident reporting;
- data privacy, cross-border transfers, record retention, complaints, and alternative dispute resolution.

“Available on the internet” must never be treated as “lawful globally.”

### 11.2 Player protection

- age and identity verification before paid play where required;
- sanctions/PEP/adverse-media screening and ongoing monitoring;
- deposit, spend, loss, and session limits; cooling-off and self-exclusion across every ecosystem product;
- no credit, leverage, or borrowing within the product;
- clear net-deposit and net-loss history;
- intervention rules for harmful patterns and marketing suppression for excluded/high-risk users;
- no celebratory design for losses, false urgency, near-miss manipulation, or odds-obscuring copy.

FATF/APG identifies growing AML/CFT risks in increasingly digital and cross-border gaming ecosystems, reinforcing the need for risk-based controls rather than wallet-only access ([FATF](https://www.fatf-gafi.org/en/publications/Methodsandtrends/risks-of-gaming-and-gambling.html)).

## 12. Security, treasury, and governance

- Independent audits of each Solana program, randomness integration, settlement verifier, frontend transaction construction, and upgrade controls.
- Formal properties/invariants: conservation of USDC, liability coverage, one settlement per ticket, immutable closed-draw rules, no post-cutoff entry, deterministic result mapping, and authorized-only treasury movement.
- Upgrade authority held by a role-separated multisig with timelock; emergency pause can stop new sales but cannot confiscate tickets or prize liabilities.
- Oracle and RPC diversity; no single Helius, frontend, scheduler, signer, or cloud dependency.
- Hardware-backed keys, least privilege, dual control, monitored treasury policies, and rehearsed recovery.
- Bug bounty before meaningful mainnet value.
- Daily proof-of-liabilities report: prize vaults + reserve versus unpaid tiers + rollover + pending withdrawals/refunds.
- Incident runbooks for oracle delay, Solana degradation, USDC freeze/depeg, KYC outage, wallet compromise, sanctions event, program exploit, and erroneous rules configuration.

## 13. Functional requirements and acceptance criteria

| ID | Requirement | Acceptance criterion |
|---|---|---|
| FR-01 | Eligibility | Ineligible, excluded, sanctioned, underage, or disallowed-location users cannot buy paid tickets |
| FR-02 | Ticket validation | Program rejects duplicate/out-of-range numbers, wrong price/mint, closed draw, stale rules, or replay |
| FR-03 | Receipt | Successful purchase returns draw ID, numbers, owner/claimant, amount, transaction signature, and finality state |
| FR-04 | Cutoff | No ticket can enter the committed accumulator after the rules-defined cutoff |
| FR-05 | Draw | Public verifier reproduces all six numbers byte-for-byte from published inputs |
| FR-06 | Bias control | No single operator key or randomness provider can select a result |
| FR-07 | Settlement | Property tests prove no double claim and payout conservation across all tier/winner counts |
| FR-08 | Solvency | Dashboard reconciles finalized vault balances and liabilities with zero unexplained variance |
| FR-09 | Wallets | Latest stable Phantom, Backpack, Solflare, and at least two other Wallet Standard wallets pass test matrix |
| FR-10 | Recovery | An oracle failure follows the committed fallback or refund path without admin result selection |
| FR-11 | Player safety | Limits and self-exclusion apply across all products within the regulator-required time |
| FR-12 | Audit trail | Every rules version, pause, authority change, draw input, result, and payout is timestamped and queryable |

## 14. Non-functional requirements

- **Availability:** 99.95% purchase API/UI target outside announced maintenance; chain outages handled honestly as degraded mode.
- **Performance:** p95 page interaction under 200 ms after load; p95 eligibility response under 2 s excluding vendor review; submitted transaction state visible within 3 s under normal network conditions.
- **Correctness:** financial values use integer base units; no floating-point prize calculation.
- **Finality:** UI distinguishes submitted, processed, confirmed, and finalized; prize state follows the approved finality policy.
- **Privacy:** encryption in transit/at rest, field-level protection for identity data, minimal retention, access audit logs.
- **Observability:** draw lifecycle, vault coverage, oracle deadlines, webhook lag, RPC divergence, failed purchases, settlements, and refunds have SLOs and paging thresholds.
- **Localization:** English-first with architecture for translated legal text, currency display, time zones, and right-to-left layouts.

## 15. Rollout roadmap and decision gates

### Phase 0 — legal and economic feasibility (6–12 weeks)

- choose one licensing jurisdiction and no more than two launch markets;
- obtain classification/licensing, stablecoin, token, tax, privacy, and marketing opinions;
- build the fully loaded unit-economic and capital-reserve model;
- shortlist two randomness providers and an independent testing lab;
- define corporate entity, banking/stablecoin rails, custody, insurance, and prize-fund segregation.

**Gate:** no devnet public beta or token sale until counsel confirms a lawful testing path and economics show adequate reserve/cost coverage.

### Phase 1 — protocol prototype (8–12 weeks)

- devnet programs, USDC test asset, draw simulator, ticket accumulator, multi-source entropy, settlement, refunds;
- public verifier and invariant/property test suite;
- wallet test matrix and sponsored-fee prototype;
- simulated load and at least 10,000 automated draws with adversarial cases.

**Gate:** zero unresolved critical/high security findings; deterministic reconciliation; fallback drills pass.

### Phase 2 — licensed closed beta (8–12 weeks)

- verified invite cohort in one permitted market;
- strict limits and small capped prizes;
- live compliance, support, treasury, incident response, and regulator/auditor reporting;
- no transferable token.

**Gate:** regulator approval, reserve coverage, draw and payout SLAs, responsible-gaming metrics, and independent audit sign-off.

### Phase 3 — production Mega 6/45 Daily

- controlled acquisition, published transparency dashboard, bug bounty, second RPC/provider failover;
- progressively increase sales/prize caps based on reserve and operating evidence;
- quarterly fairness, solvency, security, and player-protection reports.

### Phase 4 — product platform

- add new products only through a game-approval template covering math, take, caps, randomness, rules, jurisdiction, safety risk, and treasury impact;
- consider ecosystem token only after the business has real cross-product utility and completed legal gates.

## 16. Key risks and mitigations

| Risk | Severity | Primary mitigation |
|---|---|---|
| Unlicensed cross-border lottery | Existential | Market allowlist, licence-first rollout, legal opinions, geofencing/KYC |
| 40% gross allocation fails to produce 10% net margin | High | Full cost model, reserve model, B2B/white-label revenue, staged geography, stop/go gate |
| Jackpot or fixed-tier insolvency | Existential | Pari-mutuel accounting, segregated vaults, reserve, exposure caps, proof of liabilities |
| Randomness manipulation/stall | Existential | Precommitted multi-source protocol, deadlines, bonds, deterministic fallback/refund |
| Smart-contract exploit | Existential | Minimal programs, invariants, two audits, timelock, bounty, capped rollout |
| Token deemed security or harmful incentive | High | No v1 transferable token; no yield/revenue share; opinions before launch |
| Stablecoin freeze/depeg | High | Issuer/counterparty policy, monitoring, draw cancellation/refund rules, reserve diversification subject to licence |
| PII leakage | High | Offchain minimization, encryption, segregated identity systems, retention controls |
| RPC/indexer outage or false UI state | Medium | Multiple RPCs, finalized onchain authority, reconciliation, degraded-mode UX |
| Player harm | High | limits, exclusion, monitoring/intervention, marketing suppression, independent review |

## 17. Product KPIs

Commercial KPIs must be paired with safety and trust KPIs.

- verified-to-first-ticket conversion;
- 30/90-day payer retention, reported alongside net player loss;
- cost per verified payer and contribution margin after jurisdiction costs;
- gross protocol take and actual net operating margin;
- prize liability coverage ratio (target at least 100%, plus required reserve);
- purchase failure and duplicate-intent rate;
- draw finalization latency and oracle/fallback incidents;
- automatic payout time and reviewed-claim time;
- reconciliation variance (target zero);
- self-exclusion/limit adoption, intervention rate, and marketing-suppression compliance;
- verifier usage and independently reproduced draws;
- security findings and time to remediate.

## 18. Decisions required from the founder

1. Confirm that “10% profitable” means a 10% **gross take**, or authorize a higher take/other revenue to target 10% net margin.
2. Select the first licensing jurisdiction and first permitted player market; “global” remains the long-term distribution vision.
3. Approve USDC as the v1 price/prize asset and defer a transferable token.
4. Approve pari-mutuel lower tiers versus commissioning an actuarial model for fixed prizes.
5. Set the launch jackpot seed, maximum liability/cap, and reserve capital.
6. Decide whether daily cutoff/draw should be globally fixed at UTC or rotate for regional prime time.
7. Approve the multi-source randomness diligence budget, audits, testing lab, and public verifier.

## 19. Immediate diligence workstream

Produce these artifacts before implementation scope is locked:

1. jurisdiction matrix and signed legal memoranda;
2. 36-month unit-economics, cash, reserve, jackpot, and stress model;
3. formal game rules and actuarial simulation with popular-number correlation;
4. randomness threat model and provider scorecard;
5. Solana architecture and program-account specification;
6. treasury/custody and proof-of-liabilities policy;
7. responsible-gaming, AML, sanctions, geolocation, privacy, and incident policies;
8. clickable mobile UX prototype and usability test report;
9. token legal memo and staged token product brief—or a documented decision to remain tokenless;
10. implementation plan with milestones, acceptance tests, audit gates, owners, budget, and schedule.

## 20. Working assumptions and open questions

- “Mega 35/45” is assumed to mean a Mega-style **6/45** game; confirm if the intended selection count is different.
- One “ticket” is assumed to mean one six-number line at 1 USDC.
- The operator targets a 10% net operating margin from a 40% gross allocation, not guaranteed investment returns or a promise to token holders.
- The Helius API key exists but has not been requested or stored; implementation should use a secrets manager.
- Target legal entity, licensing jurisdiction, launch countries, jackpot seed, reserve capital, KYC vendor, on/off-ramp, oracle vendors, and token status remain undecided.


