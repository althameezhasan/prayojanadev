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

  const { tasks, loading: tasksLoading, error: tasksError } = useHouseholdTasks({
    householdId,
    userToken: undefined,
    shouldFetch: !!householdId,
  });

  useEffect(() => {
    console.log('🔍 Processing API responses...');

    if (shouldFetchMemberInfo && memberInfo && loginDetails?.id) {
      console.log('📋 Processing Member API response...');
      
      const data = memberInfo.message.data;
      
      // Extract household ID from new structure
      const extractedHouseholdId = data.household && data.household.length > 0 
        ? data.household[0].household_id 
        : data.household_id; // fallback to legacy field
      
      setHouseholdId(extractedHouseholdId || null);

      // Check if this is the new API structure with direct member data
      if (data.memberName && data.memberId === loginDetails.id) {
        console.log('✅ Using new API structure - direct member data');
        setMemberName(data.memberName);
      } 
      // Fallback to legacy structure
      else if (data.memberArr && data.memberArr.length > 0) {
        console.log('🔄 Using legacy API structure - memberArr');
        const currentMember = data.memberArr.find(
          (member) => member.memberId === loginDetails.id,
        );

        if (currentMember) {
          console.log('✅ Found matching member in memberArr:', currentMember);
          setMemberName(currentMember.memberName);
        } else {
          console.log('❌ No matching member found in memberArr');
          setMemberName('Member');
        }
      } else {
        console.log('❌ No member data found');
        setMemberName('Member');
      }

      // Process team members from new structure
      const team: TeamMember[] = [];

      // Add captains (new structure supports multiple captains)
      if (data.captains && data.captains.length > 0) {
        data.captains.forEach((captain) => {
          team.push({
            name: captain.name,
            role: 'Captain',
            profilePic: captain.profilePic,
            empId: captain.empId,
          });
        });
      }
      // Fallback to legacy captain structure
      else if (data.captain) {
        team.push({
          name: data.captain.name,
          role: 'Captain',
          profilePic: data.captain.profilePic,
          empId: data.captain.empId,
        });
      }

      // Add carebuddies (new structure)
      if (data.carebuddies && data.carebuddies.length > 0) {
        data.carebuddies.forEach((buddy) => {
          team.push({
            name: buddy.carebuddyName,
            role: `${buddy.carebuddyType} Care Buddy`,
            profilePic: buddy.profilePic,
            carebuddyType: buddy.carebuddyType,
          });
        });
      }
      // Fallback to legacy carebuddy structure
      else if (data.carebuddyObj && data.carebuddyObj.length > 0) {
        data.carebuddyObj.forEach((buddy) => {
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

  const isLoading = (shouldFetchMemberInfo && memberLoading) ||
                   (shouldFetchRelativeInfo && relativeLoading) ||
                   (shouldFetchPayingChildInfo && payingChildLoading);
  
  const hasError = (shouldFetchMemberInfo && memberError) ||
                  (shouldFetchRelativeInfo && relativeError) ||
                  (shouldFetchPayingChildInfo && payingChildError);

  const isLoadingMemberName = isLoading && !memberName;

  useEffect(() => {
    onDataLoaded({
      memberName,
      householdId,
      teamMembers,
      isLoading,
      hasError,
    });
  }, [memberName, householdId, teamMembers, isLoading, hasError, onDataLoaded]);

  const handleSeeAllPress = () => {
    console.log('See All tasks pressed');
  };

  const handleEditPress = () => {
    console.log('Edit task pressed');
  };

  const getFirstLetter = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <View style={styles.headerContainer}>
      <ImageBackground
        source={require('../../../assets/image/Hometopbg.png')}
        style={styles.headerBackground}
        imageStyle={styles.headerBackgroundImage}
      >
        <View style={styles.headerOverlay}>
          <View style={styles.headerContent}>
            <View style={styles.headerRow}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {getFirstLetter(memberName)}
                  </Text>
                </View>
              </View>

              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome,</Text>
                {isLoadingMemberName ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.loadingText}>Loading...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.memberNameText}>{memberName}!</Text>
                    {householdId && (
                      <Text style={styles.householdIdText}>
                      </Text>
                    )}
                  </>
                )}
                {hasError && (
                  <Text style={styles.errorText}>
                    Failed to load details
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

            {householdId && tasks && tasks.length > 0 && (
              <View style={styles.tasksInHeader}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskHeaderTitle}>Upcoming task</Text>
                  <TouchableOpacity
                    style={styles.seeAllButton}
                    onPress={handleSeeAllPress}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.seeAllText}>see all</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.headerTaskCard}>
                  <View style={styles.headerTaskTop}>
                    <Text style={styles.headerTaskTitle} numberOfLines={1}>
                      {tasks[0].task_name}
                    </Text>
                    <TouchableOpacity
                      onPress={handleEditPress}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={require('../../../assets/image/edit.png')}
                        style={styles.headerTaskEditIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.headerTaskBottom}>
                    <View style={styles.headerTaskInfo}>
                      <Image
                        source={require('../../../assets/image/icons/user.png')}
                        style={styles.headerTaskIconImage}
                      />
                      <Text style={styles.headerTaskText}>{tasks[0].empName}</Text>
                    </View>
                    <View style={styles.headerTaskDivider} />
                    <View style={styles.headerTaskTimeDate}>
                      <View style={styles.headerTaskInfo}>
                        <Image
                          source={require('../../../assets/image/icons/time.png')}
                          style={styles.headerTaskIconImage}
                        />
                        <Text style={styles.headerTaskText}>{tasks[0].time}</Text>
                      </View>
                      <View style={styles.headerTaskInfo}>
                        <Image
                          source={require('../../../assets/image/icons/time.png')}
                          style={styles.headerTaskIconImage}
                        />
                        <Text style={styles.headerTaskText}>
                          {new Date(tasks[0].date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
      <View style={styles.curvedBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    height: 340,
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
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 16,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  welcomeSection: {
    flex: 1,
    alignItems: 'flex-start',
    marginRight: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
  },
  memberNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  householdIdText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e8f5ff',
    marginBottom: 4,
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
  tasksInHeader: {
    marginTop: 20,
    paddingHorizontal: 0,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
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
    marginRight: 8, // Add margin to prevent overlap with edit icon
  },
  headerTaskEditIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerTaskBottom: {
    backgroundColor: '#eee',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTaskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTaskIconImage: {
    width: 14,
    height: 14,
    marginRight: 4,
    resizeMode: 'contain',
  },
  headerTaskText: {
    fontSize: 13,
    color: '#1a1a1a',
  },
  headerTaskTimeDate: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  headerTaskDivider: {
    width: 1,
    height: 40, // Adjusted to match the height of the time/date stack
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
});

export default HomeScreenHeader;
export type { TeamMember };