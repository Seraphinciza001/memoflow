import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NoteItem, TaskItem } from '../types';
import { getTaskReminderDate } from './time';

export const MEMOFLOW_CHANNEL_ID = 'memoflow-urgent-channel';

// Random Duolingo / WhatsApp style friendly nagging messages
const OVERDUE_NAG_MESSAGES = [
  (taskText: string) => `Hey ! Tu n'as pas encore fini « ${taskText} » ? Fais vite, ne laisse pas traîner ! 💪`,
  (taskText: string) => `Coucou ! MemoFlow alerte : « ${taskText} » t'attend toujours ! Ne perds pas ta série ! 🔥`,
  (taskText: string) => `Toujours pas terminé « ${taskText} » ? Prends 2 minutes pour la plier ! 😉`,
  (taskText: string) => `Tic-tac ! « ${taskText} » a besoin de toi. Fais vite pour être tranquille ! ⚡`,
  (taskText: string) => `👀 Hey, petit rappel sympa pour « ${taskText} » ! Let's go ! 🚀`,
];

/**
 * Configure high-priority notification channels on Android
 */
export async function setupNotificationChannels(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('MemoFlow: Notification permissions not granted');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(MEMOFLOW_CHANNEL_ID, {
        name: 'MemoFlow Alertes & Tâches',
        description: 'Notifications prioritaires style WhatsApp/Duolingo pour vos tâches et rappels',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250, 500, 250],
        lightColor: '#2563eb',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
    }

    return true;
  } catch (err) {
    console.warn('MemoFlow: Error configuring notification channels:', err);
    return false;
  }
}

/**
 * Send an immediate test notification with sound and heads-up banner
 */
export async function sendTestNotification(): Promise<void> {
  try {
    await setupNotificationChannels();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 MemoFlow : Notification active !',
        body: 'Les alertes push style WhatsApp / Duolingo fonctionnent avec succès. ⚡🚀',
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
        channelId: MEMOFLOW_CHANNEL_ID,
      } as any,
      trigger: null,
    });
  } catch (err) {
    console.warn('Error sending test notification:', err);
  }
}

/**
 * Schedule notifications for all upcoming and overdue tasks across notes
 */
