## My Pokédex

Aplicativo mobile em React Native com Expo, usado em aulas práticas de desenvolvimento mobile, no formato de uma Pokédex.

### O que o projeto faz hoje

- **Login** (`src/pages/Login`) com fluxo assíncrono simulado e navegação para a listagem.
- **Listagem** (`src/pages/PokemonList`) consumindo a [PokéAPI](https://pokeapi.co) com **paginação** (`limit` / `offset`), **pull-to-refresh**, filtros de **favoritos** e exibição do **último Pokémon visto**.
- **Detalhe** (`src/pages/PokemonDetail`) com dados reais da API (`pokemon/{id}`), descrição via **`pokemon-species/{id}`** (quando disponível em português ou inglês), **favoritar** e persistência do **último visto**.
- **Navegação** em pilha (React Navigation): Login → Listagem → Detalhe, com parâmetro `id` no detalhe.
- **Temas** (`src/global/themes.tsx`): paleta inspirada na Pokédex e suporte a modo claro/escuro do sistema.
- **Persistência local** (`AsyncStorage`): favoritos e último visto, em serviços dedicados em `src/services/`.

---

## Pré-requisitos

- **Node.js** (versão LTS recomendada)
- **npm** (vem junto com o Node.js)
- **Expo Go** instalado no celular  
  - Android: disponível na Google Play Store  
  - iOS: disponível na App Store

Opcional (para emuladores):

- Android Studio (emulador Android)
- Xcode (emulador iOS, apenas em macOS)

---

## Como rodar o projeto localmente

1. **Clonar o repositório**

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd my-pokedex
   ```

2. **Instalar as dependências**

   ```bash
   npm install
   ```

3. **Iniciar o servidor do Expo**

   ```bash
   npx expo start
   ```

   Isso irá abrir a interface do Expo no navegador e/ou no terminal.

4. **Rodar no celular (recomendado)**

   - Conecte o celular e o computador **na mesma rede Wi‑Fi**.
   - Abra o aplicativo **Expo Go** no celular.
   - No navegador/terminal, leia o **QR Code** com o aplicativo Expo Go.
   - Aguarde o bundle carregar e o app será aberto.

5. **Rodar em emulador (opcional)**

   Com o servidor Expo rodando (`npx expo start`):

   - Para Android:

     ```bash
     npx expo start --android
     ```

   - Para iOS (apenas macOS):

     ```bash
     npx expo start --ios
     ```

---

## Estrutura básica do projeto

```text
my-pokedex/
  App.tsx                  # NavigationContainer + StatusBar + AppNavigator
  src/
    routes/
      index.tsx            # Stack Navigator (Login, PokemonList, PokemonDetail)
    global/
      themes.tsx           # Temas claro/escuro (paleta Pokédex) e hook useTheme
    pages/
      Login/
        index.tsx
        styles.ts
      PokemonList/
        index.tsx          # Lista paginada, favoritos, último visto
        styles.ts
      PokemonDetail/
        index.tsx          # API + espécie + favorito + último visto
        styles.ts
    services/
      pokeapi.ts           # Chamadas à PokéAPI (lista, detalhe, espécie)
      favoritesStorage.ts  # Favoritos no AsyncStorage (snapshot para listar sem nova API)
      lastViewedStorage.ts # Último Pokémon visto no AsyncStorage
    @types/
      png.d.ts             # Tipagem para import de imagens PNG
```

---

## Conceitos para estudo (API, lista e detalhe)

### Serviço `pokeapi.ts`

- **`BASE_URL`**: `https://pokeapi.co/api/v2` — base de todos os endpoints.
- **`fetchPokemonList(limit, offset)`**: lista paginada em `/pokemon?limit=&offset=`. Retorna `results` com `name` e `url` (cada `url` aponta para o recurso completo do Pokémon).
- **`fetchPokemonListPage` (ou lógica equivalente na listagem)**: monta os itens da UI. Como a lista **não traz tipos**, costuma-se fazer **uma requisição extra por item da página** (padrão N+1) para obter `types` e `sprites` — trade-off didático: mais requests, card mais rico.
- **`fetchPokemonDetail(id)`**: `GET /pokemon/{id}` — stats, tipos, altura, peso, sprites.
- **`fetchPokemonSpecies(id)`**: `GET /pokemon-species/{id}` — textos em `flavor_text_entries`; escolher idioma (ex.: `pt-BR` / `en`) e normalizar quebras de linha no texto.
- **Tipagem TypeScript** (`PokemonListResponse`, `PokemonDetailResponse`, etc.): documenta o formato JSON e ajuda o autocomplete/erros de compilação.

### Estado assíncrono na tela (loading / erro / dados)

- **`useState`** para `items`, `isLoading`, `error`, etc.
- **`useEffect`** com dependência `[id]` no detalhe: ao mudar o Pokémon, busca de novo.
- **`Promise.all`**: buscar detalhe e espécie **em paralelo** quando fizer sentido.
- **`AbortController`**: criar `const controller = new AbortController()`, passar `signal` para `fetch`, e no cleanup do `useEffect` chamar `controller.abort()` para **cancelar** a requisição se o usuário sair da tela — evita atualizar estado após desmontagem.

### Listagem com `FlatList` e paginação

- **`onEndReached`**: dispara ao chegar perto do fim da lista — usado para **carregar a próxima página** (`offset += limit`).
- **`onEndReachedThreshold`**: sensibilidade (ex.: `0.5`).
- **`onRefresh` + `refreshing`**: pull-to-refresh; **`refreshing` deve ser boolean** sempre que existir `onRefresh`.
- **Estados separados**: carregamento inicial (`isInitialLoading`), carregar mais (`isLoadingMore`), atualizar (`isRefreshing`) — a UI reage a cada um.
- **Modo “só favoritos”**: costuma **desligar** `onEndReached` da API e usar **dados já salvos** no `AsyncStorage` (snapshot), para não depender só do que já foi paginado na lista “Todos”.

### Cores dos tipos (badges)

- Mapa `Record<string, string>` (nome do tipo → cor hexadecimal) para aproximar as cores da Pokédex.
- Aplicar no badge com estilo dinâmico: `[styles.typeBadge, { backgroundColor: getTypeColor(type) }]`.

---

## Persistência local (AsyncStorage)

### Ideia geral

- Dados em **`useState` somem** ao fechar o app.
- **`AsyncStorage`** guarda pares **chave → string** no dispositivo.
- Objetos e arrays precisam de **`JSON.stringify`** ao salvar e **`JSON.parse`** ao ler.
- Usar **chaves com prefixo e versão** (ex.: `@mypokedex/favorites:v2`) facilita evoluir o formato sem conflito.

### Favoritos (`favoritesStorage.ts`)

- Guardar um **objeto por Pokémon** (ex.: `id`, `name`, `imageUrl`, `types`) permite **listar favoritos sem chamar a API de novo**.
- Funções típicas: `getFavoritePokemons`, `isFavorite`, `toggleFavorite`, `clearFavorites`.

### Último visto (`lastViewedStorage.ts`)

- Ao carregar o detalhe com sucesso, salvar um snapshot (`LastViewedPokemon`).
- Na listagem, em **`useFocusEffect`**, reler o storage para atualizar a linha “Último visto” ao voltar do detalhe.

### `useFocusEffect` (React Navigation)

- Roda quando a tela **ganha foco** (ex.: volta da navegação).
- Útil para **sincronizar** lista com o que mudou em outra tela (favoritos, último visto).

---

## Componentes principais do React Native usados no projeto

- **`View`**: contêiner para layout (equivalente grosseiro a `div`).
- **`Text`**: qualquer texto visível na tela.
- **`Image`**: sprites locais ou por URL.
- **`TextInput`**: campos do login.
- **`TouchableOpacity`**: toque com feedback; botões e cards clicáveis.
- **`ScrollView`**: rolagem em telas com poucos filhos (detalhe).
- **`FlatList`**: lista longa com virtualização; paginação e refresh.
- **`ActivityIndicator`**: feedback de carregamento.

---

## Hooks e navegação

- **`useState`**: estado local da tela.
- **`useEffect`**: efeitos colaterais (buscar API ao montar ou quando `id` muda; cleanup com `abort`).
- **`useNavigation`**: `navigate`, `replace`, `reset`, `goBack`.
- **`useRoute`**: ler `params` (ex.: `id` no detalhe).
- **`useFocusEffect`**: atualizar dados ao focar a tela (favoritos / último visto na listagem).

### Tipagem de rotas (`RootStackParamList`)

- Define nomes das telas e tipos dos parâmetros (ex.: `PokemonDetail: { id: number }`).
- Usar com `NativeStackNavigationProp` e `RouteProp` para TypeScript seguro.

---

## Próximos passos (ideias)

- Sessão de login persistida (manter usuário logado após fechar o app) com o mesmo padrão de storage.
- Otimizar listagem (cache, menos requisições paralelas, fila de fetch).
- Testes e tratamento de erros de rede mais refinado.

---

## Material rápido para revisão antes da prova

1. Diferença entre **estado em memória** e **AsyncStorage**.
2. Por que **`JSON.stringify` / `JSON.parse`** no storage.
3. Fluxo **lista paginada**: `limit`, `offset`, `next`, `onEndReached`.
4. Fluxo **detalhe**: `useRoute` → `id` → `fetch` → estados loading/erro/sucesso.
5. **`AbortController`** e cleanup do `useEffect`.
6. Duas fontes de dados na listagem: **API paginada** vs **favoritos do storage**.
7. **`useFocusEffect`** para recarregar dados ao voltar para a tela.
