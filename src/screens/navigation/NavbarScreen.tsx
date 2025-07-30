// src/screens/navigation/NavbarScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import DashboardScreen from '../dashboard/DashboardScreen';
import PlainScreen from '../dashboard/HomeScreen';

export type NavScreen = 'home' | 'dashboard' | 'profile' | 'settings';

const NavbarScreen: React.FC = () => {
  const { logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('home');

  const navItems: { key: NavScreen; label: string; icon: string }[] = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleScreenChange = (screen: NavScreen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <PlainScreen onNavigateToDashboard={() => handleScreenChange('dashboard')} />;
      
      case 'dashboard':
        return <DashboardScreen onLogout={logout} />;
      
      case 'profile':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Profile Screen</Text>
            <Text style={styles.screenSubtitle}>Coming Soon...</Text>
          </View>
        );
      
      case 'settings':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Settings Screen</Text>
            <Text style={styles.screenSubtitle}>Coming Soon...</Text>
          </View>
        );
      
      default:
        return <PlainScreen onNavigateToDashboard={() => handleScreenChange('dashboard')} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Main Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navbar}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.navItem,
              currentScreen === item.key && styles.navItemActive,
            ]}
            onPress={() => handleScreenChange(item.key)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.navIcon,
              currentScreen === item.key && styles.navIconActive,
            ]}>
              {item.icon}
            </Text>
            <Text style={[
              styles.navLabel,
              currentScreen === item.key && styles.navLabelActive,
            ]}>
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
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 4,
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  navItemActive: {
    backgroundColor: '#e8f5ff',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#007C91',
    fontWeight: '600',
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