import { ActivityIndicator, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { colors, radii, spacing } from '../theme/tokens';

export interface AppButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'quiet' | 'danger';
  size?: 'small' | 'medium';
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({ label, variant = 'primary', size = 'medium', loading = false, disabled, fullWidth, style, ...props }: AppButtonProps) {
  const primary = variant === 'primary' || variant === 'danger';
  const background = variant === 'primary' ? colors.coral500 : variant === 'danger' ? colors.danger : variant === 'secondary' ? colors.teal100 : 'transparent';
  const foreground = primary ? colors.white : variant === 'secondary' ? colors.teal800 : colors.coral700;
  const borderColor = variant === 'outline' ? colors.coral300 : variant === 'quiet' ? 'transparent' : background;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          minHeight: size === 'small' ? 40 : 48,
          paddingHorizontal: size === 'small' ? spacing.md : spacing.xl,
          borderRadius: radii.pill,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor,
          backgroundColor: disabled ? colors.cream300 : background,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: pressed ? 0.84 : 1,
          ...(fullWidth ? { alignSelf: 'stretch' as const } : {}),
        },
        style,
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator color={foreground} size="small" /> : <AppText variant="label" style={{ color: foreground }}>{label}</AppText>}
    </Pressable>
  );
}
