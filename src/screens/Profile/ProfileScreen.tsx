import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useAuth, useLoginDetails, useAuthToken } from '../../context/AuthContext';
import { useMemberInfo } from '../../hooks/useMemberInfo';
import { useRelativeInfo } from '../../hooks/useRelativeInfo';
import { usePayingChildInfo } from '../../hooks/usePayingChildInfo';

// Import our new components
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileMenu from '../../components/profile/ProfileMenu';
import LogoutButton from '../../components/profile/LogoutButton';
import {
  PersonalDetailsModal,
  MemberInfoModal,
  TeamInfoModal,
  RelativeInfoModal,
  SponsorDetailsModal,
} from '../../components/profile/ProfileModals';

interface ProfileData {
  name: string;
  memberId: number | null;
  memberType: string;
  profilePhotoUrl: string | null;
}

const ProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const loginDetails = useLoginDetails();
  const userToken = useAuthToken();

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    memberId: null,
    memberType: '',
    profilePhotoUrl: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Modal states for different sections
  const [memberInfoModalVisible, setMemberInfoModalVisible] = useState(false);
  const [teamInfoModalVisible, setTeamInfoModalVisible] = useState(false);
  const [personalDetailsModalVisible, setPersonalDetailsModalVisible] = useState(false);
  const [relativeInfoModalVisible, setRelativeInfoModalVisible] = useState(false);
  const [sponsorDetailsModalVisible, setSponsorDetailsModalVisible] = useState(false);

  // States to track which data to fetch
  const [shouldFetchMemberDetails, setShouldFetchMemberDetails] = useState(false);
  const [shouldFetchTeamDetails, setShouldFetchTeamDetails] = useState(false);
  const [shouldFetchRelativeDetails, setShouldFetchRelativeDetails] = useState(false);
  const [shouldFetchSponsorDetails, setShouldFetchSponsorDetails] = useState(false);

  const shouldFetchMemberInfo = loginDetails?.loginType === 'Member';
  const shouldFetchRelativeInfo = loginDetails?.loginType === 'Relative';
  const shouldFetchPayingChildInfo = loginDetails?.loginType === 'Paying Child';
  const memberId = loginDetails?.id || null;

  // Function to get background image based on user type
  const getBackgroundImage = () => {
    const userType = profileData.memberType || loginDetails?.loginType || 'Member';
    
    switch (userType) {
      case 'Member':
        return require('../../../assets/image/Member/Profilebg.png');
      // case 'Relative':
      //   return require('../../../assets/image/Profilebg.png');
      // case 'Paying Child':
      //   return require('../../../assets/image/PayingChild/Profilebg.png');
      default:
        return require('../../../assets/image/Profilebg.png'); // fallback to default
    }
  };

  // Getting Relation_ID
  const getRelationId = () => {
    if (shouldFetchMemberInfo && initialMemberInfo && profileData.memberType === 'Member') {
      const relativeData = initialMemberInfo.message.data.relativeData;
      if (relativeData && relativeData.length > 0) {
        return relativeData[0].relation_id;
      }
    }
    return null;
  };

  // Hook for initial profile data
  const { memberInfo: initialMemberInfo, loading: memberLoading, error: memberError } = useMemberInfo({
    memberId: shouldFetchMemberInfo ? memberId : null,
    userToken: userToken,
    shouldFetch: shouldFetchMemberInfo,
  });

  const { relativeInfo, loading: relativeLoading, error: relativeError } = useRelativeInfo({
    memberId: shouldFetchRelativeInfo || shouldFetchRelativeDetails
      ? profileData.memberType === 'Member' ? getRelationId() : (loginDetails?.id || 998)
      : null,
    userToken: userToken,
    shouldFetch: shouldFetchRelativeInfo || shouldFetchRelativeDetails,
  });

  const { payingChildInfo, loading: payingChildLoading, error: payingChildError } = usePayingChildInfo({
    memberId: shouldFetchPayingChildInfo || shouldFetchSponsorDetails
      ? profileData.memberType === 'Member' ? getRelationId() : memberId
      : null,
    userToken: userToken,
    shouldFetch: shouldFetchPayingChildInfo || shouldFetchSponsorDetails,
  });

  // Hook for detailed member information (when Member Info is clicked)
  const { memberInfo: detailedMemberInfo, loading: detailedMemberLoading, error: detailedMemberError } = useMemberInfo({
    memberId: shouldFetchMemberDetails ? 999 : null,
    userToken: userToken,
    shouldFetch: shouldFetchMemberDetails,
  });

  // Hook for team information (when Team Info is clicked)
  const { memberInfo: teamMemberInfo, loading: teamMemberLoading, error: teamMemberError } = useMemberInfo({
    memberId: shouldFetchTeamDetails ? 999 : null,
    userToken: userToken,
    shouldFetch: shouldFetchTeamDetails,
  });

  // Process API responses and set profile data
  useEffect(() => {
    setIsLoading(
      (shouldFetchMemberInfo && memberLoading) ||
      (shouldFetchRelativeInfo && relativeLoading) ||
      (shouldFetchPayingChildInfo && payingChildLoading)
    );

    setHasError(
      (shouldFetchMemberInfo && !!memberError) ||
      (shouldFetchRelativeInfo && !!relativeError) ||
      (shouldFetchPayingChildInfo && !!payingChildError)
    );

    if (shouldFetchMemberInfo && initialMemberInfo && loginDetails?.id) {
      const data = initialMemberInfo.message.data;
      let name = 'Member';
      let profilePhotoUrl: string | null = data.memberPic || null;

      if (data.memberName && data.memberId === loginDetails.id) {
        name = data.memberName;
      } else if (data.memberArr && data.memberArr.length > 0) {
        const currentMember = data.memberArr.find(
          (member) => member.memberId === loginDetails.id,
        );
        if (currentMember) {
          name = currentMember.memberName;
          if (!profilePhotoUrl && currentMember.memberPic) {
            profilePhotoUrl = currentMember.memberPic;
          }
        }
      }

      setProfileData({
        name,
        memberId: data.memberId || loginDetails.id,
        memberType: loginDetails.loginType,
        profilePhotoUrl,
      });
    }

    if (shouldFetchRelativeInfo && relativeInfo && loginDetails?.id) {
      const currentMember = relativeInfo.message.data.members.find(
        (member) => member.memberId === loginDetails.id
      );
      
      const profilePhotoUrl = relativeInfo.message.data.profile_photo_url || 
                              (currentMember ? currentMember.memberPic : null);
      
      setProfileData({
        name: currentMember ? currentMember.memberName : relativeInfo.message.data.name || 'Relative',
        memberId: loginDetails.id,
        memberType: loginDetails.loginType,
        profilePhotoUrl,
      });
    }

    if (shouldFetchPayingChildInfo && payingChildInfo && loginDetails?.id) {
      const currentMember = payingChildInfo.message.data.members.find(
        (member) => member.memberId === loginDetails.id
      );
      
      const profilePhotoUrl = payingChildInfo.message.data.profile_photo_url || 
                              (currentMember ? currentMember.memberPic : null);
      
      setProfileData({
        name: currentMember ? currentMember.memberName : payingChildInfo.message.data.name || 'Paying Child',
        memberId: loginDetails.id,
        memberType: loginDetails.loginType,
        profilePhotoUrl,
      });
    }

    if (!shouldFetchMemberInfo && !shouldFetchRelativeInfo && !shouldFetchPayingChildInfo) {
      setProfileData({
        name: loginDetails?.loginType || 'User',
        memberId: loginDetails?.id || null,
        memberType: loginDetails?.loginType || 'Unknown',
        profilePhotoUrl: null,
      });
      setIsLoading(false);
    }
  }, [
    initialMemberInfo,
    relativeInfo,
    payingChildInfo,
    loginDetails,
    shouldFetchMemberInfo,
    shouldFetchRelativeInfo,
    shouldFetchPayingChildInfo,
    memberLoading,
    relativeLoading,
    payingChildLoading,
    memberError,
    relativeError,
    payingChildError,
  ]);

  // Log detailed API responses (you can remove these if not needed)
  useEffect(() => {
    if (shouldFetchMemberDetails && detailedMemberInfo && !detailedMemberLoading && !detailedMemberError) {
      console.log('🎯 MEMBER DETAILS API RESPONSE', detailedMemberInfo.message.data);
    }
  }, [shouldFetchMemberDetails, detailedMemberInfo, detailedMemberLoading, detailedMemberError]);

  useEffect(() => {
    if (shouldFetchTeamDetails && teamMemberInfo && !teamMemberLoading && !teamMemberError) {
      console.log('🎯 TEAM DETAILS API RESPONSE', teamMemberInfo.message.data);
    }
  }, [shouldFetchTeamDetails, teamMemberInfo, teamMemberLoading, teamMemberError]);

  useEffect(() => {
    if (shouldFetchRelativeDetails && relativeInfo && !relativeLoading && !relativeError) {
      console.log('🎯 RELATIVE DETAILS API RESPONSE', relativeInfo.message.data);
    }
  }, [shouldFetchRelativeDetails, relativeInfo, relativeLoading, relativeError]);

  useEffect(() => {
    if (shouldFetchSponsorDetails && payingChildInfo && !payingChildLoading && !payingChildError) {
      console.log('🎯 SPONSOR DETAILS API RESPONSE', payingChildInfo.message.data);
    }
  }, [shouldFetchSponsorDetails, payingChildInfo, payingChildLoading, payingChildError]);

  // Event handlers
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfilePhotoError = useCallback(() => {
    setProfileData((prev) => ({ ...prev, profilePhotoUrl: null }));
  }, []);

  const handleMemberInfoPress = () => {
    setShouldFetchMemberDetails(true);
    setMemberInfoModalVisible(true);
  };

  const handleTeamInfoPress = () => {
    setShouldFetchTeamDetails(true);
    setTeamInfoModalVisible(true);
  };

  const handlePersonalDetailsPress = () => {
    setPersonalDetailsModalVisible(true);
  };

  const handleRelativeInfoPress = () => {
    setShouldFetchRelativeDetails(true);
    setRelativeInfoModalVisible(true);
  };

  const handleSponsorDetailsPress = () => {
    setShouldFetchSponsorDetails(true);
    setSponsorDetailsModalVisible(true);
  };

  // Close modal handlers
  const handleCloseMemberInfoModal = () => {
    setMemberInfoModalVisible(false);
    setShouldFetchMemberDetails(false);
  };

  const handleCloseTeamInfoModal = () => {
    setTeamInfoModalVisible(false);
    setShouldFetchTeamDetails(false);
  };

  const handleCloseRelativeInfoModal = () => {
    setRelativeInfoModalVisible(false);
    setShouldFetchRelativeDetails(false);
  };

  const handleCloseSponsorDetailsModal = () => {
    setSponsorDetailsModalVisible(false);
    setShouldFetchSponsorDetails(false);
  };

  // Get current member data for personal details
  const getCurrentMemberData = () => {
    if (shouldFetchMemberInfo && initialMemberInfo && loginDetails?.id) {
      return {
        memberName: initialMemberInfo.message.data.memberName,
        memberId: initialMemberInfo.message.data.memberId,
        phone: initialMemberInfo.message.data.phone,
        telephone_no: initialMemberInfo.message.data.telephone_no,
        memberDob: initialMemberInfo.message.data.dob,
        memberGender: initialMemberInfo.message.data.gender,
        blood_group: initialMemberInfo.message.data.bloodGroup,
        email: initialMemberInfo.message.data.email,
        health_condition: initialMemberInfo.message.data.health_condition,
        memberPic: initialMemberInfo.message.data.memberPic,
        reference_status: {
          name: initialMemberInfo.message.data.reference_status_name,
          id: initialMemberInfo.message.data.reference_status_id,
          reference_status_type: initialMemberInfo.message.data.reference_status_type,
        },
      };
    }
    return null;
  };

  const showRelativesTab = profileData.memberType !== 'Relative';

  return (
    <ImageBackground
      source={getBackgroundImage()}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <ProfileHeader />
          <ProfileCard
            profileData={profileData}
            isLoading={isLoading}
            hasError={hasError}
            onProfilePhotoError={handleProfilePhotoError}
          />
          <ProfileMenu
            showRelativesTab={showRelativesTab}
            onPersonalDetailsPress={handlePersonalDetailsPress}
            onMemberInfoPress={handleMemberInfoPress}
            onSponsorDetailsPress={handleSponsorDetailsPress}
            onTeamInfoPress={handleTeamInfoPress}
            onRelativeInfoPress={handleRelativeInfoPress}
          />
        </ScrollView>
        
        <LogoutButton onLogout={handleLogout} />

        {/* Modals */}
        <PersonalDetailsModal
          visible={personalDetailsModalVisible}
          onClose={() => setPersonalDetailsModalVisible(false)}
          profileData={profileData}
          currentMemberData={getCurrentMemberData()}
        />

        <MemberInfoModal
          visible={memberInfoModalVisible}
          onClose={handleCloseMemberInfoModal}
          loading={detailedMemberLoading}
          error={detailedMemberError}
          memberInfo={detailedMemberInfo}
        />

        <TeamInfoModal
          visible={teamInfoModalVisible}
          onClose={handleCloseTeamInfoModal}
          loading={teamMemberLoading}
          error={teamMemberError}
          teamMemberInfo={teamMemberInfo}
        />

        <RelativeInfoModal
          visible={relativeInfoModalVisible}
          onClose={handleCloseRelativeInfoModal}
          loading={relativeLoading}
          error={relativeError}
          relativeInfo={relativeInfo}
        />

        <SponsorDetailsModal
          visible={sponsorDetailsModalVisible}
          onClose={handleCloseSponsorDetailsModal}
          loading={payingChildLoading}
          error={payingChildError}
          payingChildInfo={payingChildInfo}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Changed from '#ffffff' to transparent
    paddingTop: 20,
  },
  content: {
    flex: 1,
  },
});

export default ProfileScreen;