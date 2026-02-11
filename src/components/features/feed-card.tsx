import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { StarRating } from '@/components/features/star-rating';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { CoffeeLog } from '@/types/coffee';
import { BREW_METHOD_LABELS, DRINK_TYPE_LABELS } from '@/types/coffee';
import { getRelativeTime } from '@/utils/date';

interface FeedCardProps {
  log: CoffeeLog;
  onDelete: (id: string) => void;
}

export function FeedCard({ log, onDelete }: FeedCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  function handleLongPress() {
    Alert.alert('Delete Log', 'Are you sure you want to delete this coffee log?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(log.id) },
    ]);
  }

  return (
    <Pressable
      onLongPress={handleLongPress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
          <IconSymbol name="cup.and.saucer.fill" size={20} color="#fff" />
        </View>

        <View style={styles.content}>
          <View style={styles.metaRow}>
            <ThemedText type="defaultSemiBold" style={styles.drinkType}>
              {DRINK_TYPE_LABELS[log.drinkType]}
            </ThemedText>
            <ThemedText style={[styles.time, { color: colors.icon }]}>
              {getRelativeTime(log.createdAt)}
            </ThemedText>
          </View>

          <View style={styles.metaRow}>
            <ThemedText style={[styles.brewMethod, { color: colors.icon }]}>
              {BREW_METHOD_LABELS[log.brewMethod]}
            </ThemedText>
            <StarRating value={log.rating} size={14} />
          </View>
        </View>
      </View>

      {log.notes ? (
        <ThemedText style={styles.notes}>{log.notes}</ThemedText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drinkType: {
    fontSize: 16,
  },
  time: {
    fontSize: 13,
  },
  brewMethod: {
    fontSize: 13,
  },
  notes: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
});
