// Powered by OnSpace.AI
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FontSize, FontWeight, Radius } from '../../constants/theme';

interface GlowBadgeProps {
  text: string;
  color: string;
  glowColor: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  style?: object;
}

export function GlowBadge({ text, color, glowColor, size = 'md', pulse = true, style }: GlowBadgeProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!pulse) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const glowOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.85] });

  const sizeStyles = {
    sm: { paddingHorizontal: 8, paddingVertical: 3, fontSize: FontSize.xs },
    md: { paddingHorizontal: 12, paddingVertical: 5, fontSize: FontSize.sm },
    lg: { paddingHorizontal: 16, paddingVertical: 7, fontSize: FontSize.md },
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: glowColor,
            opacity: glowOpacity,
            shadowColor: glowColor,
          },
        ]}
      />
      <View
        style={[
          styles.badge,
          {
            backgroundColor: color + '22',
            borderColor: color + '60',
            paddingHorizontal: sizeStyles[size].paddingHorizontal,
            paddingVertical: sizeStyles[size].paddingVertical,
          },
        ]}
      >
        <Text style={[styles.text, { color, fontSize: sizeStyles[size].fontSize }]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.round,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 8,
  },
  badge: {
    borderRadius: Radius.round,
    borderWidth: 1,
  },
  text: {
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
});
