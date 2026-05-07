import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { savePokemonPhoto } from '../../services/pokemonPhotoMemory';

export default function PokemonCameraScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'PokemonCamera'>>();
  const { id } = route.params;

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Carregando permissoes...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Precisamos da permissao da camera.</Text>
        <TouchableOpacity style={styles.actionButton} onPress={requestPermission}>
          <Text style={styles.actionText}>Permitir camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleTakePhoto() {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.7,
      skipProcessing: true,
    });

    if (photo?.uri) {
      savePokemonPhoto(id, photo.uri);
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
          <Text style={styles.actionText}>Tirar foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
