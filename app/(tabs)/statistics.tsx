import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../../src/hooks/useTheme';
import { TIME_SPANS, DEFAULT_TIME_SPAN, type TimeSpan } from '../../src/constants/timeSpan';

export default function StatisticsScreen() {
  const { bg, fg } = useTheme();
  const [timeSpan, setTimeSpan] = useState<TimeSpan>(DEFAULT_TIME_SPAN);

  function cycleSpan() {
    const idx = TIME_SPANS.indexOf(timeSpan);
    setTimeSpan(TIME_SPANS[(idx + 1) % TIME_SPANS.length]!);
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: fg }]}>Statistiche</Text>
        <TouchableOpacity onPress={cycleSpan} hitSlop={12}>
          <Text style={[styles.spanBadge, { color: fg, borderColor: fg + '44' }]}>
            {timeSpan}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.placeholder}>
        <Text style={[styles.placeholderText, { color: fg + '55' }]}>
          Charts — Phase 5
        </Text>
      </View>
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
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '600', letterSpacing: 0.3 },
  spanBadge: {
    fontSize: 13,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    letterSpacing: 0.5,
  },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 14 },
});
