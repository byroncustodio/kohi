# Project Structure

## Directory Layout

```
kohi/
├── app/                        # File-based routes (Expo Router)
│   ├── _layout.tsx             # Root layout (Stack + ThemeProvider)
│   ├── (tabs)/                 # Tab route group
│   │   ├── _layout.tsx         # Tab navigator config
│   │   ├── index.tsx           # Home screen (/ route)
│   │   └── explore.tsx         # Explore screen (/explore route)
│   ├── modal.tsx               # Modal screen
│   └── +not-found.tsx          # 404 screen
├── components/                 # Reusable UI components
│   ├── ui/                     # Low-level UI primitives
│   │   ├── icon-symbol.tsx     # Cross-platform icon (Android/Web)
│   │   ├── icon-symbol.ios.tsx # iOS-specific icon (SF Symbols)
│   │   └── collapsible.tsx     # Collapsible/accordion
│   ├── themed-text.tsx         # Theme-aware Text
│   ├── themed-view.tsx         # Theme-aware View
│   ├── parallax-scroll-view.tsx
│   ├── external-link.tsx       # Opens URLs in browser
│   ├── haptic-tab.tsx          # Tab button with iOS haptics
│   └── hello-wave.tsx          # Animated wave emoji
├── constants/                  # App-wide constants
│   └── theme.ts                # Color palette and fonts
├── hooks/                      # Custom React hooks
│   ├── use-color-scheme.ts     # Re-export from React Native
│   ├── use-color-scheme.web.ts # Web hydration-safe variant
│   └── use-theme-color.ts      # Get colors by theme key
├── assets/                     # Static assets
│   ├── images/                 # App images
│   └── fonts/                  # Custom fonts (if any)
├── app.json                    # Expo app config
├── tsconfig.json               # TypeScript config
├── eslint.config.js            # ESLint flat config
└── package.json
```

## File Naming Conventions

- **kebab-case** for all source files: `user-card.tsx`, `use-auth.ts`, `theme.ts`
- **Platform extensions**: `component.ios.tsx`, `hook.web.ts`
- **Route files**: lowercase kebab-case matching the URL segment

## Path Aliases

`@/*` maps to the project root:

```typescript
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
```

## Component Patterns

### Basic Component

```typescript
// components/user-card.tsx
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface UserCardProps {
  name: string;
  onPress: () => void;
}

export function UserCard({ name, onPress }: UserCardProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>{name}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

### Route Screen

```typescript
// app/(tabs)/index.tsx
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Home</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### Custom Hook

```typescript
// hooks/use-debounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## Where to Put Things

| Type | Location | Example |
|------|----------|---------|
| Route/screen | `app/` | `app/(tabs)/profile.tsx` |
| Reusable component | `components/` | `components/user-card.tsx` |
| UI primitive | `components/ui/` | `components/ui/button.tsx` |
| Custom hook | `hooks/` | `hooks/use-auth.ts` |
| Constants/config | `constants/` | `constants/theme.ts` |
| Static assets | `assets/` | `assets/images/logo.png` |
| API services | `services/` | `services/api.ts` (create when needed) |
| Type definitions | `types/` | `types/models.ts` (create when needed) |
