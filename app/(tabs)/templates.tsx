// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp, useTheme, useT, useLauncher } from '../../hooks/useApp';
import { AppHeader } from '../../components/layout/AppHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { GlowBadge } from '../../components/ui/GlowBadge';
import { AnimatedGlowText } from '../../components/ui/AnimatedGlowText';
import { GRADIENT_PRESETS } from '../../constants/launchers';
import { Radius, FontSize, FontWeight, Spacing, Shadow } from '../../constants/theme';

const { width: SW } = Dimensions.get('window');

const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'youtube', label: 'YouTube', icon: 'play-circle-filled' },
  { id: 'social', label: 'Social', icon: 'share' },
  { id: 'minimal', label: 'Minimal', icon: 'remove' },
  { id: 'bold', label: 'Bold', icon: 'format-bold' },
  { id: 'gradient', label: 'Gradient', icon: 'gradient' },
];

const TEMPLATES = [
  { id: 't1', name: 'Emerald Burst', category: 'youtube', bg: ['#E8FFF6', '#80FFCA'], textColor: '#006644', text: 'Epic Tutorial' },
  { id: 't2', name: 'Crimson Power', category: 'youtube', bg: ['#FFF0F3', '#FFB0C0'], textColor: '#8B0020', text: 'TOP 10 LIST' },
  { id: 't3', name: 'Sapphire Dream', category: 'social', bg: ['#EEF4FF', '#A8CCFF'], textColor: '#003399', text: 'New Post' },
  { id: 't4', name: 'Gold Rush', category: 'bold', bg: ['#FFFBE6', '#FFE566'], textColor: '#8B6000', text: 'TRENDING NOW' },
  { id: 't5', name: 'Violet Night', category: 'gradient', bg: ['#F5EDFF', '#CC99FF'], textColor: '#4B0082', text: 'Going Viral' },
  { id: 't6', name: 'Arctic Pure', category: 'minimal', bg: ['#FFFFFF', '#E0F0FF'], textColor: '#1A3A5C', text: 'Clean Design' },
  { id: 't7', name: 'Solar Blast', category: 'youtube', bg: ['#FFF8EE', '#FFCD80'], textColor: '#8B3000', text: 'WATCH THIS' },
  { id: 't8', name: 'Teal Bloom', category: 'social', bg: ['#E8FFFE', '#70E0DA'], textColor: '#00443C', text: 'Fresh Content' },
  { id: 't9', name: 'Neon Pop', category: 'bold', bg: ['#F0FFF0', '#90EE90'], textColor: '#1A4D1A', text: 'MUST SEE' },
  { id: 't10', name: 'Rose Gold', category: 'gradient', bg: ['#FFF0F5', '#FFB7C5'], textColor: '#8B0050', text: 'Lifestyle' },
  { id: 't11', name: 'Sky High', category: 'minimal', bg: ['#F0F8FF', '#87CEEB'], textColor: '#1A3A5C', text: 'Minimalist' },
  { id: 't12', name: 'Deep Ocean', category: 'youtube', bg: ['#E0F7FA', '#00BCD4'], textColor: '#006064', text: 'DEEP DIVE' },
];

