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

  // Determine status color based on task.status
  const getStatusColor = (status: string) => {
    const statusLower = String(status).toLowerCase();
    switch (statusLower) {
      case 'pending':
      case 'planned':
        return '#f4a261';
      case 'upcoming':
        return '#6abf69';
      case 'completed':
        return '#4a90e2';
      default:
        return '#f4a261'; // Default to pending color
    }
  };

  // Add error boundary for the entire card
  try {
    return (
      <TouchableOpacity onPress={() => onTaskPress?.(task)} activeOpacity={0.8}>
        <View style={styles.cardContainer}>
          <View style={styles.topRow}>
            <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.avatar}
            />
            <View style={styles.rightSection}>
              <Text style={styles.taskId}>ID : {String(safeTask.task_id)}</Text>
              <View style={styles.statusContainer}>
                <View 
                  style={[
                    styles.statusDot, 
                    { backgroundColor: getStatusColor(safeTask.status) }
                  ]} 
                />
                <Text style={styles.statusText}>
                  {String(safeTask.status)}
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.taskTitle}>{String(safeTask.task_name)}</Text>
          
          <Text style={styles.description}>
            {String(safeTask.notes)}
          </Text>
          
          <View style={styles.bottomRow}>
            <View style={styles.leftInfo}>
              <Text style={styles.labelText}>Care buddy</Text>
              <Text style={styles.valueText}>{String(safeTask.empName)}</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text style={styles.labelText}>Date</Text>
              <Text style={styles.valueText}>{formatDate(safeTask.date)}</Text>
            </View>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  taskId: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftInfo: {
    flex: 1,
  },
  rightInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  labelText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    padding: 20,
  },
});

export default TaskCard;