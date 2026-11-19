import { useEffect, useRef } from "react";
import type { User, Workspace } from "@/types";

/**
 * Keeps Pendo in sync with the auth state.
 *
 * - When a visitor is signed in (session hydration, sign-up, sign-in,
 *   workspace changes, or profile refreshes), registers the visitor and their
 *   active workspace with pendo.identify.
 * - When the visitor signs out, resets Pendo to a fresh anonymous visitor so
 *   the next visitor isn't tracked under the previous identity.
 */
export function usePendoIdentity(user: User | null, workspace: Workspace | null): void {
  const wasSignedIn = useRef(false);

  useEffect(() => {
    if (!user) {
      if (wasSignedIn.current) {
        wasSignedIn.current = false;
        pendo.clearSession?.();
      }
      return;
    }

    wasSignedIn.current = true;
    pendo.identify({
      visitor: {
        id: user.id,
        full_name: user.displayName,
        username: user.username,
        displayName: user.displayName,
        createdAt: user.createdAt,
        workspaceId: workspace?.id,
      },
      ...(workspace && {
        account: {
          id: workspace.id,
          name: workspace.name,
          currency: workspace.currency,
          locale: workspace.locale,
          createdAt: workspace.createdAt,
        },
      }),
    });
  }, [user, workspace]);
}
