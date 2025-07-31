import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
} from 'react-native';
import { useLoginDetails } from '../../context/AuthContext';
import { useMemberInfo } from '../../hooks/useMemberInfo';
import { useRelativeInfo } from '../../hooks/useRelativeInfo';
import { usePayingChildInfo } from '../../hooks/usePayingChildInfo';
import { useHouseholdTasks } from '../../hooks/useHouseholdTasks';

interface HomeScreenHeaderProps {
  onNotificationPress: () => void;
}

interface TeamMember {
  name: string;
  role: string;
  profilePic: string;
  empId?: string;
  carebuddyType?: string;
}

export interface HeaderData {
  memberName: string;
  householdId: number | null;
  teamMembers: TeamMember[];
  isLoading: boolean;
  hasError: boolean;
}

interface HomeScreenHeaderWithDataProps extends HomeScreenHeaderProps {
  onDataLoaded: (data: HeaderData) => void;
}

const HomeScreenHeader: React.FC<HomeScreenHeaderWithDataProps> = ({ 
  onNotificationPress, 
  onDataLoaded 
}) => {
  const loginDetails = useLoginDetails();
  const [memberName, setMemberName] = useState<string>('');
  const [householdId, setHouseholdId] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Determine which API to call based on login type
  const shouldFetchMemberInfo = loginDetails?.loginType === 'Member';
  const shouldFetchRelativeInfo = loginDetails?.loginType === 'Relative';
  const shouldFetchPayingChildInfo = loginDetails?.loginType === 'Paying Child';
  
  const memberId = loginDetails?.id || null;

  console.log('🏠 HomeScreenHeader - Login Details:', {
    loginType: loginDetails?.loginType,
    id: loginDetails?.id,
    shouldFetchMemberInfo,
    shouldFetchRelativeInfo,
    shouldFetchPayingChildInfo,
    memberId,
  });

  // Use the appropriate hooks based on login type
  const { memberInfo, loading: memberLoading, error: memberError } = useMemberInfo({
    memberId: shouldFetchMemberInfo ? memberId : null,
    userToken: undefined,
    shouldFetch: shouldFetchMemberInfo,
  });

  const { relativeInfo, loading: relativeLoading, error: relativeError } = useRelativeInfo({
    memberId: shouldFetchRelativeInfo ? memberId : null,
    userToken: undefined,
    shouldFetch: shouldFetchRelativeInfo,
  });

  const { payingChildInfo, loading: payingChildLoading, error: payingChildError } = usePayingChildInfo({
    memberId: shouldFetchPayingChildInfo ? memberId : null,
    userToken: undefined,
    shouldFetch: shouldFetchPayingChildInfo,
  });

  // Use household tasks hook
  const { tasks, loading: tasksLoading, error: tasksError } = useHouseholdTasks({
    householdId,
    userToken: undefined,
    shouldFetch: !!householdId,
  });

  // Extract member name, household ID, and team info when any API response is available
  useEffect(() => {
    console.log('🔍 Processing API responses...');

    // Handle Member API response
    if (shouldFetchMemberInfo && memberInfo && loginDetails?.id) {
      console.log('📋 Processing Member API response...');
      
      setHouseholdId(memberInfo.message.data.household_id);

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

      // Extract team members (captain and care buddies)
      const team: TeamMember[] = [];

      if (memberInfo.message.data.captain) {
        team.push({
          name: memberInfo.message.data.captain.name,
          role: 'Captain',
          profilePic: memberInfo.message.data.captain.profilePic,
          empId: memberInfo.message.data.captain.empId,
        });
      }

      if (memberInfo.message.data.carebuddyObj && memberInfo.message.data.carebuddyObj.length > 0) {
        memberInfo.message.data.carebuddyObj.forEach((buddy) => {
          team.push({
            name: buddy.carebuddyName,
            role: `${buddy.carebuddyType} Care Buddy`,
            profilePic: buddy.profilePic,
            carebuddyType: buddy.carebuddyType,
          });
        });
      }

      setTeamMembers(team);
      console.log('👨‍⚕️ Team Members from Member API:', team);
    }

    // Handle Relative API response
    if (shouldFetchRelativeInfo && relativeInfo && loginDetails?.id) {
      console.log('📋 Processing Relative API response...');
      
      setHouseholdId(relativeInfo.message.data.household_id);

      const currentMember = relativeInfo.message.data.members.find(
        (member) => member.memberId === loginDetails.id,
      );

      if (currentMember) {
        console.log('✅ Found matching relative member:', currentMember);
        setMemberName(currentMember.memberName);
      } else {
        console.log('❌ No matching relative member found, using root name');
        setMemberName(relativeInfo.message.data.name || 'Relative');
      }

      // Extract team members (captains and care buddies)
      const team: TeamMember[] = [];

      if (relativeInfo.message.data.captains && relativeInfo.message.data.captains.length > 0) {
        relativeInfo.message.data.captains.forEach((captain) => {
          team.push({
            name: captain.name,
            role: 'Captain',
            profilePic: captain.profilePic,
            empId: captain.empId,
          });
        });
      }

      if (relativeInfo.message.data.carebuddies && relativeInfo.message.data.carebuddies.length > 0) {
        relativeInfo.message.data.carebuddies.forEach((buddy) => {
          team.push({
            name: buddy.carebuddyName,
            role: `${buddy.carebuddyType} Care Buddy`,
            profilePic: buddy.profilePic,
            carebuddyType: buddy.carebuddyType,
          });
        });
      }

      setTeamMembers(team);
      console.log('👨‍⚕️ Team Members from Relative API:', team);
    }

    // Handle Paying Child API response
    if (shouldFetchPayingChildInfo && payingChildInfo && loginDetails?.id) {
      console.log('📋 Processing Paying Child API response...');
      
      setHouseholdId(payingChildInfo.message.data.household_id);

      const currentMember = payingChildInfo.message.data.members.find(
        (member) => member.memberId === loginDetails.id,
      );

      if (currentMember) {
        console.log('✅ Found matching paying child member:', currentMember);
        setMemberName(currentMember.memberName);
      } else {
        console.log('❌ No matching paying child member found, using root name');
        setMemberName(payingChildInfo.message.data.name || 'Paying Child');
      }

      // Extract team members (captains and care buddies)
      const team: TeamMember[] = [];

      if (payingChildInfo.message.data.captains && payingChildInfo.message.data.captains.length > 0) {
        payingChildInfo.message.data.captains.forEach((captain) => {
          team.push({
            name: captain.name,
            role: 'Captain',
            profilePic: captain.profilePic,
            empId: captain.empId,
          });
        });
      }

      if (payingChildInfo.message.data.carebuddies && payingChildInfo.message.data.carebuddies.length > 0) {
        payingChildInfo.message.data.carebuddies.forEach((buddy) => {
          team.push({
            name: buddy.carebuddyName,
            role: `${buddy.carebuddyType} Care Buddy`,
            profilePic: buddy.profilePic,
            carebuddyType: buddy.carebuddyType,
          });
        });
      }

      setTeamMembers(team);
      console.log('👨‍⚕️ Team Members from Paying Child API:', team);
    }

    // Handle cases where no API should be called
    if (!shouldFetchMemberInfo && !shouldFetchRelativeInfo && !shouldFetchPayingChildInfo) {
      setMemberName(loginDetails?.loginType || 'User');
      setHouseholdId(null);
      setTeamMembers([]);
    }
  }, [
    memberInfo, 
    relativeInfo, 
    payingChildInfo, 
    loginDetails, 
    shouldFetchMemberInfo, 
    shouldFetchRelativeInfo, 
    shouldFetchPayingChildInfo
  ]);

  // Determine loading and error states
  const isLoading = (shouldFetchMemberInfo && memberLoading) || 
                   (shouldFetchRelativeInfo && relativeLoading) || 
                   (shouldFetchPayingChildInfo && payingChildLoading);
  
  const hasError = (shouldFetchMemberInfo && memberError) || 
                  (shouldFetchRelativeInfo && relativeError) || 
                  (shouldFetchPayingChildInfo && payingChildError);

  const isLoadingMemberName = isLoading && !memberName;

  // Pass data back to parent component
  useEffect(() => {
    onDataLoaded({
      memberName,
      householdId,
      teamMembers,
      isLoading,
      hasError,
    });
  }, [memberName, householdId, teamMembers, isLoading, hasError, onDataLoaded]);

  return (
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
                    {/* Display Household ID for supported member types */}
                    {householdId && (
                      <Text style={styles.householdIdText}>
                        Household ID: {householdId}
                      </Text>
                    )}
                    <Text style={styles.loginTypeText}>
                      Logged in as: {loginDetails?.loginType || 'User'}
                    </Text>
                    <Text style={styles.loginTypeText}>
                      Logged in as: {loginDetails?.id || 'User'}
                    </Text>
                  </>
                )}

                {/* Show error if any API fetch failed */}
                {hasError && (
                  <Text style={styles.errorText}>
                    Failed to load {loginDetails?.loginType?.toLowerCase()} details
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../../../assets/image/icons/notification.png')}
                  style={styles.notificationIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Task Card directly in header */}
            {householdId && tasks && tasks.length > 0 && (
              <View style={styles.tasksInHeader}>
                <View style={styles.headerTaskCard}>
                  {/* Top white section */}
                  <View style={styles.headerTaskTop}>
                    <Text style={styles.headerTaskTitle} numberOfLines={1}>
                      {tasks[0].task_name}
                    </Text>
                  </View>

                  {/* Bottom info section */}
                  <View style={styles.headerTaskBottom}>
                    <View style={styles.headerTaskInfo}>
                      <Text style={styles.headerTaskIcon}>👤</Text>
                      <Text style={styles.headerTaskText}>{tasks[0].empName}</Text>
                    </View>

                    <View style={styles.headerTaskDivider} />

                    <View style={styles.headerTaskInfo}>
                      <Text style={styles.headerTaskIcon}>🕒</Text>
                      <Text style={styles.headerTaskText}>{tasks[0].time}</Text>
                    </View>

                    <Text style={styles.headerTaskDate}>
                      {new Date(tasks[0].date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>

      {/* Curved Bottom Shape */}
      <View style={styles.curvedBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    height: 350, // Increased height to accommodate task card
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
  // Task card styles in header
  tasksInHeader: {
    marginTop: 20,
    paddingHorizontal: 0,
  },
  headerTaskCard: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  headerTaskTop: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  headerTaskBottom: {
    backgroundColor: '#eee',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTaskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTaskIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  headerTaskText: {
    fontSize: 13,
    color: '#1a1a1a',
  },
  headerTaskDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  headerTaskDate: {
    fontSize: 13,
    color: '#1a1a1a',
  },
});

export default HomeScreenHeader;
export type { TeamMember };