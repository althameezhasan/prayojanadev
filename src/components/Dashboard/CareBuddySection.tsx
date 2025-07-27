// components/CareBuddySection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Carebuddy } from '../../../fetching/types';

interface CareBuddySectionProps {
  carebuddies: Carebuddy[];
}

const CareBuddySection: React.FC<CareBuddySectionProps> = ({ carebuddies }) => {
  if (!carebuddies || carebuddies.length === 0) {
    return null;
  }

  return (
    <View style={styles.carebuddySection}>
      <Text style={styles.infoLabel}>Care Buddies:</Text>
      {carebuddies.map((carebuddy, cbIndex) => (
        <View key={carebuddy.hh_carebdy_id || cbIndex} style={styles.carebuddyItem}>
          <Text style={styles.carebuddyType}>{carebuddy.carebuddy_type}</Text>
          <Text style={styles.carebuddyDates}>
            {new Date(carebuddy.start_date).toLocaleDateString()} - {new Date(carebuddy.end_date).toLocaleDateString()}
          </Text>
          <Text style={[styles.activeStatus, { color: carebuddy.is_active ? '#28a745' : '#6c757d' }]}>
            {carebuddy.is_active ? '● Active' : '○ Inactive'}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  carebuddySection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  carebuddyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 6,
  },
  carebuddyType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007C91',
    flex: 1,
  },
  carebuddyDates: {
    fontSize: 12,
    color: '#666',
    flex: 2,
    textAlign: 'center',
  },
  activeStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
});

export default CareBuddySection;