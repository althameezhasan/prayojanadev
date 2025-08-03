import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface ProfileHeaderProps {
  onBackPress?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onBackPress }) => {
  return (
    <View style={styles.topSection}>
      <View style={styles.header}>
        <View style={styles.figmaCurveBackground} />
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topSection: {
    // backgroundColor: '#ffffff',
    position: 'relative',
    paddingBottom: 20,
  },
  figmaCurveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 300,
    // backgroundColor: '#007C91',
    borderBottomRightRadius: 300,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 50,
    borderBottomWidth: 0,
    zIndex: 2,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default ProfileHeader;