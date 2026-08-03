import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRESET_COLORS } from '../constants/colors';

type Props = {
  selected: string;
  onSelect: (color: string) => void;
  fg: string;
};

export function ColorGrid({ selected, onSelect, fg }: Props) {
  return (
    <View style={styles.grid}>
      {PRESET_COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[styles.swatch, { backgroundColor: color }]}
          onPress={() => onSelect(color)}
          activeOpacity={0.7}
        >
          {selected === color && (
            <Ionicons name="checkmark" size={14} color={isLight(color) ? '#000' : '#fff'} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
