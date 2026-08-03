import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { db } from '../db';
import { statGroups, statDefinitions, statEntries, customThemes } from '../db/schema';
import { insertGroup, insertDefinition, insertEntry } from '../db/actions';
import type { StatGroup, StatDefinition, StatEntry, CustomTheme } from '../db/schema';

type BackupData = {
  version: 1;
  exportedAt: string;
  year: number;
  groups: StatGroup[];
  definitions: StatDefinition[];
  entries: StatEntry[];
  customThemes: CustomTheme[];
};

export async function exportBackup(year: number): Promise<void> {
  const [groups, definitions, allEntries, themes] = await Promise.all([
    db.select().from(statGroups),
    db.select().from(statDefinitions),
    db.select().from(statEntries),
    db.select().from(customThemes),
  ]);

  const entries = allEntries.filter((e) => e.date.startsWith(String(year)));

  const data: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    year,
    groups,
    definitions,
    entries,
    customThemes: themes,
  };

  const json = JSON.stringify(data, null, 2);
  const path = `${FileSystem.cacheDirectory}statme-backup-${year}.json`;
  await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) throw new Error('Condivisione non disponibile su questo dispositivo.');
  await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: `Backup StatMe ${year}` });
}

export async function importBackup(): Promise<{ imported: number; error?: string }> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });

  if (result.canceled) return { imported: 0 };

  const asset = result.assets[0];
  if (!asset) return { imported: 0, error: 'Nessun file selezionato.' };

  const json = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });

  let data: BackupData;
  try {
    data = JSON.parse(json);
  } catch {
    return { imported: 0, error: 'File non valido.' };
  }

  if (data.version !== 1 || !Array.isArray(data.entries)) {
    return { imported: 0, error: 'Formato backup non riconosciuto.' };
  }

  const now = new Date().toISOString();
  let count = 0;

  for (const g of data.groups ?? []) {
    try { await insertGroup({ ...g, updatedAt: now }); } catch {}
  }
  for (const d of data.definitions ?? []) {
    try { await insertDefinition({ ...d, updatedAt: now }); } catch {}
  }
  for (const e of data.entries ?? []) {
    try { await insertEntry({ ...e, updatedAt: now }); count++; } catch {}
  }

  return { imported: count };
}
