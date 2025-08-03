import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useLoginDetails } from '../../context/AuthContext'; // Adjust path as needed

interface ProfileMenuProps {
  showRelativesTab: boolean;
  onPersonalDetailsPress: () => void;
  onMemberInfoPress: () => void;
  onSponsorDetailsPress: () => void;
  onTeamInfoPress: () => void;
  onRelativeInfoPress: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  showRelativesTab,
  onPersonalDetailsPress,
  onMemberInfoPress,
  onSponsorDetailsPress,
  onTeamInfoPress,
  onRelativeInfoPress,
}) => {
  const loginDetails = useLoginDetails();
  
  // Determine icon circle color based on member type
  const getIconCircleColor = () => {
    return loginDetails?.loginType === 'Member' ? '#289546' : '#065084';
  };

  const MenuItem: React.FC<{
    iconName: string;
    text: string;
    onPress: () => void;
  }> = ({ iconName, text, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIconCircle, { backgroundColor: getIconCircleColor() }]}>
        <FontAwesome name={iconName} size={20} color="#fff" />
      </View>
      <Text style={styles.menuText}>{text}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.menu}>
      <MenuItem
        iconName="user"
        text="Personal Details"
        onPress={onPersonalDetailsPress}
      />
      <MenuItem
        iconName="id-card"
        text="Member Info"
        onPress={onMemberInfoPress}
      />
      <MenuItem
        iconName="user"
        text="Sponsor Details"
        onPress={onSponsorDetailsPress}
      />
      <MenuItem
        iconName="group"
        text="Team Information"
        onPress={onTeamInfoPress}
      />
      {showRelativesTab && (
        <MenuItem
          iconName="user-o"
          text="Relative Information"
          onPress={onRelativeInfoPress}
        />
      )}
      <MenuItem
        iconName="heartbeat"
        text="Health Information"
        onPress={() => {}} // Add handler when needed
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 18,
    color: 'black',
    fontWeight: '700',
  },
  menuArrow: {
    fontSize: 30,
    color: 'black',
  },
});

export default ProfileMenu;