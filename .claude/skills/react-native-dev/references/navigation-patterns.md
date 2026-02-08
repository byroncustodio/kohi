# Expo Router Navigation Patterns

## File-Based Routing

Routes are defined by the file structure in `app/`. Every file that exports a default React component becomes a route.

```
app/
  _layout.tsx           # Root layout (Stack navigator)
  (tabs)/
    _layout.tsx         # Tab navigator layout
    index.tsx           # / (Home tab)
    explore.tsx         # /explore (Explore tab)
  modal.tsx             # /modal
  profile/
    [id].tsx            # /profile/:id (dynamic route)
  settings.tsx          # /settings
```

## Layouts

Layouts wrap child routes. Use `_layout.tsx` files to define navigation structure.

### Root Stack Layout

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
```

### Tab Layout

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

## Navigation API

### Link Component (Declarative)

```typescript
import { Link } from 'expo-router';

// Simple link
<Link href="/settings">Settings</Link>

// Link with params
<Link href={{ pathname: '/profile/[id]', params: { id: '123' } }}>
  View Profile
</Link>

// Link styled as a button
<Link href="/modal" asChild>
  <Pressable>
    <Text>Open Modal</Text>
  </Pressable>
</Link>
```

### router API (Imperative)

```typescript
import { router } from 'expo-router';

// Navigate (pushes onto stack)
router.push('/settings');

// Navigate with params
router.push({ pathname: '/profile/[id]', params: { id: '123' } });

// Replace current screen (no back button)
router.replace('/home');

// Go back
router.back();

// Dismiss modal
router.dismiss();

// Reset navigation state
router.replace('/');
```

### useRouter Hook

```typescript
import { useRouter } from 'expo-router';

export default function MyComponent() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/profile/123');
  };

  return <Pressable onPress={handlePress}><Text>Go</Text></Pressable>;
}
```

## Route Parameters

### Dynamic Routes

```typescript
// app/profile/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Text>Profile: {id}</Text>;
}
```

### Query Parameters

```typescript
// Navigate with query params
router.push({ pathname: '/search', params: { query: 'coffee' } });

// Read in target screen
import { useLocalSearchParams } from 'expo-router';

export default function SearchScreen() {
  const { query } = useLocalSearchParams<{ query?: string }>();
  return <Text>Searching: {query}</Text>;
}
```

## Route Groups

Parenthesized directories create route groups — they organize files without affecting the URL.

```
app/
  (tabs)/          # Group for tab navigation
    index.tsx      # URL: /
    explore.tsx    # URL: /explore
  (auth)/          # Group for auth flow
    login.tsx      # URL: /login
    register.tsx   # URL: /register
```

## Modal Routes

```typescript
// app/_layout.tsx — declare modal presentation
<Stack.Screen name="modal" options={{ presentation: 'modal' }} />

// app/modal.tsx
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ModalScreen() {
  return (
    <View>
      <Text>Modal Content</Text>
      <Pressable onPress={() => router.dismiss()}>
        <Text>Close</Text>
      </Pressable>
      <StatusBar style="light" />
    </View>
  );
}
```

## Not Found Routes

```typescript
// app/+not-found.tsx
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View>
        <Text>This screen doesn't exist.</Text>
        <Link href="/">Go home</Link>
      </View>
    </>
  );
}
```

## Setting Screen Options Dynamically

```typescript
import { Stack } from 'expo-router';

export default function ProfileScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Custom Title', headerRight: () => <SaveButton /> }} />
      <View>{/* screen content */}</View>
    </>
  );
}
```

## Protected Routes (Auth Guard)

```typescript
// app/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Stack />;
}
```

## External Links

Use the `ExternalLink` component (already in this project) for links that open in a browser:

```typescript
import { ExternalLink } from '@/components/external-link';

<ExternalLink href="https://docs.expo.dev">Expo Docs</ExternalLink>
```

This opens in an in-app browser on native (via `expo-web-browser`) and in a new tab on web.
