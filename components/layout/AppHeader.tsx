// Powered by OnSpace.AI
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useTheme, useT, useLauncher } from '../../hooks/useApp';
import { FontSize, FontWeight, Spacing } from '../../constants/theme';
import { useRouter } from 'expo-router';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showAdmin?: boolean;
  showThemeToggle?: boolean;
  rightElement?: React.ReactNode;
}

export function AppHeader({
  title,
  showBack = false,
  showAdmin = true,
  showThemeToggle = true,
  rightElement,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const launcher = useLauncher();
  const t = useT();
  const { toggleColorScheme, colorScheme, lastSaved } = useApp();
  const router = useRouter();
  const saveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lastSaved) {
      Animated.sequence([
        Animated.timing(saveAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(saveAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [lastSaved]);

  const saveOpacity = saveAnim;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: theme.surface,
          borderBottomColor: launcher.borderColor,
          shadowColor: launcher.accentColor,
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
        },
      ]}
    >
      <View style={styles.row}>
        {/* Left side */}
        <View style={styles.left}>
          {showBack ? (
            <Pressable
              onPress={() => router.back()}
              style={[styles.iconBtn, { backgroundColor: launcher.cardBg, borderColor: launcher.borderColor }]}
              hitSlop={12}
            >
              <MaterialIcons name="arrow-back-ios" size={18} color={launcher.accentColor} />
            </Pressable>
          ) : (
            <View style={styles.logoRow}>
              <View style={[styles.logoIcon, { backgroundColor: launcher.accentColor + '20', borderColor: launcher.borderColor }]}>
                <MaterialIcons name="auto-fix-high" size={18} color={launcher.accentColor} />
              </View>
              <View>
                <Text style={[styles.appName, { color: theme.text }]}>
                  {t('appName')}
                </Text>
              </View>
            </View>
          )}
          {title ? (
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{title}</Text>
          ) : null}
        </View>

        {/* Right side */}
        <View style={styles.right}>
          {/* Auto-save indicator */}
          <Animated.View style={[styles.saveIndicator, { opacity: saveOpacity }]}>
            <MaterialIcons name="cloud-done" size={14} color={theme.success} />
            <Text style={[styles.saveText, { color: theme.success }]}>{t('autoSaved')}</Text>
          </Animated.View>

          {showThemeToggle ? (
            <Pressable
              onPress={toggleColorScheme}
              style={[styles.iconBtn, { backgroundColor: launcher.cardBg, borderColor: launcher.borderColor }]}
              hitSlop={8}
            >
              <MaterialIcons
                name={colorScheme === 'dark' ? 'light-mode' : 'dark-mode'}
                size={18}
                color={launcher.accentColor}
              />
            </Pressable>
          ) : null}

          {showAdmin ? (
            <Pressable
              onPress={() => router.push('/admin')}
              style={[styles.iconBtn, { backgroundColor: launcher.cardBg, borderColor: launcher.borderColor }]}
              hitSlop={8}
            >
              <MaterialIcons name="admin-panel-settings" size={18} color={launcher.accentColor} />
            </Pressable>
          ) : null}

          {rightElement}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.black,
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginLeft: 8,
    includeFontPadding: false,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 4,
  },
  saveText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
