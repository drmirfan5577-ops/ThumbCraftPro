// Powered by OnSpace.AI
import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, View, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Radius, FontSize, FontWeight } from '../../constants/theme';

interface GlowButtonProps {
  label: string;
  onPress: () => void;
  color: string;
  glowColor: string;
  textColor?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconRight?: keyof typeof MaterialIcons.glyphMap;
  variant?: 'filled' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: object;
  fullWidth?: boolean;
}

export function GlowButton({
  label,
  onPress,
  color,
  glowColor,
  textColor = '#FFFFFF',
  icon,
  iconRight,
  variant = 'filled',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}: GlowButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const sizeConfig = {
    sm: { height: 38, fontSize: FontSize.sm, iconSize: 16, px: 14 },
    md: { height: 48, fontSize: FontSize.md, iconSize: 18, px: 20 },
    lg: { height: 56, fontSize: FontSize.lg, iconSize: 22, px: 28 },
  };

  const cfg = sizeConfig[size];

  const getContainerStyle = () => {
    switch (variant) {
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 2, borderColor: color };
      case 'ghost':
        return { backgroundColor: color + '15', borderWidth: 0 };
      default:
        return { backgroundColor: color, borderWidth: 0 };
    }
  };

  const getLabelColor = () => {
    if (variant === 'outline' || variant === 'ghost') return color;
    return textColor;
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth ? { width: '100%' } : null,
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          getContainerStyle(),
          {
            height: cfg.height,
            paddingHorizontal: cfg.px,
            borderRadius: Radius.xl,
            shadowColor: glowColor,
            shadowOpacity: disabled ? 0 : 0.45,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 4 },
            elevation: disabled ? 0 : 8,
            opacity: disabled ? 0.5 : 1,
          },
          fullWidth ? { width: '100%' } : null,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getLabelColor()} size="small" />
        ) : (
          <>
            {icon ? (
              <MaterialIcons name={icon} size={cfg.iconSize} color={getLabelColor()} style={styles.iconLeft} />
            ) : null}
            <Text style={[styles.label, { fontSize: cfg.fontSize, color: getLabelColor() }]}>
              {label}
            </Text>
            {iconRight ? (
              <MaterialIcons name={iconRight} size={cfg.iconSize} color={getLabelColor()} style={styles.iconRight} />
            ) : null}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
});
