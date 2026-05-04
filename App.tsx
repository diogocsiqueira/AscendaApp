import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/auth/AuthProvider";
import { FixedBillsProvider } from "./src/fixedBills/FixedBillsProvider";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { TransactionsProvider } from "./src/transactions/TransactionsProvider";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TransactionsProvider>
          <FixedBillsProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </FixedBillsProvider>
        </TransactionsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
