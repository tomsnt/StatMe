import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '../constants/themes';

type Props = {
  theme: Theme;
  active: boolean;
  inverted: boolean;
  onPress: () => void;
  onLongPress?: () => void;
};

export function ThemeSwatch({ theme, active, inverted, onPress, onLongPress }: Props) {
  const bg = inverted ? theme.foregroundColor : theme.backgroundColor;
  const fg = inverted ? theme.backgroundColor : theme.foregroundColor;

  return (
    <TouchableOpacity
      style={[styles.wrap, active && { borderColor: fg, borderWidth: 2 }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.75}
    >
      <View style={[styles.swatch, { backgroundColor: bg }]}>
        <View style={[styles.fgStripe, { backgroundColor: fg }]} />
        {active && (
          <View style={styles.checkWrap}>
            <Ionicons name="checkmark" size={12} color={bg} />
          </View>
        )}
      </View>
      <Text style={[styles.name, { color: fg }]} numberOfLines={1}>{theme.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 10,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fgStripe: {
    height: 14,
    width: '100%',
  },
  checkWrap: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#00000055',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 5,
    maxWidth: 56,
    textAlign: 'center',
  },
});
