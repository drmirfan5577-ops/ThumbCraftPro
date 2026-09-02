// Powered by OnSpace.AI
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, useLauncher } from '../../hooks/useApp';
import { type ThumbnailProject } from '../../contexts/AppContext';
import { Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';

interface ProjectCardProps {
  project: ThumbnailProject;
  onOpen: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, onOpen, onDelete }: ProjectCardProps) {
  const theme = useTheme();
  const launcher = useLauncher();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const timeAgo = () => {
    const diff = Date.now() - project.updatedAt;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onOpen}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: launcher.borderColor,
            ...Shadow.md,
            shadowColor: launcher.accentColor,
            shadowOpacity: 0.10,
          },
        ]}
      >
        {/* Preview area */}
        <View
          style={[
            styles.preview,
            {
              backgroundColor: project.bgGradient ? project.bgGradient[0] : project.bgColor,
            },
          ]}
        >
          {project.bgGradient ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: project.bgGradient[1] + '60' }]} />
          ) : null}
          {project.textLayers.slice(0, 1).map(l => (
            <Text
              key={l.id}
              style={[styles.previewText, { color: l.color }]}
              numberOfLines={2}
            >
              {l.text}
            </Text>
          ))}
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>{project.preset}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.infoLeft}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{project.name}</Text>
            <Text style={[styles.meta, { color: theme.textMuted }]}>
              {project.width}×{project.height} · {timeAgo()}
            </Text>
          </View>
          <Pressable
            onPress={onDelete}
            hitSlop={8}
            style={[styles.deleteBtn, { backgroundColor: theme.crimsonGlass }]}
          >
            <MaterialIcons name="delete-outline" size={16} color={theme.crimson} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 14,
  },
  preview: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  previewText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    includeFontPadding: false,
  },
  previewBadge: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  previewBadgeText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  infoLeft: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: 2,
    includeFontPadding: false,
  },
  meta: {
    fontSize: FontSize.xs,
    includeFontPadding: false,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
