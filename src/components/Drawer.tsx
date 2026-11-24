import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import {
  StickyNote,
  Bell,
  Archive,
  Trash2,
  ShieldCheck,
  Download,
  Upload,
  X,
  BookOpen,
  Database,
  Sun,
  Moon,
} from '../SVG';
import { DrawerTab, NoteItem, ThemeMode, JsonDatabase } from '../types';
import { getFullJsonDatabase, loadSettings } from '../utils/storage';
import { sendTestNotification, sendDelayed10sTestNotification } from '../utils/notifications';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: DrawerTab;
  onSelectTab: (tab: DrawerTab) => void;
  notes: NoteItem[];
  onImportNotes: (importedData: JsonDatabase | NoteItem[]) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenJsonDbModal: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  notes,
  onImportNotes,
  theme,
  onToggleTheme,
  onOpenJsonDbModal,
}) => {
  const isDark = theme === 'dark';

  const activeNotesCount = notes.filter((n) => !n.isDeleted && !n.isArchived).length;
  const remindersCount = notes.filter(
    (n) => !n.isDeleted && !n.isArchived && n.tasks?.some((t) => !t.completed && Boolean(t.reminderTime))
  ).length;
  const archiveCount = notes.filter((n) => !n.isDeleted && n.isArchived).length;
  const trashCount = notes.filter((n) => n.isDeleted).length;

  const handleExport = async () => {
    try {
      const s = await loadSettings();
      const db = getFullJsonDatabase(notes, s);
      const jsonStr = JSON.stringify(db, null, 2);
      await Share.share({
        title: 'Export Base de données MemoFlow',
        message: jsonStr,
      });
    } catch (err) {
      console.warn('Erreur export share:', err);
    }
  };

  const handleImportPrompt = () => {
    Alert.prompt
      ? Alert.prompt(
          'Importer une base JSON',
          'Collez le contenu JSON complet de votre base de données ci-dessous :',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Importer',
              onPress: (text?: string) => {
                if (!text) return;
                try {
                  const parsed = JSON.parse(text);
                  onImportNotes(parsed);
                  Alert.alert('Succès', 'Les données ont été importées avec succès.');
                } catch {
                  Alert.alert('Erreur', 'Format JSON invalide.');
                }
              },
            },
          ]
        )
      : Alert.alert(
          'Importer une base JSON',
          'Veuillez utiliser la modale Base de données JSON pour gérer vos sauvegardes.',
          [
            { text: 'Fermer' },
            {
              text: 'Ouvrir Base JSON',
              onPress: () => {
                onClose();
                onOpenJsonDbModal();
              },
            },
          ]
        );
  };

  const navItems: Array<{
    id: DrawerTab;
    label: string;
    icon: React.FC<any>;
    count: number;
    color: string;
  }> = [
    { id: 'notes', label: 'Notes & Listes', icon: StickyNote, count: activeNotesCount, color: '#d97706' },
    { id: 'reminders', label: 'Rappels & Alertes', icon: Bell, count: remindersCount, color: '#ea580c' },
    { id: 'archive', label: 'Archives', icon: Archive, count: archiveCount, color: '#78716c' },
    { id: 'trash', label: 'Corbeille', icon: Trash2, count: trashCount, color: '#ef4444' },
  ];

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Drawer Panel */}
        <View
          style={[
            styles.drawerContent,
            isDark ? styles.drawerDark : styles.drawerLight,
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.drawerHeader,
              isDark ? styles.headerDark : styles.headerLight,
            ]}
          >
            <View style={styles.headerTitleGroup}>
              <View style={styles.appIconWrapper}>
                <Image
                  source={require('../../assets/memoflow-logo.png')}
                  style={{ width: 34, height: 34, borderRadius: 10 }}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text
                  style={[
                    styles.appName,
                    isDark ? styles.textDark : styles.textLight,
                  ]}
                >
                  MemoFlow
                </Text>
                <Text
                  style={[
                    styles.appSub,
                    isDark ? styles.subDark : styles.subLight,
                  ]}
                >
                  Stockage local & Rappels Push
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                isDark ? styles.closeBtnDark : styles.closeBtnLight,
              ]}
            >
              <X size={18} color={isDark ? '#e7e5e4' : '#292524'} />
            </TouchableOpacity>
          </View>

          {/* Navigation Links */}
          <ScrollView style={styles.scrollArea}>
            <Text
              style={[
                styles.sectionHeading,
                isDark ? styles.subDark : styles.subLight,
              ]}
            >
              NAVIGATION
            </Text>

            <View style={styles.navGroup}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    style={[
                      styles.navItem,
                      isActive
                        ? (isDark ? styles.navItemActiveDark : styles.navItemActiveLight)
                        : null,
                    ]}
                  >
                    <View style={styles.navItemLeft}>
                      <Icon
                        size={19}
                        color={
                          isActive
                            ? '#d97706'
                            : (isDark ? '#a8a29e' : '#78716c')
                        }
                      />
                      <Text
                        style={[
                          styles.navItemLabel,
                          isActive
                            ? (isDark ? styles.navLabelActiveDark : styles.navLabelActiveLight)
                            : (isDark ? styles.textDark : styles.textLight),
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    {item.count > 0 && (
                      <View
                        style={[
                          styles.countBadge,
                          isActive
                            ? (isDark ? styles.countBadgeActiveDark : styles.countBadgeActiveLight)
                            : (isDark ? styles.countBadgeDark : styles.countBadgeLight),
                        ]}
                      >
                        <Text
                          style={[
                            styles.countText,
                            isActive
                              ? (isDark ? styles.countTextActiveDark : styles.countTextActiveLight)
                              : (isDark ? styles.subDark : styles.subLight),
                          ]}
                        >
                          {item.count}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={[
                styles.sectionHeading,
                isDark ? styles.subDark : styles.subLight,
                { marginTop: 24 },
              ]}
            >
              PRÉFÉRENCES & SAUVEGARDES
            </Text>

            {/* Theme Toggle */}
            <TouchableOpacity
              onPress={onToggleTheme}
              style={[
                styles.actionItem,
                isDark ? styles.actionItemDark : styles.actionItemLight,
              ]}
            >
              <View style={styles.navItemLeft}>
                {isDark ? (
                  <Sun size={19} color="#fbbf24" />
                ) : (
                  <Moon size={19} color="#78716c" />
                )}
                <Text
                  style={[
                    styles.navItemLabel,
                    isDark ? styles.textDark : styles.textLight,
                  ]}
                >
                  {isDark ? 'Mode Sombre' : 'Mode Clair'}
                </Text>
              </View>
              <View
                style={[
                  styles.smallBadge,
                  isDark ? styles.countBadgeDark : styles.countBadgeLight,
                ]}
              >
                <Text style={styles.smallBadgeText}>{isDark ? 'Sombre' : 'Clair'}</Text>
              </View>
            </TouchableOpacity>

            {/* Base de données JSON Manager */}
            <TouchableOpacity
              onPress={() => {
                onClose();
                onOpenJsonDbModal();
              }}
              style={[
                styles.actionItem,
                isDark ? styles.actionItemDark : styles.actionItemLight,
              ]}
            >
              <View style={styles.navItemLeft}>
                <Database size={19} color="#d97706" />
                <Text
                  style={[
                    styles.navItemLabel,
                    isDark ? styles.textDark : styles.textLight,
                  ]}
                >
                  Base de données JSON
                </Text>
              </View>
              <View style={styles.amberBadge}>
                <Text style={styles.amberBadgeText}>Gérer</Text>
              </View>
            </TouchableOpacity>

            {/* Tester les notifications Push */}
            <TouchableOpacity
              onPress={async () => {
                await sendTestNotification();
                Alert.alert(
                  'Notification Push Envoyée',
                  'Une alerte test MemoFlow immédiate avec sonnerie et bannière haute priorité a été déclenchée !'
                );
              }}
              style={[
                styles.actionItem,
                isDark ? styles.actionItemDark : styles.actionItemLight,
              ]}
            >
              <View style={styles.navItemLeft}>
                <Bell size={19} color="#2563eb" />
                <Text
                  style={[
                    styles.navItemLabel,
                    isDark ? styles.textDark : styles.textLight,
                  ]}
                >
                  Tester alerte immédiate
                </Text>
              </View>
              <View style={[styles.amberBadge, { backgroundColor: '#dbeafe' }]}>
                <Text style={[styles.amberBadgeText, { color: '#1d4ed8' }]}>Direct</Text>
              </View>
            </TouchableOpacity>

            {/* Tester alerte 10s (Test quand l'app est fermée) */}
            <TouchableOpacity
              onPress={async () => {
                await sendDelayed10sTestNotification();
                Alert.alert(
                  '⏰ Alerte programmée dans 10 secondes !',
                  'Ferme ou minimise maintenant MemoFlow (ou verrouille ton écran) : l\'alerte va sonner et afficher la bannière dans 10s !'
                );
              }}
              style={[
                styles.actionItem,
                isDark ? styles.actionItemDark : styles.actionItemLight,
              ]}
            >
              <View style={styles.navItemLeft}>
                <Clock size={19} color="#10b981" />
                <Text
                  style={[
                    styles.navItemLabel,
                    isDark ? styles.textDark : styles.textLight,
                  ]}
                >
                  Tester alerte app fermée
                </Text>
              </View>
              <View style={[styles.amberBadge, { backgroundColor: '#d1fae5' }]}>
                <Text style={[styles.amberBadgeText, { color: '#047857' }]}>Dans 10s</Text>
              </View>
            </TouchableOpacity>

            {/* Privacy Card */}
            <View
              style={[
                styles.privacyCard,
                isDark ? styles.privacyCardDark : styles.privacyCardLight,
              ]}
            >
              <ShieldCheck size={20} color="#10b981" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.privacyTitle,
                    isDark ? styles.privacyTitleDark : styles.privacyTitleLight,
                  ]}
                >
                  Fichier JSON Enregistré Localement
                </Text>
                <Text
                  style={[
                    styles.privacyText,
                    isDark ? styles.privacyTextDark : styles.privacyTextLight,
                  ]}
                >
                  Vos données sont sauvegardées en local sur cet appareil avec une confidentialité totale.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Drawer Footer Actions */}
          <View
            style={[
              styles.drawerFooter,
              isDark ? styles.footerDark : styles.footerLight,
            ]}
          >
            <Text
              style={[
                styles.footerHeading,
                isDark ? styles.subDark : styles.subLight,
              ]}
            >
              SAUVEGARDE
            </Text>

            <View style={styles.footerRow}>
              <TouchableOpacity
                onPress={handleExport}
                style={[
                  styles.footerBtn,
                  isDark ? styles.footerBtnDark : styles.footerBtnLight,
                ]}
              >
                <Download size={15} color={isDark ? '#e7e5e4' : '#292524'} />
                <Text
                  style={[
                    styles.footerBtnText,
                    isDark ? styles.textDark : styles.textLight,
                  ]}
                >
                  Exporter
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleImportPrompt}
                style={[
                  styles.footerBtn,
                  isDark ? styles.footerBtnDark : styles.footerBtnLight,
                ]}
              >
                <Upload size={15} color={isDark ? '#e7e5e4' : '#292524'} />
                <Text
                  style={[
                    styles.footerBtnText,
                    isDark ? styles.textDark : styles.textLight,
                  ]}
                >
                  Importer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  drawerContent: {
    width: '82%',
    maxWidth: 320,
    height: '100%',
    zIndex: 10,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  drawerLight: {
    backgroundColor: '#ffffff',
  },
  drawerDark: {
    backgroundColor: '#1c1917',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 45,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerLight: {
    backgroundColor: '#fafaf9',
    borderBottomColor: '#f5f5f4',
  },
  headerDark: {
    backgroundColor: '#141210',
    borderBottomColor: '#292524',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0B192C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  appSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
  },
  closeBtnLight: {
    backgroundColor: '#f5f5f4',
  },
  closeBtnDark: {
    backgroundColor: '#292524',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 16,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  navGroup: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
  },
  navItemActiveLight: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  navItemActiveDark: {
    backgroundColor: 'rgba(120, 53, 15, 0.35)',
    borderWidth: 1,
    borderColor: '#78350f',
  },
  navItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navItemLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  navLabelActiveLight: {
    color: '#92400e',
    fontWeight: '700',
  },
  navLabelActiveDark: {
    color: '#fde68a',
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeLight: {
    backgroundColor: '#f5f5f4',
  },
  countBadgeDark: {
    backgroundColor: '#292524',
  },
  countBadgeActiveLight: {
    backgroundColor: '#fde68a',
  },
  countBadgeActiveDark: {
    backgroundColor: '#78350f',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  countTextActiveLight: {
    color: '#92400e',
  },
  countTextActiveDark: {
    color: '#fde68a',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  actionItemLight: {
    backgroundColor: '#ffffff',
  },
  actionItemDark: {
    backgroundColor: '#1c1917',
  },
  smallBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  smallBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#78716c',
  },
  amberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#fef3c7',
  },
  amberBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#b45309',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 18,
    marginBottom: 20,
  },
  privacyCardLight: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  privacyCardDark: {
    backgroundColor: 'rgba(6, 78, 59, 0.25)',
    borderColor: '#065f46',
  },
  privacyTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  privacyTitleLight: {
    color: '#065f46',
  },
  privacyTitleDark: {
    color: '#6ee7b7',
  },
  privacyText: {
    fontSize: 10,
    lineHeight: 14,
  },
  privacyTextLight: {
    color: '#047857',
  },
  privacyTextDark: {
    color: '#a7f3d0',
  },
  drawerFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
  footerLight: {
    backgroundColor: '#fafaf9',
    borderTopColor: '#f5f5f4',
  },
  footerDark: {
    backgroundColor: '#141210',
    borderTopColor: '#292524',
  },
  footerHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  footerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  footerBtnLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  footerBtnDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  footerBtnText: {
    fontSize: 12,
    fontWeight: '600',
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
