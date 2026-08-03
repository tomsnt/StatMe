import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

const sqlite = SQLite.openDatabaseSync('statme.db');
export const db = drizzle(sqlite, { schema });

export async function initDatabase() {
  await sqlite.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS stat_groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stat_definitions (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL REFERENCES stat_groups(id),
      name TEXT NOT NULL,
      value_label TEXT NOT NULL,
      color TEXT NOT NULL,
      is_time_based INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stat_entries (
      id TEXT PRIMARY KEY,
      stat_definition_id TEXT NOT NULL REFERENCES stat_definitions(id),
      date TEXT NOT NULL,
      value REAL NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_prefs (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS custom_themes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      background_color TEXT NOT NULL,
      foreground_color TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_entries_date ON stat_entries(date);
    CREATE INDEX IF NOT EXISTS idx_entries_def_id ON stat_entries(stat_definition_id);
    CREATE INDEX IF NOT EXISTS idx_definitions_group_id ON stat_definitions(group_id);
  `);
}
