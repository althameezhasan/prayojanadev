import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Carebuddy } from '../../../fetching/types';

interface CareBuddySectionProps {
  carebuddies: Carebuddy[];
}

const CareBuddySection: React.FC<CareBuddySectionProps> = ({ carebuddies }) => {
  if (!carebuddies || carebuddies.length === 0) {
    return (
      <View style={styles.carebuddySection}>
        <Text style={styles.infoLabel}>Care Buddies:</Text>
        <Text style={styles.infoText}>No care buddies available</Text>
      </View>
    );
  }

  return (
    <View style={styles.carebuddySection}>
      <Text style={styles.infoLabel}>Care Buddies from API:</Text>
      {carebuddies.map((carebuddy, cbIndex) => (
        <View key={carebuddy.hh_carebdy_id || cbIndex} style={styles.carebuddyItem}>
          <View style={styles.carebuddyInfo}>
            {carebuddy.profilePic ? (
              <Image 
                source={{ uri: carebuddy.profilePic }} 
                style={styles.profilePic}
              />
            ) : (
              <View style={[styles.profilePic, styles.placeholderPic]}>
                <Text style={styles.placeholderText}>
                  {carebuddy.carebuddyName ? carebuddy.carebuddyName.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
            )}
            <View style={styles.carebuddyDetails}>
              <Text style={styles.carebuddyName}>
                {carebuddy.carebuddyName || `Carebuddy ${carebuddy.carebuddy_id || cbIndex + 1}`}
              </Text>
              <Text style={styles.carebuddyType}>
                Type: {carebuddy.carebuddy_type || carebuddy.carebuddyType || 'Unknown'}
              </Text>
              {carebuddy.start_date && carebuddy.end_date && (
                <Text style={styles.carebuddyDates}>
                  {new Date(carebuddy.start_date).toLocaleDateString()} - {new Date(carebuddy.end_date).toLocaleDateString()}
                </Text>
              )}
              {carebuddy.is_active !== undefined && (
                <Text style={[styles.activeStatus, { color: carebuddy.is_active ? '#28a745' : '#6c757d' }]}>
                  {carebuddy.is_active ? '● Active' : '○ Inactive'}
                </Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  carebuddySection: {
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
  carebuddyItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  carebuddyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  placeholderPic: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#065084',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  carebuddyDetails: {
    flex: 1,
  },
  carebuddyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065084',
    marginBottom: 4,
  },
  carebuddyType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  carebuddyDates: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  activeStatus: {
    fontSize: 12,
    fontWeight: '600',
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

export default CareBuddySection;