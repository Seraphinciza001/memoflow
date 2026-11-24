import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import {
  NoteItem,
  DrawerTab,
  NoteColor,
  ThemeMode,
  AppSettings,
  JsonDatabase,
} from './src/types';
import {
  loadNotes,
  saveNotes,
  loadSettings,
  saveSettings,
  getInitialSeedNotes,
} from './src/utils/storage';
import {
  getActiveSmartAlerts,
  addMinutesToTime,
} from './src/utils/time';
import {
  setupNotificationChannels,
  scheduleAllTaskReminders,
  runUrgentAndOverdueCheck,
  sendTestNotification,
  MEMOFLOW_CHANNEL_ID,
} from './src/utils/notifications';
import { TopBar } from './src/components/TopBar';
import { Drawer } from './src/components/Drawer';
import { SmartAlertBanner } from './src/components/SmartAlertBanner';
import { NoteCard } from './src/components/NoteCard';
import { FloatingActionButton } from './src/components/FloatingActionButton';
import { NoteEditorModal } from './src/components/NoteEditorModal';
import { NewListTitleModal } from './src/components/NewListTitleModal';
import { JsonDatabaseModal } from './src/components/JsonDatabaseModal';
import { DeleteConfirmModal } from './src/components/DeleteConfirmModal';
import {
  Pin,
  Trash2,
  Clock,
  Archive,
  Inbox,
  StickyNote,
  CheckSquare,
} from './src/SVG';

// 1. Définition de la tâche d'arrière-plan pour recevoir les notifications même si l'application est fermée
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
  if (error) {
    console.error('Erreur tâche de fond notification:', error);
    return;
  }
  console.log('Notification tâche de fond déclenchée:', data, executionInfo);
});

