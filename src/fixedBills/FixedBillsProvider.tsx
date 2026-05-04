import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { getApiErrorMessage } from "../api/apiError";
import {
    CreateFixedBillPayload,
    FixedBill,
    FixedBillMonth,
    fixedBillsApi,
} from "../api/fixedBillsApi";

type FixedBillsContextType = {
  fixedBills: FixedBill[];
  monthBills: FixedBillMonth[];
  loading: boolean;
  error: string;
  month: string;
  loadFixedBills: () => Promise<void>;
  loadMonthBills: () => Promise<void>;
  createFixedBill: (data: CreateFixedBillPayload) => Promise<void>;
  updateFixedBill: (id: number, data: CreateFixedBillPayload) => Promise<void>;
  removeFixedBill: (id: number) => Promise<void>;
  payFixedBill: (billId: number, amount?: number) => Promise<void>;
  unpayFixedBill: (billId: number) => Promise<void>;
};

const FixedBillsContext = createContext({} as FixedBillsContextType);

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function FixedBillsProvider({ children }: { children: ReactNode }) {
  const [fixedBills, setFixedBills] = useState<FixedBill[]>([]);
  const [monthBills, setMonthBills] = useState<FixedBillMonth[]>([]);
  const [month] = useState(currentMonth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadFixedBills() {
    try {
      setLoading(true);
      setError("");
      const response = await fixedBillsApi.list();
      setFixedBills(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Falha ao carregar contas fixas."));
    } finally {
      setLoading(false);
    }
  }

  async function loadMonthBills() {
    try {
      setLoading(true);
      setError("");
      const response = await fixedBillsApi.listMonth(month);
      setMonthBills(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Falha ao carregar contas do mês."));
    } finally {
      setLoading(false);
    }
  }

  async function createFixedBill(data: CreateFixedBillPayload) {
    const response = await fixedBillsApi.create(data);
    setFixedBills((prev) => [response.data, ...prev]);
    await loadMonthBills();
  }

  async function updateFixedBill(id: number, data: CreateFixedBillPayload) {
    const response = await fixedBillsApi.update(id, data);

    setFixedBills((prev) =>
      prev.map((item) => (item.id === id ? response.data : item)),
    );

    await loadMonthBills();
  }

  async function removeFixedBill(id: number) {
    await fixedBillsApi.remove(id);
    setFixedBills((prev) => prev.filter((item) => item.id !== id));
    setMonthBills((prev) => prev.filter((item) => item.fixedBillId !== id));
  }

  async function payFixedBill(billId: number, amount?: number) {
    const response = await fixedBillsApi.pay(month, billId, amount);

    setMonthBills((prev) =>
      prev.map((item) => (item.fixedBillId === billId ? response.data : item)),
    );
  }

  async function unpayFixedBill(billId: number) {
    const response = await fixedBillsApi.unpay(month, billId);

    setMonthBills((prev) =>
      prev.map((item) => (item.fixedBillId === billId ? response.data : item)),
    );
  }

  const value = useMemo(
    () => ({
      fixedBills,
      monthBills,
      loading,
      error,
      month,
      loadFixedBills,
      loadMonthBills,
      createFixedBill,
      updateFixedBill,
      removeFixedBill,
      payFixedBill,
      unpayFixedBill,
    }),
    [fixedBills, monthBills, loading, error, month],
  );

  return (
    <FixedBillsContext.Provider value={value}>
      {children}
    </FixedBillsContext.Provider>
  );
}

export function useFixedBills() {
  return useContext(FixedBillsContext);
}
