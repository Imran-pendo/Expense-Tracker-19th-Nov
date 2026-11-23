import { useCallback, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthContext } from "@/features/auth/hooks/auth-context";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface ProvidersProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: ProvidersProps) {
  const auth = useAuth();
  const { user, workspace, signOut } = auth;

  // Identify the signed-in visitor (and their active workspace as the account)
  // with Pendo whenever sign-in, sign-up, session restore, workspace changes,
  // or profile updates change the auth state.
  useEffect(() => {
    if (!user) return;
    pendo.identify({
      visitor: {
        id: user.id,
        full_name: user.displayName,
        username: user.username,
        displayName: user.displayName,
        createdAt: user.createdAt,
        workspaceId: workspace?.id ?? "",
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

  const signOutAndClearPendo = useCallback(() => {
    signOut();
    // Reset Pendo to a fresh anonymous visitor. clearSession isn't part of the
    // install stub, so guard against the agent not having loaded.
    if (typeof pendo.clearSession === "function") pendo.clearSession();
  }, [signOut]);

  return (
    <AuthContext.Provider value={{ ...auth, signOut: signOutAndClearPendo }}>{children}</AuthContext.Provider>
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <TooltipProvider>
      <AuthProvider>
        {children}
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </TooltipProvider>
  );
}
