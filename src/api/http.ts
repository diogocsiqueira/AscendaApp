import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://caixacontrol.onrender.com";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const http = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

const refreshHttp = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export async function saveAccessToken(token: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function saveRefreshToken(token: string) {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

http.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
}

function isAuthRoute(url?: string) {
  if (!url) return false;

  return (
    url.includes("/api/mobile/auth/login") ||
    url.includes("/api/mobile/auth/refresh") ||
    url.includes("/api/mobile/auth/logout") ||
    url.includes("/api/auth/register")
  );
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;

    if (
      !isUnauthorized ||
      originalRequest._retry ||
      isAuthRoute(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newAccessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(http(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();

      console.log("REFRESH: tem refresh?", !!refreshToken);

      if (!refreshToken) {
        await clearTokens();
        return Promise.reject(error);
      }

      const response = await refreshHttp.post("/api/mobile/auth/refresh", {
        refreshToken,
      });

      const newAccessToken = response.data?.accessToken;

      console.log("REFRESH: novo access?", !!newAccessToken);

      if (!newAccessToken) {
        await clearTokens();
        return Promise.reject(error);
      }

      await saveAccessToken(newAccessToken);

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return http(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await clearTokens();

      // força reload da sessão
      console.log("REFRESH FALHOU → deslogando");

      // ⚡ hack simples e eficaz
      setTimeout(() => {
        // força revalidação do AuthProvider
        globalThis.__forceLogout?.();
      }, 0);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
