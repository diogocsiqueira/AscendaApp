export const darkTheme = {
  name: "dark",
  bg: "#0F1115",
  surface: "#181B21",
  surface2: "#20242C",
  text: "#F4F4F5",
  muted: "#9CA3AF",
  border: "rgba(255,255,255,0.08)",
  primary: "#7C3AED",
  success: "#22C55E",
  danger: "#EF4444",
  warning: "#F59E0B",
};

export const lightTheme = {
  name: "light",
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  surface2: "#F3F4F6",
  text: "#111827",
  muted: "#6B7280",
  border: "rgba(17,24,39,0.08)",
  primary: "#7C3AED",
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",
};

export type AppTheme = typeof darkTheme;
