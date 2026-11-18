import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Sparkles, X, Check } from '../SVG';
import {
  DECORATIONS,
  STYLISH_FONTS,
  StylishFontFamily,
  transformTextToStyle,
} from '../utils/decorations';

interface DecorationsAndFontsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText: (text: string) => void;
  isDark?: boolean;
}

export const DecorationsAndFontsModal: React.FC<DecorationsAndFontsModalProps> = ({
  isOpen,
  onClose,
  onInsertText,
  isDark = false,
}) => {
  const [activeTab, setActiveTab] = useState<'decorations' | 'fonts'>('decorations');
  const [activeCat, setActiveCat] = useState<'all' | 'cadres' | 'separateurs' | 'ornements' | 'symboles'>('all');
  const [placeholderReplacement, setPlaceholderReplacement] = useState('Mon Titre');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInsertDecor = (pattern: string, id: string) => {
    const customPattern = pattern
      .replace(/Titre/g, placeholderReplacement || 'Titre')
      .replace(/Placeholder/g, placeholderReplacement || 'Titre');
    onInsertText(customPattern);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
      onClose();
    }, 400);
  };

  const handleInsertFont = (fontId: StylishFontFamily) => {
    const styled = transformTextToStyle(placeholderReplacement || 'Mon Titre', fontId);
    onInsertText(styled);
    setCopiedId(fontId);
    setTimeout(() => {
      setCopiedId(null);
      onClose();
    }, 400);
  };

  const filteredDecors = DECORATIONS.filter((d) => {
    if (activeCat === 'all') return true;
    return d.category === activeCat;
  });

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            isDark ? styles.modalDark : styles.modalLight,
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.modalHeader,
              isDark ? styles.headerDark : styles.headerLight,
            ]}
          >
            <View style={styles.headerLeft}>
              <View style={styles.sparkleIcon}>
                <Sparkles size={18} color="#d97706" />
              </View>
              <View>
                <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
                  Décors & Polices Stylées
                </Text>
                <Text style={[styles.headerSub, isDark ? styles.subDark : styles.subLight]}>
                  Bordures artistiques et typographies Unicode
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={isDark ? '#e7e5e4' : '#292524'} />
            </TouchableOpacity>
          </View>

          {/* Tab buttons */}
          <View
            style={[
              styles.tabRow,
              isDark ? styles.tabRowDark : styles.tabRowLight,
            ]}
          >
            <TouchableOpacity
              onPress={() => setActiveTab('decorations')}
              style={[
                styles.tabBtn,
                activeTab === 'decorations' ? styles.tabBtnActive : null,
              ]}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'decorations' ? styles.tabTextActive : (isDark ? styles.subDark : styles.subLight),
                ]}
              >
                Bordures & Décors ({DECORATIONS.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('fonts')}
              style={[
                styles.tabBtn,
                activeTab === 'fonts' ? styles.tabBtnActive : null,
              ]}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'fonts' ? styles.tabTextActive : (isDark ? styles.subDark : styles.subLight),
                ]}
              >
                Polices Stylées ({STYLISH_FONTS.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Target Text Input */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, isDark ? styles.subDark : styles.subLight]}>
              Texte à insérer :
            </Text>
            <TextInput
              value={placeholderReplacement}
              onChangeText={setPlaceholderReplacement}
              placeholder="Ex: Mon Titre..."
              placeholderTextColor={isDark ? '#78716c' : '#a8a29e'}
              style={[styles.textInput, isDark ? styles.inputDark : styles.inputLight]}
            />
          </View>

          {/* Categories for Decorations */}
          {activeTab === 'decorations' && (
            <View style={styles.categoriesRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'cadres', label: 'Cadres' },
                  { id: 'separateurs', label: 'Séparateurs' },
                  { id: 'ornements', label: 'Ornements' },
                  { id: 'symboles', label: 'Symboles' },
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setActiveCat(cat.id as any)}
                    style={[
                      styles.catPill,
                      activeCat === cat.id
                        ? styles.catPillActive
                        : (isDark ? styles.catPillDark : styles.catPillLight),
                    ]}
                  >
                    <Text
                      style={[
                        styles.catPillText,
                        activeCat === cat.id
                          ? styles.catTextActive
                          : (isDark ? styles.subDark : styles.subLight),
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Items Content List */}
          <ScrollView style={styles.scrollArea}>
            {activeTab === 'decorations' ? (
              <View style={styles.decorGrid}>
                {filteredDecors.map((item) => {
                  const displayPattern = item.pattern
                    .replace(/Titre/g, placeholderReplacement || 'Titre')
                    .replace(/Placeholder/g, placeholderReplacement || 'Titre');
                  const isCopied = copiedId === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleInsertDecor(item.pattern, item.id)}
                      style={[
                        styles.decorCard,
                        isDark ? styles.decorCardDark : styles.decorCardLight,
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.decorCardHeader}>
                        <Text style={[styles.decorName, isDark ? styles.textDark : styles.textLight]}>
                          {item.name}
                        </Text>
                        <View style={styles.insertBadge}>
                          {isCopied ? (
                            <Check size={12} color="#10b981" />
                          ) : (
                            <Text style={styles.insertBadgeText}>Insérer</Text>
                          )}
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.decorPattern,
                          isDark ? styles.patternDark : styles.patternLight,
                        ]}
                      >
                        {displayPattern}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              /* Fonts List */
              <View style={styles.fontsList}>
                {STYLISH_FONTS.map((font) => {
                  const styledPreview = transformTextToStyle(
                    placeholderReplacement || 'Mon Titre Stylé',
                    font.id
                  );
                  const isCopied = copiedId === font.id;

                  return (
                    <TouchableOpacity
                      key={font.id}
                      onPress={() => handleInsertFont(font.id)}
                      style={[
                        styles.fontCard,
                        isDark ? styles.decorCardDark : styles.decorCardLight,
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.decorCardHeader}>
                        <Text style={[styles.decorName, isDark ? styles.textDark : styles.textLight]}>
                          {font.name}
                        </Text>
                        <View style={styles.insertBadge}>
                          {isCopied ? (
                            <Check size={12} color="#10b981" />
                          ) : (
                            <Text style={styles.insertBadgeText}>Appliquer</Text>
                          )}
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.fontPreviewText,
                          isDark ? styles.textDark : styles.textLight,
                        ]}
                      >
                        {styledPreview}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '84%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLight: {
    backgroundColor: '#fffbeb',
    borderBottomColor: '#fef3c7',
  },
  headerDark: {
    backgroundColor: '#141210',
    borderBottomColor: '#292524',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sparkleIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
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
    borderRadius: 8,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabRowLight: {
    borderBottomColor: '#e7e5e4',
    backgroundColor: '#fafaf9',
  },
  tabRowDark: {
    borderBottomColor: '#292524',
    backgroundColor: '#141210',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#f59e0b',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#d97706',
  },
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  textInput: {
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  inputLight: {
    backgroundColor: '#f5f5f4',
    borderColor: '#d6d3d1',
    color: '#1c1917',
  },
  inputDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
    color: '#f5f5f4',
  },
  categoriesRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  catPillActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  catPillLight: {
    backgroundColor: '#f5f5f4',
    borderColor: '#e7e5e4',
  },
  catPillDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  catTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  decorGrid: {
    gap: 10,
    paddingBottom: 20,
  },
  decorCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  decorCardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  decorCardDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  decorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  decorName: {
    fontSize: 12,
    fontWeight: '700',
  },
  insertBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  insertBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#b45309',
  },
  decorPattern: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'monospace',
  },
  patternLight: {
    color: '#44403c',
  },
  patternDark: {
    color: '#d6d3d1',
  },
  fontsList: {
    gap: 10,
    paddingBottom: 20,
  },
  fontCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  fontPreviewText: {
    fontSize: 16,
    marginTop: 4,
    lineHeight: 22,
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
