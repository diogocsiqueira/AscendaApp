import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Informe seu e-mail.");
      return;
    }

    if (!password) {
      setError("Informe sua senha.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      setBusy(true);
      setError("");

      await register(cleanEmail, password);

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

          <View style={styles.passwordBox}>
            <AppInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />

            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeButton}
              hitSlop={10}
            >
              <Text style={[styles.eyeText, { color: theme.primary }]}>
                {showPassword ? "Ocultar" : "Ver"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.passwordBox}>
            <AppInput
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={styles.passwordInput}
            />

            <Pressable
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              style={styles.eyeButton}
              hitSlop={10}
            >
              <Text style={[styles.eyeText, { color: theme.primary }]}>
                {showConfirmPassword ? "Ocultar" : "Ver"}
              </Text>
            </Pressable>
          </View>
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        ) : null}

        <AppButton onPress={handleRegister} disabled={busy}>
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
  passwordBox: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 82,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  eyeText: {
    fontSize: 12,
    fontWeight: "900",
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
