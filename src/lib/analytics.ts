// Thin wrapper around the Pendo agent's Track Event API. The agent attaches
// the current visitor and account automatically, so callers pass only
// event-specific properties.

export type TrackEventProperties = Record<string, string | number | boolean | null | undefined>;

interface PendoAgent {
  track: (eventName: string, properties?: TrackEventProperties) => void;
}

declare global {
  interface Window {
    pendo?: PendoAgent;
  }
}

export function trackEvent(eventName: string, properties: TrackEventProperties = {}): void {
  try {
    window.pendo?.track(eventName, properties);
  } catch {
    // Analytics must never break the app flow.
  }
}
