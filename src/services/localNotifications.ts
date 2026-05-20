import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Comportamento de exibição quando o app está aberto
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Android 8+ precisa de canal para exibir notificação corretamente
export async function configureAndroidChannel() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FFCB05',
  });
}

export async function requestNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();

  if (current.status !== 'granted') {
    const asked = await Notifications.requestPermissionsAsync();
    return asked.status === 'granted';
  }

  return true;
}

// Notificação imediata para demo ao favoritar
export async function notifyPokemonFavorited(pokemonName: string) {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Novo favorito!',
      body: `${pokemonName} foi adicionado aos favoritos.`,
      sound: true,
    },
    trigger: null,
  });
}

// Lembrete rápido (ex.: 10 segundos) para demo em sala
export async function scheduleQuickReminder(seconds = 10) {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Volte para a Pokédex',
      body: 'Tem Pokémon esperando por você!',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    },
  });
}

// Lembrete diário (opcional para produção)
export async function scheduleDailyReminder(hour = 20, minute = 0) {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora da Pokédex',
      body: 'Veja seus favoritos e descubra novos Pokémon.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}