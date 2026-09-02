// Powered by OnSpace.AI
import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { FontWeight } from '../../constants/theme';

interface AnimatedGlowTextProps {
  text: string;
  color: string;
  glowColor: string;
  fontSize?: number;
  fontWeight?: string;
  style?: object;
  animationType?: 'pulse' | 'shimmer' | 'breathe';
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export function AnimatedGlowText({
  text,
  color,
  glowColor,
  fontSize = 24,
  fontWeight = FontWeight.bold,
  style,
  animationType = 'pulse',
  letterSpacing = 0.5,
  textAlign = 'left',
}: AnimatedGlowTextProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = animationType === 'shimmer' ? 1200 : 2000;
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true }),
      ])
    ).start();
  }, [animationType]);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  const scale = animationType === 'breathe'
    ? anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] })
    : 1;

  return (
    <Animated.Text
      style={[
        styles.text,
        {
          color,
          fontSize,
          fontWeight: fontWeight as any,
          letterSpacing,
          textAlign,
          opacity,
          transform: [{ scale: scale as any }],
          textShadowColor: glowColor,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 12,
        },
        style,
      ]}
    >
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
  },
});
