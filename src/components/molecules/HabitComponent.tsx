import React, { useMemo, memo } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { AppText } from "@/components/atoms";
import { colors } from "@/lib/config/colors";
import { Habit } from "@/lib/types";

interface HabitComponentProps {
  categoryId: number;
  color: string;
  habits: Habit[];
  checkins: Record<number, Record<string, number>>;
  regYear: number;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface HabitGridProps {
  habit: Habit;
  columns: Date[][];
  checkins: Record<string, number>;
  color: string;
  today: Date;
  monthLabels: React.ReactNode;
  yearLabels: React.ReactNode;
}

const HabitGrid = memo(function HabitGrid({
  habit,
  columns,
  checkins,
  color,
  today,
  monthLabels,
  yearLabels,
}: HabitGridProps) {
  return (
    <View style={styles.calendarContainer}>
      <View style={styles.habitHeaderRow}>
        <AppText type="subheading">{habit.name}</AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.calendarWrapper}>
          <View style={styles.monthRow}>{monthLabels}</View>

          <View style={styles.row}>
            {columns.map((week, wIdx) => (
              <View key={wIdx} style={styles.gridColumn}>
                {week.map((date, dIdx) => {
                  const dateStr = formatDate(date);
                  const isFuture = date > today;
                  const isCheckedIn = checkins[dateStr] === 1 && !isFuture;

                  const cellColor = isCheckedIn ? color : colors.border;
                  const cellOpacity = isFuture ? 0.4 : 1.0;

                  return (
                    <View
                      key={dIdx}
                      style={[
                        styles.cell,
                        { backgroundColor: cellColor, opacity: cellOpacity },
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.yearRow}>{yearLabels}</View>
        </View>
      </ScrollView>
    </View>
  );
});

export function HabitComponent({
  categoryId,
  color,
  habits,
  checkins,
  regYear,
}: HabitComponentProps) {
  const today = useMemo(() => new Date(), []);
  const currentYear = useMemo(() => today.getFullYear(), [today]);

  const columns = useMemo(() => {
    const firstDay = new Date(regYear, 0, 1);
    const dayOfWeek = firstDay.getDay();
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - dayOfWeek);

    const lastDay = new Date(currentYear, 11, 31);
    const msInDay = 24 * 60 * 60 * 1000;
    const totalDays =
      Math.ceil((lastDay.getTime() - startDate.getTime()) / msInDay) + 7;
    const totalWeeks = Math.ceil(totalDays / 7);

    const cols: Date[][] = [];
    for (let w = 0; w < totalWeeks; w++) {
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        const dateIndex = w * 7 + d;
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + dateIndex);
        week.push(cellDate);
      }

      const lastDayOfWeek = week[6];
      if (lastDayOfWeek.getFullYear() <= currentYear) {
        cols.push(week);
      }
    }
    return cols;
  }, [regYear, currentYear]);

  const monthLabels = useMemo(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return columns.map((week, wIdx) => {
      const Sunday = week[0];
      const isFirstWeekOfMonth = Sunday.getDate() <= 7;

      if (isFirstWeekOfMonth) {
        return (
          <View key={wIdx} style={styles.labelColumn}>
            <AppText style={styles.monthLabelText}>
              {monthNames[Sunday.getMonth()]}
            </AppText>
          </View>
        );
      } else {
        return <View key={wIdx} style={styles.labelColumnSpacer} />;
      }
    });
  }, [columns]);

  const yearLabels = useMemo(() => {
    return columns.map((week, wIdx) => {
      const Sunday = week[0];
      const isFirstWeekOfYear =
        Sunday.getMonth() === 0 && Sunday.getDate() <= 7;

      if (isFirstWeekOfYear) {
        return (
          <View key={wIdx} style={styles.labelColumn}>
            <AppText style={styles.yearLabelText}>
              {Sunday.getFullYear()}
            </AppText>
          </View>
        );
      } else {
        return <View key={wIdx} style={styles.labelColumnSpacer} />;
      }
    });
  }, [columns]);

  const categoryHabits = useMemo(() => {
    return habits.filter((h) => h.type === categoryId);
  }, [habits, categoryId]);

  return (
    <View style={styles.container}>
      {categoryHabits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>
            No habits tracked in this category yet.
          </AppText>
        </View>
      ) : (
        categoryHabits.map((habit) => (
          <HabitGrid
            key={habit.id}
            habit={habit}
            columns={columns}
            checkins={checkins[habit.id] || {}}
            color={color}
            today={today}
            monthLabels={monthLabels}
            yearLabels={yearLabels}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
  },
  habitHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarContainer: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 16,
  },
  scrollContent: {
    paddingVertical: 4,
  },
  calendarWrapper: {
    flexDirection: "column",
    gap: 4,
  },
  row: {
    flexDirection: "row",
    gap: 3,
  },
  monthRow: {
    flexDirection: "row",
    gap: 3,
    height: 16,
  },
  yearRow: {
    flexDirection: "row",
    gap: 3,
    height: 18,
  },
  gridColumn: {
    flexDirection: "column",
    gap: 3,
  },
  labelColumn: {
    width: 10,
    position: "relative",
  },
  labelColumnSpacer: {
    width: 10,
  },
  monthLabelText: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.textMuted,
    position: "absolute",
    left: 0,
    top: 0,
    width: 40,
  },
  yearLabelText: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.textMuted,
    position: "absolute",
    left: 0,
    top: 0,
    width: 40,
  },
  cell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderRadius: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
