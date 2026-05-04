import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getApiErrorMessage } from "../api/apiError";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import Screen from "../components/Screen";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    try {
      setBusy(true);
      setError("");

      await register(email.trim(), password);

      navigation.replace("Login");
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Falha ao criar conta."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen style={styles.page}>
      <AppCard style={styles.card}>
        <Text style={[styles.logo, { color: theme.primary }]}>Ascenda</Text>

        <Text style={[styles.title, { color: theme.text }]}>
          Crie sua conta
        </Text>

        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Comece simples. Evolui depois.
        </Text>

        <View style={styles.form}>
          <AppInput
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <AppInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        ) : null}

        <AppButton onPress={handleRegister}>
          {busy ? "Criando..." : "Criar conta"}
        </AppButton>

        <Text
          style={[styles.link, { color: theme.muted }]}
          onPress={() => navigation.navigate("Login")}
        >
          Já tenho conta
        </Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    padding: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontWeight: "700",
  },
  form: {
    gap: 12,
    marginBottom: 16,
  },
  error: {
    fontWeight: "800",
    marginBottom: 14,
  },
  link: {
    textAlign: "center",
    marginTop: 18,
    fontWeight: "900",
  },
});
