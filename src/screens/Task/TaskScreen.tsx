import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useHouseholdId, useAuthToken, useLoginDetails } from '../../context/AuthContext';
import { Task } from '../../../fetching/types/taskTypes';
import { useHouseholdTasks } from '../../hooks/useHouseholdTasks';
import TasksList from '../../components/Task/TaskList';

const TaskScreen: React.FC = () => {
  const householdId = useHouseholdId();
  const token = useAuthToken();
  const loginDetails = useLoginDetails();

  const { tasks, loading, error } = useHouseholdTasks({
    householdId: householdId ? Number(householdId) : null,
    userToken: token,
    shouldFetch: !!householdId,
  });

  const [activeTab, setActiveTab] = useState('Planned');

  // Define color based on login type (same logic as NavbarScreen)
  const activeColor = useMemo(() => {
    const loginType = loginDetails?.loginType;
    const isMember = loginType === 'Member';
    const color = isMember ? '#289546' : '#065084';
    console.log('TaskScreen - Login Type:', loginType, 'Is Member:', isMember, 'Active Color:', color);
    return color;
  }, [loginDetails?.loginType]);

  // Determine which top frame image to use based on login type
  const getTopFrameImage = () => {
    try {
      if (loginDetails?.loginType === 'Member') {
        return require('../../../assets/image/Member/TopFrame.png');
      }
      return require('../../../assets/image/TopFrame.png');
    } catch (error) {
      console.error('Error loading TopFrame image:', error);
      return require('../../../assets/image/TopFrame.png'); // Fallback to default
    }
  };

  const handleRefresh = useCallback(() => {
    console.log('Refresh triggered - tasks will reload automatically');
  }, []);

  const handleTaskPress = useCallback(async (task: Task) => {
    try {
      console.log('Task pressed:', task.taskName);
      
      const taskName = task?.taskName || 'Unknown Task';
      const empName = task?.householdName || 'Unknown';
      // const location = task?.location || 'Unknown location';
      const time = task?.time || 'Unknown time';
      const status = task?.status || 'Unknown status';
      const notes = task?.notes || 'No notes available';
      
      let dateString = 'Unknown date';
      try {
        if (task?.updatedAt) {
          const date = new Date(task.updatedAt);
          if (!isNaN(date.getTime())) {
            dateString = date.toLocaleDateString();
          }
        }
      } catch (dateError) {
        console.error('Date parsing error:', dateError);
      }

      Alert.alert(
        taskName,
        `Employee: ${empName}\nTime: ${time}\nDate: ${dateString}\nStatus: ${status}\n\nNotes: ${notes}`,
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

  React.useEffect(() => {
    console.log('TaskScreen Debug Info:', {
      householdId,
      hasToken: !!token,
      loginType: loginDetails?.loginType,
      tasksCount: tasks?.length || 0,
      loading,
      error: error?.message || error,
      activeTab,
      filteredCount: filteredTasks.length,
    });
  }, [householdId, token, loginDetails, tasks, loading, error, activeTab, filteredTasks]);

  // Get task count for each tab
  const getTaskCount = (tabName: string) => {
    if (!tasks || !Array.isArray(tasks)) return 0;
    return tasks.filter(task => 
      String(task?.status || '').toLowerCase() === tabName.toLowerCase()
    ).length;
  };

  // Create dynamic styles based on active color
  const dynamicStyles = useMemo(() => ({
    tabButtonActive: {
      backgroundColor: activeColor,
      elevation: 3,
      shadowColor: activeColor,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    badgeTextActive: {
      color: activeColor,
    },
  }), [activeColor]);

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
        source={getTopFrameImage()}
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
        <View style={styles.tabWrapper}>
          <TouchableOpacity 
            onPress={() => setActiveTab('Planned')}
            style={[
              styles.tabButton,
              activeTab === 'Planned' && dynamicStyles.tabButtonActive
            ]}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'Planned' && styles.tabTextActive
            ]}>
              Planned
            </Text>
            {getTaskCount('Planned') > 0 && (
              <View style={[
                styles.badge,
                activeTab === 'Planned' && styles.badgeActive
              ]}>
                <Text style={[
                  styles.badgeText,
                  activeTab === 'Planned' && dynamicStyles.badgeTextActive
                ]}>
                  {getTaskCount('Planned')}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('Upcoming')}
            style={[
              styles.tabButton,
              activeTab === 'Upcoming' && dynamicStyles.tabButtonActive
            ]}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'Upcoming' && styles.tabTextActive
            ]}>
              Upcoming
            </Text>
            {getTaskCount('Upcoming') > 0 && (
              <View style={[
                styles.badge,
                activeTab === 'Upcoming' && styles.badgeActive
              ]}>
                <Text style={[
                  styles.badgeText,
                  activeTab === 'Upcoming' && dynamicStyles.badgeTextActive
                ]}>
                  {getTaskCount('Upcoming')}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('Completed')}
            style={[
              styles.tabButton,
              activeTab === 'Completed' && dynamicStyles.tabButtonActive
            ]}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'Completed' && styles.tabTextActive
            ]}>
              Completed
            </Text>
            {getTaskCount('Completed') > 0 && (
              <View style={[
                styles.badge,
                activeTab === 'Completed' && styles.badgeActive
              ]}>
                <Text style={[
                  styles.badgeText,
                  activeTab === 'Completed' && dynamicStyles.badgeTextActive
                ]}>
                  {getTaskCount('Completed')}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
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
    color: '#FFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 0,
  },
  // Enhanced tab container with better styling
  tabContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 4,
    justifyContent: 'space-between',
  },
  // Enhanced tab button with rounded rectangle design
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  // Note: tabButtonActive is now handled by dynamicStyles
  // Enhanced text styling
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  // Task count badge
  badge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    paddingHorizontal: 6,
  },
  badgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666666',
  },
  // Note: badgeTextActive is now handled by dynamicStyles
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