/**
 * Cloudflare Turnstile global (`window.turnstile`).
 *
 * The widget script is loaded from
 * https://challenges.cloudflare.com/turnstile/v0/api.js, which attaches `turnstile`
 * to `window` at runtime. TypeScript cannot know that from the source alone, so
 * `astro check` reported ts(2339) "Property 'turnstile' does not exist on type
 * 'Window & typeof globalThis'" at every call site (6 errors across three sites).
 *
 * Shape follows Cloudflare's documented client-side Turnstile API:
 * https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 *
 * Mirrored verbatim in the three sites that embed the widget:
 *   sites/virtengine.com/src/types/turnstile.d.ts
 *   sites/det.io/src/types/turnstile.d.ts
 *   sites/identity.org.au/src/types/turnstile.d.ts
 * Keep them in sync: each site is a standalone pnpm project (no shared workspace
 * root), so this cannot be a single shared import. The CI type-check gate runs
 * against every site, so drift here breaks the build rather than hiding.
 */
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

interface Turnstile {
  /** Renders a widget and returns its widget id. */
  render(container: string | HTMLElement, options: TurnstileRenderOptions): string;
  /** Resets the widget (all widgets when called with no id). */
  reset(widgetId?: string): void;
  getResponse(widgetId?: string): string | undefined;
  remove(widgetId: string): void;
}

interface TurnstileRenderOptions {
  sitekey: string;
  action?: string;
  cData?: string;
  theme?: "light" | "dark" | "auto";
  language?: string;
  tabindex?: number;
  size?: "normal" | "compact" | "flexible";
  appearance?: "always" | "execute" | "interaction-only";
  retry?: "auto" | "never";
  "retry-interval"?: number;
  "refresh-expired"?: "auto" | "manual" | "never";
  "response-field"?: boolean;
  "response-field-name"?: string;
  callback?: (token: string) => void;
  "error-callback"?: (errorCode: string) => boolean | void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
  "unsupported-callback"?: () => void;
}

export {};
