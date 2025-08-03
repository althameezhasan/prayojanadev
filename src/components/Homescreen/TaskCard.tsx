import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Task } from '../../../fetching/types/taskTypes';

interface NewTaskCardProps {
  task: Task;
  onTaskPress?: (task: Task) => void;
}

const NewTaskCard: React.FC<NewTaskCardProps> = ({ task, onTaskPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <TouchableOpacity onPress={() => onTaskPress?.(task)} activeOpacity={0.8}>
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }} // Replace with actual image URL or local asset
            style={styles.avatar}
          />
          <Text style={styles.taskId}>ID: {task.taskId}</Text>
          <Text style={styles.status}>Pending</Text>
        </View>
        <Text style={styles.taskTitle}>{task.taskName}</Text>
        <Text style={styles.description}>
          {task.notes || 'No description available'}
        </Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>Care buddy</Text>
          <Text style={styles.detailText}>{task.householdName}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Date</Text>
          <Text style={styles.dateText}>{formatDate(task.updatedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  taskId: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  status: {
    fontSize: 12,
    color: '#f4a261',
    backgroundColor: '#ffe8d1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
});

export default NewTaskCard;