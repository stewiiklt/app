import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { AppText, RatingBadge, Surface } from './index';
import { FoodPhoto } from './FoodPhoto';
import type { DemoRestaurant } from '../demo/data';
import { useDemo } from '../demo/DemoContext';
import { colors, spacing } from '../theme/tokens';

export function RestaurantTile({ restaurant }: { restaurant: DemoRestaurant }) {
  const { savedIds, toggleSaved } = useDemo();
  const saved = savedIds.includes(restaurant.id);
  return (
    <Surface padded={false} style={{ overflow: 'hidden' }}>
      <Link href={`/restaurant/${restaurant.id}`} asChild>
        <Pressable accessibilityRole="button" accessibilityLabel={`Open ${restaurant.name}`}>
          <FoodPhoto uri={restaurant.image} dish={restaurant.dish} style={{ width: '100%', height: 184, backgroundColor: restaurant.accent }} />
        </Pressable>
      </Link>
      <View style={{ padding: spacing.md, gap: spacing.xs }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}>
          <Link href={`/restaurant/${restaurant.id}`} asChild><Pressable style={{ flex: 1 }}><AppText variant="subtitle">{restaurant.name}</AppText></Pressable></Link>
          <RatingBadge rating={Number(restaurant.rating)} compact />
        </View>
        <AppText variant="bodySmall" muted>{restaurant.cuisine} · {restaurant.neighborhood} · {restaurant.price}</AppText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <AppText variant="caption" muted>{restaurant.reviewCount} notes from the community</AppText>
          <Pressable accessibilityRole="button" accessibilityLabel={saved ? `Remove ${restaurant.name} from saved` : `Save ${restaurant.name}`} onPress={() => toggleSaved(restaurant.id)} hitSlop={8}>
            <AppText style={{ color: saved ? colors.coral600 : colors.charcoal800, fontSize: 21 }}>{saved ? '♥' : '♡'}</AppText>
          </Pressable>
        </View>
      </View>
    </Surface>
  );
}
