import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/providers/AuthProvider";
import { FixedBillsProvider } from "./src/providers/FixedBillsProvider";
import { GoalsProvider } from "./src/providers/GoalsProvider";
import { ReportsProvider } from "./src/providers/ReportsProvider";
import { TransactionsProvider } from "./src/providers/TransactionsProvider";
import { ThemeProvider } from "./src/theme/ThemeProvider";

export default function App() {
  return (
    <ReportsProvider>
      <GoalsProvider>
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
      </GoalsProvider>
    </ReportsProvider>
  );
}
