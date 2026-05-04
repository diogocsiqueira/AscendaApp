import { http } from "./http";

export type ExpensesByCategory = {
  category: string;
  amount: number;
};

export type MonthlyBalance = {
  year: number;
  month: number;
  balance: number;
};

export type IncomeVsExpense = {
  year: number;
  month: number;
  income: number;
  expense: number;
};

export type ReportsOverview = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  pendingAmount: number;
  expensesByCategory: ExpensesByCategory[];
  monthlyBalance: MonthlyBalance[];
  incomeVsExpense: IncomeVsExpense[];
};

export type ReportsOverviewParams = {
  startDate: string;
  endDate: string;
  categoryId?: number | null;
};

export const reportsApi = {
  overview(params: ReportsOverviewParams) {
    return http.get<ReportsOverview>("/reports/overview", {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
        categoryId: params.categoryId ?? undefined,
      },
    });
  },
};
