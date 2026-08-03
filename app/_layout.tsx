import { Stack } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useInitApp } from '../src/hooks/useInitApp';
import { useTheme } from '../src/hooks/useTheme';

export default function RootLayout() {
  const ready = useInitApp();
  const { bg } = useTheme();

  if (!ready) {
    return (
      <SafeAreaProvider>
        <View style={[styles.loading, { backgroundColor: bg }]}>
          <ActivityIndicator color={bg === '#1A141F' ? '#EBEBEB' : '#fff'} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add-entry" options={{ presentation: 'modal' }} />
          <Stack.Screen name="stat-detail/[id]" />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