export default function TemplatesScreen() {
  const theme = useTheme();
  const launcher = useLauncher();
  const t = useT();
  const router = useRouter();
  const { createNewProject, addProject, setCurrentProject } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(tmpl => tmpl.category === activeCategory);

  const cardW = (SW - Spacing.md * 2 - 12) / 2;

  const useTemplate = (template: typeof TEMPLATES[0]) => {
    const proj = createNewProject(template.name, 'YouTube', 1280, 720);
    const updated = {
      ...proj,
      bgGradient: template.bg,
      bgType: 'gradient' as const,
      textLayers: [
        {
          ...proj.textLayers[0],
          text: template.text,
          color: template.textColor,
          fontSize: 60,
          fontWeight: '900',
        },
      ],
    };
    addProject(updated);
    setCurrentProject(updated.id);
    router.push('/(tabs)/generator');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <AppHeader title={t('templates')} />

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.categoryScroll, { borderBottomColor: launcher.borderColor }]}
        contentContainerStyle={styles.categoryContent}
      >
        {TEMPLATE_CATEGORIES.map(cat => (
          <Pressable
            key={cat.id}
            onPress={() => setActiveCategory(cat.id)}
            style={[
              styles.categoryBtn,
              {
                backgroundColor: activeCategory === cat.id ? launcher.accentColor : launcher.cardBg,
                borderColor: activeCategory === cat.id ? launcher.accentColor : launcher.borderColor,
              },
            ]}
          >
            <MaterialIcons
              name={cat.icon as any}
              size={14}
              color={activeCategory === cat.id ? '#FFF' : launcher.accentColor}
            />
            <Text style={[styles.categoryText, { color: activeCategory === cat.id ? '#FFF' : launcher.accentColor }]}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        <View style={styles.gridRow}>
          {filtered.map((tmpl, index) => (
            <Pressable
              key={tmpl.id}
              onPress={() => useTemplate(tmpl)}
              style={[
                styles.templateCard,
                {
                  width: cardW,
                  backgroundColor: theme.surface,
                  borderColor: launcher.borderColor,
                  ...Shadow.sm,
                  shadowColor: launcher.accentColor,
                },
              ]}
            >
              {/* Preview */}
              <View style={[styles.templatePreview, { backgroundColor: tmpl.bg[0] }]}>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: tmpl.bg[1] + '70' }]} />
                {/* Decorative shapes */}
                <View style={[styles.deco1, { backgroundColor: tmpl.textColor + '15' }]} />
                <View style={[styles.deco2, { backgroundColor: tmpl.textColor + '10' }]} />
                <Text style={[styles.templatePreviewText, { color: tmpl.textColor }]} numberOfLines={2}>
                  {tmpl.text}
                </Text>
                <View style={[styles.useBadge, { backgroundColor: launcher.accentColor }]}>
                  <Text style={styles.useBadgeText}>USE</Text>
                </View>
              </View>
              <View style={styles.templateInfo}>
                <Text style={[styles.templateName, { color: theme.text }]} numberOfLines={1}>{tmpl.name}</Text>
                <Text style={[styles.templateCat, { color: theme.textMuted }]} numberOfLines={1}>
                  {TEMPLATE_CATEGORIES.find(c => c.id === tmpl.category)?.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Gradient gallery */}
        <View style={styles.gradientSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Gradient Library</Text>
          <View style={styles.gradientGrid}>
            {GRADIENT_PRESETS.map(g => (
              <View key={g.id} style={styles.gradientItem}>
                <View style={[styles.gradientBlock, { backgroundColor: g.colors[0] }]}>
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: g.colors[1] + '80', borderRadius: 12 }]} />
                  <Text style={styles.gradientLabel}>{g.name}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  categoryScroll: {
    flexGrow: 0,
    borderBottomWidth: 1,
  },
  categoryContent: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 8,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.round,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    includeFontPadding: false,
  },
  grid: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  templateCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  templatePreview: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: 10,
  },
  deco1: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -20,
    right: -15,
  },
  deco2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 8,
    bottom: -10,
    left: -10,
    transform: [{ rotate: '30deg' }],
  },
  templatePreviewText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.black,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    includeFontPadding: false,
    zIndex: 1,
  },
  useBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  useBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: FontWeight.black,
    includeFontPadding: false,
  },
  templateInfo: {
    padding: 10,
    gap: 2,
  },
  templateName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
  templateCat: {
    fontSize: FontSize.xs,
    includeFontPadding: false,
  },
  gradientSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: 14,
    includeFontPadding: false,
  },
  gradientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gradientItem: {
    width: '30%',
  },
  gradientBlock: {
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 6,
  },
  gradientLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    includeFontPadding: false,
  },
});
