const pokemonPhotoMemorykey = new Map<number, string>();

export function savePokemonPhoto(pokemonId: number, photoUri: string) {
    pokemonPhotoMemorykey.set(pokemonId, photoUri);
}

export function getPokemonPhoto(pokemonId: number) {
    return pokemonPhotoMemorykey.get(pokemonId) ?? null;
}

