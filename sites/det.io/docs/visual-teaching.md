# Visual teaching and research synthesis

Reviewed 3 October 2026. These additions are source changes for local review; publication is a separate action.

## Content structure

- `/research/human-machine-symbiosis`: portfolio synthesis, conditional economic loop, purchasing experiment, limits, six proposed investigations, and an evidence register.
- `/learn`: searchable and topic-filtered library of nine guides.
- `/learn/[slug]`: interactive mechanism first, explanation and assumptions, source links, knowledge check, and next guide.
- Homepage, research index, four program pages, and six research-topic pages expose relevant interactive explanations.

The synthesis connects identity, incentives, privacy, confidential computation, agent safety, protocol governance, and applied engineering. It does not claim a deployed integrated economy or new empirical findings.

## Research record

Reviewed the supplied economic argument, current published VirtEngine guides and documentation, DET.io research accounts, and existing site source on 3 October 2026.

Primary sources:

- [VirtEngine learning library](https://virtengine.com/learn): model for themed guides connected to deeper reference material.
- [Proposed tokenomics](https://docs.virtengine.com/concepts/tokenomics/): zero initial supply, human-linked eligibility, continued activity, governed allocation rules. Proposed policy, not live parameters or guaranteed income.
- [Marketplace](https://docs.virtengine.com/concepts/marketplace/): agreements and resource lifecycle; identity is offer-specific rather than universally required.
- [Escrow and settlement](https://docs.virtengine.com/concepts/escrow-settlement/): full agreed VCC provider payout; network transaction fees are separate. Also verified against the current local `_docs/billing-policy.md`.
- [VEID overview](https://docs.virtengine.com/veid/overview/): verification and scoped disclosure design.
- [DSEMA safety](https://det.io/research/multi-agent-safety) and [incentives](https://det.io/research/incentive-mechanism-design): published research account with specification references. The new synthesis does not independently validate the underlying specification or safety enforcement.
- [Bosun source](https://github.com/virtengine/bosun): experimental applied track, distinct from full DSEMA.
- [Acemoglu and Restrepo, 2019](https://www.nber.org/papers/w25684): task displacement and reinstatement; does not predict inevitable elimination of human labour.
- [IMF, 2024](https://www.elibrary.imf.org/view/journals/006/2024/001/article-A001-en.xml): exposure, substitution, complementarity, and distributional uncertainty.
- [Personhood credentials, 2024](https://arxiv.org/abs/2408.07892): privacy-oriented credentials and deployment challenges; not validation of VEID.

The broader human–machine symbiosis is an inference across these materials. Its research questions require testing purchasing capacity, conversion and VCC settlement, inclusion and recovery, reserve accumulation and outside funding, correlated evaluation failure, enforcement, and capture. Foundation corporate governance, protocol consensus, and proposed DSEMA controls remain separate.

The existing VirtEngine program page and FAQ had an older January MainNet/GO account. Updated both to the [current published roadmap](https://virtengine.com/network): planned January 2027 TestNet and March 2027 MainNet, subject to testing and fresh approval. Fixed mobile grid overflow discovered on the existing program page during the teaching-page checks.

## Teaching components

`TeachingVisual.astro` selects shared components. Content lives in `src/data/learning.ts`; presentation is in `src/styles/teaching.css`.

| Component | Reader changes | Informative result |
|---|---|---|
| ResearchAtlas | Participant selection, directly or through buttons | Highlighted dependencies, contribution, needs, status, and next guide |
| EconomicLab | Allocation, price, available compute | Accessible hours, supply/budget constraint, unspent units |
| SafetyLab | Proposed agent action | Independent authority, resource, and containment gates |
| SequenceLesson | Stage selection, previous/next, failure condition | Responsible actor, state change, evidence, and explanation of interruption |
| Guide quiz | Answer | Correctness and causal explanation; retry supported |

EconomicLab is a deterministic one-person, one-period teaching model using fictional credits. It assumes divisible hours and fixed posted prices; it does not calculate equilibrium, VE/VCC conversion, burn-and-mint dynamics, or living income.

## Adding or maintaining a lesson

Give every interaction an explanatory consequence. Stage changes must show what changes and why, rather than only animate a highlight. Include a failure or counterexample where useful. Show the model's scope and assumptions next to it, link to underlying evidence, and label proposals separately from demonstrated functionality.

Use native buttons, ranges, and checkboxes; preserve keyboard access, explicit state, visible focus, responsive layout, and reduced-motion operation. Provide a readable initial state and no-JavaScript explanations. Avoid animation as the only carrier of information. Preserve DET.io's existing brand assets and design tokens.

Checks: Astro build, link/fragment validation, accessibility budget, structured-data validation, design gate, type-error budget, plus browser interaction and desktop/mobile visual inspection. Static accessibility checks do not replace a full assistive-technology audit.

## Initial verification on 3 October 2026

- Astro built all 48 pages.
- Internal links: 5,792 references and 300 fragment references; no dead links or missing fragment targets.
- Static accessibility: no missing image alternatives, document languages, duplicate IDs, or heading-level skips.
- Structured data: 48 pages, 273 nodes, zero errors. Seventeen existing recommended-property warnings remain on older pages.
- Design gate passed. Type gate passed at its existing four-error budget; the four errors are existing nullability diagnostics in `src/scripts/navigation.ts`, with no new learning-code errors.
- Browser: all 22 routes with teaching visuals inspected at 1,440px and 390px, without horizontal document overflow after the grid repair.
- Exercised map and SVG selection, keyboard activation, library filtering and no-match feedback, budget/price/supply calculations and reset, all safety scenarios, all five original sequence lessons and failure/recovery paths, quiz feedback, and the economic loop's independent-reserve counterexample.
- Reduced-motion stage changes worked. With JavaScript disabled, the compute guide retained its stage explanations and knowledge-check answer.
- Desktop and mobile screenshots inspected. Element screenshot stability timed out on one mobile capture; viewport screenshots completed the visual inspection instead. Selection colours were also checked after style recalculation.

Reproducible local browser scripts and screenshots are under the ignored `output/playwright/` directory. The source changes and this maintainer record are versionable. The local preview is `http://127.0.0.1:4325/learn`; these checks do not claim deployment or full assistive-technology certification.

## Toolchain note

The declared Astro checker was not installed in the checkout. A frozen-lockfile install restored it but revealed a missing `@emnapi/runtime` peer in the installed checker dependency graph. It is now an explicit pinned development dependency so type checking can execute. The same missing peer was repaired in the VirtEngine public-site checkout. Existing TypeScript peer-range warnings remain separate from lesson code.

## Follow-up: economic conditions and native credit naming

The second supplied insight was treated as analysis to verify, not evidence of completed integration. The expanded synthesis distinguishes possible economic claims beyond wage competition from actual purchasing capacity, beneficiary control, and implemented enforcement. The term "human-rooted machine economy" describes a conditional research direction, not a deployed outcome.

- Native asset: VE / `uve`. Service-accounting unit: VirtEngine Compute Credit (VCC) / `uvcc`. Renamed conversion interfaces do not establish redemption or stable value.
- Source inspection: BME conversion handlers return pending; bank mint/burn helpers exist; billing transfers payments and burns only a configurable fee whose default is zero. No permanent resource-consumption sink is established by those paths.
- New `/learn/economic-invariants` guide and `CouplingLab`: gross burning versus reissuance, provider/agent common ownership, capture of a genuine human's 14-unit share, and five jointly relevant conditions with causal failure explanations. The conditions are not a calibrated probability model or a validated multiplicative score.
- New sources: the Idena reward/key-capture case study, Korinek & Juelfs work/distribution scenarios, code paths for BME handlers and billing, parameter defaults, and issuance-governance documentation. The displayed 14:1 split and future-eligibility protections are proposed policy/research ideas, not guaranteed public purchasing power.
- Source and provider wording were synchronized across DET.io, VirtEngine's public site and protocol documentation. The protocol audit and compatibility requirements are recorded in the VirtEngine repository's `_docs/compute-credit-naming.md`.

Follow-up validation:

- DET.io: 49-page build; 5,965 internal references and 308 fragments checked without broken targets; accessibility and design gates pass. Type checking now reports **zero errors and warnings**, after preserving the header's non-null type inside navigation callbacks. The type baseline was tightened to zero.
- Structured data: 279 nodes, zero errors; 17 pre-existing recommended-property warnings on older pages.
- Browser: burn/reissue/expansion arithmetic, common ownership, entitlement capture, all five condition switches, keyboard activation, quiz feedback and nine-guide discoverability pass. Responsive interactions and overflow checks pass at 320, 390, 768 and 1,440 pixels. Reduced motion and no-JavaScript explanations pass. Desktop/mobile screenshots were inspected. No page errors occurred in the completed checks.
- Existing atlas, economic-loop reserve counterexample, identity sequence and no-JavaScript compute explanations were rechecked after the rename.
- Other sites: VirtEngine builds 183 pages and protocol docs build 76 pages; both link/accessibility budgets pass. Protocol docs type-check with zero errors/warnings. VirtEngine's existing 112-error type budget is unchanged. Its accessibility baseline still includes 53 existing heading-level skips.
- The protocol-docs build wrapper now normalizes Windows PATH keys and fails if search output is absent. Verified Pagefind generation indexed 75 documentation pages. Starlight still emits an upstream Node `DEP0190` warning from its shell-based Pagefind invocation.
- Protocol: targeted BME, oracle, marketplace, SDK CLI/message, email and NLI checks; descriptor/inventory parity; TypeScript SDK build; 28 gas tests and 18 contract-parity tests. These do not certify live conversions, existing-chain migration or experimental Rust/Python SDKs.

No site or network was deployed. Existing signed requests and persisted asset balances require a coordinated version upgrade and an audited migration before adopting changed names/denominations on a running network.


## Navbar follow-up

The enhanced mobile menu now opens below the compact sticky header rather than expanding the header to viewport height. Mobile guide links use compact labels; introductory descriptions and the secondary feature card remain available in the desktop menu and the learning library. Browser checks pass at 320, 390, 768, 1099, 1100 and 1440 pixels for active-category visibility, category switching, last-guide navigation, search, Escape dismissal and horizontal overflow. The mobile header remains 75–79 pixels tall and the menu fits within an 800-pixel viewport. Build, links, static accessibility and zero-budget type checks pass. Evidence: output/playwright/verify-navbar-fix.js and navbar-mobile-fixed.png. This change is local and has not been deployed.
