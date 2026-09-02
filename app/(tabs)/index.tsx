// Powered by OnSpace.AI
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp, useTheme, useT, useLauncher } from '../../hooks/useApp';
import { AppHeader } from '../../components/layout/AppHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { AnimatedGlowText } from '../../components/ui/AnimatedGlowText';
import { GlowBadge } from '../../components/ui/GlowBadge';
import { LauncherCard } from '../../components/feature/LauncherCard';
import { ProjectCard } from '../../components/feature/ProjectCard';
import { LAUNCHERS, LAUNCHER_ORDER, CANVAS_PRESETS } from '../../constants/launchers';
import { FontSize, FontWeight, Spacing, Radius, Shadow } from '../../constants/theme';

const { width: SW } = Dimensions.get('window');

const STATS = [
  { icon: 'photo-library', label: 'Templates', value: '120+', color: '#00C896' },
  { icon: 'palette', label: 'Gradients', value: '48', color: '#DC143C' },
  { icon: 'category', label: 'Shapes', value: '32', color: '#1A6EFF' },
  { icon: 'text-fields', label: 'Fonts', value: '18', color: '#FFB800' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const launcher = useLauncher();
  const t = useT();
  const router = useRouter();
  const { projects, deleteProject, setActiveLauncher, activeLauncher, createNewProject, addProject, setCurrentProject } = useApp();

  const heroAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(heroAnim, { toValue: 1, duration: 900, useNativeDriver: true }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const heroTranslate = heroAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });
  const floatTranslate = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  const handleCreateNew = (presetId: string) => {
    const preset = CANVAS_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    const proj = createNewProject('Untitled Thumbnail', preset.label, preset.width, preset.height);
    addProject(proj);
    setCurrentProject(proj.id);
    router.push('/generator');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: launcher.primaryGradient[0] }]}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: launcher.primaryGradient[1] + '70' }]} />
          {/* Decorative blobs */}
          <Animated.View
            style={[
              styles.heroBlob1,
              {
                backgroundColor: launcher.accentColor + '30',
                transform: [{ translateY: floatTranslate }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.heroBlob2,
              {
                backgroundColor: launcher.accentColor + '18',
                transform: [{ translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }) }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: heroAnim,
                transform: [{ translateY: heroTranslate }],
              },
            ]}
          >
            <GlowBadge
              text="✦  Professional Grade"
              color={launcher.accentColor}
              glowColor={launcher.glowColor}
              pulse
              style={{ marginBottom: 16, alignSelf: 'center' }}
            />
            <AnimatedGlowText
              text={t('appName')}
              color={launcher.textColor}
              glowColor={launcher.glowColor}
              fontSize={34}
              fontWeight={FontWeight.black}
              textAlign="center"
              animationType="breathe"
              style={{ marginBottom: 6 }}
            />
            <Text style={[styles.heroSub, { color: launcher.accentColor + 'CC' }]}>
              {t('appTagline')}
            </Text>

            <Animated.View style={{ transform: [{ scale: pulseAnim }], marginTop: 22 }}>
              <GlowButton
                label={t('createThumbnail')}
                onPress={() => handleCreateNew('youtube')}
                color={launcher.accentColor}
                glowColor={launcher.glowColor}
                icon="add"
                size="lg"
                style={{ alignSelf: 'center' }}
              />
            </Animated.View>
          </Animated.View>

          {/* Hero image */}
          <Image
            source={require('../../assets/images/hero-banner.png')}
            style={styles.heroImage}
            contentFit="cover"
            transition={400}
          />
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map(stat => (
            <GlassCard key={stat.label} style={styles.statCard} noPadding>
              <View style={styles.statInner}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                  <MaterialIcons name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>{stat.label}</Text>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Quick Create */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Create</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.presetRow}>
              {CANVAS_PRESETS.filter(p => p.id !== 'custom').map(preset => (
                <Pressable
                  key={preset.id}
                  onPress={() => handleCreateNew(preset.id)}
                  style={[
                    styles.presetCard,
                    {
                      backgroundColor: launcher.cardBg,
                      borderColor: launcher.borderColor,
                      ...Shadow.sm,
                      shadowColor: launcher.accentColor,
                    },
                  ]}
                >
                  <View style={[styles.presetIcon, { backgroundColor: launcher.accentColor + '15' }]}>
                    <MaterialIcons name={preset.icon as any} size={22} color={launcher.accentColor} />
                  </View>
                  <Text style={[styles.presetLabel, { color: theme.text }]} numberOfLines={1}>
                    {preset.label}
                  </Text>
                  <Text style={[styles.presetSize, { color: theme.textMuted }]}>
                    {preset.width}×{preset.height}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Launcher Switcher */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Launcher Themes</Text>
            <GlowBadge
              text={`${LAUNCHER_ORDER.length} Themes`}
              color={launcher.accentColor}
              glowColor={launcher.glowColor}
              size="sm"
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -Spacing.md }}>
            <View style={[styles.launcherRow, { paddingHorizontal: Spacing.md }]}>
              {LAUNCHER_ORDER.map(id => (
                <LauncherCard
                  key={id}
                  launcher={LAUNCHERS[id]}
                  isActive={activeLauncher === id}
                  onSelect={(lid) => setActiveLauncher(lid as any)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recent Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('recentProjects')}</Text>
            {projects.length > 0 ? (
              <GlowBadge text={`${projects.length}`} color={launcher.accentColor} glowColor={launcher.glowColor} size="sm" />
            ) : null}
          </View>

          {projects.length === 0 ? (
            <GlassCard variant="launcher" style={styles.emptyCard}>
              <Image
                source={require('../../assets/images/onboarding-1.png')}
                style={styles.emptyImage}
                contentFit="cover"
                transition={300}
              />
              <MaterialIcons name="photo-size-select-large" size={40} color={launcher.accentColor + '60'} />
              <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>{t('noProjects')}</Text>
              <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>{t('startCreating')}</Text>
              <GlowButton
                label={t('createThumbnail')}
                onPress={() => handleCreateNew('youtube')}
                color={launcher.accentColor}
                glowColor={launcher.glowColor}
                icon="add"
                style={{ marginTop: 16 }}
              />
            </GlassCard>
          ) : (
            <View>
              {projects.slice(0, 4).map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => {
                    setCurrentProject(project.id);
                    router.push('/generator');
                  }}
                  onDelete={() => deleteProject(project.id)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Feature highlights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Why ThumbCraft Pro</Text>
          <View style={styles.featureGrid}>
            {[
              { icon: 'gradient', title: 'Glass Gradients', desc: 'Emerald, Crimson & more', color: '#00C896' },
              { icon: 'layers', title: 'Multi-Layer', desc: 'Unlimited text & shapes', color: '#DC143C' },
              { icon: 'auto-awesome', title: 'Live Effects', desc: 'Glow, shadow, blur', color: '#1A6EFF' },
              { icon: 'translate', title: 'Multi-Language', desc: 'EN · UR · AR support', color: '#FFB800' },
              { icon: 'admin-panel-settings', title: 'Admin Panel', desc: 'Full control center', color: '#8B2BE2' },
              { icon: 'save', title: 'Auto Save', desc: 'Never lose your work', color: '#00897B' },
            ].map(f => (
              <GlassCard key={f.title} style={styles.featureCard} noPadding>
                <View style={styles.featureInner}>
                  <View style={[styles.featureIcon, { backgroundColor: f.color + '15' }]}>
                    <MaterialIcons name={f.icon as any} size={22} color={f.color} />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.text }]}>{f.title}</Text>
                  <Text style={[styles.featureDesc, { color: theme.textMuted }]}>{f.desc}</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: {
    minHeight: 260,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  heroBlob1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -60,
    right: -40,
  },
  heroBlob2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    bottom: 20,
    left: -30,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
  },
  heroContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
    zIndex: 2,
  },
  heroSub: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
    includeFontPadding: false,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statInner: {
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.black,
    includeFontPadding: false,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
    includeFontPadding: false,
  },
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
    marginBottom: 14,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: Spacing.md,
  },
  presetCard: {
    width: 110,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  presetIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    includeFontPadding: false,
  },
  presetSize: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    includeFontPadding: false,
  },
  launcherRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: 8,
    overflow: 'hidden',
  },
  emptyImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.06,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    textAlign: 'center',
    includeFontPadding: false,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: (SW - Spacing.md * 2 - 12) / 2,
  },
  featureInner: {
    padding: 16,
    gap: 6,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
  featureDesc: {
    fontSize: FontSize.sm,
    includeFontPadding: false,
  },
});
