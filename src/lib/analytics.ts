export type TrackEventProperties = Record<string, string | number | boolean>;

interface PendoAgent {
  track: (eventName: string, properties?: TrackEventProperties) => void;
}

declare global {
  interface Window {
    pendo?: PendoAgent;
  }
}

// Sends a Pendo Track Event when the Pendo agent is loaded. Tracking must
// never break the app, so a missing agent or a thrown error is ignored.
export function trackEvent(eventName: string, properties: TrackEventProperties = {}): void {
  try {
    window.pendo?.track(eventName, properties);
  } catch {
    // Ignore tracking failures.
  }
}
