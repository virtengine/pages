# Reusable verification pilot — discussion pack

Version 0.1 · 9 October 2026 · Prepared by DETIO Foundation

Status: proposal for discussion. No partner, participant, price, delivery date or production service is confirmed. No government accreditation or card-network endorsement is claimed. This document is not an executed agreement.

## One-page proposition

Prove what a service needs. Share less of your identity.

identity.org.au is the wallet experience; VEID is verification infrastructure; DETIO Foundation is the steward. The proposed pilot tests whether a reusable membership credential can reduce repeated checks and unnecessary collection across two services.

Suggested workflow: an accountable organisation issues an active-membership credential. A person presents a membership answer to book a desk with one service and join a workshop with another. The services accept that issuer for those purposes. Each request needs a separate user decision. This does not establish age, government identity or financial KYC.

Available today in this package: local educational simulation, proposed policy, illustrative integration and evaluation materials. Unavailable: production wallet/verifier service, real credential issuance, verified interoperability and independent production assurance.

Demo: https://identity.org.au/for-services/demo
Proposal: https://identity.org.au/for-services/pilot
Contact: hello@det.io — do not attach identity documents or participant records.

## Proposed issuer trust policy

Before an issuer is admitted, document its legal identity, accountable contacts, authority for each claim, evidence process, eligibility criteria, holder binding, correction process and complaints route. Agree permitted credential types and assurance, formats, validity, signing-key custody, rotation, compromise response, status publication and revocation. Determine applicable privacy, security, accessibility and regulatory requirements.

Trust is purpose-specific. A membership issuer is not automatically trusted for financial identity, age or residency. Each relying service records the issuers and credential types it accepts. There is no general “approved institution” badge from participating in a pilot.

Before accepting a presentation, validate signature and approved issuer key, issuer admission for that claim, holder binding, request/audience/challenge/session binding, time validity, credential status and the user's current decision. A cryptographically valid statement from an unaccepted issuer must be rejected. Required unavailable status checks fail closed or route to the disclosed alternative process.

Suspension, compromise, correction and device loss need explicit procedures. Revoking an issuer credential and withdrawing holder consent are distinct actions. Neither erases previously received records by itself.

## Proposed data-flow and retention decisions

1. Issuer checks membership and issues the credential to the wallet. Record what evidence the issuer retains and why.
2. Service sends an authenticated request with purpose, minimum claim, fresh challenge and retention information.
3. Wallet shows the service and request. User approves or declines.
4. Approved presentation gives the service the membership answer and necessary verification material; it excludes names, member numbers and source documents for this workflow.
5. Service validates the presentation and retains only the agreed lawful receipt.

The browser demonstration keeps fictional data in memory, sends no demo claims to a server and resets on reload. Its “accepted” outcome is simulated; it performs no cryptographic verification. It writes no blockchain records.

Before a real pilot, document every production actor and location: issuer evidence, wallet storage, verifier receipts, logs, status services, backups, analytics, keys and any chain metadata. Agree retention periods, deletion limits and responsibility for requests. Public identifiers, status lookups and timing can enable correlation even when document contents are absent. Do not promise anonymity or complete deletion of immutable records.

## Illustrative integration contract

The educational JSON is not a production API or an OpenID4VP message. Do not accept these fixtures in a production verifier.

```json
{
  "demo_only": true,
  "profile": "illustrative-membership-v0.1",
  "request_id": "demo-request-1",
  "verifier": "example-workspace",
  "purpose": "Check eligibility for a member desk booking",
  "claim": "membership_active",
  "accepted_issuer": "example-membership-association",
  "fresh_challenge": "GENERATE_AND_BIND_IN_PRODUCTION",
  "retention": "AGREE_BEFORE_REAL_PILOT"
}
```

```json
{
  "demo_only": true,
  "request_id": "demo-request-1",
  "outcome": "accepted",
  "disclosed": { "membership_active": true },
  "verification": "SIMULATED_NOT_CRYPTOGRAPHICALLY_VERIFIED"
}
```

Evaluate the target credential format and trust profile. OpenID4VCI and OpenID4VP are candidates for issuance and presentation; support has to be implemented and independently tested. Protocol support does not confer EUDI recognition or AGDIS approval.

Required error/recovery journeys: refusal; expired or revoked credential; unaccepted issuer; missing credential; interrupted/stale request; replay; lost device; inaccessible device; issuer/key compromise; status service outage; withdrawn consent; correction; lawful retention after withdrawal. Provide an equivalent alternative process and an accessible complaint/support route.

## Proposed evaluation plan

First agree the eligibility rule, population, sample size, observation period and success thresholds with the services. Do not select thresholds after seeing results. Start with synthetic data and a rehearsal; invite real participants only after assurance and agreement gates pass.

Use each service's current process as baseline with the same eligibility requirement. Account for device mix, accessibility needs, existing membership and assisted users. Prefer comparable cohorts or a controlled crossover where appropriate. Record denominator, failures and reasons; disclose any selection bias and uncertainty.

