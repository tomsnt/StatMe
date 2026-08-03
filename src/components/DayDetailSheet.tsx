import { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { formatDisplayDate } from '../utils/format';
import { formatMinutes } from '../utils/time';
import type { StatEntry, StatDefinition, StatGroup } from '../db/schema';

type Props = {
  visible: boolean;
  dateStr: string | null;
  entries: StatEntry[];
  definitions: StatDefinition[];
  groups: StatGroup[];
  fg: string;
  bg: string;
  onClose: () => void;
};

export function DayDetailSheet({ visible, dateStr, entries, definitions, groups, fg, bg, onClose }: Props) {
  const translateY = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 400,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const defMap = Object.fromEntries(definitions.map((d) => [d.id, d]));
  const groupMap = Object.fromEntries(groups.map((g) => [g.id, g]));

  function formatValue(entry: StatEntry): string {
    const def = defMap[entry.statDefinitionId];
    if (!def) return String(entry.value);
    if (def.isTimeBased) return formatMinutes(entry.value);
    return `${entry.value} ${def.valueLabel}`;
  }

  const borderColor = fg + '22';

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: bg, borderTopColor: borderColor, transform: [{ translateY }] },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: fg + '33' }]} />

        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <Text style={[styles.dateLabel, { color: fg }]}>
            {dateStr ? formatDisplayDate(dateStr) : ''}
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Text style={[styles.closeBtn, { color: fg + '88' }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: fg + '44' }]}>Nessuna statistica</Text>
          </View>
        ) : (
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {entries.map((entry) => {
              const def = defMap[entry.statDefinitionId];
              const group = def ? groupMap[def.groupId] : undefined;
              return (
                <View key={entry.id} style={[styles.entryRow, { borderBottomColor: borderColor }]}>
                  <View style={[styles.colorDot, { backgroundColor: def?.color ?? '#888' }]} />
                  <View style={styles.entryInfo}>
                    <Text style={[styles.entryName, { color: fg }]}>{def?.name ?? '—'}</Text>
                    {group && (
                      <Text style={[styles.entryGroup, { color: fg + '66' }]}>{group.name}</Text>
                    )}
                  </View>
                  <Text style={[styles.entryValue, { color: fg }]}>{formatValue(entry)}</Text>
                </View>
              );
            })}
            <View style={{ height: 32 }} />
          </ScrollView>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#00000066',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    maxHeight: '60%',
    minHeight: 200,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  closeBtn: {
    fontSize: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 20,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  entryGroup: {
    fontSize: 12,
    marginTop: 2,
  },
  entryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
