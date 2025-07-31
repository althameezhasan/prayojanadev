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
import { useLoginDetails, useAuth } from '../../context/AuthContext'; // Import useAuth
import HomeScreenHeader, { TeamMember, HeaderData } from '../../components/Homescreen/HomeScreenHeader';
import TeamProfileSection from '../../components/Homescreen/TeamProfileSection';

interface HomeScreenProps {
  onNavigateToDashboard: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToDashboard }) => {
  const loginDetails = useLoginDetails();
  const { updateHouseholdId } = useAuth(); // Get the update function
  const [headerData, setHeaderData] = useState<HeaderData>({
    memberName: '',
    householdId: null,
    teamMembers: [],
    isLoading: false,
    hasError: false,
  });

  const handleNotificationPress = () => {
    console.log('Notification icon pressed');
  };

  const handleTeamMemberPress = (member: TeamMember) => {
    console.log('Team member pressed:', member);
    // Add navigation to team member profile or actions
  };

  const handleHeaderDataLoaded = useCallback(async (data: HeaderData) => {
    setHeaderData(data);
    
    // Update the household ID in AuthContext when it's received
    if (data.householdId && data.householdId !== loginDetails?.householdId) {
      console.log('Updating household ID in AuthContext:', data.householdId);
      await updateHouseholdId(data.householdId);
    }
  }, [updateHouseholdId, loginDetails?.householdId]);

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
            <Text style={styles.reminderText}>Don't forget to take your medicines on time.</Text>
          </ImageBackground>

          {/* Upcoming Event Section */}
<View style={styles.eventSection}>
  <View style={styles.eventHeader}>
    <Text style={styles.eventTitle}>Upcoming event</Text>
    <TouchableOpacity>
      <Text style={styles.seeAll}>see all</Text>
    </TouchableOpacity>
  </View>

  <View style={styles.eventCard}>
    <Text style={styles.eventName}>Semmozhi Poonga Visit</Text>
    <View style={styles.eventDetailsRow}>
      <Text style={styles.eventTime}>🕗 08:00 a.m</Text>
      <Text style={styles.eventDate}>📅 20, Aug, 2025</Text>
    </View>

    <View style={styles.eventStatusRow}>
      <View style={styles.statusItem}>
        <Text style={styles.statusIcon}>✅</Text>
        <Text style={styles.statusLabel}>Attending</Text>
      </View>
      <View style={styles.statusItem}>
        <Text style={styles.statusIcon}>❌</Text>
        <Text style={styles.statusLabel}>Not Attending</Text>
      </View>
    </View>
  </View>
</View>


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
              <Text style={styles.debugText}>Household ID (Header): {headerData.householdId || 'None'}</Text>
              <Text style={styles.debugText}>Household ID (Auth): {loginDetails?.householdId || 'None'}</Text>
              <Text style={styles.debugText}>Team Members: {headerData.teamMembers.length}</Text>
            </View>
          )}
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
  eventSection: {
  marginBottom: 24,
},

eventHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},

eventTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
},

seeAll: {
  fontSize: 14,
  color: '#007bff',
},

eventCard: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  borderColor: '#eee',
  borderWidth: 1,
},

eventName: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 8,
  color: '#000',
},

eventDetailsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 12,
},

eventTime: {
  fontSize: 14,
  color: '#555',
},

eventDate: {
  fontSize: 14,
  color: '#555',
},

eventStatusRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
},

statusItem: {
  flexDirection: 'row',
  alignItems: 'center',
},

statusIcon: {
  fontSize: 18,
  marginRight: 6,
},

statusLabel: {
  fontSize: 14,
  color: '#333',
},

  // Reminder Card
  reminderCard: {
    marginTop: 24,
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
});

export default HomeScreen;