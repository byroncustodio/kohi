# Recommended Packages

Always install Expo-compatible packages with `npx expo install` to get the correct version.

## Already Installed

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based routing |
| `react-native-reanimated` | High-performance animations |
| `expo-image` | Optimized image loading (use instead of RN `Image`) |
| `expo-web-browser` | In-app browser on native |
| `expo-haptics` | Haptic feedback (iOS) |
| `expo-symbols` | SF Symbols icons (iOS) |
| `expo-font` | Custom font loading |
| `expo-status-bar` | Status bar control |
| `react-native-web` | Web platform support |

## State Management

### Zustand (Recommended for most cases)
```bash
npm install zustand
```
Lightweight, hook-based state management with minimal boilerplate. ~3KB.

### Jotai
```bash
npm install jotai
```
Atomic state management. Good for fine-grained reactivity.

## Data Fetching

### TanStack Query
```bash
npm install @tanstack/react-query
```
Server state management with caching, refetching, and synchronization.

## Forms

### React Hook Form
```bash
npm install react-hook-form
npm install zod @hookform/resolvers  # validation
```

## Storage

### AsyncStorage
```bash
npx expo install @react-native-async-storage/async-storage
```
Simple key-value storage. Good for tokens, settings, small data.

### MMKV
```bash
npm install react-native-mmkv
```
Synchronous, 30x faster than AsyncStorage. Good for performance-sensitive storage.

## UI

### Expo Blur
```bash
npx expo install expo-blur
```
Blur views for iOS-style effects.

### Expo Linear Gradient
```bash
npx expo install expo-linear-gradient
```
Gradient backgrounds.

### React Native Gesture Handler
```bash
npx expo install react-native-gesture-handler
```
Native gesture handling. Already a transitive dependency via navigation.

## Animations

### Moti
```bash
npm install moti
```
Declarative animations built on Reanimated. Simpler API.

### Lottie
```bash
npm install lottie-react-native
```
Complex vector animations from After Effects/Lottie files.

## Maps & Location

### Expo Location
```bash
npx expo install expo-location
```

### React Native Maps
```bash
npx expo install react-native-maps
```

## Camera & Media

### Expo Camera
```bash
npx expo install expo-camera
```

### Expo Image Picker
```bash
npx expo install expo-image-picker
```

## Push Notifications

### Expo Notifications
```bash
npx expo install expo-notifications
```

## Analytics & Monitoring

### Sentry
```bash
npx expo install @sentry/react-native
```
Error tracking and crash reporting.

## Testing

### Jest + React Native Testing Library
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

### Maestro (E2E)
No npm install needed — Maestro is a standalone CLI for E2E testing.

## Icons

Already available via `@expo/vector-icons` (included with Expo). Provides FontAwesome, Ionicons, MaterialIcons, etc.

```typescript
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="heart" size={24} color="red" />
```

The project also has a custom `IconSymbol` component that uses SF Symbols on iOS and MaterialIcons elsewhere.
