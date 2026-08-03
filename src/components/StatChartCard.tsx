import { View, Text, StyleSheet } from 'react-native';
import { StatChart } from './StatChart';
import { buildChartData, buildGroupDates } from '../utils/chartData';
import { formatMinutes } from '../utils/time';
import type { StatDefinition, StatEntry } from '../db/schema';
import type { TimeSpan } from '../constants/timeSpan';

type Props = {
  definition: StatDefinition;
  entries: StatEntry[];
  span: TimeSpan;
  fg: string;
  bg: string;
};

export function StatChartCard({ definition, entries, span, fg, bg }: Props) {
  const defEntries = entries.filter((e) => e.statDefinitionId === definition.id);
  const dates = buildGroupDates(defEntries, [definition.id], span);
  const data = buildChartData(defEntries, definition.id, dates, span);

  const total = defEntries.reduce((s, e) => s + e.value, 0);
  const avg = defEntries.length > 0 ? total / defEntries.length : 0;

  function displayValue(v: number): string {
    if (definition.isTimeBased) return formatMinutes(v);
    return v % 1 === 0 ? String(v) : v.toFixed(1);
  }

  const border = fg + '18';

  return (
    <View style={[styles.card, { borderColor: border }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.dot, { backgroundColor: definition.color }]} />
          <Text style={[styles.name, { color: fg }]}>{definition.name}</Text>
          {definition.isTimeBased && (
            <Text style={[styles.timeBadge, { color: fg + '66', borderColor: fg + '33' }]}>⏱</Text>
          )}
        </View>
        <View style={styles.stats}>
          <Text style={[styles.statLabel, { color: fg + '66' }]}>tot</Text>
          <Text style={[styles.statValue, { color: fg }]}>{displayValue(total)}</Text>
          <Text style={[styles.statSep, { color: fg + '33' }]}>·</Text>
          <Text style={[styles.statLabel, { color: fg + '66' }]}>media</Text>
          <Text style={[styles.statValue, { color: fg }]}>{displayValue(avg)}</Text>
        </View>
      </View>

      <View style={styles.chartWrap}>
        <StatChart
          datasets={[{ data, color: definition.color, name: definition.name }]}
          isTimeBased={definition.isTimeBased}
          fg={fg}
          bg={bg}
        />
      </View>

      <View style={[styles.footer, { borderTopColor: border }]}>
        <Text style={[styles.footerText, { color: fg + '55' }]}>
          {definition.valueLabel} · {defEntries.length} {defEntries.length === 1 ? 'registrazione' : 'registrazioni'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 6,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { fontSize: 15, fontWeight: '600', flex: 1 },
  timeBadge: {
    fontSize: 11,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statLabel: { fontSize: 11 },
  statValue: { fontSize: 13, fontWeight: '600' },
  statSep: { fontSize: 13 },
  chartWrap: { paddingHorizontal: 4, paddingBottom: 4 },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  footerText: { fontSize: 11 },
});
