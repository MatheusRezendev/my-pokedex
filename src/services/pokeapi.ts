const BASE_URL = 'https://pokeapi.co/api/v2';

type FetchOptions = {
  signal?: AbortSignal;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export async function fetchPokemonList(
  limit = 20,
  offset = 0,
  options?: FetchOptions,
): Promise<PokemonListResponse> {
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetch(url, { signal: options?.signal });

  if (!response.ok) {
    throw new Error('Falha ao buscar lista de Pokemon');
  }

  return response.json();
}

export type PokemonListItemUI = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
};

type PokemonDetailListItemResponse = {
  id: number;
  name: string;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
};

export async function fetchPokemonListPage(
  limit = 20,
  offset = 0,
  options?: FetchOptions,
): Promise<{
  items: PokemonListItemUI[];
  count: number;
  next: string | null;
}> {
  const data = await fetchPokemonList(limit, offset, options);
  const details = await Promise.all(
    data.results.map(async (pokemon) => {
      const response = await fetch(pokemon.url, { signal: options?.signal });
      if (!response.ok) {
        throw new Error(`Falha ao buscar detalhes de ${pokemon.name}`);
      }
      return (await response.json()) as PokemonDetailListItemResponse;
    }),
  );

  const items = details.map((detail) => ({
    id: detail.id,
    name: detail.name,
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.id}.png`,
    types: detail.types.map((item) => item.type.name),
  }));

  return {
    items,
    count: data.count,
    next: data.next,
  };
}

export type PokemonDetailResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
};

export async function fetchPokemonDetail(
  nameOrId: string | number,
  options?: FetchOptions,
): Promise<PokemonDetailResponse> {
  const url = `${BASE_URL}/pokemon/${nameOrId}`;
  const response = await fetch(url, { signal: options?.signal });

  if (!response.ok) {
    throw new Error('Falha ao buscar detalhes do Pokemon');
  }

  return response.json();
}

export type PokemonSpeciesResponse = {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }[];
};

export async function fetchPokemonSpecies(
  nameOrId: string | number,
  options?: FetchOptions,
): Promise<PokemonSpeciesResponse> {
  const url = `${BASE_URL}/pokemon-species/${nameOrId}`;
  const response = await fetch(url, { signal: options?.signal });

  if (!response.ok) {
    throw new Error('Falha ao buscar descricao do Pokemon');
  }

  return response.json();
}
