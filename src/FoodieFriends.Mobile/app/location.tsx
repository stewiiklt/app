import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppText, Surface } from '../src/components';
import { useDemo } from '../src/demo/DemoContext';
import { colors, radii, spacing } from '../src/theme/tokens';

const flags: Record<string, string> = { NO: '🇳🇴', SE: '🇸🇪', DK: '🇩🇰', FI: '🇫🇮', IS: '🇮🇸' };

export default function LocationScreen() {
  const router = useRouter();
  const { city, cities, setCity } = useDemo();
  const [query, setQuery] = useState('');
  const groups = useMemo(() => {
    const filtered = cities.filter((item) => `${item.name} ${item.countryName}`.toLowerCase().includes(query.toLowerCase()));
    return [...new Set(filtered.map((item) => item.countryCode))].map((code) => ({ code, name: filtered.find((item) => item.countryCode === code)?.countryName ?? code, cities: filtered.filter((item) => item.countryCode === code) }));
  }, [cities, query]);
  return <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><View style={styles.shell}>
    <Pressable onPress={() => router.back()} style={styles.back}><AppText style={{ color: colors.coral700 }}>‹</AppText><AppText variant="label" style={{ color: colors.coral700 }}>Back</AppText></Pressable>
    <View style={{ gap: 5 }}><AppText variant="caption" muted>LOCAL FOOD, FIVE COUNTRIES</AppText><AppText variant="display">Choose your city</AppText><AppText variant="bodySmall" muted>Your city sets the default trends, discovery, and rankings. You can still review restaurants anywhere in Scandinavia.</AppText></View>
    <TextInput value={query} onChangeText={setQuery} placeholder="Search a city or country" placeholderTextColor={colors.muted} accessibilityLabel="Search cities" style={styles.search} />
    <View style={styles.countryPills}>{['NO','SE','DK','FI','IS'].map((code) => <Pressable key={code} onPress={() => setQuery(cities.find((c) => c.countryCode === code)?.countryName ?? '')} style={styles.countryPill}><AppText>{flags[code]}</AppText><AppText variant="caption">{code}</AppText></Pressable>)}</View>
    {groups.map((group) => <View key={group.code} style={{ gap: spacing.sm }}><AppText variant="subtitle">{flags[group.code]}  {group.name}</AppText>{group.cities.map((item) => <Pressable key={item.id} onPress={() => { setCity(item.id); router.back(); }}><Surface style={[styles.cityRow, city.id === item.id && styles.citySelected]}><View style={{ flex: 1 }}><AppText variant="label">{item.name}</AppText><AppText variant="caption" muted>{group.name}</AppText></View><AppText style={{ color: city.id === item.id ? colors.herb700 : colors.muted }}>{city.id === item.id ? '✓' : '›'}</AppText></Surface></Pressable>)}</View>)}
  </View></ScrollView>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream100 }, content: { paddingBottom: 28 }, shell: { width: '100%', maxWidth: 520, alignSelf: 'center', padding: spacing.lg, gap: spacing.xl }, back: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 42 }, search: { height: 52, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radii.xl, paddingHorizontal: spacing.lg, color: colors.charcoal900, fontSize: 16 }, countryPills: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }, countryPill: { flex: 1, minHeight: 42, borderRadius: radii.pill, backgroundColor: colors.cream300, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 }, cityRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg }, citySelected: { borderColor: colors.herb, backgroundColor: colors.teal50 } });
