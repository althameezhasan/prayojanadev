import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
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
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LogoutButton;