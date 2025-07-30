import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { useAuth, useLoginDetails } from '../../context/AuthContext';
import { useMemberInfo } from '../../hooks/useMemberInfo';
import { useHouseholdTasks } from '../../hooks/useHouseholdTasks';
import { Task } from '../../../fetching/types/taskTypes';
import TasksList from '../../components/Homescreen/TasksList';

const { width: screenWidth } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigateToDashboard: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToDashboard }) => {
  const { logout } = useAuth();
  const loginDetails = useLoginDetails();
  const [memberName, setMemberName] = useState<string>('');
  const [householdId, setHouseholdId] = useState<number | null>(null);

  // Only fetch member info if loginType is "Member"
  const shouldFetchMemberInfo = loginDetails?.loginType === 'Member';
  const memberId = shouldFetchMemberInfo ? loginDetails?.id : null;

  console.log('🏠 HomeScreen - Login Details:', {
    loginType: loginDetails?.loginType,
    id: loginDetails?.id,
    shouldFetchMemberInfo,
    memberId,
  });

  // Use the member info hook
  const { memberInfo, loading: memberLoading, error: memberError } = useMemberInfo({
    memberId: memberId,
    userToken: undefined,
    shouldFetch: shouldFetchMemberInfo,
  });

  // Use household tasks hook
  const { tasks, loading: tasksLoading, error: tasksError } = useHouseholdTasks({
    householdId,
    userToken: undefined,
    shouldFetch: !!householdId,
  });

  // Extract member name and household ID when memberInfo is available
  useEffect(() => {
    if (shouldFetchMemberInfo && memberInfo && loginDetails?.id) {
      console.log('🔍 Searching for member in memberArr...');
      console.log('🆔 Looking for ID:', loginDetails.id);
      console.log('👥 Available members:', memberInfo.message.data.memberArr);
      console.log('🏠 Household ID from API:', memberInfo.message.data.household_id);

      // Extract household_id from the API response
      setHouseholdId(memberInfo.message.data.household_id);

      // Find the member with matching ID
      const currentMember = memberInfo.message.data.memberArr.find(
        (member) => member.memberId === loginDetails.id,
      );

      if (currentMember) {
        console.log('✅ Found matching member:', currentMember);
        setMemberName(currentMember.memberName);
      } else {
        console.log('❌ No matching member found');
        setMemberName('Member');
      }
    } else if (!shouldFetchMemberInfo) {
      setMemberName(loginDetails?.loginType || 'User');
      setHouseholdId(null);
    }
  }, [memberInfo, loginDetails, shouldFetchMemberInfo]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNotificationPress = () => {
    console.log('Notification icon pressed');
  };

  const handleTaskPress = (task: Task) => {
    console.log('Task pressed:', task);
    // Add your task action logic here
  };

  const handleRefresh = () => {
    console.log('Refreshing tasks...');
    // Refresh logic can be implemented here if needed
  };

  const handleSeeAllPress = () => {
    console.log('See All button pressed');
    // No action linked yet as per requirement
  };

  const isLoadingMemberName = shouldFetchMemberInfo && memberLoading && !memberName;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Curved Header with Background Image */}
        <View style={styles.headerContainer}>
          <ImageBackground
            source={require('../../../assets/image/Hometopbg.png')}
            style={styles.headerBackground}
            imageStyle={styles.headerBackgroundImage}
          >
            {/* Header Overlay */}
            <View style={styles.headerOverlay}>
              {/* Header Content - Welcome Section and Notification */}
              <View style={styles.headerContent}>
                <View style={styles.headerRow}>
                  <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>Welcome!</Text>

                    {isLoadingMemberName ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#ffffff" />
                        <Text style={styles.loadingText}>Loading member info...</Text>
                      </View>
                    ) : (
                      <>
                        <Text style={styles.memberNameText}>{memberName}</Text>
                        {/* Display Household ID for members */}
                        {shouldFetchMemberInfo && householdId && (
                          <Text style={styles.householdIdText}>
                            Household ID: {householdId}
                          </Text>
                        )}
                        <Text style={styles.loginTypeText}>
                          Logged in as: {loginDetails?.loginType || 'User'}
                        </Text>
                      </>
                    )}

                    {/* Show error if member info fetch failed */}
                    {shouldFetchMemberInfo && memberError && (
                      <Text style={styles.errorText}>Failed to load member details</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.notificationButton}
                    onPress={handleNotificationPress}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('../../../assets/image/icons/notification.png')}
                      style={styles.notificationIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>

          {/* Curved Bottom Shape */}
          <View style={styles.curvedBottom} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Tasks Section - Only show for members with household ID */}
          {shouldFetchMemberInfo && householdId && (
            <View style={styles.tasksSection}>
              <TasksList
                tasks={tasks?.slice(0, 1) || []} // Limit to one task
                loading={tasksLoading}
                error={tasksError}
                onTaskPress={handleTaskPress}
                onRefresh={handleRefresh}
              />
           
            </View>
          )}

          <View style={styles.mainContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>🎉</Text>
            </View>

            <Text style={styles.title}>You're Successfully Logged In!</Text>
            <Text style={styles.subtitle}>
              Welcome to your personalized experience. Explore your dashboard and tasks below.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.dashboardButton}
                onPress={onNavigateToDashboard}
                activeOpacity={0.8}
              >
                <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
                <Text style={styles.dashboardButtonIcon}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Explore more features using the navigation bar below
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    position: 'relative',
    height: 250,
  },
  headerBackground: {
    flex: 1,
    width: '100%',
  },
  headerBackgroundImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 124, 145, 0.8)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 24,
  },
  headerContent: {
    flex: 1,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  curvedBottom: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: '#007C91',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    padding: 24,
    marginTop: -20,
  },
  welcomeSection: {
    width: '70%',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  memberNameText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  householdIdText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e8f5ff',
    marginBottom: 4,
  },
  loginTypeText: {
    fontSize: 14,
    color: '#e8f5ff',
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ffcccb',
    fontWeight: '500',
    marginTop: 4,
  },
  notificationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#ffffff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#e8f5ff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  dashboardButton: {
    backgroundColor: '#007C91',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 12,
  },
  dashboardButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  dashboardButtonIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  tasksSection: {
    marginBottom: 20,
  },
  seeAllButton: {
    backgroundColor: '#007C91',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 12,
  },
  seeAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;