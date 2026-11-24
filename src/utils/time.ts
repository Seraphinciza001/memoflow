import { TaskItem, SmartAlert, NoteItem } from '../types';

/**
 * Parses time string (either "HH:mm" or "YYYY-MM-DDTHH:mm") relative to current time
 */
export function getTaskReminderDate(reminderTime?: string, dueDate?: string): Date | null {
  if (!reminderTime) return null;

  if (reminderTime.includes('T')) {
    const d = new Date(reminderTime);
    return isNaN(d.getTime()) ? null : d;
  }

  // If time is HH:mm
  const [hoursStr, minutesStr] = reminderTime.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes)) return null;

  const target = new Date();
  const now = new Date();
  if (dueDate) {
    const [y, m, d] = dueDate.split('-').map(Number);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      target.setFullYear(y, m - 1, d);
    }
  }

  target.setHours(hours, minutes, 0, 0);

  // If no explicit dueDate was provided and the target time is already in the past today (by more than 60 seconds),
  // assume it refers to the next day
  if (!dueDate && target.getTime() < now.getTime() - 60000) {
    target.setDate(target.getDate() + 1);
  }

  return target;
}

export type ReminderStatus = 'normal' | 'approaching' | 'overdue';

/**
 * Generates user-friendly relative labels (e.g. "Dans 15 min", "En retard de 20 min")
 */
export function formatRelativeMinutes(diffMinutes: number, formattedTime: string): string {
  if (diffMinutes < -1440) {
    const days = Math.floor(-diffMinutes / 1440);
    return `En retard de ${days}j`;
  }
  if (diffMinutes < -60) {
    const hours = Math.floor(-diffMinutes / 60);
    return `En retard de ${hours}h`;
  }
  if (diffMinutes < 0) {
    return `En retard de ${-diffMinutes} min`;
  }
  if (diffMinutes === 0) {
    return "À l'instant";
  }
  if (diffMinutes <= 60) {
    return `Dans ${diffMinutes} min`;
  }
  if (diffMinutes <= 360) {
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return mins > 0 ? `Dans ${hours}h ${mins}m` : `Dans ${hours}h`;
  }
  return `À ${formattedTime}`;
}

/**
 * Determines whether a task reminder is approaching (< 60 minutes) or overdue (> 0 minutes past)
 */
export function evaluateTaskReminder(task: TaskItem): {
  status: ReminderStatus;
  diffMinutes: number;
  formattedTarget: string;
  relativeLabel: string;
} {
  if (!task.reminderTime || task.completed) {
    return { status: 'normal', diffMinutes: 0, formattedTarget: '', relativeLabel: '' };
  }

  const targetDate = getTaskReminderDate(task.reminderTime, task.dueDate);
  if (!targetDate) {
    return { status: 'normal', diffMinutes: 0, formattedTarget: '', relativeLabel: '' };
  }

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  const timeString = targetDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const relativeLabel = formatRelativeMinutes(diffMinutes, timeString);

  if (diffMinutes < 0) {
    // Overdue
    return { status: 'overdue', diffMinutes, formattedTarget: timeString, relativeLabel };
  } else if (diffMinutes <= 60) {
    // Approaching within 60 minutes
    return { status: 'approaching', diffMinutes, formattedTarget: timeString, relativeLabel };
  }

  return { status: 'normal', diffMinutes, formattedTarget: timeString, relativeLabel };
}

/**
 * Scan all active notes and tasks to find smart alerts, sorted with highest urgency first
 */
export function getActiveSmartAlerts(notes: NoteItem[]): SmartAlert[] {
  const alerts: SmartAlert[] = [];

  for (const note of notes) {
    if (note.isDeleted || note.isArchived) continue;

    for (const task of note.tasks) {
      if (task.completed || !task.reminderTime) continue;

      const evalRes = evaluateTaskReminder(task);
      if (evalRes.status === 'approaching' || evalRes.status === 'overdue') {
        alerts.push({
          taskId: task.id,
          noteId: note.id,
          noteTitle: note.title || 'Sans titre',
          taskText: task.text,
          reminderTime: evalRes.formattedTarget,
          dueDate: task.dueDate,
          status: evalRes.status,
          diffMinutes: evalRes.diffMinutes,
          relativeLabel: evalRes.relativeLabel,
          priority: task.priority,
        });
      }
    }
  }

  // Sort: Overdue first (most overdue first), then approaching (soonest first)
  alerts.sort((a, b) => a.diffMinutes - b.diffMinutes);

  return alerts;
}

/**
 * Adds minutes to an existing reminderTime or current time and formats it as "HH:mm"
 */
export function addMinutesToTime(minutesToAdd: number, baseTime?: string): string {
  const now = new Date();
  if (baseTime && !baseTime.includes('T')) {
    const [h, m] = baseTime.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      now.setHours(h, m, 0, 0);
    }
  }
  const newDate = new Date(now.getTime() + minutesToAdd * 60 * 1000);
  const hh = String(newDate.getHours()).padStart(2, '0');
  const mm = String(newDate.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Quick smart presets for task time scheduling
 */
export function getQuickTimePresets(): Array<{ label: string; time: string; hint: string }> {
  const now = new Date();
  const currentHour = now.getHours();

  const presets: Array<{ label: string; time: string; hint: string }> = [
    {
      label: '+5 min',
      time: addMinutesToTime(5),
      hint: 'Rappel 5 min',
    },
    {
      label: '+10 min',
      time: addMinutesToTime(10),
      hint: 'Rappel 10 min',
    },
    {
      label: '+15 min',
      time: addMinutesToTime(15),
      hint: 'Rappel 15 min',
    },
    {
      label: '+30 min',
      time: addMinutesToTime(30),
      hint: 'Rappel 30 min',
    },
    {
      label: '+1 heure',
      time: addMinutesToTime(60),
      hint: 'Dans 60 min',
    },
  ];

  if (currentHour < 12) {
    presets.push({
      label: 'Midi (12:00)',
      time: '12:00',
      hint: 'Pause déjeuner',
    });
  }

  if (currentHour < 14) {
    presets.push({
      label: 'Après-midi (14:30)',
      time: '14:30',
      hint: 'Reprise',
    });
  }

  if (currentHour < 18) {
    presets.push({
      label: 'Ce soir (18:30)',
      time: '18:30',
      hint: 'Fin de journée',
    });
  } else {
    presets.push({
      label: 'Ce soir (20:30)',
      time: '20:30',
      hint: 'Soirée',
    });
  }

  presets.push({
    label: 'Demain (09:00)',
    time: '09:00',
    hint: 'Matinée',
  });

  return presets;
}
