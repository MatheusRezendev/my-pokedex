import { StyleSheet } from 'react-native';
import type { Theme } from '../../global/themes';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 24,
      gap: 12,
      alignItems: 'center',
    },
    actionButton: {
      backgroundColor: '#16a34a',
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 999,
    },
    actionText: {
      color: '#fff',
      fontWeight: '700',
    },
    jsonBox: {
      width: '100%',
      maxHeight: 220,
      backgroundColor: 'rgba(0,0,0,0.65)',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
    jsonText: {
      color: '#fff',
      fontSize: 12,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: theme.colors.background,
    },
    text: {
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
  });
