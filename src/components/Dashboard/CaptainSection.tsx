import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Captain } from '../../../fetching/types';

interface CaptainSectionProps {
  captain?: Captain | null;
}

const CaptainSection: React.FC<CaptainSectionProps> = ({ captain }) => {
  if (!captain) {
    return (
      <View style={styles.captainSection}>
        <Text style={styles.infoLabel}>Captain Information:</Text>
        <Text style={styles.infoText}>No captain available</Text>
      </View>
    );
  }

  return (
    <View style={styles.captainSection}>
      <Text style={styles.infoLabel}>Captain Information from API:</Text>
      <View style={styles.captainItem}>
        <View style={styles.captainInfo}>
          {captain.profilePic ? (
            <Image 
              source={{ uri: captain.profilePic }} 
              style={styles.profilePic}
            />
          ) : (
            <View style={[styles.profilePic, styles.placeholderPic]}>
              <Text style={styles.placeholderText}>
                {captain.name ? captain.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
          )}
          <View style={styles.captainDetails}>
            <Text style={styles.captainName}>{captain.name}</Text>
            <Text style={styles.captainDetail}>Employee ID: {captain.empId}</Text>
            <Text style={styles.captainDetail}>User ID: {captain.id}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  captainSection: {
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
  captainItem: {
    paddingVertical: 8,
  },
  captainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#f0f0f0',
  },
  placeholderPic: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007C91',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  captainDetails: {
    flex: 1,
  },
  captainName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007C91',
    marginBottom: 6,
  },
  captainDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default CaptainSection;