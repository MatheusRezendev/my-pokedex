import { StyleSheet } from 'react-native';
import type { Theme } from '../../global/themes';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 32,
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
    },
    name: {
      fontSize: 30,
      fontWeight: 'bold',
      textTransform: 'capitalize',
      color: theme.colors.text,
    },
    id: {
      fontSize: 18,
      color: theme.colors.muted,
    },
    typeContainer: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    typeBadge: {
      backgroundColor: theme.colors.accent,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    typeText: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'capitalize',
      color: theme.colors.text,
    },
    image: {
      width: 160,
      height: 160,
      marginTop: 16,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 8,
      color: theme.colors.text,
    },
    sectionText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    statName: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    statValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    capturedPhoto: {
      width: '100%',
      bottom: 15,
      height: 220,
      borderRadius: 16,
      marginTop: 16,
      resizeMode: 'cover',
    },
  });

