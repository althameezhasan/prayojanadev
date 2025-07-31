import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Task } from '../../../fetching/types/taskTypes';
import NewTaskCard from './TaskCard';

interface NewTasksListProps {
  tasks: Task[] | null;
  loading: boolean;
  error: any;
  onRefresh?: () => void;
  onTaskPress?: (task: Task) => void;
}

const NewTasksList: React.FC<NewTasksListProps> = ({
  tasks,
  loading,
  error,
  onRefresh,
  onTaskPress,
}) => {
  const renderTaskCard = ({ item }: { item: Task }) => (
    <NewTaskCard task={item} onTaskPress={onTaskPress} />
  );

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
    </View>
  );

  if (loading && !tasks) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return renderErrorState();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks || []}
        renderItem={renderTaskCard}
        keyExtractor={(item) => item.task_id.toString()}
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
          !tasks || tasks.length === 0 ? styles.emptyList : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
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
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default NewTasksList;