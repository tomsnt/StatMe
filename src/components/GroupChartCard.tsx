import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatChart } from './StatChart';
import { buildChartData, buildGroupDates } from '../utils/chartData';
import type { StatGroup, StatDefinition, StatEntry } from '../db/schema';
import type { TimeSpan } from '../constants/timeSpan';

type Props = {
  group: StatGroup;
  definitions: StatDefinition[];
  entries: StatEntry[];
  span: TimeSpan;
  fg: string;
  bg: string;
  onPress: () => void;
};

export function GroupChartCard({ group, definitions, entries, span, fg, bg, onPress }: Props) {
  const defIds = definitions.map((d) => d.id);
  const groupEntries = entries.filter((e) => defIds.includes(e.statDefinitionId));
  const dates = buildGroupDates(groupEntries, defIds, span);

  const datasets = definitions.map((def) => ({
    name: def.name,
    color: def.color,
    data: buildChartData(groupEntries, def.id, dates, span),
  }));

  const border = fg + '18';

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.groupDot, { backgroundColor: group.color }]} />
          <Text style={[styles.groupName, { color: fg }]}>{group.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={fg + '55'} />
      </View>

      <View style={styles.chartWrap}>
        <StatChart
          datasets={datasets}
          isTimeBased={definitions.some((d) => d.isTimeBased)}
          fg={fg}
          bg={bg}
          mini
        />
      </View>

      <View style={styles.legend}>
        {definitions.map((def) => (
          <View key={def.id} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: def.color }]} />
            <Text style={[styles.legendLabel, { color: fg + '88' }]}>{def.name}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  groupDot: { width: 10, height: 10, borderRadius: 5 },
  groupName: { fontSize: 15, fontWeight: '600' },
  chartWrap: { paddingHorizontal: 8 },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
    gap: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendLabel: { fontSize: 11 },
});
