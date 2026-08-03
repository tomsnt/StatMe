import { db } from './index';
import { statGroups, statDefinitions, statEntries, userPrefs } from './schema';
import type { NewStatGroup, NewStatDefinition, NewStatEntry, StatGroup, StatDefinition, StatEntry } from './schema';
import { sql } from 'drizzle-orm';

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

export async function savePref(key: string, value: string): Promise<void> {
  await db
    .insert(userPrefs)
    .values({ key, value })
    .onConflictDoUpdate({ target: userPrefs.key, set: { value: sql`excluded.value` } });
}
