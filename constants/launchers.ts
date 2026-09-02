// Powered by OnSpace.AI
export type LauncherId = 
  | 'emerald_crystal'
  | 'crimson_nova'
  | 'sapphire_aurora'
  | 'gold_luxe'
  | 'violet_cosmos'
  | 'arctic_glass'
  | 'solar_flare'
  | 'midnight_bloom';

export interface LauncherConfig {
  id: LauncherId;
  name: string;
  description: string;
  primaryGradient: string[];
  secondaryGradient: string[];
  accentColor: string;
  glowColor: string;
  textColor: string;
  cardBg: string;
  borderColor: string;
  icon: string;
  tagline: string;
}

export const LAUNCHERS: Record<LauncherId, LauncherConfig> = {
  emerald_crystal: {
    id: 'emerald_crystal',
    name: 'Emerald Crystal',
    description: 'Luminous emerald glass with crystal clarity',
    primaryGradient: ['#E8FFF6', '#C0FFE8', '#80FFCA'],
    secondaryGradient: ['#00C896', '#007A5E'],
    accentColor: '#00C896',
    glowColor: 'rgba(0,200,150,0.45)',
    textColor: '#006644',
    cardBg: 'rgba(0,200,150,0.08)',
    borderColor: 'rgba(0,200,150,0.30)',
    icon: 'diamond',
    tagline: 'Pure Emerald Brilliance',
  },
  crimson_nova: {
    id: 'crimson_nova',
    name: 'Crimson Nova',
    description: 'Blazing crimson energy with stellar intensity',
    primaryGradient: ['#FFF0F3', '#FFD0D9', '#FFB0C0'],
    secondaryGradient: ['#DC143C', '#8B0020'],
    accentColor: '#DC143C',
    glowColor: 'rgba(220,20,60,0.40)',
    textColor: '#8B0020',
    cardBg: 'rgba(220,20,60,0.07)',
    borderColor: 'rgba(220,20,60,0.28)',
    icon: 'local-fire-department',
    tagline: 'Ignite Your Vision',
  },
  sapphire_aurora: {
    id: 'sapphire_aurora',
    name: 'Sapphire Aurora',
    description: 'Deep sapphire tones with aurora shimmer',
    primaryGradient: ['#EEF4FF', '#D0E4FF', '#A8CCFF'],
    secondaryGradient: ['#1A6EFF', '#003399'],
    accentColor: '#1A6EFF',
    glowColor: 'rgba(26,110,255,0.38)',
    textColor: '#003399',
    cardBg: 'rgba(26,110,255,0.07)',
    borderColor: 'rgba(26,110,255,0.28)',
    icon: 'water',
    tagline: 'Azure Infinity',
  },
  gold_luxe: {
    id: 'gold_luxe',
    name: 'Gold Luxe',
    description: 'Premium gold with opulent radiance',
    primaryGradient: ['#FFFBE6', '#FFF3B0', '#FFE566'],
    secondaryGradient: ['#FFB800', '#CC8800'],
    accentColor: '#FFB800',
    glowColor: 'rgba(255,184,0,0.42)',
    textColor: '#8B6000',
    cardBg: 'rgba(255,184,0,0.08)',
    borderColor: 'rgba(255,184,0,0.32)',
    icon: 'star',
    tagline: 'Crown Your Content',
  },
  violet_cosmos: {
    id: 'violet_cosmos',
    name: 'Violet Cosmos',
    description: 'Cosmic violet with deep space mystique',
    primaryGradient: ['#F5EDFF', '#E0C8FF', '#CC99FF'],
    secondaryGradient: ['#8B2BE2', '#4B0082'],
    accentColor: '#8B2BE2',
    glowColor: 'rgba(139,43,226,0.40)',
    textColor: '#4B0082',
    cardBg: 'rgba(139,43,226,0.08)',
    borderColor: 'rgba(139,43,226,0.28)',
    icon: 'auto-awesome',
    tagline: 'Beyond the Universe',
  },
  arctic_glass: {
    id: 'arctic_glass',
    name: 'Arctic Glass',
    description: 'Pristine arctic white with hyper-clarity',
    primaryGradient: ['#FFFFFF', '#F0F8FF', '#E0F0FF'],
    secondaryGradient: ['#A8CFFF', '#5599DD'],
    accentColor: '#5599DD',
    glowColor: 'rgba(85,153,221,0.35)',
    textColor: '#1A3A5C',
    cardBg: 'rgba(85,153,221,0.06)',
    borderColor: 'rgba(85,153,221,0.22)',
    icon: 'ac-unit',
    tagline: 'Crystal Pure Clarity',
  },
  solar_flare: {
    id: 'solar_flare',
    name: 'Solar Flare',
    description: 'Explosive solar energy with radiant warmth',
    primaryGradient: ['#FFF8EE', '#FFE8C0', '#FFCD80'],
    secondaryGradient: ['#FF8C00', '#CC4400'],
    accentColor: '#FF6600',
    glowColor: 'rgba(255,102,0,0.40)',
    textColor: '#8B3000',
    cardBg: 'rgba(255,102,0,0.08)',
    borderColor: 'rgba(255,102,0,0.28)',
    icon: 'wb-sunny',
    tagline: 'Radiate Your Story',
  },
  midnight_bloom: {
    id: 'midnight_bloom',
    name: 'Midnight Bloom',
    description: 'Deep teal blossoming from darkness to light',
    primaryGradient: ['#E8FFFE', '#B0F0EC', '#70E0DA'],
    secondaryGradient: ['#00897B', '#00443C'],
    accentColor: '#00897B',
    glowColor: 'rgba(0,137,123,0.38)',
    textColor: '#00443C',
    cardBg: 'rgba(0,137,123,0.08)',
    borderColor: 'rgba(0,137,123,0.28)',
    icon: 'spa',
    tagline: 'Bloom in Brilliance',
  },
};

