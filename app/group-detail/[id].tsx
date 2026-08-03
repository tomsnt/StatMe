import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useStatsStore } from '../../src/store/statsStore';
import { StatChartCard } from '../../src/components/StatChartCard';
import { TIME_SPANS, type TimeSpan } from '../../src/constants/timeSpan';

export default function GroupDetailScreen() {
  const { bg, fg } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, span: initialSpan } = useLocalSearchParams<{ id: string; span: TimeSpan }>();
  const [span, setSpan] = useState<TimeSpan>((initialSpan as TimeSpan) ?? '1m');

  const { groups, definitions, entries } = useStatsStore();
  const group = groups.find((g) => g.id === id);
  const groupDefs = definitions.filter((d) => d.groupId === id);

  function cycleSpan() {
    const idx = TIME_SPANS.indexOf(span);
    setSpan(TIME_SPANS[(idx + 1) % TIME_SPANS.length]!);
  }

  if (!group) return null;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: fg + '18' }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={fg} />
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <View style={[styles.groupDot, { backgroundColor: group.color }]} />
          <Text style={[styles.title, { color: fg }]}>{group.name}</Text>
        </View>
        <TouchableOpacity onPress={cycleSpan} hitSlop={12}>
          <Text style={[styles.spanBadge, { color: fg, borderColor: fg + '44' }]}>{span}</Text>
        </TouchableOpacity>
      </View>

      {groupDefs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: fg + '44' }]}>Nessuna statistica in questo gruppo.</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
        >
          {groupDefs.map((def) => (
            <StatChartCard
              key={def.id}
              definition={def}
              entries={entries}
              span={span}
              fg={fg}
              bg={bg}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  backBtn: { padding: 2 },
  titleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  groupDot: { width: 10, height: 10, borderRadius: 5 },
  title: { fontSize: 18, fontWeight: '700' },
  spanBadge: {
    fontSize: 13,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 14 },
});
