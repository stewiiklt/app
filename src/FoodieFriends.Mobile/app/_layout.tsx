import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { DemoProvider } from '../src/demo/DemoContext';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } } }));
  return (
    <SafeAreaProvider>
      <View style={styles.previewSurface}>
        <View style={styles.phoneCanvas}>
          <QueryClientProvider client={queryClient}>
            <DemoProvider>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFAF5' } }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="restaurant/[id]" options={{ animation: 'slide_from_right' }} />
              </Stack>
            </DemoProvider>
          </QueryClientProvider>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Expo web uses this outer surface to present a phone-sized app canvas on
  // desktop. On Android the canvas naturally fills the available screen width.
  previewSurface: { flex: 1, width: '100%', backgroundColor: '#EDE7DF' },
  phoneCanvas: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFAF5',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E4DCD2',
    shadowColor: '#2D3436',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
});
