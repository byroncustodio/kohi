import * as Haptics from 'expo-haptics';

function isNative() {
  return process.env.EXPO_OS === 'ios' || process.env.EXPO_OS === 'android';
}

export function lightImpact() {
  if (isNative()) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export function mediumImpact() {
  if (isNative()) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export function selectionFeedback() {
  if (isNative()) {
    Haptics.selectionAsync();
  }
}
