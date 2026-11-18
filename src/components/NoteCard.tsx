import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Pin,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Archive,
  RotateCcw,
  Trash2,
  Palette,
  AlertCircle,
  Flag,
  CheckSquare,
} from '../SVG';
import { NoteItem, NoteColor, TaskItem } from '../types';
import { evaluateTaskReminder } from '../utils/time';

interface NoteCardProps {
  note: NoteItem;
  isTrashView?: boolean;
  onEdit: (note: NoteItem) => void;
  onTogglePin: (noteId: string) => void;
  onToggleReadOnly: (noteId: string) => void;
  onToggleTask: (noteId: string, taskId: string) => void;
  onArchive: (noteId: string) => void;
  onUnarchive: (noteId: string) => void;
  onMoveToTrash: (noteId: string) => void;
  onRestoreFromTrash: (noteId: string) => void;
  onRequestPermanentDelete: (note: NoteItem) => void;
  onChangeColor: (noteId: string, color: NoteColor) => void;
  isDark?: boolean;
}

const COLOR_MAP: Record<
  NoteColor,
  { bgLight: string; borderLight: string; bgDark: string; borderDark: string; badgeLight: string; badgeDark: string }
> = {
  default: {
    bgLight: '#ffffff',
    borderLight: '#e7e5e4',
    bgDark: '#1c1917',
    borderDark: '#292524',
    badgeLight: '#f5f5f4',
    badgeDark: '#292524',
  },
  amber: {
    bgLight: '#fffbeb',
    borderLight: '#fde68a',
    bgDark: 'rgba(120, 53, 15, 0.22)',
    borderDark: '#78350f',
    badgeLight: '#fef3c7',
    badgeDark: 'rgba(120, 53, 15, 0.5)',
  },
  sand: {
    bgLight: '#fff7ed',
    borderLight: '#fed7aa',
    bgDark: 'rgba(124, 45, 18, 0.2)',
    borderDark: '#7c2d12',
    badgeLight: '#ffedd5',
    badgeDark: 'rgba(124, 45, 18, 0.45)',
  },
  emerald: {
    bgLight: '#ecfdf5',
    borderLight: '#a7f3d0',
    bgDark: 'rgba(6, 78, 59, 0.22)',
    borderDark: '#065f46',
    badgeLight: '#d1fae5',
    badgeDark: 'rgba(6, 78, 59, 0.5)',
  },
  sky: {
    bgLight: '#f0f9ff',
    borderLight: '#bae6fd',
    bgDark: 'rgba(12, 74, 110, 0.22)',
    borderDark: '#075985',
    badgeLight: '#e0f2fe',
    badgeDark: 'rgba(12, 74, 110, 0.5)',
  },
  violet: {
    bgLight: '#faf5ff',
    borderLight: '#e9d5ff',
    bgDark: 'rgba(88, 28, 135, 0.22)',
    borderDark: '#581c87',
    badgeLight: '#f3e8ff',
    badgeDark: 'rgba(88, 28, 135, 0.5)',
  },
  rose: {
    bgLight: '#fff1f2',
    borderLight: '#fecdd3',
    bgDark: 'rgba(136, 19, 55, 0.22)',
    borderDark: '#881337',
    badgeLight: '#ffe4e6',
    badgeDark: 'rgba(136, 19, 55, 0.5)',
  },
};

