import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import { useLoginDetails, useAuth } from '../../context/AuthContext';
import HomeScreenHeader, { TeamMember, HeaderData } from '../../components/Homescreen/HomeScreenHeader';
import TeamProfileSection from '../../components/Homescreen/TeamProfileSection';
import Carousel from '../../components/Homescreen/Carousel';


interface HomeScreenProps {
  onNavigateToDashboard: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToDashboard }) => {
  const loginDetails = useLoginDetails();
  const { updateHouseholdId } = useAuth();
  const [attendance, setAttendance] = useState<'attending' | 'not_attending' | null>(null);

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
  };

  const handleHeaderDataLoaded = useCallback(async (data: HeaderData) => {
    setHeaderData(data);
    if (data.householdId && data.householdId !== loginDetails?.householdId) {
      await updateHouseholdId(data.householdId);
    }
  }, [updateHouseholdId, loginDetails?.householdId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HomeScreenHeader
          onNotificationPress={handleNotificationPress}
          onDataLoaded={handleHeaderDataLoaded}
        />

        <Carousel />

        <View style={styles.content}>
          <View style={styles.eventSection}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>Upcoming event</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>see all</Text>
              </TouchableOpacity>
            </View>

            {/* Static Event Card with Local Assets */}
            <View style={styles.eventCardContainer}>
              <View style={styles.eventCardTop}>
                <View style={styles.eventLeft}>
                  <Text style={styles.eventName}>Semmozhi Poonga{"\n"}Visit</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.eventRight}>
                  <View style={styles.iconRow}>
                    <Image
                      source={require('../../../assets/image/icons/time.png')}
                      style={styles.iconImage}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.iconText}>08:00 a.m</Text>
                      <Text style={styles.iconText}>20 Aug 2025</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.eventCardBottom}>
                <TouchableOpacity
                  style={styles.statusItem}
                  onPress={() => setAttendance('attending')}
                >
                  <Image
                    source={require('../../../assets/image/icons/accept.png')}
                    style={styles.statusIconImage}
                  />
                  <Text
                    style={[
                      styles.statusLabel,
                      attendance === 'attending' && styles.selectedLabel,
                    ]}
                  >
                    Attending
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.statusItem}
                  onPress={() => setAttendance('not_attending')}
                >
                  <Image
                    source={require('../../../assets/image/icons/wrong.png')}
                    style={styles.statusIconImage}
                  />
                  <Text
                    style={[
                      styles.statusLabel,
                      attendance === 'not_attending' && styles.selectedLabel,
                    ]}
                  >
                    Not Attending
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TeamProfileSection
            teamMembers={headerData.teamMembers}
            onTeamMemberPress={handleTeamMemberPress}
          />
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
  eventCardContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    padding: 5,
    paddingBottom: 15,
  },
  eventCardTop: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
  },
  eventLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  eventRight: {
    flex: 1,
    justifyContent: 'center',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 12,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  iconImage: {
    width: 32, // Increased icon size
    height: 32, // Increased icon size
    marginRight: 8,
    resizeMode: 'contain',
  },
  textContainer: {
    flexDirection: 'column',
  },
  iconText: {
    fontSize: 14,
    color: '#333',
  },
  eventCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#d9d9d9',
    paddingVertical: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconImage: {
    width: 20,
    height: 20,
    marginRight: 6,
    resizeMode: 'contain',
  },
  statusLabel: {
    fontSize: 14,
    color: '#333',
  },
  selectedLabel: {
    fontWeight: 'bold',
    color: '#007bff',
  },
});

export default HomeScreen;