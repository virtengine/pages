/** Educational state model only. No signatures, real credentials or network calls. */
export const SERVICES = {
  workspace: { name: "Example shared workspace", purpose: "Check eligibility for a member desk booking" },
  learning: { name: "Example learning service", purpose: "Check eligibility for a member workshop" },
} as const;

export type Service = keyof typeof SERVICES;
export type Scenario = "valid" | "expired" | "revoked" | "unknown" | "missing" | "lost" | "interrupted";
export type ResultCode = "accepted" | "declined" | "expired" | "revoked" | "unknown" | "missing" | "lost" | "request-expired" | "consent-revoked";
export interface Receipt {
  service: Service;
  purpose: string;
  requestId: string;
  disclosed: { membership_active: true };
}
export interface DemoState {
  service: Service;
  scenario: Scenario;
  sequence: number;
  pending: boolean;
  result: ResultCode | null;
  revoked: Service[];
  receipts: Receipt[];
}
export const initialState = (): DemoState => ({ service: "workspace", scenario: "valid", sequence: 0, pending: false, result: null, revoked: [], receipts: [] });
export function request(state: DemoState, service: Service, scenario: Scenario): DemoState {
  return { ...state, service, scenario, sequence: state.sequence + 1, pending: true, result: null };
}
export function decide(state: DemoState, approve: boolean): DemoState {
  if (!state.pending) return state;
  let result: ResultCode;
  if (!approve) result = "declined";
  else if (state.revoked.includes(state.service)) result = "consent-revoked";
  else if (state.scenario === "interrupted") result = "request-expired";
  else result = state.scenario === "valid" ? "accepted" : state.scenario;
  const receipts = result === "accepted" ? [...state.receipts, {
    service: state.service,
    purpose: SERVICES[state.service].purpose,
    requestId: `demo-request-${state.sequence}`,
    disclosed: { membership_active: true as const },
  }] : state.receipts;
  return { ...state, pending: false, result, receipts };
}
export function revoke(state: DemoState): DemoState {
  return { ...state, pending: false, result: "consent-revoked", revoked: [...new Set([...state.revoked, state.service])] };
}
export function restoreConsent(state: DemoState): DemoState {
  return { ...state, pending: false, result: null, revoked: state.revoked.filter((service) => service !== state.service) };
}
export const RESULTS: Record<ResultCode, { title: string; detail: string }> = {
  accepted: { title: "Example check accepted", detail: "This service receives membership_active: true and a request receipt. Your name, member number and source evidence are not included." },
  declined: { title: "You declined the request", detail: "No membership claim or success receipt was shared. A real service may record that its request was declined; use an alternative route if needed." },
  expired: { title: "Credential expired", detail: "The service cannot accept this credential. Renew it with the issuer before trying again." },
  revoked: { title: "Credential revoked by its issuer", detail: "Consent cannot make a revoked credential valid. Contact the issuer to resolve its status." },
  unknown: { title: "Issuer not accepted", detail: "A credential can have a valid signature and still come from an issuer this service does not trust." },
  missing: { title: "No matching credential", detail: "The wallet has no credential for this requirement. Obtain one from an accepted issuer or use the service's alternative process." },
  lost: { title: "Device recovery required", detail: "Do not bypass holder authentication. Restore access through an approved recovery process and reissue credentials where necessary." },
  "request-expired": { title: "Interrupted request expired", detail: "An old request must not be reused. Choose the available credential scenario and create a fresh request to continue." },
  "consent-revoked": { title: "Future sharing paused for this service", detail: "Fresh presentations are blocked in this model until you allow a new consent request. Previously shared receipts remain visible; revocation does not erase them." },
};
