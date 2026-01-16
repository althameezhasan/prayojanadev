import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Task } from '../../../fetching/types/taskTypes';

interface TaskCardProps {
  task: Task;
  onTaskPress?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity onPress={() => onTaskPress?.(task)} activeOpacity={0.8}>
      <View style={styles.cardContainer}>
        {/* Top white pill */}
        <View style={styles.topBox}>
          <Text style={styles.taskTitle} numberOfLines={1}>
            {task.task_name}
          </Text>
        
        </View>

        {/* Bottom info section */}
        <View style={styles.bottomBox}>
          <View style={styles.infoGroup}>
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.infoText}>{task.empName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGroup}>
            <Text style={styles.icon}>🕒</Text>
            <Text style={styles.infoText}>{task.time}</Text>
          </View>

          <Text style={styles.dateText}>{formatDate(task.date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  topBox: {
    backgroundColor: '#fff',
    borderRadius:15,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  editIcon: {
    fontSize: 16,
    color: '#007C91',
  },
  bottomBox: {
    backgroundColor: '#eee',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#1a1a1a',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#1a1a1a',
  },
});

export default TaskCard;
