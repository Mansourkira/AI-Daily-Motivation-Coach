import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="today" options={{ tabBarIcon: ({ color, size }) => <Feather name="calendar" color={color} size={size} /> }} />
      <Tabs.Screen name="goals" options={{ tabBarIcon: ({ color, size }) => <Feather name="target" color={color} size={size} /> }} />
      <Tabs.Screen name="history" options={{ tabBarIcon: ({ color, size }) => <Feather name="check-circle" color={color} size={size} /> }} />
      <Tabs.Screen name="settings" options={{ tabBarIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} /> }} />
    </Tabs>
  );
}


