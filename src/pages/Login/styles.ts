import { Dimensions, StyleSheet } from 'react-native';
import type { Theme } from '../../global/themes';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxTop: {
      height: Dimensions.get('window').height / 3,
      width: '100%',
      //backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxMid: {
      height: Dimensions.get('window').height / 4,
      width: '100%',
      //backgroundColor: theme.colors.surface,
      paddingHorizontal: 37,
    },
    boxBottom: {
      height: 200,
      width: '100%',
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      height: 80,
      width: 80,
    },
    textTop: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 40,
      color: theme.colors.text,
    },
    titleInput: {
      marginLeft: 5,
      color: theme.colors.textSecondary,
      marginTop: 20,
    },
    boxInput: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderRadius: 40,
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderColor: theme.colors.border,
      paddingHorizontal: 15,
    },
    textInput: {
      height: '100%',
      width: '90%',
      borderRadius: 40,
      color: theme.colors.text,
    },
    buttonEntrar: {
      width: 200,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accent,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: theme.colors.primaryDark,
    },
    buttonEntrarText: {
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    buttonEntrarDisabled: {
      opacity: 0.4,
    },
  });

