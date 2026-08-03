import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';

export default function SettingsScreen() {
  const { bg, fg } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: fg }]}>Impostazioni</Text>
      </View>

      <View style={styles.placeholder}>
        <Text style={[styles.placeholderText, { color: fg + '55' }]}>
          Settings — Phase 6
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '600', letterSpacing: 0.3 },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 14 },
});
