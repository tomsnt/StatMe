import { db } from './index';
import { statGroups, statDefinitions, statEntries, userPrefs, customThemes } from './schema';
import type { NewStatGroup, NewStatDefinition, NewStatEntry, NewCustomTheme, StatGroup, StatDefinition, StatEntry, CustomTheme } from './schema';
import { eq, sql } from 'drizzle-orm';

export async function insertGroup(data: NewStatGroup): Promise<StatGroup> {
  await db.insert(statGroups).values(data);
  return data as StatGroup;
}

export async function insertDefinition(data: NewStatDefinition): Promise<StatDefinition> {
  await db.insert(statDefinitions).values(data);
  return data as StatDefinition;
}

export async function insertEntry(data: NewStatEntry): Promise<StatEntry> {
  await db.insert(statEntries).values(data);
  return data as StatEntry;
}

export async function insertCustomTheme(data: NewCustomTheme): Promise<CustomTheme> {
  await db.insert(customThemes).values(data);
  return data as CustomTheme;
}

export async function deleteCustomTheme(id: string): Promise<void> {
  await db.delete(customThemes).where(eq(customThemes.id, id));
}

export async function savePref(key: string, value: string): Promise<void> {
  await db
    .insert(userPrefs)
    .values({ key, value })
    .onConflictDoUpdate({ target: userPrefs.key, set: { value: sql`excluded.value` } });
}
