import { useEffect, useState } from 'react';
import { Link, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, EmptyState, RatingBadge, Surface } from '../../src/components';
import { DemoBanner } from '../../src/components/DemoBanner';
import { FoodPhoto } from '../../src/components/FoodPhoto';
import { RestaurantTile } from '../../src/components/RestaurantTile';
import { useDemo } from '../../src/demo/DemoContext';
import { demoRestaurants } from '../../src/demo/data';
import type { WantToTry } from '../../src/api/types';
import { colors, spacing } from '../../src/theme/tokens';

export default function SavedScreen() {
  const { savedIds, city, mode, api } = useDemo();
  const [apiSaved, setApiSaved] = useState<WantToTry[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { if (mode==='api'&&api) void api.savedPlaces().then(setApiSaved).catch(()=>setError('Could not load your Want to Try list from the API.')); },[mode,api]);
  const saved = mode==='api' ? apiSaved : demoRestaurants.filter((restaurant) => savedIds.includes(restaurant.id));
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}><View style={styles.shell}>
    <View><AppText variant="caption" muted>YOUR FUTURE PLANS</AppText><AppText variant="display">Want to Try</AppText><AppText variant="bodySmall" muted>Good places you and your circle are hoping to visit.</AppText></View><DemoBanner />
    {error?<Surface tone="cream"><AppText variant="label">List unavailable</AppText><AppText variant="caption" muted>{error}</AppText></Surface>:null}
    {saved.length ? saved.map((item:any) => { const live=mode==='api'; const restaurant=live?item.restaurant:item; const cityName=restaurant.cityName??('cityName'in item?item.cityName:city.name); if(!live)return <RestaurantTile key={item.id} restaurant={item}/>;return <Surface key={item.id} padded={false} style={styles.apiCard}><Link href={`/restaurant/${item.restaurantId}` as Href} asChild><Pressable><FoodPhoto uri={restaurant.coverImageUrl??''} dish={restaurant.name} style={styles.image}/></Pressable></Link><View style={styles.cardBody}><View style={{flex:1}}><AppText variant="subtitle">{restaurant.name}</AppText><AppText variant="caption" muted>{restaurant.cuisineType} · {cityName}</AppText></View><RatingBadge rating={restaurant.averageRating} compact/><Pressable accessibilityRole="button" onPress={async()=>{try{await api?.removeSavedPlace(item.restaurantId);setApiSaved(current=>current.filter(x=>x.id!==item.id));}catch{setError('Could not remove this place from your Want to Try list.')}}} style={styles.remove}><AppText variant="caption" style={{color:colors.coral700}}>Remove</AppText></Pressable></View></Surface>; }) : <EmptyState title="Your list is hungry" message="Save a restaurant in Discover and it will be waiting here." />}
  </View></ScrollView>;
}
const styles=StyleSheet.create({page:{flex:1,backgroundColor:colors.cream100},content:{paddingBottom:24},shell:{width:'100%',maxWidth:520,alignSelf:'center',padding:spacing.lg,gap:spacing.md},apiCard:{padding:0,overflow:'hidden'},image:{width:'100%',height:190,backgroundColor:'#EBD9C8'},cardBody:{flexDirection:'row',alignItems:'center',gap:spacing.sm,padding:spacing.md},remove:{paddingHorizontal:10,paddingVertical:8}});
