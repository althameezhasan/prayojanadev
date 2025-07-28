import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Household } from '../../../fetching/types';

interface DashboardMenuGridProps {
  household?: Household | null;
  onLogout?: () => void;
  onMenuSelect?: (type: 'Plan' | 'Carebuddy' | 'Captain' | 'Member' | null) => void;
  loginDetails?: { loginType: string; id: number } | null;
}

interface MenuItemProps {
  icon: string;
  title: string;
  onPress?: () => void;
  isLogout?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, isLogout = false }) => (
  <TouchableOpacity 
    style={[styles.menuItem, isLogout && styles.logoutMenuItem]} 
    onPress={onPress}
  >
    <View style={[styles.iconContainer, isLogout && styles.logoutIconContainer]}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <Text style={[styles.menuItemTitle, isLogout && styles.logoutTitle]}>{title}</Text>
  </TouchableOpacity>
);

const DashboardMenuGrid: React.FC<DashboardMenuGridProps> = ({ 
  household, 
  onLogout, 
  onMenuSelect, 
  loginDetails 
}) => {
  const loginType = loginDetails?.loginType || 'Unknown';
  
  // Define all menu items with their access rules
  const allMenuItems = [
    { 
      icon: '📋', 
      title: 'Plan\nDetails', 
      onPress: () => onMenuSelect?.('Plan'),
      allowedFor: ['Paying Child'] // Only Paying Child can see this
    },
    { 
      icon: '👤', 
      title: 'Member\nDetails', 
      onPress: () => onMenuSelect?.('Member'),
      allowedFor: ['Member', 'Paying Child', 'Relative'] // All can see this
    },
    { 
      icon: '🤝', 
      title: 'Carebuddy', 
      onPress: () => onMenuSelect?.('Carebuddy'),
      allowedFor: ['Member', 'Paying Child', 'Relative'] // All can see this
    },
    { 
      icon: '👥', 
      title: 'Relatives', 
      onPress: () => console.log('Relatives'),
      allowedFor: ['Member', 'Paying Child', 'Relative'] // All can see this
    },
    { 
      icon: '💬', 
      title: 'Interactions', 
      onPress: () => console.log('Interactions'),
      allowedFor: ['Member', 'Paying Child'] // Only Member and Paying Child
    },
    { 
      icon: '✅', 
      title: 'Tasks', 
      onPress: () => console.log('Tasks'),
      allowedFor: ['Member', 'Paying Child', 'Relative'] // All can see this
    },
  ];

  // Filter menu items based on login type
  const visibleMenuItems = allMenuItems.filter(item => 
    item.allowedFor.includes(loginType)
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {visibleMenuItems.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            title={item.title}
            onPress={item.onPress}
          />
        ))}
      </View>
      
      <View style={styles.bottomRow}>
        <MenuItem
          icon="👥"
          title="Team"
          onPress={() => onMenuSelect?.('Captain')}
        />
        <MenuItem
          icon="🚪"
          title="Logout"
          onPress={onLogout}
          isLogout={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  menuItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#E0F7FA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  logoutMenuItem: {
    backgroundColor: '#FFEBEE',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B2EBF2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoutIconContainer: {
    backgroundColor: '#FFCDD2',
  },
  icon: {
    fontSize: 20,
  },
  menuItemTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#37474F',
    textAlign: 'center',
    lineHeight: 14,
  },
  logoutTitle: {
    color: '#D32F2F',
    fontWeight: '600',
  },
});

export default DashboardMenuGrid;