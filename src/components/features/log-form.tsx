import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';

import { MAX_CONTENT_WIDTH, useResponsive } from '@/utils/responsive';

import { OptionChip } from '@/components/features/option-chip';
import { StarRating } from '@/components/features/star-rating';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  BREW_METHODS,
  BREW_METHOD_LABELS,
  DRINK_TYPES,
  DRINK_TYPE_LABELS,
  type BrewMethod,
  type CoffeeLogInput,
  type DrinkType,
  type Rating,
} from '@/types/coffee';

interface LogFormProps {
  onSubmit: (input: CoffeeLogInput) => void;
  submitting?: boolean;
}

export function LogForm({ onSubmit, submitting }: LogFormProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { screenPadding, keyboardOffset } = useResponsive();

  const [drinkType, setDrinkType] = useState<DrinkType | null>(null);
  const [brewMethod, setBrewMethod] = useState<BrewMethod | null>(null);
  const [rating, setRating] = useState<Rating>(3);
  const [notes, setNotes] = useState('');
  const [notesExpanded, setNotesExpanded] = useState(false);

  const canSubmit = drinkType !== null && brewMethod !== null && !submitting;

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({ drinkType, brewMethod, rating, notes: notes.trim() });
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardOffset}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { padding: screenPadding, paddingBottom: 40 }]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.contentInner}>
        <ThemedText style={[styles.sectionLabel, { color: colors.icon }]}>
          DRINK TYPE
        </ThemedText>
        <View style={styles.chips}>
          {DRINK_TYPES.map((type) => (
            <OptionChip
              key={type}
              label={DRINK_TYPE_LABELS[type]}
              selected={drinkType === type}
              onPress={() => setDrinkType(type)}
            />
          ))}
        </View>

        {drinkType !== null && (
          <Animated.View entering={FadeInDown.duration(300).springify()}>
            <ThemedText style={[styles.sectionLabel, { color: colors.icon }]}>
              BREW METHOD
            </ThemedText>
            <View style={styles.chips}>
              {BREW_METHODS.map((method) => (
                <OptionChip
                  key={method}
                  label={BREW_METHOD_LABELS[method]}
                  selected={brewMethod === method}
                  onPress={() => setBrewMethod(method)}
                />
              ))}
            </View>
          </Animated.View>
        )}

        <ThemedText style={[styles.sectionLabel, { color: colors.icon }]}>
          RATING
        </ThemedText>
        <StarRating value={rating} onChange={setRating} size={36} />

        {notesExpanded || notes.length > 0 ? (
          <>
            <ThemedText style={[styles.sectionLabel, { color: colors.icon }]}>
              NOTES
            </ThemedText>
            <TextInput
              style={[
                styles.notesInput,
                {
                  color: colors.text,
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
              placeholder="How was it? (optional)"
              placeholderTextColor={colors.icon}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              autoFocus={notesExpanded && notes.length === 0}
            />
          </>
        ) : (
          <Pressable style={styles.addNoteButton} onPress={() => setNotesExpanded(true)}>
            <IconSymbol name="plus.circle.fill" size={18} color={colors.icon} />
            <ThemedText style={[styles.addNoteText, { color: colors.icon }]}>
              Add a note
            </ThemedText>
          </Pressable>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={[
            styles.submitButton,
            { backgroundColor: canSubmit ? colors.tint : colors.cardBorder },
          ]}>
          <ThemedText style={styles.submitText}>
            {submitting ? 'Logging...' : 'Log Coffee'}
          </ThemedText>
        </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    alignItems: 'center',
  },
  contentInner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  addNoteText: {
    fontSize: 15,
    fontWeight: '500',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  submitButton: {
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
