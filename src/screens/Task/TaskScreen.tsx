import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useHouseholdId, useAuthToken } from '../../context/AuthContext';
import { Task } from '../../../fetching/types/taskTypes';
import { useHouseholdTasks } from '../../hooks/useHouseholdTasks';
import TasksList from '../../components/Task/TaskList'; // Import the merged component

const TaskScreen: React.FC = () => {
  const householdId = useHouseholdId();
  const token = useAuthToken();

  const { tasks, loading, error } = useHouseholdTasks({
    householdId: householdId ? Number(householdId) : null,
    userToken: token,
    shouldFetch: !!householdId,
  });

  const [activeTab, setActiveTab] = useState('Planned');

  const handleRefresh = useCallback(() => {
    console.log('Refresh triggered - tasks will reload automatically');
  }, []);

  const handleTaskPress = useCallback(async (task: Task) => {
    try {
      console.log('Task pressed:', task.task_name);
      
      // Safe data extraction for alert
      const taskName = task?.task_name || 'Unknown Task';
      const empName = task?.empName || 'Unknown';
      const location = task?.location || 'Unknown location';
      const time = task?.time || 'Unknown time';
      const status = task?.status || 'Unknown status';
      const notes = task?.notes || 'No notes available';
      
      let dateString = 'Unknown date';
      try {
        if (task?.date) {
          const date = new Date(task.date);
          if (!isNaN(date.getTime())) {
            dateString = date.toLocaleDateString();
          }
        }
      } catch (dateError) {
        console.error('Date parsing error:', dateError);
      }

      Alert.alert(
        taskName,
        `Employee: ${empName}\nLocation: ${location}\nTime: ${time}\nDate: ${dateString}\nStatus: ${status}\n\nNotes: ${notes}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error handling task press:', error);
      Alert.alert(
        'Error',
        'There was an error displaying task details.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  // Safe task filtering with comprehensive error handling
  const filteredTasks = React.useMemo(() => {
    try {
      if (!tasks || !Array.isArray(tasks)) {
        console.log('No tasks available or tasks is not an array:', tasks);
        return [];
      }

      const filtered = tasks.filter((task) => {
        try {
          if (!task || typeof task !== 'object') {
            console.warn('Invalid task object:', task);
            return false;
          }
          
          const taskStatus = String(task.status || '').toLowerCase();
          const activeTabLower = activeTab.toLowerCase();
          
          return taskStatus === activeTabLower;
        } catch (filterError) {
          console.error('Error filtering individual task:', filterError);
          return false;
        }
      });

      console.log(`Filtered tasks for "${activeTab}":`, filtered.length);
      return filtered;
    } catch (error) {
      console.error('Error filtering tasks:', error);
      return [];
    }
  }, [tasks, activeTab]);

  // Debug logging
  React.useEffect(() => {
    console.log('TaskScreen Debug Info:', {
      householdId,
      hasToken: !!token,
      tasksCount: tasks?.length || 0,
      loading,
      error: error?.message || error,
      activeTab,
      filteredCount: filteredTasks.length,
    });
  }, [householdId, token, tasks, loading, error, activeTab, filteredTasks]);

  if (!householdId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>No Household Selected</Text>
          <Text style={styles.errorSubtitle}>
            Please make sure you're logged in and have selected a household.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/image/TopFrame.png')}
        style={styles.topBanner}
        resizeMode="cover"
      >
        <TouchableOpacity 
          style={styles.backArrow} 
          onPress={() => console.log('Back pressed')}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasks</Text>
      </ImageBackground>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          onPress={() => setActiveTab('Planned')}
          style={styles.tabButton}
        >
          <Text style={activeTab === 'Planned' ? styles.tabActive : styles.tab}>
            Planned
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('Upcoming')}
          style={styles.tabButton}
        >
          <Text style={activeTab === 'Upcoming' ? styles.tabActive : styles.tab}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('Completed')}
          style={styles.tabButton}
        >
          <Text style={activeTab === 'Completed' ? styles.tabActive : styles.tab}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <TasksList
        tasks={filteredTasks}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        onTaskPress={handleTaskPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topBanner: {
    height: 150,
    marginRight: 3,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 20,
  },
  backArrow: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  backArrowText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#e0f7f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabActive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00796b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    textAlign: 'center',
    minWidth: 80,
  },
  tab: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: 'center',
    minWidth: 80,
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
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default TaskScreen;