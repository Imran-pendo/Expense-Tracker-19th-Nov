import { useCallback, useEffect, useState } from "react";
import {
  addContribution,
  createGoal,
  deleteGoal,
  getGoalsByWorkspaceId,
  updateGoal,
} from "@/lib/db/repositories/goals.repo";
import { useDataChanged } from "@/shared/lib/data-events";
import { trackEvent } from "@/lib/analytics";
import type { Goal, GoalContribution } from "@/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Module-level so a goal's completion is reported once per browser session,
// even if the Goals page unmounts and remounts.
const completedGoalIds = new Set<string>();

function totalSaved(goal: Goal): number {
  return goal.contributions.reduce((sum, c) => sum + c.amount, 0);
}

export interface UseGoalsReturn {
  goals: Goal[];
  isLoading: boolean;
  addGoal: (goal: Omit<Goal, "id" | "contributions" | "createdAt" | "updatedAt">) => Promise<void>;
  editGoal: (goal: Goal) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  /** Resolves with the goal as saved, including the new contribution. */
  contribute: (goalId: string, contribution: Omit<GoalContribution, "id">) => Promise<Goal>;
  reload: () => Promise<void>;
}

export function useGoals(workspaceId: string): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      setGoals(await getGoalsByWorkspaceId(workspaceId));
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useDataChanged(reload);

  const addGoal = useCallback(
    async (goal: Omit<Goal, "id" | "contributions" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      await createGoal({
        ...goal,
        id: crypto.randomUUID(),
        contributions: [],
        createdAt: now,
        updatedAt: now,
      });
      await reload();
    },
    [reload]
  );

  const editGoal = useCallback(
    async (goal: Goal) => {
      await updateGoal(goal);
      await reload();
    },
    [reload]
  );

  const removeGoal = useCallback(
    async (id: string) => {
      await deleteGoal(id);
      await reload();
    },
    [reload]
  );

  const contribute = useCallback(
    async (goalId: string, contribution: Omit<GoalContribution, "id">) => {
      const updated = await addContribution(goalId, { ...contribution, id: crypto.randomUUID() });
      const savedAfter = totalSaved(updated);
      const savedBefore = savedAfter - contribution.amount;
      // Milestone: this contribution is the one that reaches the target.
      if (
        savedBefore < updated.targetAmount &&
        savedAfter >= updated.targetAmount &&
        !completedGoalIds.has(updated.id)
      ) {
        completedGoalIds.add(updated.id);
        trackEvent("savings_goal_completed", {
          goalId: updated.id,
          targetAmount: updated.targetAmount,
          totalSaved: savedAfter,
          contributionCount: updated.contributions.length,
          daysToComplete: Math.max(0, Math.floor((Date.now() - new Date(updated.createdAt).getTime()) / MS_PER_DAY)),
          hadDeadline: !!updated.deadline,
          completedBeforeDeadline: updated.deadline ? contribution.date <= updated.deadline : null,
        });
      }
      await reload();
      return updated;
    },
    [reload]
  );

  return { goals, isLoading, addGoal, editGoal, removeGoal, contribute, reload };
}
