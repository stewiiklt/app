import { View } from 'react-native';
import { AppText } from './AppText';
import { colors, radii, spacing } from '../theme/tokens';

export interface RatingBadgeProps {
  rating: number;
  max?: number;
  compact?: boolean;
  label?: string;
}

export function RatingBadge({ rating, max = 10, compact = false, label }: RatingBadgeProps) {
  const score = Number.isFinite(rating) ? Math.max(0, Math.min(max, rating)) : 0;
  return (
    <View
      accessible
      accessibilityLabel={label ?? `Rating ${score.toFixed(1)} out of ${max}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.cream300, borderRadius: radii.pill, paddingHorizontal: compact ? spacing.sm : spacing.md, paddingVertical: compact ? 4 : 6 }}
    >
      <AppText variant="caption" style={{ color: colors.coral700 }}>★</AppText>
      <AppText variant="label" style={{ fontSize: compact ? 12 : 14, color: colors.charcoal900 }}>{score.toFixed(1)}</AppText>
    </View>
  );
}
