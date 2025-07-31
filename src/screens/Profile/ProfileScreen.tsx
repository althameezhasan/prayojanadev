import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { useAuth, useLoginDetails, useAuthToken } from '../../context/AuthContext';
import { useMemberInfo } from '../../hooks/useMemberInfo';
import { useRelativeInfo } from '../../hooks/useRelativeInfo';
import { usePayingChildInfo } from '../../hooks/usePayingChildInfo';
import { MemberInfoMember, MemberInfoCarebuddy } from '../../../fetching/types/memberInfoTypes';
import { RelativeInfoResponse } from '../../../fetching/types/relativeInfoTypes';
import { PayingChildInfoResponse } from '../../../fetching/types/payingChildInfoTypes';

interface ProfileData {
  name: string;
  memberId: number | null;
  memberType: string;
}

const ProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const loginDetails = useLoginDetails();
  const userToken = useAuthToken();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    memberId: null,
    memberType: '',
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

  // Hook for initial profile data
  const { memberInfo: initialMemberInfo, loading: memberLoading, error: memberError } = useMemberInfo({
    memberId: shouldFetchMemberInfo ? memberId : null,
    userToken: userToken,
    shouldFetch: shouldFetchMemberInfo,
  });

  const { relativeInfo, loading: relativeLoading, error: relativeError } = useRelativeInfo({
    memberId: shouldFetchRelativeInfo || shouldFetchRelativeDetails ? (loginDetails?.id || 998) : null,
    userToken: userToken,
    shouldFetch: shouldFetchRelativeInfo || shouldFetchRelativeDetails,
  });

  const { payingChildInfo, loading: payingChildLoading, error: payingChildError } = usePayingChildInfo({
    memberId: shouldFetchPayingChildInfo || shouldFetchSponsorDetails ? memberId : null,
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
      const currentMember = initialMemberInfo.message.data.memberArr.find(
        (member) => member.memberId === loginDetails.id
      );
      setProfileData({
        name: currentMember ? currentMember.memberName : 'Member',
        memberId: loginDetails.id,
        memberType: loginDetails.loginType,
      });
    }

    if (shouldFetchRelativeInfo && relativeInfo && loginDetails?.id) {
      const currentMember = relativeInfo.message.data.members.find(
        (member) => member.memberId === loginDetails.id
      );
      setProfileData({
        name: currentMember ? currentMember.memberName : relativeInfo.message.data.name || 'Relative',
        memberId: loginDetails.id,
        memberType: loginDetails.loginType,
      });
    }

    if (shouldFetchPayingChildInfo && payingChildInfo && loginDetails?.id) {
      const currentMember = payingChildInfo.message.data.members.find(
        (member) => member.memberId === loginDetails.id
      );
      setProfileData({
        name: currentMember ? currentMember.memberName : payingChildInfo.message.data.name || 'Paying Child',
        memberId: loginDetails.id,
        memberType: loginDetails.loginType,
      });
    }

    if (!shouldFetchMemberInfo && !shouldFetchRelativeInfo && !shouldFetchPayingChildInfo) {
      setProfileData({
        name: loginDetails?.loginType || 'User',
        memberId: loginDetails?.id || null,
        memberType: loginDetails?.loginType || 'Unknown',
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

  // Log detailed API responses
  useEffect(() => {
    if (shouldFetchMemberDetails && detailedMemberInfo && !detailedMemberLoading && !detailedMemberError) {
      console.log('🎯 =================================');
      console.log('🎯 MEMBER DETAILS API RESPONSE');
      console.log('🎯 =================================');
      console.log('👥 Member Array:', JSON.stringify(detailedMemberInfo.message.data.memberArr, null, 2));
      console.log('🎯 =================================');
    }
  }, [shouldFetchMemberDetails, detailedMemberInfo, detailedMemberLoading, detailedMemberError]);

  useEffect(() => {
    if (shouldFetchTeamDetails && teamMemberInfo && !teamMemberLoading && !teamMemberError) {
      console.log('🎯 =================================');
      console.log('🎯 TEAM DETAILS API RESPONSE');
      console.log('🎯2174');
      console.log('🤝 Carebuddy Object:', JSON.stringify(teamMemberInfo.message.data.carebuddyObj, null, 2));
      console.log('👮 Captain Object:', JSON.stringify(teamMemberInfo.message.data.captain, null, 2));
      console.log('🎯 =================================');
    }
  }, [shouldFetchTeamDetails, teamMemberInfo, teamMemberLoading, teamMemberError]);

  useEffect(() => {
    if (shouldFetchRelativeDetails && relativeInfo && !relativeLoading && !relativeError) {
      console.log('🎯 =================================');
      console.log('🎯 RELATIVE DETAILS API RESPONSE');
      console.log('🎯 =================================');
      console.log('👥 Members:', JSON.stringify(relativeInfo.message.data.members, null, 2));
      console.log('🏠 Household:', JSON.stringify(relativeInfo.message.data.household, null, 2));
      console.log('👨‍✈️ Captains:', JSON.stringify(relativeInfo.message.data.captains, null, 2));
      console.log('🤝 Care Buddies:', JSON.stringify(relativeInfo.message.data.carebuddies, null, 2));
      console.log('🎯 =================================');
    }
  }, [shouldFetchRelativeDetails, relativeInfo, relativeLoading, relativeError]);

  useEffect(() => {
    if (shouldFetchSponsorDetails && payingChildInfo && !payingChildLoading && !payingChildError) {
      console.log('🎯 =================================');
      console.log('🎯 SPONSOR DETAILS API RESPONSE');
      console.log('🎯 =================================');
      console.log('👤 Sponsor:', JSON.stringify(payingChildInfo.message.data, null, 2));
      console.log('🎯 =================================');
    }
  }, [shouldFetchSponsorDetails, payingChildInfo, payingChildLoading, payingChildError]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  const avatarLetter = profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U';
  const showRelativesTab = profileData.memberType !== 'Relative';

  // Get current member data for personal details
  const getCurrentMemberData = () => {
    if (shouldFetchMemberInfo && initialMemberInfo && loginDetails?.id) {
      return initialMemberInfo.message.data.memberArr.find(
        (member) => member.memberId === loginDetails.id
      );
    }
    return null;
  };

  // Render Member Info Card
  const renderMemberInfoCard = (member: MemberInfoMember, index: number) => (
    <View key={index} style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberImageContainer}>
          {member.memberPic ? (
            <Image source={{ uri: member.memberPic }} style={styles.memberImage} />
          ) : (
            <View style={styles.memberImagePlaceholder}>
              <Text style={styles.memberImageText}>
                {member.memberName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{member.memberName}</Text>
          <Text style={styles.memberDetail}>ID: {member.memberId}</Text>
          <Text style={styles.memberDetail}>Phone: {member.phone}</Text>
          <Text style={styles.memberDetail}>Gender: {member.memberGender}</Text>
          <Text style={styles.memberDetail}>DOB: {member.memberDob}</Text>
          <Text style={[styles.memberDetail, { color: getHealthColor(member.health_condition) }]}>
            Health: {member.health_condition}
          </Text>
          <Text style={styles.memberDetail}>Status: {member.reference_status.name}</Text>
        </View>
      </View>
    </View>
  );

  // Render Care Buddy Card
  const renderCareBuddyCard = (carebuddy: MemberInfoCarebuddy, index: number) => (
    <View key={index} style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberImageContainer}>
          {carebuddy.profilePic ? (
            <Image source={{ uri: carebuddy.profilePic }} style={styles.memberImage} />
          ) : (
            <View style={styles.memberImagePlaceholder}>
              <Text style={styles.memberImageText}>
                {carebuddy.carebuddyName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{carebuddy.carebuddyName}</Text>
          <Text style={styles.memberDetail}>Type: {carebuddy.carebuddyType}</Text>
        </View>
      </View>
    </View>
  );

  // Render Relative Member Card
  const renderRelativeMemberCard = (member: RelativeInfoResponse['message']['data']['members'][0], index: number) => (
    <View key={index} style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberImageContainer}>
          {member.memberPic ? (
            <Image source={{ uri: member.memberPic }} style={styles.memberImage} />
          ) : (
            <View style={styles.memberImagePlaceholder}>
              <Text style={styles.memberImageText}>
                {member.memberName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{member.memberName}</Text>
          <Text style={styles.memberDetail}>ID: {member.memberId}</Text>
          <Text style={styles.memberDetail}>Phone: {member.phone}</Text>
          <Text style={styles.memberDetail}>Gender: {member.gender}</Text>
          <Text style={styles.memberDetail}>DOB: {member.dob}</Text>
          <Text style={[styles.memberDetail, { color: getHealthColor(member.health_condition) }]}>
            Health: {member.health_condition}
          </Text>
          <Text style={styles.memberDetail}>Status: {member.reference_status_name}</Text>
        </View>
      </View>
    </View>
  );

  // Render Relative Captain Card
  const renderRelativeCaptainCard = (captain: RelativeInfoResponse['message']['data']['captains'][0], index: number) => (
    <View key={index} style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberImageContainer}>
          {captain.profilePic ? (
            <Image source={{ uri: captain.profilePic }} style={styles.memberImage} />
          ) : (
            <View style={styles.memberImagePlaceholder}>
              <Text style={styles.memberImageText}>
                {captain.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{captain.name}</Text>
          <Text style={styles.memberDetail}>Employee ID: {captain.empId}</Text>
          <Text style={styles.memberDetail}>User ID: {captain.id}</Text>
        </View>
      </View>
    </View>
  );

  // Render Relative Care Buddy Card
  const renderRelativeCareBuddyCard = (carebuddy: RelativeInfoResponse['message']['data']['carebuddies'][0], index: number) => (
    <View key={index} style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberImageContainer}>
          {carebuddy.profilePic ? (
            <Image source={{ uri: carebuddy.profilePic }} style={styles.memberImage} />
          ) : (
            <View style={styles.memberImagePlaceholder}>
              <Text style={styles.memberImageText}>
                {carebuddy.carebuddyName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{carebuddy.carebuddyName}</Text>
          <Text style={styles.memberDetail}>Type: {carebuddy.carebuddyType}</Text>
        </View>
      </View>
    </View>
  );

  // Render Household Card
  const renderHouseholdCard = (household: RelativeInfoResponse['message']['data']['household'][0], index: number) => (
    <View key={index} style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{household.houseHoldName}</Text>
          <Text style={styles.memberDetail}>Household ID: {household.household_id}</Text>
          <Text style={styles.memberDetail}>Mobile: {household.mobileNum}</Text>
          <Text style={styles.memberDetail}>Location: {household.location}</Text>
          <Text style={styles.memberDetail}>City: {household.city}</Text>
          <Text style={styles.memberDetail}>Address: {household.address}</Text>
          <Text style={styles.memberDetail}>Emergency Contact: {household.emergencyContact}</Text>
        </View>
      </View>
    </View>
  );

  // Render Sponsor Member Card
  const renderSponsorMemberCard = (member: PayingChildInfoResponse['message']['data']['members'][0], index: number) => (
    <View key={index} style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberImageContainer}>
          {member.memberPic ? (
            <Image source={{ uri: member.memberPic }} style={styles.memberImage} />
          ) : (
            <View style={styles.memberImagePlaceholder}>
              <Text style={styles.memberImageText}>
                {member.memberName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{member.memberName}</Text>
          <Text style={styles.memberDetail}>ID: {member.memberId}</Text>
          <Text style={styles.memberDetail}>Phone: {member.phone}</Text>
          <Text style={styles.memberDetail}>Gender: {member.gender}</Text>
          <Text style={styles.memberDetail}>DOB: {member.dob}</Text>
          <Text style={[styles.memberDetail, { color: getHealthColor(member.health_condition) }]}>
            Health: {member.health_condition}
          </Text>
          <Text style={styles.memberDetail}>Status: {member.reference_status_name}</Text>
        </View>
      </View>
    </View>
  );

  // Render Sponsor Captain Card
  const renderSponsorCaptainCard = (captain: PayingChildInfoResponse['message']['data']['captains'][0], index: number) => (
    <View key={index} style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberImageContainer}>
          {captain.profilePic ? (
            <Image source={{ uri: captain.profilePic }} style={styles.memberImage} />
          ) : (
            <View style={styles.memberImagePlaceholder}>
              <Text style={styles.memberImageText}>
                {captain.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{captain.name}</Text>
          <Text style={styles.memberDetail}>Employee ID: {captain.empId}</Text>
          <Text style={styles.memberDetail}>User ID: {captain.id}</Text>
        </View>
      </View>
    </View>
  );

  // Render Sponsor Care Buddy Card
  const renderSponsorCareBuddyCard = (carebuddy: PayingChildInfoResponse['message']['data']['carebuddies'][0], index: number) => (
    <View key={index} style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberImageContainer}>
          {carebuddy.profilePic ? (
            <Image source={{ uri: carebuddy.profilePic }} style={styles.memberImage} />
          ) : (
            <View style={styles.memberImagePlaceholder}>
              <Text style={styles.memberImageText}>
                {carebuddy.carebuddyName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{carebuddy.carebuddyName}</Text>
          <Text style={styles.memberDetail}>Type: {carebuddy.carebuddyType}</Text>
        </View>
      </View>
    </View>
  );

  // Render Sponsor Household Card
  const renderSponsorHouseholdCard = (household: PayingChildInfoResponse['message']['data']['household'][0], index: number) => (
    <View key={index} style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{household.houseHoldName}</Text>
          <Text style={styles.memberDetail}>Household ID: {household.household_id}</Text>
          <Text style={styles.memberDetail}>Mobile: {household.mobileNum}</Text>
          <Text style={styles.memberDetail}>Location: {household.location}</Text>
          <Text style={styles.memberDetail}>City: {household.city}</Text>
          <Text style={styles.memberDetail}>Address: {household.address}</Text>
          <Text style={styles.memberDetail}>Emergency Contact: {household.emergencyContact}</Text>
        </View>
      </View>
    </View>
  );

  const getHealthColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'green': return '#28a745';
      case 'orange': return '#fd7e14';
      case 'red': return '#dc3545';
      default: return '#666';
    }
  };

  // Member Information Modal
  const MemberInfoModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={memberInfoModalVisible}
      onRequestClose={() => {
        setMemberInfoModalVisible(false);
        setShouldFetchMemberDetails(false);
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setMemberInfoModalVisible(false);
              setShouldFetchMemberDetails(false);
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Member Information</Text>
        </View>
        <ScrollView style={styles.modalContent}>
          {detailedMemberLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007C91" />
              <Text style={styles.loadingText}>Loading member information...</Text>
            </View>
          ) : detailedMemberError ? (
            <View style={styles.infoCard}>
              <Text style={styles.errorText}>Error loading member information</Text>
              <Text style={styles.memberDetail}>Failed to load data: {detailedMemberError.message}</Text>
            </View>
          ) : detailedMemberInfo?.message.data.memberArr ? (
            detailedMemberInfo.message.data.memberArr.map((member, index) => 
              renderMemberInfoCard(member, index)
            )
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.memberDetail}>No member information available</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Team Information Modal
  const TeamInfoModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={teamInfoModalVisible}
      onRequestClose={() => {
        setTeamInfoModalVisible(false);
        setShouldFetchTeamDetails(false);
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setTeamInfoModalVisible(false);
              setShouldFetchTeamDetails(false);
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Team Information</Text>
        </View>
        <ScrollView style={styles.modalContent}>
          {teamMemberLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007C91" />
              <Text style={styles.loadingText}>Loading team information...</Text>
            </View>
          ) : teamMemberError ? (
            <View style={styles.infoCard}>
              <Text style={styles.errorText}>Error loading team information</Text>
              <Text style={styles.memberDetail}>Failed to load data: {teamMemberError.message}</Text>
            </View>
          ) : (
            <>
              {teamMemberInfo?.message.data.captain && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Captain</Text>
                  <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.memberImageContainer}>
                        {teamMemberInfo.message.data.captain.profilePic ? (
                          <Image source={{ uri: teamMemberInfo.message.data.captain.profilePic }} style={styles.memberImage} />
                        ) : (
                          <View style={styles.memberImagePlaceholder}>
                            <Text style={styles.memberImageText}>
                              {teamMemberInfo.message.data.captain.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.memberInfoContainer}>
                        <Text style={styles.memberName}>{teamMemberInfo.message.data.captain.name}</Text>
                        <Text style={styles.memberDetail}>Employee ID: {teamMemberInfo.message.data.captain.empId}</Text>
                        <Text style={styles.memberDetail}>User ID: {teamMemberInfo.message.data.captain.id}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              {teamMemberInfo?.message.data.carebuddyObj && teamMemberInfo.message.data.carebuddyObj.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Care Buddies</Text>
                  {teamMemberInfo.message.data.carebuddyObj.map((carebuddy, index) => 
                    renderCareBuddyCard(carebuddy, index)
                  )}
                </View>
              )}
              {(!teamMemberInfo?.message.data.captain && (!teamMemberInfo?.message.data.carebuddyObj || teamMemberInfo.message.data.carebuddyObj.length === 0)) && (
                <View style={styles.infoCard}>
                  <Text style={styles.memberDetail}>No team information available</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Relative Information Modal
  const RelativeInfoModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={relativeInfoModalVisible}
      onRequestClose={() => {
        setRelativeInfoModalVisible(false);
        setShouldFetchRelativeDetails(false);
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setRelativeInfoModalVisible(false);
              setShouldFetchRelativeDetails(false);
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Relative Information</Text>
        </View>
        <ScrollView style={styles.modalContent}>
          {relativeLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007C91" />
              <Text style={styles.loadingText}>Loading relative information...</Text>
            </View>
          ) : relativeError ? (
            <View style={styles.infoCard}>
              <Text style={styles.errorText}>Error loading relative information</Text>
              <Text style={styles.memberDetail}>Failed to load data: {relativeError.message}</Text>
            </View>
          ) : relativeInfo ? (
            <>
              {/* Relative Details */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Relative Details</Text>
                <View style={styles.infoCard}>
                  <View style={styles.memberInfoContainer}>
                    <Text style={styles.memberName}>{relativeInfo.message.data.name}</Text>
                    <Text style={styles.memberDetail}>Relation ID: {relativeInfo.message.data.relation_id}</Text>
                    <Text style={styles.memberDetail}>Related Member ID: {relativeInfo.message.data.relatedMemberId}</Text>
                    <Text style={styles.memberDetail}>Phone: {relativeInfo.message.data.phone}</Text>
                    <Text style={styles.memberDetail}>WhatsApp: {relativeInfo.message.data.whatsapp_num}</Text>
                    <Text style={styles.memberDetail}>Alternate Number: {relativeInfo.message.data.alternate_num}</Text>
                    <Text style={styles.memberDetail}>Email: {relativeInfo.message.data.email || 'N/A'}</Text>
                    <Text style={styles.memberDetail}>Type: {relativeInfo.message.data.type}</Text>
                    <Text style={styles.memberDetail}>Sponsor: {relativeInfo.message.data.is_sponser ? 'Yes' : 'No'}</Text>
                  </View>
                </View>
              </View>

              {/* Household Information */}
              {relativeInfo.message.data.household && relativeInfo.message.data.household.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Household Information</Text>
                  {relativeInfo.message.data.household.map((household, index) => 
                    renderHouseholdCard(household, index)
                  )}
                </View>
              )}

              {/* Members */}
              {relativeInfo.message.data.members && relativeInfo.message.data.members.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Members</Text>
                  {relativeInfo.message.data.members.map((member, index) => 
                    renderRelativeMemberCard(member, index)
                  )}
                </View>
              )}

              {/* Captains */}
              {relativeInfo.message.data.captains && relativeInfo.message.data.captains.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Captains</Text>
                  {relativeInfo.message.data.captains.map((captain, index) => 
                    renderRelativeCaptainCard(captain, index)
                  )}
                </View>
              )}

              {/* Care Buddies */}
              {relativeInfo.message.data.carebuddies && relativeInfo.message.data.carebuddies.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Care Buddies</Text>
                  {relativeInfo.message.data.carebuddies.map((carebuddy, index) => 
                    renderRelativeCareBuddyCard(carebuddy, index)
                  )}
                </View>
              )}

              {/* Plan Details */}
              {relativeInfo.message.data.planDetails && relativeInfo.message.data.planDetails.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Plan Details</Text>
                  {relativeInfo.message.data.planDetails.map((plan, index) => (
                    <View key={index} style={styles.infoCard}>
                      <View style={styles.memberInfoContainer}>
                        <Text style={styles.memberName}>{plan.planType}</Text>
                        <Text style={styles.memberDetail}>Valid Till: {plan.validTill}</Text>
                        <Text style={styles.memberDetail}>Paid Amount: {plan.paidAmount}</Text>
                        <Text style={styles.memberDetail}>City: {plan.planCity}</Text>
                        <Text style={styles.memberDetail}>Duration: {plan.planDuration}</Text>
                        <Text style={styles.memberDetail}>Price: {plan.price}</Text>
                        <Text style={styles.memberDetail}>Tax: {plan.tax}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {(!relativeInfo.message.data.members || relativeInfo.message.data.members.length === 0) &&
               (!relativeInfo.message.data.household || relativeInfo.message.data.household.length === 0) &&
               (!relativeInfo.message.data.captains || relativeInfo.message.data.captains.length === 0) &&
               (!relativeInfo.message.data.carebuddies || relativeInfo.message.data.carebuddies.length === 0) &&
               (!relativeInfo.message.data.planDetails || relativeInfo.message.data.planDetails.length === 0) && (
                <View style={styles.infoCard}>
                  <Text style={styles.memberDetail}>No additional relative information available</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.memberDetail}>No relative information available</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Sponsor Details Modal
  const SponsorDetailsModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={sponsorDetailsModalVisible}
      onRequestClose={() => {
        setSponsorDetailsModalVisible(false);
        setShouldFetchSponsorDetails(false);
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setSponsorDetailsModalVisible(false);
              setShouldFetchSponsorDetails(false);
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Sponsor Details</Text>
        </View>
        <ScrollView style={styles.modalContent}>
          {payingChildLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007C91" />
              <Text style={styles.loadingText}>Loading sponsor information...</Text>
            </View>
          ) : payingChildError ? (
            <View style={styles.infoCard}>
              <Text style={styles.errorText}>Error loading sponsor information</Text>
              <Text style={styles.memberDetail}>Failed to load data: {payingChildError.message}</Text>
            </View>
          ) : payingChildInfo ? (
            <>
              {/* Sponsor Details */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Sponsor Details</Text>
                <View style={styles.infoCard}>
                  <View style={styles.memberInfoContainer}>
                    <Text style={styles.memberName}>{payingChildInfo.message.data.name}</Text>
                    <Text style={styles.memberDetail}>Relation ID: {payingChildInfo.message.data.relation_id}</Text>
                    <Text style={styles.memberDetail}>Household ID: {payingChildInfo.message.data.household_id}</Text>
                    <Text style={styles.memberDetail}>Phone: {payingChildInfo.message.data.phone}</Text>
                    <Text style={styles.memberDetail}>WhatsApp: {payingChildInfo.message.data.whatsapp_num || 'N/A'}</Text>
                    <Text style={styles.memberDetail}>Alternate Number: {payingChildInfo.message.data.alternate_num || 'N/A'}</Text>
                    <Text style={styles.memberDetail}>Email: {payingChildInfo.message.data.email || 'N/A'}</Text>
                    <Text style={styles.memberDetail}>Type: {payingChildInfo.message.data.type}</Text>
                    <Text style={styles.memberDetail}>Sponsor: {payingChildInfo.message.data.is_sponser ? 'Yes' : 'No'}</Text>
                    <Text style={styles.memberDetail}>Address: {payingChildInfo.message.data.address}</Text>
                  </View>
                </View>
              </View>

              {/* Household Information */}
              {payingChildInfo.message.data.household && payingChildInfo.message.data.household.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Household Information</Text>
                  {payingChildInfo.message.data.household.map((household, index) => 
                    renderSponsorHouseholdCard(household, index)
                  )}
                </View>
              )}

              {/* Members */}
              {payingChildInfo.message.data.members && payingChildInfo.message.data.members.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Members</Text>
                  {payingChildInfo.message.data.members.map((member, index) => 
                    renderSponsorMemberCard(member, index)
                  )}
                </View>
              )}

              {/* Captains */}
              {payingChildInfo.message.data.captains && payingChildInfo.message.data.captains.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Captains</Text>
                  {payingChildInfo.message.data.captains.map((captain, index) => 
                    renderSponsorCaptainCard(captain, index)
                  )}
                </View>
              )}

              {/* Care Buddies */}
              {payingChildInfo.message.data.carebuddies && payingChildInfo.message.data.carebuddies.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Care Buddies</Text>
                  {payingChildInfo.message.data.carebuddies.map((carebuddy, index) => 
                    renderSponsorCareBuddyCard(carebuddy, index)
                  )}
                </View>
              )}

              {/* Plan Details */}
              {payingChildInfo.message.data.planDetails && payingChildInfo.message.data.planDetails.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Plan Details</Text>
                  {payingChildInfo.message.data.planDetails.map((plan, index) => (
                    <View key={index} style={styles.infoCard}>
                      <View style={styles.memberInfoContainer}>
                        <Text style={styles.memberName}>{plan.planType}</Text>
                        <Text style={styles.memberDetail}>Valid Till: {plan.validTill}</Text>
                        <Text style={styles.memberDetail}>Paid Amount: {plan.paidAmount}</Text>
                        <Text style={styles.memberDetail}>City: {plan.planCity}</Text>
                        <Text style={styles.memberDetail}>Duration: {plan.planDuration}</Text>
                        <Text style={styles.memberDetail}>Price: {plan.price}</Text>
                        <Text style={styles.memberDetail}>Tax: {plan.tax}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {(!payingChildInfo.message.data.members || payingChildInfo.message.data.members.length === 0) &&
               (!payingChildInfo.message.data.household || payingChildInfo.message.data.household.length === 0) &&
               (!payingChildInfo.message.data.captains || payingChildInfo.message.data.captains.length === 0) &&
               (!payingChildInfo.message.data.carebuddies || payingChildInfo.message.data.carebuddies.length === 0) &&
               (!payingChildInfo.message.data.planDetails || payingChildInfo.message.data.planDetails.length === 0) && (
                <View style={styles.infoCard}>
                  <Text style={styles.memberDetail}>No additional sponsor information available</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.memberDetail}>No sponsor information available</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Personal Details Modal
  const PersonalDetailsModal = () => {
    const currentMember = getCurrentMemberData();
    
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={personalDetailsModalVisible}
        onRequestClose={() => setPersonalDetailsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPersonalDetailsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Personal Details</Text>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.infoCard}>
              <View style={styles.personalDetailRow}>
                <Text style={styles.personalDetailLabel}>Name:</Text>
                <Text style={styles.personalDetailValue}>{profileData.name}</Text>
              </View>
              <View style={styles.personalDetailRow}>
                <Text style={styles.personalDetailLabel}>Member ID:</Text>
                <Text style={styles.personalDetailValue}>{profileData.memberId || 'N/A'}</Text>
              </View>
              <View style={styles.personalDetailRow}>
                <Text style={styles.personalDetailLabel}>Member Type:</Text>
                <Text style={styles.personalDetailValue}>{profileData.memberType}</Text>
              </View>
              {currentMember && (
                <>
                  <View style={styles.personalDetailRow}>
                    <Text style={styles.personalDetailLabel}>Phone:</Text>
                    <Text style={styles.personalDetailValue}>{currentMember.phone}</Text>
                  </View>
                  <View style={styles.personalDetailRow}>
                    <Text style={styles.personalDetailLabel}>Telephone:</Text>
                    <Text style={styles.personalDetailValue}>{currentMember.telephone_no}</Text>
                  </View>
                  <View style={styles.personalDetailRow}>
                    <Text style={styles.personalDetailLabel}>Date of Birth:</Text>
                    <Text style={styles.personalDetailValue}>{currentMember.memberDob}</Text>
                  </View>
                  <View style={styles.personalDetailRow}>
                    <Text style={styles.personalDetailLabel}>Gender:</Text>
                    <Text style={styles.personalDetailValue}>{currentMember.memberGender}</Text>
                  </View>
                  <View style={styles.personalDetailRow}>
                    <Text style={styles.personalDetailLabel}>Blood Group:</Text>
                    <Text style={styles.personalDetailValue}>{currentMember.blood_group || 'N/A'}</Text>
                  </View>
                  <View style={styles.personalDetailRow}>
                    <Text style={styles.personalDetailLabel}>Health Condition:</Text>
                    <Text style={[styles.personalDetailValue, { color: getHealthColor(currentMember.health_condition) }]}>
                      {currentMember.health_condition}
                    </Text>
                  </View>
                  <View style={styles.personalDetailRow}>
                    <Text style={styles.personalDetailLabel}>Email:</Text>
                    <Text style={styles.personalDetailValue}>{currentMember.email || 'N/A'}</Text>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRightCircle} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007C91" />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : hasError ? (
            <Text style={styles.errorText}>Failed to load profile details</Text>
          ) : (
            <>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{avatarLetter}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profileData.name}</Text>
                <Text style={styles.profilePhone}>Member ID: {profileData.memberId || 'N/A'}</Text>
                <Text style={styles.profileAge}>Member Type: {profileData.memberType}</Text>
              </View>
            </>
          )}
        </View>
      <View style={styles.menu}>
  <TouchableOpacity 
    style={styles.menuItem}
    onPress={handleMemberInfoPress}
  >
    <Text style={styles.menuText}>Member Information</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={styles.menuItem}
    onPress={handlePersonalDetailsPress}
  >
    <Text style={styles.menuText}>Personal Details</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={styles.menuItem}
    onPress={handleSponsorDetailsPress}
  >
    <Text style={styles.menuText}>Sponsor Details</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={styles.menuItem}
    onPress={handleTeamInfoPress}
  >
    <Text style={styles.menuText}>Team Information</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
  {profileData.memberType !== 'Relative' && (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={handleRelativeInfoPress}
    >
      <Text style={styles.menuText}>Relative Information</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  )}
  {showRelativesTab && (
    <TouchableOpacity style={styles.menuItem}>
      <Text style={styles.menuText}>Relatives</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  )}
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuText}>Health Information</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
</View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <MemberInfoModal />
      <TeamInfoModal />
      <PersonalDetailsModal />
      <RelativeInfoModal />
      <SponsorDetailsModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  topRightCircle: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#007C91',
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 5,
  },
  backArrow: {
    fontSize: 18,
    color: '#007C91',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007C91',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  profileAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
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
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  menu: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  menuArrow: {
    fontSize: 18,
    color: '#007C91',
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    padding: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#007C91',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 15,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  memberImageContainer: {
    marginRight: 15,
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  memberImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007C91',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberImageText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  memberInfoContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  memberDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007C91',
    marginBottom: 10,
  },
  personalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  personalDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    flex: 1,
  },
  personalDetailValue: {
    fontSize: 14,
    color: '#212529',
    flex: 2,
    textAlign: 'right',
  },
});

export default ProfileScreen;