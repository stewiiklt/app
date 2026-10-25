import { Link, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Avatar, RatingBadge, Surface } from '../../src/components';
import { DemoBanner } from '../../src/components/DemoBanner';
import { FoodPhoto } from '../../src/components/FoodPhoto';
import { useDemo } from '../../src/demo/DemoContext';
import { demoStories, getFeedPostsForPersona } from '../../src/demo/data';
import type { FeedItem } from '../../src/api/types';
import { colors, radii, spacing } from '../../src/theme/tokens';

export default function FeedScreen() {
  const { likedIds, toggleLiked, city, persona, mode, api } = useDemo();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [trends, setTrends] = useState<Array<{ rank: number; restaurantId: string; name: string; cuisineType: string; averageRating: number; reviewCount: number }>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const cityId = city.id;

  const load = async () => {
    if (mode !== 'api' || !api) return;
    setError('');
    try {
      const [feedResult, trendResult] = await Promise.all([api.feed({ limit: 20 }), api.trending(cityId)]);
      setFeed(feedResult.items.filter((item) => item.type !== 'trending'));
      setTrends(trendResult.slice(0, 3));
    } catch { setError('Could not load live API activity. Your demo persona and city are unchanged.'); }
  };
  useEffect(() => { void load(); }, [mode, api, cityId, persona]);

  const localPosts = getFeedPostsForPersona(persona.id);
  const visiblePosts = mode === 'api' ? feed.filter((item) => item.type === 'review' || item.type === 'wantToTry') : localPosts;
  const togglePostLike = async (id: string, currentlyLiked: boolean) => {
    if (mode !== 'api' || !api) { toggleLiked(id); return; }
    try {
      if (currentlyLiked) await api.unlikeReview(id); else await api.likeReview(id);
      setFeed(current => current.map(item => item.id === id && item.review ? { ...item, review: { ...item.review, isLikedByMe: !currentlyLiked, likeCount: Math.max(0, item.review.likeCount + (currentlyLiked ? -1 : 1)) } } : item));
    } catch { setError('The like could not be updated on the API.'); }
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={colors.coral600} />}>
      <View style={styles.shell}>
        <View style={styles.topbar}>
          <View><AppText variant="caption" muted>YOUR LITTLE FOOD CIRCLE</AppText><AppText variant="title" style={styles.brand}>foodiefriends</AppText></View>
          <View style={{ alignItems: 'flex-end', gap: 7 }}>
            <Link href={'/notifications' as Href} asChild><Pressable accessibilityRole="button" style={styles.iconButton}><AppText>♧</AppText><AppText variant="caption">Activity</AppText></Pressable></Link>
            <Link href={'/location' as Href} asChild><Pressable accessibilityRole="button" accessibilityLabel="Change country or city" style={styles.cityPill}><AppText style={{ fontSize: 15 }}>⌖</AppText><View><AppText variant="label">{city.name}</AppText><AppText variant="caption" muted>{city.countryName}  ⌄</AppText></View></Pressable></Link>
          </View>
        </View>
        <DemoBanner />
        <View style={styles.scope}><AppText variant="caption" style={styles.scopeDot}>●</AppText><AppText variant="caption" muted>Following <AppText variant="caption" style={{ color: colors.charcoal900 }}>{persona.name}</AppText> · {mode === 'fixtures' ? 'fictional demo activity' : 'API activity'}</AppText></View>
        <View style={styles.sectionHeader}><View><AppText variant="subtitle">Your people, eating</AppText><AppText variant="bodySmall" muted>Recent notes from people you follow</AppText></View><Link href={'/people' as Href} asChild><Pressable><AppText variant="caption" style={styles.linkText}>FIND PEOPLE</AppText></Pressable></Link></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stories}>{demoStories.map((story, index) => <View key={story.initials} style={styles.story}><View style={[styles.storyRing, index === 0 && styles.storyRingActive]}><View style={[styles.storyAvatar, { backgroundColor: story.color }]}><AppText variant="label" style={{ color: colors.white }}>{story.initials}</AppText></View></View><AppText variant="caption" style={{ marginTop: 5 }}>{story.name}</AppText></View>)}</ScrollView>
        <View style={styles.sectionHeader}><View><AppText variant="subtitle">From your circle</AppText><AppText variant="bodySmall" muted>Reviews and Want to Try, newest first</AppText></View><Link href={'/rankings' as Href} asChild><Pressable><AppText variant="caption" style={styles.linkText}>CITY TOP 10</AppText></Pressable></Link></View>
        {error ? <Surface tone="cream"><AppText variant="label">API connection issue</AppText><AppText variant="caption" muted>{error}</AppText></Surface> : null}
        {visiblePosts.map((post: any) => {
          const fromApi = mode === 'api';
          const id = fromApi ? post.id : post.id;
          const name = fromApi ? post.user?.displayName ?? 'Foodie friend' : post.name;
          const restaurant = fromApi ? post.restaurant : post.restaurant;
          if (!restaurant) return null;
          const liked = fromApi ? Boolean(post.review?.isLikedByMe) : post.kind === 'review' && likedIds.includes(id);
          const placeId = restaurant.id ?? restaurant.restaurantId;
          const restaurantName = restaurant.name;
          const cuisine = restaurant.cuisineType ?? restaurant.cuisine;
          const image = restaurant.coverImageUrl ?? restaurant.image;
          return <Surface key={id} padded={false} style={styles.postCard}>
            <View style={styles.postHeader}><Avatar name={name} size={42} /><View style={{ flex: 1 }}><AppText variant="label">{name}</AppText><AppText variant="caption" muted>{fromApi ? new Date(post.createdAt).toLocaleDateString() : post.time} · {restaurant.cityName ?? restaurant.neighborhood ?? city.name}</AppText></View>{post.review?.rating || post.rating ? <RatingBadge rating={Number(post.review?.rating ?? post.rating)} compact /> : null}</View>
            <Link href={`/restaurant/${placeId}` as Href} asChild><Pressable accessibilityRole="button" accessibilityLabel={`Open ${restaurantName}`}><FoodPhoto uri={image ?? ''} dish={restaurantName} style={styles.postImage} /></Pressable></Link>
            <View style={styles.postBody}><Link href={`/restaurant/${placeId}` as Href} asChild><Pressable><AppText variant="subtitle">{restaurantName}</AppText></Pressable></Link><AppText variant="caption" muted>{cuisine} · {restaurant.cityName ?? restaurant.neighborhood ?? city.name}</AppText><AppText variant="body" style={{ marginTop: 9 }}>{fromApi ? post.type === 'wantToTry' ? `${name} wants to try this place` : post.review?.bodyPreview ?? post.review?.body : post.kind === 'wantToTry' ? `${name} wants to try this place` : post.text}</AppText>
              {(fromApi ? post.type !== 'wantToTry' : post.kind !== 'wantToTry') ? <View style={styles.postActions}><Pressable accessibilityRole="button" accessibilityLabel={liked ? 'Unlike review' : 'Like review'} onPress={() => void togglePostLike(id, liked)} style={styles.actionButton}><AppText style={{ color: liked ? colors.coral600 : colors.charcoal800, fontSize: 20 }}>{liked ? '♥' : '♡'}</AppText><AppText variant="caption">{liked ? 'Liked' : 'Like'}{fromApi ? ` · ${post.review?.likeCount ?? 0}` : ''}</AppText></Pressable><Link href={`/review/${id}` as Href} asChild><Pressable style={styles.actionButton}><AppText style={{ fontSize: 18 }}>▢</AppText><AppText variant="caption">Comments</AppText></Pressable></Link><View style={{ flex: 1 }} /><AppText variant="caption" muted>{restaurant.price ?? ' · '} {fromApi ? `Visit ${post.review?.visitNumber ?? 1}` : 'Friend review'}</AppText></View> : <View style={styles.wantTag}><AppText variant="caption" style={{ color: colors.herb700, fontWeight: '800' }}>WANT TO TRY</AppText></View>}
            </View>
          </Surface>;
        })}
        {!visiblePosts.length && <Surface style={{ gap: spacing.sm }}><AppText variant="subtitle">A little quiet in your circle</AppText><AppText variant="bodySmall" muted>Follow more local foodies to see their newest restaurant notes here.</AppText><Link href={'/people' as Href} asChild><Pressable style={styles.cta}><AppText variant="label" style={{ color: colors.white }}>Find people to follow</AppText></Pressable></Link></Surface>}
        <Surface tone="cream" style={styles.trendCard}><View style={styles.sectionHeader}><View><AppText variant="caption" style={{ color: colors.coral700, fontWeight: '800' }}>LOCAL, RIGHT NOW</AppText><AppText variant="subtitle">Trending in {city.name}</AppText></View><Link href={'/rankings' as Href} asChild><Pressable><AppText variant="caption" style={styles.linkText}>SEE RANKINGS</AppText></Pressable></Link></View>{(mode === 'api' ? trends : localPosts.slice(0, 2).map((p, i) => ({ rank: i + 1, restaurantId: p.restaurant.id, name: p.restaurant.name, cuisineType: p.restaurant.cuisine, averageRating: Number(p.restaurant.rating), reviewCount: p.restaurant.reviewCount }))).map((trend) => <Link key={trend.restaurantId} href={`/restaurant/${trend.restaurantId}` as Href} asChild><Pressable style={styles.trendRow}><AppText variant="subtitle" style={{ color: colors.coral700 }}>#{trend.rank}</AppText><View style={{ flex: 1 }}><AppText variant="label">{trend.name}</AppText><AppText variant="caption" muted>{trend.cuisineType}</AppText></View><AppText variant="label">{Number(trend.averageRating).toFixed(1)} ★</AppText></Pressable></Link>)}{mode === 'api' && !trends.length ? <AppText variant="caption" muted>Trend list is empty for this city right now.</AppText> : null}</Surface>
        <View style={{ height: 26 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream100 }, content: { paddingBottom: 14 }, shell: { width: '100%', maxWidth: 520, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.md }, topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm }, brand: { fontSize: 27, lineHeight: 32, color: colors.charcoal900 }, cityPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: colors.border }, iconButton: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingHorizontal: 9, paddingVertical: 5 }, scope: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingTop: 2 }, scopeDot: { color: colors.herb }, sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md }, linkText: { color: colors.coral700, fontWeight: '800' }, stories: { gap: spacing.md, paddingVertical: spacing.sm }, story: { alignItems: 'center', width: 62 }, storyRing: { width: 56, height: 56, borderRadius: 30, borderWidth: 2, borderColor: colors.cream300, alignItems: 'center', justifyContent: 'center' }, storyRingActive: { borderColor: colors.coral500 }, storyAvatar: { width: 46, height: 46, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }, postCard: { overflow: 'hidden', padding: 0, marginTop: spacing.xs }, postHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md }, postImage: { width: '100%', height: 260, backgroundColor: '#EBD9C8' }, postBody: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm }, postActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingTop: spacing.md, marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }, actionButton: { flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 40 }, trendCard: { gap: spacing.xs }, trendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }, wantTag: { paddingVertical: spacing.md, marginTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }, cta: { backgroundColor: colors.coral600, padding: spacing.md, borderRadius: radii.pill, alignItems: 'center' } });
