import { render, screen } from '@testing-library/react-native';

import { ThemedText } from '@/components/ui/themed-text';

describe('ThemedText', () => {
  it('renders text content', () => {
    render(<ThemedText>Hello World</ThemedText>);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('applies default type styles', () => {
    render(<ThemedText type="default">Default</ThemedText>);
    const element = screen.getByText('Default');
    expect(element).toBeOnTheScreen();
  });

  it('applies title type styles', () => {
    render(<ThemedText type="title">Title</ThemedText>);
    expect(screen.getByText('Title')).toBeOnTheScreen();
  });

  it('passes through additional text props', () => {
    render(
      <ThemedText testID="themed-text" numberOfLines={1}>
        Truncated
      </ThemedText>
    );
    expect(screen.getByTestId('themed-text')).toBeOnTheScreen();
  });
});
