import type { StatEntry } from '../db/schema';

export function getCalendarDotColor(
  dayEntries: StatEntry[],
  definitionColorMap: Record<string, string>,
  definitionGroupMap: Record<string, string>,
  groupColorMap: Record<string, string>,
): { groupId: string; color: string }[] {
  if (dayEntries.length === 0) return [];

  const byGroup: Record<string, StatEntry[]> = {};
  for (const entry of dayEntries) {
    const groupId = definitionGroupMap[entry.statDefinitionId] ?? 'unknown';
    if (!byGroup[groupId]) byGroup[groupId] = [];
    byGroup[groupId].push(entry);
  }

  const groupIds = Object.keys(byGroup);

  return groupIds.map((groupId) => {
    const entries = byGroup[groupId]!;
    if (entries.length === 1) {
      return { groupId, color: definitionColorMap[entries[0]!.statDefinitionId] ?? groupColorMap[groupId] ?? '#888' };
    }
    const highest = entries.reduce((prev, cur) => (cur.value > prev.value ? cur : prev));
    return { groupId, color: definitionColorMap[highest.statDefinitionId] ?? groupColorMap[groupId] ?? '#888' };
  });
}
