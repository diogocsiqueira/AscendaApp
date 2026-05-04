import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getApiErrorMessage } from "../api/apiError";
import { categoriesApi, Category } from "../api/categoriesApi";
import { FixedBillMonth } from "../api/fixedBillsApi";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import Screen from "../components/Screen";
import { useFixedBills } from "../fixedBills/FixedBillsProvider";
import { useTheme } from "../theme/ThemeProvider";

function normalizeAmount(value: string) {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

function amountToInput(value?: number) {
  if (value == null) return "";
  return String(value).replace(".", ",");
}

export default function CreateFixedBillScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { createFixedBill, updateFixedBill } = useFixedBills();

  const editing = route.params?.item as FixedBillMonth | undefined;
  const isEditing = !!editing;

  const [name, setName] = useState(editing?.name ?? "");
  const [amount, setAmount] = useState(
    amountToInput(editing?.defaultAmount ?? editing?.amount),
  );
  const [dueDay, setDueDay] = useState(editing ? String(editing.dueDay) : "");

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
      const parsedDueDay = Number(dueDay);

      if (!name.trim()) {
        setError("Nome da conta é obrigatório.");
        return;
      }

      if (!parsedAmount || parsedAmount <= 0) {
        setError("Informe um valor válido.");
        return;
      }

      if (!parsedDueDay || parsedDueDay < 1 || parsedDueDay > 31) {
        setError("Informe um dia de vencimento entre 1 e 31.");
        return;
      }

      const payload = {
        name: name.trim(),
        amount: parsedAmount,
        dueDay: parsedDueDay,
        categoryId,
      };

      if (isEditing) {
        await updateFixedBill(editing.fixedBillId, payload);
      } else {
        await createFixedBill(payload);
      }

      navigation.goBack();
    } catch (err) {
      setError(getApiErrorMessage(err, "Falha ao salvar conta fixa."));
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
            {isEditing ? "Editar fixa" : "Nova fixa"}
          </Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            {isEditing
              ? "Atualize a conta recorrente."
              : "Cadastre uma conta recorrente."}
          </Text>
        </View>
      </View>

      <AppCard style={styles.form}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.muted }]}>Nome</Text>
          <AppInput
            placeholder="Ex: Internet, aluguel, academia..."
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.muted }]}>
            Valor padrão
          </Text>
          <AppInput
            placeholder="Ex: 99,90"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.muted }]}>
            Dia do vencimento
          </Text>
          <AppInput
            placeholder="Ex: 10"
            value={dueDay}
            onChangeText={(value) =>
              setDueDay(value.replace(/\D/g, "").slice(0, 2))
            }
            keyboardType="numeric"
            maxLength={2}
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

        {error ? (
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        ) : null}

        <AppButton onPress={handleSave} style={styles.saveButton}>
          {busy
            ? "Salvando..."
            : isEditing
              ? "Salvar alterações"
              : "Salvar conta fixa"}
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
