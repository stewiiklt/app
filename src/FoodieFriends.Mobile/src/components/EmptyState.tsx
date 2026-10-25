import { View } from 'react-native';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { colors, spacing } from '../theme/tokens';

export interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export function EmptyState({ title, message, actionLabel, onAction, icon = '🍽️' }: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.section, gap: spacing.md }}>
      <AppText accessibilityElementsHidden variant="display" style={{ color: colors.coral500 }}>{icon}</AppText>
      <AppText variant="subtitle" style={{ textAlign: 'center' }}>{title}</AppText>
      <AppText muted style={{ textAlign: 'center' }}>{message}</AppText>
      {actionLabel && onAction ? <AppButton label={actionLabel} onPress={onAction} style={{ marginTop: spacing.sm }} /> : null}
    </View>
  );
}
