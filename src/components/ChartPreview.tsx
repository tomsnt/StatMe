import { View, StyleSheet } from 'react-native';
import { StatChart } from './StatChart';
import type { ChartPoint } from '../utils/chartData';

const PREVIEW_DATA: ChartPoint[] = [
  { value: 20, label: '', date: '2026-07-01' },
  { value: 35, label: '', date: '2026-07-05' },
  { value: 28, label: '', date: '2026-07-10' },
  { value: 48, label: '', date: '2026-07-15' },
  { value: 38, label: '', date: '2026-07-18' },
  { value: 60, label: '', date: '2026-07-22' },
  { value: 52, label: '', date: '2026-07-25' },
  { value: 70, label: '', date: '2026-07-28' },
];

type Props = { fg: string; bg: string };

export function ChartPreview({ fg, bg }: Props) {
  return (
    <View style={[styles.wrap, { borderColor: fg + '22', backgroundColor: bg }]}>
      <StatChart
        datasets={[{ data: PREVIEW_DATA, color: fg + 'CC', name: 'preview' }]}
        isTimeBased={false}
        fg={fg}
        bg={bg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 8,
  },
});
