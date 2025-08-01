import React, { useState } from 'react';
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
  // State to track failed image loads for each member
  const [failedImages, setFailedImages] = useState<{ [key: string]: boolean }>({});

  const renderTeamMemberCard = (member: TeamMember, index: number) => {
    // Default image
    const defaultImage = require('../../../assets/image/profileAvatar.png'); // Ensure this path is correct

    // Determine image source
    const imageSource =
      member.profilePic && member.profilePic.trim() !== '' && !failedImages[`${member.name}-${index}`]
        ? { uri: member.profilePic }
        : defaultImage;

    return (
      <TouchableOpacity
        key={`${member.name}-${index}`}
        style={styles.teamMemberCard}
        onPress={() => onTeamMemberPress(member)}
        activeOpacity={0.7}
      >
        <View style={styles.teamMemberImageContainer}>
          <Image
            source={imageSource}
            style={styles.teamMemberImage}
            resizeMode="cover"
            onError={() => {
              // Mark this image as failed and update state
              setFailedImages((prev) => ({
                ...prev,
                [`${member.name}-${index}`]: true,
              }));
            }}
          />
        </View>
        <View style={styles.teamMemberInfo}>
          <Text style={styles.teamMemberName} numberOfLines={1}>
            {member.name || 'Unknown'}
          </Text>
          <Text style={styles.teamMemberRole} numberOfLines={1}>
            {member.role || 'Team Member'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <View style={styles.teamProfileSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Team Profile</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No team members available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.teamProfileSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Team Profile</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.teamMembersContainer}
        style={styles.scrollView}
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
  scrollView: {
    flexGrow: 0,
  },
  teamMembersContainer: {
    paddingHorizontal: 0,
    flexGrow: 1,
  },
  teamMemberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 160,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  teamMemberImageContainer: {
    width: 130,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  teamMemberImage: {
    width: '100%',
    height: '100%',
  },
  teamMemberInfo: {
    alignItems: 'flex-start',
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
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default TeamProfileSection;
export type { TeamMember };