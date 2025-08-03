import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

interface ProfileData {
  name: string;
  memberId: number | null;
  memberType: string;
  profilePhotoUrl: string | null;
}

interface ProfileCardProps {
  profileData: ProfileData;
  isLoading: boolean;
  hasError: boolean;
  onProfilePhotoError: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileData,
  isLoading,
  hasError,
  onProfilePhotoError,
}) => {
  const avatarLetter = profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U';

  const renderAvatar = () => {
    if (profileData.profilePhotoUrl) {
      return (
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: profileData.profilePhotoUrl }}
            style={styles.profilePhoto}
            defaultSource={require('../../../assets/image/avatar.png')}
            onError={() => {
              console.log('❌ Failed to load profile photo, falling back to letter avatar');
              onProfilePhotoError();
            }}
          />
        </View>
      );
    }
    return (
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{avatarLetter}</Text>
      </View>
    );
  };

  return (
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
          {renderAvatar()}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profilePhone}>Member ID: {profileData.memberId || 'N/A'}</Text>
            <Text style={styles.profileAge}>Member Type: {profileData.memberType}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 25,
    marginHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 2,
    marginTop: -10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#065084',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ffffff',
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
});

export default ProfileCard;