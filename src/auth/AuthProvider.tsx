import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { authApi } from "../api/authApi";
import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    saveAccessToken,
    saveRefreshToken,
} from "../api/http";

type User = {
  id: number;
  email: string;
  roles: string[];
};

type AuthContextType = {
  isLogged: boolean;
  loading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

declare global {
  var __forceLogout: (() => Promise<void>) | undefined;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  async function forceLogout() {
    await clearTokens();
    setUser(null);
    setIsLogged(false);
  }

  async function loadAuth() {
    try {
      const token = await getAccessToken();

      if (!token) {
        setUser(null);
        setIsLogged(false);
        return;
      }

      const response = await authApi.me();

      setUser(response.data);
      setIsLogged(true);
    } catch {
      await forceLogout();
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await authApi.login({ email, password });

    const { accessToken, refreshToken } = response.data;

    if (!accessToken || !refreshToken) {
      throw new Error("Tokens não retornados pelo backend");
    }

    await saveAccessToken(accessToken);
    await saveRefreshToken(refreshToken);

    const me = await authApi.me();

    setUser(me.data);
    setIsLogged(true);
  }

  async function register(email: string, password: string) {
    await authApi.register({ email, password });
    await forceLogout();
  }

  async function logout() {
    try {
      const refreshToken = await getRefreshToken();

      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {}

    await forceLogout();
  }

  useEffect(() => {
    globalThis.__forceLogout = forceLogout;

    return () => {
      globalThis.__forceLogout = undefined;
    };
  }, []);

  useEffect(() => {
    loadAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        loading,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
