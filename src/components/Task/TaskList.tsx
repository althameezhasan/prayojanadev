import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Task } from '../../../fetching/types/taskTypes';

interface TasksListProps {
  tasks: Task[] | null;
  loading: boolean;
  error: any;
  onRefresh?: () => void;
  onTaskPress?: (task: Task) => void;
}

const TasksList: React.FC<TasksListProps> = ({
  tasks,
  loading,
  error,
  onRefresh,
  onTaskPress,
}) => {
  // Safe task card component embedded within the list
  const TaskCard: React.FC<{ task: Task; onTaskPress?: (task: Task) => void }> = ({ 
    task, 
    onTaskPress 
  }) => {
    // Add comprehensive safety checks for all data
    const safeTask = {
      task_id: task?.task_id ?? 'N/A',
      task_name: task?.task_name ?? 'Unnamed Task',
      status: task?.status ?? 'pending',
      notes: task?.notes ?? 'No description available',
      empName: task?.empName ?? 'Unknown',
      date: task?.date ?? new Date().toISOString(),
      location: task?.location ?? 'Unknown location',
      time: task?.time ?? 'Unknown time',
    };

    const formatDate = (dateString: string) => {
      try {
        if (!dateString || dateString === 'N/A') {
          return 'No date specified';
        }
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
      const statusLower = String(status || 'pending').toLowerCase();
      switch (statusLower) {
        case 'pending':
        case 'planned':
          return { color: '#f4a261', backgroundColor: '#ffe8d1' };
        case 'upcoming':
          return { color: '#6abf69', backgroundColor: '#e6f3e6' };
        case 'completed':
          return { color: '#4a90e2', backgroundColor: '#e6f0fa' };
        default:
          return { color: '#f4a261', backgroundColor: '#ffe8d1' };
      }
    };

    // Render the task card with complete error handling
    try {
      return (
        <TouchableOpacity 
          onPress={() => onTaskPress?.(task)} 
          activeOpacity={0.8}
          style={styles.cardTouchable}
        >
          <View style={styles.cardContainer}>
            <View style={styles.header}>
              <Image
                source={{ uri: 'https://via.placeholder.com/50' }}
                style={styles.avatar}
                defaultSource={require('../../../assets/image/icons/user.png')} // Fallback
              />
              <Text style={styles.taskId}>
                ID: {String(safeTask.task_id)}
              </Text>
              <Text style={[styles.status, getStatusStyle(safeTask.status)]}>
                {String(safeTask.status)}
              </Text>
            </View>
            
            <Text style={styles.taskTitle}>
              {String(safeTask.task_name)}
            </Text>
            
            <Text style={styles.description}>
              {String(safeTask.notes)}
            </Text>
            
            <View style={styles.details}>
              <Text style={styles.detailLabel}>Care buddy</Text>
              <Text style={styles.detailText}>
                {String(safeTask.empName)}
              </Text>
            </View>
            
            <View style={styles.details}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailText}>
                {String(safeTask.location)}
              </Text>
            </View>
            
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Date</Text>
              <Text style={styles.dateText}>
                {formatDate(safeTask.date)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('TaskCard rendering error:', error);
      return (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>
            Error rendering task: {String(safeTask.task_id)}
          </Text>
        </View>
      );
    }
  };

  // Safe render function for each task item
  const renderTaskCard = ({ item, index }: { item: Task; index: number }) => {
    try {
      // Additional safety check for the item
      if (!item || typeof item !== 'object') {
        console.warn('Invalid task item at index', index, ':', item);
        return (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Invalid task data</Text>
          </View>
        );
      }

      return <TaskCard task={item} onTaskPress={onTaskPress} />;
    } catch (error) {
      console.error('Error rendering task at index', index, ':', error);
      return (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>
            Error rendering task at position {index + 1}
          </Text>
        </View>
      );
    }
  };

  // Safe key extractor
  const keyExtractor = (item: Task, index: number) => {
    try {
      if (item?.task_id) {
        return String(item.task_id);
      }
      return `task-${index}`;
    } catch (error) {
      console.error('Key extractor error:', error);
      return `error-task-${index}`;
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Tasks Found</Text>
      <Text style={styles.emptySubtitle}>
        There are no tasks assigned to this household at the moment.
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Failed to Load Tasks</Text>
      <Text style={styles.errorSubtitle}>
        Please check your connection and try again.
      </Text>
      {error && (
        <Text style={styles.errorDetails}>
          Error: {String(error.message || error)}
        </Text>
      )}
    </View>
  );

  // Loading state
  if (loading && !tasks) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return renderErrorState();
  }

  // Main render with safe data handling
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <View style={styles.container}>
      <FlatList
        data={safeTasks}
        renderItem={renderTaskCard}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={['#00796b']}
            />
          ) : undefined
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          safeTasks.length === 0 ? styles.emptyList : styles.listContent
        }
        removeClippedSubviews={false} // Disable for better error handling
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minHeight: 300,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'monospace',
  },
  emptyList: {
    flexGrow: 1,
  },
  cardTouchable: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  taskId: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    fontWeight: '500',
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateLabel: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  errorCard: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default TasksList;