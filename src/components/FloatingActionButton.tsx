import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Plus, StickyNote, CheckSquare, X } from '../SVG';

interface FloatingActionButtonProps {
  onCreateNote: () => void;
  onCreateList: () => void;
  isDark?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onCreateNote,
  onCreateList,
  isDark = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu Options Modal/Overlay */}
      {isOpen && (
        <Modal transparent animationType="fade" visible={isOpen} onRequestClose={() => setIsOpen(false)}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          >
            <View style={styles.menuContainer}>
              {/* Option 1: Nouvelle Note */}
              <TouchableOpacity
                onPress={() => {
                  setIsOpen(false);
                  onCreateNote();
                }}
                style={[
                  styles.optionBtn,
                  isDark ? styles.optionBtnDark : styles.optionBtnLight,
                ]}
                activeOpacity={0.8}
              >
                <View style={[styles.optionIconBox, { backgroundColor: isDark ? '#292524' : '#f5f5f4' }]}>
                  <StickyNote size={18} color="#d97706" />
                </View>
                <Text style={[styles.optionText, isDark ? styles.textDark : styles.textLight]}>
                  Nouvelle Note
                </Text>
              </TouchableOpacity>

              {/* Option 2: Nouvelle Liste */}
              <TouchableOpacity
                onPress={() => {
                  setIsOpen(false);
                  onCreateList();
                }}
                style={[
                  styles.optionBtn,
                  isDark ? styles.optionBtnDark : styles.optionBtnLight,
                ]}
                activeOpacity={0.8}
              >
                <View style={[styles.optionIconBox, { backgroundColor: '#fef3c7' }]}>
                  <CheckSquare size={18} color="#b45309" />
                </View>
                <Text style={[styles.optionText, isDark ? styles.textDark : styles.textLight]}>
                  Nouvelle Liste
                </Text>
              </TouchableOpacity>

              {/* Close / Action FAB button in modal */}
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeFab}
                activeOpacity={0.85}
              >
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Main Bottom Right FAB */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          style={styles.fab}
          activeOpacity={0.85}
        >
          <Plus size={26} color="#ffffff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    zIndex: 40,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 24,
    paddingRight: 20,
  },
  menuContainer: {
    alignItems: 'flex-end',
    gap: 12,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  optionBtnLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  optionBtnDark: {
    backgroundColor: '#1c1917',
    borderColor: '#44403c',
  },
  optionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  closeFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#78716c',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  textLight: {
    color: '#1c1917',
  },
  textDark: {
    color: '#f5f5f4',
  },
});
