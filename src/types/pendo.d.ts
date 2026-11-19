type PendoMetadataValue = string | number | boolean | string[] | undefined;

interface PendoVisitor {
  id: string;
  [key: string]: PendoMetadataValue;
}

interface PendoAccount {
  id: string;
  [key: string]: PendoMetadataValue;
}

interface PendoIdentity {
  visitor: PendoVisitor;
  account?: PendoAccount;
}

interface Pendo {
  initialize: (options: PendoIdentity) => void;
  identify: (identity: PendoIdentity) => void;
  // The install snippet in index.html does not stub clearSession, so it is
  // undefined until the agent script has finished loading.
  clearSession?: () => void;
}

declare const pendo: Pendo;
