import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { Database, X, RotateCcw, Copy } from '../SVG';
import { NoteItem, AppSettings } from '../types';
import { computeDatabaseStats, getFullJsonDatabase } from '../utils/storage';

interface JsonDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NoteItem[];
  settings: AppSettings;
  onImportDatabase: (importedData: any) => void;
  onResetToSeeds: () => void;
  isDark?: boolean;
}

export const JsonDatabaseModal: React.FC<JsonDatabaseModalProps> = ({
  isOpen,
  onClose,
  notes,
  settings,
  onResetToSeeds,
  isDark = false,
}) => {
  if (!isOpen) return null;

  const stats = computeDatabaseStats(notes);
  const fullDb = getFullJsonDatabase(notes, settings);

  const handleShareJson = async () => {
    try {
      await Share.share({
        title: 'Export Base JSON Agenda',
        message: JSON.stringify(fullDb, null, 2),
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  const handleConfirmReset = () => {
    Alert.alert(
      'Réinitialiser aux exemples initiaux ?',
      'Cette action restaurera les données d\'exemple par défaut.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            onResetToSeeds();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
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
                <Database size={20} color="#d97706" />
              </View>
              <View>
                <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
                  Base de Données JSON
                </Text>
                <Text style={[styles.headerSub, isDark ? styles.subDark : styles.subLight]}>
                  Statistiques & Stockage Local
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={isDark ? '#e7e5e4' : '#292524'} />
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <ScrollView style={styles.scrollArea}>
            <Text style={[styles.sectionTitle, isDark ? styles.subDark : styles.subLight]}>
              STATISTIQUES DE LA BASE
            </Text>

            <View style={styles.statsGrid}>
              <View style={[styles.statCard, isDark ? styles.cardDark : styles.cardLight]}>
                <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>
                  {stats.totalNotes}
                </Text>
                <Text style={[styles.statLabel, isDark ? styles.subDark : styles.subLight]}>
                  Total Notes & Listes
                </Text>
              </View>

              <View style={[styles.statCard, isDark ? styles.cardDark : styles.cardLight]}>
                <Text style={[styles.statValue, { color: '#10b981' }]}>
                  {stats.activeNotes}
                </Text>
                <Text style={[styles.statLabel, isDark ? styles.subDark : styles.subLight]}>
                  Notes Actives
                </Text>
              </View>

              <View style={[styles.statCard, isDark ? styles.cardDark : styles.cardLight]}>
                <Text style={[styles.statValue, { color: '#f59e0b' }]}>
                  {stats.tasksCount}
                </Text>
                <Text style={[styles.statLabel, isDark ? styles.subDark : styles.subLight]}>
                  Total Tâches
                </Text>
              </View>

              <View style={[styles.statCard, isDark ? styles.cardDark : styles.cardLight]}>
                <Text style={[styles.statValue, { color: '#06b6d4' }]}>
                  {stats.completedTasksCount}
                </Text>
                <Text style={[styles.statLabel, isDark ? styles.subDark : styles.subLight]}>
                  Tâches Complétées
                </Text>
              </View>

              <View style={[styles.statCard, isDark ? styles.cardDark : styles.cardLight]}>
                <Text style={[styles.statValue, { color: '#ea580c' }]}>
                  {stats.remindersCount}
                </Text>
                <Text style={[styles.statLabel, isDark ? styles.subDark : styles.subLight]}>
                  Rappels Actifs
                </Text>
              </View>

              <View style={[styles.statCard, isDark ? styles.cardDark : styles.cardLight]}>
                <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>
                  {stats.listsCount}
                </Text>
                <Text style={[styles.statLabel, isDark ? styles.subDark : styles.subLight]}>
                  Listes
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsSection}>
              <TouchableOpacity
                onPress={handleShareJson}
                style={[
                  styles.actionBtn,
                  isDark ? styles.actionBtnDark : styles.actionBtnLight,
                ]}
              >
                <Copy size={16} color="#d97706" />
                <Text style={[styles.actionBtnText, isDark ? styles.textDark : styles.textLight]}>
                  Partager / Exporter le JSON
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmReset}
                style={[
                  styles.actionBtn,
                  isDark ? styles.actionBtnDark : styles.actionBtnLight,
                ]}
              >
                <RotateCcw size={16} color="#ef4444" />
                <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>
                  Réinitialiser aux exemples initiaux
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footerRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeFooterBtn}>
              <Text style={styles.closeFooterText}>Fermer</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '80%',
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
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
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  scrollArea: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#fafaf9',
    borderColor: '#e7e5e4',
  },
  cardDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionsSection: {
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionBtnLight: {
    backgroundColor: '#fafaf9',
    borderColor: '#e7e5e4',
  },
  actionBtnDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeFooterBtn: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  closeFooterText: {
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
