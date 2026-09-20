import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  StatusBar,
  SafeAreaView,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DECORATIONS, transformToStylishFont, FontStyleType } from './decorations';

// 1. Définition de la tâche d'arrière-plan pour recevoir les notifications même si l'app est fermée
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  if (error) {
    console.error('Erreur tâche de fond notification:', error);
    return;
  }
  console.log('Notification déclenchée en tâche de fond:', data, executionInfo);
});

// 2. Configuration du comportement des notifications au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface TodoSubItem {
  id: string;
  text: string;
  completed: boolean;
  isUrgent?: boolean;
}

interface NoteItem {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'list';
  todos: TodoSubItem[];
  color: string;
  isPinned: boolean;
  isUrgent?: boolean;
  priority: 'low' | 'medium' | 'high';
  reminderTime?: string; // Format ISO ou minutes
  notificationId?: string;
  urgentNotificationId?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = '@seraphin_agenda_notes_v1';

// Composant avec animation d'entrée (fade-in + glissement fluide vers le haut)
const AnimatedCard = ({
  children,
  index,
  style,
}: {
  children: React.ReactNode;
  index: number;
  style?: any;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        delay: Math.min(index * 50, 300),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 380,
        delay: Math.min(index * 50, 300),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default function App() {
  const systemColorScheme = useColorScheme();
  const [manualTheme, setManualTheme] = useState<'system' | 'light' | 'dark'>('system');
  const isDark = manualTheme === 'system' ? systemColorScheme === 'dark' : manualTheme === 'dark';

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'list' | 'note'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [itemType, setItemType] = useState<'note' | 'list'>('list');
  const [subTasks, setSubTasks] = useState<{ text: string; isUrgent: boolean }[]>([
    { text: '', isUrgent: false },
  ]);
  const [reminderMinutes, setReminderMinutes] = useState<number | null>(15);
  const [isNoteUrgent, setIsNoteUrgent] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Modal Décors & Polices
  const [isDecorModalOpen, setIsDecorModalOpen] = useState(false);
  const [decorTarget, setDecorTarget] = useState<'title' | 'content'>('title');

  // Initialisation et permissions Android
  useEffect(() => {
    (async () => {
      // Configurer les permissions de notification
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          Alert.alert(
            'Notifications désactivées',
            'Pour recevoir les rappels de vos tâches même quand l\'application est fermée, autorisez les notifications dans les paramètres Android.'
          );
        }

        // Configuration du canal haute priorité Android (Alarme + Son + Vibreur)
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('agenda-seraphin-channel', {
            name: 'Rappels & Alarmes Agenda',
            description: 'Canal pour les alertes de tâches même application fermée',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250, 500, 250],
            lightColor: '#d97706',
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: true,
            sound: 'default',
          });
        }

        // Enregistrer la tâche de fond
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
        if (!isRegistered) {
          await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
        }
      } catch (err) {
        console.warn('Erreur setup notifications:', err);
      }

      // Charger les données locales
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Filtrer d'éventuelles notes obsolètes
          const cleaned = parsed.filter(
            (n: any) => !n.title?.toLowerCase().includes('carnet de bord')
          );
          setNotes(cleaned);
        } else {
          // Exemple initial propre
          const defaultNotes: NoteItem[] = [
            {
              id: '1',
              title: '⚡ Préparations Prioritaires',
              content: 'Tâches avec alertes configurées pour fonctionner même application fermée.',
              type: 'list',
              todos: [
                { id: '1-1', text: 'Tester la notification 5 min pour tâche urgente', completed: false, isUrgent: true },
                { id: '1-2', text: 'Vérifier l\'affichage en mode sombre', completed: true, isUrgent: false },
                { id: '1-3', text: 'Compiler le fichier APK pour Android', completed: false, isUrgent: false },
              ],
              color: '#d97706',
              isPinned: true,
              isUrgent: true,
              priority: 'high',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          setNotes(defaultNotes);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNotes));
        }
      } catch (err) {
        console.error('Erreur chargement storage:', err);
      }
    })();
  }, []);

  // Boucle de rappel automatique toutes les 5 minutes pour les tâches urgentes non terminées
  useEffect(() => {
    const notifyUrgentTasks = async () => {
      const urgentTasks: { text: string; listTitle: string }[] = [];
      notes.forEach((n) => {
        n.todos.forEach((t) => {
          if (t.isUrgent && !t.completed) {
            urgentTasks.push({ text: t.text, listTitle: n.title });
          }
        });
      });

      if (urgentTasks.length > 0) {
        try {
          const first = urgentTasks[0];
          const extra = urgentTasks.length > 1 ? ` (+${urgentTasks.length - 1} autre(s))` : '';
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '⚡ TÂCHE URGENTE (Rappel 5 min)',
              body: `« ${first.text} » (${first.listTitle})${extra}\nÀ faire rapidement !`,
              sound: true,
              priority: Notifications.AndroidNotificationPriority.MAX,
              channelId: 'agenda-seraphin-channel',
            },
            trigger: null, // Déclenchement immédiat du ticker
          });
        } catch (e) {
          console.warn('Erreur alerte urgente 5 min:', e);
        }
      }
    };

    // Intervalle de 5 minutes (300 000 ms)
    const intervalId = setInterval(notifyUrgentTasks, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [notes]);

  const saveNotes = async (updated: NoteItem[]) => {
    setNotes(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Erreur sauvegarde:', e);
    }
  };

  // Planification d'une alerte standard avec Exact Alarm Android
  const scheduleTaskReminder = async (title: string, minutes: number): Promise<string> => {
    const triggerSeconds = minutes * 60;
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Rappel Agenda',
        body: `Rappel : ${title}`,
        data: { title, minutes },
        sound: true,
        channelId: 'agenda-seraphin-channel',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        seconds: triggerSeconds,
      },
    });
    return notificationId;
  };

  // Planification d'un rappel récurrent toutes les 5 minutes pour les éléments urgents
  const scheduleUrgentRecurringNotification = async (title: string): Promise<string> => {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚡ TÂCHE URGENTE (Rappel récurrent 5 min)',
        body: `« ${title} » requiert votre action !`,
        sound: true,
        channelId: 'agenda-seraphin-channel',
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        seconds: 300, // 5 minutes
        repeats: true,
      },
    });
    return notificationId;
  };

  // Réinitialisation de la base de données
  const handleResetDatabase = () => {
    Alert.alert(
      'Réinitialiser la base de données ?',
      'Toutes les listes, notes et rappels enregistrés seront remis à zéro.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              await Notifications.cancelAllScheduledNotificationsAsync();
              await AsyncStorage.removeItem(STORAGE_KEY);
              setNotes([]);
              Alert.alert('Réinitialisation terminée', 'La base de données a été vidée.');
            } catch (err) {
              console.error('Erreur reset database:', err);
            }
          },
        },
      ]
    );
  };

  const handleSaveItem = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un titre pour votre liste ou note.');
      return;
    }

    let notifId: string | undefined;
    if (reminderMinutes && reminderMinutes > 0) {
      try {
        notifId = await scheduleTaskReminder(newTitle.trim(), reminderMinutes);
      } catch (err) {
        console.warn('Erreur programmation alarme:', err);
      }
    }

    let urgentNotifId: string | undefined;
    const hasUrgentTasks = isNoteUrgent || subTasks.some((t) => t.isUrgent && t.text.trim().length > 0);
    if (hasUrgentTasks) {
      try {
        urgentNotifId = await scheduleUrgentRecurringNotification(newTitle.trim());
      } catch (err) {
        console.warn('Erreur programmation alarme urgente:', err);
      }
    }

    const validTodos: TodoSubItem[] = subTasks
      .filter((t) => t.text.trim().length > 0)
      .map((t, index) => ({
        id: `${Date.now()}-${index}`,
        text: t.text.trim(),
        completed: false,
        isUrgent: t.isUrgent,
      }));

    if (editingId) {
      const updated = notes.map((item) => {
        if (item.id === editingId) {
          if (item.notificationId && notifId) {
            Notifications.cancelScheduledNotificationAsync(item.notificationId);
          }
          if (item.urgentNotificationId && urgentNotifId) {
            Notifications.cancelScheduledNotificationAsync(item.urgentNotificationId);
          }
          return {
            ...item,
            title: newTitle.trim(),
            content: newContent.trim(),
            type: itemType,
            todos: validTodos.length > 0 ? validTodos : item.todos,
            isUrgent: hasUrgentTasks,
            priority,
            notificationId: notifId || item.notificationId,
            urgentNotificationId: urgentNotifId || item.urgentNotificationId,
            reminderTime: reminderMinutes ? `Dans ${reminderMinutes} min` : item.reminderTime,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });
      await saveNotes(updated);
    } else {
      const newItem: NoteItem = {
        id: Date.now().toString(),
        title: newTitle.trim(),
        content: newContent.trim(),
        type: itemType,
        todos: validTodos,
        color: '#d97706',
        isPinned: false,
        isUrgent: hasUrgentTasks,
        priority,
        notificationId: notifId,
        urgentNotificationId: urgentNotifId,
        reminderTime: reminderMinutes ? `Dans ${reminderMinutes} min` : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveNotes([newItem, ...notes]);
    }

    // Reset modal
    setEditingId(null);
    setNewTitle('');
    setNewContent('');
    setSubTasks([{ text: '', isUrgent: false }]);
    setReminderMinutes(15);
    setIsNoteUrgent(false);
    setIsModalOpen(false);

    if (hasUrgentTasks) {
      Alert.alert(
        '⚡ Alerte Urgente Activée',
        'Cette tâche déclenchera un rappel toutes les 5 minutes jusqu\'à sa réalisation, même avec l\'application fermée.'
      );
    } else if (notifId) {
      Alert.alert(
        '🔔 Rappel programmé',
        `Vous recevrez une alerte sonore et vibration dans ${reminderMinutes} minutes même si l'application est fermée.`
      );
    }
  };

  const handleToggleTodo = async (noteId: string, todoId: string) => {
    const updated = notes.map((note) => {
      if (note.id === noteId) {
        const updatedTodos = note.todos.map((todo) => {
          if (todo.id === todoId) {
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        });
        return { ...note, todos: updatedTodos };
      }
      return note;
    });
    await saveNotes(updated);
  };

  const handleDeleteNote = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(note.notificationId);
    }
    if (note?.urgentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(note.urgentNotificationId);
    }
    const updated = notes.filter((n) => n.id !== id);
    await saveNotes(updated);
  };

  const handleApplyDecor = (template: string) => {
    if (decorTarget === 'title') {
      const current = newTitle.trim() || 'Titre';
      const formatted = template.replace('Placeholder', current);
      setNewTitle(formatted);
    } else {
      const current = newContent.trim() || 'Contenu';
      const formatted = template.replace('Placeholder', current);
      setNewContent(newContent ? `${newContent}\n${formatted}` : formatted);
    }
    setIsDecorModalOpen(false);
  };

  const handleApplyFontStyle = (style: FontStyleType) => {
    if (decorTarget === 'title') {
      if (newTitle.trim()) {
        setNewTitle(transformToStylishFont(newTitle, style));
      }
    } else {
      if (newContent.trim()) {
        setNewContent(transformToStylishFont(newContent, style));
      }
    }
    setIsDecorModalOpen(false);
  };

  const filteredNotes = notes.filter((note) => {
    if (activeFilter !== 'all' && note.type !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchTodos = note.todos.some((t) => t.text.toLowerCase().includes(q));
      return matchTitle || matchContent || matchTodos;
    }
    return true;
  });

  const themeStyles = isDark ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.safeArea, themeStyles.background]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Header */}
      <View style={[styles.header, themeStyles.border]}>
        <View>
          <Text style={[styles.headerTitle, themeStyles.text]}>Agenda</Text>
          <Text style={[styles.headerSubtitle, themeStyles.subText]}>
            Notes, Tâches & Alertes Android
          </Text>
        </View>

        <View style={styles.headerRight}>
          {/* Bouton Réinitialiser la base de données */}
          <TouchableOpacity
            style={[styles.resetBtn, themeStyles.inputBorder]}
            onPress={handleResetDatabase}
            title="Réinitialiser la base de données"
          >
            <Text style={styles.resetBtnText}>🔄</Text>
          </TouchableOpacity>

          {/* Theme switcher */}
          <TouchableOpacity
            style={[styles.themeBtn, themeStyles.inputBorder]}
            onPress={() => setManualTheme(isDark ? 'light' : 'dark')}
          >
            <Text style={styles.themeBtnText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>

          {/* Bouton Ajouter Moderne Lumineux */}
          <TouchableOpacity
            style={styles.addBtnModern}
            onPress={() => {
              setEditingId(null);
              setNewTitle('');
              setNewContent('');
              setSubTasks([{ text: '', isUrgent: false }]);
              setReminderMinutes(15);
              setIsNoteUrgent(false);
              setItemType('list');
              setIsModalOpen(true);
            }}
          >
            <Text style={styles.addBtnModernText}>＋ Créer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.searchSection}>
        <TextInput
          placeholder="Rechercher une note ou tâche..."
          placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, themeStyles.input]}
        />

        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => setActiveFilter('all')}
            style={[
              styles.filterTab,
              activeFilter === 'all' && styles.filterTabActive,
              themeStyles.filterTabBorder,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'all' ? styles.filterTabTextActive : themeStyles.subText,
              ]}
            >
              Tous ({notes.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter('list')}
            style={[
              styles.filterTab,
              activeFilter === 'list' && styles.filterTabActive,
              themeStyles.filterTabBorder,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'list' ? styles.filterTabTextActive : themeStyles.subText,
              ]}
            >
              Listes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter('note')}
            style={[
              styles.filterTab,
              activeFilter === 'note' && styles.filterTabActive,
              themeStyles.filterTabBorder,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'note' ? styles.filterTabTextActive : themeStyles.subText,
              ]}
            >
              Notes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main List avec Animation d'entrée fluide */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <AnimatedCard index={index}>
            <View style={[styles.card, themeStyles.card, themeStyles.cardBorder]}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, themeStyles.text]}>{item.title}</Text>
                  <View style={styles.badgesRow}>
                    {item.isUrgent && (
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentBadgeText}>⚡ Urgent (5 min)</Text>
                      </View>
                    )}
                    {item.reminderTime && (
                      <View style={styles.reminderBadge}>
                        <Text style={styles.reminderBadgeText}>🔔 {item.reminderTime}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDeleteNote(item.id)}
                  style={styles.cardDeleteBtn}
                >
                  <Text style={styles.cardDeleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Note Content */}
              {item.content ? (
                <Text style={[styles.cardContent, themeStyles.subText]}>{item.content}</Text>
              ) : null}

              {/* Todos Checklist */}
              {item.todos && item.todos.length > 0 && (
                <View style={styles.todoList}>
                  {item.todos.map((todo) => (
                    <TouchableOpacity
                      key={todo.id}
                      onPress={() => handleToggleTodo(item.id, todo.id)}
                      style={styles.todoRow}
                    >
                      <View
                        style={[
                          styles.todoCheckbox,
                          todo.completed && styles.todoCheckboxChecked,
                        ]}
                      >
                        {todo.completed && <Text style={styles.todoCheckmark}>✓</Text>}
                      </View>
                      <Text
                        style={[
                          styles.todoText,
                          themeStyles.text,
                          todo.completed && styles.todoTextCompleted,
                        ]}
                      >
                        {todo.text}
                      </Text>
                      {todo.isUrgent && (
                        <View style={styles.urgentTagSmall}>
                          <Text style={styles.urgentTagSmallText}>⚡ 5m</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </AnimatedCard>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, themeStyles.subText]}>
              Aucune note ou tâche pour le moment.
            </Text>
          </View>
        }
      />

      {/* Pied de page Glassmorphique : Powered by Séraphin */}
      <View style={[styles.glassFooter, themeStyles.glassFooter]}>
        <Text style={[styles.footerText, themeStyles.subText]}>
          Powered by <Text style={[styles.footerBrand, themeStyles.text]}>Séraphin</Text>
        </Text>
      </View>

      {/* Modal Création / Édition */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalCard, themeStyles.modalCard]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, themeStyles.text]}>
                  {editingId ? 'Modifier la tâche' : 'Nouvelle liste ou tâche'}
                </Text>

                {/* Bouton Décors & Polices Stylées */}
                <TouchableOpacity
                  style={styles.decorModalTrigger}
                  onPress={() => {
                    setDecorTarget('title');
                    setIsDecorModalOpen(true);
                  }}
                >
                  <Text style={styles.decorModalTriggerText}>✨ Décors & Polices</Text>
                </TouchableOpacity>
              </View>

              {/* Champ Titre avec style sombre garanti (fond foncé en mode sombre) */}
              <Text style={[styles.inputLabel, themeStyles.subText]}>Titre de la liste *</Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Ex: Préparation du week-end..."
                placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                style={[styles.modalInput, themeStyles.input]}
              />

              {/* Type selector */}
              <View style={styles.typeRow}>
                <TouchableOpacity
                  onPress={() => setItemType('list')}
                  style={[
                    styles.typeBtn,
                    itemType === 'list' && styles.typeBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      itemType === 'list' ? styles.typeBtnTextActive : themeStyles.text,
                    ]}
                  >
                    ☑ Liste à cocher
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setItemType('note')}
                  style={[
                    styles.typeBtn,
                    itemType === 'note' && styles.typeBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      itemType === 'note' ? styles.typeBtnTextActive : themeStyles.text,
                    ]}
                  >
                    📝 Note libre
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Option Tâche Urgente (Rappel toutes les 5 minutes) */}
              <TouchableOpacity
                style={[
                  styles.urgentToggleBox,
                  isNoteUrgent && styles.urgentToggleBoxActive,
                  themeStyles.inputBorder,
                ]}
                onPress={() => setIsNoteUrgent(!isNoteUrgent)}
              >
                <Text style={styles.urgentIcon}>⚡</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.urgentTitle, isNoteUrgent && styles.urgentTitleActive]}>
                    Tâche Urgente (Rappel 5 min)
                  </Text>
                  <Text style={styles.urgentDesc}>
                    Envoie une notification sonore toutes les 5 minutes même application fermée.
                  </Text>
                </View>
                <View style={[styles.checkboxCircle, isNoteUrgent && styles.checkboxCircleActive]}>
                  {isNoteUrgent && <Text style={styles.checkboxCheck}>✓</Text>}
                </View>
              </TouchableOpacity>

              {/* Subtasks (if list) */}
              {itemType === 'list' && (
                <View style={styles.subtasksSection}>
                  <Text style={[styles.inputLabel, themeStyles.subText]}>
                    Éléments de la liste :
                  </Text>
                  {subTasks.map((taskObj, idx) => (
                    <View key={idx} style={styles.subtaskRow}>
                      <TextInput
                        value={taskObj.text}
                        onChangeText={(txt) => {
                          const updated = [...subTasks];
                          updated[idx] = { ...updated[idx], text: txt };
                          setSubTasks(updated);
                        }}
                        placeholder={`Élément ${idx + 1}...`}
                        placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                        style={[styles.modalInput, themeStyles.input, { flex: 1, marginBottom: 6 }]}
                      />
                      <TouchableOpacity
                        style={[
                          styles.urgentSubtaskBtn,
                          taskObj.isUrgent && styles.urgentSubtaskBtnActive,
                        ]}
                        onPress={() => {
                          const updated = [...subTasks];
                          updated[idx] = { ...updated[idx], isUrgent: !updated[idx].isUrgent };
                          setSubTasks(updated);
                        }}
                        title="Tâche urgente (5 min)"
                      >
                        <Text style={styles.urgentSubtaskBtnText}>⚡</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    onPress={() => setSubTasks([...subTasks, { text: '', isUrgent: false }])}
                    style={styles.addSubtaskBtn}
                  >
                    <Text style={styles.addSubtaskBtnText}>+ Ajouter un élément</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Description / Content */}
              <View style={styles.contentLabelRow}>
                <Text style={[styles.inputLabel, themeStyles.subText]}>Note ou description</Text>
                <TouchableOpacity
                  onPress={() => {
                    setDecorTarget('content');
                    setIsDecorModalOpen(true);
                  }}
                >
                  <Text style={styles.decorLinkText}>✨ Insérer décor / police</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                value={newContent}
                onChangeText={setNewContent}
                placeholder="Détails supplémentaires..."
                placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                multiline
                numberOfLines={3}
                style={[styles.modalInput, styles.modalTextarea, themeStyles.input]}
              />

              {/* Rappel d'alarme Android (même fermé) */}
              <Text style={[styles.inputLabel, themeStyles.subText]}>
                🔔 Rappel d'alarme Android (même application fermée) :
              </Text>
              <View style={styles.presetReminders}>
                {[15, 30, 60, 120].map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    onPress={() => setReminderMinutes(mins)}
                    style={[
                      styles.presetBadge,
                      reminderMinutes === mins && styles.presetBadgeActive,
                      themeStyles.inputBorder,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetBadgeText,
                        reminderMinutes === mins && styles.presetBadgeTextActive,
                      ]}
                    >
                      +{mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setReminderMinutes(null)}
                  style={[
                    styles.presetBadge,
                    reminderMinutes === null && styles.presetBadgeActive,
                    themeStyles.inputBorder,
                  ]}
                >
                  <Text
                    style={[
                      styles.presetBadgeText,
                      reminderMinutes === null && styles.presetBadgeTextActive,
                    ]}
                  >
                    Aucun
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setIsModalOpen(false)}
                  style={[styles.actionBtn, styles.cancelActionBtn]}
                >
                  <Text style={themeStyles.text}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveItem}
                  style={[styles.actionBtn, styles.saveActionBtn]}
                >
                  <Text style={styles.saveActionBtnText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal Décors & Polices Stylées */}
      <Modal visible={isDecorModalOpen} animationType="fade" transparent>
        <View style={styles.decorModalOverlay}>
          <View style={[styles.decorModalCard, themeStyles.modalCard]}>
            <View style={styles.decorHeaderRow}>
              <Text style={[styles.decorModalHeading, themeStyles.text]}>
                ✨ Décors & Polices Ultra Stylées
              </Text>
              <TouchableOpacity onPress={() => setIsDecorModalOpen(false)}>
                <Text style={styles.closeDecorBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.decorTargetLabel, themeStyles.subText]}>
              Application actuelle sur le :{' '}
              <Text style={{ fontWeight: 'bold', color: '#d97706' }}>
                {decorTarget === 'title' ? 'Titre' : 'Contenu'}
              </Text>
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Polices Unicode Stylées */}
              <Text style={[styles.decorSectionTitle, themeStyles.text]}>
                🔤 Polices Stylées (convertit le texte) :
              </Text>
              <View style={styles.fontGrid}>
                {[
                  { id: 'serif-bold', name: '𝐒𝐞𝐫𝐢𝐟 𝐆𝐫𝐚𝐬' },
                  { id: 'cursive', name: '𝒞𝓊𝓇𝓈𝒾𝓋ℯ' },
                  { id: 'gothic', name: '𝔊𝔬𝔱𝔥𝔦𝔮𝔲𝔢' },
                  { id: 'double-struck', name: '𝔻𝕠𝕦𝕓𝕝𝕖' },
                  { id: 'bubble', name: 'ⓑⓤⓑⓑⓛⓔ' },
                  { id: 'monospace', name: '𝙼𝚘𝚗𝚘' },
                ].map((f) => (
                  <TouchableOpacity
                    key={f.id}
                    style={[styles.fontBtn, themeStyles.inputBorder]}
                    onPress={() => handleApplyFontStyle(f.id as FontStyleType)}
                  >
                    <Text style={[styles.fontBtnText, themeStyles.text]}>{f.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Cadres et décors spéciaux demandés par l'utilisateur */}
              <Text style={[styles.decorSectionTitle, themeStyles.text, { marginTop: 14 }]}>
                🎨 Cadres & Séparateurs Artistiques :
              </Text>
              {DECORATIONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.decorItemBtn, themeStyles.inputBorder]}
                  onPress={() => handleApplyDecor(item.template)}
                >
                  <Text style={[styles.decorItemName, { color: '#d97706' }]}>{item.name}</Text>
                  <Text style={[styles.decorItemPreview, themeStyles.text]}>{item.template}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 11, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resetBtn: {
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: { fontSize: 15 },
  themeBtn: { padding: 7, borderRadius: 10, borderWidth: 1 },
  themeBtnText: { fontSize: 15 },

  // Bouton Ajouter Moderne Lumineux avec Shadow & Rounded
  addBtnModern: {
    backgroundColor: '#d97706',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f59e0b',
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  addBtnModernText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

  searchSection: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 },
  searchInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 14,
    borderWidth: 1,
  },
  filterRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterTabActive: { backgroundColor: '#d97706', borderColor: '#d97706' },
  filterTabText: { fontSize: 12, fontWeight: '600' },
  filterTabTextActive: { color: '#ffffff' },
  listContainer: { padding: 16, paddingBottom: 24 },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardDeleteBtn: { padding: 4 },
  cardDeleteBtnText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
  badgesRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 4 },
  urgentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  urgentBadgeText: { fontSize: 10, color: '#b91c1c', fontWeight: 'bold' },
  reminderBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  reminderBadgeText: { fontSize: 10, color: '#92400e', fontWeight: '600' },
  cardContent: { fontSize: 13, marginTop: 8, lineHeight: 18 },
  todoList: { marginTop: 12, gap: 8 },
  todoRow: { flexDirection: 'row', alignItems: 'center' },
  todoCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#d97706',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoCheckboxChecked: { backgroundColor: '#d97706' },
  todoCheckmark: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  todoText: { fontSize: 14, flex: 1 },
  todoTextCompleted: { textDecorationLine: 'line-through', opacity: 0.5 },
  urgentTagSmall: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentTagSmallText: { color: '#b91c1c', fontSize: 9, fontWeight: 'bold' },
  emptyBox: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 14 },

  // Pied de page glassmorfique
  glassFooter: {
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  footerText: { fontSize: 12, fontWeight: '500' },
  footerBrand: { fontWeight: 'bold' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalHeading: { fontSize: 17, fontWeight: 'bold' },
  decorModalTrigger: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  decorModalTriggerText: { color: '#92400e', fontSize: 11, fontWeight: 'bold' },

  inputLabel: { fontSize: 12, fontWeight: '600', marginBottom: 5, marginTop: 8 },
  contentLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  decorLinkText: { fontSize: 11, color: '#d97706', fontWeight: 'bold' },

  // Le champ textuel est explicitement adapté au thème sombre
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  modalTextarea: { height: 75, textAlignVertical: 'top' },
  typeRow: { flexDirection: 'row', gap: 10, marginTop: 10, marginBottom: 8 },
  typeBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: '#d97706', borderColor: '#d97706' },
  typeBtnText: { fontSize: 13, fontWeight: '600' },
  typeBtnTextActive: { color: '#ffffff' },

  urgentToggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  urgentToggleBoxActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: '#ef4444',
  },
  urgentIcon: { fontSize: 18 },
  urgentTitle: { fontSize: 13, fontWeight: 'bold', color: '#b91c1c' },
  urgentTitleActive: { color: '#dc2626' },
  urgentDesc: { fontSize: 10, color: '#78716c', marginTop: 1 },
  checkboxCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d6d3d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCircleActive: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  checkboxCheck: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  subtasksSection: { marginTop: 4 },
  subtaskRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  urgentSubtaskBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(150,150,150,0.1)',
    marginBottom: 6,
  },
  urgentSubtaskBtnActive: {
    backgroundColor: '#ef4444',
  },
  urgentSubtaskBtnText: { fontSize: 12 },
  addSubtaskBtn: { paddingVertical: 6 },
  addSubtaskBtnText: { color: '#d97706', fontSize: 13, fontWeight: 'bold' },
  presetReminders: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  presetBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetBadgeActive: { backgroundColor: '#d97706', borderColor: '#d97706' },
  presetBadgeText: { fontSize: 12, fontWeight: '600', color: '#78716c' },
  presetBadgeTextActive: { color: '#ffffff' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 12 },
  cancelActionBtn: { backgroundColor: 'rgba(150,150,150,0.15)' },
  saveActionBtn: { backgroundColor: '#d97706' },
  saveActionBtnText: { color: '#ffffff', fontWeight: 'bold' },

  // Modal décors
  decorModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 16,
  },
  decorModalCard: {
    borderRadius: 20,
    padding: 18,
  },
  decorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  decorModalHeading: { fontSize: 16, fontWeight: 'bold' },
  closeDecorBtn: { fontSize: 18, color: '#78716c', padding: 4 },
  decorTargetLabel: { fontSize: 12, marginBottom: 12 },
  decorSectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  fontGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fontBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  fontBtnText: { fontSize: 13 },
  decorItemBtn: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  decorItemName: { fontSize: 11, fontWeight: 'bold', marginBottom: 3 },
  decorItemPreview: { fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
});

