import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes';
import { fetchPokemonListPage, type PokemonListItemUI } from '../../services/pokeapi';
import { getFavoriteIds, getFavoritePokemons } from '../../services/favoritesStorage';
import { getLastViewedPokemon, type LastPokemonViewed} from '../../services/lastPokemonViewed'

const PAGE_SIZE = 10;
type PokemonListDisplayItem = PokemonListItemUI & {
 types?: string[];
};


const TYPE_COLORS: Record<string, string> = {
 normal: '#A8A77A',
 fire: '#EE8130',
 water: '#6390F0',
 electric: '#F7D02C',
 grass: '#7AC74C',
 ice: '#96D9D6',
 fighting: '#C22E28',
 poison: '#A33EA1',
 ground: '#E2BF65',
 flying: '#A98FF3',
 psychic: '#F95587',
 bug: '#A6B91A',
 rock: '#B6A136',
 ghost: '#735797',
 dragon: '#6F35FC',
 dark: '#705746',
 steel: '#B7B7CE',
 fairy: '#D685AD',
};


function getTypeColor(type: string) {
 return TYPE_COLORS[type] ?? '#A8A8A8';
}


export default function PokemonListScreen() {
 const theme = useTheme();
 const styles = createStyles(theme);
 const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PokemonList'>>();


 const [items, setItems] = useState<PokemonListDisplayItem[]>([]);
 const [offset, setOffset] = useState(0);
 const [hasNextPage, setHasNextPage] = useState(true);


 const [isInitialLoading, setIsInitialLoading] = useState(true);
 const [isLoadingMore, setIsLoadingMore] = useState(false);
 const [isRefreshing, setIsRefreshing] = useState(false);


 const [error, setError] = useState<string | null>(null);


 const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
 const [favoriteItems, setFavoriteItems] = useState<PokemonListDisplayItem[]>([]);
 const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
 const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);


 const [lastPokemonViewed, setLastViewedPokemon] = useState<LastPokemonViewed | null> (null);


 async function loadInitial() {
   try {
     setError(null);
     setIsInitialLoading(true);
     const page = await fetchPokemonListPage(PAGE_SIZE, 0);
     setItems(page.items);
     setOffset(PAGE_SIZE);
     setHasNextPage(Boolean(page.next));
   } catch {
     setError('Falha ao carregar a lista de Pokémon.');
   } finally {
     setIsInitialLoading(false);
   }
 }


 async function loadMore() {
   if (showOnlyFavorites || isLoadingMore || isInitialLoading || isRefreshing || !hasNextPage) return;
   try {
     setIsLoadingMore(true);
     const page = await fetchPokemonListPage(PAGE_SIZE, offset);
     setItems((prev) => [...prev, ...page.items]);
     setOffset((prev) => prev + PAGE_SIZE);
     setHasNextPage(Boolean(page.next));
   } catch {
     setError('Falha ao carregar mais Pokémon.');
   } finally {
     setIsLoadingMore(false);
   }
 }


 async function refreshList() {
   try {
     setError(null);
     setIsRefreshing(true);
     const page = await fetchPokemonListPage(PAGE_SIZE, 0);
     setItems(page.items);
     setOffset(PAGE_SIZE);
     setHasNextPage(Boolean(page.next));
   } catch {
     setError('Falha ao atualizar a lista.');
   } finally {
     setIsRefreshing(false);
   }
 }


 async function loadFavoritesFromStorage() {
   try {
     setIsFavoritesLoading(true);
     const [ids, favorites] = await Promise.all([
       getFavoriteIds(),
       getFavoritePokemons(),
     ]);
     setFavoriteIds(ids);
     setFavoriteItems(favorites.map((pokemon) => ({
       id: pokemon.id,
       name: pokemon.name,
       imageUrl: pokemon.imageUrl,
       types: pokemon.types,
     })));
   } finally {
     setIsFavoritesLoading(false);
   }
 }


 async function loadLastViewedPokemon() {
  const pokemon = await getLastViewedPokemon();
  setLastViewedPokemon(pokemon);
 }

 useEffect(() => {
   loadInitial();
  }, []);
  
  
  useFocusEffect(
    React.useCallback(() => {
      loadFavoritesFromStorage();
      loadLastViewedPokemon();
    }, [])
 );


 useEffect(() => {
   if (showOnlyFavorites) {
     loadFavoritesFromStorage();
   }
 }, [showOnlyFavorites]);


 const visibleItems = showOnlyFavorites ? favoriteItems : items;


 function handleLogout() {
   navigation.reset({
     index: 0,
     routes: [{ name: "Login" }],
   })
 }


 const renderItem = ({ item }: { item: PokemonListDisplayItem }) => (
   <TouchableOpacity
     style={styles.card}
     activeOpacity={0.8}
     onPress={() => navigation.navigate('PokemonDetail', { pokemonId: item.id })}
   >
     <View style={styles.cardLeft}>
       <Text style={styles.cardName}>{item.name} {favoriteIds.includes(item.id) ? '★' : '☆'}</Text>
       {item.types?.length ? (
         <View style={styles.typeContainer}>
           {item.types.map((type) => (
             <View
               key={`${item.id}-${type}`}
               style={[styles.typeBadge, { backgroundColor: getTypeColor(type) }]}
             >
               <Text style={styles.typeText}>{type}</Text>
             </View>
           ))}
         </View>
       ) : null}
     </View>
     <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
   </TouchableOpacity>
 );


 if (isInitialLoading) {
   return (
     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
       <ActivityIndicator size="large" color={theme.colors.primary} />
       <Text style={{ marginTop: 16, color: theme.colors.text }}>Carregando lista...</Text>
     </View>
   );
 }
 if (error && !showOnlyFavorites && items.length === 0) {
   return (
     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
       <Text style={{ color: theme.colors.text, marginBottom: 16 }}>{error}</Text>
     </View>
   );
 }


 if (showOnlyFavorites && isFavoritesLoading) {
   return (
     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
       <ActivityIndicator size="large" color={theme.colors.primary} />
       <Text style={{ marginTop: 16, color: theme.colors.text }}>Carregando favoritos...</Text>
     </View>
   );
 }


 return (
   <View style={styles.container}>
     <Text style={styles.headerTitle}>Pokédex</Text>
     <TouchableOpacity
       style={styles.buttonLogout}
       onPress={handleLogout}
     >
       <Text style={styles.buttonLogoutText}>Sair</Text>
     </TouchableOpacity>


     <View style={styles.actionsRow}>
       <TouchableOpacity
         style={[styles.actionButton, styles.favoritesButton]}
         onPress={() => setShowOnlyFavorites((prev) => !prev)}
       >
         <Text style={styles.actionButtonText}>
           {showOnlyFavorites ? 'Mostrar Todos' : 'Mostrar Favoritos'}
         </Text>
       </TouchableOpacity>
     </View>

    {lastPokemonViewed ? (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('PokemonDetail', { pokemonId: lastPokemonViewed.id })
          }
        >
          <View style={styles.cardLeft}>
            <Text style={styles.cardName}>Ultimo visto: {lastPokemonViewed.name}</Text>

            <View style={styles.typeContainer}>
              {lastPokemonViewed.types.map((type) => (
                <View
                  key={`${lastPokemonViewed.id}-${type}`}
                  style={[styles.typeBadge, { backgroundColor: getTypeColor(type) }]}
                >
                  <Text style={styles.typeText}>{type}</Text>
                </View>
              ))}
            </View>
          </View>

          <Image
            source={{ uri: lastPokemonViewed.imageUrl }}
            style={styles.cardImage}
          />
        </TouchableOpacity>
      ) : null}


     <FlatList
       data={visibleItems}
       keyExtractor={(item) => String(item.id)}
       renderItem={renderItem}
       contentContainerStyle={styles.listContent}
       onEndReached={showOnlyFavorites ? undefined : loadMore}
       onEndReachedThreshold={0.5}
       onRefresh={refreshList}
       refreshing={isRefreshing}
       ListEmptyComponent={
         showOnlyFavorites ? (
           <View style={{ paddingVertical: 24, alignItems: 'center' }}>
             <Text style={{ color: theme.colors.textSecondary }}>
               Você ainda não favoritou nenhum Pokémon.
             </Text>
           </View>
         ) : null
       }
       ListFooterComponent={
         showOnlyFavorites && hasNextPage && isLoadingMore ? (
           <View style={{ paddingVertical: 16 }}>
             <ActivityIndicator color={theme.colors.primary} />
           </View>
         ) : null
       }
     />
   </View>
 );
};
