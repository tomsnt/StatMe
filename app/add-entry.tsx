import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Switch, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/hooks/useTheme';
import { useStatsStore } from '../src/store/statsStore';
import { insertGroup, insertDefinition, insertEntry } from '../src/db/actions';
import { PickerSheet, type PickerItem } from '../src/components/PickerSheet';
import { ColorGrid } from '../src/components/ColorGrid';
import { PRESET_COLORS } from '../src/constants/colors';
import { generateId } from '../src/utils/id';
import { parseTimeInput, validateTimeInput } from '../src/utils/time';
import { todayString } from '../src/utils/format';

type Mode = 'pick' | 'new';

export default function AddEntryModal() {
  const { bg, fg } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { definitions, groups, addGroup, addDefinition, addEntry } = useStatsStore();

  // stat
  const [statMode, setStatMode] = useState<Mode>('pick');
  const [selectedDefId, setSelectedDefId] = useState<string | null>(null);
  const [statPickerOpen, setStatPickerOpen] = useState(false);
  const [newStatName, setNewStatName] = useState('');
  const [newStatColor, setNewStatColor] = useState(PRESET_COLORS[0]!);
  const [newStatValueLabel, setNewStatValueLabel] = useState('');
  const [newStatIsTimeBased, setNewStatIsTimeBased] = useState(false);

  // group
  const [groupMode, setGroupMode] = useState<Mode>('pick');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupPickerOpen, setGroupPickerOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState(PRESET_COLORS[5]!);

  // value & description
  const [valueInput, setValueInput] = useState('');
  const [description, setDescription] = useState('');

  const [saving, setSaving] = useState(false);

  const selectedDef = definitions.find((d) => d.id === selectedDefId) ?? null;
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;
  const isTimeBased = statMode === 'new' ? newStatIsTimeBased : (selectedDef?.isTimeBased ?? false);
  const valueLabel = statMode === 'new' ? newStatValueLabel : (selectedDef?.valueLabel ?? '');

  function handleSelectStat(item: PickerItem) {
    setStatMode('pick');
    setSelectedDefId(item.id);
    const def = definitions.find((d) => d.id === item.id);
    if (def) setSelectedGroupId(def.groupId);
  }

  function handleCreateNewStat() {
    setStatMode('new');
    setSelectedDefId(null);
    setSelectedGroupId(null);
    setNewStatName('');
    setNewStatIsTimeBased(false);
    setNewStatValueLabel('');
  }

  function handleSelectGroup(item: PickerItem) {
    setGroupMode('pick');
    setSelectedGroupId(item.id);
  }

  function handleCreateNewGroup() {
    setGroupMode('new');
    setSelectedGroupId(null);
    setNewGroupName('');
  }

  function validate(): string | null {
    if (statMode === 'new') {
      if (!newStatName.trim()) return 'Inserisci il nome della statistica.';
      if (!newStatValueLabel.trim()) return 'Inserisci il nome del valore (es. ripetizioni).';
    } else if (!selectedDefId) {
      return 'Seleziona una statistica.';
    }
    if (groupMode === 'new') {
      if (!newGroupName.trim()) return 'Inserisci il nome del gruppo.';
    } else if (!selectedGroupId) {
      return 'Seleziona un gruppo.';
    }
    if (!valueInput.trim()) return 'Inserisci un valore.';
    if (isTimeBased && !validateTimeInput(valueInput)) {
      return 'Formato tempo non valido. Usa H.MM (es. 1.30 = 1h 30m).';
    }
    const num = parseFloat(valueInput.replace(',', '.'));
    if (isNaN(num) && !isTimeBased) return 'Il valore deve essere un numero.';
    return null;
  }

  async function handleSave() {
    const err = validate();
    if (err) { Alert.alert('Errore', err); return; }

    setSaving(true);
    try {
      const now = new Date().toISOString();

      let groupId = selectedGroupId!;
      if (groupMode === 'new') {
        const newGroup = {
          id: generateId(),
          name: newGroupName.trim(),
          color: newGroupColor,
          createdAt: now,
          updatedAt: now,
        };
        await insertGroup(newGroup);
        addGroup(newGroup);
        groupId = newGroup.id;
      }

      let defId = selectedDefId!;
      if (statMode === 'new') {
        const newDef = {
          id: generateId(),
          groupId,
          name: newStatName.trim(),
          valueLabel: newStatValueLabel.trim(),
          color: newStatColor,
          isTimeBased: newStatIsTimeBased,
          createdAt: now,
          updatedAt: now,
        };
        await insertDefinition(newDef);
        addDefinition(newDef);
        defId = newDef.id;
      }

      const rawValue = isTimeBased
        ? parseTimeInput(valueInput.replace(',', '.'))
        : parseFloat(valueInput.replace(',', '.'));

      const newEntry = {
        id: generateId(),
        statDefinitionId: defId,
        date: todayString(),
        value: rawValue,
        description: description.trim() || null,
        createdAt: now,
        updatedAt: now,
      };
      await insertEntry(newEntry);
      addEntry(newEntry);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      Alert.alert('Errore', 'Salvataggio fallito. Riprova.');
    } finally {
      setSaving(false);
    }
  }

  const border = fg + '22';
  const inputStyle = [styles.input, { color: fg, borderColor: border, backgroundColor: fg + '08' }];
  const labelStyle = [styles.label, { color: fg + '99' }];
  const sectionStyle = [styles.section, { borderBottomColor: border }];

  const statPickerItems: PickerItem[] = definitions.map((d) => ({
    id: d.id,
    name: d.name,
    color: d.color,
    subtitle: groups.find((g) => g.id === d.groupId)?.name,
  }));

  const groupPickerItems: PickerItem[] = groups.map((g) => ({
    id: g.id,
    name: g.name,
    color: g.color,
  }));

  const groupIsLocked = statMode === 'pick' && selectedDefId !== null;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.topBar, { paddingTop: insets.top + 12, borderBottomColor: border }]}>
        <Text style={[styles.topTitle, { color: fg }]}>Aggiungi statistica</Text>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={22} color={fg + '99'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── STATISTICA ── */}
        <View style={sectionStyle}>
          <Text style={labelStyle}>STATISTICA</Text>

          {statMode === 'pick' ? (
            <TouchableOpacity
              style={[styles.pickerRow, { borderColor: border }]}
              onPress={() => setStatPickerOpen(true)}
              activeOpacity={0.7}
            >
              {selectedDef ? (
                <View style={styles.pickerRowInner}>
                  <View style={[styles.dotSm, { backgroundColor: selectedDef.color }]} />
                  <Text style={[styles.pickerValue, { color: fg }]}>{selectedDef.name}</Text>
                </View>
              ) : (
                <Text style={[styles.pickerPlaceholder, { color: fg + '44' }]}>
                  Seleziona o crea nuova…
                </Text>
              )}
              <Ionicons name="chevron-down" size={16} color={fg + '66'} />
            </TouchableOpacity>
          ) : (
            <View style={styles.newBlock}>
              <View style={[styles.newBlockHeader, { borderColor: border }]}>
                <Text style={[styles.newBlockLabel, { color: fg + '88' }]}>Nuova statistica</Text>
                <TouchableOpacity onPress={() => setStatMode('pick')} hitSlop={8}>
                  <Text style={[styles.cancelNew, { color: fg + '66' }]}>Annulla</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={inputStyle}
                placeholder="Nome (es. Flessioni)"
                placeholderTextColor={fg + '44'}
                value={newStatName}
                onChangeText={setNewStatName}
              />

              <Text style={[labelStyle, { marginTop: 12 }]}>Colore</Text>
              <ColorGrid selected={newStatColor} onSelect={setNewStatColor} fg={fg} />

              <TextInput
                style={[inputStyle, { marginTop: 12 }]}
                placeholder="Etichetta valore (es. ripetizioni)"
                placeholderTextColor={fg + '44'}
                value={newStatValueLabel}
                onChangeText={setNewStatValueLabel}
              />

              <View style={[styles.toggleRow, { borderColor: border }]}>
                <View>
                  <Text style={[styles.toggleLabel, { color: fg }]}>Valore temporale</Text>
                  <Text style={[styles.toggleSub, { color: fg + '66' }]}>
                    1.30 = 1h 30min • permanente
                  </Text>
                </View>
                <Switch
                  value={newStatIsTimeBased}
                  onValueChange={setNewStatIsTimeBased}
                  trackColor={{ true: fg + 'AA' }}
                  thumbColor={fg}
                />
              </View>
            </View>
          )}

          {statMode === 'pick' && selectedDef?.isTimeBased && (
            <View style={[styles.badge, { borderColor: fg + '44' }]}>
              <Text style={[styles.badgeText, { color: fg + '88' }]}>⏱ Valore temporale (H.MM)</Text>
            </View>
          )}
        </View>

        {/* ── GRUPPO ── */}
        <View style={sectionStyle}>
          <Text style={labelStyle}>GRUPPO</Text>

          {groupIsLocked ? (
            <View style={[styles.pickerRow, { borderColor: border, opacity: 0.6 }]}>
              <View style={styles.pickerRowInner}>
                {selectedGroup && <View style={[styles.dotSm, { backgroundColor: selectedGroup.color }]} />}
                <Text style={[styles.pickerValue, { color: fg }]}>
                  {selectedGroup?.name ?? '—'}
                </Text>
              </View>
              <Ionicons name="lock-closed-outline" size={14} color={fg + '55'} />
            </View>
          ) : groupMode === 'pick' ? (
            <TouchableOpacity
              style={[styles.pickerRow, { borderColor: border }]}
              onPress={() => setGroupPickerOpen(true)}
              activeOpacity={0.7}
            >
              {selectedGroup ? (
                <View style={styles.pickerRowInner}>
                  <View style={[styles.dotSm, { backgroundColor: selectedGroup.color }]} />
                  <Text style={[styles.pickerValue, { color: fg }]}>{selectedGroup.name}</Text>
                </View>
              ) : (
                <Text style={[styles.pickerPlaceholder, { color: fg + '44' }]}>
                  Seleziona o crea nuovo…
                </Text>
              )}
              <Ionicons name="chevron-down" size={16} color={fg + '66'} />
            </TouchableOpacity>
          ) : (
            <View style={styles.newBlock}>
              <View style={[styles.newBlockHeader, { borderColor: border }]}>
                <Text style={[styles.newBlockLabel, { color: fg + '88' }]}>Nuovo gruppo</Text>
                <TouchableOpacity onPress={() => setGroupMode('pick')} hitSlop={8}>
                  <Text style={[styles.cancelNew, { color: fg + '66' }]}>Annulla</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={inputStyle}
                placeholder="Nome gruppo (es. Allenamento)"
                placeholderTextColor={fg + '44'}
                value={newGroupName}
                onChangeText={setNewGroupName}
              />
              <Text style={[labelStyle, { marginTop: 12 }]}>Colore gruppo</Text>
              <ColorGrid selected={newGroupColor} onSelect={setNewGroupColor} fg={fg} />
            </View>
          )}
        </View>

        {/* ── VALORE ── */}
        <View style={sectionStyle}>
          <Text style={labelStyle}>
            VALORE{valueLabel ? ` — ${valueLabel.toUpperCase()}` : ''}
          </Text>
          <TextInput
            style={inputStyle}
            placeholder={isTimeBased ? '0.00  (H.MM)' : '0'}
            placeholderTextColor={fg + '44'}
            value={valueInput}
            onChangeText={setValueInput}
            keyboardType="decimal-pad"
          />
          {isTimeBased && (
            <Text style={[styles.hint, { color: fg + '55' }]}>
              Esempio: 1.30 = 1 ora e 30 minuti
            </Text>
          )}
        </View>

        {/* ── DESCRIZIONE ── */}
        <View style={[sectionStyle, { borderBottomWidth: 0 }]}>
          <Text style={labelStyle}>DESCRIZIONE (opzionale)</Text>
          <TextInput
            style={[inputStyle, styles.descInput]}
            placeholder="Note aggiuntive…"
            placeholderTextColor={fg + '44'}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      {/* ── AGGIUNGI BUTTON ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12, borderTopColor: border, backgroundColor: bg }]}>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: fg }]}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={saving}
        >
          <Text style={[styles.addBtnText, { color: bg }]}>
            {saving ? 'Salvataggio…' : 'Aggiungi'}
          </Text>
        </TouchableOpacity>
      </View>

      <PickerSheet
        visible={statPickerOpen}
        title="Seleziona statistica"
        items={statPickerItems}
        createLabel="Crea nuova statistica"
        fg={fg}
        bg={bg}
        onSelect={handleSelectStat}
        onCreate={handleCreateNewStat}
        onClose={() => setStatPickerOpen(false)}
      />

      <PickerSheet
        visible={groupPickerOpen}
        title="Seleziona gruppo"
        items={groupPickerItems}
        createLabel="Crea nuovo gruppo"
        fg={fg}
        bg={bg}
        onSelect={handleSelectGroup}
        onCreate={handleCreateNewGroup}
        onClose={() => setGroupPickerOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topTitle: { fontSize: 17, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8 },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
  pickerRowInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pickerValue: { fontSize: 15 },
  pickerPlaceholder: { fontSize: 15 },
  dotSm: { width: 10, height: 10, borderRadius: 5 },
  newBlock: { gap: 8 },
  newBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  newBlockLabel: { fontSize: 12, fontWeight: '600' },
  cancelNew: { fontSize: 13 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  toggleLabel: { fontSize: 14, fontWeight: '500' },
  toggleSub: { fontSize: 11, marginTop: 2 },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12 },
  hint: { fontSize: 12, marginTop: -2 },
  descInput: { minHeight: 80, textAlignVertical: 'top', paddingTop: 12 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  addBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addBtnText: { fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
