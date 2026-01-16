import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useAuth, useLoginDetails } from '../../context/AuthContext';
import HomeScreenHeader, { TeamMember, HeaderData } from '../../components/Homescreen/HomeScreenHeader';
import TeamProfileSection from '../../components/Homescreen/TeamProfileSection';

interface HomeScreenProps {
  onNavigateToDashboard: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToDashboard }) => {
  const { logout } = useAuth();
  const loginDetails = useLoginDetails();
  const [headerData, setHeaderData] = useState<HeaderData>({
    memberName: '',
    householdId: null,
    teamMembers: [],
    isLoading: false,
    hasError: false,
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNotificationPress = () => {
    console.log('Notification icon pressed');
  };

  const handleTeamMemberPress = (member: TeamMember) => {
    console.log('Team member pressed:', member);
    // Add navigation to team member profile or actions
  };

  const handleHeaderDataLoaded = useCallback((data: HeaderData) => {
    setHeaderData(data);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Component */}
        <HomeScreenHeader
          onNotificationPress={handleNotificationPress}
          onDataLoaded={handleHeaderDataLoaded}
        />

        {/* Main Content */}
        <View style={styles.content}>
          {/* Medicine Reminder Card */}
          <ImageBackground
            source={require('../../../assets/image/carousel.png')} // Change path if needed
            style={styles.reminderCard}
            imageStyle={{ borderRadius: 12 }}
          >
            <Text style={styles.reminderText}>Don’t forget to take your medicines on time.</Text>
          </ImageBackground>

          {/* Team Profile Section */}
          <TeamProfileSection
            teamMembers={headerData.teamMembers}
            onTeamMemberPress={handleTeamMemberPress}
          />

          {/* Debug Section */}
          {__DEV__ && (
            <View style={styles.debugSection}>
              <Text style={styles.debugTitle}>Debug Info:</Text>
              <Text style={styles.debugText}>Login Type: {loginDetails?.loginType}</Text>
              <Text style={styles.debugText}>Member Name: {headerData.memberName}</Text>
              <Text style={styles.debugText}>Loading: {headerData.isLoading ? 'Yes' : 'No'}</Text>
              <Text style={styles.debugText}>Error: {headerData.hasError ? 'Yes' : 'No'}</Text>
              <Text style={styles.debugText}>Household ID: {headerData.householdId || 'None'}</Text>
              <Text style={styles.debugText}>Team Members: {headerData.teamMembers.length}</Text>
            </View>
          )}

          {/* Logout Button */}
          <View style={styles.mainContent}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    marginTop: -20,
  },

  // Reminder Card
 reminderCard: {
  marginTop:24,
  width: '100%',
  height: 120,
  borderRadius: 12,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 24,
  paddingTop: 12,
  backgroundColor: '#e0f7fa', // fallback if image fails
},
reminderText: {
  color: '#000',
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  paddingHorizontal: 20,
},


  // Debug Section Styles
  debugSection: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  // Main Content Styles
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
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
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HomeScreen;
