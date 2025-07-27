// components/PlanSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Plan } from '../../../fetching/types';

interface PlanSectionProps {
  plans: Plan[];
}

const PlanSection: React.FC<PlanSectionProps> = ({ plans }) => {
  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <View style={styles.planSection}>
      <Text style={styles.infoLabel}>Active Plans:</Text>
      {plans.slice(0, 2).map((plan, planIndex) => (
        <View key={plan.hh_plan_id || planIndex} style={styles.planItem}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDetails}>
            ₹{plan.plan_amount.toLocaleString()} | {plan.duration} months
          </Text>
          <Text style={styles.planDates}>
            {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
          </Text>
        </View>
      ))}
      {plans.length > 2 && (
        <Text style={styles.moreText}>+{plans.length - 2} more plans</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  planSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  planItem: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#007C91',
    paddingLeft: 12,
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  planDetails: {
    fontSize: 13,
    color: '#007C91',
    fontWeight: '600',
    marginBottom: 2,
  },
  planDates: {
    fontSize: 12,
    color: '#666',
  },
  moreText: {
    fontSize: 12,
    color: '#007C91',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
});

export default PlanSection;