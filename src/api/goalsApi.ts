import { http } from "./http";

export type GoalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export type Goal = {
  id: number;
  name: string;
  description?: string | null;
  targetAmount: number;
  initialAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  deadlineDate?: string | null;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateGoalPayload = {
  name: string;
  description?: string | null;
  targetAmount: number;
  initialAmount?: number;
  deadlineDate?: string | null;
};

export type GoalContributionType = "DEPOSIT" | "WITHDRAW";

export type CreateGoalContributionPayload = {
  type: GoalContributionType;
  amount: number;
  description?: string | null;
  contributionDate?: string | null;
  createTransaction?: boolean;
  transactionCategoryId?: number | null;
};

export const goalsApi = {
  list() {
    return http.get<Goal[]>("/api/goals");
  },

  findById(id: number) {
    return http.get<Goal>(`/api/goals/${id}`);
  },

  create(data: CreateGoalPayload) {
    return http.post<Goal>("/api/goals", data);
  },

  update(id: number, data: CreateGoalPayload) {
    return http.put<Goal>(`/api/goals/${id}`, data);
  },

  remove(id: number) {
    return http.delete<void>(`/api/goals/${id}`);
  },

  listContributions(goalId: number) {
    return http.get(`/api/goals/${goalId}/contributions`);
  },

  createContribution(goalId: number, data: CreateGoalContributionPayload) {
    return http.post(`/api/goals/${goalId}/contributions`, data);
  },
};
