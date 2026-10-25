import { View } from 'react-native';
import { AppText } from './AppText';
import { colors, radii, spacing } from '../theme/tokens';

export function DemoBanner() {
  return (
    <View style={{ backgroundColor: colors.saffron100, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <AppText accessibilityLabel="Demo mode" variant="caption" style={{ color: colors.herb800, fontWeight: '800' }}>✦  PROTOTYPE</AppText>
      <AppText variant="caption" muted>Fictional people & places</AppText>
    </View>
  );
}
