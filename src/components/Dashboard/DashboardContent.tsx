import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { HouseholdData, Household, Plan, Carebuddy, Captain, Member } from '../../../fetching/types';
import { useMemberInfo } from '../../../src/hooks/useMemberInfo';
import { MemberInfoResponse } from '../../../fetching/types/memberInfoTypes';
import HouseholdCard from './HouseholdCard';
import DashboardMenuGrid from './DashboardMenuGrid';
import PlanSection from '../Dashboard/PlanSection';
import CareBuddySection from '../Dashboard/CareBuddySection';
import CaptainSection from '../Dashboard/CaptainSection';

interface DashboardContentProps {
  loading: boolean;
  error: any;
  data: HouseholdData | null;
  onLogout?: () => void;
  userToken?: string | null | undefined;
  loginDetails?: { loginType: string; id: number } | null;
}

interface InfoCardProps {
  type: 'Plan' | 'Carebuddy' | 'Captain' | 'Member' | null;
  plans?: Plan[];
  carebuddies?: Carebuddy[];
  captain?: Captain;
  members?: Member[];
  memberInfoData?: MemberInfoResponse | null;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  type, 
  plans, 
  carebuddies, 
  captain, 
  members, 
  memberInfoData 
}) => {
  if (!type) return null;

  switch (type) {
    case 'Plan':
      return <PlanSection plans={plans || []} />;
    case 'Carebuddy':
      return <CareBuddySection carebuddies={carebuddies || []} />;
    case 'Captain':
      return <CaptainSection captain={captain} />;
    case 'Member':
      // Use memberInfoData if available, otherwise fall back to members
      const memberData = memberInfoData?.message?.data?.memberArr || members || [];
      
      return memberData && memberData.length > 0 ? (
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Member Information from API:</Text>
          {memberData.map((member, index) => (
            <View key={member.memberId || index} style={styles.infoItem}>
              <Text style={styles.infoText}>Name: {member.memberName}</Text>
              <Text style={styles.infoText}>Member ID: {member.memberId}</Text>
              <Text style={styles.infoText}>Phone: {member.phone}</Text>
              <Text style={styles.infoText}>DOB: {new Date(member.memberDob).toLocaleDateString()}</Text>
              <Text style={styles.infoText}>Gender: {member.memberGender}</Text>
              <Text style={styles.infoText}>Health Condition: {member.health_condition}</Text>
              <Text style={styles.infoText}>Status: {member.reference_status.name}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Member Information:</Text>
          <Text style={styles.infoText}>No members available</Text>
        </View>
      );
    default:
      return null;
  }
};

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  loading: householdLoading, 
  error: householdError, 
  data, 
  onLogout, 
  userToken, 
  loginDetails 
}) => {
  const household = data?.message?.data?.[0] || null;
  const [selectedInfo, setSelectedInfo] = useState<'Plan' | 'Carebuddy' | 'Captain' | 'Member' | null>(null);
  
  console.log('🏠 DashboardContent Props:', { 
    userToken: userToken ? `${userToken.substring(0, 10)}...` : 'undefined', 
    loginDetailsId: loginDetails?.id || 'undefined',
    selectedInfo 
  });

  // Determine if we should fetch API data based on selected info type
  const shouldFetchApiData = ['Member', 'Carebuddy', 'Captain'].includes(selectedInfo || '');
  
  // Use member ID 999 for the API call when any of these details are selected
  const memberIdForApi = shouldFetchApiData ? 999 : null;
  
  // Call the useMemberInfo hook only for API-dependent selections
  const { memberInfo, loading: memberLoading, error: memberError } = useMemberInfo({
    memberId: memberIdForApi,
    userToken: userToken,
    shouldFetch: shouldFetchApiData
  });

  // Special logging for API response based on selected type
  useEffect(() => {
    if (shouldFetchApiData && memberInfo && !memberLoading && !memberError) {
      console.log('🎯 =================================');
      console.log(`🎯 ${selectedInfo?.toUpperCase()} DETAILS API RESPONSE`);
      console.log('🎯 =================================');
      console.log('📝 Full Response:', JSON.stringify(memberInfo, null, 2));
      
      switch (selectedInfo) {
        case 'Member':
          console.log('👥 Member Array:', JSON.stringify(memberInfo.message.data.memberArr, null, 2));
          break;
        case 'Carebuddy':
          console.log('🤝 Carebuddy Object:', JSON.stringify(memberInfo.message.data.carebuddyObj, null, 2));
          break;
        case 'Captain':
          console.log('👮 Captain Object:', JSON.stringify(memberInfo.message.data.captain, null, 2));
          break;
      }
      console.log('🎯 =================================');
    }
  }, [selectedInfo, memberInfo, memberLoading, memberError, shouldFetchApiData]);

  // Function to get the appropriate data based on selection type
  const getSelectedData = () => {
    if (!selectedInfo) return {};

    switch (selectedInfo) {
      case 'Plan':
        return {
          plans: household?.plans
        };
      case 'Carebuddy':
        return {
          carebuddies: memberInfo?.message.data.carebuddyObj || household?.carebuddies || []
        };
      case 'Captain':
        return {
          captain: memberInfo?.message.data.captain || household?.captain
        };
      case 'Member':
        return {
          members: household?.memberArr,
          memberInfoData: memberInfo
        };
      default:
        return {};
    }
  };

  return (
    <View style={styles.content}>
      {householdLoading ? (
        <Text style={styles.infoText}>Loading household data...</Text>
      ) : householdError ? (
        <Text style={styles.infoText}>Error loading household data: {householdError.message}</Text>
      ) : household && (
        <HouseholdCard household={household} />
      )}
      
      {selectedInfo && (
        // Show loading state for API-dependent selections
        shouldFetchApiData && memberLoading ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Loading {selectedInfo.toLowerCase()} information...</Text>
          </View>
        ) : shouldFetchApiData && memberError ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Error loading {selectedInfo.toLowerCase()} information</Text>
            <Text style={styles.infoText}>Failed to load data: {memberError.message}</Text>
          </View>
        ) : (
          <InfoCard 
            type={selectedInfo}
            {...getSelectedData()}
          />
        )
      )}

      <DashboardMenuGrid 
        household={household} 
        onLogout={onLogout} 
        onMenuSelect={setSelectedInfo}
        loginDetails={loginDetails} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});

export default DashboardContent;