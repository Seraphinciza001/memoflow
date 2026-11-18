import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronRight,
  Flag,
} from '../SVG';
import { SmartAlert } from '../types';

interface SmartAlertBannerProps {
  alerts: SmartAlert[];
  onOpenNote: (noteId: string) => void;
  onCompleteTask: (noteId: string, taskId: string) => void;
  onSnoozeTask?: (noteId: string, taskId: string, minutes: number) => void;
  enableSounds?: boolean;
  onToggleSound?: () => void;
  isDark?: boolean;
}

export const SmartAlertBanner: React.FC<SmartAlertBannerProps> = ({
  alerts,
  onOpenNote,
  onCompleteTask,
  onSnoozeTask,
  enableSounds = true,
  onToggleSound,
  isDark = false,
}) => {
  const [dismissedIds, setDismissedIds] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [snoozeMenuTaskId, setSnoozeMenuTaskId] = useState<string | null>(null);

  const activeAlerts = alerts.filter((a) => !dismissedIds[`${a.noteId}-${a.taskId}`]);

  if (activeAlerts.length === 0) return null;

  const overdueAlerts = activeAlerts.filter((a) => a.status === 'overdue');
  const approachingAlerts = activeAlerts.filter((a) => a.status === 'approaching');
  const primaryAlert = overdueAlerts[0] || approachingAlerts[0] || activeAlerts[0];
  const isPrimaryOverdue = primaryAlert.status === 'overdue';

  const handleDismiss = (noteId: string, taskId: string) => {
    setDismissedIds((prev) => ({ ...prev, [`${noteId}-${taskId}`]: true }));
    setSnoozeMenuTaskId(null);
  };

  const handleQuickSnooze = (noteId: string, taskId: string, minutes: number) => {
    if (onSnoozeTask) {
      onSnoozeTask(noteId, taskId, minutes);
    }
    setSnoozeMenuTaskId(null);
  };

  return (
    <View
      style={[
        styles.bannerContainer,
        isPrimaryOverdue
          ? (isDark ? styles.bannerOverdueDark : styles.bannerOverdueLight)
          : (isDark ? styles.bannerApproachingDark : styles.bannerApproachingLight),
      ]}
    >
      {/* Header bar: Counts & Sound toggle */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleGroup}>
          {isPrimaryOverdue ? (
            <AlertCircle size={17} color="#ef4444" />
          ) : (
            <Clock size={17} color="#d97706" />
          )}
          <Text
            style={[
              styles.headerTitleText,
              isPrimaryOverdue
                ? (isDark ? styles.textOverdueDark : styles.textOverdueLight)
                : (isDark ? styles.textApproachingDark : styles.textApproachingLight),
            ]}
          >
            {isPrimaryOverdue ? 'Échéances en retard' : 'Rappels imminents'}
          </Text>

          {overdueAlerts.length > 0 && (
            <View style={styles.overdueBadge}>
              <Text style={styles.badgeTextWhite}>{overdueAlerts.length} en retard</Text>
            </View>
          )}

          {approachingAlerts.length > 0 && (
            <View style={styles.approachingBadge}>
              <Text style={styles.badgeTextWhite}>
                {approachingAlerts.length} imminent{approachingAlerts.length > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.headerActions}>
          {onToggleSound && (
            <TouchableOpacity
              onPress={onToggleSound}
              style={styles.actionIconBtn}
              activeOpacity={0.7}
            >
              {enableSounds ? (
                <Volume2 size={16} color="#10b981" />
              ) : (
                <VolumeX size={16} color="#78716c" />
              )}
            </TouchableOpacity>
          )}

          {activeAlerts.length > 1 && (
            <TouchableOpacity
              onPress={() => setIsExpanded(!isExpanded)}
              style={styles.actionIconBtn}
            >
              {isExpanded ? (
                <ChevronDown size={16} color={isDark ? '#e7e5e4' : '#292524'} />
              ) : (
                <ChevronRight size={16} color={isDark ? '#e7e5e4' : '#292524'} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Primary Alert Item */}
      <View style={styles.alertCard}>
        <View style={styles.alertMainRow}>
          {/* Checkbox button */}
          <TouchableOpacity
            onPress={() => onCompleteTask(primaryAlert.noteId, primaryAlert.taskId)}
            style={styles.checkBtn}
            activeOpacity={0.7}
          >
            <View style={styles.checkCircle}>
              <CheckCircle2 size={18} color="#10b981" />
            </View>
          </TouchableOpacity>

          {/* Text and Note info */}
          <TouchableOpacity
            style={styles.alertTextContent}
            onPress={() => onOpenNote(primaryAlert.noteId)}
            activeOpacity={0.8}
          >
            <View style={styles.alertTitleRow}>
              <Text
                style={[
                  styles.taskTitle,
                  isDark ? styles.titleDark : styles.titleLight,
                ]}
                numberOfLines={2}
              >
                {primaryAlert.taskText}
              </Text>

              {primaryAlert.priority === 'high' && (
                <View style={styles.urgentBadge}>
                  <Flag size={10} color="#ef4444" fill="#ef4444" />
                  <Text style={styles.urgentText}>Urgent</Text>
                </View>
              )}
            </View>

            <View style={styles.subInfoRow}>
              <Text
                style={[
                  styles.noteNamePill,
                  isDark ? styles.noteNameDark : styles.noteNameLight,
                ]}
                numberOfLines={1}
              >
                {primaryAlert.noteTitle}
              </Text>

              <View
                style={[
                  styles.timeBadge,
                  isPrimaryOverdue ? styles.timeBadgeOverdue : styles.timeBadgeApproaching,
                ]}
              >
                {isPrimaryOverdue ? (
                  <AlertCircle size={11} color="#b91c1c" />
                ) : (
                  <Clock size={11} color="#b45309" />
                )}
                <Text
                  style={[
                    styles.timeBadgeText,
                    isPrimaryOverdue ? styles.timeTextOverdue : styles.timeTextApproaching,
                  ]}
                >
                  {primaryAlert.relativeLabel || primaryAlert.reminderTime}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Dismiss button */}
          <TouchableOpacity
            onPress={() => handleDismiss(primaryAlert.noteId, primaryAlert.taskId)}
            style={styles.dismissBtn}
          >
            <X size={15} color={isDark ? '#a8a29e' : '#78716c'} />
          </TouchableOpacity>
        </View>

        {/* Quick Snooze Bar */}
        <View style={styles.snoozeRow}>
          <Text style={[styles.snoozeLabel, isDark ? styles.subDark : styles.subLight]}>
            Reporter :
          </Text>

          <TouchableOpacity
            onPress={() => handleQuickSnooze(primaryAlert.noteId, primaryAlert.taskId, 5)}
            style={[styles.snoozePill, isDark ? styles.snoozeDark : styles.snoozeLight]}
          >
            <Text style={[styles.snoozePillText, isDark ? styles.textDark : styles.textLight]}>
              +5 min
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleQuickSnooze(primaryAlert.noteId, primaryAlert.taskId, 15)}
            style={[styles.snoozePill, isDark ? styles.snoozeDark : styles.snoozeLight]}
          >
            <Text style={[styles.snoozePillText, isDark ? styles.textDark : styles.textLight]}>
              +15 min
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleQuickSnooze(primaryAlert.noteId, primaryAlert.taskId, 60)}
            style={[styles.snoozePill, isDark ? styles.snoozeDark : styles.snoozeLight]}
          >
            <Text style={[styles.snoozePillText, isDark ? styles.textDark : styles.textLight]}>
              +1 heure
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expanded list of extra alerts */}
      {isExpanded && activeAlerts.length > 1 && (
        <View style={styles.extraAlertsList}>
          {activeAlerts.slice(1).map((alert) => (
            <View
              key={`${alert.noteId}-${alert.taskId}`}
              style={[
                styles.extraAlertItem,
                isDark ? styles.extraAlertDark : styles.extraAlertLight,
              ]}
            >
              <TouchableOpacity
                onPress={() => onCompleteTask(alert.noteId, alert.taskId)}
                style={styles.checkBtn}
              >
                <CheckCircle2 size={16} color="#10b981" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => onOpenNote(alert.noteId)}
              >
                <Text
                  style={[
                    styles.extraAlertTitle,
                    isDark ? styles.titleDark : styles.titleLight,
                  ]}
                  numberOfLines={1}
                >
                  {alert.taskText}
                </Text>
                <Text style={styles.extraAlertSub}>
                  {alert.noteTitle} • {alert.relativeLabel || alert.reminderTime}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDismiss(alert.noteId, alert.taskId)}
                style={styles.dismissBtn}
              >
                <X size={14} color={isDark ? '#a8a29e' : '#78716c'} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  bannerOverdueLight: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  bannerOverdueDark: {
    backgroundColor: 'rgba(76, 5, 25, 0.4)',
    borderColor: '#881337',
  },
  bannerApproachingLight: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  bannerApproachingDark: {
    backgroundColor: 'rgba(120, 53, 15, 0.35)',
    borderColor: '#78350f',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  headerTitleText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textOverdueLight: {
    color: '#9f1239',
  },
  textOverdueDark: {
    color: '#fda4af',
  },
  textApproachingLight: {
    color: '#92400e',
  },
  textApproachingDark: {
    color: '#fde68a',
  },
  overdueBadge: {
    backgroundColor: '#e11d48',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  approachingBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeTextWhite: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIconBtn: {
    padding: 5,
    borderRadius: 8,
  },
  alertCard: {
    padding: 12,
  },
  alertMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkBtn: {
    paddingTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTextContent: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  titleLight: {
    color: '#1c1917',
  },
  titleDark: {
    color: '#f5f5f4',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b91c1c',
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  noteNamePill: {
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 140,
  },
  noteNameLight: {
    color: '#78716c',
  },
  noteNameDark: {
    color: '#a8a29e',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeBadgeOverdue: {
    backgroundColor: '#ffe4e6',
    borderColor: '#fecdd3',
  },
  timeBadgeApproaching: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  timeTextOverdue: {
    color: '#be123c',
  },
  timeTextApproaching: {
    color: '#b45309',
  },
  dismissBtn: {
    padding: 4,
  },
  snoozeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  snoozeLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  snoozePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  snoozeLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  snoozeDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  snoozePillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  extraAlertsList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  extraAlertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  extraAlertLight: {
    borderBottomColor: '#f5f5f4',
  },
  extraAlertDark: {
    borderBottomColor: '#292524',
  },
  extraAlertTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  extraAlertSub: {
    fontSize: 11,
    color: '#78716c',
    marginTop: 1,
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
