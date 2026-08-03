import { Stack } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useInitApp } from '../src/hooks/useInitApp';
import { useTheme } from '../src/hooks/useTheme';

export default function RootLayout() {
  const ready = useInitApp();
  const { bg } = useTheme();

  if (!ready) {
    return (
      <View style={[styles.loading, { backgroundColor: bg }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-entry" options={{ presentation: 'modal' }} />
        <Stack.Screen name="stat-detail/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