const lightTheme = StyleSheet.create({
  background: { backgroundColor: '#fcfbf9' },
  border: { borderBottomColor: '#e7e5e4' },
  card: { backgroundColor: '#ffffff' },
  cardBorder: { borderColor: '#e7e5e4' },
  text: { color: '#1c1917' },
  subText: { color: '#78716c' },
  input: { backgroundColor: '#f5f5f4', borderColor: '#d6d3d1', color: '#1c1917' },
  inputBorder: { borderColor: '#e7e5e4' },
  filterTabBorder: { borderColor: '#e7e5e4' },
  glassFooter: {
    borderTopColor: 'rgba(231, 229, 228, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  modalCard: { backgroundColor: '#ffffff' },
});

const darkTheme = StyleSheet.create({
  background: { backgroundColor: '#18181b' },
  border: { borderBottomColor: '#27272a' },
  card: { backgroundColor: '#27272a' },
  cardBorder: { borderColor: '#3f3f46' },
  text: { color: '#f4f4f5' },
  subText: { color: '#a1a1aa' },
  input: { backgroundColor: '#27272a', borderColor: '#3f3f46', color: '#f4f4f5' },
  inputBorder: { borderColor: '#3f3f46' },
  filterTabBorder: { borderColor: '#3f3f46' },
  glassFooter: {
    borderTopColor: 'rgba(63, 63, 70, 0.5)',
    backgroundColor: 'rgba(24, 24, 27, 0.75)',
  },
  modalCard: { backgroundColor: '#27272a' },
});
