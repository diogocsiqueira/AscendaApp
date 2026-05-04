import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { getApiErrorMessage } from "../api/apiError";
import {
    CreateGoalContributionPayload,
    CreateGoalPayload,
    Goal,
    goalsApi,
} from "../api/goalsApi";

type GoalsContextType = {
  goals: Goal[];
  loading: boolean;
  error: string;
  loadGoals: () => Promise<void>;
  createGoal: (data: CreateGoalPayload) => Promise<void>;
  updateGoal: (id: number, data: CreateGoalPayload) => Promise<void>;
  removeGoal: (id: number) => Promise<void>;
  createContribution: (
    goalId: number,
    data: CreateGoalContributionPayload,
  ) => Promise<void>;
};

const GoalsContext = createContext({} as GoalsContextType);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadGoals() {
    try {
      setLoading(true);
      setError("");

      const response = await goalsApi.list();
      setGoals(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Falha ao carregar metas."));
    } finally {
      setLoading(false);
    }
  }

  async function createGoal(data: CreateGoalPayload) {
    const response = await goalsApi.create(data);
    setGoals((prev) => [response.data, ...prev]);
  }

  async function updateGoal(id: number, data: CreateGoalPayload) {
    const response = await goalsApi.update(id, data);

    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? response.data : goal)),
    );
  }

  async function removeGoal(id: number) {
    await goalsApi.remove(id);
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  }

  async function createContribution(
    goalId: number,
    data: CreateGoalContributionPayload,
  ) {
    await goalsApi.createContribution(goalId, data);

    const response = await goalsApi.findById(goalId);

    setGoals((prev) =>
      prev.map((goal) => (goal.id === goalId ? response.data : goal)),
    );
  }

  const value = useMemo(
    () => ({
      goals,
      loading,
      error,
      loadGoals,
      createGoal,
      updateGoal,
      removeGoal,
      createContribution,
    }),
    [goals, loading, error],
  );

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
}

export function useGoals() {
  return useContext(GoalsContext);
}
