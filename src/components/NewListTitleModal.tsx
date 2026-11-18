import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CheckSquare, X } from '../SVG';

interface NewListTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  isDark?: boolean;
}

export const NewListTitleModal: React.FC<NewListTitleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isDark = false,
}) => {
  const [title, setTitle] = useState('');

  const handleConfirm = () => {
    const finalTitle = title.trim() || 'Nouvelle Liste';
    onSubmit(finalTitle);
    setTitle('');
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View
          style={[
            styles.modalContent,
            isDark ? styles.modalDark : styles.modalLight,
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <CheckSquare size={18} color="#d97706" />
              </View>
              <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
                Nouvelle Liste de Tâches
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={isDark ? '#a8a29e' : '#78716c'} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={[styles.description, isDark ? styles.subDark : styles.subLight]}>
            Donnez un nom à votre liste pour organiser vos tâches et échéances.
          </Text>

          {/* Input */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex : Courses du weekend, Projet A..."
            placeholderTextColor={isDark ? '#78716c' : '#a8a29e'}
            autoFocus
            style={[
              styles.input,
              isDark ? styles.inputDark : styles.inputLight,
            ]}
          />

          {/* Actions */}
          <View style={styles.actionRow}>
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

            <TouchableOpacity onPress={handleConfirm} style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Créer la liste</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  modalDark: {
    backgroundColor: '#1c1917',
    borderColor: '#292524',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  description: {
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 16,
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 20,
  },
  inputLight: {
    backgroundColor: '#fafaf9',
    borderColor: '#d6d3d1',
    color: '#1c1917',
  },
  inputDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
    color: '#f5f5f4',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelBtnLight: {
    backgroundColor: '#f5f5f4',
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
  submitBtn: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  submitBtnText: {
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