const COLOR_SWATCHES: Array<{ id: NoteColor; hex: string }> = [
  { id: 'default', hex: '#ffffff' },
  { id: 'amber', hex: '#fde68a' },
  { id: 'sand', hex: '#fed7aa' },
  { id: 'emerald', hex: '#a7f3d0' },
  { id: 'sky', hex: '#bae6fd' },
  { id: 'violet', hex: '#e9d5ff' },
  { id: 'rose', hex: '#fecdd3' },
];

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isTrashView = false,
  onEdit,
  onTogglePin,
  onToggleReadOnly,
  onToggleTask,
  onArchive,
  onUnarchive,
  onMoveToTrash,
  onRestoreFromTrash,
  onRequestPermanentDelete,
  onChangeColor,
  isDark = false,
}) => {
  const [showColorMenu, setShowColorMenu] = useState(false);

  const colors = COLOR_MAP[note.color] || COLOR_MAP.default;

  // Clean HTML tags from content for preview
  const plainContent = note.content
    ? note.content.replace(/<[^>]*>?/gm, '').trim()
    : '';

  // Calculate task stats
  const totalTasks = note.tasks?.length || 0;
  const completedTasks = note.tasks?.filter((t) => t.completed).length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const hasOverdue = note.tasks?.some(
    (t) => !t.completed && evaluateTaskReminder(t).status === 'overdue'
  );
  const hasApproaching = note.tasks?.some(
    (t) => !t.completed && evaluateTaskReminder(t).status === 'approaching'
  );

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? colors.bgDark : colors.bgLight,
          borderColor: isDark ? colors.borderDark : colors.borderLight,
        },
      ]}
    >
      {/* Top Header: Title, List badge, Lock, Pin */}
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => !isTrashView && onEdit(note)}
          activeOpacity={0.8}
        >
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.noteTitle,
                isDark ? styles.textDark : styles.textLight,
                !note.title ? styles.untitledText : null,
              ]}
              numberOfLines={2}
            >
              {note.title || 'Sans titre'}
            </Text>

            {note.type === 'list' && (
              <View style={styles.listPill}>
                <CheckSquare size={11} color="#d97706" />
                <Text style={styles.listPillText}>Liste</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          {/* Read Only Lock toggle */}
          <TouchableOpacity
            onPress={() => onToggleReadOnly(note.id)}
            style={[
              styles.headerIconBtn,
              note.isReadOnly ? styles.lockActive : null,
            ]}
          >
            {note.isReadOnly ? (
              <Lock size={15} color="#d97706" />
            ) : (
              <Unlock size={15} color={isDark ? '#78716c' : '#a8a29e'} />
            )}
          </TouchableOpacity>

          {/* Pin toggle */}
          {!isTrashView && (
            <TouchableOpacity
              onPress={() => onTogglePin(note.id)}
              style={[
                styles.headerIconBtn,
                note.isPinned ? styles.pinActive : null,
              ]}
            >
              <Pin
                size={15}
                color={note.isPinned ? '#d97706' : (isDark ? '#78716c' : '#a8a29e')}
                fill={note.isPinned ? '#d97706' : 'none'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Progress Bar for Lists */}
      {note.type === 'list' && totalTasks > 0 && (
        <View style={[styles.progressBox, isDark ? styles.progressBoxDark : styles.progressBoxLight]}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressText, isDark ? styles.subDark : styles.subLight]}>
              <Text style={{ fontWeight: '700' }}>{completedTasks}/{totalTasks}</Text> complétée{completedTasks > 1 ? 's' : ''}
            </Text>
            <Text style={[styles.progressPercent, isDark ? styles.textDark : styles.textLight]}>
              {progressPercent}%
            </Text>
          </View>

          {/* Bar track */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor:
                    progressPercent === 100
                      ? '#10b981'
                      : hasOverdue
                      ? '#ef4444'
                      : hasApproaching
                      ? '#f59e0b'
                      : '#d97706',
                },
              ]}
            />
          </View>

          {/* Overdue/Approaching alert badge */}
          {hasOverdue ? (
            <View style={styles.urgencyAlertRow}>
              <AlertCircle size={12} color="#ef4444" />
              <Text style={styles.urgencyAlertTextRed}>Échéance dépassée sur cette liste</Text>
            </View>
          ) : hasApproaching ? (
            <View style={styles.urgencyAlertRow}>
              <Clock size={12} color="#f59e0b" />
              <Text style={styles.urgencyAlertTextAmber}>Rappel imminent programmé</Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Attached Images */}
      {note.images && note.images.length > 0 && (
        <TouchableOpacity
          onPress={() => !isTrashView && onEdit(note)}
          style={styles.imagesRow}
        >
          {note.images.map((img) => (
            <Image
              key={img.id}
              source={{ uri: img.url }}
              style={styles.previewImage}
            />
          ))}
        </TouchableOpacity>
      )}

      {/* Card Body */}
      {note.type === 'note' ? (
        <TouchableOpacity
          onPress={() => !isTrashView && onEdit(note)}
          activeOpacity={0.8}
          style={styles.bodyContent}
        >
          {plainContent ? (
            <Text
              style={[
                styles.noteBodyText,
                isDark ? styles.bodyTextDark : styles.bodyTextLight,
              ]}
              numberOfLines={6}
            >
              {plainContent}
            </Text>
          ) : (
            <Text style={[styles.emptyNoteText, isDark ? styles.subDark : styles.subLight]}>
              Note vide
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        /* Checklist items */
        <View style={styles.checklistContainer}>
          {note.tasks && note.tasks.length > 0 ? (
            note.tasks.slice(0, 6).map((task) => {
              const evalReminder = evaluateTaskReminder(task);
              const isApproaching = evalReminder.status === 'approaching';
              const isOverdue = evalReminder.status === 'overdue';

              return (
                <View
                  key={task.id}
                  style={[
                    styles.checkItemRow,
                    task.completed
                      ? (isDark ? styles.checkItemCompletedDark : styles.checkItemCompletedLight)
                      : isOverdue
                      ? (isDark ? styles.checkItemOverdueDark : styles.checkItemOverdueLight)
                      : isApproaching
                      ? (isDark ? styles.checkItemApproachingDark : styles.checkItemApproachingLight)
                      : (isDark ? styles.checkItemDefaultDark : styles.checkItemDefaultLight),
                  ]}
                >
                  {/* Interactive Checkbox */}
                  <TouchableOpacity
                    disabled={isTrashView || note.isReadOnly}
                    onPress={() => onToggleTask(note.id, task.id)}
                    style={[
                      styles.checkboxBtn,
                      task.completed ? styles.checkboxBtnChecked : null,
                    ]}
                  >
                    {task.completed && <CheckCircle2 size={15} color="#ffffff" />}
                  </TouchableOpacity>

                  {/* Task text (press to edit note) */}
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => !isTrashView && onEdit(note)}
                  >
                    <Text
                      style={[
                        styles.taskText,
                        task.completed
                          ? styles.taskTextCompleted
                          : (isDark ? styles.textDark : styles.textLight),
                      ]}
                      numberOfLines={1}
                    >
                      {task.text}
                    </Text>
                  </TouchableOpacity>

                  {/* Urgency / Priority flag */}
                  {task.priority === 'high' && !task.completed && (
                    <View style={styles.flagBadgeRed}>
                      <Flag size={9} color="#ef4444" fill="#ef4444" />
                      <Text style={styles.flagTextRed}>Urgent</Text>
                    </View>
                  )}

                  {task.priority === 'medium' && !task.completed && (
                    <View style={styles.flagBadgeAmber}>
                      <Flag size={9} color="#d97706" fill="#d97706" />
                      <Text style={styles.flagTextAmber}>Moyen</Text>
                    </View>
                  )}

                  {/* Relative time pill */}
                  {task.reminderTime && !task.completed && (
                    <View
                      style={[
                        styles.timePill,
                        isOverdue
                          ? styles.timePillRed
                          : isApproaching
                          ? styles.timePillAmber
                          : (isDark ? styles.timePillDark : styles.timePillLight),
                      ]}
                    >
                      {isOverdue ? (
                        <AlertCircle size={9} color="#b91c1c" />
                      ) : (
                        <Clock size={9} color="#b45309" />
                      )}
                      <Text
                        style={[
                          styles.timePillText,
                          isOverdue
                            ? styles.timeTextRed
                            : isApproaching
                            ? styles.timeTextAmber
                            : (isDark ? styles.subDark : styles.subLight),
                        ]}
                      >
                        {evalReminder.relativeLabel || evalReminder.formattedTarget}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={[styles.emptyNoteText, isDark ? styles.subDark : styles.subLight]}>
              Liste vide
            </Text>
          )}

          {note.tasks && note.tasks.length > 6 && (
            <TouchableOpacity onPress={() => !isTrashView && onEdit(note)}>
              <Text style={styles.moreTasksText}>
                + {note.tasks.length - 6} autre(s) tâche(s)...
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Color picker popup */}
      {showColorMenu && (
        <View
          style={[
            styles.colorMenuContainer,
            isDark ? styles.colorMenuDark : styles.colorMenuLight,
          ]}
        >
          {COLOR_SWATCHES.map((swatch) => (
            <TouchableOpacity
              key={swatch.id}
              onPress={() => {
                onChangeColor(note.id, swatch.id);
                setShowColorMenu(false);
              }}
              style={[
                styles.swatchCircle,
                { backgroundColor: swatch.hex },
                note.color === swatch.id ? styles.swatchActive : null,
              ]}
            />
          ))}
        </View>
      )}

      {/* Card Footer Actions */}
      <View style={[styles.cardFooter, isDark ? styles.footerDark : styles.footerLight]}>
        <Text style={[styles.dateText, isDark ? styles.subDark : styles.subLight]}>
          {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
          })}
        </Text>

        {isTrashView ? (
          /* Trash View Actions */
          <View style={styles.footerActions}>
            <TouchableOpacity
              onPress={() => onRestoreFromTrash(note.id)}
              style={styles.restoreBtn}
            >
              <RotateCcw size={13} color="#047857" />
              <Text style={styles.restoreBtnText}>Restaurer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onRequestPermanentDelete(note)}
              style={styles.deletePermBtn}
            >
              <Trash2 size={13} color="#b91c1c" />
              <Text style={styles.deletePermBtnText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Regular Note Card Actions */
          <View style={styles.footerActions}>
            {/* Color Palette button */}
            <TouchableOpacity
              onPress={() => setShowColorMenu(!showColorMenu)}
              style={styles.footerActionBtn}
            >
              <Palette size={16} color={isDark ? '#a8a29e' : '#78716c'} />
            </TouchableOpacity>

            {/* Archive / Unarchive */}
            <TouchableOpacity
              onPress={() => (note.isArchived ? onUnarchive(note.id) : onArchive(note.id))}
              style={styles.footerActionBtn}
            >
              <Archive size={16} color={isDark ? '#a8a29e' : '#78716c'} />
            </TouchableOpacity>

            {/* Trash button */}
            <TouchableOpacity
              onPress={() => onMoveToTrash(note.id)}
              style={styles.footerActionBtn}
            >
              <Trash2 size={16} color={isDark ? '#a8a29e' : '#78716c'} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  untitledText: {
    fontStyle: 'italic',
    color: '#a8a29e',
  },
  listPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  listPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#b45309',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerIconBtn: {
    padding: 5,
    borderRadius: 8,
  },
  lockActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  pinActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  progressBox: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  progressBoxLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  progressBoxDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  progressText: {
    fontSize: 11,
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#e7e5e4',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  urgencyAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  urgencyAlertTextRed: {
    fontSize: 10,
    fontWeight: '700',
    color: '#b91c1c',
  },
  urgencyAlertTextAmber: {
    fontSize: 10,
    fontWeight: '700',
    color: '#b45309',
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  bodyContent: {
    marginBottom: 8,
  },
  noteBodyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bodyTextLight: {
    color: '#44403c',
  },
  bodyTextDark: {
    color: '#d6d3d1',
  },
  emptyNoteText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  checklistContainer: {
    gap: 6,
    marginBottom: 8,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  checkItemDefaultLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  checkItemDefaultDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  checkItemCompletedLight: {
    backgroundColor: '#f5f5f4',
    borderColor: '#e7e5e4',
  },
  checkItemCompletedDark: {
    backgroundColor: '#1c1917',
    borderColor: '#292524',
  },
  checkItemOverdueLight: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  checkItemOverdueDark: {
    backgroundColor: 'rgba(76, 5, 25, 0.3)',
    borderColor: '#881337',
  },
  checkItemApproachingLight: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  checkItemApproachingDark: {
    backgroundColor: 'rgba(120, 53, 15, 0.3)',
    borderColor: '#78350f',
  },
  checkboxBtn: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#a8a29e',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBtnChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  taskText: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
    color: '#a8a29e',
  },
  flagBadgeRed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  flagTextRed: {
    fontSize: 9,
    fontWeight: '800',
    color: '#b91c1c',
  },
  flagBadgeAmber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  flagTextAmber: {
    fontSize: 9,
    fontWeight: '800',
    color: '#b45309',
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  timePillLight: {
    backgroundColor: '#f5f5f4',
    borderColor: '#e7e5e4',
  },
  timePillDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  timePillRed: {
    backgroundColor: '#ffe4e6',
    borderColor: '#fecdd3',
  },
  timePillAmber: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  timePillText: {
    fontSize: 9,
    fontWeight: '700',
  },
  timeTextRed: {
    color: '#b91c1c',
  },
  timeTextAmber: {
    color: '#b45309',
  },
  moreTasksText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d97706',
    marginTop: 2,
  },
  colorMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 4,
  },
  colorMenuLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  colorMenuDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  swatchCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#d6d3d1',
  },
  swatchActive: {
    borderWidth: 2.5,
    borderColor: '#d97706',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    marginTop: 4,
  },
  footerLight: {
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  footerDark: {
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  dateText: {
    fontSize: 10,
    fontWeight: '500',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerActionBtn: {
    padding: 4,
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  restoreBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  deletePermBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deletePermBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b91c1c',
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
