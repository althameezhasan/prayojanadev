// screens/DashboardScreen.tsx
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuth, useAuthToken, useLoginDetails } from '../../context/AuthContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import CurvedDashboardHeader from '../../components/Dashboard/DashboardHeader';
import DashboardContent from '../../components/Dashboard/DashboardContent';

interface DashboardScreenProps {
  onLogout: () => void; // Keep this for backward compatibility, but we'll use global logout
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  // Use global auth state
  const { logout } = useAuth();
  const userToken = useAuthToken();
  const loginDetails = useLoginDetails();

  // Use dashboard data hook with global auth data
  const { loading, data, error } = useDashboardData({ 
    loginDetails, 
    userToken 
  });

  // Handle logout - use global logout function
  const handleLogout = async () => {
    try {
      await logout();
      // The App component will automatically navigate to auth screens
      // when the authentication state changes
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to prop logout if global logout fails
      onLogout();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CurvedDashboardHeader 
        userToken={userToken} 
        loginDetails={loginDetails} 
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardContent 
          loading={loading}
          error={error}
          data={data}
          onLogout={handleLogout} // Use our local handler that calls global logout
          userToken={userToken}
          loginDetails={loginDetails}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 16, // Add some spacing from the curved header
  },
});

export default DashboardScreen;