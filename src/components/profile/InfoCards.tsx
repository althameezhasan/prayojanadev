import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { 
  MemberInfoMember, 
  MemberInfoCarebuddy, 
  MemberInfoResponse 
} from '../../../fetching/types/memberInfoTypes';
import { RelativeInfoResponse } from '../../../fetching/types/relativeInfoTypes';
import { PayingChildInfoResponse } from '../../../fetching/types/payingChildInfoTypes';

// Utility function for health color
const getHealthColor = (condition: string) => {
  switch (condition?.toLowerCase()) {
    case 'green': return '#28a745';
    case 'orange': return '#fd7e14';
    case 'red': return '#dc3545';
    default: return '#666';
  }
};

// Member Info Card
export const MemberInfoCard: React.FC<{
  member: MemberInfoMember | MemberInfoResponse['message']['data'];
}> = ({ member }) => (
  <View style={styles.infoCard}>
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
        <Text style={[styles.memberDetail, { color: getHealthColor(member.health_condition) }]}>
          Health: {member.health_condition}
        </Text>
      </View>
    </View>
  </View>
);

// Care Buddy Card
export const CareBuddyCard: React.FC<{
  carebuddy: MemberInfoCarebuddy;
}> = ({ carebuddy }) => (
  <View style={styles.infoCard}>
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

// Relative Member Card
export const RelativeMemberCard: React.FC<{
  member: RelativeInfoResponse['message']['data']['members'][0];
}> = ({ member }) => (
  <View style={styles.infoCard}>
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

// Captain Card (for both relative and sponsor)
export const CaptainCard: React.FC<{
  captain: RelativeInfoResponse['message']['data']['captains'][0] | 
           PayingChildInfoResponse['message']['data']['captains'][0];
}> = ({ captain }) => (
  <View style={styles.infoCard}>
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

// Household Card
export const HouseholdCard: React.FC<{
  household: RelativeInfoResponse['message']['data']['household'][0] | 
             PayingChildInfoResponse['message']['data']['household'][0] | undefined;
}> = ({ household }) => {
  if (!household) {
    return (
      <View style={styles.infoCard}>
        <Text style={styles.memberDetail}>Invalid household data</Text>
      </View>
    );
  }

  return (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.memberInfoContainer}>
          <Text style={styles.memberName}>{household.houseHoldName || 'N/A'}</Text>
          <Text style={styles.memberDetail}>Household ID: {household.household_id || 'N/A'}</Text>
          <Text style={styles.memberDetail}>Mobile: {household.mobileNum || 'N/A'}</Text>
          <Text style={styles.memberDetail}>Location: {household.location || 'N/A'}</Text>
          <Text style={styles.memberDetail}>City: {household.city || 'N/A'}</Text>
          <Text style={styles.memberDetail}>Address: {household.address || 'N/A'}</Text>
          <Text style={styles.memberDetail}>Emergency Contact: {household.emergencyContact || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
};

// First, create a dedicated type for plan details
interface PlanDetail {
  validTill: string;
  paidAmount: string;
  planType: string;
  planCity: string;
  planDuration: string;
  planIcon: string;
  price: string;
  tax: string;
}

// Plan Details Card
export const PlanDetailsCard: React.FC<{
  plan?: PlanDetail;
}> = ({ plan }) => {
  if (!plan) {
    return (
      <View style={styles.infoCard}>
        <Text style={styles.memberDetail}>No plan details available</Text>
      </View>
    );
  }

  return (
    <View style={styles.infoCard}>
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
  );
};

// Section Container
export const SectionContainer: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
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
    backgroundColor: '#065084',
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
    color: '#065084',
    marginBottom: 10,
  },
});

export default {
  MemberInfoCard,
  CareBuddyCard,
  RelativeMemberCard,
  CaptainCard,
  HouseholdCard,
  PlanDetailsCard,
  SectionContainer,
};