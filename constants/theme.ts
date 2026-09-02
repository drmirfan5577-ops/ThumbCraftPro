// Powered by OnSpace.AI
export const Colors = {
  light: {
    // Core surfaces
    background: '#FAFCFF',
    surface: '#FFFFFF',
    surfaceElevated: '#F0F6FF',
    surfaceGlass: 'rgba(255,255,255,0.85)',
    
    // Brand primaries
    primary: '#00C896',
    primaryDark: '#007A5E',
    primaryGlow: 'rgba(0,200,150,0.25)',
    
    // Accent crimson
    accent: '#E8003A',
    accentDark: '#A0002A',
    accentGlow: 'rgba(232,0,58,0.22)',
    
    // Emerald family
    emerald: '#00C896',
    emeraldLight: '#E0FFF5',
    emeraldGlass: 'rgba(0,200,150,0.12)',
    emeraldGlow: 'rgba(0,200,150,0.40)',
    
    // Crimson family
    crimson: '#DC143C',
    crimsonLight: '#FFF0F3',
    crimsonGlass: 'rgba(220,20,60,0.10)',
    crimsonGlow: 'rgba(220,20,60,0.35)',
    
    // Sapphire
    sapphire: '#1A6EFF',
    sapphireGlass: 'rgba(26,110,255,0.12)',
    
    // Gold
    gold: '#FFB800',
    goldGlass: 'rgba(255,184,0,0.12)',
    
    // Violet
    violet: '#8B2BE2',
    violetGlass: 'rgba(139,43,226,0.12)',
    
    // Text
    text: '#0A0F1E',
    textSecondary: '#2D3748',
    textMuted: '#718096',
    textInverse: '#FFFFFF',
    
    // Borders & dividers
    border: 'rgba(0,0,0,0.08)',
    borderGlass: 'rgba(255,255,255,0.6)',
    divider: 'rgba(0,0,0,0.06)',
    
    // Shadows
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    
    // Status
    success: '#00C896',
    warning: '#FFB800',
    error: '#E8003A',
    info: '#1A6EFF',

    // Tab bar
    tabBar: '#FFFFFF',
    tabActive: '#00C896',
    tabInactive: '#A0AEC0',
  },
  dark: {
    background: '#080C14',
    surface: '#0F1520',
    surfaceElevated: '#151E2E',
    surfaceGlass: 'rgba(15,21,32,0.90)',
    
    primary: '#00E5A8',
    primaryDark: '#00C896',
    primaryGlow: 'rgba(0,229,168,0.30)',
    
    accent: '#FF1A4B',
    accentDark: '#CC0033',
    accentGlow: 'rgba(255,26,75,0.28)',
    
    emerald: '#00E5A8',
    emeraldLight: '#001F14',
    emeraldGlass: 'rgba(0,229,168,0.15)',
    emeraldGlow: 'rgba(0,229,168,0.45)',
    
    crimson: '#FF1A4B',
    crimsonLight: '#1A000A',
    crimsonGlass: 'rgba(255,26,75,0.12)',
    crimsonGlow: 'rgba(255,26,75,0.40)',
    
    sapphire: '#4D90FF',
    sapphireGlass: 'rgba(77,144,255,0.15)',
    
    gold: '#FFD000',
    goldGlass: 'rgba(255,208,0,0.15)',
    
    violet: '#B060FF',
    violetGlass: 'rgba(176,96,255,0.15)',
    
    text: '#F0F6FF',
    textSecondary: '#CBD5E0',
    textMuted: '#718096',
    textInverse: '#080C14',
    
    border: 'rgba(255,255,255,0.08)',
    borderGlass: 'rgba(255,255,255,0.15)',
    divider: 'rgba(255,255,255,0.06)',
    
    shadowColor: '#000000',
    shadowOpacity: 0.40,
    
    success: '#00E5A8',
    warning: '#FFD000',
    error: '#FF1A4B',
    info: '#4D90FF',

    tabBar: '#0F1520',
    tabActive: '#00E5A8',
    tabInactive: '#4A5568',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  round: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 38,
  hero: 48,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const Shadow = {
  sm: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 12,
  },
  glow: {
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 16,
  },
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;
