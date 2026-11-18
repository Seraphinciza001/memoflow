import AsyncStorage from '@react-native-async-storage/async-storage';
import { NoteItem, AppSettings, JsonDatabase } from '../types';

const STORAGE_KEY = '@seraphin_agenda_notes_v1';
const SETTINGS_KEY = '@seraphin_agenda_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  viewMode: 'grid',
  enableAlertSounds: true,
  autoSaveInterval: 1,
};

export function getInitialSeedNotes(): NoteItem[] {
  const now = new Date();
  const approachingDate = new Date(now.getTime() + 25 * 60000);
  const overdueDate = new Date(now.getTime() - 40 * 60000);

  const formatTime = (d: Date) =>
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const todayStr = formatDate(now);

  return [
    {
      id: 'note-tasks-1',
      title: 'Priorités du jour et Rappels',
      type: 'list',
      content: '',
      color: 'amber',
      isPinned: true,
      isReadOnly: false,
      isArchived: false,
      isDeleted: false,
      createdAt: Date.now() - 3600000 * 4,
      updatedAt: Date.now() - 3600000 * 2,
      images: [],
      tasks: [
        {
          id: 't-1',
          text: 'Finaliser le dossier client et envoyer la synthèse',
          completed: false,
          reminderTime: formatTime(approachingDate),
          dueDate: todayStr,
          priority: 'high',
          isUrgent: true,
        },
        {
          id: 't-2',
          text: 'Appel de suivi avec le chef de projet',
          completed: false,
          reminderTime: formatTime(overdueDate),
          dueDate: todayStr,
          priority: 'medium',
        },
        {
          id: 't-3',
          text: 'Vérifier la base de données locale dans vos dossiers',
          completed: true,
          completedAt: Date.now() - 3600000,
        },
        {
          id: 't-4',
          text: 'Préparer la feuille de route du prochain sprint',
          completed: false,
        },
      ],
    },
    {
      id: 'note-ideas-2',
      title: 'Idées de conception Agenda',
      type: 'note',
      content: `Bienvenue dans votre Agenda personnel !\n\nCette application utilise le stockage local pour conserver toutes vos informations et alertes Android en toute sécurité.\n\nFonctionnalités Clés :\n• Listes de tâches interactives avec suivi d'avancement\n• Mode Sombre / Mode Clair soigneusement calibré\n• Alertes d'échéances et rappels 5 min pour tâches urgentes\n• Base de données JSON exportable et importable`,
      color: 'sand',
      isPinned: true,
      isReadOnly: false,
      isArchived: false,
      isDeleted: false,
      createdAt: Date.now() - 3600000 * 24,
      updatedAt: Date.now() - 3600000 * 3,
      images: [],
      tasks: [],
    },
    {
      id: 'note-recipe-3',
      title: 'Recette gâteau au chocolat (Lecture seule)',
      type: 'list',
      content: 'Note verrouillée en lecture seule : vous pouvez cocher les ingrédients sans risquer de modifier la recette.',
      color: 'emerald',
      isPinned: false,
      isReadOnly: true,
      isArchived: false,
      isDeleted: false,
      createdAt: Date.now() - 3600000 * 48,
      updatedAt: Date.now() - 3600000 * 12,
      images: [],
      tasks: [
        { id: 'rec-1', text: '200g de chocolat noir pâtissier', completed: true },
        { id: 'rec-2', text: '100g de beurre doux', completed: true },
        { id: 'rec-3', text: '3 œufs frais', completed: false },
        { id: 'rec-4', text: '50g de farine de blé', completed: false },
        { id: 'rec-5', text: '80g de sucre de canne', completed: false },
      ],
    },
  ];
}

export function computeDatabaseStats(notes: NoteItem[]) {
  let activeNotes = 0;
  let listsCount = 0;
  let tasksCount = 0;
  let completedTasksCount = 0;
  let remindersCount = 0;

  for (const n of notes) {
    if (!n.isDeleted && !n.isArchived) {
      activeNotes++;
    }
    if (n.type === 'list') {
      listsCount++;
    }
    if (n.tasks && Array.isArray(n.tasks)) {
      for (const t of n.tasks) {
        tasksCount++;
        if (t.completed) completedTasksCount++;
        if (!t.completed && t.reminderTime) remindersCount++;
      }
    }
  }

  return {
    totalNotes: notes.length,
    activeNotes,
    listsCount,
    tasksCount,
    completedTasksCount,
    remindersCount,
  };
}

export async function loadNotes(): Promise<NoteItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialSeedNotes();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return getInitialSeedNotes();
    return parsed;
  } catch (err) {
    console.error('Erreur chargement notes:', err);
    return getInitialSeedNotes();
  }
}

export async function saveNotes(notes: NoteItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Erreur sauvegarde notes:', err);
  }
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const current = await loadSettings();
    const merged = { ...current, ...settings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  } catch (err) {
    console.error('Erreur sauvegarde réglages:', err);
  }
}

export function getFullJsonDatabase(notes: NoteItem[], settings: AppSettings): JsonDatabase {
  return {
    version: 2,
    appName: 'Agenda Séraphin Native',
    schemaVersion: '2.0.0',
    exportedAt: new Date().toISOString(),
    databaseStats: computeDatabaseStats(notes),
    settings,
    notes,
  };
}
