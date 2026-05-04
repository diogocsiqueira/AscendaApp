import { ReactNode } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export default function Screen({ children, scroll = true, style }: Props) {
  const { theme } = useTheme();

  if (!scroll) {
    return <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }, style]}>{children}</SafeAreaView>;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, style]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={90}
      >
        {children}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
});
