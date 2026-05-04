import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FAB from "../components/FAB";
import { useAuth } from "../providers/AuthProvider";
import CategoriesScreen from "../screens/CategoriesScreen";
import CreateFixedBillScreen from "../screens/CreateFixedBillScreen";
import CreateTransactionScreen from "../screens/CreateTransactionScreen";
import FixedBillsScreen from "../screens/FixedBillsScreen";
import GoalsScreen from "../screens/GoalsScreen";
import LoginScreen from "../screens/LoginScreen";
import MoreScreen from "../screens/MoreScreen";
import OverviewScreen from "../screens/OverviewScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ReportsScreen from "../screens/ReportsScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import { useTheme } from "../theme/ThemeProvider";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 8,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.muted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
          },
          tabBarIcon: ({ color, size }) => {
            const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
              Início: "home-outline",
              Transações: "swap-horizontal-outline",
              Fixas: "receipt-outline",
              Metas: "flag-outline",
              Relatórios: "bar-chart-outline",
              Mais: "menu-outline",
            };

            return (
              <Ionicons
                name={icons[route.name] ?? "ellipse-outline"}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Início" component={OverviewScreen} />
        <Tab.Screen name="Transações" component={TransactionsScreen} />
        <Tab.Screen name="Fixas" component={FixedBillsScreen} />
        <Tab.Screen name="Metas" component={GoalsScreen} />
        <Tab.Screen name="Mais" component={MoreScreen} />
      </Tab.Navigator>

      <FAB />
    </>
  );
}

export default function AppNavigator() {
  const { isLogged, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLogged ? (
        <>
          <Stack.Screen name="App" component={Tabs} />
          <Stack.Screen
            name="CreateTransaction"
            component={CreateTransactionScreen}
          />
          <Stack.Screen
            name="CreateFixedBill"
            component={CreateFixedBillScreen}
          />
          <Stack.Screen name="Categories" component={CategoriesScreen} />
          <Stack.Screen name="Reports" component={ReportsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
