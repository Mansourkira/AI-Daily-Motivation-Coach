# AI Daily Coach - Setup Instructions

## Installation

1. **Install dependencies** (including the new `nanoid` package):
```bash
npm install
```

2. **Set up environment variables**:
Create a `.env` file in the project root with:
```env
EXPO_PUBLIC_API_URL=https://your-api-url.com/api
```

For development, you can use any URL or a placeholder. The app will fallback to local mock tasks if the API is unavailable.

## Configuration

### Notifications (expo-notifications)
- Already configured in `app.json` plugins
- Permissions are requested when user enables notifications in onboarding

### Ads (react-native-google-mobile-ads)
- Already configured in `app.json` plugins
- For production, update the Ad Unit ID in `components/AdsBanner.tsx`:
  - Replace `'ca-app-pub-xxxxxxxx/yyyyyyyy'` with your actual AdMob unit ID
- For development, the app uses test ads automatically

### Build Configuration
For EAS builds, add the environment variable to your EAS secrets:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://your-api-url.com/api
```

## Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Architecture

### Store (Zustand + AsyncStorage)
- **Location**: `contexts/store.ts`
- **Persisted**: Goals, settings, daily plans
- **Key actions**: `addGoal`, `savePlan`, `toggleTask`, `setSettings`

### Services
- **AI Service** (`services/ai.ts`): Generates daily plans (with mock fallback)
- **Notifications** (`services/notifications.ts`): Handles permission and scheduling

### Screens
- **Onboarding**: `/onboarding/language` → `categories` → `quick` → `review`
- **Main Tabs**: Today (index), Goals, History, Settings

## Flow

1. **First Launch**: User goes through onboarding (language → focus areas → goals → review)
2. **Complete Onboarding**: `setOnboardingDone(true)` → Navigate to tabs
3. **Daily Plan**: Auto-generates on Today screen if none exists
4. **Persistence**: All data saved to AsyncStorage via Zustand persist middleware

## Testing Checklist

- [ ] Launch app → onboarding flow appears
- [ ] Complete onboarding → tabs appear
- [ ] Today tab shows generated plan (or mock data)
- [ ] Toggle task completion
- [ ] Regenerate plan
- [ ] Share plan
- [ ] Add/remove goals in Goals tab
- [ ] View history in History tab
- [ ] Change settings (language, wake time, focus areas, notifications)
- [ ] Banner ad visible at bottom of Today screen
- [ ] App persists data across reloads

## Production Checklist

- [ ] Update AdMob unit ID in `components/AdsBanner.tsx`
- [ ] Set production `EXPO_PUBLIC_API_URL` in EAS secrets
- [ ] Test notifications on physical device
- [ ] Test ads in production build
- [ ] Verify data persistence
- [ ] Test all languages (EN, FR, AR)

