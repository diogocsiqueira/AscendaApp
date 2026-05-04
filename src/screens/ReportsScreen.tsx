import { StyleSheet, Text, View } from "react-native";
import AppCard from "../components/AppCard";
import Screen from "../components/Screen";
import StatCard from "../components/StatCard";
import { useTheme } from "../theme/ThemeProvider";

type CategoryReport = {
  label: string;
  value: number;
};

const categoryReports: CategoryReport[] = [];

export default function ReportsScreen() {
  const { theme } = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Relatórios</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Entenda pra onde sua grana tá indo.</Text>
      </View>

      <View style={styles.grid}>
        <StatCard label="Maior gasto" value="—" tone="danger" />
        <StatCard label="Economia" value="R$ 0,00" tone="success" />
      </View>

      <AppCard style={styles.chartCard}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Gastos por categoria</Text>

        {categoryReports.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.muted }]}>Sem dados suficientes para gerar gráficos.</Text>
        ) : (
          <View style={styles.chart}>
            {categoryReports.map((bar) => (
              <View key={bar.label} style={styles.barGroup}>
                <View style={[styles.barTrack, { backgroundColor: theme.surface2 }]}>
                  <View style={[styles.barFill, { height: `${bar.value}%`, backgroundColor: theme.primary }]} />
                </View>
                <Text style={[styles.barLabel, { color: theme.muted }]}>{bar.label}</Text>
              </View>
            ))}
          </View>
        )}
      </AppCard>

      <AppCard>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Resumo</Text>
        <Text style={[styles.text, { color: theme.muted }]}>Quando a API estiver integrada, o resumo financeiro aparece aqui.</Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 4,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  chartCard: {
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 16,
  },
  chart: {
    height: 170,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  barGroup: {
    alignItems: "center",
    gap: 8,
  },
  barTrack: {
    width: 36,
    height: 120,
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    borderRadius: 999,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  text: {
    lineHeight: 21,
    fontWeight: "600",
  },
  emptyText: {
    lineHeight: 21,
    fontWeight: "700",
  },
});
