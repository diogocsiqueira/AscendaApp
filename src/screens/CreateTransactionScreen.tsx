import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getApiErrorMessage } from "../api/apiError";
import { categoriesApi, Category } from "../api/categoriesApi";
import { Transaction, TransactionType } from "../api/transactionsApi";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import Screen from "../components/Screen";
import { useTransactions } from "../providers/TransactionsProvider";
import { useTheme } from "../theme/ThemeProvider";

function todayBR() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${day}/${month}/${year}`;
}

function isoToBR(value?: string | null) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

function brDateToISO(value: string) {
  if (!value.trim()) return null;

  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length !== 8) {
    throw new Error("Informe a data no formato DD/MM/AAAA.");
  }

  const day = cleaned.slice(0, 2);
  const month = cleaned.slice(2, 4);
  const year = cleaned.slice(4, 8);

  const parsed = new Date(Number(year), Number(month) - 1, Number(day));

  const isValid =
    parsed.getFullYear() === Number(year) &&
    parsed.getMonth() === Number(month) - 1 &&
    parsed.getDate() === Number(day);

  if (!isValid) {
    throw new Error("Data inválida.");
  }

  return `${year}-${month}-${day}`;
}

function formatDateInput(value: string) {
  const cleaned = value.replace(/\D/g, "").slice(0, 8);

  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;

  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
}

function normalizeAmount(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  return Number(normalized);
}

function amountToInput(value?: number) {
  if (value == null) return "";
  return String(value).replace(".", ",");
}

export default function CreateTransactionScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { createTransaction, updateTransaction } = useTransactions();

  const editing = route.params?.item as Transaction | undefined;
  const isEditing = !!editing;

  const [type, setType] = useState<TransactionType>(editing?.type ?? "EXPENSE");
  const [name, setName] = useState(editing?.name ?? "");
  const [amount, setAmount] = useState(amountToInput(editing?.amount));
  const [description, setDescription] = useState(editing?.description ?? "");
  const [date, setDate] = useState(
    editing?.date ? isoToBR(editing.date) : todayBR(),
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(
    editing?.categoryId ?? null,
  );
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedCategory =
    categories.find((item) => item.id === categoryId) ?? null;

  async function loadCategories() {
    try {
      setLoadingCategories(true);

      const response = await categoriesApi.list();
      setCategories(response.data);

      if (!isEditing) {
        const defaultCategory = response.data.find((item) => item.isDefault);
        setCategoryId(defaultCategory?.id ?? null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Falha ao carregar categorias."));
    } finally {
      setLoadingCategories(false);
    }
  }

  async function handleSave() {
    try {
      setBusy(true);
      setError("");

      const parsedAmount = normalizeAmount(amount);
      const isoDate = brDateToISO(date);

      if (!name.trim()) {
        setError("Nome da transação é obrigatório.");
        return;
      }

      if (!parsedAmount || parsedAmount <= 0) {
        setError("Informe um valor válido.");
        return;
      }

      const payload = {
        name: name.trim(),
        type,
        amount: parsedAmount,
        categoryId,
        description: description.trim() || null,
        date: isoDate,
      };

      if (isEditing) {
        await updateTransaction(editing.id, payload);
      } else {
        await createTransaction(payload);
      }

      navigation.goBack();
    } catch (err) {
      setError(getApiErrorMessage(err, "Falha ao salvar transação."));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          style={[
            styles.backButton,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>

        <View>
          <Text style={[styles.title, { color: theme.text }]}>
            {isEditing ? "Editar transação" : "Nova transação"}
          </Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            {isEditing ? "Atualize os dados." : "Registra entrada ou saída."}
          </Text>
        </View>
      </View>

      <View style={styles.typeRow}>
        <Pressable
          style={[
            styles.typeButton,
            { backgroundColor: theme.surface, borderColor: theme.border },
            type === "EXPENSE" && {
              backgroundColor: theme.danger,
              borderColor: theme.danger,
            },
          ]}
          onPress={() => setType("EXPENSE")}
        >
          <Ionicons
            name="arrow-up"
            size={18}
            color={type === "EXPENSE" ? "#fff" : theme.danger}
          />
          <Text
            style={[
              styles.typeText,
              { color: theme.text },
              type === "EXPENSE" && { color: "#fff" },
            ]}
          >
            Saída
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.typeButton,
            { backgroundColor: theme.surface, borderColor: theme.border },
            type === "INCOME" && {
              backgroundColor: theme.success,
              borderColor: theme.success,
            },
          ]}
          onPress={() => setType("INCOME")}
        >
          <Ionicons
            name="arrow-down"
            size={18}
            color={type === "INCOME" ? "#fff" : theme.success}
          />
          <Text
            style={[
              styles.typeText,
              { color: theme.text },
              type === "INCOME" && { color: "#fff" },
            ]}
          >
            Entrada
          </Text>
        </Pressable>
      </View>

      <AppCard style={styles.form}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.muted }]}>Nome</Text>
          <AppInput
            placeholder="Ex: Mercado, salário, internet..."
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.muted }]}>Valor</Text>
          <AppInput
            placeholder="Ex: 89,90"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.muted }]}>Categoria</Text>

          <Pressable
            style={[
              styles.select,
              { backgroundColor: theme.surface2, borderColor: theme.border },
            ]}
            onPress={() => setCategoryOpen((prev) => !prev)}
          >
            <Text style={[styles.selectText, { color: theme.text }]}>
              {loadingCategories
                ? "Carregando categorias..."
                : (selectedCategory?.name ?? "Sem categoria")}
            </Text>

            <Ionicons
              name={categoryOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.muted}
            />
          </Pressable>

          {categoryOpen && !loadingCategories ? (
            <View
              style={[
                styles.dropdown,
                { backgroundColor: theme.surface2, borderColor: theme.border },
              ]}
            >
              <Pressable
                style={styles.option}
                onPress={() => {
                  setCategoryId(null);
                  setCategoryOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: categoryId === null ? theme.primary : theme.text,
                    },
                  ]}
                >
                  Sem categoria
                </Text>
              </Pressable>

              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={styles.option}
                  onPress={() => {
                    setCategoryId(category.id);
                    setCategoryOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          categoryId === category.id
                            ? theme.primary
                            : theme.text,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.muted }]}>
            Descrição opcional
          </Text>
          <AppInput
            placeholder="Ex: compra semanal"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.muted }]}>
            Data opcional
          </Text>
          <AppInput
            placeholder="DD/MM/AAAA"
            value={date}
            onChangeText={(value) => setDate(formatDateInput(value))}
            keyboardType="numeric"
            maxLength={10}
          />
          <Text style={[styles.hint, { color: theme.muted }]}>
            Deixe em branco para usar a data padrão do backend.
          </Text>
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        ) : null}

        <AppButton onPress={handleSave} style={styles.saveButton}>
          {busy
            ? "Salvando..."
            : isEditing
              ? "Salvar alterações"
              : "Salvar transação"}
        </AppButton>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 4,
    fontWeight: "700",
  },
  typeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  typeText: {
    fontWeight: "900",
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
  },
  hint: {
    fontSize: 12,
    fontWeight: "700",
  },
  select: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 15,
    fontWeight: "800",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "800",
  },
  error: {
    fontWeight: "800",
  },
  saveButton: {
    marginTop: 8,
  },
});
