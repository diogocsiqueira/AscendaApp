import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getApiErrorMessage } from "../api/apiError";
import { categoriesApi, Category } from "../api/categoriesApi";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import Screen from "../components/Screen";
import { useTheme } from "../theme/ThemeProvider";

export default function CategoriesScreen() {
  const { theme } = useTheme();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      const res = await categoriesApi.list();
      setCategories(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao carregar categorias"));
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    try {
      if (!name.trim()) return;

      const res = await categoriesApi.create({ name });

      setCategories((prev) => [res.data, ...prev]);
      setName("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao criar categoria"));
    }
  }

  async function remove(id: number) {
    await categoriesApi.remove(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.text }]}>Categorias</Text>

      <AppCard>
        <AppInput
          placeholder="Nova categoria"
          value={name}
          onChangeText={setName}
        />

        <AppButton onPress={create} style={styles.addBtn}>
          Adicionar
        </AppButton>
      </AppCard>

      {error ? <Text style={{ color: theme.danger }}>{error}</Text> : null}

      <View style={styles.list}>
        {categories.map((item) => (
          <AppCard key={item.id} style={styles.item}>
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              {item.name}
            </Text>

            {!item.isDefault && (
              <Pressable onPress={() => remove(item.id)}>
                <Ionicons name="trash-outline" size={18} color={theme.muted} />
              </Pressable>
            )}
          </AppCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 16,
  },
  addBtn: {
    marginTop: 10,
  },
  list: {
    marginTop: 14,
    gap: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
