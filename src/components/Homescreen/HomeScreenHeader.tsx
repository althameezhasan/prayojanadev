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
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  const shouldFetchMemberInfo = loginDetails?.loginType === 'Member';
  const shouldFetchRelativeInfo = loginDetails?.loginType === 'Relative';
  const shouldFetchPayingChildInfo = loginDetails?.loginType === 'Paying Child';
  
  const memberId = loginDetails?.id || null;



  // Determine which background image to use based on login type
  const getBackgroundImage = () => {
    if (loginDetails?.loginType === 'Member') {
      return require('../../../assets/image/Member/Hometopbg.png');
    } else {
      return require('../../../assets/image/Hometopbg.png');
    }
  };

  // Determine which task user icon to use based on login type
  const getTaskUserIcon = () => {
    if (loginDetails?.loginType === 'Member') {
      return require('../../../assets/image/Member/User2.png');
    } else {
      return require('../../../assets/image/User2.png');
    }
  };

  // Determine which task time icon to use based on login type
  const getTaskTimeIcon = () => {
    if (loginDetails?.loginType === 'Member') {
      return require('../../../assets/image/Member/time.png');
    } else {
      return require('../../../assets/image/icons/time.png');
    }
  };

  // Determine which task edit icon to use based on login type
  const getTaskEditIcon = () => {
    if (loginDetails?.loginType === 'Member') {
      return require('../../../assets/image/Member/edit.png');
    } else {
      return require('../../../assets/image/edit.png');
    }
  };

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
      
      const extractedHouseholdId = data.household && data.household.length > 0 
        ? data.household[0].household_id 
        : data.household_id;
      
      setHouseholdId(extractedHouseholdId || null);
      setProfilePhotoUrl(data.memberPic || null);
      console.log('📸 Member Profile Photo URL:', data.memberPic);

      if (data.memberName && data.memberId === loginDetails.id) {
        console.log('✅ Using new API structure - direct member data');
        setMemberName(data.memberName);
      } else if (data.memberArr && data.memberArr.length > 0) {
        console.log('🔄 Using legacy API structure - memberArr');
        const currentMember = data.memberArr.find(
          (member) => member.memberId === loginDetails.id,
        );

        if (currentMember) {
          console.log('✅ Found matching member in memberArr:', currentMember);
          setMemberName(currentMember.memberName);
          if (!data.memberPic && currentMember.memberPic) {
            setProfilePhotoUrl(currentMember.memberPic);
            console.log('📸 Member Profile Photo URL (from memberArr):', currentMember.memberPic);
          }
        } else {
          console.log('❌ No matching member found in memberArr');
          setMemberName('Member');
        }
      } else {
        console.log('❌ No member data found');
        setMemberName('Member');
      }

      const team: TeamMember[] = [];

      if (data.captains && data.captains.length > 0) {
        data.captains.forEach((captain) => {
          team.push({
            name: captain.name,
            role: 'Captain',
            profilePic: captain.profilePic,
            empId: captain.empId,
          });
        });
      } else if (data.captain) {
        team.push({
          name: data.captain.name,
          role: 'Captain',
          profilePic: data.captain.profilePic,
          empId: data.captain.empId,
        });
      }

      if (data.carebuddies && data.carebuddies.length > 0) {
        data.carebuddies.forEach((buddy) => {
          team.push({
            name: buddy.carebuddyName,
            role: `${buddy.carebuddyType} Care Buddy`,
            profilePic: buddy.profilePic,
            carebuddyType: buddy.carebuddyType,
          });
        });
      } else if (data.carebuddyObj && data.carebuddyObj.length > 0) {
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
      setProfilePhotoUrl(relativeInfo.message.data.profile_photo_url || null);
      console.log('📸 Relative Profile Photo URL:', relativeInfo.message.data.profile_photo_url);

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
      setProfilePhotoUrl(payingChildInfo.message.data.profile_photo_url || null);
      console.log('📸 Paying Child Profile Photo URL:', payingChildInfo.message.data.profile_photo_url);

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
      setProfilePhotoUrl(null);
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

  const handleEditPress = () => {
    console.log('Edit task pressed');
  };

  const getFirstLetter = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const renderAvatar = () => {
    if (profilePhotoUrl) {
      return (
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: profilePhotoUrl }}
            style={styles.profilePhoto}
            defaultSource={require('../../../assets/image/avatar.png')}
            onError={() => {
              console.log('❌ Failed to load profile photo, falling back to letter avatar');
              setProfilePhotoUrl(null);
            }}
          />
        </View>
      );
    }

    return (
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {getFirstLetter(memberName)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.headerContainer}>
      <ImageBackground
        source={getBackgroundImage()}
        style={styles.headerBackground}
        imageStyle={styles.headerBackgroundImage}
      >
        <View style={styles.headerOverlay}>
          <View style={styles.headerContent}>
            <View style={styles.headerRow}>
              {renderAvatar()}

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
                </View>
                <View style={styles.headerTaskCard}>
                  <View style={styles.headerTaskTop}>
                    <Text style={styles.headerTaskTitle} numberOfLines={1}>
                      {tasks[0].taskName}
                    </Text>
                    <TouchableOpacity
                      onPress={handleEditPress}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={getTaskEditIcon()}
                        style={styles.headerTaskEditIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.headerTaskBottom}>
                    <View style={styles.headerTaskInfo}>
                      <Image
                        source={getTaskUserIcon()}
                        style={styles.headerTaskIconImage}
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.carebuddyTitle}>Carebuddy</Text>
                        <Text style={styles.headerTaskText}>{tasks[0].householdName}</Text>
                      </View>
                    </View>
                    <View style={styles.headerTaskDivider} />
                    <View style={styles.headerTaskTimeDate}>
                      <View style={styles.headerTaskInfo}>
                        <Image
                          source={getTaskTimeIcon()}
                          style={styles.headerTaskIconImage}
                        />
                        <View style={styles.textContainer}>
                          <Text style={styles.headerTaskText}>{tasks[0].time}</Text>
                          <Text style={styles.headerTaskText}>
                            {new Date(tasks[0].validTill).toLocaleDateString('en-GB', {
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
    height: 360,
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffffff',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerTaskCard: {
    backgroundColor: '#E6E6E6',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 5,
    paddingBottom: 15,
  },
  headerTaskTop: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  headerTaskEditIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  headerTaskBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e6e6e6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerTaskInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerTaskIconImage: {
    width: 32,
    height: 32,
    marginRight: 8,
    resizeMode: 'contain',
  },
  textContainer: {
    flexDirection: 'column',
  },
  carebuddyTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  headerTaskText: {
    fontSize: 14,
    color: '#333',
  },
  headerTaskDivider: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 12,
  },
  headerTaskTimeDate: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default HomeScreenHeader;
export type { TeamMember };