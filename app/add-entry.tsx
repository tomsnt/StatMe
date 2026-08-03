import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';

export default function AddEntryModal() {
  const { bg, fg } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: fg }]}>Aggiungi statistica</Text>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={fg} />
        </TouchableOpacity>
      </View>

      <View style={styles.placeholder}>
        <Text style={[styles.placeholderText, { color: fg + '55' }]}>
          Add entry form — Phase 4
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
