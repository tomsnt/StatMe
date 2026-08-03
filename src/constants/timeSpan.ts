export type TimeSpan = '1m' | '3m' | '6m' | '1y' | '2y';

export const TIME_SPANS: TimeSpan[] = ['1m', '3m', '6m', '1y', '2y'];

export const DEFAULT_TIME_SPAN: TimeSpan = '1m';

export function timeSpanToDays(span: TimeSpan): number {
  switch (span) {
    case '1m': return 30;
    case '3m': return 90;
    case '6m': return 180;
    case '1y': return 365;
    case '2y': return 730;
  }
}
