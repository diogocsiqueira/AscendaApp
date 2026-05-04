import { http } from "./http";

type AuthPayload = {
  email: string;
  password: string;
};

type MobileLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

type AuthResponse = {
  accessToken: string;
};

export const authApi = {
  login(data: AuthPayload) {
    return http.post<MobileLoginResponse>("/api/mobile/auth/login", {
      ...data,
      deviceId: "mobile",
    });
  },

  register(data: AuthPayload) {
    return http.post<void>("/api/auth/register", data);
  },

  refresh(refreshToken: string) {
    return http.post<AuthResponse>("/api/mobile/auth/refresh", {
      refreshToken,
    });
  },

  logout(refreshToken: string) {
    return http.post<void>("/api/mobile/auth/logout", {
      refreshToken,
    });
  },

  me() {
    return http.get("/api/auth/me");
  },
};
