import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { formatMonthYear, todayString } from '../../src/utils/format';

export default function CalendarScreen() {
  const { bg, fg } = useTheme();
  const router = useRouter();
  const today = new Date();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Text style={[styles.headerDate, { color: fg }]}>
          {formatMonthYear(today.getFullYear(), today.getMonth())}
        </Text>
        <TouchableOpacity onPress={() => router.push('/add-entry')} hitSlop={12}>
          <Ionicons name="add" size={28} color={fg} />
        </TouchableOpacity>
      </View>

      <View style={styles.placeholder}>
        <Text style={[styles.placeholderText, { color: fg + '55' }]}>
          Calendar — Phase 3
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerDate: { fontSize: 18, fontWeight: '600', letterSpacing: 0.3 },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 14 },
});
