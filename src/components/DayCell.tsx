import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { CalendarDots } from './CalendarDots';

type Dot = { groupId: string; color: string };

type Props = {
  day: number;
  isToday: boolean;
  dots: Dot[];
  fg: string;
  onPress: () => void;
};

export function DayCell({ day, isToday, dots, fg, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.cell} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.numberWrap, isToday && { backgroundColor: fg }]}>
        <Text
          style={[
            styles.number,
            { color: fg },
            isToday && { color: '#000' },
          ]}
        >
          {day}
        </Text>
      </View>
      <CalendarDots dots={dots} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: 56,
  },
  numberWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 13,
    fontWeight: '500',
  },
});
