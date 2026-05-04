import { StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import Screen from "../components/Screen";
import { useTheme } from "../theme/ThemeProvider";

type Goal = {
  id: string;
  name: string;
  current: number;
  target: number;
};

const goals: Goal[] = [];

export default function GoalsScreen() {
  const { theme } = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Metas</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Transforma vontade em plano.</Text>
      </View>

      <AppButton style={styles.createButton}>Nova meta</AppButton>

      {goals.length === 0 ? (
        <AppCard>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhuma meta ainda</Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>Quando o backend entrar, suas metas aparecem aqui.</Text>
        </AppCard>
      ) : (
        <View style={styles.list}>
          {goals.map((goal) => {
            const progress = goal.target > 0 ? Math.min(goal.current / goal.target, 1) : 0;
            const percent = Math.round(progress * 100);

            return (
              <AppCard key={goal.id}>
                <View style={styles.goalHeader}>
                  <Text style={[styles.goalName, { color: theme.text }]}>{goal.name}</Text>
                  <Text style={[styles.percent, { color: theme.primary }]}>{percent}%</Text>
                </View>

                <Text style={[styles.goalMoney, { color: theme.muted }]}>
                  R$ {goal.current.toLocaleString("pt-BR")} de R$ {goal.target.toLocaleString("pt-BR")}
                </Text>

                <View style={[styles.bar, { backgroundColor: theme.surface2 }]}>
                  <View style={[styles.fill, { width: `${percent}%`, backgroundColor: theme.primary }]} />
                </View>
              </AppCard>
            );
          })}
        </View>
      )}
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
  createButton: {
    marginBottom: 18,
  },
  list: {
    gap: 12,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalName: {
    fontSize: 16,
    fontWeight: "900",
  },
  percent: {
    fontWeight: "900",
  },
  goalMoney: {
    marginTop: 8,
    fontWeight: "700",
  },
  bar: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 14,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  emptyText: {
    fontWeight: "700",
    lineHeight: 20,
  },
});
