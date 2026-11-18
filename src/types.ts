export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  reminderTime?: string; // e.g. "16:45" or "2026-09-18T16:45"
  dueDate?: string; // YYYY-MM-DD
  priority?: 'low' | 'medium' | 'high';
  isUrgent?: boolean; // alerte répétée toutes les 5 minutes
  completedAt?: number;
}

export interface NoteImage {
  id: string;
  url: string;
  name: string;
  size?: number;
}

export type NoteType = 'note' | 'list';

export type NoteColor = 'default' | 'amber' | 'rose' | 'emerald' | 'sky' | 'violet' | 'sand';

export type NoteFontStyle = 'default' | 'serif' | 'cursive' | 'mono' | 'display' | 'typewriter';

export interface NoteItem {
  id: string;
  title: string;
  type: NoteType;
  content: string; // rich text or multiline text for notes
  tasks: TaskItem[]; // task list items
  images: NoteImage[];
  color: NoteColor;
  fontStyle?: NoteFontStyle;
  isPinned: boolean;
  isReadOnly: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  deletedAt?: number;
  createdAt: number;
  updatedAt: number;
  // Notifications IDs for Android
  notificationId?: string;
  urgentNotificationId?: string;
}

export type DrawerTab = 'notes' | 'reminders' | 'archive' | 'trash';

export interface SmartAlert {
  taskId: string;
  noteId: string;
  noteTitle: string;
  taskText: string;
  reminderTime: string;
  dueDate?: string;
  status: 'approaching' | 'overdue';
  diffMinutes: number;
  relativeLabel: string;
  priority?: 'low' | 'medium' | 'high';
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  viewMode: 'grid' | 'list';
  enableAlertSounds: boolean;
  autoSaveInterval: number; // in seconds
}

export interface JsonDatabase {
  version: number;
  appName: string;
  schemaVersion: string;
  exportedAt: string;
  databaseStats: {
    totalNotes: number;
    activeNotes: number;
    listsCount: number;
    tasksCount: number;
    completedTasksCount: number;
    remindersCount: number;
  };
  settings: AppSettings;
  notes: NoteItem[];
}

export type BulletListModel =
  | 'disc'
  | 'circle'
  | 'square'
  | 'arrow'
  | 'dash'
  | 'decimal'
  | 'alpha-lower'
  | 'alpha-upper'
  | 'roman-lower'
  | 'roman-upper'
  | 'checklist';
