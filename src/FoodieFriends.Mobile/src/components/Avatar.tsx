import { Image, View } from 'react-native';
import { AppText } from './AppText';
import { colors, radii } from '../theme/tokens';

export interface AvatarProps {
  name: string;
  uri?: string | null;
  size?: number;
}

export function Avatar({ name, uri, size = 44 }: AvatarProps) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '?';
  const style = { width: size, height: size, borderRadius: radii.pill } as const;
  if (uri) return <Image source={{ uri }} accessibilityLabel={`${name}'s profile photo`} style={style} />;
  return (
    <View accessible accessibilityLabel={`${name}'s avatar`} style={[style, { backgroundColor: colors.coral100, alignItems: 'center', justifyContent: 'center' }]}>
      <AppText variant="label" style={{ color: colors.coral700 }}>{initials}</AppText>
    </View>
  );
}
