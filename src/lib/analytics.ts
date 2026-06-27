// Lightweight analytics hook (PRD §7.10). Sends to GA4 (gtag) and/or a
// dataLayer if present; otherwise no-ops. Swap in Plausible/Meta Pixel here.

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: EventParams) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...params });
  }
  if (process.env.NODE_ENV !== "production") {
    // Visible during development so tracking can be verified.
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, params);
  }
}
