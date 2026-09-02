// Powered by OnSpace.AI
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type ColorScheme } from '../constants/theme';
import { type Language } from '../constants/languages';
import { type LauncherId } from '../constants/launchers';

export interface ThumbnailProject {
  id: string;
  name: string;
  width: number;
  height: number;
  preset: string;
  bgColor: string;
  bgGradient: string[] | null;
  bgType: 'solid' | 'gradient' | 'image';
  textLayers: TextLayer[];
  shapeLayers: ShapeLayer[];
  effects: EffectsConfig;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
}

export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: string;
  color: string;
  opacity: number;
  rotation: number;
  textAlign: 'left' | 'center' | 'right';
  fontFamily: string;
  glowEnabled: boolean;
  glowColor: string;
  shadowEnabled: boolean;
}

export interface ShapeLayer {
  id: string;
  type: 'rect' | 'circle' | 'triangle' | 'star' | 'diamond' | 'hexagon';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  gradient: string[] | null;
  opacity: number;
  rotation: number;
  borderRadius: number;
  strokeColor: string;
  strokeWidth: number;
  glowEnabled: boolean;
  glowColor: string;
}

export interface EffectsConfig {
  glow: boolean;
  glowColor: string;
  glowIntensity: number;
  shadow: boolean;
  shadowColor: string;
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface AdminSettings {
  activeLauncher: LauncherId;
  launcherEnabled: Record<LauncherId, boolean>;
  canvasDefaultWidth: number;
  canvasDefaultHeight: number;
  exportFormat: 'PNG' | 'JPG' | 'WEBP';
  exportQuality: number;
  watermarkEnabled: boolean;
  watermarkText: string;
  primaryColor: string;
  accentColor: string;
  appLogoEnabled: boolean;
}

export interface AppState {
  colorScheme: ColorScheme;
  language: Language;
  activeLauncher: LauncherId;
  projects: ThumbnailProject[];
  currentProjectId: string | null;
  adminSettings: AdminSettings;
  adminLoggedIn: boolean;
  autoSaveEnabled: boolean;
  lastSaved: number | null;
}

export interface AppContextType extends AppState {
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
  setLanguage: (lang: Language) => void;
  setActiveLauncher: (id: LauncherId) => void;
  addProject: (project: ThumbnailProject) => void;
  updateProject: (id: string, updates: Partial<ThumbnailProject>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  getCurrentProject: () => ThumbnailProject | null;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  saveAll: () => Promise<void>;
  createNewProject: (name: string, preset: string, width: number, height: number) => ThumbnailProject;
}

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  activeLauncher: 'emerald_crystal',
  launcherEnabled: {
    emerald_crystal: true,
    crimson_nova: true,
    sapphire_aurora: true,
    gold_luxe: true,
    violet_cosmos: true,
    arctic_glass: true,
    solar_flare: true,
    midnight_bloom: true,
  },
  canvasDefaultWidth: 1280,
  canvasDefaultHeight: 720,
  exportFormat: 'PNG',
  exportQuality: 95,
  watermarkEnabled: false,
  watermarkText: 'ThumbCraft Pro',
  primaryColor: '#00C896',
  accentColor: '#DC143C',
  appLogoEnabled: true,
};

const DEFAULT_STATE: AppState = {
  colorScheme: 'light',
  language: 'en',
  activeLauncher: 'emerald_crystal',
  projects: [],
  currentProjectId: null,
  adminSettings: DEFAULT_ADMIN_SETTINGS,
  adminLoggedIn: false,
  autoSaveEnabled: true,
  lastSaved: null,
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'thumbcraft_app_state';
const ADMIN_PASSWORD = '1122';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    if (loaded && state.autoSaveEnabled) {
      const timer = setTimeout(() => {
        persistState(state);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state, loaded]);

  const loadState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(prev => ({ ...prev, ...parsed, adminLoggedIn: false }));
      }
    } catch (e) {
      // ignore
    }
    setLoaded(true);
  };

  const persistState = async (s: AppState) => {
    try {
      const toSave = { ...s, adminLoggedIn: false };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setState(prev => ({ ...prev, lastSaved: Date.now() }));
    } catch (e) {
      // ignore
    }
  };

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setState(prev => ({ ...prev, colorScheme: scheme }));
  }, []);

  const toggleColorScheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      colorScheme: prev.colorScheme === 'light' ? 'dark' : 'light',
    }));
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setState(prev => ({ ...prev, language: lang }));
  }, []);

  const setActiveLauncher = useCallback((id: LauncherId) => {
    setState(prev => ({ ...prev, activeLauncher: id }));
  }, []);

  const addProject = useCallback((project: ThumbnailProject) => {
    setState(prev => ({ ...prev, projects: [project, ...prev.projects] }));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<ThumbnailProject>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
      ),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      currentProjectId: prev.currentProjectId === id ? null : prev.currentProjectId,
    }));
  }, []);

  const setCurrentProject = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, currentProjectId: id }));
  }, []);

  const getCurrentProject = useCallback(() => {
    return state.projects.find(p => p.id === state.currentProjectId) || null;
  }, [state.projects, state.currentProjectId]);

  const updateAdminSettings = useCallback((settings: Partial<AdminSettings>) => {
    setState(prev => ({
      ...prev,
      adminSettings: { ...prev.adminSettings, ...settings },
    }));
  }, []);

  const adminLogin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setState(prev => ({ ...prev, adminLoggedIn: true }));
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setState(prev => ({ ...prev, adminLoggedIn: false }));
  }, []);

  const saveAll = useCallback(async () => {
    await persistState(state);
  }, [state]);

  const createNewProject = useCallback((name: string, preset: string, width: number, height: number): ThumbnailProject => {
    const project: ThumbnailProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name,
      width,
      height,
      preset,
      bgColor: '#FFFFFF',
      bgGradient: ['#E8FFF6', '#C0FFE8'],
      bgType: 'gradient',
      textLayers: [
        {
          id: `txt_${Date.now()}`,
          text: 'Your Title Here',
          x: 50,
          y: 40,
          fontSize: 52,
          fontWeight: '800',
          color: '#0A0F1E',
          opacity: 1,
          rotation: 0,
          textAlign: 'center',
          fontFamily: 'System',
          glowEnabled: false,
          glowColor: '#00C896',
          shadowEnabled: true,
        },
      ],
      shapeLayers: [],
      effects: {
        glow: false,
        glowColor: '#00C896',
        glowIntensity: 0.5,
        shadow: true,
        shadowColor: 'rgba(0,0,0,0.2)',
        blur: 0,
        brightness: 1,
        contrast: 1,
        saturation: 1,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return project;
  }, []);

  if (!loaded) return null;

  return (
    <AppContext.Provider
      value={{
        ...state,
        setColorScheme,
        toggleColorScheme,
        setLanguage,
        setActiveLauncher,
        addProject,
        updateProject,
        deleteProject,
        setCurrentProject,
        getCurrentProject,
        updateAdminSettings,
        adminLogin,
        adminLogout,
        saveAll,
        createNewProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
