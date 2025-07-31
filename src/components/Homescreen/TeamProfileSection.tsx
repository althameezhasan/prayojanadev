import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

interface TeamMember {
  name: string;
  role: string;
  profilePic: string;
  empId?: string;
  carebuddyType?: string;
}

interface TeamProfileSectionProps {
  teamMembers: TeamMember[];
  onTeamMemberPress: (member: TeamMember) => void;
}

const TeamProfileSection: React.FC<TeamProfileSectionProps> = ({
  teamMembers,
  onTeamMemberPress,
}) => {
  const renderTeamMemberCard = (member: TeamMember, index: number) => (
    <TouchableOpacity
      key={`${member.name}-${index}`}
      style={styles.teamMemberCard}
      onPress={() => onTeamMemberPress(member)}
      activeOpacity={0.7}
    >
      <View style={styles.teamMemberImageContainer}>
        <Image
          source={{ uri: member.profilePic }}
          style={styles.teamMemberImage}
          defaultSource={require('../../../assets/image/avatar.png')}
        />
      </View>
      <View style={styles.teamMemberInfo}>
        <Text style={styles.teamMemberName} numberOfLines={1}>
          {member.name}
        </Text>
        <Text style={styles.teamMemberRole} numberOfLines={1}>
          {member.role}
        </Text>
        {member.empId && (
          <Text style={styles.teamMemberEmpId} numberOfLines={1}>
            ID: {member.empId}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Don't render if no team members
  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <View style={styles.teamProfileSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Team Profile</Text>
        {/* You can add action buttons here if needed */}
        {/* <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity> */}
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.teamMembersContainer}
      >
        {teamMembers.map((member, index) => renderTeamMemberCard(member, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  teamProfileSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  teamMembersContainer: {
    paddingHorizontal: 0,
  },
  teamMemberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 140,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  teamMemberImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
  },
  teamMemberImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  teamMemberInfo: {
    alignItems: 'center',
    width: '100%',
  },
  teamMemberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamMemberRole: {
    fontSize: 12,
    color: '#007C91',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
  },
  teamMemberEmpId: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});

export default TeamProfileSection;
export type { TeamMember };