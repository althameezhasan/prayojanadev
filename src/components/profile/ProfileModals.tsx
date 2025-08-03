import React from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { 
  MemberInfoCard,
  CareBuddyCard,
  RelativeMemberCard,
  CaptainCard,
  HouseholdCard,
  PlanDetailsCard,
  SectionContainer,
} from './InfoCards';
import { MemberInfoResponse } from '../../../fetching/types/memberInfoTypes';
import { RelativeInfoResponse } from '../../../fetching/types/relativeInfoTypes';
import { PayingChildInfoResponse } from '../../../fetching/types/payingChildInfoTypes';

interface ProfileData {
  name: string;
  memberId: number | null;
  memberType: string;
  profilePhotoUrl: string | null;
}

// Modal Header Component
const ModalHeader: React.FC<{
  title: string;
  onClose: () => void;
}> = ({ title, onClose }) => (
  <View style={styles.modalHeader}>
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <Text style={styles.closeButtonText}>Close</Text>
    </TouchableOpacity>
    <Text style={styles.modalTitle}>{title}</Text>
  </View>
);

// Loading Component
const LoadingComponent: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#065084" />
    <Text style={styles.loadingText}>{text}</Text>
  </View>
);

// Error Component
const ErrorComponent: React.FC<{ message: string; error?: any }> = ({ message, error }) => (
  <View style={styles.infoCard}>
    <Text style={styles.errorText}>{message}</Text>
    {error && <Text style={styles.memberDetail}>Failed to load data: {error.message}</Text>}
  </View>
);

