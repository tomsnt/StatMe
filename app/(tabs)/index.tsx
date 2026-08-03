import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useStatsStore } from '../../src/store/statsStore';
import { CalendarGrid } from '../../src/components/CalendarGrid';
import { DayDetailSheet } from '../../src/components/DayDetailSheet';
import { formatMonthYear, toLocalDateString } from '../../src/utils/format';

export default function CalendarScreen() {
  const { bg, fg } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const { entries, definitions, groups } = useStatsStore();

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 30 && Math.abs(g.dy) < 40,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) nextMonth();
      else if (g.dx > 50) prevMonth();
    },
  });

  function handleDayPress(dateStr: string) {
    setSelectedDate(dateStr);
    setSheetVisible(true);
  }

  const selectedEntries = selectedDate
    ? entries.filter((e) => e.date === selectedDate)
    : [];

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.monthYear, { color: fg }]}>
          {formatMonthYear(year, month)}
        </Text>
        <View style={styles.headerRight}>
          {!isCurrentMonth && (
            <TouchableOpacity
              onPress={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
              style={styles.todayBtn}
              hitSlop={10}
            >
              <Text style={[styles.todayLabel, { color: fg + '88', borderColor: fg + '44' }]}>
                oggi
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.push('/add-entry')} hitSlop={12}>
            <Ionicons name="add" size={28} color={fg} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity onPress={prevMonth} hitSlop={16} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={20} color={fg + '99'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextMonth} hitSlop={16} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={20} color={fg + '99'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
        {...panResponder.panHandlers}
      >
        <CalendarGrid
          year={year}
          month={month}
          entries={entries}
          definitions={definitions}
          groups={groups}
          fg={fg}
          bg={bg}
          onDayPress={handleDayPress}
        />
      </ScrollView>

      <DayDetailSheet
        visible={sheetVisible}
        dateStr={selectedDate}
        entries={selectedEntries}
        definitions={definitions}
        groups={groups}
        fg={fg}
        bg={bg}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  todayBtn: {},
  todayLabel: {
    fontSize: 12,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 4,
  },
  navBtn: {
    padding: 4,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
});
