// Powered by OnSpace.AI
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, useLauncher } from '../../hooks/useApp';
import { Radius, Shadow } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'emerald' | 'crimson' | 'gold' | 'sapphire' | 'violet' | 'launcher';
  elevated?: boolean;
  noPadding?: boolean;
}

export function GlassCard({ children, style, variant = 'default', elevated = false, noPadding = false }: GlassCardProps) {
  const theme = useTheme();
  const launcher = useLauncher();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'emerald':
        return {
          backgroundColor: theme.emeraldGlass,
          borderColor: theme.emerald + '40',
          shadowColor: theme.emerald,
        };
      case 'crimson':
        return {
          backgroundColor: theme.crimsonGlass,
          borderColor: theme.crimson + '40',
          shadowColor: theme.crimson,
        };
      case 'gold':
        return {
          backgroundColor: theme.goldGlass,
          borderColor: theme.gold + '40',
          shadowColor: theme.gold,
        };
      case 'sapphire':
        return {
          backgroundColor: theme.sapphireGlass,
          borderColor: theme.sapphire + '40',
          shadowColor: theme.sapphire,
        };
      case 'violet':
        return {
          backgroundColor: theme.violetGlass,
          borderColor: theme.violet + '40',
          shadowColor: theme.violet,
        };
      case 'launcher':
        return {
          backgroundColor: launcher.cardBg,
          borderColor: launcher.borderColor,
          shadowColor: launcher.accentColor,
        };
      default:
        return {
          backgroundColor: theme.surfaceGlass,
          borderColor: theme.border,
          shadowColor: theme.shadowColor,
        };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
          shadowColor: variantStyle.shadowColor,
          shadowOpacity: elevated ? 0.22 : 0.10,
          ...(elevated ? Shadow.lg : Shadow.sm),
        },
        noPadding ? styles.noPadding : styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padding: {
    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
});
