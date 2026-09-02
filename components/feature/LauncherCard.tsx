// Powered by OnSpace.AI
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { type LauncherConfig } from '../../constants/launchers';
import { Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';
import { useTheme } from '../../hooks/useApp';

interface LauncherCardProps {
  launcher: LauncherConfig;
  isActive: boolean;
  onSelect: (id: string) => void;
  compact?: boolean;
}

export function LauncherCard({ launcher, isActive, onSelect, compact = false }: LauncherCardProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={() => onSelect(launcher.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: isActive ? launcher.cardBg : theme.surface,
            borderColor: isActive ? launcher.accentColor + '80' : launcher.borderColor,
            borderWidth: isActive ? 2 : 1,
            shadowColor: launcher.accentColor,
            shadowOpacity: isActive ? 0.30 : 0.08,
            ...(isActive ? Shadow.md : Shadow.sm),
          },
          compact ? styles.compactCard : null,
        ]}
      >
        {/* Gradient swatches */}
        <View style={styles.swatchRow}>
          {launcher.primaryGradient.slice(0, 3).map((color, i) => (
            <View
              key={i}
              style={[styles.swatch, { backgroundColor: color }]}
            />
          ))}
        </View>

        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: launcher.accentColor + '18',
              borderColor: launcher.accentColor + '40',
              shadowColor: launcher.glowColor,
              shadowOpacity: 0.6,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 0 },
              elevation: 6,
            },
          ]}
        >
          <MaterialIcons name={launcher.icon as any} size={compact ? 20 : 26} color={launcher.accentColor} />
        </View>

        {!compact ? (
          <>
            <Text style={[styles.name, { color: launcher.textColor }]} numberOfLines={1}>
              {launcher.name}
            </Text>
            <Text style={[styles.tagline, { color: launcher.accentColor + 'AA' }]} numberOfLines={1}>
              {launcher.tagline}
            </Text>
          </>
        ) : null}

        {isActive ? (
          <View style={[styles.activeBadge, { backgroundColor: launcher.accentColor }]}>
            <MaterialIcons name="check" size={12} color="#FFF" />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: 14,
    width: 150,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  compactCard: {
    width: 80,
    padding: 10,
  },
  swatchRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 4,
    alignSelf: 'stretch',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  swatch: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    marginBottom: 2,
    includeFontPadding: false,
  },
  tagline: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    includeFontPadding: false,
  },
  activeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
