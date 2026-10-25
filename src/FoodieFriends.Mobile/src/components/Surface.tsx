import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { colors, elevation, radii, spacing } from '../theme/tokens';

export interface SurfaceProps extends Omit<ViewProps, 'children'> {
  children?: ReactNode;
  padded?: boolean;
  raised?: boolean;
  tone?: 'white' | 'cream' | 'teal';
  style?: StyleProp<ViewStyle>;
}

export function Surface({ children, padded = true, raised = false, tone = 'white', style, ...props }: SurfaceProps) {
  const backgroundColor = tone === 'cream' ? colors.cream100 : tone === 'teal' ? colors.teal50 : colors.white;
  return (
    <View
      {...props}
      style={[
        { backgroundColor, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border },
        padded ? { padding: spacing.lg } : undefined,
        raised ? elevation.raised : elevation.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}
