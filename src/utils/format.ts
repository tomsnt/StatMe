import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export function toLocalDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function todayString(): string {
  return toLocalDateString(new Date());
}

export function monthDays(year: number, month: number): Date[] {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);
  return eachDayOfInterval({ start, end });
}

export function formatMonthYear(year: number, month: number): string {
  return format(new Date(year, month, 1), 'MMMM yyyy');
}

export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), 'd MMM yyyy');
}
