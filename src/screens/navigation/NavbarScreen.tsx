// src/screens/navigation/NavbarScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import HomeScreen from '../dashboard/HomeScreen';
import ProfileScreen from '../Profile/ProfileScreen';
import TaskScreen from '../Task/TaskScreen'; // Import the TaskScreen

export type NavScreen = 'home' | 'task' | 'profile' | 'Interactions';

const NavbarScreen: React.FC = () => {
  const { logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('home');

  const navItems: { key: NavScreen; label: string; icon: any; disabled?: boolean }[] = [
    { key: 'home', label: 'Home', icon: require('../../../assets/image/icons/home-page.png') },
    { key: 'task', label: 'Task', icon: require('../../../assets/image/icons/to-do-list.png') },
    { key: 'profile', label: 'Profile', icon: require('../../../assets/image/icons/user.png') },
    { key: 'Interactions', label: 'Interactions', icon: require('../../../assets/image/icons/interactivity.png'), disabled: true },
  ];

  const handleScreenChange = (screen: NavScreen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigateToDashboard={() => handleScreenChange('task')} />;
      case 'task':
        return <TaskScreen />; // Render the TaskScreen here
      case 'profile':
        return <ProfileScreen />;
      case 'Interactions':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Interactions Screen</Text>
            <Text style={styles.screenSubtitle}>Coming Soon...</Text>
          </View>
        );
      default:
        return <HomeScreen onNavigateToDashboard={() => handleScreenChange('task')} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.content}>{renderScreen()}</View>
      <View style={styles.navbar}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.navItem, item.disabled && styles.navItemDisabled]}
            onPress={() => !item.disabled && handleScreenChange(item.key)}
            activeOpacity={item.disabled ? 1 : 0.7}
            disabled={item.disabled}
          >
            <Image
              source={item.icon}
              style={[
                styles.navIconImage,
                currentScreen === item.key && styles.navIconImageActive,
                item.disabled && styles.navIconImageDisabled,
              ]}
            />
            <Text
              style={[
                styles.navLabel,
                currentScreen === item.key && styles.navLabelActive,
                item.disabled && styles.navLabelDisabled,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  navItemDisabled: {
    opacity: 0.4,
  },
  navIconImage: {
    width: 26,
    height: 26,
    marginBottom: 2,
    resizeMode: 'contain',
    tintColor: '#888',
  },
  navIconImageActive: {
    tintColor: '#007C91',
  },
  navIconImageDisabled: {
    tintColor: '#ccc',
  },
  navLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#007C91',
    fontWeight: '600',
  },
  navLabelDisabled: {
    color: '#ccc',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default NavbarScreen;