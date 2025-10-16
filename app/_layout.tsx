import { Stack } from 'expo-router';
import { DBProvider } from '@/providers/DBProvider';

export default function RootLayout() {
  return (
    <DBProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DBProvider>
  );
}
