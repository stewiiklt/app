import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { colors } from '../../src/theme/tokens';

const icons = {
  index: { ios: 'house.fill', android: 'home', web: 'home' },
  discover: { ios: 'safari.fill', android: 'explore', web: 'explore' },
  review: { ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' },
  saved: { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' },
  'want-to-try': { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' },
  profile: { ios: 'person.crop.circle.fill', android: 'person', web: 'person' },
} as const;

export default function TabLayout() {
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.coral600,
      tabBarInactiveTintColor: colors.muted,
      tabBarLabelStyle: { fontSize: 11, lineHeight: 14, fontWeight: '700', marginTop: 2 },
      tabBarIconStyle: { marginTop: 1 },
      tabBarItemStyle: { paddingVertical: 4 },
      tabBarStyle: {
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
        height: 76,
        paddingTop: 8,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.white,
        shadowColor: colors.charcoal900,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 10,
      },
      tabBarIcon: ({ color, size }) => <SymbolView name={icons[route.name as keyof typeof icons]} tintColor={color} size={size} />,
    })}>
      <Tabs.Screen name="index" options={{ title: 'Feed' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="review" options={{ title: 'Review', tabBarActiveTintColor: colors.herb700 }} />
      <Tabs.Screen name="want-to-try" options={{ title: 'Want to Try' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="saved" options={{ href: null }} />
    </Tabs>
  );
}
