import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useStatsStore } from '../../src/store/statsStore';
import { GroupChartCard } from '../../src/components/GroupChartCard';
import { TIME_SPANS, DEFAULT_TIME_SPAN, type TimeSpan } from '../../src/constants/timeSpan';

export default function StatisticsScreen() {
  const { bg, fg } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [span, setSpan] = useState<TimeSpan>(DEFAULT_TIME_SPAN);
  const { groups, definitions, entries } = useStatsStore();

  function cycleSpan() {
    const idx = TIME_SPANS.indexOf(span);
    setSpan(TIME_SPANS[(idx + 1) % TIME_SPANS.length]!);
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.title, { color: fg }]}>Statistiche</Text>
        <TouchableOpacity onPress={cycleSpan} hitSlop={12}>
          <Text style={[styles.spanBadge, { color: fg, borderColor: fg + '44' }]}>{span}</Text>
        </TouchableOpacity>
      </View>

      {groups.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: fg + '44' }]}>
            Nessun gruppo ancora.{'\n'}Aggiungi la prima statistica con +
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
        >
          {groups.map((group) => {
            const groupDefs = definitions.filter((d) => d.groupId === group.id);
            if (groupDefs.length === 0) return null;
            return (
              <GroupChartCard
                key={group.id}
                group={group}
                definitions={groupDefs}
                entries={entries}
                span={span}
                fg={fg}
                bg={bg}
                onPress={() => router.push(`/group-detail/${group.id}?span=${span}`)}
              />
            );
          })}
        </ScrollView>
      )}
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
    paddingBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', letterSpacing: 0.3 },
  spanBadge: {
    fontSize: 13,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    letterSpacing: 0.5,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
