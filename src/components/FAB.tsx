import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";

export default function FAB() {
  const navigation: any = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <Pressable
      style={[styles.fab, { backgroundColor: theme.primary, bottom: 82 + insets.bottom }]}
      onPress={() => navigation.navigate("CreateTransaction")}
    >
      <Ionicons name="add" size={28} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});