| Measure | Definition | Interpretation |
| --- | --- | --- |
| Completion | Completed useful eligibility decisions / started eligible attempts | Report first use and repeat use separately |
| Time to useful result | From starting the request to an accepted result | Report median and tail, not only fastest cases |
| Repeat-use completion | Successful presentations at a second service / users attempting the second service | Tests reuse rather than signups |
| Collection | Fields, document copies and identifiers retained by each actor | Include logs, status services and backups |
| Abandonment | Attempts ending before useful result / attempts started | Classify where and why |
| Support | Contacts and staff minutes per completed decision | Include assisted and recovery cases |
| Recovery | Successful recoveries / attempted recoveries, plus time and failures | Never bypass holder checks to improve rates |
| Integration | Engineer time and operational dependencies for each service | Record one-time and recurring effort separately |
| Cost | Agreed attributable cost / completed useful decisions | State included costs and assumptions |

Collect only the evaluation data needed. Agree consent, lawful basis, retention, access, redaction and publication beforehand. Do not put real identity evidence in analytics or bug reports. A small usability pilot cannot establish rare-fraud rates, general KYC compliance or population-wide accessibility.

Pre-agree stop conditions: sensitive-data leakage, suspected compromise, uncontrolled invalid acceptance, missing required status checks, serious accessibility exclusion or failures exceeding agreed thresholds. Pause new presentations, preserve proportionate incident evidence and follow the agreed notification/response process.

## Pilot agreement heads of terms — draft, not for signature

These are discussion headings for a properly reviewed agreement. No responsibilities are assigned until parties accept them.

- Parties and contacts: issuer [to agree], service A [to agree], service B [to agree], delivery operator(s) [to agree].
- Scope: exact credential, claim, eligibility decisions, devices, participant population, exclusions and alternative process [to agree].
- Roles: issuer evidence and status; service eligibility and retention; wallet/infrastructure operation; privacy, security, support and incidents [to agree].
- Readiness: approved production adapters, trusted issuance, authentication, recovery, independent checks and relevant assessments [evidence required].
- Data: lawful basis, notices, consent, data inventory, locations, subprocessors, retention, deletion, access and breach handling [to agree].
- Commercial terms: funded work, budget, payment triggers, third-party costs and changes [to agree; no costs authorised by this draft].
- Evaluation: baseline, methodology, sample size, thresholds, stop conditions and who reviews results [to agree].
- Liability and assurance: warranties, responsibilities, insurance, limitations and applicable laws [professional review required].
- Intellectual property: existing software licences, new work, patent licensing where relevant and permitted use [to agree].
- Publication: approval for names, logos, case studies, results and any public claims [written agreement required].
- Withdrawal and closure: termination, participant exit, alternative route, credential expiry/revocation, data disposition and continued support [to agree].

## Buyer interview guide

Talk with approximately ten prospective buyers before broad consumer acquisition. Ask about a real recent workflow, not hypothetical enthusiasm.

1. What eligibility/identity decision do you make, and what evidence is required?
2. How often do existing users repeat that check, and what are measured failure/support costs?
3. Which issuers would you accept, for which claims and assurance?
4. What information must you retain, and what can you avoid collecting?
5. What would block procurement: assurance, integration, jurisdiction, recovery, cost or support?
6. Would a paid pilot solve an owned problem? Who approves it and against which measurable result?

Record objections, alternatives, budget owner and the next agreed action. Do not count a conversation as a partner commitment.

## Readiness and evidence register

| Item | Current package status | Required evidence before real launch |
| --- | --- | --- |
| Consent demonstration | Implemented local model | Production authentication, requests and accessible real-device flow |
| Membership reuse | Fictional scenario | Accepted issuer and two willing services with actual issuance/presentation |
| Mobile security adapters | Reference dependencies remain | Working encryption, ML/attestation and supported devices for the selected journey |
| Credential/proof verification | Not performed by demo | Issuer/holder binding, secure commitment where used, freshness and status checks |
| Interoperability | Proposed | Selected profile and independent implementation tests |
| Recovery | Educational failure case | Approved recovery/reissuance process and device-loss tests |
| Data minimisation | Proposed claim boundary | End-to-end inventory, logs/backups review and retention policy |
| Business savings | Hypothesis | Comparable measured baseline and pilot results |
| Accreditation | No accreditation claimed | Applicable regulator decision; AGDIS approval separately if sought |
| Distribution | No partners confirmed | Signed pilot or commercial arrangements |

## Authoritative reference points

- OpenID4VP: https://openid.net/specs/openid-4-verifiable-presentations-1_0.html
- OpenID4VCI: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html
- Australian regulator forms: https://www.digitalidsystem.gov.au/digital-id-accreditation/digital-id-regulator-forms
- Australian private participation announcement: https://ministers.finance.gov.au/financeminister/media-release/2026/06/26/digital-id-expands-private-sector
- AUSTRAC due diligence: https://www.austrac.gov.au/industry-and-business/obligations-and-guidance/your-amlctf-program/customer-due-diligence
- EU regulation: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401183

Visa and Mastercard are industry examples, not project partners. No recognition, sponsorship or approved payment-network path is implied.
