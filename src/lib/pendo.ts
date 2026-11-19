export type PendoTrackProperties = Record<string, string | number | boolean | string[] | null>;

interface PendoAgent {
  track: (eventName: string, properties?: PendoTrackProperties) => void;
}

declare global {
  interface Window {
    pendo?: PendoAgent;
  }
}

// Sends a Pendo Track Event when the Pendo agent is loaded. Tracking failures
// never interrupt the app flow that triggered them.
export function trackEvent(eventName: string, properties?: PendoTrackProperties): void {
  try {
    window.pendo?.track(eventName, properties);
  } catch (err) {
    console.warn("Pendo track failed", err);
  }
}
