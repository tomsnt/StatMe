import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch,
  TextInput, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useThemeStore } from '../../src/store/themeStore';
import { useChartPrefsStore } from '../../src/store/chartPrefsStore';
import { ThemeSwatch } from '../../src/components/ThemeSwatch';
import { SegmentedControl } from '../../src/components/SegmentedControl';
import { ColorGrid } from '../../src/components/ColorGrid';
import { ChartPreview } from '../../src/components/ChartPreview';
import { BUILT_IN_THEMES, DEFAULT_THEME_ID } from '../../src/constants/themes';
import { PRESET_COLORS } from '../../src/constants/colors';
import { savePref, insertCustomTheme, deleteCustomTheme } from '../../src/db/actions';
import { generateId } from '../../src/utils/id';
import { exportBackup, importBackup } from '../../src/utils/backup';
import type { LineStyle, DataPointStyle, VerticalLineStyle } from '../../src/constants/chartPrefs';

const OPACITY_OPTIONS = [
  { label: 'Leggera', value: 0.15 },
  { label: 'Media', value: 0.25 },
  { label: 'Forte', value: 0.40 },
] as const;

type OpacityValue = 0.15 | 0.25 | 0.40;

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR];

export default function SettingsScreen() {
  const { bg, fg } = useTheme();
  const insets = useSafeAreaInsets();
  const themeStore = useThemeStore();
  const { prefs, setPrefs, setVerticalLine } = useChartPrefsStore();

  const allThemes = themeStore.getAllThemes();

  // custom theme form
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customBg, setCustomBg] = useState(PRESET_COLORS[0]!);
  const [customFg, setCustomFg] = useState(PRESET_COLORS[4]!);

  // backup
  const [exportYear, setExportYear] = useState(CURRENT_YEAR);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  async function persistTheme(id: string) {
    themeStore.setActiveTheme(id);
    savePref('activeThemeId', id);
  }

  async function persistInverted(val: boolean) {
    themeStore.setInverted(val);
    savePref('inverted', String(val));
  }

  async function persistChartPrefs(update: Parameters<typeof setPrefs>[0]) {
    setPrefs(update);
    const next = { ...prefs, ...update };
    savePref('chartPrefs', JSON.stringify(next));
  }

  async function persistVerticalLine(update: Parameters<typeof setVerticalLine>[0]) {
    setVerticalLine(update);
    const next = { ...prefs, verticalLine: { ...prefs.verticalLine, ...update } };
    savePref('chartPrefs', JSON.stringify(next));
  }

  async function handleSaveCustomTheme() {
    if (!customName.trim()) { Alert.alert('Errore', 'Inserisci un nome per il tema.'); return; }
    const theme = {
      id: generateId(),
      name: customName.trim(),
      backgroundColor: customBg,
      foregroundColor: customFg,
      createdAt: new Date().toISOString(),
    };
    await insertCustomTheme(theme);
    themeStore.addCustomTheme(theme);
    setShowCustomForm(false);
    setCustomName('');
  }

  async function handleDeleteCustomTheme(id: string, name: string) {
    Alert.alert('Elimina tema', `Eliminare "${name}"?`, [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina', style: 'destructive',
        onPress: async () => {
          await deleteCustomTheme(id);
          themeStore.removeCustomTheme(id);
          if (themeStore.activeThemeId === id) persistTheme(DEFAULT_THEME_ID);
        },
      },
    ]);
  }

  async function handleExport() {
    setExporting(true);
    try {
      await exportBackup(exportYear);
    } catch (e: unknown) {
      Alert.alert('Errore', e instanceof Error ? e.message : 'Esportazione fallita.');
    } finally {
      setExporting(false);
    }
  }

  async function handleImport() {
    setImporting(true);
    try {
      const { imported, error } = await importBackup();
      if (error) Alert.alert('Errore', error);
      else Alert.alert('Importazione completata', `${imported} voci importate. Riavvia l'app per vedere i dati.`);
    } catch {
      Alert.alert('Errore', 'Importazione fallita.');
    } finally {
      setImporting(false);
    }
  }

  const border = fg + '18';
  const sectionTitleStyle = [styles.sectionTitle, { color: fg + '88' }];
  const rowStyle = [styles.row, { borderBottomColor: border }];
  const rowLabelStyle = [styles.rowLabel, { color: fg }];
  const subLabelStyle = [styles.subLabel, { color: fg + '66' }];

  const closestOpacity = OPACITY_OPTIONS.reduce((prev, cur) =>
    Math.abs(cur.value - prefs.verticalLine.opacity) < Math.abs(prev.value - prefs.verticalLine.opacity) ? cur : prev
  ).value as OpacityValue;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.title, { color: fg }]}>Impostazioni</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── TEMA ── */}
        <Text style={sectionTitleStyle}>TEMA</Text>
        <View style={[styles.card, { borderColor: border }]}>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.swatchScroll} contentContainerStyle={styles.swatchRow}>
            {allThemes.map((theme) => (
              <ThemeSwatch
                key={theme.id}
                theme={theme}
                active={themeStore.activeThemeId === theme.id}
                inverted={themeStore.inverted}
                onPress={() => persistTheme(theme.id)}
                onLongPress={theme.isCustom ? () => handleDeleteCustomTheme(theme.id, theme.name) : undefined}
              />
            ))}
          </ScrollView>

          <View style={[rowStyle, { justifyContent: 'space-between' }]}>
            <View>
              <Text style={rowLabelStyle}>Invertito</Text>
              <Text style={subLabelStyle}>Scambia sfondo e primo piano</Text>
            </View>
            <Switch
              value={themeStore.inverted}
              onValueChange={persistInverted}
              trackColor={{ true: fg + 'AA' }}
              thumbColor={fg}
            />
          </View>

          {!showCustomForm ? (
            <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={() => setShowCustomForm(true)} activeOpacity={0.7}>
              <Ionicons name="add-circle-outline" size={18} color={fg + '88'} />
              <Text style={[styles.rowLabel, { color: fg + '88' }]}>Crea tema personalizzato</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.customForm, { borderTopColor: border }]}>
              <View style={styles.customFormHeader}>
                <Text style={[styles.subLabel, { color: fg + '99' }]}>NUOVO TEMA</Text>
                <TouchableOpacity onPress={() => setShowCustomForm(false)} hitSlop={8}>
                  <Text style={[styles.subLabel, { color: fg + '66' }]}>Annulla</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, { color: fg, borderColor: border, backgroundColor: fg + '08' }]}
                placeholder="Nome tema"
                placeholderTextColor={fg + '44'}
                value={customName}
                onChangeText={setCustomName}
              />
              <Text style={subLabelStyle}>Colore sfondo</Text>
              <ColorGrid selected={customBg} onSelect={setCustomBg} fg={fg} />
              <Text style={[subLabelStyle, { marginTop: 12 }]}>Colore primo piano</Text>
              <ColorGrid selected={customFg} onSelect={setCustomFg} fg={fg} />
              <View style={[styles.previewMini, { backgroundColor: customBg, borderColor: border }]}>
                <Text style={{ color: customFg, fontSize: 13, fontWeight: '600' }}>Anteprima — {customName || 'Senza nome'}</Text>
              </View>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: fg }]} onPress={handleSaveCustomTheme} activeOpacity={0.8}>
                <Text style={[styles.saveBtnText, { color: bg }]}>Salva tema</Text>
              </TouchableOpacity>
            </View>
          )}

          {themeStore.customThemes.length > 0 && (
            <Text style={[subLabelStyle, { paddingHorizontal: 16, paddingBottom: 10, marginTop: -4 }]}>
              Tieni premuto un tema personalizzato per eliminarlo
            </Text>
          )}
        </View>

        {/* ── GRAFICO ── */}
        <Text style={[sectionTitleStyle, { marginTop: 24 }]}>STILE GRAFICO</Text>
        <View style={[styles.card, { borderColor: border }]}>

          <View style={rowStyle}>
            <Text style={rowLabelStyle}>Linea</Text>
            <View style={styles.controlRight}>
              <SegmentedControl
                options={[{ label: 'Morbida', value: 'smooth' }, { label: 'Netta', value: 'sharp' }]}
                selected={prefs.lineStyle}
                onSelect={(v: LineStyle) => persistChartPrefs({ lineStyle: v })}
                fg={fg} bg={bg}
              />
            </View>
          </View>

          <View style={rowStyle}>
            <Text style={rowLabelStyle}>Punti dati</Text>
            <View style={styles.controlRight}>
              <SegmentedControl
                options={[
                  { label: 'Nessuno', value: 'none' },
                  { label: 'Cerchio', value: 'circle' },
                  { label: 'Diamante', value: 'diamond' },
                ]}
                selected={prefs.dataPoint}
                onSelect={(v: DataPointStyle) => persistChartPrefs({ dataPoint: v })}
                fg={fg} bg={bg}
              />
            </View>
          </View>

          <View style={[rowStyle, { justifyContent: 'space-between' }]}>
            <Text style={rowLabelStyle}>Linee verticali</Text>
            <Switch
              value={prefs.verticalLine.visible}
              onValueChange={(v) => persistVerticalLine({ visible: v })}
              trackColor={{ true: fg + 'AA' }}
              thumbColor={fg}
            />
          </View>

          {prefs.verticalLine.visible && (
            <>
              <View style={rowStyle}>
                <Text style={rowLabelStyle}>Stile linee</Text>
                <View style={styles.controlRight}>
                  <SegmentedControl
                    options={[{ label: 'Continua', value: 'solid' }, { label: 'Tratteggiata', value: 'dashed' }]}
                    selected={prefs.verticalLine.style}
                    onSelect={(v: VerticalLineStyle) => persistVerticalLine({ style: v })}
                    fg={fg} bg={bg}
                  />
                </View>
              </View>
              <View style={rowStyle}>
                <Text style={rowLabelStyle}>Intensità</Text>
                <View style={styles.controlRight}>
                  <SegmentedControl
                    options={OPACITY_OPTIONS.map((o) => ({ label: o.label, value: String(o.value) }))}
                    selected={String(closestOpacity)}
                    onSelect={(v: string) => persistVerticalLine({ opacity: Number(v) as OpacityValue })}
                    fg={fg} bg={bg}
                  />
                </View>
              </View>
            </>
          )}

          <View style={[styles.previewWrap, { borderTopColor: border }]}>
            <Text style={[subLabelStyle, { marginBottom: 10 }]}>ANTEPRIMA</Text>
            <ChartPreview fg={fg} bg={bg} />
          </View>
        </View>

        {/* ── BACKUP ── */}
        <Text style={[sectionTitleStyle, { marginTop: 24 }]}>BACKUP</Text>
        <View style={[styles.card, { borderColor: border }]}>

          <View style={rowStyle}>
            <Text style={rowLabelStyle}>Anno da esportare</Text>
            <View style={styles.yearPicker}>
              {YEAR_OPTIONS.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={[styles.yearBtn, { borderColor: border }, exportYear === y && { backgroundColor: fg }]}
                  onPress={() => setExportYear(y)}
                >
                  <Text style={[styles.yearLabel, { color: exportYear === y ? bg : fg }]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={[rowStyle, styles.actionRow]} onPress={handleExport} disabled={exporting} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={18} color={fg} />
            <Text style={rowLabelStyle}>{exporting ? 'Esportazione…' : `Esporta ${exportYear} come JSON`}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }, styles.actionRow]} onPress={handleImport} disabled={importing} activeOpacity={0.7}>
            <Ionicons name="download-outline" size={18} color={fg} />
            <Text style={rowLabelStyle}>{importing ? 'Importazione…' : 'Importa da file JSON'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── INFO ── */}
        <Text style={[sectionTitleStyle, { marginTop: 24 }]}>INFO</Text>
        <View style={[styles.card, { borderColor: border }]}>
          <View style={[styles.row, { borderBottomWidth: 0, justifyContent: 'space-between' }]}>
            <Text style={rowLabelStyle}>StatMe</Text>
            <Text style={subLabelStyle}>v1.0.0</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '700', letterSpacing: 0.3 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 4 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    overflow: 'hidden',
  },
  swatchScroll: { paddingVertical: 16 },
  swatchRow: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  rowLabel: { fontSize: 14, fontWeight: '500' },
  subLabel: { fontSize: 12, marginTop: 2 },
  controlRight: { flex: 1 },
  customForm: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 12,
  },
  customFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  previewMini: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 14, fontWeight: '700' },
  previewWrap: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  yearPicker: { flexDirection: 'row', gap: 8 },
  yearBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  yearLabel: { fontSize: 13, fontWeight: '500' },
  actionRow: { gap: 10 },
});
