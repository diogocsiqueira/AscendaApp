import { createContext, ReactNode, useContext, useState } from "react";
import { darkTheme, lightTheme } from "./themes";

type ThemeName = "light" | "dark";
type ThemeType = typeof darkTheme;

type ThemeContextValue = {
  theme: ThemeType;
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext({} as ThemeContextValue);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("dark");

  const theme = currentTheme === "dark" ? darkTheme : lightTheme;
  const isDark = currentTheme === "dark";

  function setTheme(nextTheme: ThemeName) {
    setCurrentTheme(nextTheme);
  }

  function toggleTheme() {
    setCurrentTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        setTheme,
        toggleTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
