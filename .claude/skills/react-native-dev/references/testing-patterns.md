# Testing Patterns

**Note**: No test framework is currently configured in this project. These patterns are for when testing is set up.

## Setup

### Install Dependencies

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native @types/jest
```

### Jest Configuration

Add to `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

Create `jest.config.ts`:
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  setupFilesAfterSetup: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default config;
```

Note: The `moduleNameMapper` maps `@/` to the project root (not `src/`), matching this project's tsconfig.

## Component Testing

```typescript
// components/__tests__/themed-text.test.tsx
import { render } from '@testing-library/react-native';
import { ThemedText } from '@/components/themed-text';

describe('ThemedText', () => {
  it('renders text content', () => {
    const { getByText } = render(<ThemedText>Hello</ThemedText>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('applies title style', () => {
    const { getByText } = render(<ThemedText type="title">Title</ThemedText>);
    expect(getByText('Title')).toBeTruthy();
  });
});
```

## Testing with User Interaction

```typescript
import { render, fireEvent } from '@testing-library/react-native';

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Pressable onPress={onPress}><Text>Click</Text></Pressable>
    );

    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## Testing Async Operations

```typescript
import { render, waitFor } from '@testing-library/react-native';

describe('UserList', () => {
  it('displays users after loading', async () => {
    const { getByText, queryByTestId } = render(<UserList />);

    await waitFor(() => {
      expect(queryByTestId('loading')).toBeNull();
      expect(getByText('John Doe')).toBeTruthy();
    });
  });
});
```

## Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '@/hooks/use-debounce';

describe('useDebounce', () => {
  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial'); // not yet updated

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    expect(result.current).toBe('updated');
  });
});
```

## Mocking Expo Modules

```typescript
// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));
```

## File Organization

Place tests next to source files or in `__tests__/` directories:

```
components/
  themed-text.tsx
  __tests__/
    themed-text.test.tsx
hooks/
  use-debounce.ts
  __tests__/
    use-debounce.test.ts
```

## Best Practices

1. Use `testID` for reliable element selection
2. Test behavior, not implementation details
3. Mock external dependencies (APIs, native modules)
4. Keep tests isolated — each test should work independently
5. Test accessibility labels on interactive elements
