/**
 * Time values with isTimeBased=true use H.MM format where separator means hours.minutes.
 * Internally all time values are stored as total minutes (integer).
 * Example: "1.30" input → 90 minutes stored → "1.30" displayed
 */

export function parseTimeInput(input: string): number {
  const parts = input.replace(',', '.').split('.');
  const hours = parseInt(parts[0] ?? '0', 10) || 0;
  const minutes = parseInt((parts[1] ?? '0').padEnd(2, '0').slice(0, 2), 10) || 0;
  return hours * 60 + minutes;
}

export function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}.${String(m).padStart(2, '0')}`;
}

export function formatMinutesToLabel(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function sumTimeValues(minutesArray: number[]): number {
  return minutesArray.reduce((acc, v) => acc + v, 0);
}

export function validateTimeInput(input: string): boolean {
  const parts = input.replace(',', '.').split('.');
  if (parts.length > 2) return false;
  const minutes = parseInt((parts[1] ?? '0').padEnd(2, '0').slice(0, 2), 10);
  return minutes < 60;
}
