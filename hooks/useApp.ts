// Powered by OnSpace.AI
import { useContext } from 'react';
import { AppContext, type AppContextType } from '../contexts/AppContext';
import { Colors, type ThemeColors } from '../constants/theme';
import { Strings, LanguageMeta } from '../constants/languages';
import { LAUNCHERS } from '../constants/launchers';

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export function useTheme(): ThemeColors {
  const { colorScheme } = useApp();
  return Colors[colorScheme];
}

export function useT() {
  const { language } = useApp();
  return (key: string): string => Strings[language][key] || Strings['en'][key] || key;
}

export function useDirection() {
  const { language } = useApp();
  return LanguageMeta[language].direction;
}

export function useLauncher() {
  const { activeLauncher } = useApp();
  return LAUNCHERS[activeLauncher];
}
