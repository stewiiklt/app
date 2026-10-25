import type { ReactNode } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, typeScale } from '../theme/tokens';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'bodySmall' | 'caption' | 'label';
const variants: Record<Variant, TextStyle> = {
  display: { fontSize: typeScale.display, lineHeight: 36, fontWeight: '800', letterSpacing: -0.6 },
  title: { fontSize: typeScale.title, lineHeight: 30, fontWeight: '800', letterSpacing: -0.35 },
  subtitle: { fontSize: typeScale.titleSmall, lineHeight: 26, fontWeight: '700' },
  body: { fontSize: typeScale.body, lineHeight: 24, fontWeight: '400' },
  bodySmall: { fontSize: typeScale.bodySmall, lineHeight: 20, fontWeight: '400' },
  caption: { fontSize: typeScale.caption, lineHeight: 16, fontWeight: '500' },
  label: { fontSize: typeScale.bodySmall, lineHeight: 18, fontWeight: '700' },
};

export interface AppTextProps extends TextProps {
  variant?: Variant;
  muted?: boolean;
  children: ReactNode;
}

export function AppText({ variant = 'body', muted = false, style, children, ...props }: AppTextProps) {
  return (
    <Text {...props} style={[{ color: muted ? colors.muted : colors.charcoal900 }, variants[variant], style]}>
      {children}
    </Text>
  );
}
