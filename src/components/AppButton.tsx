import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "ghost" | "danger";
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
};

export default function AppButton({
  children,
  onPress,
  variant = "primary",
  style,
  disabled = false,
}: Props) {
  const { theme } = useTheme();

  const variantStyle =
    variant === "ghost"
      ? {
          backgroundColor: theme.surface2,
          borderColor: theme.border,
          borderWidth: 1,
        }
      : {
          backgroundColor: variant === "danger" ? theme.danger : theme.primary,
          borderWidth: 0,
        };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, { color: variant === "ghost" ? theme.text : "#fff" }]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    fontSize: 15,
    fontWeight: "900",
  },
});
