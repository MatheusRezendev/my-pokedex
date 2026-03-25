import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes';
import { fetchPokemonListPage, type PokemonListItemUI } from '../../services/pokeapi';

const PAGE_SIZE = 10;

export default function PokemonListScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PokemonList'>>();

  const [items, setItems] = useState<PokemonListItemUI[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const[error, setError] = useState<string | null>(null);

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
    if (isLoadingMore || isInitialLoading || isRefreshing || !hasNextPage) return;
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

  useEffect(() => {
    loadInitial();
 }, []);


  function handleLogout() {
    // Integração de autenticação será adicionada futuramente
    console.log('Logout action', {});
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderItem = ({ item }: { item: PokemonListItemUI }) => (
    <TouchableOpacity 
    style={styles.card} 
    activeOpacity={0.8} 
    onPress={() => navigation.navigate('PokemonDetail', { pokemonId: item.id })}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardName}>{item.name}</Text>
        {/* <View style={styles.typeContainer}>
          {item.types.map((type) => (
            <View key={type} style={styles.typeBadge}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View> */}
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
    </TouchableOpacity>
  );

  if (isInitialLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.text }}>Carregando lista ...</Text>
      </View>
    );
  }
  if (error && items.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text, marginBottom: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.boxBottom}>
        <Text style={styles.headerTitle}>Pokédex</Text>
          <TouchableOpacity style={styles.buttonSair} onPress={() => handleLogout()}>
            <Text style={styles.buttonSairText}>Sair</Text>
          </TouchableOpacity>
        </View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onRefresh={refreshList}
        refreshing={isRefreshing}
        ListFooterComponent={
          isLoadingMore? (
            <View style={{paddingVertical:16}}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ): null
        }
      />
    </View>
  );
};