// Personal Details Modal
export const PersonalDetailsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  profileData: ProfileData;
  currentMemberData?: any;
}> = ({ visible, onClose, profileData, currentMemberData }) => {
  const getHealthColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'green': return '#28a745';
      case 'orange': return '#fd7e14';
      case 'red': return '#dc3545';
      default: return '#666';
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <ModalHeader title="Personal Details" onClose={onClose} />
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
            {currentMemberData && (
              <>
                <View style={styles.personalDetailRow}>
                  <Text style={styles.personalDetailLabel}>Phone:</Text>
                  <Text style={styles.personalDetailValue}>{currentMemberData.phone}</Text>
                </View>
                <View style={styles.personalDetailRow}>
                  <Text style={styles.personalDetailLabel}>Telephone:</Text>
                  <Text style={styles.personalDetailValue}>{currentMemberData.telephone_no}</Text>
                </View>
                <View style={styles.personalDetailRow}>
                  <Text style={styles.personalDetailLabel}>Date of Birth:</Text>
                  <Text style={styles.personalDetailValue}>{currentMemberData.memberDob}</Text>
                </View>
                <View style={styles.personalDetailRow}>
                  <Text style={styles.personalDetailLabel}>Gender:</Text>
                  <Text style={styles.personalDetailValue}>{currentMemberData.memberGender}</Text>
                </View>
                <View style={styles.personalDetailRow}>
                  <Text style={styles.personalDetailLabel}>Blood Group:</Text>
                  <Text style={styles.personalDetailValue}>{currentMemberData.blood_group || 'N/A'}</Text>
                </View>
                <View style={styles.personalDetailRow}>
                  <Text style={styles.personalDetailLabel}>Health Condition:</Text>
                  <Text style={[styles.personalDetailValue, { color: getHealthColor(currentMemberData.health_condition) }]}>
                    {currentMemberData.health_condition}
                  </Text>
                </View>
                <View style={styles.personalDetailRow}>
                  <Text style={styles.personalDetailLabel}>Email:</Text>
                  <Text style={styles.personalDetailValue}>{currentMemberData.email || 'N/A'}</Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Member Info Modal
export const MemberInfoModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  error: any;
  memberInfo: MemberInfoResponse | null;
}> = ({ visible, onClose, loading, error, memberInfo }) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={onClose}
  >
    <SafeAreaView style={styles.modalContainer}>
      <ModalHeader title="Member Information" onClose={onClose} />
      <ScrollView style={styles.modalContent}>
        {loading ? (
          <LoadingComponent text="Loading member information..." />
        ) : error ? (
          <ErrorComponent message="Error loading member information" error={error} />
        ) : memberInfo?.message.data ? (
          <>
            <MemberInfoCard member={memberInfo.message.data} />
            {memberInfo.message.data.memberArr && memberInfo.message.data.memberArr.length > 0 && (
              memberInfo.message.data.memberArr.map((member, index) => (
                <MemberInfoCard key={index + 1} member={member} />
              ))
            )}
          </>
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.memberDetail}>No member information available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  </Modal>
);

// Team Info Modal
export const TeamInfoModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  error: any;
  teamMemberInfo: MemberInfoResponse | null;
}> = ({ visible, onClose, loading, error, teamMemberInfo }) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={onClose}
  >
    <SafeAreaView style={styles.modalContainer}>
      <ModalHeader title="Team Information" onClose={onClose} />
      <ScrollView style={styles.modalContent}>
        {loading ? (
          <LoadingComponent text="Loading team information..." />
        ) : error ? (
          <ErrorComponent message="Error loading team information" error={error} />
        ) : (
          <>
            {teamMemberInfo?.message.data.captains && teamMemberInfo.message.data.captains.length > 0 && (
              <SectionContainer title="Captains">
                {teamMemberInfo.message.data.captains.map((captain, index) => (
                  <CaptainCard key={index} captain={captain} />
                ))}
              </SectionContainer>
            )}
            {teamMemberInfo?.message.data.carebuddies && teamMemberInfo.message.data.carebuddies.length > 0 && (
              <SectionContainer title="Care Buddies">
                {teamMemberInfo.message.data.carebuddies.map((carebuddy, index) => (
                  <CareBuddyCard key={index} carebuddy={carebuddy} />
                ))}
              </SectionContainer>
            )}
            {(!teamMemberInfo?.message.data.captains || teamMemberInfo.message.data.captains.length === 0) &&
             (!teamMemberInfo?.message.data.carebuddies || teamMemberInfo.message.data.carebuddies.length === 0) && (
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

// Relative Info Modal
export const RelativeInfoModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  error: any;
  relativeInfo: RelativeInfoResponse | null;
}> = ({ visible, onClose, loading, error, relativeInfo }) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={onClose}
  >
    <SafeAreaView style={styles.modalContainer}>
      <ModalHeader title="Relative Information" onClose={onClose} />
      <ScrollView style={styles.modalContent}>
        {loading ? (
          <LoadingComponent text="Loading relative information..." />
        ) : error ? (
          <ErrorComponent message="Error loading relative information" error={error} />
        ) : relativeInfo ? (
          <>
            <SectionContainer title="Relative Details">
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
            </SectionContainer>
            
            {relativeInfo.message.data.household && relativeInfo.message.data.household.length > 0 && (
              <SectionContainer title="Household Information">
                {relativeInfo.message.data.household.map((household, index) => (
                  <HouseholdCard key={index} household={household} />
                ))}
              </SectionContainer>
            )}
            
            {relativeInfo.message.data.members && relativeInfo.message.data.members.length > 0 && (
              <SectionContainer title="Members">
                {relativeInfo.message.data.members.map((member, index) => (
                  <RelativeMemberCard key={index} member={member} />
                ))}
              </SectionContainer>
            )}
            
            {relativeInfo.message.data.captains && relativeInfo.message.data.captains.length > 0 && (
              <SectionContainer title="Captains">
                {relativeInfo.message.data.captains.map((captain, index) => (
                  <CaptainCard key={index} captain={captain} />
                ))}
              </SectionContainer>
            )}
            
            {relativeInfo.message.data.carebuddies && relativeInfo.message.data.carebuddies.length > 0 && (
              <SectionContainer title="Care Buddies">
                {relativeInfo.message.data.carebuddies.map((carebuddy, index) => (
                  <CareBuddyCard key={index} carebuddy={carebuddy} />
                ))}
              </SectionContainer>
            )}
            
            {relativeInfo.message.data.planDetails && relativeInfo.message.data.planDetails.length > 0 && (
              <SectionContainer title="Plan Details">
                {relativeInfo.message.data.planDetails.map((plan, index) => (
                  <PlanDetailsCard key={index} plan={plan} />
                ))}
              </SectionContainer>
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
export const SponsorDetailsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  error: any;
  payingChildInfo: PayingChildInfoResponse | null;
}> = ({ visible, onClose, loading, error, payingChildInfo }) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={onClose}
  >
    <SafeAreaView style={styles.modalContainer}>
      <ModalHeader title="Sponsor Details" onClose={onClose} />
      <ScrollView style={styles.modalContent}>
        {loading ? (
          <LoadingComponent text="Loading sponsor information..." />
        ) : error ? (
          <ErrorComponent message="Error loading sponsor information" error={error} />
        ) : payingChildInfo ? (
          <>
            <SectionContainer title="Sponsor Details">
              <View style={styles.infoCard}>
                <View style={styles.memberInfoContainer}>
                  <Text style={styles.memberName}>{payingChildInfo.message.data.name || 'N/A'}</Text>
                  <Text style={styles.memberDetail}>Relation ID: {payingChildInfo.message.data.relation_id || 'N/A'}</Text>
                  <Text style={styles.memberDetail}>Household ID: {payingChildInfo.message.data.household_id || 'N/A'}</Text>
                  <Text style={styles.memberDetail}>Phone: {payingChildInfo.message.data.phone || 'N/A'}</Text>
                  <Text style={styles.memberDetail}>WhatsApp: {payingChildInfo.message.data.whatsapp_num || 'N/A'}</Text>
                  <Text style={styles.memberDetail}>Alternate Number: {payingChildInfo.message.data.alternate_num || 'N/A'}</Text>
                  <Text style={styles.memberDetail}>Email: {payingChildInfo.message.data.email || 'N/A'}</Text>
                  <Text style={styles.memberDetail}>Type: {payingChildInfo.message.data.type || 'N/A'}</Text>
                  <Text style={styles.memberDetail}>Sponsor: {payingChildInfo.message.data.is_sponser ? 'Yes' : 'No'}</Text>
                  <Text style={styles.memberDetail}>Address: {payingChildInfo.message.data.address || 'N/A'}</Text>
                </View>
              </View>
            </SectionContainer>
            
            {payingChildInfo.message.data.household && payingChildInfo.message.data.household.length > 0 ? (
              <SectionContainer title="Household Information">
                {payingChildInfo.message.data.household.map((household, index) => (
                  <HouseholdCard key={index} household={household} />
                ))}
              </SectionContainer>
            ) : (
              <View style={styles.infoCard}>
                <Text style={styles.memberDetail}>No household information available</Text>
              </View>
            )}
            
            {payingChildInfo.message.data.members && payingChildInfo.message.data.members.length > 0 && (
              <SectionContainer title="Members">
                {payingChildInfo.message.data.members.map((member, index) => (
                  <RelativeMemberCard key={index} member={member} />
                ))}
              </SectionContainer>
            )}
            
            {payingChildInfo.message.data.captains && payingChildInfo.message.data.captains.length > 0 && (
              <SectionContainer title="Captains">
                {payingChildInfo.message.data.captains.map((captain, index) => (
                  <CaptainCard key={index} captain={captain} />
                ))}
              </SectionContainer>
            )}
            
            {payingChildInfo.message.data.carebuddies && payingChildInfo.message.data.carebuddies.length > 0 && (
              <SectionContainer title="Care Buddies">
                {payingChildInfo.message.data.carebuddies.map((carebuddy, index) => (
                  <CareBuddyCard key={index} carebuddy={carebuddy} />
                ))}
              </SectionContainer>
            )}
            
            {payingChildInfo.message.data.planDetails && payingChildInfo.message.data.planDetails.length > 0 && (
              <SectionContainer title="Plan Details">
                {payingChildInfo.message.data.planDetails.map((plan, index) => (
                  <PlanDetailsCard key={index} plan={plan} />
                ))}
              </SectionContainer>
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

const styles = StyleSheet.create({
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
    color: '#065084',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: 'bold',
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