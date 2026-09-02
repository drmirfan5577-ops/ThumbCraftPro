// Powered by OnSpace.AI
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp, useTheme, useT, useLauncher } from '../../hooks/useApp';
import { AppHeader } from '../../components/layout/AppHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { GlowBadge } from '../../components/ui/GlowBadge';
import { LauncherCard } from '../../components/feature/LauncherCard';
import { LAUNCHERS, LAUNCHER_ORDER } from '../../constants/launchers';
import { LanguageMeta, type Language } from '../../constants/languages';
import { Radius, FontSize, FontWeight, Spacing, Shadow } from '../../constants/theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const launcher = useLauncher();
  const t = useT();
  const router = useRouter();
  const {
    colorScheme, toggleColorScheme,
    language, setLanguage,
    activeLauncher, setActiveLauncher,
    autoSaveEnabled,
  } = useApp();

  const SettingRow = ({
    icon,
    label,
    value,
    onPress,
    badge,
    right,
    iconColor,
  }: {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
    badge?: string;
    right?: React.ReactNode;
    iconColor?: string;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.settingRow,
        {
          backgroundColor: theme.surface,
          borderColor: launcher.borderColor,
        },
      ]}
    >
      <View style={[styles.settingIconWrap, { backgroundColor: (iconColor || launcher.accentColor) + '15' }]}>
        <MaterialIcons name={icon as any} size={18} color={iconColor || launcher.accentColor} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
        {value ? <Text style={[styles.settingValue, { color: theme.textMuted }]}>{value}</Text> : null}
      </View>
      {badge ? <GlowBadge text={badge} color={launcher.accentColor} glowColor={launcher.glowColor} size="sm" style={{ marginRight: 8 }} /> : null}
      {right ? right : (
        onPress ? <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} /> : null
      )}
    </Pressable>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <AppHeader title={t('settings')} showAdmin={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Appearance */}
        <Text style={[styles.groupTitle, { color: theme.textMuted }]}>APPEARANCE</Text>
        <GlassCard noPadding style={styles.group}>
          <SettingRow
            icon={colorScheme === 'dark' ? 'light-mode' : 'dark-mode'}
            label={colorScheme === 'dark' ? t('lightMode') : t('darkMode')}
            value={colorScheme === 'light' ? 'Currently Light' : 'Currently Dark'}
            iconColor={colorScheme === 'dark' ? '#FFB800' : '#1A6EFF'}
            right={
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={toggleColorScheme}
                trackColor={{ false: theme.border, true: launcher.accentColor + '60' }}
                thumbColor={colorScheme === 'dark' ? launcher.accentColor : '#FFF'}
              />
            }
          />

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <SettingRow
            icon="auto-awesome"
            label="Auto-Save"
            value={autoSaveEnabled ? 'Enabled — every 1.5s' : 'Disabled'}
            iconColor="#00C896"
            right={
              <Switch
                value={autoSaveEnabled}
                trackColor={{ false: theme.border, true: launcher.accentColor + '60' }}
                thumbColor={autoSaveEnabled ? launcher.accentColor : '#FFF'}
                onValueChange={() => {}}
              />
            }
          />
        </GlassCard>

        {/* Language */}
        <Text style={[styles.groupTitle, { color: theme.textMuted }]}>LANGUAGE</Text>
        <GlassCard noPadding style={styles.group}>
          {(['en', 'ur', 'ar'] as Language[]).map((lang, idx, arr) => (
            <View key={lang}>
              <Pressable
                onPress={() => setLanguage(lang)}
                style={[styles.settingRow, {
                  backgroundColor: language === lang ? launcher.cardBg : 'transparent',
                  borderColor: 'transparent',
                }]}
              >
                <View style={[styles.settingIconWrap, {
                  backgroundColor: language === lang ? launcher.accentColor + '20' : theme.surfaceElevated,
                }]}>
                  <Text style={{ fontSize: 16 }}>
                    {lang === 'en' ? '🇺🇸' : lang === 'ur' ? '🇵🇰' : '🇸🇦'}
                  </Text>
                </View>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.text }]}>
                    {LanguageMeta[lang].label}
                  </Text>
                  <Text style={[styles.settingValue, { color: theme.textMuted }]}>
                    {LanguageMeta[lang].nativeLabel} · {LanguageMeta[lang].direction.toUpperCase()}
                  </Text>
                </View>
                {language === lang ? (
                  <View style={[styles.activeIndicator, { backgroundColor: launcher.accentColor }]}>
                    <MaterialIcons name="check" size={14} color="#FFF" />
                  </View>
                ) : null}
              </Pressable>
              {idx < arr.length - 1 ? <View style={[styles.divider, { backgroundColor: theme.divider }]} /> : null}
            </View>
          ))}
        </GlassCard>

        {/* Launchers */}
        <Text style={[styles.groupTitle, { color: theme.textMuted }]}>LAUNCHER THEME</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.launcherScroll}>
          <View style={styles.launcherRow}>
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

        {/* Admin */}
        <Text style={[styles.groupTitle, { color: theme.textMuted }]}>ADMIN</Text>
        <GlassCard noPadding style={styles.group}>
          <SettingRow
            icon="admin-panel-settings"
            label={t('adminPanel')}
            value="Password protected"
            iconColor="#8B2BE2"
            onPress={() => router.push('/admin')}
            badge="SECURE"
          />
        </GlassCard>

        {/* App info */}
        <GlassCard variant="launcher" style={styles.appInfo}>
          <View style={styles.appInfoInner}>
            <View style={[styles.appInfoIcon, { backgroundColor: launcher.accentColor + '20' }]}>
              <MaterialIcons name="auto-fix-high" size={28} color={launcher.accentColor} />
            </View>
            <Text style={[styles.appInfoName, { color: theme.text }]}>ThumbCraft Pro</Text>
            <Text style={[styles.appInfoVersion, { color: theme.textMuted }]}>Version 1.0.0 · Enterprise</Text>
            <Text style={[styles.appInfoTagline, { color: launcher.accentColor + 'AA' }]}>
              Professional Thumbnail Generator
            </Text>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  groupTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 20,
    paddingLeft: 4,
    includeFontPadding: false,
  },
  group: {
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    gap: 1,
  },
  settingLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    includeFontPadding: false,
  },
  settingValue: {
    fontSize: FontSize.sm,
    includeFontPadding: false,
  },
  divider: {
    height: 1,
    marginLeft: 62,
  },
  activeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  launcherScroll: {
    flexGrow: 0,
    marginHorizontal: -Spacing.md,
  },
  launcherRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  appInfo: {
    marginTop: 24,
  },
  appInfoInner: {
    alignItems: 'center',
    gap: 6,
  },
  appInfoIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  appInfoName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    includeFontPadding: false,
  },
  appInfoVersion: {
    fontSize: FontSize.sm,
    includeFontPadding: false,
  },
  appInfoTagline: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    includeFontPadding: false,
  },
});
