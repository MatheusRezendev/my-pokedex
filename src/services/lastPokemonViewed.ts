import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_POKEMON_KEY = '@mypokedex/last-view:v1';

export type LastPokemonViewed = {
 id: number;
 name: string;
 imageUrl: string;
 types: string[];
 viewedAt: string;
};

type SaveLastViewedPokemonInput = Omit<LastPokemonViewed, 'viewedAt'>;

export async function getLastViewedPokemon(): Promise<LastPokemonViewed | null>{
 const raw = await AsyncStorage.getItem(LAST_POKEMON_KEY);
 if (!raw) return null;
 return JSON.parse(raw) as LastPokemonViewed;
}

export async function saveLastViewedPokemon(
    pokemon: SaveLastViewedPokemonInput,
): Promise<LastPokemonViewed> {
 const data: LastPokemonViewed = {
    ...pokemon,
    viewedAt: new Date().toISOString(),
 };

 await AsyncStorage.setItem(LAST_POKEMON_KEY, JSON.stringify(data))
 return data;
}

export async function clearLastViewedPokemon(): Promise<void> {
 await AsyncStorage.removeItem(LAST_POKEMON_KEY);
}
