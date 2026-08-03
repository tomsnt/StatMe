import { View, Text, StyleSheet } from 'react-native';
import { toLocalDateString } from '../utils/format';
import { getCalendarDotColor } from '../utils/color';
import { DayCell } from './DayCell';
import type { StatEntry, StatDefinition, StatGroup } from '../db/schema';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

type Props = {
  year: number;
  month: number;
  entries: StatEntry[];
  definitions: StatDefinition[];
  groups: StatGroup[];
  fg: string;
  bg: string;
  onDayPress: (dateStr: string) => void;
};

function buildCalendarRows(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();

  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDate; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

export function CalendarGrid({ year, month, entries, definitions, groups, fg, bg, onDayPress }: Props) {
  const rows = buildCalendarRows(year, month);
  const todayStr = toLocalDateString(new Date());

  const definitionColorMap: Record<string, string> = {};
  const definitionGroupMap: Record<string, string> = {};
  const groupColorMap: Record<string, string> = {};

  for (const d of definitions) {
    definitionColorMap[d.id] = d.color;
    definitionGroupMap[d.id] = d.groupId;
  }
  for (const g of groups) {
    groupColorMap[g.id] = g.color;
  }

  const entriesByDate: Record<string, StatEntry[]> = {};
  for (const e of entries) {
    if (!entriesByDate[e.date]) entriesByDate[e.date] = [];
    entriesByDate[e.date]!.push(e);
  }

  const borderColor = fg + '28';

  return (
    <View style={[styles.grid, { borderColor }]}>
      <View style={[styles.weekdayRow, { borderBottomColor: borderColor }]}>
        {WEEKDAYS.map((wd) => (
          <View key={wd} style={styles.weekdayCell}>
            <Text style={[styles.weekdayLabel, { color: fg + '66' }]}>{wd}</Text>
          </View>
        ))}
      </View>

      {rows.map((row, rowIdx) => (
        <View
          key={rowIdx}
          style={[
            styles.row,
            { borderBottomColor: borderColor },
            rowIdx === rows.length - 1 && styles.lastRow,
          ]}
        >
          {row.map((day, colIdx) => {
            if (day === null) {
              return (
                <View
                  key={colIdx}
                  style={[styles.emptyCell, colIdx < 6 && { borderRightColor: borderColor, borderRightWidth: StyleSheet.hairlineWidth }]}
                />
              );
            }
            const dateStr = toLocalDateString(new Date(year, month, day));
            const dayEntries = entriesByDate[dateStr] ?? [];
            const dots = getCalendarDotColor(dayEntries, definitionColorMap, definitionGroupMap, groupColorMap);

            return (
              <View
                key={colIdx}
                style={[
                  styles.cellWrap,
                  colIdx < 6 && { borderRightColor: borderColor, borderRightWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <DayCell
                  day={day}
                  isToday={dateStr === todayStr}
                  dots={dots}
                  fg={fg}
                  onPress={() => onDayPress(dateStr)}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    overflow: 'hidden',
  },
  weekdayRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  cellWrap: {
    flex: 1,
  },
  emptyCell: {
    flex: 1,
    minHeight: 56,
  },
});
