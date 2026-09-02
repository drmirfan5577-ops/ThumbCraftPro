// Powered by OnSpace.AI
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp, useTheme, useT, useLauncher } from '../hooks/useApp';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { AnimatedGlowText } from '../components/ui/AnimatedGlowText';
import { GlowBadge } from '../components/ui/GlowBadge';
import { LauncherCard } from '../components/feature/LauncherCard';
import { LAUNCHERS, LAUNCHER_ORDER } from '../constants/launchers';
import { LanguageMeta, type Language } from '../constants/languages';
import { Radius, FontSize, FontWeight, Spacing, Shadow } from '../constants/theme';

type AdminSection = 'overview' | 'theme' | 'language' | 'launchers' | 'canvas' | 'export' | 'app';

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const launcher = useLauncher();
  const t = useT();
  const router = useRouter();
  const {
    adminLoggedIn, adminLogin, adminLogout,
    colorScheme, toggleColorScheme,
    language, setLanguage,
    activeLauncher, setActiveLauncher,
    adminSettings, updateAdminSettings,
    projects, saveAll,
  } = useApp();

  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [saving, setSaving] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleLogin = () => {
    const success = adminLogin(password);
    if (!success) {
      setPwError(true);
      setPassword('');
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      setTimeout(() => setPwError(false), 2000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await saveAll();
    setTimeout(() => setSaving(false), 800);
  };

  const SECTIONS = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'theme', label: 'Theme', icon: 'palette' },
    { id: 'language', label: 'Language', icon: 'translate' },
    { id: 'launchers', label: 'Launchers', icon: 'grid-view' },
    { id: 'canvas', label: 'Canvas', icon: 'crop-landscape' },
    { id: 'export', label: 'Export', icon: 'file-download' },
    { id: 'app', label: 'App Config', icon: 'settings' },
  ] as const;

  if (!adminLoggedIn) {
    return (
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.loginContainer, { paddingTop: insets.top + 20 }]}>
          {/* Header */}
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: launcher.cardBg, borderColor: launcher.borderColor }]}
          >
            <MaterialIcons name="close" size={20} color={launcher.accentColor} />
          </Pressable>

          {/* Lock animation */}
          <Animated.View style={[styles.lockContainer, { opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }]}>
            <View style={[styles.lockIcon, {
              backgroundColor: launcher.accentColor + '15',
              borderColor: launcher.borderColor,
              shadowColor: launcher.glowColor,
              shadowOpacity: 0.50,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 0 },
              elevation: 10,
            }]}>
              <MaterialIcons name="lock" size={44} color={launcher.accentColor} />
            </View>
          </Animated.View>

          <AnimatedGlowText
            text={t('adminPanel')}
            color={launcher.textColor}
            glowColor={launcher.glowColor}
            fontSize={30}
            fontWeight={FontWeight.black}
            textAlign="center"
            animationType="pulse"
            style={{ marginBottom: 8 }}
          />
          <Text style={[styles.loginSubtitle, { color: launcher.accentColor + 'BB' }]}>
            Password protected access
          </Text>

          <Animated.View style={[styles.loginCard, { transform: [{ translateX: shakeAnim }] }]}>
            <GlassCard variant="launcher" elevated style={styles.loginCardInner}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('enterPassword')}</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="••••••"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="number-pad"
                  onSubmitEditing={handleLogin}
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: theme.surfaceElevated,
                      color: theme.text,
                      borderColor: pwError ? theme.crimson : launcher.borderColor,
                      borderWidth: pwError ? 2 : 1,
                    },
                  ]}
                />
              </View>
              {pwError ? (
                <View style={styles.errorRow}>
                  <MaterialIcons name="error" size={14} color={theme.error} />
                  <Text style={[styles.errorText, { color: theme.error }]}>{t('wrongPassword')}</Text>
                </View>
              ) : null}
              <GlowButton
                label={t('login')}
                onPress={handleLogin}
                color={launcher.accentColor}
                glowColor={launcher.glowColor}
                icon="lock-open"
                fullWidth
                size="lg"
                style={{ marginTop: 16 }}
              />
              <Text style={[styles.hintText, { color: theme.textMuted }]}>
                Default password: 1122
              </Text>
            </GlassCard>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Admin header */}
      <View style={[styles.adminHeader, {
        paddingTop: insets.top + 8,
        backgroundColor: launcher.accentColor + '12',
        borderBottomColor: launcher.borderColor,
      }]}>
        <View style={styles.adminHeaderRow}>
          <View style={styles.adminHeaderLeft}>
            <View style={[styles.adminBadge, { backgroundColor: launcher.accentColor }]}>
              <MaterialIcons name="admin-panel-settings" size={14} color="#FFF" />
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
            <Text style={[styles.adminTitle, { color: theme.text }]}>{t('adminWelcome')}</Text>
          </View>
          <View style={styles.adminHeaderRight}>
            <GlowButton
              label={saving ? 'Saved' : 'Save All'}
              onPress={handleSave}
              color={theme.success}
              glowColor={theme.emeraldGlow}
              icon={saving ? 'check' : 'save'}
              size="sm"
              loading={saving}
            />
            <Pressable
              onPress={() => { adminLogout(); router.back(); }}
              style={[styles.logoutBtn, { backgroundColor: theme.crimsonGlass, borderColor: theme.crimson + '30' }]}
              hitSlop={8}
            >
              <MaterialIcons name="logout" size={16} color={theme.crimson} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.adminBody}>
        {/* Sidebar */}
        <ScrollView style={[styles.sidebar, { backgroundColor: theme.surface, borderRightColor: launcher.borderColor }]} showsVerticalScrollIndicator={false}>
          {SECTIONS.map(sec => (
            <Pressable
              key={sec.id}
              onPress={() => setActiveSection(sec.id as AdminSection)}
              style={[
                styles.sidebarItem,
                {
                  backgroundColor: activeSection === sec.id ? launcher.cardBg : 'transparent',
                  borderRightWidth: activeSection === sec.id ? 3 : 0,
                  borderRightColor: launcher.accentColor,
                },
              ]}
            >
              <MaterialIcons
                name={sec.icon as any}
                size={18}
                color={activeSection === sec.id ? launcher.accentColor : theme.textMuted}
              />
              <Text style={[styles.sidebarLabel, { color: activeSection === sec.id ? launcher.accentColor : theme.textMuted }]}>
                {sec.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Main panel */}
        <ScrollView style={styles.mainPanel} showsVerticalScrollIndicator={false} contentContainerStyle={styles.mainContent}>
          {activeSection === 'overview' ? (
            <View>
              <Text style={[styles.panelTitle, { color: theme.text }]}>Dashboard Overview</Text>
              <View style={styles.statsGrid}>
                {[
                  { label: 'Total Projects', value: String(projects.length), icon: 'photo-library', color: launcher.accentColor },
                  { label: 'Active Launcher', value: LAUNCHERS[activeLauncher].name, icon: 'grid-view', color: '#DC143C' },
                  { label: 'Language', value: LanguageMeta[language].label, icon: 'translate', color: '#1A6EFF' },
                  { label: 'Mode', value: colorScheme === 'dark' ? 'Dark' : 'Light', icon: 'brightness-6', color: '#FFB800' },
                ].map(stat => (
                  <GlassCard key={stat.label} variant="launcher" style={styles.statItem}>
                    <View style={[styles.statItemIcon, { backgroundColor: stat.color + '15' }]}>
                      <MaterialIcons name={stat.icon as any} size={20} color={stat.color} />
                    </View>
                    <Text style={[styles.statItemValue, { color: stat.color }]}>{stat.value}</Text>
                    <Text style={[styles.statItemLabel, { color: theme.textMuted }]}>{stat.label}</Text>
                  </GlassCard>
                ))}
              </View>

              <GlassCard variant="emerald" style={styles.adminInfoCard}>
                <View style={styles.adminInfoRow}>
                  <MaterialIcons name="verified-user" size={20} color={theme.success} />
                  <Text style={[styles.adminInfoText, { color: theme.text }]}>
                    You have full administrative control over all app sections.
                  </Text>
                </View>
              </GlassCard>
            </View>
          ) : null}

          {activeSection === 'theme' ? (
            <View>
              <Text style={[styles.panelTitle, { color: theme.text }]}>Theme Settings</Text>
              <GlassCard variant="launcher" style={styles.settingBlock}>
                <Text style={[styles.settingBlockTitle, { color: theme.textSecondary }]}>Color Mode</Text>
                <View style={styles.modeRow}>
                  {(['light', 'dark'] as const).map(mode => (
                    <Pressable
                      key={mode}
                      onPress={() => colorScheme !== mode && toggleColorScheme()}
                      style={[
                        styles.modeBtn,
                        {
                          backgroundColor: colorScheme === mode ? launcher.accentColor + '18' : theme.surfaceElevated,
                          borderColor: colorScheme === mode ? launcher.accentColor : theme.border,
                          borderWidth: colorScheme === mode ? 2 : 1,
                        },
                      ]}
                    >
                      <MaterialIcons
                        name={mode === 'dark' ? 'dark-mode' : 'light-mode'}
                        size={22}
                        color={colorScheme === mode ? launcher.accentColor : theme.textMuted}
                      />
                      <Text style={[styles.modeBtnText, { color: colorScheme === mode ? launcher.accentColor : theme.textMuted }]}>
                        {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </GlassCard>
            </View>
          ) : null}

          {activeSection === 'language' ? (
            <View>
              <Text style={[styles.panelTitle, { color: theme.text }]}>Language & Direction</Text>
              {(['en', 'ur', 'ar'] as Language[]).map(lang => (
                <Pressable
                  key={lang}
                  onPress={() => setLanguage(lang)}
                  style={[
                    styles.langRow,
                    {
                      backgroundColor: language === lang ? launcher.cardBg : theme.surface,
                      borderColor: language === lang ? launcher.accentColor + '60' : launcher.borderColor,
                      borderWidth: language === lang ? 2 : 1,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 28 }}>
                    {lang === 'en' ? '🇺🇸' : lang === 'ur' ? '🇵🇰' : '🇸🇦'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.langName, { color: theme.text }]}>{LanguageMeta[lang].label}</Text>
                    <Text style={[styles.langNative, { color: theme.textMuted }]}>
                      {LanguageMeta[lang].nativeLabel} · {LanguageMeta[lang].direction.toUpperCase()}
                    </Text>
                  </View>
                  {language === lang ? (
                    <MaterialIcons name="check-circle" size={22} color={launcher.accentColor} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}

          {activeSection === 'launchers' ? (
            <View>
              <Text style={[styles.panelTitle, { color: theme.text }]}>Launcher Themes</Text>
              <Text style={[styles.panelSubtitle, { color: theme.textMuted }]}>
                Select and customize the active launcher theme
              </Text>
              <View style={styles.launcherGrid}>
                {LAUNCHER_ORDER.map(id => (
                  <View key={id} style={styles.launcherGridItem}>
                    <LauncherCard
                      launcher={LAUNCHERS[id]}
                      isActive={activeLauncher === id}
                      onSelect={(lid) => setActiveLauncher(lid as any)}
                    />
                    <View style={styles.launcherEnabled}>
                      <Text style={[styles.launcherEnabledText, { color: theme.textMuted }]}>
                        {adminSettings.launcherEnabled[id] ? 'Enabled' : 'Disabled'}
                      </Text>
                      <Switch
                        value={adminSettings.launcherEnabled[id]}
                        onValueChange={(v) => updateAdminSettings({
                          launcherEnabled: { ...adminSettings.launcherEnabled, [id]: v },
                        })}
                        trackColor={{ false: theme.border, true: launcher.accentColor + '60' }}
                        thumbColor={adminSettings.launcherEnabled[id] ? launcher.accentColor : '#FFF'}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {activeSection === 'canvas' ? (
            <View>
              <Text style={[styles.panelTitle, { color: theme.text }]}>Canvas Defaults</Text>
              {[
                { label: 'Default Width (px)', key: 'canvasDefaultWidth', value: adminSettings.canvasDefaultWidth },
                { label: 'Default Height (px)', key: 'canvasDefaultHeight', value: adminSettings.canvasDefaultHeight },
              ].map(field => (
                <GlassCard key={field.key} variant="launcher" style={styles.settingBlock}>
                  <Text style={[styles.settingBlockTitle, { color: theme.textSecondary }]}>{field.label}</Text>
                  <TextInput
                    value={String(field.value)}
                    onChangeText={v => updateAdminSettings({ [field.key]: parseInt(v) || field.value })}
                    keyboardType="numeric"
                    style={[styles.adminInput, {
                      backgroundColor: theme.surfaceElevated,
                      color: theme.text,
                      borderColor: launcher.borderColor,
                    }]}
                  />
                </GlassCard>
              ))}
            </View>
          ) : null}

          {activeSection === 'export' ? (
            <View>
              <Text style={[styles.panelTitle, { color: theme.text }]}>Export Settings</Text>
              <GlassCard variant="launcher" style={styles.settingBlock}>
                <Text style={[styles.settingBlockTitle, { color: theme.textSecondary }]}>Export Format</Text>
                <View style={styles.formatRow}>
                  {(['PNG', 'JPG', 'WEBP'] as const).map(fmt => (
                    <Pressable
                      key={fmt}
                      onPress={() => updateAdminSettings({ exportFormat: fmt })}
                      style={[styles.formatBtn, {
                        backgroundColor: adminSettings.exportFormat === fmt ? launcher.accentColor + '18' : theme.surfaceElevated,
                        borderColor: adminSettings.exportFormat === fmt ? launcher.accentColor : theme.border,
                        borderWidth: adminSettings.exportFormat === fmt ? 2 : 1,
                      }]}
                    >
                      <Text style={[styles.formatBtnText, { color: adminSettings.exportFormat === fmt ? launcher.accentColor : theme.textSecondary }]}>
                        {fmt}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </GlassCard>

              <GlassCard variant="launcher" style={styles.settingBlock}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.settingBlockTitle, { color: theme.textSecondary }]}>Watermark</Text>
                  <Switch
                    value={adminSettings.watermarkEnabled}
                    onValueChange={v => updateAdminSettings({ watermarkEnabled: v })}
                    trackColor={{ false: theme.border, true: launcher.accentColor + '60' }}
                    thumbColor={adminSettings.watermarkEnabled ? launcher.accentColor : '#FFF'}
                  />
                </View>
                {adminSettings.watermarkEnabled ? (
                  <TextInput
                    value={adminSettings.watermarkText}
                    onChangeText={v => updateAdminSettings({ watermarkText: v })}
                    style={[styles.adminInput, {
                      backgroundColor: theme.surfaceElevated,
                      color: theme.text,
                      borderColor: launcher.borderColor,
                      marginTop: 10,
                    }]}
                    placeholder="Watermark text..."
                    placeholderTextColor={theme.textMuted}
                  />
                ) : null}
              </GlassCard>
            </View>
          ) : null}

          {activeSection === 'app' ? (
            <View>
              <Text style={[styles.panelTitle, { color: theme.text }]}>App Configuration</Text>
              <GlassCard variant="crimson" style={styles.dangerCard}>
                <View style={styles.adminInfoRow}>
                  <MaterialIcons name="warning" size={18} color={theme.error} />
                  <Text style={[styles.adminInfoText, { color: theme.error }]}>
                    Changes here affect the entire application behavior.
                  </Text>
                </View>
              </GlassCard>
              <GlassCard variant="launcher" style={styles.settingBlock}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.settingBlockTitle, { color: theme.textSecondary }]}>App Logo Display</Text>
                  <Switch
                    value={adminSettings.appLogoEnabled}
                    onValueChange={v => updateAdminSettings({ appLogoEnabled: v })}
                    trackColor={{ false: theme.border, true: launcher.accentColor + '60' }}
                    thumbColor={adminSettings.appLogoEnabled ? launcher.accentColor : '#FFF'}
                  />
                </View>
              </GlassCard>
              <GlowButton
                label="Save All App Settings"
                onPress={handleSave}
                color={launcher.accentColor}
                glowColor={launcher.glowColor}
                icon="save"
                fullWidth
                size="lg"
                style={{ marginTop: 16 }}
                loading={saving}
              />
            </View>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Login
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContainer: {
    marginBottom: 24,
  },
  lockIcon: {
    width: 96,
    height: 96,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginSubtitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
    marginBottom: 32,
    includeFontPadding: false,
  },
  loginCard: { width: '100%', maxWidth: 380 },
  loginCardInner: { gap: 4 },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 8,
    includeFontPadding: false,
  },
  inputRow: {},
  passwordInput: {
    borderRadius: Radius.lg,
    padding: 16,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    letterSpacing: 8,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  errorText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    includeFontPadding: false,
  },
  hintText: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginTop: 10,
    includeFontPadding: false,
  },

  // Admin panel
  adminHeader: {
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingBottom: 12,
  },
  adminHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  adminHeaderLeft: {
    gap: 4,
  },
  adminHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    color: '#FFF',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.black,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  adminTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  adminBody: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 110,
    borderRightWidth: 1,
  },
  sidebarItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 4,
  },
  sidebarLabel: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
    includeFontPadding: false,
  },
  mainPanel: { flex: 1 },
  mainContent: {
    padding: Spacing.md,
    paddingBottom: 60,
  },
  panelTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    marginBottom: 6,
    includeFontPadding: false,
  },
  panelSubtitle: {
    fontSize: FontSize.sm,
    marginBottom: 16,
    includeFontPadding: false,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statItem: {
    width: '47%',
    alignItems: 'center',
    gap: 6,
  },
  statItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItemValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.black,
    textAlign: 'center',
    includeFontPadding: false,
  },
  statItemLabel: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    includeFontPadding: false,
  },
  adminInfoCard: {
    marginTop: 4,
  },
  adminInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  adminInfoText: {
    flex: 1,
    fontSize: FontSize.sm,
    lineHeight: 20,
    includeFontPadding: false,
  },
  settingBlock: {
    marginBottom: 12,
  },
  settingBlockTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    includeFontPadding: false,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: Radius.lg,
  },
  modeBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    includeFontPadding: false,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    marginBottom: 10,
  },
  langName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
  langNative: {
    fontSize: FontSize.sm,
    includeFontPadding: false,
  },
  launcherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  launcherGridItem: {
    alignItems: 'center',
    gap: 6,
  },
  launcherEnabled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  launcherEnabledText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    includeFontPadding: false,
  },
  adminInput: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 12,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  formatRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formatBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: Radius.lg,
  },
  formatBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dangerCard: {
    marginBottom: 12,
  },
});
