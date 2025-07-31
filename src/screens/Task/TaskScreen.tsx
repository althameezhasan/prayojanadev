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
import NewTasksList from '../../components/Task/TaskList';

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
    console.log('Task pressed:', task.task_name);
    Alert.alert(
      task.task_name,
      `Employee: ${task.empName}\nLocation: ${task.location}\nTime: ${task.time}\nDate: ${new Date(task.date).toLocaleDateString()}\nStatus: ${task.status}\n\nNotes: ${task.notes || 'No notes available'}`,
      [{ text: 'OK' }]
    );
  }, []);

  // Filter tasks based on the active tab
  const filteredTasks = tasks
    ? tasks.filter((task) => task.status === activeTab)
    : [];

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
        <TouchableOpacity style={styles.backArrow} onPress={() => console.log('Back pressed')}>
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasks</Text>
      </ImageBackground>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Planned')}>
          <Text style={activeTab === 'Planned' ? styles.tabActive : styles.tab}>Planned</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Upcoming')}>
          <Text style={activeTab === 'Upcoming' ? styles.tabActive : styles.tab}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Completed')}>
          <Text style={activeTab === 'Completed' ? styles.tabActive : styles.tab}>Completed</Text>
        </TouchableOpacity>
      </View>

      <NewTasksList
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
    paddingVertical: 10,
    backgroundColor: '#e0f7f9',
  },
  tabActive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00796b',
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  tab: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    paddingVertical: 5,
    paddingHorizontal: 15,
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