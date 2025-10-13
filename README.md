# AI Daily Motivation Coach

A React Native app built with Expo Router for daily motivation and goal tracking, powered by Supabase.

## Features

- **Cloud Sync**: All data synced to Supabase cloud database
- **Expo Router**: File-based routing system
- **Theme System**: Light/Dark mode with system preference support
- **System Fonts**: Uses native system fonts for better performance
- **Navigation**: Bottom tab navigation between main sections
- **Goal Management**: Create and track personal goals with cloud backup
- **AI-Powered Plans**: Daily task generation based on your goals
- **Activity History**: View past activities and progress
- **Settings**: Customize app appearance and preferences
- **Multi-language**: Support for English, French, and Arabic

## Project Structure

```
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with theme provider
│   ├── index.tsx          # Home screen
│   ├── goals.tsx          # Goals management
│   ├── history.tsx        # Activity history
│   └── settings.tsx       # App settings
├── contexts/
│   └── ThemeContext.tsx   # Theme provider and context
├── components/
│   └── BottomTabNavigator.tsx # Bottom navigation component
└── assets/                # App icons and images
```

## Getting Started

### Quick Setup

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure Supabase:**
   
   See [QUICKSTART_SUPABASE.md](./QUICKSTART_SUPABASE.md) for a 5-minute setup guide.
   
   Quick steps:
   - Create a `.env` file with your Supabase credentials
   - Run the migration SQL in Supabase Dashboard
   
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://lhommbfjfruiekqukqvc.supabase.co
   EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your preferred platform:**
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

### Detailed Setup

For complete setup instructions, see:
- 🚀 [Quick Start Guide](./QUICKSTART_SUPABASE.md) - Get started in 5 minutes
- 📚 [Full Setup Guide](./SUPABASE_SETUP.md) - Detailed configuration and troubleshooting

## Theme System

The app includes a comprehensive theme system with:
- Light and dark color schemes
- System preference detection
- Persistent theme selection
- Context-based theme management

## Navigation

- **Home**: Welcome screen with app overview
- **Goals**: Create and manage personal goals
- **History**: View activity history and statistics
- **Settings**: App configuration and theme selection

## Tech Stack

- **Frontend**: React Native with TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Internationalization**: i18next (English, French, Arabic)
- **Authentication**: Anonymous users (ready for full auth)
- **Styling**: React Native StyleSheet

## Database

The app uses Supabase for cloud data storage:

- **users**: User profiles and onboarding status
- **settings**: User preferences (locale, wake time, focus areas)
- **goals**: Personal goals with cloud sync
- **plans**: AI-generated daily plans
- **tasks**: Individual tasks within plans

All data is automatically synced to the cloud and persists across app reinstalls.

## Project Structure

```
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   ├── (tabs)/            # Tab navigation screens
│   └── onboarding/        # Onboarding flow
├── lib/
│   ├── supabase.ts        # Supabase client
│   └── supabase.types.ts  # Database types
├── services/
│   ├── database.ts        # Database service
│   ├── database.supabase.ts # Supabase implementation
│   ├── ai.ts              # AI plan generation
│   └── notifications.ts   # Push notifications
├── providers/
│   └── DBProvider.tsx     # Database initialization
├── contexts/
│   ├── store.ts           # Zustand store
│   └── ThemeContext.tsx   # Theme management
├── components/            # Reusable UI components
├── supabase/
│   └── migrations/        # Database migrations
└── assets/                # Icons, images, translations
```
