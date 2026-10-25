import { Link, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppText, EmptyState, RatingBadge, Surface } from '../../src/components';
import { DemoBanner } from '../../src/components/DemoBanner';
import { FoodPhoto } from '../../src/components/FoodPhoto';
import { useDemo } from '../../src/demo/DemoContext';
import { demoRestaurants, type DemoRestaurant } from '../../src/demo/data';
import type { Restaurant } from '../../src/api/types';
import { colors, radii, spacing } from '../../src/theme/tokens';

const filters = ['All', 'Nordic', 'Pizza', 'Japanese', 'Seafood', 'New'];
export default function DiscoverScreen() {
  const { city, mode, api, savedIds, toggleSaved } = useDemo();
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [scope, setScope] = useState<'city'|'country'>('city');
  const [apiRestaurants, setApiRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    if (mode !== 'api' || !api) return;
    setError('');
    void api.searchRestaurants({ q: search || undefined, city: scope === 'city' ? city.id : undefined, cuisine: cuisine === 'All' || cuisine === 'New' ? undefined : cuisine, isNew: cuisine === 'New' || undefined })
      .then(setApiRestaurants).catch(() => setError('Could not load restaurants from the API. Try again when connected.'));
  }, [mode, api, city.id, scope, search, cuisine]);
  const fixtures = useMemo(() => demoRestaurants.filter((r) => (scope === 'country' ? !r.countryCode || r.countryCode === city.countryCode : !r.cityId || r.cityId === city.id) && (`${r.name} ${r.cuisine} ${r.neighborhood} ${r.dish}`).toLowerCase().includes(search.toLowerCase()) && (cuisine === 'All' || cuisine === 'New' ? cuisine !== 'New' || Number(r.rating) >= 9 : r.cuisine.toLowerCase().includes(cuisine.toLowerCase()))), [city, scope, search, cuisine]);
  const results: Array<DemoRestaurant|Restaurant> = mode === 'api' ? apiRestaurants : fixtures;
  return <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><View style={styles.shell}>
    <View style={{ gap: 4 }}><AppText variant="caption" muted>FIND YOUR NEXT YES</AppText><AppText variant="display">A table for inspiration</AppText><AppText variant="bodySmall" muted>Places worth a detour, picked by foodies like you.</AppText></View><DemoBanner />
    <TextInput value={search} onChangeText={setSearch} placeholder="Restaurant, dish or neighborhood" placeholderTextColor={colors.muted} accessibilityLabel="Search restaurants" style={styles.search} returnKeyType="search" />
    <View style={styles.scopeRow}><AppText variant="caption" muted>LOOKING AROUND</AppText>{(['city','country'] as const).map((item)=><Pressable key={item} onPress={()=>setScope(item)} style={[styles.scopePill,scope===item&&styles.scopeActive]}><AppText variant="caption" style={{color:scope===item?colors.white:colors.charcoal800}}>{item==='city'?city.name:city.countryName}</AppText></Pressable>)}</View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{filters.map((item)=><Pressable key={item} onPress={()=>setCuisine(item)} style={[styles.filter,cuisine===item&&styles.filterSelected]}><AppText variant="caption" style={{color:cuisine===item?colors.white:colors.charcoal800}}>{item}</AppText></Pressable>)}</ScrollView>
    <View style={styles.sectionHead}><View><AppText variant="subtitle">{scope==='city'?`Loved around ${city.name}`:`Around ${city.countryName}`}</AppText><AppText variant="caption" muted>{mode==='fixtures'?'Fictional sample places':'Restaurant results'} · {results.length} places</AppText></View><Link href={'/rankings' as Href} asChild><Pressable><AppText variant="caption" style={{color:colors.coral700,fontWeight:'800'}}>RANKINGS</AppText></Pressable></Link></View>
    {error ? <Surface tone="cream"><AppText variant="label">Could not reach the API</AppText><AppText variant="caption" muted>{error}</AppText></Surface> : null}
    {results.length ? results.map((item)=>{const live='municipalityId' in item; const id=item.id; const name=item.name; const rating=live?item.averageRating:Number(item.rating);const image=live?item.coverImageUrl:item.image;const cuisineName=live?item.cuisineType:item.cuisine;const location=live?item.cityName:item.cityName??city.name; const isSaved=savedIds.includes(id)||(live&&item.isWantToTry);return <Surface key={id} padded={false} style={styles.card}><Link href={`/restaurant/${id}` as Href} asChild><Pressable><FoodPhoto uri={image??''} dish={name} style={styles.image}/></Pressable></Link><View style={styles.cardBody}><View style={styles.cardTitle}><View style={{flex:1,gap:3}}><Link href={`/restaurant/${id}` as Href} asChild><Pressable><AppText variant="subtitle">{name}</AppText></Pressable></Link><AppText variant="caption" muted>{cuisineName} · {location}</AppText></View><RatingBadge rating={rating} compact/></View><View style={styles.meta}><AppText variant="caption" muted>{live?`$${item.priceRange} · ${item.totalReviews} reviews`:item.price}</AppText>{(live?item.isNew: false)&&<AppText variant="caption" style={styles.newTag}>NEW</AppText>}<View style={{flex:1}}/><Pressable accessibilityRole="button" accessibilityLabel={isSaved?'Remove from Want to Try':'Add to Want to Try'} onPress={()=>toggleSaved(id)} style={styles.save}><AppText style={{color:isSaved?colors.coral600:colors.charcoal800}}>{isSaved?'♥':'♡'}</AppText><AppText variant="caption">{isSaved?'Saved':'Want to Try'}</AppText></Pressable></View></View></Surface>;}) : <EmptyState title="No bites found" message={mode==='api'?'Try a different search or switch to another city.':'Try another name, dish, cuisine, or country.'} />}
  </View></ScrollView>;
}
const styles=StyleSheet.create({page:{flex:1,backgroundColor:colors.cream100},content:{paddingBottom:24},shell:{width:'100%',maxWidth:520,alignSelf:'center',padding:spacing.lg,gap:spacing.md},search:{height:52,backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,borderRadius:radii.xl,paddingHorizontal:spacing.lg,color:colors.charcoal900,fontSize:15},scopeRow:{flexDirection:'row',alignItems:'center',gap:spacing.sm,flexWrap:'wrap'},scopePill:{backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,borderRadius:radii.pill,paddingHorizontal:12,paddingVertical:8},scopeActive:{backgroundColor:colors.herb,borderColor:colors.herb},filters:{gap:spacing.sm,paddingVertical:spacing.xs},filter:{borderRadius:radii.pill,backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,paddingHorizontal:15,paddingVertical:10},filterSelected:{backgroundColor:colors.charcoal900,borderColor:colors.charcoal900},sectionHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:spacing.sm},card:{padding:0,overflow:'hidden',marginBottom:spacing.xs},image:{width:'100%',height:190,backgroundColor:'#EBD9C8'},cardBody:{padding:spacing.md,gap:spacing.sm},cardTitle:{flexDirection:'row',alignItems:'center',gap:spacing.sm},meta:{flexDirection:'row',alignItems:'center',gap:spacing.sm,minHeight:38},newTag:{color:colors.herb700,backgroundColor:colors.teal50,paddingHorizontal:8,paddingVertical:4,borderRadius:radii.pill,fontWeight:'800'},save:{flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:8,paddingVertical:6}});
