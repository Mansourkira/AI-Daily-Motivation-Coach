// Note: Push notifications require a development build in Expo SDK 53+
// These functions are disabled for Expo Go compatibility

export async function ensureNotificationPermission(): Promise<boolean> {
  console.log('Notifications disabled in Expo Go - requires development build');
  return false;
}

export async function scheduleMorningPing(hour = 9, minute = 0) {
  console.log('Scheduling notifications disabled in Expo Go - requires development build');
}


