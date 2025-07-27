// components/Dashboard/DashboardContent.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HouseholdData } from '../../../fetching/types';
import HouseholdCard from './HouseholdCard';
import DashboardMenuGrid from './DashboardMenuGrid';

interface DashboardContentProps {
  loading: boolean;
  error: any;
  data: HouseholdData | null;
  onLogout?: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  loading, 
  error, 
  data, 
  onLogout 
}) => {
  const household = data?.message?.data?.[0] || null;

  return (
    <View style={styles.content}>
      {household && (
        <HouseholdCard household={household} />
      )}
      
      <DashboardMenuGrid household={household} onLogout={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default DashboardContent;
