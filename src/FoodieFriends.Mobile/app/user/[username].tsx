import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Avatar, RatingBadge, Surface } from '../../src/components';
import { useDemo } from '../../src/demo/DemoContext';
import type { Review, UserProfile } from '../../src/api/types';
import { colors, spacing } from '../../src/theme/tokens';

export default function UserScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const { mode, api } = useDemo();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (mode !== 'api' || !api) return;
    void Promise.all([api.user(username), api.userReviews(username)])
      .then(([user, userReviews]) => {
        setProfile(user);
        setFollowing(user.isFollowing);
        setReviews(userReviews);
      })
      .catch(() => setError('This profile could not be loaded.'));
  }, [mode, api, username]);

  const toggleFollow = async () => {
    if (!profile || !api) return;
    try {
      if (following) await api.unfollow(profile.id);
      else await api.follow(profile.id);
      setFollowing(!following);
    } catch {
      setError('Could not update follow status.');
    }
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.shell}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <AppText style={{ color: colors.coral700 }}>‹  Back</AppText>
        </Pressable>
        {error ? <Surface tone="cream"><AppText variant="caption" muted>{error}</AppText></Surface> : null}
        {profile ? (
          <>
            <Surface style={styles.card}>
              <Avatar name={profile.displayName} size={78} />
              <AppText variant="title">{profile.displayName}</AppText>
              <AppText variant="bodySmall" muted>@{profile.username} · {profile.cityName ?? 'Scandinavia'}</AppText>
              {profile.bio ? <AppText variant="bodySmall" style={{ textAlign: 'center' }}>{profile.bio}</AppText> : null}
              <View style={styles.stats}>
                <View><AppText variant="subtitle">{profile.reviewCount}</AppText><AppText variant="caption" muted>reviews</AppText></View>
                <View><AppText variant="subtitle">{profile.followingCount}</AppText><AppText variant="caption" muted>following</AppText></View>
                <View><AppText variant="subtitle">{profile.followersCount}</AppText><AppText variant="caption" muted>followers</AppText></View>
              </View>
              {!profile.isMe ? (
                <Pressable onPress={() => void toggleFollow()} style={[styles.follow, following && styles.following]}>
                  <AppText variant="label" style={{ color: following ? colors.charcoal900 : colors.white }}>{following ? 'Following' : 'Follow'}</AppText>
                </Pressable>
              ) : null}
            </Surface>
            <AppText variant="subtitle">Reviews</AppText>
            {reviews.length ? reviews.map((review) => (
              <Surface key={review.id} style={{ gap: spacing.sm }}>
                <View style={styles.reviewHead}>
                  <AppText variant="label">{review.restaurant.name}</AppText>
                  <RatingBadge rating={review.rating} compact />
                </View>
                <AppText variant="caption" muted>{review.restaurant.cityName} · Visit {review.visitNumber} · {review.visibility === 'FriendsOnly' ? 'Friends only' : 'Public'}</AppText>
                {review.title ? <AppText variant="label">{review.title}</AppText> : null}
                <AppText variant="bodySmall">{review.body}</AppText>
              </Surface>
            )) : (
              <Surface style={{ gap: spacing.xs }}>
                <AppText variant="label">No reviews available</AppText>
                <AppText variant="caption" muted>Review visibility is determined by the API.</AppText>
              </Surface>
            )}
          </>
        ) : mode === 'fixtures' ? (
          <Surface style={{ gap: spacing.sm }}>
            <AppText variant="subtitle">Fictional foodie profile</AppText>
            <AppText variant="bodySmall" muted>This profile view needs API mode. Switch the active demo persona from your Profile tab.</AppText>
          </Surface>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream100 },
  content: { paddingBottom: 24 },
  shell: { width: '100%', maxWidth: 520, alignSelf: 'center', padding: spacing.lg, gap: spacing.md },
  back: { minHeight: 38, justifyContent: 'center' },
  card: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  stats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingTop: spacing.md, marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  follow: { alignSelf: 'stretch', minHeight: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral600, borderRadius: 999 },
  following: { backgroundColor: colors.cream300 },
  reviewHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
