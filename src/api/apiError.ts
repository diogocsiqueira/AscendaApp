export type ApiErrorResponse = {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  fields?: Record<string, string>;
};

export function getApiErrorMessage(
  err: any,
  fallback = "Ocorreu um erro. Tente novamente.",
) {
  const data = err?.response?.data as ApiErrorResponse | string | undefined;

  if (typeof data === "string") return data;

  if (data?.fields && Object.keys(data.fields).length > 0) {
    return Object.values(data.fields)[0];
  }

  if (data?.message) return data.message;

  if (data?.error) return data.error;

  if (err?.message) return err.message;

  return fallback;
}
