import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Trash2, AlertCircle, X } from '../SVG';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDark?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDark = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
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
                <Trash2 size={18} color="#dc2626" />
              </View>
              <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
                {title || 'Confirmation'}
              </Text>
            </View>

            <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
              <X size={18} color={isDark ? '#a8a29e' : '#78716c'} />
            </TouchableOpacity>
          </View>

          {/* Message */}
          <View style={styles.messageBox}>
            <AlertCircle size={16} color="#dc2626" style={{ marginTop: 2 }} />
            <Text style={[styles.messageText, isDark ? styles.subDark : styles.subLight]}>
              {message}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={onCancel}
              style={[
                styles.cancelBtn,
                isDark ? styles.cancelBtnDark : styles.cancelBtnLight,
              ]}
            >
              <Text style={[styles.cancelBtnText, isDark ? styles.subDark : styles.subLight]}>
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} style={styles.confirmBtn}>
              <Trash2 size={14} color="#ffffff" />
              <Text style={styles.confirmBtnText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
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
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
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
  messageBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 12,
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  actionsRow: {
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
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dc2626',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  confirmBtnText: {
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
