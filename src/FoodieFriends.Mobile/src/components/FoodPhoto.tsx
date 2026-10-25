import { useState } from 'react';
import { Image, View, type ImageStyle, type StyleProp } from 'react-native';
import { AppText } from './AppText';

export function FoodPhoto({ uri, style, dish }: { uri: string; style: StyleProp<ImageStyle>; dish?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return (
    <View style={[style, { backgroundColor: '#F1DCC9', justifyContent: 'center', alignItems: 'center' }]}>
      <AppText style={{ fontSize: 42 }}>🥗</AppText>
      {dish ? <AppText variant="caption" muted>{dish}</AppText> : null}
    </View>
  );
  return <Image source={{ uri }} style={style} resizeMode="cover" onError={() => setFailed(true)} accessibilityLabel={dish ?? 'A dish served at a fictional restaurant'} />;
}
