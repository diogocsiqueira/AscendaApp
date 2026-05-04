import { useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import Screen from "../components/Screen";
import { useGoals } from "../providers/GoalsProvider";
import { useTheme } from "../theme/ThemeProvider";

function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function GoalsScreen() {
  const { theme } = useTheme();
  const { goals, loading, error, loadGoals } = useGoals();

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <Screen
      style={styles.screen}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadGoals}
          tintColor={theme.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Metas</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Transforma vontade em plano.
        </Text>
      </View>

      <AppButton style={styles.createButton}>Nova meta</AppButton>

      {loading && goals.length === 0 ? (
        <ActivityIndicator color={theme.primary} />
      ) : null}

      {!!error && (
        <AppCard style={[styles.errorCard, { borderColor: theme.danger }]}>
          <Text style={[styles.errorText, { color: theme.danger }]}>
            {error}
          </Text>
        </AppCard>
      )}

      {!loading && goals.length === 0 ? (
        <AppCard>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Nenhuma meta ainda
          </Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Cria sua primeira meta pra acompanhar o progresso de verdade.
          </Text>
        </AppCard>
      ) : (
        <View style={styles.list}>
          {goals.map((goal) => {
            const percent = Math.round(goal.progressPercentage ?? 0);
            const safePercent = Math.min(Math.max(percent, 0), 100);

            return (
              <AppCard key={goal.id}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <Text style={[styles.goalName, { color: theme.text }]}>
                      {goal.name}
                    </Text>

                    {!!goal.description && (
                      <Text
                        numberOfLines={2}
                        style={[styles.goalDescription, { color: theme.muted }]}
                      >
                        {goal.description}
                      </Text>
                    )}
                  </View>

                  <Text style={[styles.percent, { color: theme.primary }]}>
                    {safePercent}%
                  </Text>
                </View>

                <Text style={[styles.goalMoney, { color: theme.muted }]}>
                  {money(goal.currentAmount)} de {money(goal.targetAmount)}
                </Text>

                <View style={[styles.bar, { backgroundColor: theme.surface2 }]}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${safePercent}%`,
                        backgroundColor: theme.primary,
                      },
                    ]}
                  />
                </View>

                <View style={styles.footer}>
                  <Text style={[styles.footerText, { color: theme.muted }]}>
                    Falta {money(goal.remainingAmount)}
                  </Text>

                  {!!goal.deadlineDate && (
                    <Text style={[styles.footerText, { color: theme.muted }]}>
                      Até {goal.deadlineDate.split("-").reverse().join("/")}
                    </Text>
                  )}
                </View>
              </AppCard>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 0,
  },
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
  createButton: {
    marginBottom: 18,
  },
  list: {
    gap: 12,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  goalInfo: {
    flex: 1,
    minWidth: 0,
  },
  goalName: {
    fontSize: 16,
    fontWeight: "900",
  },
  goalDescription: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  percent: {
    fontSize: 16,
    fontWeight: "900",
  },
  goalMoney: {
    marginTop: 12,
    fontWeight: "700",
  },
  bar: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 14,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "800",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  emptyText: {
    fontWeight: "700",
    lineHeight: 20,
  },
  errorCard: {
    marginBottom: 14,
  },
  errorText: {
    fontWeight: "800",
    lineHeight: 20,
  },
});
