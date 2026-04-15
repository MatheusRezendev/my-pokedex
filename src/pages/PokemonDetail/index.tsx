import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Share 
} from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import {
 fetchPokemonDetail,
 fetchPokemonSpecies,
 type PokemonDetailResponse,
 type PokemonSpeciesResponse
} from '../../services/pokeapi';
import { isFavorite, toggleFavorite } from '../../services/favoritesStorage';
import { saveLastViewedPokemon } from '../../services/lastPokemonViewed';

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


export default function PokemonDetailScreen() {
 const theme = useTheme();
 const styles = createStyles(theme);
 const route = useRoute<RouteProp<RootStackParamList, 'PokemonDetail'>>();
 const { pokemonId } = route.params;


 const [pokemon, setPokemon] = useState<PokemonDetailResponse | null>(null);
 const [description, setDescription] = useState<string | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);


 const [favorite, setFavorite] = useState(false);
 const [favoriteLoading, setFavoriteLoading] = useState(true);


 function getPokemonDescriptionFromSpecies(
   species: PokemonSpeciesResponse,
 ): string | null {
   const ptEntry = species.flavor_text_entries.find(
     (entry) => entry.language.name === 'pt-BR'
   );
   if (ptEntry) {
     return ptEntry.flavor_text.replace(/\s+/g, ' ').replace(/\f/g, ' ').trim();
   }
   const enEntry = species.flavor_text_entries.find(
     (entry) => entry.language.name === 'en',
   );
   if (enEntry) {
     return enEntry.flavor_text.replace(/\s+/g, ' ').replace(/\f/g, ' ').trim();
   }
   return null;
 }

 async function handleToggleFavorite() {
   if (!pokemon) return;
   const summary = {
     id: pokemon.id,
     name: pokemon.name,
     imageUrl:
       pokemon.sprites.front_default ??
       `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
     types: pokemon.types.map((t) => t.type.name),
   };
   const updated = await toggleFavorite(summary);
   setFavorite(updated.some((item) => item.id === pokemon.id));
 }

 async function handleSharePokemon() {
    if (!pokemon) return;

    const message_stats = {
      name: pokemon.name,
      id: pokemon.id,
      types: pokemon.types.map((t) => t.type.name).join(', '),
      height: pokemon.height / 10,
      weight: pokemon.weight / 10
    }

    const pokeApiUrl = `https://www.pokemon.com/br/pokedex/${pokemon.id}/`;
    const message = `Olha esse Pokémon na Pokédex: {${message_stats.name}, ${message_stats.types}, ${message_stats.height}, ${message_stats.weight}} (#${String(message_stats.id).padStart(3, '0')})\n${pokeApiUrl}`;

    try {
      const result = await Share.share(
        {
          message,
          title: `Pokémon: ${pokemon.name}`,
        },
        { subject: `Pokémon: ${pokemon.name}` },
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        }
      } 
      else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      console.warn('Erro ao compartilhar:', error);
    }
 }

 useEffect(() => {
   const controller = new AbortController();


   async function loadPokemon() {
     try {
       setIsLoading(true);
       setError(null);

       const [detail, species] = await Promise.all([
         fetchPokemonDetail(pokemonId, { signal: controller.signal }),
         fetchPokemonSpecies(pokemonId, { signal: controller.signal }),
       ]);

       await saveLastViewedPokemon({
        id: detail.id,
        name: detail.name,
        imageUrl:
        detail.sprites.front_default ??
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.id}.png`,
      types: detail.types.map((item) => item.type.name),
      });

       setPokemon(detail);
       setDescription(getPokemonDescriptionFromSpecies(species));
     } catch (e) {
       if ((e as Error).name !== 'AbortError') {
         setError('Não foi possível carregar os dados do pokémon!');
       }
     } finally {
       setIsLoading(false);
     }
   }


   async function loadFavoriteStatus() {
     try {
       const result = await isFavorite(pokemonId);
       setFavorite(result);
     } finally {
       setFavoriteLoading(false);
     }
   }

   loadPokemon();
   loadFavoriteStatus();

   return () => { controller.abort(); };
 }, [pokemonId]);


 if (isLoading) {
   return (
     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
       <ActivityIndicator size="large" color={theme.colors.primary} />
       <Text style={{ marginTop: 16, color: theme.colors.text }}>Carregando detalhes (simulado)...</Text>
     </View>
   );
 }


 if (error || !pokemon) {
   return (
     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
       <Text style={{ color: theme.colors.text, marginBottom: 16 }}>
         {error ?? 'Erro inesperado na simulação.'}
       </Text>
       <TouchableOpacity
         //onPress={() => navigation.goBack()}
         style={{
           paddingHorizontal: 16,
           paddingVertical: 10,
           borderRadius: 24,
           backgroundColor: theme.colors.accent,
         }}
       >
         <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>Voltar</Text>
       </TouchableOpacity>
     </View>
   );
 }


 return (
   <ScrollView style={styles.container} contentContainerStyle={styles.content}>
     <View style={styles.header}>
       <View style={styles.nameRow}>
         <Text style={styles.name}>{pokemon.name}</Text>
         <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
       </View>


       <View style={styles.typeContainer}>
         {pokemon.types.map(({ type }) => (
           <View
             key={type.name}
             style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[type.name] ?? '#A8A8A8' }]}
           >
             <Text style={styles.typeText}>{type.name}</Text>
           </View>
         ))}
       </View>


       {pokemon.sprites.front_default ?
         (<Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />) :
         null}
     </View>
        
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
      <TouchableOpacity
        onPress={handleToggleFavorite}
        disabled={favoriteLoading}
        style={{
          backgroundColor: favorite ? '#FFCB05' : '#E5E7EB',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 999,
          alignSelf: 'flex-start',
          marginBottom: 16,
        }}
        >
          <Text style={{ fontWeight: '700', color: '#111827' }}>
            {favorite ? '★ Favorito' : '☆ Favoritar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSharePokemon}
          style={{
            backgroundColor: '#2563eb',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 999,
            marginBottom: 16,
            alignItems: 'flex-end',
          }}
          >
          <Text style={{ fontWeight: '700', color: '#fff' }}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

     <View style={styles.section}>
       <Text style={styles.sectionTitle}>Sobre</Text>
       <Text style={styles.sectionText}>
         {description ?? 'Descrição não disponível.'}
       </Text>
     </View>


     <View style={styles.section}>
       <Text style={styles.sectionTitle}>Informações básicas</Text>
       <View style={styles.infoRow}>
         <Text style={styles.infoLabel}>Altura</Text>
         <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
       </View>
       <View style={styles.infoRow}>
         <Text style={styles.infoLabel}>Peso</Text>
         <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
       </View>
     </View>


     <View style={styles.section}>
       <Text style={styles.sectionTitle}>Stats base</Text>
       {pokemon.stats.map((stat) => (
         <View key={stat.stat.name} style={styles.statRow}>
           <Text style={styles.statName}>{stat.stat.name.toUpperCase()}</Text>
           <Text style={styles.statValue}>{stat.base_stat}</Text>
         </View>
       ))}
     </View>
   </ScrollView>
 );
};
