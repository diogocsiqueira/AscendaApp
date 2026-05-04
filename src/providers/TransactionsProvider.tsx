import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { getApiErrorMessage } from "../api/apiError";
import {
    CreateTransactionPayload,
    Transaction,
    transactionsApi,
} from "../api/transactionsApi";

type TransactionsContextType = {
  transactions: Transaction[];
  loading: boolean;
  error: string;
  month: string;
  loadTransactions: () => Promise<void>;
  createTransaction: (data: CreateTransactionPayload) => Promise<void>;
  updateTransaction: (
    id: number,
    data: CreateTransactionPayload,
  ) => Promise<void>;
  removeTransaction: (id: number) => Promise<void>;
};

const TransactionsContext = createContext({} as TransactionsContextType);

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month] = useState(currentMonth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTransactions() {
    try {
      setLoading(true);
      setError("");

      const response = await transactionsApi.list(month);
      setTransactions(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Falha ao carregar transações."));
    } finally {
      setLoading(false);
    }
  }

  async function createTransaction(data: CreateTransactionPayload) {
    const response = await transactionsApi.create(data);
    setTransactions((prev) => [response.data, ...prev]);
  }

  async function updateTransaction(id: number, data: CreateTransactionPayload) {
    const response = await transactionsApi.update(id, data);

    setTransactions((prev) =>
      prev.map((item) => (item.id === id ? response.data : item)),
    );
  }

  async function removeTransaction(id: number) {
    await transactionsApi.remove(id);
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  }

  const value = useMemo(
    () => ({
      transactions,
      loading,
      error,
      month,
      loadTransactions,
      createTransaction,
      updateTransaction,
      removeTransaction,
    }),
    [transactions, loading, error, month],
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionsContext);
}
