import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function AppInput(props: TextInputProps) {
  const { theme } = useTheme();

  return (
    <TextInput
      placeholderTextColor={theme.muted}
      {...props}
      style={[
        styles.input,
        {
          backgroundColor: theme.surface2,
          color: theme.text,
          borderColor: theme.border,
        },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    fontSize: 15,
  },
});
