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
- `npm test` — Run tests (Jest)
- `npm run test:watch` — Run tests in watch mode
- `npm run test:coverage` — Run tests with coverage report

## Architecture

All source code lives in `src/`. Template/demo components are preserved in `examples/` for reference.

### Directory Structure

- `src/app/` — Expo Router file-based routes
- `src/components/ui/` — Core UI primitives (ThemedText, ThemedView, Collapsible, IconSymbol)
- `src/components/features/` — Feature-specific components
- `src/hooks/` — Custom hooks (useColorScheme, useThemeColor)
- `src/providers/` — React context providers (ThemeProvider, QueryProvider)
- `src/services/` — Platform services and API client (haptics, api)
- `src/constants/` — Theme colors and fonts
- `src/types/` — Shared TypeScript types (navigation params)
- `src/stores/` — State management (placeholder)
- `src/utils/` — Utility functions (placeholder)

### Routing

File-based routing via Expo Router. Routes live in `src/app/`:
- `src/app/_layout.tsx` — Root layout: QueryProvider > ThemeProvider > Stack
- `src/app/(tabs)/_layout.tsx` — Tab navigator (Home + Explore tabs)
- `src/app/(tabs)/index.tsx` — Home screen
- `src/app/(tabs)/explore.tsx` — Explore screen
- `src/app/modal.tsx` — Modal screen (modal presentation style)

Typed routes are enabled (`typedRoutes: true` in app.json experiments).

### Path Aliases

`@/*` maps to `src/` (configured in tsconfig.json). Use `@/components/ui/...`, `@/hooks/...`, `@/services/...`, etc.

### Providers

The root layout wraps the app with providers in this order:
1. `QueryProvider` — React Query with AsyncStorage persistence (24h gcTime, 5m staleTime)
2. `ThemeProvider` — React Navigation theme based on system color scheme

### Theming

Light/dark mode is driven by `useColorScheme()` from React Native. Theme colors are defined in `src/constants/theme.ts`. Themed wrapper components (`ThemedText`, `ThemedView`) in `src/components/ui/` apply colors automatically.

### Platform-Specific Code

- `src/components/ui/icon-symbol.ios.tsx` — iOS uses SF Symbols (expo-symbols)
- `src/components/ui/icon-symbol.tsx` — Android/Web uses MaterialIcons with a name-mapping table
- `src/hooks/use-color-scheme.web.ts` — Web-specific hydration-safe color scheme hook
- `src/services/haptics.ts` — Platform-safe haptic functions (guards on EXPO_OS)

### Key Packages

- `expo-router` for navigation
- `@tanstack/react-query` + `@tanstack/react-query-persist-client` for server state
- `@react-native-async-storage/async-storage` for persistent storage
- `expo-secure-store` for sensitive data storage
- `react-native-reanimated` for animations
- `expo-image` for image loading
- `expo-web-browser` for in-app browser on native
- `react-native-web` for web platform support

### Testing

Jest with `jest-expo` preset and `@testing-library/react-native`. Config in `jest.config.js`, setup/mocks in `jest.setup.ts`. Tests use `__tests__/` directories alongside source (e.g. `src/components/ui/__tests__/`).

### ESLint

Uses flat config format (`eslint.config.js`) extending `eslint-config-expo`. The `examples/` directory is ignored.
