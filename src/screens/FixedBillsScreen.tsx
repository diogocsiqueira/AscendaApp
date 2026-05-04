import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { FixedBillMonth } from "../api/fixedBillsApi";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import Screen from "../components/Screen";
import { useFixedBills } from "../fixedBills/FixedBillsProvider";
import { useTheme } from "../theme/ThemeProvider";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function normalizeAmount(value: string) {
  if (!value.trim()) return undefined;
  return Number(value.replace(/\./g, "").replace(",", "."));
}

export default function FixedBillsScreen({ navigation }: any) {
  const { theme } = useTheme();

  const {
    monthBills,
    loading,
    error,
    loadMonthBills,
    payFixedBill,
    unpayFixedBill,
    removeFixedBill,
  } = useFixedBills();

  const [payingId, setPayingId] = useState<number | null>(null);
  const [paidAmount, setPaidAmount] = useState("");
  const [actionError, setActionError] = useState("");

  const total = monthBills.reduce((sum, item) => sum + item.amount, 0);
  const paidTotal = monthBills
    .filter((item) => item.paid)
    .reduce((sum, item) => sum + item.amount, 0);

  function startPay(item: FixedBillMonth) {
    setActionError("");
    setPayingId(item.fixedBillId);
    setPaidAmount(String(item.amount).replace(".", ","));
  }

  async function confirmPay(item: FixedBillMonth) {
    try {
      setActionError("");

      const amount = normalizeAmount(paidAmount);

      if (amount != null && (!amount || amount <= 0)) {
        setActionError("Informe um valor pago válido.");
        return;
      }

      await payFixedBill(item.fixedBillId, amount);
      setPayingId(null);
      setPaidAmount("");
    } catch {
      setActionError("Falha ao marcar conta como paga.");
    }
  }

  async function handleDelete(item: FixedBillMonth) {
    await removeFixedBill(item.fixedBillId);
  }

  useEffect(() => {
    loadMonthBills();
  }, []);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Fixas</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Contas recorrentes do mês.
        </Text>
      </View>

      <AppButton
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateFixedBill")}
      >
        Nova conta fixa
      </AppButton>

      <View style={styles.grid}>
        <AppCard style={styles.stat}>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Total</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatMoney(total)}
          </Text>
        </AppCard>

        <AppCard style={styles.stat}>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Pago</Text>
          <Text style={[styles.statValue, { color: theme.success }]}>
            {formatMoney(paidTotal)}
          </Text>
        </AppCard>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} />
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Carregando contas...
          </Text>
        </View>
      ) : error ? (
        <AppCard>
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
          <AppButton onPress={loadMonthBills} style={styles.retry}>
            Tentar novamente
          </AppButton>
        </AppCard>
      ) : monthBills.length === 0 ? (
        <AppCard>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Nenhuma conta fixa
          </Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Toque em “Nova conta fixa” para cadastrar a primeira.
          </Text>
        </AppCard>
      ) : (
        <View style={styles.list}>
          {monthBills.map((item) => {
            const isPayingThis = payingId === item.fixedBillId;

            return (
              <AppCard key={item.fixedBillId} style={styles.item}>
                <View style={styles.topRow}>
                  <View style={styles.info}>
                    <Text style={[styles.itemTitle, { color: theme.text }]}>
                      {item.name}
                    </Text>

                    <Text style={[styles.meta, { color: theme.muted }]}>
                      {item.categoryName || "Sem categoria"} • vence dia{" "}
                      {item.dueDay}
                    </Text>
                  </View>

                  <View style={styles.right}>
                    <Text
                      style={[
                        styles.value,
                        { color: item.paid ? theme.success : theme.text },
                      ]}
                    >
                      {formatMoney(item.amount)}
                    </Text>

                    <View style={styles.actions}>
                      <Pressable
                        style={styles.actionIcon}
                        onPress={() =>
                          navigation.navigate("CreateFixedBill", { item })
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
                </View>

                {item.paid ? (
                  <View style={styles.paidBox}>
                    <View style={styles.paidInfo}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={theme.success}
                      />
                      <Text style={[styles.paidText, { color: theme.success }]}>
                        Pago
                      </Text>
                    </View>

                    <AppButton
                      variant="ghost"
                      style={styles.smallButton}
                      onPress={() => unpayFixedBill(item.fixedBillId)}
                    >
                      Desmarcar
                    </AppButton>
                  </View>
                ) : isPayingThis ? (
                  <View style={styles.payBox}>
                    <Text style={[styles.label, { color: theme.muted }]}>
                      Valor pago neste mês
                    </Text>

                    <AppInput
                      placeholder="Ex: 120,00"
                      value={paidAmount}
                      onChangeText={setPaidAmount}
                      keyboardType="decimal-pad"
                    />

                    <View style={styles.payActions}>
                      <AppButton
                        variant="ghost"
                        style={styles.actionButton}
                        onPress={() => {
                          setPayingId(null);
                          setPaidAmount("");
                        }}
                      >
                        Cancelar
                      </AppButton>

                      <AppButton
                        style={styles.actionButton}
                        onPress={() => confirmPay(item)}
                      >
                        Confirmar
                      </AppButton>
                    </View>
                  </View>
                ) : (
                  <AppButton
                    style={styles.fullButton}
                    onPress={() => startPay(item)}
                  >
                    Marcar como paga
                  </AppButton>
                )}

                {actionError && isPayingThis ? (
                  <Text style={[styles.error, { color: theme.danger }]}>
                    {actionError}
                  </Text>
                ) : null}
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
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  statValue: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: "900",
  },
  list: {
    gap: 10,
  },
  item: {
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  info: {
    flex: 1,
  },
  right: {
    alignItems: "flex-end",
    gap: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "900",
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
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
  paidBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  paidInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paidText: {
    fontWeight: "900",
  },
  payBox: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
  },
  payActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minHeight: 42,
  },
  fullButton: {
    minHeight: 42,
  },
  smallButton: {
    minHeight: 38,
    paddingHorizontal: 12,
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
