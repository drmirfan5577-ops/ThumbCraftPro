// Powered by OnSpace.AI
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useLauncher, useT } from '../../hooks/useApp';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const launcher = useLauncher();
  const t = useT();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.select({
            ios: insets.bottom + 62,
            android: insets.bottom + 62,
            default: 68,
          }),
          paddingTop: 8,
          paddingBottom: Platform.select({
            ios: insets.bottom + 8,
            android: insets.bottom + 8,
            default: 8,
          }),
          paddingHorizontal: 8,
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: launcher.borderColor,
          shadowColor: launcher.accentColor,
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
          elevation: 10,
        },
        tabBarActiveTintColor: launcher.accentColor,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          includeFontPadding: false,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="generator"
        options={{
          title: t('generator'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="auto-fix-high" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: t('templates'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="grid-view" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="tune" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
