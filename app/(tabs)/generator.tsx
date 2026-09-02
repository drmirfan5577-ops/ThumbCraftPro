// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useTheme, useT, useLauncher } from '../../hooks/useApp';
import { AppHeader } from '../../components/layout/AppHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { ThumbnailCanvas } from '../../components/feature/ThumbnailCanvas';
import { CANVAS_PRESETS } from '../../constants/launchers';
import { Radius, FontSize, FontWeight, Spacing, Shadow } from '../../constants/theme';

export default function GeneratorScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const launcher = useLauncher();
  const t = useT();
  const { projects, currentProjectId, createNewProject, addProject, updateProject, setCurrentProject, saveAll } = useApp();

  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('Untitled Thumbnail');
  const [selectedPreset, setSelectedPreset] = useState('youtube');
  const [saving, setSaving] = useState(false);

  const currentProject = projects.find(p => p.id === currentProjectId);

  const handleCreate = () => {
    const preset = CANVAS_PRESETS.find(p => p.id === selectedPreset)!;
    const proj = createNewProject(newName || 'Untitled', preset.label, preset.width, preset.height);
    addProject(proj);
    setCurrentProject(proj.id);
    setShowNewModal(false);
    setNewName('Untitled Thumbnail');
  };

  const handleSave = async () => {
    setSaving(true);
    await saveAll();
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <AppHeader
        title={currentProject ? currentProject.name : t('generator')}
        rightElement={
          currentProject ? (
            <GlowButton
              label={saving ? t('saved') : t('save')}
              onPress={handleSave}
              color={launcher.accentColor}
              glowColor={launcher.glowColor}
              icon={saving ? 'check' : 'save'}
              size="sm"
              loading={saving}
            />
          ) : undefined
        }
      />

      {currentProject ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ThumbnailCanvas
            project={currentProject}
            onUpdate={(updates) => updateProject(currentProject.id, updates)}
          />
        </KeyboardAvoidingView>
      ) : (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <View style={[styles.emptyHero, { backgroundColor: launcher.primaryGradient[0] }]}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: launcher.primaryGradient[1] + '60' }]} />
            <MaterialIcons name="auto-fix-high" size={64} color={launcher.accentColor} />
            <Text style={[styles.emptyTitle, { color: launcher.textColor }]}>
              {t('generator')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: launcher.accentColor + 'BB' }]}>
              Create stunning thumbnails for any platform
            </Text>
          </View>

          {/* Choose preset */}
          <View style={styles.presetSection}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Select Canvas Size</Text>
            <View style={styles.presetGrid}>
              {CANVAS_PRESETS.map(preset => (
                <Pressable
                  key={preset.id}
                  onPress={() => {
                    setSelectedPreset(preset.id);
                    setShowNewModal(true);
                  }}
                  style={[
                    styles.presetTile,
                    {
                      backgroundColor: selectedPreset === preset.id ? launcher.cardBg : theme.surface,
                      borderColor: selectedPreset === preset.id ? launcher.accentColor + '70' : launcher.borderColor,
                      borderWidth: selectedPreset === preset.id ? 2 : 1,
                      ...Shadow.sm,
                      shadowColor: launcher.accentColor,
                    },
                  ]}
                >
                  <View style={[styles.presetTileIcon, { backgroundColor: launcher.accentColor + '15' }]}>
                    <MaterialIcons name={preset.icon as any} size={24} color={launcher.accentColor} />
                  </View>
                  <Text style={[styles.presetTileLabel, { color: theme.text }]}>{preset.label}</Text>
                  <Text style={[styles.presetTileSize, { color: theme.textMuted }]}>
                    {preset.width}×{preset.height}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Recent */}
          {projects.length > 0 ? (
            <View style={styles.recentSection}>
              <Text style={[styles.sectionLabel, { color: theme.text }]}>Continue Editing</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.recentRow}>
                  {projects.slice(0, 6).map(p => (
                    <Pressable
                      key={p.id}
                      onPress={() => setCurrentProject(p.id)}
                      style={[
                        styles.recentCard,
                        {
                          backgroundColor: p.bgGradient ? p.bgGradient[0] : p.bgColor,
                          borderColor: launcher.borderColor,
                          ...Shadow.sm,
                          shadowColor: launcher.accentColor,
                        },
                      ]}
                    >
                      {p.bgGradient ? (
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: p.bgGradient[1] + '70', borderRadius: Radius.lg }]} />
                      ) : null}
                      <Text style={[styles.recentName, { color: p.textLayers[0]?.color || '#222' }]} numberOfLines={2}>
                        {p.name}
                      </Text>
                      <Text style={[styles.recentSize, { color: 'rgba(0,0,0,0.45)' }]}>
                        {p.width}×{p.height}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : null}
        </ScrollView>
      )}

      {/* New Project Modal */}
      <Modal visible={showNewModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modal} elevated>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t('newProject')}</Text>
            <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>Project Name</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              style={[
                styles.input,
                {
                  backgroundColor: theme.surfaceElevated,
                  color: theme.text,
                  borderColor: launcher.borderColor,
                },
              ]}
              placeholderTextColor={theme.textMuted}
              placeholder="Enter project name..."
            />

            <Text style={[styles.modalLabel, { color: theme.textSecondary, marginTop: 14 }]}>Canvas Preset</Text>
            <View style={styles.modalPresets}>
              {CANVAS_PRESETS.filter(p => p.id !== 'custom').slice(0, 4).map(p => (
                <Pressable
                  key={p.id}
                  onPress={() => setSelectedPreset(p.id)}
                  style={[
                    styles.modalPresetBtn,
                    {
                      backgroundColor: selectedPreset === p.id ? launcher.accentColor + '18' : theme.surfaceElevated,
                      borderColor: selectedPreset === p.id ? launcher.accentColor : theme.border,
                      borderWidth: selectedPreset === p.id ? 2 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.modalPresetText, { color: selectedPreset === p.id ? launcher.accentColor : theme.textSecondary }]}>
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <GlowButton
                label={t('cancel')}
                onPress={() => setShowNewModal(false)}
                color={theme.textMuted}
                glowColor="transparent"
                variant="ghost"
                style={{ flex: 1 }}
              />
              <GlowButton
                label={t('createThumbnail')}
                onPress={handleCreate}
                color={launcher.accentColor}
                glowColor={launcher.glowColor}
                icon="add"
                style={{ flex: 2 }}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  emptyContainer: { paddingBottom: 40 },
  emptyHero: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: Spacing.xl,
    overflow: 'hidden',
  },
  emptyTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    includeFontPadding: false,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    textAlign: 'center',
    includeFontPadding: false,
  },
  presetSection: {
    padding: Spacing.md,
    paddingTop: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: 14,
    includeFontPadding: false,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetTile: {
    width: '47%',
    borderRadius: Radius.xl,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  presetTileIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetTileLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    includeFontPadding: false,
  },
  presetTileSize: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    includeFontPadding: false,
  },
  recentSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  recentRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: Spacing.md,
  },
  recentCard: {
    width: 140,
    height: 85,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  recentName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
  recentSize: {
    fontSize: 10,
    fontWeight: FontWeight.medium,
    includeFontPadding: false,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modal: {
    margin: 0,
    borderRadius: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    marginBottom: 20,
    includeFontPadding: false,
  },
  modalLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 8,
    includeFontPadding: false,
  },
  input: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 14,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  modalPresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalPresetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.round,
  },
  modalPresetText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    includeFontPadding: false,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
});
