type PendoMetadataValue = string | number | boolean | string[] | null | undefined;

interface PendoMetadata {
  id: string;
  [key: string]: PendoMetadataValue;
}

interface PendoIdentity {
  visitor: PendoMetadata;
  account?: PendoMetadata;
}

interface PendoAgent {
  initialize: (options: PendoIdentity & Record<string, unknown>) => void;
  identify: (identity: PendoIdentity) => void;
  updateOptions: (identity: PendoIdentity) => void;
  // Not stubbed by the install snippet, so it is undefined until the agent loads.
  clearSession?: () => void;
  track: (name: string, properties?: Record<string, unknown>) => void;
}

declare const pendo: PendoAgent;
