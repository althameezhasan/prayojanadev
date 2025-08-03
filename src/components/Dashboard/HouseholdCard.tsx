import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Household } from '../../../fetching/types';

interface HouseholdCardProps {
  household: Household;
  onEdit?: () => void;
}

const HouseholdCard: React.FC<HouseholdCardProps> = ({ household, onEdit }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Contact Information</Text>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.editText}>✎</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.iconText}>☎️</Text>
        <Text style={styles.infoText}>
          {household.mobile_num}
          {household.telephone_no ? ` | ${household.telephone_no}` : ''}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.iconText}>📍</Text>
        <Text style={styles.infoText}>
          {household.address}
          {household.zipcode ? ` - ${household.zipcode}` : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#065084',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editText: {
    color: '#fff',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  iconText: {
    marginRight: 6,
    color: '#fff',
    fontSize: 14,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    flexShrink: 1,
  },
});

export default HouseholdCard;
