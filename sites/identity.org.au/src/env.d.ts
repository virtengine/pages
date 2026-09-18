/**
 * Cloudflare Turnstile is loaded at runtime from challenges.cloudflare.com by a
 * <script> tag in src/pages/launch.astro, not from npm, so its global has no type
 * anywhere. `astro check` therefore reports `Property 'turnstile' does not exist on
 * type 'Window & typeof globalThis'` at every use site.
 *
 * Only the surface the launch form actually calls is declared. If the form starts
 * using getResponse/remove, extend this file rather than reaching for `any`.
 */
declare global {
  interface TurnstileRenderOptions {
    sitekey: string;
    action?: string;
    theme?: "light" | "dark" | "auto";
    size?: "normal" | "compact" | "flexible";
    callback?: (token: string) => void;
    "error-callback"?: () => boolean | void;
    "expired-callback"?: () => void;
    "timeout-callback"?: () => void;
    "unsupported-callback"?: () => void;
  }

  interface Turnstile {
    render(container: HTMLElement | string, options: TurnstileRenderOptions): string;
    reset(widgetId?: string): void;
    getResponse(widgetId?: string): string;
    remove(widgetId?: string): void;
  }

  interface Window {
    turnstile?: Turnstile;
  }
}

export {};
