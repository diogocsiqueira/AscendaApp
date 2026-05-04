import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Transaction } from "../api/transactionsApi";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import Screen from "../components/Screen";
import StatCard from "../components/StatCard";
import { useTransactions } from "../providers/TransactionsProvider";
import { useTheme } from "../theme/ThemeProvider";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function OverviewScreen() {
  const { theme } = useTheme();
  const { transactions, loading, error, loadTransactions } = useTransactions();

  const incomeTotal = transactions
    .filter((item) => item.type === "INCOME")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenseTotal = transactions
    .filter((item) => item.type === "EXPENSE")
    .reduce((sum, item) => sum + item.amount, 0);

  const monthBalance = incomeTotal - expenseTotal;
  const latestTransactions = transactions.slice(0, 3);

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={[styles.muted, { color: theme.muted }]}>
            Bem-vindo de volta
          </Text>
          <Text style={[styles.title, { color: theme.text }]}>Ascenda</Text>
        </View>
      </View>

      <AppCard style={styles.balanceCard}>
        <Text style={[styles.balanceLabel, { color: theme.muted }]}>
          Saldo do mês
        </Text>

        <Text
          style={[
            styles.balance,
            { color: monthBalance >= 0 ? theme.success : theme.danger },
          ]}
        >
          {formatMoney(monthBalance)}
        </Text>

        <Text style={[styles.balanceHint, { color: theme.muted }]}>
          Baseado nas transações do mês atual.
        </Text>
      </AppCard>

      <View style={styles.grid}>
        <StatCard
          label="Entradas"
          value={formatMoney(incomeTotal)}
          tone="success"
        />
        <StatCard
          label="Saídas"
          value={formatMoney(expenseTotal)}
          tone="danger"
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Últimas transações
      </Text>

      {loading ? (
        <AppCard>
          <View style={styles.loadingBox}>
            <ActivityIndicator color={theme.primary} />
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              Carregando...
            </Text>
          </View>
        </AppCard>
      ) : error ? (
        <AppCard>
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
          <AppButton onPress={loadTransactions} style={styles.retry}>
            Tentar novamente
          </AppButton>
        </AppCard>
      ) : latestTransactions.length === 0 ? (
        <AppCard>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Nenhuma transação ainda.
          </Text>
        </AppCard>
      ) : (
        <View style={styles.list}>
          {latestTransactions.map((item: Transaction) => {
            const isIncome = item.type === "INCOME";

            return (
              <AppCard key={item.id} style={styles.transaction}>
                <View style={styles.transactionInfo}>
                  <Text
                    style={[styles.transactionTitle, { color: theme.text }]}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={[styles.transactionCategory, { color: theme.muted }]}
                  >
                    {item.categoryName || "Sem categoria"}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.transactionValue,
                    { color: isIncome ? theme.success : theme.danger },
                  ]}
                >
                  {isIncome ? "+" : "-"}
                  {formatMoney(item.amount)}
                </Text>
              </AppCard>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    marginBottom: 20,
  },
  muted: {
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
  },
  balanceCard: {
    marginBottom: 14,
  },
  balanceLabel: {
    fontWeight: "800",
  },
  balance: {
    fontSize: 38,
    fontWeight: "900",
    marginTop: 8,
  },
  balanceHint: {
    fontWeight: "800",
    marginTop: 8,
  },
  grid: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
    paddingRight: 12,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "900",
  },
  transactionCategory: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  transactionValue: {
    fontWeight: "900",
  },
  emptyText: {
    fontWeight: "700",
  },
  error: {
    fontWeight: "800",
  },
  retry: {
    marginTop: 14,
  },
  loadingBox: {
    alignItems: "center",
    gap: 10,
  },
});
