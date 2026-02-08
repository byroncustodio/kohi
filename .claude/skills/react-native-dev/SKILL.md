---
name: react-native-dev
description: TypeScript-first Expo + React Native development skill for the Kohi mobile app. Use when the user wants to create, debug, or modify components, screens, hooks, or features. Triggers include requests to build UI, fix issues, create components, add routes, integrate native functionality, handle state management, or debug platform-specific (iOS/Android/Web) behavior.
---

# React Native Development (Expo Router)

Build high-quality, production-ready features for this Expo Router + React Native application with modern best practices and platform-specific considerations.

## Project Context

- **Framework**: Expo v54 + React Native 0.81
- **Routing**: Expo Router (file-based routing in `app/`)
- **Language**: TypeScript with strict mode
- **React**: v19 with React Compiler enabled
- **Platforms**: iOS, Android, Web
- **Path alias**: `@/*` maps to project root (e.g., `@/components/...`)

## TypeScript Policy

All application code must be TypeScript (`.ts`/`.tsx`). No `any` types — use `unknown` or proper types instead.

**Exception**: Config files (`babel.config.js`, `metro.config.js`, `eslint.config.js`) may be JavaScript.

## React Compiler

The React Compiler is enabled. This means:
- **Do NOT** manually add `React.memo()`, `useMemo()`, or `useCallback()` for memoization — the compiler handles this automatically
- Write straightforward components and let the compiler optimize
- Only use `useMemo`/`useCallback` if you need them for non-memoization purposes (e.g., refs to stable callbacks for external libraries)

## File-Based Routing (Expo Router)

Routes live in the `app/` directory. Navigation is defined by file structure, not manual navigator configuration.

### Key patterns:
- `app/_layout.tsx` — Root layout (wraps all routes)
- `app/(group)/_layout.tsx` — Route group layout (e.g., tabs)
- `app/(group)/screen.tsx` — Screen within a group
- `app/modal.tsx` — Modal screen (set `presentation: 'modal'` in layout)

### Typed routes:
Typed routes are enabled (`typedRoutes: true`). Use `href` props with type-safe paths:
```typescript
import { Link } from 'expo-router';

<Link href="/(tabs)">Home</Link>
<Link href={{ pathname: '/profile/[id]', params: { id: userId } }}>Profile</Link>
```

See `references/navigation-patterns.md` for Expo Router patterns.

## Project Structure

```
app/                    # File-based routes
components/             # Reusable UI components
  ui/                   # Low-level UI primitives
constants/              # App constants (theme colors, etc.)
hooks/                  # Custom React hooks
assets/                 # Images, fonts, icons
```

See `references/project-structure.md` for conventions.

## File Naming

Use **kebab-case** for all files:
- Components: `user-card.tsx`, `themed-text.tsx`
- Hooks: `use-auth.ts`, `use-color-scheme.ts`
- Constants: `theme.ts`
- Platform-specific: `icon-symbol.ios.tsx`, `use-color-scheme.web.ts`

## Theming

Light/dark mode uses `useColorScheme()` from React Native. Theme colors are in `constants/theme.ts`. Use `ThemedText` and `ThemedView` wrapper components for automatic theme colors.

## Platform-Specific Code

Handle platform differences with:
- `.ios.tsx` / `.android.tsx` / `.web.ts` file extensions for platform-specific implementations
- `Platform.OS` checks for conditional logic
- `Platform.select()` for inline platform-specific values

This project already uses platform-specific files for:
- Icons: SF Symbols on iOS (`icon-symbol.ios.tsx`), MaterialIcons elsewhere (`icon-symbol.tsx`)
- Color scheme: Hydration-safe hook for web (`use-color-scheme.web.ts`)
- Haptics: iOS-only haptic feedback on tab press (`haptic-tab.tsx`)

## Creating a New Component

1. Create a kebab-case `.tsx` file in `components/` (or `components/ui/` for primitives)
2. Define a TypeScript interface for props
3. Use `ThemedText`/`ThemedView` or `useThemeColor` for theme support
4. Consider accessibility (`accessibilityLabel`, `accessibilityRole`)
5. Add platform-specific files if behavior differs across platforms

## Creating a New Route

1. Add a `.tsx` file in `app/` (or a route group like `app/(tabs)/`)
2. Export a default React component — this becomes the screen
3. Update the relevant `_layout.tsx` if needed (e.g., add a tab)
4. Use typed `Link` or `router.push()` from `expo-router` for navigation

## State Management

Currently using local state and React Context only. Choose based on complexity:
- **Local state**: `useState` for component-level state
- **Context API**: For shared state across a subtree (theming already uses this)
- **Zustand**: For medium-complexity shared state (if needed in future)

See `references/state-management.md` for patterns.

## Common Pitfalls

- Don't use web-specific CSS properties (`cursor`, `user-select`) in shared code
- Avoid inline styles in render — use `StyleSheet.create()`
- Handle keyboard with `KeyboardAvoidingView` on forms
- Test on all target platforms — they behave differently
- Use `expo-image` (not `Image` from react-native) for network images
- Install Expo packages with `npx expo install` (not `npm install`) to get compatible versions

## Debugging

1. Check Metro bundler logs for JS errors
2. Use React DevTools for component inspection
3. Common fixes: `npx expo start --clear` to reset cache

## Resources

- **References** (`references/`):
    - `project-structure.md` — Directory layout and file conventions
    - `navigation-patterns.md` — Expo Router patterns and examples
    - `state-management.md` — State management patterns
    - `testing-patterns.md` — Testing setup (not yet configured in project)
    - `common-packages.md` — Recommended Expo-compatible packages

- **Scripts** (`scripts/`):
    - `create-component.js` — Component/hook/screen template generator
