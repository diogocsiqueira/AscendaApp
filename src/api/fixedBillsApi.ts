import { http } from "./http";

export type FixedBill = {
  id: number;
  name: string;
  amount: number;
  dueDay: number;
  categoryId: number;
  categoryName: string;
  active: boolean;
};

export type FixedBillMonth = {
  fixedBillId: number;
  name: string;
  amount: number;
  defaultAmount: number;
  dueDay: number;
  categoryId: number;
  categoryName: string;
  paid: boolean;
  paidAt: string | null;
};

export type CreateFixedBillPayload = {
  name: string;
  amount: number;
  dueDay: number;
  categoryId: number | null;
};

export const fixedBillsApi = {
  list() {
    return http.get<FixedBill[]>("/api/fixed-bills");
  },

  create(data: CreateFixedBillPayload) {
    return http.post<FixedBill>("/api/fixed-bills", data);
  },

  update(id: number, data: CreateFixedBillPayload) {
    return http.put<FixedBill>(`/api/fixed-bills/${id}`, data);
  },

  remove(id: number) {
    return http.delete<void>(`/api/fixed-bills/${id}`);
  },

  listMonth(month: string) {
    return http.get<FixedBillMonth[]>(`/api/months/${month}/fixed-bills`);
  },

  pay(month: string, billId: number, amount?: number) {
    const body = amount != null ? { amount } : {};

    return http.post<FixedBillMonth>(
      `/api/months/${month}/fixed-bills/${billId}/pay`,
      body,
    );
  },

  unpay(month: string, billId: number) {
    return http.post<FixedBillMonth>(
      `/api/months/${month}/fixed-bills/${billId}/unpay`,
    );
  },
};
