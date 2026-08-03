import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';

export default function StatDetailScreen() {
  const { bg, fg } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={fg} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: fg }]}>Dettaglio</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.placeholder}>
        <Text style={[styles.placeholderText, { color: fg + '55' }]}>
          Stat detail chart for {id} — Phase 5
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
  title: { fontSize: 18, fontWeight: '600', letterSpacing: 0.3 },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 14 },
});
