import { Redirect } from 'expo-router';

// Redirect to today screen
// This route is hidden from tabs (href: null in _layout.tsx)
export default function TabsIndex() {
  return <Redirect href="/(tabs)/today" />;
}