export const LAUNCHER_ORDER: LauncherId[] = [
  'emerald_crystal',
  'crimson_nova',
  'sapphire_aurora',
  'gold_luxe',
  'violet_cosmos',
  'arctic_glass',
  'solar_flare',
  'midnight_bloom',
];

export const CANVAS_PRESETS = [
  { id: 'youtube', label: 'YouTube', width: 1280, height: 720, icon: 'play-circle-filled' },
  { id: 'instagram_sq', label: 'Instagram Square', width: 1080, height: 1080, icon: 'instagram' },
  { id: 'instagram_story', label: 'Instagram Story', width: 1080, height: 1920, icon: 'smartphone' },
  { id: 'twitter', label: 'Twitter/X', width: 1200, height: 675, icon: 'alternate-email' },
  { id: 'facebook', label: 'Facebook', width: 1200, height: 630, icon: 'facebook' },
  { id: 'linkedin', label: 'LinkedIn', width: 1200, height: 627, icon: 'work' },
  { id: 'tiktok', label: 'TikTok', width: 1080, height: 1920, icon: 'music-note' },
  { id: 'custom', label: 'Custom', width: 1280, height: 720, icon: 'tune' },
];

export const GRADIENT_PRESETS = [
  { id: 'g1', name: 'Emerald Glow', colors: ['#00C896', '#007A5E'] },
  { id: 'g2', name: 'Crimson Fire', colors: ['#FF4D6D', '#DC143C'] },
  { id: 'g3', name: 'Sapphire Deep', colors: ['#4D90FF', '#1A6EFF'] },
  { id: 'g4', name: 'Solar Gold', colors: ['#FFD700', '#FF8C00'] },
  { id: 'g5', name: 'Violet Dream', colors: ['#B060FF', '#8B2BE2'] },
  { id: 'g6', name: 'Arctic Mist', colors: ['#E0F4FF', '#87CEEB'] },
  { id: 'g7', name: 'Rose Garden', colors: ['#FFB7C5', '#FF1493'] },
  { id: 'g8', name: 'Teal Wave', colors: ['#00BCD4', '#006064'] },
  { id: 'g9', name: 'Midnight', colors: ['#2C3E7A', '#0A0F2E'] },
  { id: 'g10', name: 'Sunrise', colors: ['#FFE5B4', '#FF8C69'] },
  { id: 'g11', name: 'Forest', colors: ['#90EE90', '#228B22'] },
  { id: 'g12', name: 'Ocean', colors: ['#00CED1', '#1A6EFF'] },
];

export const FONT_OPTIONS = [
  { id: 'system', label: 'System Default', value: 'System' },
  { id: 'rounded', label: 'Rounded', value: 'System' },
  { id: 'mono', label: 'Monospace', value: 'monospace' },
  { id: 'serif', label: 'Serif', value: 'serif' },
  { id: 'bold', label: 'Bold Impact', value: 'System' },
];
