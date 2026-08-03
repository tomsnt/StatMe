import { create } from 'zustand';
import type { StatGroup, StatDefinition, StatEntry } from '../db/schema';

type StatsStore = {
  groups: StatGroup[];
  definitions: StatDefinition[];
  entries: StatEntry[];
  setGroups: (groups: StatGroup[]) => void;
  setDefinitions: (definitions: StatDefinition[]) => void;
  setEntries: (entries: StatEntry[]) => void;
  addGroup: (group: StatGroup) => void;
  addDefinition: (def: StatDefinition) => void;
  addEntry: (entry: StatEntry) => void;
  removeEntry: (id: string) => void;
  entriesByDate: (date: string) => StatEntry[];
  entriesInRange: (fromDate: string, toDate: string) => StatEntry[];
  definitionsByGroup: (groupId: string) => StatDefinition[];
};

export const useStatsStore = create<StatsStore>((set, get) => ({
  groups: [],
  definitions: [],
  entries: [],

  setGroups: (groups) => set({ groups }),
  setDefinitions: (definitions) => set({ definitions }),
  setEntries: (entries) => set({ entries }),

  addGroup: (group) => set((s) => ({ groups: [...s.groups, group] })),
  addDefinition: (def) => set((s) => ({ definitions: [...s.definitions, def] })),
  addEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
  removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

  entriesByDate: (date) => get().entries.filter((e) => e.date === date),

  entriesInRange: (fromDate, toDate) =>
    get().entries.filter((e) => e.date >= fromDate && e.date <= toDate),

  definitionsByGroup: (groupId) =>
    get().definitions.filter((d) => d.groupId === groupId),
}));
