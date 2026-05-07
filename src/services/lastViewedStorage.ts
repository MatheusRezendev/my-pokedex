import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_VIEWED_KEY = '@mypokedex/last-viewed:v1';

export type LastViewedPokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
};

export async function getLastViewedPokemons(): Promise<LastViewedPokemon | null> {
  const raw = await AsyncStorage.getItem(LAST_VIEWED_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as LastViewedPokemon;
}

export async function setLastViewedPokemon(pokemon: LastViewedPokemon): Promise<void> {
    await AsyncStorage.setItem(LAST_VIEWED_KEY, JSON.stringify(pokemon));
}

export async function clearLastViewedPokemon(): Promise<void> {
    await AsyncStorage.removeItem(LAST_VIEWED_KEY);
}