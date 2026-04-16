import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../pages/Login';
import PokemonListScreen from '../pages/PokemonList';
import PokemonDetailScreen from '../pages/PokemonDetail';
import PokemonCameraScreen from '../pages/PokemonCamera';

export type RootStackParamList = {
  Login: undefined;
  PokemonList: undefined;
  PokemonDetail: { pokemonId: number };
  PokemonCamera: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
    initialRouteName='Login'
    screenOptions={{headerShown: false}}
    >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PokemonList" component={PokemonListScreen} />
        <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} />
        <Stack.Screen name="PokemonCamera" component={PokemonCameraScreen} />
    </Stack.Navigator>
  );
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="PokemonList" component={PokemonListScreen}/>
        </Stack.Navigator>
    )
}