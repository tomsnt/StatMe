import { subDays, format, parseISO, eachDayOfInterval } from 'date-fns';
import { timeSpanToDays, type TimeSpan } from '../constants/timeSpan';
import { formatMinutes } from './time';
import type { StatEntry, StatDefinition } from '../db/schema';

export type ChartPoint = { value: number; label: string; date: string };

export function getDateRange(span: TimeSpan): { from: string; to: string } {
  const to = new Date();
  const from = subDays(to, timeSpanToDays(span));
  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
}

function allDatesInRange(from: string, to: string): string[] {
  return eachDayOfInterval({
    start: parseISO(from),
    end: parseISO(to),
  }).map((d) => format(d, 'yyyy-MM-dd'));
}

function shortLabel(dateStr: string, span: TimeSpan): string {
  const d = parseISO(dateStr);
  if (span === '1m') return format(d, 'd MMM');
  if (span === '3m' || span === '6m') return format(d, 'MMM');
  return format(d, 'MMM yy');
}

export function buildChartData(
  entries: StatEntry[],
  defId: string,
  dates: string[],
  span: TimeSpan,
): ChartPoint[] {
  const byDate: Record<string, number> = {};
  for (const e of entries) {
    if (e.statDefinitionId === defId) {
      byDate[e.date] = (byDate[e.date] ?? 0) + e.value;
    }
  }

  // For sparse data spans, only show dates that have at least one entry across any stat
  return dates.map((date) => ({
    value: byDate[date] ?? 0,
    label: shortLabel(date, span),
    date,
  }));
}

export function buildGroupDates(
  entries: StatEntry[],
  defIds: string[],
  span: TimeSpan,
): string[] {
  const { from, to } = getDateRange(span);
  const all = allDatesInRange(from, to);

  // For spans > 1m, reduce to just dates that have data to avoid dense empty charts
  if (span === '1m') return all;

  const withData = new Set(
    entries
      .filter((e) => defIds.includes(e.statDefinitionId))
      .map((e) => e.date),
  );

  // Keep dates that have data, plus evenly spaced dates for context
  const step = span === '3m' ? 3 : span === '6m' ? 5 : span === '1y' ? 10 : 20;
  return all.filter((d, i) => withData.has(d) || i % step === 0);
}

export function formatYLabel(value: string, isTimeBased: boolean): string {
  const n = Number(value);
  if (isNaN(n)) return value;
  if (isTimeBased) return formatMinutes(n);
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
