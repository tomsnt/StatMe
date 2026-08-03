import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useChartPrefsStore } from '../store/chartPrefsStore';
import { formatYLabel, type ChartPoint } from '../utils/chartData';
import { formatMinutes } from '../utils/time';
import { formatDisplayDate } from '../utils/format';

const SCREEN_W = Dimensions.get('window').width;

type Dataset = {
  data: ChartPoint[];
  color: string;
  name: string;
};

type Props = {
  datasets: Dataset[];
  isTimeBased: boolean;
  fg: string;
  bg: string;
  mini?: boolean;
};

function DiamondPoint({ color }: { color: string }) {
  return (
    <View style={[styles.diamond, { backgroundColor: color }]} />
  );
}

export function StatChart({ datasets, isTimeBased, fg, bg, mini = false }: Props) {
  const { prefs } = useChartPrefsStore();

  if (datasets.length === 0 || datasets.every((d) => d.data.length === 0)) {
    return (
      <View style={[styles.empty, mini && styles.emptyMini]}>
        <Text style={[styles.emptyText, { color: fg + '44' }]}>Nessun dato</Text>
      </View>
    );
  }

  const chartW = mini ? SCREEN_W - 80 : SCREEN_W - 40;
  const chartH = mini ? 60 : 180;
  const axisColor = fg + '33';
  const gridColor = fg + '18';
  const vertLineColor =
    fg + Math.round(prefs.verticalLine.opacity * 255).toString(16).padStart(2, '0');

  const hidePoints = prefs.dataPoint === 'none';
  const isDiamond = prefs.dataPoint === 'diamond';

  const primaryDataset = datasets[0]!;
  const extraDatasets = datasets.slice(1);

  // Convert to gifted-charts format
  const primaryData = primaryDataset.data.map((p) => ({
    value: p.value,
    label: mini ? '' : p.label,
    date: p.date,
    dataPointText: '',
  }));

  const dataSet = extraDatasets.length > 0
    ? extraDatasets.map((ds) => ({
        data: ds.data.map((p) => ({ value: p.value })),
        color: ds.color,
        thickness: mini ? 1.5 : 2,
        curved: prefs.lineStyle === 'smooth',
        hideDataPoints: hidePoints || mini,
        ...(isDiamond && !mini ? { customDataPoint: () => <DiamondPoint color={ds.color} /> } : {}),
      }))
    : undefined;

  const sharedProps = {
    width: chartW,
    height: chartH,
    curved: prefs.lineStyle === 'smooth',
    color: primaryDataset.color,
    thickness: mini ? 1.5 : 2,
    hideDataPoints: hidePoints || mini || undefined,
    showVerticalLines: !mini && prefs.verticalLine.visible,
    verticalLinesColor: vertLineColor,
    verticalLinesDashed: prefs.verticalLine.style === 'dashed',
    rulesColor: gridColor,
    rulesType: 'solid' as const,
    yAxisColor: axisColor,
    xAxisColor: axisColor,
    yAxisTextStyle: mini ? { opacity: 0 } : { color: fg + 'AA', fontSize: 10 },
    xAxisLabelTextStyle: mini ? { opacity: 0 } : { color: fg + 'AA', fontSize: 10 },
    hideYAxisText: mini,
    hideAxesAndRules: mini,
    backgroundColor: 'transparent',
    startFillColor: 'transparent',
    endFillColor: 'transparent',
    areaChart: false,
    noOfSections: mini ? 2 : 4,
    formatYLabel: (v: string) => formatYLabel(v, isTimeBased),
    pointerConfig: mini
      ? undefined
      : {
          pointer1Color: fg,
          showPointerStrip: true,
          pointerStripColor: axisColor,
          pointerStripWidth: 1,
          activatePointersOnLongPress: false,
          pointerLabelWidth: 120,
          pointerLabelHeight: 56,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items: { value: number; date?: string }[]) => {
            const item = items[0];
            if (!item) return null;
            const val = isTimeBased ? formatMinutes(item.value) : String(item.value);
            return (
              <View style={[styles.tooltip, { backgroundColor: bg, borderColor: fg + '33' }]}>
                <Text style={[styles.tooltipVal, { color: fg }]}>{val}</Text>
                {item.date && (
                  <Text style={[styles.tooltipDate, { color: fg + '88' }]}>
                    {formatDisplayDate(item.date)}
                  </Text>
                )}
              </View>
            );
          },
        },
    ...(isDiamond && !mini ? { customDataPoint: () => <DiamondPoint color={primaryDataset.color} /> } : {}),
  };

  return (
    <View style={[styles.chart, mini && styles.chartMini]}>
      <LineChart
        data={primaryData}
        {...(dataSet ? { dataSet } : {})}
        {...sharedProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { marginLeft: -6 },
  chartMini: { opacity: 0.9 },
  empty: { height: 180, justifyContent: 'center', alignItems: 'center' },
  emptyMini: { height: 60 },
  emptyText: { fontSize: 13 },
  diamond: {
    width: 8,
    height: 8,
    transform: [{ rotate: '45deg' }],
  },
  tooltip: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 90,
  },
  tooltipVal: { fontSize: 14, fontWeight: '700' },
  tooltipDate: { fontSize: 11, marginTop: 2 },
});
