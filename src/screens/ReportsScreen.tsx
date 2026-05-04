import { useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppCard from "../components/AppCard";
import Screen from "../components/Screen";
import StatCard from "../components/StatCard";
import { useReports } from "../providers/ReportsProvider";
import { useTheme } from "../theme/ThemeProvider";

function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function monthLabel(month: number) {
  return String(month).padStart(2, "0");
}

export default function ReportsScreen() {
  const { theme } = useTheme();
  const { overview, loading, error, loadOverview } = useReports();

  useEffect(() => {
    loadOverview();
  }, []);

  const maxCategoryAmount = Math.max(
    ...(overview?.expensesByCategory?.map((item) => item.amount) ?? [0]),
  );

  const maxMonthlyAmount = Math.max(
    ...(overview?.incomeVsExpense?.flatMap((item) => [
      item.income,
      item.expense,
    ]) ?? [0]),
  );

  const biggestExpense = overview?.expensesByCategory?.length
    ? overview.expensesByCategory.reduce((biggest, current) =>
        current.amount > biggest.amount ? current : biggest,
      )
    : null;

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => loadOverview()}
          tintColor={theme.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Relatórios</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Entenda pra onde sua grana tá indo.
        </Text>
      </View>

      <View style={styles.grid}>
        <StatCard
          label="Receitas"
          value={money(overview?.totalIncome ?? 0)}
          tone="success"
        />

        <StatCard
          label="Despesas"
          value={money(overview?.totalExpense ?? 0)}
          tone="danger"
        />
      </View>

      <View style={styles.grid}>
        <StatCard
          label="Saldo"
          value={money(overview?.balance ?? 0)}
          tone={(overview?.balance ?? 0) >= 0 ? "success" : "danger"}
        />

        <StatCard
          label="Pendentes"
          value={money(overview?.pendingAmount ?? 0)}
          tone="warning"
        />
      </View>

      {loading && !overview ? (
        <ActivityIndicator color={theme.primary} style={styles.loader} />
      ) : null}

      {!!error && (
        <AppCard style={[styles.errorCard, { borderColor: theme.danger }]}>
          <Text style={[styles.errorText, { color: theme.danger }]}>
            {error}
          </Text>
        </AppCard>
      )}

      <AppCard style={styles.chartCard}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Gastos por categoria
        </Text>

        {!overview?.expensesByCategory?.length ? (
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Sem dados suficientes para gerar gráficos.
          </Text>
        ) : (
          <View style={styles.chart}>
            {overview.expensesByCategory.map((item) => {
              const height =
                maxCategoryAmount > 0
                  ? Math.max((item.amount / maxCategoryAmount) * 100, 8)
                  : 0;

              return (
                <View key={item.category} style={styles.barGroup}>
                  <View
                    style={[
                      styles.barTrack,
                      { backgroundColor: theme.surface2 },
                    ]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${height}%`,
                          backgroundColor: theme.primary,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={[styles.barLabel, { color: theme.muted }]}
                  >
                    {item.category}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={[styles.barValue, { color: theme.text }]}
                  >
                    {money(item.amount)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </AppCard>

      <AppCard style={styles.chartCard}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Receitas x despesas
        </Text>

        {!overview?.incomeVsExpense?.length ? (
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Sem histórico suficiente para comparar receitas e despesas.
          </Text>
        ) : (
          <View style={styles.monthlyList}>
            {overview.incomeVsExpense.map((item) => {
              const incomeWidth =
                maxMonthlyAmount > 0
                  ? Math.max((item.income / maxMonthlyAmount) * 100, 2)
                  : 0;

              const expenseWidth =
                maxMonthlyAmount > 0
                  ? Math.max((item.expense / maxMonthlyAmount) * 100, 2)
                  : 0;

              return (
                <View
                  key={`${item.year}-${item.month}`}
                  style={styles.monthRow}
                >
                  <Text style={[styles.monthText, { color: theme.text }]}>
                    {monthLabel(item.month)}/{item.year}
                  </Text>

                  <View style={styles.monthBars}>
                    <View
                      style={[
                        styles.horizontalTrack,
                        { backgroundColor: theme.surface2 },
                      ]}
                    >
                      <View
                        style={[
                          styles.horizontalFill,
                          {
                            width: `${incomeWidth}%`,
                            backgroundColor: theme.success,
                          },
                        ]}
                      />
                    </View>

                    <View
                      style={[
                        styles.horizontalTrack,
                        { backgroundColor: theme.surface2 },
                      ]}
                    >
                      <View
                        style={[
                          styles.horizontalFill,
                          {
                            width: `${expenseWidth}%`,
                            backgroundColor: theme.danger,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.legend}>
          <Text style={[styles.legendText, { color: theme.success }]}>
            Receita
          </Text>
          <Text style={[styles.legendText, { color: theme.danger }]}>
            Despesa
          </Text>
        </View>
      </AppCard>

      <AppCard>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Resumo</Text>

        <Text style={[styles.text, { color: theme.muted }]}>
          Maior gasto:{" "}
          <Text style={{ color: theme.text }}>
            {biggestExpense
              ? `${biggestExpense.category} — ${money(biggestExpense.amount)}`
              : "—"}
          </Text>
        </Text>

        <Text style={[styles.text, { color: theme.muted }]}>
          Resultado do período:{" "}
          <Text
            style={{
              color:
                (overview?.balance ?? 0) >= 0 ? theme.success : theme.danger,
              fontWeight: "900",
            }}
          >
            {money(overview?.balance ?? 0)}
          </Text>
        </Text>
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
  loader: {
    marginVertical: 12,
  },
  errorCard: {
    marginBottom: 14,
  },
  errorText: {
    fontWeight: "800",
    lineHeight: 20,
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
    minHeight: 190,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: 10,
  },
  barGroup: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    minWidth: 48,
  },
  barTrack: {
    width: 34,
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
    fontSize: 11,
    fontWeight: "800",
    maxWidth: 70,
  },
  barValue: {
    fontSize: 10,
    fontWeight: "900",
    maxWidth: 80,
  },
  monthlyList: {
    gap: 14,
  },
  monthRow: {
    gap: 8,
  },
  monthText: {
    fontSize: 12,
    fontWeight: "900",
  },
  monthBars: {
    gap: 6,
  },
  horizontalTrack: {
    height: 9,
    borderRadius: 999,
    overflow: "hidden",
  },
  horizontalFill: {
    height: "100%",
    borderRadius: 999,
  },
  legend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 14,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "900",
  },
  text: {
    lineHeight: 22,
    fontWeight: "700",
  },
  emptyText: {
    lineHeight: 21,
    fontWeight: "700",
  },
});