export async function scheduleAllTaskReminders(notes: NoteItem[]): Promise<void> {
  try {
    // 1. Cancel existing scheduled notifications to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = Date.now();

    for (const note of notes) {
      if (note.isDeleted || note.isArchived || !Array.isArray(note.tasks)) {
        continue;
      }

      for (const task of note.tasks) {
        if (task.completed || !task.reminderTime) {
          continue;
        }

        const targetDate = getTaskReminderDate(task.reminderTime, task.dueDate);
        if (!targetDate) continue;

        const targetTime = targetDate.getTime();

        // A) 15 minutes BEFORE target time
        const before15Ms = targetTime - 15 * 60 * 1000;
        if (before15Ms > now) {
          const secondsFromNow = Math.max(1, Math.round((before15Ms - now) / 1000));
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '⏰ MemoFlow : Bientôt l\'heure ! (dans 15 min)',
              body: `« ${task.text} » commence dans 15 min ! Prépare-toi ⏳`,
              sound: 'default',
              priority: Notifications.AndroidNotificationPriority.HIGH,
              channelId: MEMOFLOW_CHANNEL_ID,
              data: { taskId: task.id, noteId: note.id, type: 'before15' },
            } as any,
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: secondsFromNow,
              channelId: MEMOFLOW_CHANNEL_ID,
            },
          });
        }

        // B) EXACT TARGET TIME
        if (targetTime > now) {
          const secondsFromNow = Math.max(1, Math.round((targetTime - now) / 1000));
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '🎯 MemoFlow : C\'est l\'heure !',
              body: `C'est le moment : « ${task.text} » ! Let's go ! 🚀`,
              sound: 'default',
              priority: Notifications.AndroidNotificationPriority.MAX,
              channelId: MEMOFLOW_CHANNEL_ID,
              data: { taskId: task.id, noteId: note.id, type: 'exact' },
            } as any,
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: secondsFromNow,
              channelId: MEMOFLOW_CHANNEL_ID,
            },
          });
        }

        // C) 10 minutes AFTER target time (Duolingo style nag #1)
        const after10Ms = targetTime + 10 * 60 * 1000;
        if (after10Ms > now) {
          const secondsFromNow = Math.max(1, Math.round((after10Ms - now) / 1000));
          const nagMsg = OVERDUE_NAG_MESSAGES[0](task.text);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '⚡ MemoFlow : Tu n\'as pas fini ?',
              body: nagMsg,
              sound: 'default',
              priority: Notifications.AndroidNotificationPriority.MAX,
              channelId: MEMOFLOW_CHANNEL_ID,
              data: { taskId: task.id, noteId: note.id, type: 'post10' },
            } as any,
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: secondsFromNow,
              channelId: MEMOFLOW_CHANNEL_ID,
            },
          });
        }

        // D) 30 minutes AFTER target time (Duolingo style nag #2)
        const after30Ms = targetTime + 30 * 60 * 1000;
        if (after30Ms > now) {
          const secondsFromNow = Math.max(1, Math.round((after30Ms - now) / 1000));
          const nagMsg = OVERDUE_NAG_MESSAGES[1](task.text);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '🔥 MemoFlow : Ne perds pas ta série !',
              body: nagMsg,
              sound: 'default',
              priority: Notifications.AndroidNotificationPriority.MAX,
              channelId: MEMOFLOW_CHANNEL_ID,
              data: { taskId: task.id, noteId: note.id, type: 'post30' },
            } as any,
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: secondsFromNow,
              channelId: MEMOFLOW_CHANNEL_ID,
            },
          });
        }

        // E) 60 minutes AFTER target time (Duolingo style nag #3)
        const after60Ms = targetTime + 60 * 60 * 1000;
        if (after60Ms > now) {
          const secondsFromNow = Math.max(1, Math.round((after60Ms - now) / 1000));
          const nagMsg = OVERDUE_NAG_MESSAGES[2](task.text);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '👀 MemoFlow : Toujours pas fini ?',
              body: nagMsg,
              sound: 'default',
              priority: Notifications.AndroidNotificationPriority.MAX,
              channelId: MEMOFLOW_CHANNEL_ID,
              data: { taskId: task.id, noteId: note.id, type: 'post60' },
            } as any,
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: secondsFromNow,
              channelId: MEMOFLOW_CHANNEL_ID,
            },
          });
        }
      }
    }
  } catch (err) {
    console.warn('Error scheduling task reminders:', err);
  }
}

/**
 * Periodic nag runner for tasks that are currently overdue or urgent
 */
export async function runUrgentAndOverdueCheck(notes: NoteItem[]): Promise<void> {
  try {
    const overdueOrUrgentTasks: { text: string; noteTitle: string; isUrgent?: boolean }[] = [];

    const now = Date.now();

    for (const note of notes) {
      if (note.isDeleted || note.isArchived || !Array.isArray(note.tasks)) continue;

      for (const task of note.tasks) {
        if (task.completed) continue;

        if (task.isUrgent) {
          overdueOrUrgentTasks.push({
            text: task.text,
            noteTitle: note.title || 'Tâche',
            isUrgent: true,
          });
          continue;
        }

        if (task.reminderTime) {
          const targetDate = getTaskReminderDate(task.reminderTime, task.dueDate);
          if (targetDate && targetDate.getTime() < now) {
            overdueOrUrgentTasks.push({
              text: task.text,
              noteTitle: note.title || 'Tâche',
              isUrgent: false,
            });
          }
        }
      }
    }

    if (overdueOrUrgentTasks.length > 0) {
      const selected = overdueOrUrgentTasks[Math.floor(Math.random() * overdueOrUrgentTasks.length)];
      const randomMsgFn = OVERDUE_NAG_MESSAGES[Math.floor(Math.random() * OVERDUE_NAG_MESSAGES.length)];
      const body = randomMsgFn(selected.text);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: selected.isUrgent ? '⚡ MemoFlow URGENT (Rappel)' : '🔥 MemoFlow : Ne lâche rien !',
          body: `${body}\n(${selected.noteTitle})`,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          channelId: MEMOFLOW_CHANNEL_ID,
        } as any,
        trigger: null,
      });
    }
  } catch (err) {
    console.warn('Error in overdue/urgent check:', err);
  }
}
