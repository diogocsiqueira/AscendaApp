import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Transaction } from "../api/transactionsApi";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import Screen from "../components/Screen";
import { useTheme } from "../theme/ThemeProvider";
import { useTransactions } from "../transactions/TransactionsProvider";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date: string) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export default function TransactionsScreen({ navigation }: any) {
  const { theme } = useTheme();

  const { transactions, loading, error, loadTransactions, removeTransaction } =
    useTransactions();

  const [filter, setFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  const filteredTransactions = transactions.filter((item) => {
    if (filter === "ALL") return true;
    return item.type === filter;
  });

  async function handleDelete(item: Transaction) {
    await removeTransaction(item.id);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Transações</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Controle tudo que entrou e saiu.
        </Text>
      </View>

      <AppButton
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateTransaction")}
      >
        Nova transação
      </AppButton>

      <View style={styles.filters}>
        <AppButton
          variant={filter === "ALL" ? "primary" : "ghost"}
          style={styles.filterButton}
          onPress={() => setFilter("ALL")}
        >
          Todas
        </AppButton>

        <AppButton
          variant={filter === "INCOME" ? "primary" : "ghost"}
          style={styles.filterButton}
          onPress={() => setFilter("INCOME")}
        >
          Entradas
        </AppButton>

        <AppButton
          variant={filter === "EXPENSE" ? "primary" : "ghost"}
          style={styles.filterButton}
          onPress={() => setFilter("EXPENSE")}
        >
          Saídas
        </AppButton>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} />
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Carregando transações...
          </Text>
        </View>
      ) : error ? (
        <AppCard>
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
          <AppButton onPress={loadTransactions} style={styles.retry}>
            Tentar novamente
          </AppButton>
        </AppCard>
      ) : filteredTransactions.length === 0 ? (
        <AppCard>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Nenhuma transação ainda
          </Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Toque em “Nova transação” para registrar a primeira.
          </Text>
        </AppCard>
      ) : (
        <View style={styles.list}>
          {filteredTransactions.map((item) => {
            const isIncome = item.type === "INCOME";

            return (
              <AppCard key={item.id} style={styles.item}>
                <View style={styles.left}>
                  <View
                    style={[styles.circle, { backgroundColor: theme.surface2 }]}
                  >
                    <Ionicons
                      name={isIncome ? "arrow-down" : "arrow-up"}
                      size={18}
                      color={isIncome ? theme.success : theme.danger}
                    />
                  </View>

                  <View style={styles.info}>
                    <Text style={[styles.itemTitle, { color: theme.text }]}>
                      {item.name}
                    </Text>

                    <Text style={[styles.itemMeta, { color: theme.muted }]}>
                      {item.categoryName || "Sem categoria"} •{" "}
                      {formatDate(item.date)}
                    </Text>

                    {item.description ? (
                      <Text
                        style={[styles.description, { color: theme.muted }]}
                        numberOfLines={1}
                      >
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.right}>
                  <Text
                    style={[
                      styles.value,
                      { color: isIncome ? theme.success : theme.danger },
                    ]}
                  >
                    {isIncome ? "+" : "-"}
                    {formatMoney(item.amount)}
                  </Text>

                  <View style={styles.actions}>
                    <Pressable
                      style={styles.actionIcon}
                      onPress={() =>
                        navigation.navigate("CreateTransaction", { item })
                      }
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={18}
                        color={theme.muted}
                      />
                    </Pressable>

                    <Pressable
                      style={styles.actionIcon}
                      onPress={() => handleDelete(item)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={theme.danger}
                      />
                    </Pressable>
                  </View>
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
  header: {
    marginTop: 8,
    marginBottom: 14,
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
  filters: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  filterButton: {
    flex: 1,
    minHeight: 44,
  },
  list: {
    gap: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "900",
  },
  itemMeta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  right: {
    alignItems: "flex-end",
    gap: 8,
  },
  value: {
    fontWeight: "900",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionIcon: {
    padding: 4,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
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
});