// 2. Configuration du comportement des notifications au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const systemColorScheme = useColorScheme();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    viewMode: 'grid',
    enableAlertSounds: true,
    autoSaveInterval: 1,
  });
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DrawerTab>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'note' | 'list'>('all');

  // Modals state
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [isJsonDbModalOpen, setIsJsonDbModalOpen] = useState(false);

  // Delete Confirmation Modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmAction: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmAction: () => {},
  });

  // Ticker timestamp to re-evaluate alerts and reminders periodically
  const [ticker, setTicker] = useState(Date.now());

  const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  // Initialisation Android notifications & chargement storage
  useEffect(() => {
    (async () => {
      // Configuration des canaux et permissions notifications MemoFlow
      try {
        await setupNotificationChannels();

        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
        if (!isRegistered) {
          await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
        }
      } catch (err) {
        console.warn('Erreur setup notifications Android:', err);
      }

      // Chargement des données locales & planification des rappels
      try {
        const loaded = await loadNotes();
        setNotes(loaded);
        await scheduleAllTaskReminders(loaded);

        const savedSettings = await loadSettings();
        setSettings(savedSettings);
        if (savedSettings.theme) setTheme(savedSettings.theme);
      } catch (e) {
        console.error('Erreur chargement:', e);
      }
    })();
  }, []);

  // Periodic ticker for real-time task time tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(Date.now());
    }, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Save to AsyncStorage whenever notes change & update scheduled push alerts
  const handlePersistNotes = async (updated: NoteItem[]) => {
    setNotes(updated);
    await saveNotes(updated);
    await scheduleAllTaskReminders(updated);
  };

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
    const nextSettings: AppSettings = { ...settings, theme: nextTheme };
    setSettings(nextSettings);
    saveSettings(nextSettings);
  };

  const handleResetToSeeds = () => {
    const seeds = getInitialSeedNotes();
    handlePersistNotes(seeds);
  };

  // Compute smart alerts across all active notes
  const smartAlerts = useMemo(() => {
    return getActiveSmartAlerts(notes);
  }, [notes, ticker]);

  // Urgent and Overdue recurring friendly push check (style Duolingo / WhatsApp)
  useEffect(() => {
    // Run an initial check after 30 seconds
    const initialTimeout = setTimeout(() => {
      runUrgentAndOverdueCheck(notes);
    }, 30000);

    const intervalId = setInterval(() => {
      runUrgentAndOverdueCheck(notes);
    }, 3 * 60 * 1000); // Check every 3 minutes

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [notes]);

  // Filter and search notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // Tab filter
      if (activeTab === 'notes') {
        if (n.isDeleted || n.isArchived) return false;
      } else if (activeTab === 'reminders') {
        if (n.isDeleted || n.isArchived) return false;
        const hasReminders = n.tasks?.some((t) => Boolean(t.reminderTime));
        if (!hasReminders) return false;
      } else if (activeTab === 'archive') {
        if (n.isDeleted || !n.isArchived) return false;
      } else if (activeTab === 'trash') {
        if (!n.isDeleted) return false;
      }

      // Type filter
      if (filterType !== 'all' && n.type !== filterType) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (n.title || '').toLowerCase().includes(q);
        const matchContent = (n.content || '').toLowerCase().includes(q);
        const matchTasks = n.tasks?.some((t) => t.text.toLowerCase().includes(q));
        return matchTitle || matchContent || matchTasks;
      }

      return true;
    });
  }, [notes, activeTab, filterType, searchQuery]);

  // Split into pinned and others
  const pinnedNotes = useMemo(
    () => filteredNotes.filter((n) => n.isPinned),
    [filteredNotes]
  );
  const otherNotes = useMemo(
    () => filteredNotes.filter((n) => !n.isPinned),
    [filteredNotes]
  );

  // Actions
  const handleTogglePin = (noteId: string) => {
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, isPinned: !n.isPinned } : n
    );
    handlePersistNotes(updated);
  };

  const handleToggleReadOnly = (noteId: string) => {
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, isReadOnly: !n.isReadOnly } : n
    );
    handlePersistNotes(updated);
  };

  const handleToggleTask = (noteId: string, taskId: string) => {
    const updated = notes.map((n) => {
      if (n.id !== noteId) return n;
      const nextTasks = (n.tasks || []).map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined,
          };
        }
        return t;
      });
      return { ...n, tasks: nextTasks, updatedAt: Date.now() };
    });
    handlePersistNotes(updated);
  };

  const handleSnoozeTask = (noteId: string, taskId: string, minutes: number) => {
    const updated = notes.map((n) => {
      if (n.id !== noteId) return n;
      const nextTasks = (n.tasks || []).map((t) => {
        if (t.id === taskId) {
          const nowTime = new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const baseTime = t.reminderTime || nowTime;
          const newTime = addMinutesToTime(minutes, baseTime);
          return {
            ...t,
            reminderTime: newTime,
          };
        }
        return t;
      });
      return { ...n, tasks: nextTasks, updatedAt: Date.now() };
    });
    handlePersistNotes(updated);
  };

  const handleChangeColor = (noteId: string, color: NoteColor) => {
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, color } : n
    );
    handlePersistNotes(updated);
  };

  const handleArchive = (noteId: string) => {
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, isArchived: true, isPinned: false } : n
    );
    handlePersistNotes(updated);
  };

  const handleUnarchive = (noteId: string) => {
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, isArchived: false } : n
    );
    handlePersistNotes(updated);
  };

  const handleMoveToTrash = (noteId: string) => {
    const updated = notes.map((n) =>
      n.id === noteId
        ? { ...n, isDeleted: true, isPinned: false, deletedAt: Date.now() }
        : n
    );
    handlePersistNotes(updated);
  };

  const handleRestoreFromTrash = (noteId: string) => {
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, isDeleted: false } : n
    );
    handlePersistNotes(updated);
  };

  // Permanent delete confirmation
  const handleRequestPermanentDelete = (note: NoteItem) => {
    setDeleteConfirmState({
      isOpen: true,
      title: 'Supprimer définitivement',
      message: `Êtes-vous sûr de vouloir supprimer définitivement « ${
        note.title || 'cette note'
      } » ? Cette action est irréversible.`,
      confirmAction: () => {
        const updated = notes.filter((n) => n.id !== note.id);
        handlePersistNotes(updated);
        setDeleteConfirmState((s) => ({ ...s, isOpen: false }));
      },
    });
  };

  // Empty entire trash confirmation
  const handleRequestEmptyTrash = () => {
    const trashCount = notes.filter((n) => n.isDeleted).length;
    if (trashCount === 0) return;

    setDeleteConfirmState({
      isOpen: true,
      title: 'Vider toute la corbeille',
      message: `Êtes-vous certain de vouloir supprimer définitivement les ${trashCount} élément(s) de la corbeille ? Cette action est irréversible.`,
      confirmAction: () => {
        const updated = notes.filter((n) => !n.isDeleted);
        handlePersistNotes(updated);
        setDeleteConfirmState((s) => ({ ...s, isOpen: false }));
      },
    });
  };

  // Creation flows
  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: '',
      type: 'note',
      content: '',
      tasks: [],
      images: [],
      color: 'default',
      isPinned: false,
      isReadOnly: false,
      isArchived: false,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    handlePersistNotes([newNote, ...notes]);
    setEditingNote(newNote);
  };

  const handleOpenCreateListDialog = () => {
    setIsNewListModalOpen(true);
  };

  const handleCreateListWithTitle = (title: string) => {
    setIsNewListModalOpen(false);
    const newList: NoteItem = {
      id: `list-${Date.now()}`,
      title,
      type: 'list',
      content: '',
      tasks: [
        { id: `task-${Date.now()}-1`, text: 'Première tâche à accomplir', completed: false },
      ],
      images: [],
      color: 'amber',
      isPinned: false,
      isReadOnly: false,
      isArchived: false,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    handlePersistNotes([newList, ...notes]);
    setEditingNote(newList);
  };

  const handleSaveEditedNote = (updated: NoteItem) => {
    const newNotes = notes.map((n) => (n.id === updated.id ? updated : n));
    handlePersistNotes(newNotes);
    setEditingNote(null);
  };

  const handleOpenNoteFromAlert = (noteId: string) => {
    const target = notes.find((n) => n.id === noteId);
    if (target) {
      setEditingNote(target);
    }
  };

  const handleImportDatabase = (imported: JsonDatabase | NoteItem[]) => {
    if (Array.isArray(imported)) {
      handlePersistNotes(imported);
    } else if (imported && Array.isArray(imported.notes)) {
      handlePersistNotes(imported.notes);
      if (imported.settings) {
        setSettings(imported.settings);
        if (imported.settings.theme) setTheme(imported.settings.theme);
        saveSettings(imported.settings);
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isDark ? styles.safeAreaDark : styles.safeAreaLight,
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Navigation Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        notes={notes}
        onImportNotes={handleImportDatabase}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenJsonDbModal={() => setIsJsonDbModalOpen(true)}
      />

      {/* Header Top Bar */}
      <TopBar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Smart Alert Banner */}
        {activeTab !== 'trash' && (
          <SmartAlertBanner
            alerts={smartAlerts}
            onOpenNote={handleOpenNoteFromAlert}
            onCompleteTask={handleToggleTask}
            onSnoozeTask={handleSnoozeTask}
            enableSounds={settings.enableAlertSounds}
            onToggleSound={() => {
              const nextVal = !settings.enableAlertSounds;
              setSettings({ ...settings, enableAlertSounds: nextVal });
              saveSettings({ enableAlertSounds: nextVal });
            }}
            isDark={isDark}
          />
        )}

        {/* View contextual banners */}
        {activeTab === 'trash' && (
          <View
            style={[
              styles.viewBanner,
              isDark ? styles.trashBannerDark : styles.trashBannerLight,
            ]}
          >
            <View style={styles.viewBannerLeft}>
              <Trash2 size={20} color="#e11d48" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.viewBannerTitle, { color: '#be123c' }]}>
                  Corbeille
                </Text>
                <Text style={[styles.viewBannerSub, isDark ? styles.subDark : styles.subLight]}>
                  Les éléments supprimés restent ici jusqu'à leur suppression définitive ou restauration.
                </Text>
              </View>
            </View>

            {filteredNotes.length > 0 && (
              <TouchableOpacity
                onPress={handleRequestEmptyTrash}
                style={styles.emptyTrashBtn}
              >
                <Trash2 size={13} color="#ffffff" />
                <Text style={styles.emptyTrashBtnText}>Vider la corbeille</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {activeTab === 'reminders' && (
          <View
            style={[
              styles.viewBanner,
              isDark ? styles.remindersBannerDark : styles.remindersBannerLight,
            ]}
          >
            <View style={styles.viewBannerLeft}>
              <View style={styles.remindersIconBox}>
                <Clock size={18} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.viewBannerTitle, isDark ? styles.textDark : styles.textLight]}>
                    Gestionnaire de Rappels
                  </Text>
                  <View style={styles.directBadge}>
                    <Text style={styles.directBadgeText}>Direct</Text>
                  </View>
                </View>
                <Text style={[styles.viewBannerSub, isDark ? styles.subDark : styles.subLight]}>
                  Surveillance en temps réel. Alertes sonores et notifications prioritaires Android.
                </Text>
              </View>
            </View>

            <View style={styles.statsPillRow}>
              <View style={[styles.statPill, isDark ? styles.statPillDark : styles.statPillLight]}>
                <Text style={styles.statPillLabel}>Actifs :</Text>
                <Text style={styles.statPillValueAmber}>{smartAlerts.length}</Text>
              </View>
              <View style={[styles.statPill, isDark ? styles.statPillDark : styles.statPillLight]}>
                <Text style={styles.statPillLabel}>Listes :</Text>
                <Text style={[styles.statPillValue, isDark ? styles.textDark : styles.textLight]}>
                  {filteredNotes.length}
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'archive' && (
          <View
            style={[
              styles.viewBanner,
              isDark ? styles.archiveBannerDark : styles.archiveBannerLight,
            ]}
          >
            <View style={styles.viewBannerLeft}>
              <Archive size={20} color={isDark ? '#a8a29e' : '#78716c'} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.viewBannerTitle, isDark ? styles.textDark : styles.textLight]}>
                  Archives
                </Text>
                <Text style={[styles.viewBannerSub, isDark ? styles.subDark : styles.subLight]}>
                  Vos notes et listes archivées pour garder votre espace de travail épuré.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Notes Grid / List */}
        {filteredNotes.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, isDark ? styles.emptyCircleDark : styles.emptyCircleLight]}>
              {activeTab === 'trash' ? (
                <Trash2 size={32} color={isDark ? '#78716c' : '#a8a29e'} />
              ) : activeTab === 'reminders' ? (
                <Clock size={32} color={isDark ? '#78716c' : '#a8a29e'} />
              ) : activeTab === 'archive' ? (
                <Archive size={32} color={isDark ? '#78716c' : '#a8a29e'} />
              ) : (
                <Inbox size={32} color={isDark ? '#78716c' : '#a8a29e'} />
              )}
            </View>

            <Text style={[styles.emptyTitle, isDark ? styles.textDark : styles.textLight]}>
              {searchQuery
                ? 'Aucun résultat trouvé'
                : activeTab === 'trash'
                ? 'La corbeille est vide'
                : activeTab === 'reminders'
                ? 'Aucun rappel programmé'
                : activeTab === 'archive'
                ? 'Aucune note archivée'
                : 'Aucune note pour le moment'}
            </Text>

            <Text style={[styles.emptyDesc, isDark ? styles.subDark : styles.subLight]}>
              {searchQuery
                ? `Aucune note ne correspond à « ${searchQuery} ».`
                : activeTab === 'trash'
                ? 'Toutes les notes supprimées apparaîtront ici.'
                : activeTab === 'reminders'
                ? 'Définissez une heure sur vos tâches pour les voir s\'afficher ici avec surveillance intelligente.'
                : activeTab === 'archive'
                ? 'Archivez des notes pour les retrouver plus tard.'
                : 'Créez votre première note ou liste interactive en cliquant ci-dessous !'}
            </Text>

            {activeTab === 'notes' && !searchQuery && (
              <View style={styles.emptyActionsRow}>
                <TouchableOpacity
                  onPress={handleCreateNote}
                  style={[
                    styles.emptyBtn,
                    isDark ? styles.emptyBtnDark : styles.emptyBtnLight,
                  ]}
                >
                  <StickyNote size={15} color={isDark ? '#a8a29e' : '#78716c'} />
                  <Text style={[styles.emptyBtnText, isDark ? styles.textDark : styles.textLight]}>
                    Créer une note
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleOpenCreateListDialog}
                  style={styles.emptyListBtn}
                >
                  <CheckSquare size={15} color="#ffffff" />
                  <Text style={styles.emptyListBtnText}>Créer une liste</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          /* Cards Display */
          <View style={styles.cardsWrapper}>
            {/* Pinned Section */}
            {activeTab === 'notes' && pinnedNotes.length > 0 && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Pin size={13} color="#d97706" fill="#d97706" />
                  <Text style={styles.pinnedSectionTitle}>
                    ÉPINGLÉES ({pinnedNotes.length})
                  </Text>
                </View>

                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isTrashView={false}
                    onEdit={setEditingNote}
                    onTogglePin={handleTogglePin}
                    onToggleReadOnly={handleToggleReadOnly}
                    onToggleTask={handleToggleTask}
                    onArchive={handleArchive}
                    onUnarchive={handleUnarchive}
                    onMoveToTrash={handleMoveToTrash}
                    onRestoreFromTrash={handleRestoreFromTrash}
                    onRequestPermanentDelete={handleRequestPermanentDelete}
                    onChangeColor={handleChangeColor}
                    isDark={isDark}
                  />
                ))}
              </View>
            )}

            {/* Other Notes Section */}
            {activeTab === 'notes' && otherNotes.length > 0 && (
              <View style={styles.sectionBlock}>
                {pinnedNotes.length > 0 && (
                  <Text style={[styles.otherSectionTitle, isDark ? styles.subDark : styles.subLight]}>
                    AUTRES ({otherNotes.length})
                  </Text>
                )}

                {otherNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isTrashView={false}
                    onEdit={setEditingNote}
                    onTogglePin={handleTogglePin}
                    onToggleReadOnly={handleToggleReadOnly}
                    onToggleTask={handleToggleTask}
                    onArchive={handleArchive}
                    onUnarchive={handleUnarchive}
                    onMoveToTrash={handleMoveToTrash}
                    onRestoreFromTrash={handleRestoreFromTrash}
                    onRequestPermanentDelete={handleRequestPermanentDelete}
                    onChangeColor={handleChangeColor}
                    isDark={isDark}
                  />
                ))}
              </View>
            )}

            {/* Other Tabs (Reminders, Archive, Trash) */}
            {activeTab !== 'notes' && (
              <View style={styles.sectionBlock}>
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isTrashView={activeTab === 'trash'}
                    onEdit={setEditingNote}
                    onTogglePin={handleTogglePin}
                    onToggleReadOnly={handleToggleReadOnly}
                    onToggleTask={handleToggleTask}
                    onArchive={handleArchive}
                    onUnarchive={handleUnarchive}
                    onMoveToTrash={handleMoveToTrash}
                    onRestoreFromTrash={handleRestoreFromTrash}
                    onRequestPermanentDelete={handleRequestPermanentDelete}
                    onChangeColor={handleChangeColor}
                    isDark={isDark}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer "Powered by Séraphin" */}
      <View
        style={[
          styles.footerContainer,
          isDark ? styles.footerDark : styles.footerLight,
        ]}
      >
        <Text style={[styles.footerText, isDark ? styles.subDark : styles.subLight]}>
          Powered by <Text style={styles.footerBrand}>Séraphin</Text>
        </Text>
      </View>

      {/* Floating Action Button (+) */}
      {activeTab !== 'trash' && (
        <FloatingActionButton
          onCreateNote={handleCreateNote}
          onCreateList={handleOpenCreateListDialog}
          isDark={isDark}
        />
      )}

      {/* New List Title Prompt Modal */}
      <NewListTitleModal
        isOpen={isNewListModalOpen}
        onClose={() => setIsNewListModalOpen(false)}
        onSubmit={handleCreateListWithTitle}
        isDark={isDark}
      />

      {/* Note / List Full Editor Modal */}
      {editingNote && (
        <NoteEditorModal
          note={editingNote}
          isOpen={Boolean(editingNote)}
          onClose={() => setEditingNote(null)}
          onSave={handleSaveEditedNote}
          isDark={isDark}
        />
      )}

      {/* JSON Database Management Modal */}
      <JsonDatabaseModal
        isOpen={isJsonDbModalOpen}
        onClose={() => setIsJsonDbModalOpen(false)}
        notes={notes}
        settings={settings}
        onImportDatabase={handleImportDatabase}
        onResetToSeeds={handleResetToSeeds}
        isDark={isDark}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmState.isOpen}
        title={deleteConfirmState.title}
        message={deleteConfirmState.message}
        onConfirm={deleteConfirmState.confirmAction}
        onCancel={() => setDeleteConfirmState((s) => ({ ...s, isOpen: false }))}
        isDark={isDark}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  safeAreaLight: {
    backgroundColor: '#f5f5f4',
  },
  safeAreaDark: {
    backgroundColor: '#0c0a09',
  },
  mainScrollView: {
    flex: 1,
  },
  mainContentContainer: {
    paddingBottom: 90,
  },
  viewBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  trashBannerLight: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  trashBannerDark: {
    backgroundColor: 'rgba(76, 5, 25, 0.3)',
    borderColor: '#881337',
  },
  remindersBannerLight: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  remindersBannerDark: {
    backgroundColor: 'rgba(120, 53, 15, 0.25)',
    borderColor: '#78350f',
  },
  archiveBannerLight: {
    backgroundColor: '#f5f5f4',
    borderColor: '#e7e5e4',
  },
  archiveBannerDark: {
    backgroundColor: '#1c1917',
    borderColor: '#292524',
  },
  viewBannerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  remindersIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  viewBannerSub: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  directBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  directBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#b45309',
  },
  emptyTrashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  emptyTrashBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  statsPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  statPillLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  statPillDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  statPillLabel: {
    fontSize: 11,
    color: '#78716c',
  },
  statPillValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  statPillValueAmber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d97706',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyCircleLight: {
    backgroundColor: '#e7e5e4',
  },
  emptyCircleDark: {
    backgroundColor: '#292524',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 20,
  },
  emptyActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyBtnLight: {
    backgroundColor: '#ffffff',
    borderColor: '#d6d3d1',
  },
  emptyBtnDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  emptyBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyListBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  emptyListBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  pinnedSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#b45309',
  },
  otherSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  footerContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
  },
  footerLight: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e7e5e4',
  },
  footerDark: {
    backgroundColor: '#1c1917',
    borderTopColor: '#292524',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footerBrand: {
    fontWeight: '800',
    color: '#d97706',
    letterSpacing: 0.5,
  },
  textLight: {
    color: '#1c1917',
  },
  textDark: {
    color: '#f5f5f4',
  },
  subLight: {
    color: '#78716c',
  },
  subDark: {
    color: '#a8a29e',
  },
});
