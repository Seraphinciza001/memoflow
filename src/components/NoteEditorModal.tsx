import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  X,
  Check,
  Plus,
  Trash2,
  Clock,
  Pin,
  Lock,
  Unlock,
  CheckSquare,
  FileText,
  Sparkles,
  Flag,
  Palette,
} from '../SVG';
import { NoteItem, TaskItem, NoteColor, NoteType } from '../types';
import { addMinutesToTime, getQuickTimePresets } from '../utils/time';
import { DecorationsAndFontsModal } from './DecorationsAndFontsModal';

interface NoteEditorModalProps {
  note: NoteItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedNote: NoteItem) => void;
  isDark?: boolean;
}

const COLOR_OPTIONS: NoteColor[] = [
  'default',
  'amber',
  'sand',
  'emerald',
  'sky',
  'violet',
  'rose',
];

const COLOR_MAP: Record<NoteColor, { hex: string; name: string }> = {
  default: { hex: '#f5f5f4', name: 'Par défaut' },
  amber: { hex: '#fde68a', name: 'Ambre' },
  sand: { hex: '#fed7aa', name: 'Sable' },
  emerald: { hex: '#a7f3d0', name: 'Émeraude' },
  sky: { hex: '#bae6fd', name: 'Ciel' },
  violet: { hex: '#e9d5ff', name: 'Violet' },
  rose: { hex: '#fecdd3', name: 'Rose' },
};

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  isDark = false,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [color, setColor] = useState<NoteColor>('default');
  const [isPinned, setIsPinned] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [type, setType] = useState<NoteType>('note');

  // New task input state
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskIsUrgent, setNewTaskIsUrgent] = useState(false);
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Decorations modal state
  const [isDecorModalOpen, setIsDecorModalOpen] = useState(false);
  const [decorTarget, setDecorTarget] = useState<'title' | 'content'>('title');

  // Initialize values when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      // Strip html if present for text editing
      setContent(note.content ? note.content.replace(/<[^>]*>?/gm, '').trim() : '');
      setTasks(note.tasks ? [...note.tasks] : []);
      setColor(note.color || 'default');
      setIsPinned(note.isPinned || false);
      setIsReadOnly(note.isReadOnly || false);
      setType(note.type || 'note');
    } else {
      setTitle('');
      setContent('');
      setTasks([]);
      setColor('default');
      setIsPinned(false);
      setIsReadOnly(false);
      setType('note');
    }
  }, [note, isOpen]);

  if (!isOpen || !note) return null;

  const handleSave = () => {
    const updated: NoteItem = {
      ...note,
      title: title.trim(),
      content: content.trim(),
      tasks,
      color,
      isPinned,
      isReadOnly,
      type,
      updatedAt: Date.now(),
    };
    onSave(updated);
    onClose();
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const assignedTime = newTaskTime || (newTaskIsUrgent ? addMinutesToTime(5) : undefined);
    const newTask: TaskItem = {
      id: `t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: newTaskText.trim(),
      completed: false,
      reminderTime: assignedTime,
      isUrgent: newTaskIsUrgent,
      priority: newTaskIsUrgent ? 'high' : newTaskPriority,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setNewTaskTime('');
    setNewTaskIsUrgent(false);
    setNewTaskPriority('medium');
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
          : t
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleInsertDecoratedText = (text: string) => {
    if (decorTarget === 'title') {
      setTitle(text);
    } else {
      setContent(content ? `${content}\n${text}` : text);
    }
  };

  const presets = getQuickTimePresets();

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View
          style={[
            styles.modalContainer,
            isDark ? styles.modalDark : styles.modalLight,
          ]}
        >
          {/* Header Toolbar */}
          <View
            style={[
              styles.headerBar,
              isDark ? styles.headerDark : styles.headerLight,
            ]}
          >
            <View style={styles.headerLeftGroup}>
              {/* Type Switcher */}
              <View style={styles.typeSwitcher}>
                <TouchableOpacity
                  onPress={() => setType('note')}
                  style={[
                    styles.typeBtn,
                    type === 'note' ? styles.typeBtnActive : null,
                  ]}
                >
                  <FileText size={14} color={type === 'note' ? '#d97706' : (isDark ? '#a8a29e' : '#78716c')} />
                  <Text
                    style={[
                      styles.typeBtnText,
                      type === 'note' ? styles.typeTextActive : (isDark ? styles.subDark : styles.subLight),
                    ]}
                  >
                    Note
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setType('list')}
                  style={[
                    styles.typeBtn,
                    type === 'list' ? styles.typeBtnActive : null,
                  ]}
                >
                  <CheckSquare size={14} color={type === 'list' ? '#d97706' : (isDark ? '#a8a29e' : '#78716c')} />
                  <Text
                    style={[
                      styles.typeBtnText,
                      type === 'list' ? styles.typeTextActive : (isDark ? styles.subDark : styles.subLight),
                    ]}
                  >
                    Liste
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Header Right Actions */}
            <View style={styles.headerRightGroup}>
              {/* Lock Read Only */}
              <TouchableOpacity
                onPress={() => setIsReadOnly(!isReadOnly)}
                style={[
                  styles.iconToolBtn,
                  isReadOnly ? styles.iconToolActive : null,
                ]}
              >
                {isReadOnly ? (
                  <Lock size={16} color="#d97706" />
                ) : (
                  <Unlock size={16} color={isDark ? '#a8a29e' : '#78716c'} />
                )}
              </TouchableOpacity>

              {/* Pin */}
              <TouchableOpacity
                onPress={() => setIsPinned(!isPinned)}
                style={[
                  styles.iconToolBtn,
                  isPinned ? styles.iconToolActive : null,
                ]}
              >
                <Pin
                  size={16}
                  color={isPinned ? '#d97706' : (isDark ? '#a8a29e' : '#78716c')}
                  fill={isPinned ? '#d97706' : 'none'}
                />
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={19} color={isDark ? '#e7e5e4' : '#292524'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Color Palettes Bar */}
          <View style={styles.colorBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {COLOR_OPTIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: COLOR_MAP[c].hex },
                    color === c ? styles.colorCircleActive : null,
                  ]}
                />
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.scrollArea}>
            {/* Title Input Row with Sparkles button for decorations */}
            <View style={styles.titleInputRow}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Titre de la note..."
                placeholderTextColor={isDark ? '#78716c' : '#a8a29e'}
                style={[
                  styles.titleInput,
                  isDark ? styles.textDark : styles.textLight,
                ]}
              />

              <TouchableOpacity
                onPress={() => {
                  setDecorTarget('title');
                  setIsDecorModalOpen(true);
                }}
                style={styles.sparkleBtn}
              >
                <Sparkles size={17} color="#d97706" />
              </TouchableOpacity>
            </View>

            {/* Note Content (if type is note) */}
            {type === 'note' && (
              <View style={styles.noteContentSection}>
                <View style={styles.contentToolbar}>
                  <TouchableOpacity
                    onPress={() => {
                      setDecorTarget('content');
                      setIsDecorModalOpen(true);
                    }}
                    style={styles.insertDecorBtn}
                  >
                    <Sparkles size={14} color="#d97706" />
                    <Text style={styles.insertDecorText}>Insérer décors / bordures</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="Écrivez votre note ici..."
                  placeholderTextColor={isDark ? '#78716c' : '#a8a29e'}
                  multiline
                  style={[
                    styles.contentInput,
                    isDark ? styles.contentInputDark : styles.contentInputLight,
                  ]}
                />
              </View>
            )}

            {/* Task Checklist (if type is list) */}
            {type === 'list' && (
              <View style={styles.taskListSection}>
                {/* List items */}
                {tasks.map((task) => (
                  <View
                    key={task.id}
                    style={[
                      styles.taskItemRow,
                      task.completed
                        ? (isDark ? styles.taskRowDoneDark : styles.taskRowDoneLight)
                        : (isDark ? styles.taskRowDark : styles.taskRowLight),
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleToggleTask(task.id)}
                      style={[
                        styles.taskCheckBtn,
                        task.completed ? styles.taskCheckDone : null,
                      ]}
                    >
                      {task.completed && <Check size={13} color="#ffffff" />}
                    </TouchableOpacity>

                    <Text
                      style={[
                        styles.taskItemText,
                        task.completed ? styles.taskItemDoneText : (isDark ? styles.textDark : styles.textLight),
                      ]}
                    >
                      {task.text}
                    </Text>

                    {task.isUrgent && (
                      <View style={styles.urgentFlagPill}>
                        <Flag size={9} color="#ef4444" fill="#ef4444" />
                        <Text style={styles.urgentFlagText}>5m</Text>
                      </View>
                    )}

                    {task.reminderTime && (
                      <View style={styles.timePill}>
                        <Clock size={10} color="#b45309" />
                        <Text style={styles.timePillText}>{task.reminderTime}</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      onPress={() => handleDeleteTask(task.id)}
                      style={styles.deleteTaskBtn}
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Add new task input box */}
                <View
                  style={[
                    styles.addTaskBox,
                    isDark ? styles.addTaskBoxDark : styles.addTaskBoxLight,
                  ]}
                >
                  <TextInput
                    value={newTaskText}
                    onChangeText={setNewTaskText}
                    placeholder="Ajouter une nouvelle tâche..."
                    placeholderTextColor={isDark ? '#78716c' : '#a8a29e'}
                    onSubmitEditing={handleAddTask}
                    style={[
                      styles.addTaskInput,
                      isDark ? styles.textDark : styles.textLight,
                    ]}
                  />

                  {/* Custom Time & Urgent Flag */}
                  <View style={styles.timeInputRow}>
                    <View
                      style={[
                        styles.customTimeBox,
                        isDark ? styles.customTimeBoxDark : styles.customTimeBoxLight,
                      ]}
                    >
                      <Clock size={12} color={isDark ? '#fbbf24' : '#d97706'} />
                      <TextInput
                        value={newTaskTime}
                        onChangeText={setNewTaskTime}
                        placeholder="Heure exacte (ex: 14:00)"
                        placeholderTextColor={isDark ? '#78716c' : '#a8a29e'}
                        style={[
                          styles.customTimeInputText,
                          isDark ? styles.textDark : styles.textLight,
                        ]}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        const nextUrgent = !newTaskIsUrgent;
                        setNewTaskIsUrgent(nextUrgent);
                        if (nextUrgent && !newTaskTime) {
                          setNewTaskTime(addMinutesToTime(5));
                        }
                      }}
                      style={[
                        styles.presetPill,
                        newTaskIsUrgent ? styles.urgentPillActive : null,
                      ]}
                    >
                      <Flag size={11} color={newTaskIsUrgent ? '#ffffff' : '#ef4444'} />
                      <Text
                        style={[
                          styles.presetPillText,
                          newTaskIsUrgent ? { color: '#ffffff', fontWeight: '800' } : { color: '#ef4444' },
                        ]}
                      >
                        Urgent ⚡ (5 min)
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Task options row: Time presets */}
                  <View style={styles.addTaskOptions}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {presets.map((p) => (
                        <TouchableOpacity
                          key={p.label}
                          onPress={() => setNewTaskTime(newTaskTime === p.time ? '' : p.time)}
                          style={[
                            styles.presetPill,
                            newTaskTime === p.time ? styles.timePillActive : null,
                          ]}
                        >
                          <Clock size={11} color={newTaskTime === p.time ? '#ffffff' : '#d97706'} />
                          <Text
                            style={[
                              styles.presetPillText,
                              newTaskTime === p.time ? { color: '#ffffff', fontWeight: '700' } : null,
                            ]}
                          >
                            {p.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <TouchableOpacity
                    onPress={handleAddTask}
                    style={styles.addTaskConfirmBtn}
                  >
                    <Plus size={16} color="#ffffff" strokeWidth={2.5} />
                    <Text style={styles.addTaskConfirmText}>Ajouter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom Footer Actions */}
          <View
            style={[
              styles.footerBar,
              isDark ? styles.footerDark : styles.footerLight,
            ]}
          >
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.cancelBtn,
                isDark ? styles.cancelBtnDark : styles.cancelBtnLight,
              ]}
            >
              <Text style={[styles.cancelBtnText, isDark ? styles.subDark : styles.subLight]}>
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Check size={16} color="#ffffff" strokeWidth={2.5} />
              <Text style={styles.saveBtnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Child Decorations and Fonts Modal */}
      <DecorationsAndFontsModal
        isOpen={isDecorModalOpen}
        onClose={() => setIsDecorModalOpen(false)}
        onInsertText={handleInsertDecoratedText}
        isDark={isDark}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '92%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  modalLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  modalDark: {
    backgroundColor: '#1c1917',
    borderColor: '#292524',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLight: {
    backgroundColor: '#fafaf9',
    borderBottomColor: '#e7e5e4',
  },
  headerDark: {
    backgroundColor: '#141210',
    borderBottomColor: '#292524',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 3,
  },
  typeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeTextActive: {
    color: '#d97706',
    fontWeight: '700',
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconToolBtn: {
    padding: 6,
    borderRadius: 8,
  },
  iconToolActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
  },
  colorBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#d6d3d1',
  },
  colorCircleActive: {
    borderWidth: 2.5,
    borderColor: '#d97706',
  },
  scrollArea: {
    flex: 1,
    padding: 16,
  },
  titleInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 6,
  },
  sparkleBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteContentSection: {
    gap: 8,
  },
  contentToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  insertDecorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  insertDecorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  contentInput: {
    fontSize: 14,
    lineHeight: 22,
    minHeight: 180,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    textAlignVertical: 'top',
  },
  contentInputLight: {
    backgroundColor: '#fafaf9',
    borderColor: '#e7e5e4',
    color: '#1c1917',
  },
  contentInputDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
    color: '#f5f5f4',
  },
  taskListSection: {
    gap: 8,
  },
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  taskRowLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  taskRowDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  taskRowDoneLight: {
    backgroundColor: '#f5f5f4',
    borderColor: '#e7e5e4',
  },
  taskRowDoneDark: {
    backgroundColor: '#1c1917',
    borderColor: '#292524',
  },
  taskCheckBtn: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#a8a29e',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckDone: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  taskItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  taskItemDoneText: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
    color: '#a8a29e',
  },
  urgentFlagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  urgentFlagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#b91c1c',
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  timePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#b45309',
  },
  deleteTaskBtn: {
    padding: 4,
  },
  addTaskBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
    gap: 10,
  },
  addTaskBoxLight: {
    backgroundColor: '#fafaf9',
    borderColor: '#e7e5e4',
  },
  addTaskBoxDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  addTaskInput: {
    fontSize: 13,
    paddingVertical: 4,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
  },
  customTimeBoxLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  customTimeBoxDark: {
    backgroundColor: '#1c1917',
    borderColor: '#44403c',
  },
  customTimeInputText: {
    fontSize: 12,
    flex: 1,
    paddingVertical: 2,
  },
  addTaskOptions: {
    flexDirection: 'row',
  },
  presetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: 6,
  },
  urgentPillActive: {
    backgroundColor: '#dc2626',
  },
  timePillActive: {
    backgroundColor: '#f59e0b',
  },
  presetPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  addTaskConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    borderRadius: 10,
  },
  addTaskConfirmText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  footerBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  footerLight: {
    backgroundColor: '#fafaf9',
    borderTopColor: '#e7e5e4',
  },
  footerDark: {
    backgroundColor: '#141210',
    borderTopColor: '#292524',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelBtnLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  cancelBtnDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
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
