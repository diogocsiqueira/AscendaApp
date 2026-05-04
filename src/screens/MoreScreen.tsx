import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import Screen from "../components/Screen";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";

export default function MoreScreen({ navigation }: any) {
  const { theme, setTheme, currentTheme } = useTheme();
  const { user, logout } = useAuth();

  const [openTheme, setOpenTheme] = useState(false);

  const themes = ["light", "dark"] as const;
  const displayName = user?.email?.split("@")[0] ?? "Usuário";

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Mais</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Ajustes e recursos extras.
        </Text>
      </View>

      <AppCard style={styles.profile}>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.text }]}>
            {displayName}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.muted }]}>
            {user?.email ?? "Sem email"}
          </Text>
        </View>

        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
      </AppCard>

      <View style={styles.list}>
        <AppCard>
          <Pressable
            style={styles.item}
            onPress={() => setOpenTheme((prev) => !prev)}
          >
            <View style={styles.left}>
              <Ionicons name="moon-outline" size={22} color={theme.primary} />
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Tema
              </Text>
            </View>

            <View style={styles.right}>
              <Text style={[styles.currentTheme, { color: theme.muted }]}>
                {currentTheme}
              </Text>
              <Ionicons
                name={openTheme ? "chevron-up" : "chevron-forward"}
                size={20}
                color={theme.muted}
              />
            </View>
          </Pressable>

          {openTheme ? (
            <View style={[styles.themeBox, { borderTopColor: theme.border }]}>
              {themes.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor:
                        currentTheme === item ? theme.surface2 : "transparent",
                    },
                  ]}
                  onPress={() => {
                    setTheme(item);
                    setOpenTheme(false);
                  }}
                >
                  <Text
                    style={[
                      styles.themeText,
                      {
                        color:
                          currentTheme === item ? theme.primary : theme.text,
                      },
                    ]}
                  >
                    {item === "dark" ? "Escuro" : "Claro"}
                  </Text>

                  {currentTheme === item ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={theme.primary}
                    />
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
        </AppCard>

        <Pressable onPress={() => navigation.navigate("Categories")}>
          <AppCard style={styles.item}>
            <View style={styles.left}>
              <Ionicons
                name="pricetag-outline"
                size={22}
                color={theme.primary}
              />
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Categorias
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={theme.muted} />
          </AppCard>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Reports")}>
          <AppCard style={styles.item}>
            <View style={styles.left}>
              <Ionicons
                name="bar-chart-outline"
                size={22}
                color={theme.primary}
              />
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Relatórios
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={theme.muted} />
          </AppCard>
        </Pressable>
      </View>

      <AppButton variant="danger" style={styles.logout} onPress={logout}>
        Sair da conta
      </AppButton>
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
  profile: {
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    paddingRight: 14,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "900",
  },
  profileEmail: {
    marginTop: 4,
    fontWeight: "700",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
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
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "900",
  },
  currentTheme: {
    fontSize: 12,
    fontWeight: "800",
  },
  themeBox: {
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 12,
    gap: 8,
  },
  themeOption: {
    minHeight: 42,
    borderRadius: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  themeText: {
    fontWeight: "900",
  },
  logout: {
    marginTop: 22,
  },
});
