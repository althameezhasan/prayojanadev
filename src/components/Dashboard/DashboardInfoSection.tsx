import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Household } from '../../../fetching/types';

interface DashboardInfoSectionProps {
  household?: Household | null;
  userToken?: string | null;
  loginDetails?: { loginType: string; id: number } | null;
}

const DashboardInfoSection: React.FC<DashboardInfoSectionProps> = ({ 
  household, 
  userToken, 
  loginDetails 
}) => {
  return (
    <View style={styles.container}>
      {userToken && (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>Token:</Text>
          <Text style={styles.tokenText} numberOfLines={3} ellipsizeMode="middle">
            {userToken}
          </Text>
        </View>
      )}
      
      {loginDetails && (
        <View style={styles.loginDetailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Login Type:</Text>
            <Text style={styles.detailValue}>{loginDetails.loginType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>User ID:</Text>
            <Text style={styles.detailValue}>{loginDetails.id}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tokenContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tokenLabel: {
    fontSize: 14,
    color: '#007C91',
    fontWeight: '600',
    marginBottom: 8,
  },
  tokenText: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 14,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  loginDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: '#007C91',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DashboardInfoSection;