import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const statGroups = sqliteTable('stat_groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const statDefinitions = sqliteTable('stat_definitions', {
  id: text('id').primaryKey(),
  groupId: text('group_id').notNull().references(() => statGroups.id),
  name: text('name').notNull(),
  valueLabel: text('value_label').notNull(),
  color: text('color').notNull(),
  isTimeBased: integer('is_time_based', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const statEntries = sqliteTable('stat_entries', {
  id: text('id').primaryKey(),
  statDefinitionId: text('stat_definition_id').notNull().references(() => statDefinitions.id),
  date: text('date').notNull(),
  value: real('value').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const userPrefs = sqliteTable('user_prefs', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const customThemes = sqliteTable('custom_themes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  backgroundColor: text('background_color').notNull(),
  foregroundColor: text('foreground_color').notNull(),
  createdAt: text('created_at').notNull(),
});

export type StatGroup = typeof statGroups.$inferSelect;
export type NewStatGroup = typeof statGroups.$inferInsert;
export type StatDefinition = typeof statDefinitions.$inferSelect;
export type NewStatDefinition = typeof statDefinitions.$inferInsert;
export type StatEntry = typeof statEntries.$inferSelect;
export type NewStatEntry = typeof statEntries.$inferInsert;
export type CustomTheme = typeof customThemes.$inferSelect;
