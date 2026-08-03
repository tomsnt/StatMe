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

export type PickerItem = {
  id: string;
  name: string;
  color?: string;
  subtitle?: string;
};

type Props = {
  visible: boolean;
  title: string;
  items: PickerItem[];
  createLabel: string;
  fg: string;
  bg: string;
  onSelect: (item: PickerItem) => void;
  onCreate: () => void;
  onClose: () => void;
};

export function PickerSheet({ visible, title, items, createLabel, fg, bg, onSelect, onCreate, onClose }: Props) {
  const translateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 600,
      useNativeDriver: true,
      damping: 22,
      stiffness: 220,
    }).start();
  }, [visible]);

  const border = fg + '22';

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.sheet, { backgroundColor: bg, borderTopColor: border, transform: [{ translateY }] }]}>
        <View style={[styles.handle, { backgroundColor: fg + '33' }]} />
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={[styles.title, { color: fg }]}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Text style={[styles.close, { color: fg + '66' }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.createRow, { borderBottomColor: border }]}
            onPress={() => { onClose(); onCreate(); }}
            activeOpacity={0.6}
          >
            <Text style={[styles.createLabel, { color: fg }]}>+ {createLabel}</Text>
          </TouchableOpacity>

          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemRow, { borderBottomColor: border }]}
              onPress={() => { onSelect(item); onClose(); }}
              activeOpacity={0.6}
            >
              {item.color && (
                <View style={[styles.dot, { backgroundColor: item.color }]} />
              )}
              <View style={styles.itemText}>
                <Text style={[styles.itemName, { color: fg }]}>{item.name}</Text>
                {item.subtitle && (
                  <Text style={[styles.itemSub, { color: fg + '66' }]}>{item.subtitle}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: '#00000066' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    maxHeight: '70%',
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
  title: { fontSize: 15, fontWeight: '600' },
  close: { fontSize: 16 },
  createRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  createLabel: { fontSize: 14, fontWeight: '600' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  itemText: { flex: 1 },
  itemName: { fontSize: 14 },
  itemSub: { fontSize: 12, marginTop: 2 },
});
