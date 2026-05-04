import { StyleSheet, Text } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import AppCard from "./AppCard";

type Props = {
  label: string;
  value: string;
  tone?: "default" | "success" | "danger" | "warning";
};

export default function StatCard({ label, value, tone = "default" }: Props) {
  const { theme } = useTheme();

  const valueColor =
    tone === "success"
      ? theme.success
      : tone === "danger"
        ? theme.danger
        : tone === "warning"
          ? theme.warning
          : theme.text;

  return (
    <AppCard style={styles.card}>
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
      <Text
        style={[styles.value, { color: valueColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.68}
      >
        {value}
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
  },
  value: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "900",
  },
});
