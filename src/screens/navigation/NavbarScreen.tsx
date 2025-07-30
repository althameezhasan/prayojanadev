// src/screens/navigation/NavbarScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import DashboardScreen from '../dashboard/DashboardScreen';
import PlainScreen from '../dashboard/HomeScreen';

export type NavScreen = 'home' | 'dashboard' | 'profile' | 'Interactions';

const NavbarScreen: React.FC = () => {
  const { logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('home');

  const navItems: { key: NavScreen; label: string; icon: any }[] = [
  { key: 'home', label: 'Home', icon: require('../../../assets/image/icons/home-page.png') },
  { key: 'dashboard', label: 'Dashboard', icon: require('../../../assets/image/icons/to-do-list.png') },
  { key: 'profile', label: 'Profile', icon: require('../../../assets/image/icons/user.png') },
  { key: 'Interactions', label: 'Interactions', icon: require('../../../assets/image/icons/interactivity.png') },
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

      case 'Interactions':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Interactions Screen</Text>
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
      <View style={styles.content}>{renderScreen()}</View>

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
            <Image
              source={item.icon}
              style={[
                styles.navIconImage,
                currentScreen === item.key && styles.navIconImageActive,
              ]}
            />
            <Text
              style={[
                styles.navLabel,
                currentScreen === item.key && styles.navLabelActive,
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
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 4,
    elevation: 10,
    shadowColor: '#000',
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
  navIconImage: {
    width: 24,
    height: 24,
    opacity: 0.6,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  navIconImageActive: {
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
