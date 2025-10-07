import * as Notifications from 'expo-notifications';

export async function ensureNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleMorningPing(hour = 9, minute = 0) {
  const trigger = new Date();
  trigger.setDate(trigger.getDate() + 1);
  trigger.setHours(hour, minute, 0, 0);
  await Notifications.scheduleNotificationAsync({
    content: { title: "Your plan is ready", body: "Open AI Daily Coach to see today's tasks." },
    trigger,
  });
}

