import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './src/pages/Login';
import PokemonListScreen from './src/pages/PokemonList';
import PokemonDetailScreen from './src/pages/PokemonDetail';
import AppNavigator from './src/routes';
import { NavigationContainer } from '@react-navigation/native';
import { initDatabase } from './src/database/init';
import { seedUser } from './src/database/seedUser';

initDatabase();
seedUser();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
