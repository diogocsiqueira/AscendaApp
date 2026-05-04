import { http } from "./http";

export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: number;
  name: string;
  type: TransactionType;
  amount: number;
  date: string;
  categoryId: number;
  categoryName: string;
  description?: string | null;
};

export type CreateTransactionPayload = {
  name: string;
  type: TransactionType;
  amount: number;
  date?: string | null;
  categoryId: number | null;
  description?: string | null;
};

export const transactionsApi = {
  list(month: string) {
    return http.get<Transaction[]>("/api/transactions", {
      params: { month },
    });
  },

  create(data: CreateTransactionPayload) {
    return http.post<Transaction>("/api/transactions", data);
  },

  update(id: number, data: CreateTransactionPayload) {
    return http.put<Transaction>(`/api/transactions/${id}`, data);
  },

  remove(id: number) {
    return http.delete<void>(`/api/transactions/${id}`);
  },
};
