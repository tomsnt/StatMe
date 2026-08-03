import { View, Text, StyleSheet } from 'react-native';

type Dot = { groupId: string; color: string };

const MAX_DOTS = 5;

export function CalendarDots({ dots }: { dots: Dot[] }) {
  if (dots.length === 0) return null;

  const visible = dots.slice(0, MAX_DOTS);
  const overflow = dots.length - MAX_DOTS;

  return (
    <View style={styles.row}>
      {visible.map((dot) => (
        <View key={dot.groupId} style={[styles.dot, { backgroundColor: dot.color }]} />
      ))}
      {overflow > 0 && <Text style={styles.overflow}>+{overflow}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginTop: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  overflow: {
    fontSize: 7,
    color: '#888',
  },
});
