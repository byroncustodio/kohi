# State Management Patterns

## Current Project Approach

This project currently uses:
- **Local state** (`useState`) for component-level state
- **React Navigation ThemeProvider** for theme context (light/dark mode)
- No external state management library

## Decision Guide

**Use local `useState`/`useReducer` when:**
- State is only needed in one component or its direct children
- Simple UI state (toggles, form inputs, loading states)

**Use Context API when:**
- Sharing state across a few components in a subtree
- State doesn't change frequently (theme, locale, auth status)
- Already used in this project for theming

**Use Zustand when (recommended if external state is needed):**
- Sharing state across unrelated components
- Need persistence or devtools
- Want minimal boilerplate

## Local State

```typescript
import { useState } from 'react';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    const data = await searchApi(query);
    setResults(data);
    setIsLoading(false);
  };

  return (/* ... */);
}
```

## useReducer (Complex Local State)

```typescript
import { useReducer } from 'react';

interface FormState {
  name: string;
  email: string;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_END' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.error } };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_END':
      return { ...state, isSubmitting: false };
  }
}
```

## Context API

```typescript
// contexts/auth-context.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const userData = await loginApi(email, password);
    setUser(userData);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

Wrap in root layout:
```typescript
// app/_layout.tsx
import { AuthProvider } from '@/contexts/auth-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={...}>
        <Stack />
      </ThemeProvider>
    </AuthProvider>
  );
}
```

## Zustand (If Needed)

### Basic Store

```typescript
// store/user-store.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  fetchUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),

  fetchUser: async (id) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/users/${id}`);
      const user = await response.json();
      set({ user, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
```

### Usage in Components

```typescript
import { useUserStore } from '@/store/user-store';

export default function ProfileScreen() {
  // Select only what you need to minimize re-renders
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser('123');
  }, []);

  return <ThemedText>{user?.name}</ThemedText>;
}
```

### Persisted Store

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      notifications: true,
      toggleNotifications: () =>
        set((state) => ({ notifications: !state.notifications })),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```
