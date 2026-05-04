import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { getApiErrorMessage } from "../api/apiError";
import {
    reportsApi,
    ReportsOverview,
    ReportsOverviewParams,
} from "../api/reportsApi";

type ReportsContextType = {
  overview: ReportsOverview | null;
  loading: boolean;
  error: string;
  loadOverview: (params?: Partial<ReportsOverviewParams>) => Promise<void>;
};

const ReportsContext = createContext({} as ReportsContextType);

function today() {
  return new Date().toISOString().slice(0, 10);
}

function firstDayOfMonth() {
  const date = new Date();
  date.setDate(1);
  return date.toISOString().slice(0, 10);
}

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [overview, setOverview] = useState<ReportsOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadOverview(params?: Partial<ReportsOverviewParams>) {
    try {
      setLoading(true);
      setError("");

      const response = await reportsApi.overview({
        startDate: params?.startDate ?? firstDayOfMonth(),
        endDate: params?.endDate ?? today(),
        categoryId: params?.categoryId ?? null,
      });

      setOverview(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Falha ao carregar relatórios."));
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(
    () => ({
      overview,
      loading,
      error,
      loadOverview,
    }),
    [overview, loading, error],
  );

  return (
    <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportsContext);
}
