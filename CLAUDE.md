# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kohi is an Expo (v54) + React Native (0.81) cross-platform mobile app targeting iOS, Android, and Web. It uses TypeScript with strict mode, React 19, and has the React Native New Architecture and React Compiler enabled.

## Commands

- `npm start` — Start Expo dev server
- `npm run android` — Start on Android emulator
- `npm run ios` — Start on iOS simulator
- `npm run web` — Start web dev server
- `npm run lint` — Run ESLint (via `expo lint`)

No test framework is currently configured.

## Architecture

### Routing

File-based routing via Expo Router. Routes live in `app/`:
- `app/_layout.tsx` — Root Stack navigator, wraps app with ThemeProvider
- `app/(tabs)/_layout.tsx` — Tab navigator (Home + Explore tabs)
- `app/(tabs)/index.tsx` — Home screen
- `app/(tabs)/explore.tsx` — Explore screen
- `app/modal.tsx` — Modal screen (modal presentation style)

Typed routes are enabled (`typedRoutes: true` in app.json experiments).

### Path Aliases

`@/*` maps to the project root (configured in tsconfig.json). Use `@/components/...`, `@/hooks/...`, etc.

### Theming

Light/dark mode is driven by `useColorScheme()` from React Native. Theme colors are defined in `constants/theme.ts`. Themed wrapper components (`ThemedText`, `ThemedView`) apply colors automatically. The app uses React Navigation's `ThemeProvider` at the root.

### Platform-Specific Code

- `components/ui/icon-symbol.ios.tsx` — iOS uses SF Symbols (expo-symbols)
- `components/ui/icon-symbol.tsx` — Android/Web uses MaterialIcons with a name-mapping table
- `hooks/use-color-scheme.web.ts` — Web-specific hydration-safe color scheme hook
- `components/haptic-tab.tsx` — iOS haptic feedback on tab press (expo-haptics)

### Key Packages

- `expo-router` for navigation
- `react-native-reanimated` for animations
- `expo-image` for image loading
- `expo-web-browser` for in-app browser on native
- `react-native-web` for web platform support

### ESLint

Uses flat config format (`eslint.config.js`) extending `eslint-config-expo`.
