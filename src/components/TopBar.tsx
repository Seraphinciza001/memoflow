import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Menu,
  Search,
  X,
  Clock,
  CheckSquare,
  FileText,
  Sun,
  Moon,
} from '../SVG';
import { DrawerTab, ThemeMode } from '../types';

interface TopBarProps {
  onOpenDrawer: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: DrawerTab;
  filterType: 'all' | 'note' | 'list';
  onFilterTypeChange: (type: 'all' | 'note' | 'list') => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenDrawer,
  searchQuery,
  onSearchChange,
  activeTab,
  filterType,
  onFilterTypeChange,
  theme,
  onToggleTheme,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'notes':
        return 'MemoFlow';
      case 'reminders':
        return 'Rappels Temporels';
      case 'archive':
        return 'Archives';
      case 'trash':
        return 'Corbeille';
      default:
        return 'MemoFlow';
    }
  };

  return (
    <View
      style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
      ]}
    >
      {/* Top Row: Menu, Title, Theme, Clock */}
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          <TouchableOpacity
            onPress={onOpenDrawer}
            style={[
              styles.iconBtn,
              isDark ? styles.iconBtnDark : styles.iconBtnLight,
            ]}
            activeOpacity={0.7}
          >
            <Menu size={20} color={isDark ? '#e7e5e4' : '#292524'} />
          </TouchableOpacity>

          <Text
            style={[
              styles.tabTitle,
              isDark ? styles.textDark : styles.textLight,
            ]}
          >
            {getTabTitle()}
          </Text>
        </View>

        <View style={styles.rightGroup}>
          {/* Live Clock Badge */}
          <View
            style={[
              styles.clockBadge,
              isDark ? styles.badgeDark : styles.badgeLight,
            ]}
          >
            <Clock size={13} color="#d97706" />
            <Text
              style={[
                styles.clockText,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              {currentTime || '--:--'}
            </Text>
          </View>

          {/* Theme Switcher Button */}
          <TouchableOpacity
            onPress={onToggleTheme}
            style={[
              styles.iconBtn,
              isDark ? styles.iconBtnDark : styles.iconBtnLight,
            ]}
            activeOpacity={0.7}
          >
            {isDark ? (
              <Sun size={18} color="#fbbf24" />
            ) : (
              <Moon size={18} color="#78716c" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Middle: Search Bar with Search and Clear SVGs */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchBox,
            isDark ? styles.searchBoxDark : styles.searchBoxLight,
          ]}
        >
          <Search size={16} color={isDark ? '#78716c' : '#a8a29e'} style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Rechercher notes et tâches..."
            placeholderTextColor={isDark ? '#78716c' : '#a8a29e'}
            style={[
              styles.searchInput,
              isDark ? styles.searchInputDark : styles.searchInputLight,
            ]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => onSearchChange('')}
              style={styles.clearBtn}
            >
              <X size={15} color={isDark ? '#a8a29e' : '#78716c'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom: Quick Filter Pills if on Notes tab */}
      {activeTab === 'notes' && (
        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => onFilterTypeChange('all')}
            style={[
              styles.filterPill,
              filterType === 'all'
                ? (isDark ? styles.filterPillActiveDark : styles.filterPillActiveLight)
                : (isDark ? styles.filterPillInactiveDark : styles.filterPillInactiveLight),
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                filterType === 'all'
                  ? (isDark ? styles.filterTextActiveDark : styles.filterTextActiveLight)
                  : (isDark ? styles.filterTextInactiveDark : styles.filterTextInactiveLight),
              ]}
            >
              Tout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onFilterTypeChange('note')}
            style={[
              styles.filterPill,
              filterType === 'note'
                ? (isDark ? styles.filterPillActiveDark : styles.filterPillActiveLight)
                : (isDark ? styles.filterPillInactiveDark : styles.filterPillInactiveLight),
            ]}
          >
            <FileText size={12} color={filterType === 'note' ? '#d97706' : (isDark ? '#a8a29e' : '#78716c')} />
            <Text
              style={[
                styles.filterPillText,
                filterType === 'note'
                  ? (isDark ? styles.filterTextActiveDark : styles.filterTextActiveLight)
                  : (isDark ? styles.filterTextInactiveDark : styles.filterTextInactiveLight),
              ]}
            >
              Notes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onFilterTypeChange('list')}
            style={[
              styles.filterPill,
              filterType === 'list'
                ? (isDark ? styles.filterPillActiveDark : styles.filterPillActiveLight)
                : (isDark ? styles.filterPillInactiveDark : styles.filterPillInactiveLight),
            ]}
          >
            <CheckSquare size={12} color={filterType === 'list' ? '#d97706' : (isDark ? '#a8a29e' : '#78716c')} />
            <Text
              style={[
                styles.filterPillText,
                filterType === 'list'
                  ? (isDark ? styles.filterTextActiveDark : styles.filterTextActiveLight)
                  : (isDark ? styles.filterTextInactiveDark : styles.filterTextInactiveLight),
              ]}
            >
              Listes
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  containerLight: {
    backgroundColor: 'rgba(245, 245, 244, 0.95)',
    borderBottomColor: '#e7e5e4',
  },
  containerDark: {
    backgroundColor: 'rgba(28, 25, 23, 0.95)',
    borderBottomColor: '#292524',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  textLight: {
    color: '#1c1917',
  },
  textDark: {
    color: '#f5f5f4',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconBtnLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  iconBtnDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  clockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  badgeDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  clockText: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  searchRow: {
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 40,
  },
  searchBoxLight: {
    backgroundColor: '#ffffff',
    borderColor: '#d6d3d1',
  },
  searchBoxDark: {
    backgroundColor: '#292524',
    borderColor: '#44403c',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  searchInputLight: {
    color: '#1c1917',
  },
  searchInputDark: {
    color: '#f5f5f4',
  },
  clearBtn: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterPillActiveLight: {
    backgroundColor: '#ffffff',
    borderColor: '#d97706',
  },
  filterPillActiveDark: {
    backgroundColor: '#44403c',
    borderColor: '#f59e0b',
  },
  filterPillInactiveLight: {
    backgroundColor: '#f5f5f4',
    borderColor: '#e7e5e4',
  },
  filterPillInactiveDark: {
    backgroundColor: '#1c1917',
    borderColor: '#292524',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActiveLight: {
    color: '#1c1917',
    fontWeight: '700',
  },
  filterTextActiveDark: {
    color: '#f5f5f4',
    fontWeight: '700',
  },
  filterTextInactiveLight: {
    color: '#78716c',
  },
  filterTextInactiveDark: {
    color: '#a8a29e',
  },
});
