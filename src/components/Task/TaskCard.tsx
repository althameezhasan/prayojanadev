import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Task } from '../../../fetching/types/taskTypes';

interface TaskCardProps {
  task: Task;
  onTaskPress?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskPress }) => {
  // Add safety checks for all data
  const safeTask = {
    task_id: task?.taskId ?? 'N/A',
    task_name: task?.taskName ?? 'Unnamed Task',
    status: task?.status ?? 'pending',
    notes: task?.notes ?? 'No description available',
    empName: task?.householdName ?? 'Unknown',
    date: task?.updatedAt ?? new Date().toISOString(),
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // Determine status style based on task.status
  const getStatusStyle = (status: string) => {
    const statusLower = String(status).toLowerCase(); // Ensure it's a string
    switch (statusLower) {
      case 'pending':
      case 'planned':
        return { color: '#f4a261', backgroundColor: '#ffe8d1' };
      case 'upcoming':
        return { color: '#6abf69', backgroundColor: '#e6f3e6' };
      case 'completed':
        return { color: '#4a90e2', backgroundColor: '#e6f0fa' };
      default:
        return { color: '#f4a261', backgroundColor: '#ffe8d1' }; // Default to pending style
    }
  };

  // Add error boundary for the entire card
  try {
    return (
      <TouchableOpacity onPress={() => onTaskPress?.(task)} activeOpacity={0.8}>
        <View style={styles.cardContainer}>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.avatar}
            />
            <Text style={styles.taskId}>ID: {String(safeTask.task_id)}</Text>
            <Text style={[styles.status, getStatusStyle(safeTask.status)]}>
              {String(safeTask.status)}
            </Text>
          </View>
          <Text style={styles.taskTitle}>{String(safeTask.task_name)}</Text>
          <Text style={styles.description}>
            {String(safeTask.notes)}
          </Text>
          <View style={styles.details}>
            <Text style={styles.detailText}>Care buddy</Text>
            <Text style={styles.detailText}>{String(safeTask.empName)}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Date</Text>
            <Text style={styles.dateText}>{formatDate(safeTask.date)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  } catch (error) {
    console.error('TaskCard rendering error:', error);
    return (
      <View style={styles.cardContainer}>
        <Text style={styles.errorText}>Error rendering task</Text>
      </View>
    );
  }
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
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    padding: 20,
  },
});

export default TaskCard;