import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Plan } from '../../../fetching/types';

interface PlanSectionProps {
  plans: Plan[];
}

const PlanSection: React.FC<PlanSectionProps> = ({ plans }) => {
  if (!plans || plans.length === 0) {
    return (
      <View style={styles.planSection}>
        <Text style={styles.infoLabel}>Plans:</Text>
        <Text style={styles.infoText}>No plans available</Text>
      </View>
    );
  }

  return (
    <View style={styles.planSection}>
      <Text style={styles.infoLabel}>Plans:</Text>
      {plans.map((plan, index) => (
        <View key={plan.hh_plan_id || index} style={styles.planItem}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDetail}>Plan ID: {plan.plan_id}</Text>
          <Text style={styles.planDetail}>Duration: {plan.duration}</Text>
          <Text style={styles.planDetail}>
            Start: {new Date(plan.start_date).toLocaleDateString()} - End: {new Date(plan.end_date).toLocaleDateString()}
          </Text>
          <Text style={styles.planDetail}>Amount: ₹{plan.plan_amount}</Text>
          <Text style={styles.planDetail}>Paid: ₹{plan.amount_paid}</Text>
          {plan.amount_due > 0 && (
            <Text style={styles.planDetail}>Due: ₹{plan.amount_due}</Text>
          )}
          <Text style={[styles.activeStatus, { color: plan.is_active ? '#28a745' : '#6c757d' }]}>
            {plan.is_active ? '● Active' : '○ Inactive'}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  planSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  planItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 6,
  },
  planName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007C91',
    marginBottom: 4,
  },
  planDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  activeStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 12,
  },
});

export default PlanSection;