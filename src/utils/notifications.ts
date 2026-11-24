import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NoteItem, TaskItem } from '../types';
import { getTaskReminderDate } from './time';

export const MEMOFLOW_CHANNEL_ID = 'memoflow-urgent-channel';

// Friendly nagging messages style Duolingo / WhatsApp
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
        description: 'Notifications prioritaires avec sonnerie et bannières pour vos rappels',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 200, 500],
        lightColor: '#0B192C',
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
      identifier: `memoflow-test-now-${Date.now()}`,
      content: {
        title: '🔔 MemoFlow : Notification active !',
        body: 'Les alertes push sonores et bannières fonctionnent à 100% ! ⚡🚀',
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
 * Send a test notification in 10 seconds.
 * Allows user to exit the app and verify background alarms work when app is closed.
 */
export async function sendDelayed10sTestNotification(): Promise<void> {
  try {
    await setupNotificationChannels();
    const fireDate = new Date(Date.now() + 10 * 1000);
    await Notifications.scheduleNotificationAsync({
      identifier: `memoflow-test-delayed-${Date.now()}`,
      content: {
        title: '🎯 MemoFlow : Alerte App Fermée Réussie !',
        body: 'Bravo ! La notification push s\'est déclenchée avec succès alors que l\'application était fermée ! 🚀⚡',
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
        channelId: MEMOFLOW_CHANNEL_ID,
      } as any,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireDate,
        channelId: MEMOFLOW_CHANNEL_ID,
      },
    });
  } catch (err) {
    console.warn('Error scheduling 10s test notification:', err);
  }
}

/**
 * Schedule system alarms for all upcoming and urgent tasks.
 * Uses exact Date triggers so Android AlarmManager wakes up the device even when app is killed.
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
        if (task.completed) {
          continue;
        }

        // Determine target time
        let targetTime: number | null = null;
        if (task.reminderTime) {
          const targetDate = getTaskReminderDate(task.reminderTime, task.dueDate);
          if (targetDate) targetTime = targetDate.getTime();
        } else if (task.isUrgent) {
          // If marked urgent without an explicit time, schedule for 5 minutes from now
          targetTime = now + 5 * 60 * 1000;
        }

        if (!targetTime) continue;

        // A) 15 minutes BEFORE target time (if still in the future)
        const before15Ms = targetTime - 15 * 60 * 1000;
        if (before15Ms > now + 5000) {
          try {
            await Notifications.scheduleNotificationAsync({
              identifier: `memoflow-${task.id}-before15`,
              content: {
                title: '⏰ MemoFlow : Bientôt l\'heure ! (dans 15 min)',
                body: `« ${task.text} » commence dans 15 min ! Prépare-toi ⏳`,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
                channelId: MEMOFLOW_CHANNEL_ID,
                data: { taskId: task.id, noteId: note.id, type: 'before15' },
              } as any,
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: new Date(before15Ms),
                channelId: MEMOFLOW_CHANNEL_ID,
              },
            });
          } catch (e) {
            console.warn('Error scheduling before15 alert:', e);
          }
        }

        // B) EXACT TARGET TIME
        if (targetTime > now + 3000) {
          try {
            await Notifications.scheduleNotificationAsync({
              identifier: `memoflow-${task.id}-exact`,
              content: {
                title: task.isUrgent ? '⚡ MemoFlow URGENT : C\'est l\'heure !' : '🎯 MemoFlow : C\'est l\'heure !',
                body: `C'est le moment : « ${task.text} » ! Let's go ! 🚀`,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
                channelId: MEMOFLOW_CHANNEL_ID,
                data: { taskId: task.id, noteId: note.id, type: 'exact' },
              } as any,
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: new Date(targetTime),
                channelId: MEMOFLOW_CHANNEL_ID,
              },
            });
          } catch (e) {
            console.warn('Error scheduling exact alert:', e);
          }
        }

        // C) 5 minutes AFTER target time (especially for urgent tasks)
        const after5Ms = targetTime + 5 * 60 * 1000;
        if (after5Ms > now + 3000) {
          try {
            await Notifications.scheduleNotificationAsync({
              identifier: `memoflow-${task.id}-post5`,
              content: {
                title: '⚡ MemoFlow : Tâche en attente !',
                body: `Hey ! Tu as commencé « ${task.text} » ? Ne perds pas le rythme ! 🏃‍♂️`,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
                channelId: MEMOFLOW_CHANNEL_ID,
                data: { taskId: task.id, noteId: note.id, type: 'post5' },
              } as any,
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: new Date(after5Ms),
                channelId: MEMOFLOW_CHANNEL_ID,
              },
            });
          } catch (e) {
            console.warn('Error scheduling post5 alert:', e);
          }
        }

        // D) 10 minutes AFTER target time (Duolingo style nag #1)
        const after10Ms = targetTime + 10 * 60 * 1000;
        if (after10Ms > now + 3000) {
          try {
            const nagMsg = OVERDUE_NAG_MESSAGES[0](task.text);
            await Notifications.scheduleNotificationAsync({
              identifier: `memoflow-${task.id}-post10`,
              content: {
                title: '⚡ MemoFlow : Tu n\'as pas fini ?',
                body: nagMsg,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
                channelId: MEMOFLOW_CHANNEL_ID,
                data: { taskId: task.id, noteId: note.id, type: 'post10' },
              } as any,
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: new Date(after10Ms),
                channelId: MEMOFLOW_CHANNEL_ID,
              },
            });
          } catch (e) {
            console.warn('Error scheduling post10 alert:', e);
          }
        }

        // E) 30 minutes AFTER target time (Duolingo style nag #2)
        const after30Ms = targetTime + 30 * 60 * 1000;
        if (after30Ms > now + 3000) {
          try {
            const nagMsg = OVERDUE_NAG_MESSAGES[1](task.text);
            await Notifications.scheduleNotificationAsync({
              identifier: `memoflow-${task.id}-post30`,
              content: {
                title: '🔥 MemoFlow : Ne perds pas ta série !',
                body: nagMsg,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
                channelId: MEMOFLOW_CHANNEL_ID,
                data: { taskId: task.id, noteId: note.id, type: 'post30' },
              } as any,
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: new Date(after30Ms),
                channelId: MEMOFLOW_CHANNEL_ID,
              },
            });
          } catch (e) {
            console.warn('Error scheduling post30 alert:', e);
          }
        }

        // F) 60 minutes AFTER target time (Duolingo style nag #3)
        const after60Ms = targetTime + 60 * 60 * 1000;
        if (after60Ms > now + 3000) {
          try {
            const nagMsg = OVERDUE_NAG_MESSAGES[2](task.text);
            await Notifications.scheduleNotificationAsync({
              identifier: `memoflow-${task.id}-post60`,
              content: {
                title: '👀 MemoFlow : Toujours pas fini ?',
                body: nagMsg,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
                channelId: MEMOFLOW_CHANNEL_ID,
                data: { taskId: task.id, noteId: note.id, type: 'post60' },
              } as any,
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: new Date(after60Ms),
                channelId: MEMOFLOW_CHANNEL_ID,
              },
            });
          } catch (e) {
            console.warn('Error scheduling post60 alert:', e);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error scheduling task reminders:', err);
  }
}

/**
 * Periodic nag runner for tasks that are currently overdue or urgent (in-app foreground ticker)
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
        identifier: `memoflow-ticker-${Date.now()}`,
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
