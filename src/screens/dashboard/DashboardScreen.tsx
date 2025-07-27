// screens/DashboardScreen.tsx
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { DashboardScreenProps } from '../../../fetching/types';
import { useDashboardData } from '../../hooks/useDashboardData';
import CurvedDashboardHeader from '../../components/Dashboard/DashboardHeader';
import DashboardContent from '../../components/Dashboard/DashboardContent';

const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
  onLogout, 
  userToken, 
  loginDetails 
}) => {
  const { loading, data, error } = useDashboardData({ 
    loginDetails, 
    userToken 
  });

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
          onLogout={onLogout}
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