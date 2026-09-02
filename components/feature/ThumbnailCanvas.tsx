// Powered by OnSpace.AI
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, useLauncher, useT } from '../../hooks/useApp';
import { type ThumbnailProject } from '../../contexts/AppContext';
import { GRADIENT_PRESETS } from '../../constants/launchers';
import { Radius, FontSize, FontWeight, Spacing, Shadow } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';

const { width: SW } = Dimensions.get('window');

interface ThumbnailCanvasProps {
  project: ThumbnailProject;
  onUpdate: (updates: Partial<ThumbnailProject>) => void;
}

export function ThumbnailCanvas({ project, onUpdate }: ThumbnailCanvasProps) {
  const theme = useTheme();
  const launcher = useLauncher();
  const t = useT();
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bg' | 'text' | 'shapes' | 'effects'>('bg');

  const canvasW = Math.min(SW - 64, 340);
  const canvasH = (canvasW * project.height) / project.width;

  const updateTextLayer = (id: string, updates: object) => {
    onUpdate({
      textLayers: project.textLayers.map(l => l.id === id ? { ...l, ...updates } : l),
    });
  };

  const addTextLayer = () => {
    const newLayer = {
      id: `txt_${Date.now()}`,
      text: 'New Text',
      x: 50,
      y: 50,
      fontSize: 36,
      fontWeight: '700',
      color: '#1A1A2E',
      opacity: 1,
      rotation: 0,
      textAlign: 'center' as const,
      fontFamily: 'System',
      glowEnabled: false,
      glowColor: launcher.accentColor,
      shadowEnabled: false,
    };
    onUpdate({ textLayers: [...project.textLayers, newLayer] });
  };

  const addShape = (type: 'rect' | 'circle' | 'triangle' | 'star') => {
    const newShape = {
      id: `shp_${Date.now()}`,
      type,
      x: 20,
      y: 20,
      width: 120,
      height: 120,
      fill: launcher.accentColor,
      gradient: null,
      opacity: 0.85,
      rotation: 0,
      borderRadius: type === 'rect' ? 12 : 0,
      strokeColor: 'transparent',
      strokeWidth: 0,
      glowEnabled: true,
      glowColor: launcher.glowColor,
    };
    onUpdate({ shapeLayers: [...project.shapeLayers, newShape] });
  };

  const tabs = [
    { id: 'bg', label: t('background'), icon: 'gradient' },
    { id: 'text', label: t('addText'), icon: 'title' },
    { id: 'shapes', label: t('shapes'), icon: 'category' },
    { id: 'effects', label: t('effects'), icon: 'auto-fix-high' },
  ] as const;

  return (
    <View style={styles.container}>
      {/* Canvas Preview */}
      <View style={styles.canvasSection}>
        <View
          style={[
            styles.canvas,
            {
              width: canvasW,
              height: canvasH,
              backgroundColor: project.bgType === 'solid' ? project.bgColor : undefined,
            },
          ]}
        >
          {/* Background gradient simulation */}
          {project.bgType === 'gradient' && project.bgGradient ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: project.bgGradient[0],
                },
              ]}
            >
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: project.bgGradient[1] + '80',
                  },
                ]}
              />
            </View>
          ) : null}

          {/* Shape layers */}
          {project.shapeLayers.map(shape => (
            <Pressable
              key={shape.id}
              onPress={() => setActiveLayer(shape.id)}
              style={[
                styles.shapeLayer,
                {
                  left: `${shape.x}%`,
                  top: `${shape.y}%`,
                  width: shape.width * (canvasW / project.width),
                  height: shape.height * (canvasW / project.width),
                  backgroundColor: shape.fill,
                  borderRadius: shape.type === 'circle' ? 999 : shape.borderRadius,
                  opacity: shape.opacity,
                  borderWidth: activeLayer === shape.id ? 2 : 0,
                  borderColor: launcher.accentColor,
                },
              ]}
            />
          ))}

          {/* Text layers */}
          {project.textLayers.map(layer => (
            <Pressable
              key={layer.id}
              onPress={() => setActiveLayer(layer.id)}
              style={[
                styles.textLayer,
                {
                  left: '5%',
                  right: '5%',
                  top: `${layer.y}%`,
                  borderWidth: activeLayer === layer.id ? 1.5 : 0,
                  borderColor: launcher.accentColor,
                  borderStyle: 'dashed',
                  borderRadius: 4,
                  padding: 4,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: layer.fontSize * (canvasW / project.width),
                  fontWeight: layer.fontWeight as any,
                  color: layer.color,
                  textAlign: layer.textAlign,
                  opacity: layer.opacity,
                  textShadowColor: layer.shadowEnabled ? 'rgba(0,0,0,0.3)' : 'transparent',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: layer.glowEnabled ? 8 : 2,
                }}
                numberOfLines={3}
              >
                {layer.text}
              </Text>
            </Pressable>
          ))}

          {/* Canvas info */}
          <View style={styles.canvasLabel}>
            <Text style={[styles.canvasLabelText, { color: launcher.accentColor + 'CC' }]}>
              {project.width} × {project.height}
            </Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Tab bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <View style={styles.tabRow}>
            {tabs.map(tab => (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: activeTab === tab.id ? launcher.accentColor + '18' : theme.surface,
                    borderColor: activeTab === tab.id ? launcher.accentColor + '60' : theme.border,
                  },
                ]}
              >
                <MaterialIcons
                  name={tab.icon as any}
                  size={16}
                  color={activeTab === tab.id ? launcher.accentColor : theme.textMuted}
                />
                <Text style={[styles.tabText, { color: activeTab === tab.id ? launcher.accentColor : theme.textMuted }]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Panel content */}
        <ScrollView style={styles.panel} showsVerticalScrollIndicator={false}>
          {activeTab === 'bg' ? (
            <View style={styles.panelContent}>
              <Text style={[styles.panelTitle, { color: theme.textSecondary }]}>Background Gradients</Text>
              <View style={styles.gradientGrid}>
                {GRADIENT_PRESETS.map(g => (
                  <Pressable
                    key={g.id}
                    onPress={() => onUpdate({ bgGradient: g.colors, bgType: 'gradient' })}
                    style={[
                      styles.gradientSwatch,
                      {
                        borderColor: JSON.stringify(project.bgGradient) === JSON.stringify(g.colors)
                          ? launcher.accentColor : 'transparent',
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: g.colors[0], borderRadius: 10 }]} />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: g.colors[1] + '80', borderRadius: 10 }]} />
                    <Text style={styles.gradientName} numberOfLines={1}>{g.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'text' ? (
            <View style={styles.panelContent}>
              <GlowButton
                label={t('addText')}
                onPress={addTextLayer}
                color={launcher.accentColor}
                glowColor={launcher.glowColor}
                icon="add"
                fullWidth
                style={{ marginBottom: 12 }}
              />
              {project.textLayers.map(layer => (
                <GlassCard key={layer.id} variant="launcher" style={{ marginBottom: 8 }}>
                  <Text style={[styles.layerName, { color: theme.text }]} numberOfLines={1}>{layer.text}</Text>
                  <View style={styles.layerControls}>
                    <Pressable
                      onPress={() => updateTextLayer(layer.id, { glowEnabled: !layer.glowEnabled })}
                      style={[styles.miniBtn, { backgroundColor: layer.glowEnabled ? launcher.accentColor + '20' : theme.surfaceElevated }]}
                    >
                      <MaterialIcons name="flare" size={14} color={layer.glowEnabled ? launcher.accentColor : theme.textMuted} />
                    </Pressable>
                    <Pressable
                      onPress={() => updateTextLayer(layer.id, { shadowEnabled: !layer.shadowEnabled })}
                      style={[styles.miniBtn, { backgroundColor: layer.shadowEnabled ? launcher.accentColor + '20' : theme.surfaceElevated }]}
                    >
                      <MaterialIcons name="layers" size={14} color={layer.shadowEnabled ? launcher.accentColor : theme.textMuted} />
                    </Pressable>
                    <Pressable
                      onPress={() => onUpdate({ textLayers: project.textLayers.filter(l => l.id !== layer.id) })}
                      style={[styles.miniBtn, { backgroundColor: theme.crimsonGlass }]}
                    >
                      <MaterialIcons name="delete" size={14} color={theme.crimson} />
                    </Pressable>
                  </View>
                </GlassCard>
              ))}
            </View>
          ) : null}

          {activeTab === 'shapes' ? (
            <View style={styles.panelContent}>
              <Text style={[styles.panelTitle, { color: theme.textSecondary }]}>Add Shapes</Text>
              <View style={styles.shapeGrid}>
                {([
                  { type: 'rect', icon: 'crop-square', label: 'Rectangle' },
                  { type: 'circle', icon: 'radio-button-unchecked', label: 'Circle' },
                  { type: 'triangle', icon: 'change-history', label: 'Triangle' },
                  { type: 'star', icon: 'star-border', label: 'Star' },
                ] as const).map(s => (
                  <Pressable
                    key={s.type}
                    onPress={() => addShape(s.type)}
                    style={[
                      styles.shapeBtn,
                      {
                        backgroundColor: launcher.cardBg,
                        borderColor: launcher.borderColor,
                      },
                    ]}
                  >
                    <MaterialIcons name={s.icon as any} size={28} color={launcher.accentColor} />
                    <Text style={[styles.shapeBtnLabel, { color: theme.textMuted }]}>{s.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'effects' ? (
            <View style={styles.panelContent}>
              {[
                { key: 'glow', icon: 'flare', label: t('glow') },
                { key: 'shadow', icon: 'layers', label: t('shadow') },
              ].map(fx => (
                <Pressable
                  key={fx.key}
                  onPress={() => onUpdate({ effects: { ...project.effects, [fx.key]: !project.effects[fx.key as keyof typeof project.effects] } })}
                  style={[
                    styles.fxRow,
                    {
                      backgroundColor: (project.effects as any)[fx.key] ? launcher.cardBg : theme.surface,
                      borderColor: (project.effects as any)[fx.key] ? launcher.accentColor + '50' : theme.border,
                    },
                  ]}
                >
                  <MaterialIcons name={fx.icon as any} size={20} color={(project.effects as any)[fx.key] ? launcher.accentColor : theme.textMuted} />
                  <Text style={[styles.fxLabel, { color: (project.effects as any)[fx.key] ? launcher.accentColor : theme.textSecondary }]}>
                    {fx.label}
                  </Text>
                  <View
                    style={[
                      styles.toggle,
                      { backgroundColor: (project.effects as any)[fx.key] ? launcher.accentColor : theme.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleKnob,
                        { transform: [{ translateX: (project.effects as any)[fx.key] ? 14 : 0 }] },
                      ]}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvasSection: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  canvas: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
    position: 'relative',
    backgroundColor: '#F5F5F5',
  },
  textLayer: {
    position: 'absolute',
  },
  shapeLayer: {
    position: 'absolute',
  },
  canvasLabel: {
    position: 'absolute',
    bottom: 6,
    right: 8,
  },
  canvasLabelText: {
    fontSize: 10,
    fontWeight: FontWeight.medium,
  },
  controls: {
    flex: 1,
  },
  tabScroll: {
    flexGrow: 0,
    paddingHorizontal: Spacing.md,
    marginBottom: 8,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.round,
    borderWidth: 1,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    includeFontPadding: false,
  },
  panel: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  panelContent: {
    paddingBottom: 40,
  },
  panelTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    includeFontPadding: false,
  },
  gradientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gradientSwatch: {
    width: 90,
    height: 56,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 4,
  },
  gradientName: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  layerName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 8,
    includeFontPadding: false,
  },
  layerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  miniBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shapeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  shapeBtn: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  shapeBtnLabel: {
    fontSize: 10,
    fontWeight: FontWeight.medium,
    includeFontPadding: false,
  },
  fxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  fxLabel: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    includeFontPadding: false,
  },
  toggle: {
    width: 38,
    height: 22,
    borderRadius: 11,
    padding: 3,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
});
