# AI Daily Motivation Coach

A React Native app built with Expo Router for daily motivation and goal tracking.

## Features

- **Expo Router**: File-based routing system
- **Theme System**: Light/Dark mode with system preference support
- **System Fonts**: Uses native system fonts for better performance
- **Navigation**: Bottom tab navigation between main sections
- **Goal Management**: Create and track personal goals
- **Activity History**: View past activities and progress
- **Settings**: Customize app appearance and preferences

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

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your preferred platform:
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

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

## Dependencies

- Expo Router for navigation
- AsyncStorage for data persistence
- React Native with TypeScript
- Zustand for state management (ready for use)
- i18next for internationalization (ready for use)
