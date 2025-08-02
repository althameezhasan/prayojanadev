// src/screens/login/authenticator/AuthenticatorOptionSelectionScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface Props {
  onBack: () => void;
  onDirectTotpLogin: () => void;
  onSetupAuthenticator: () => void;
}

const AuthenticatorOptionSelectionScreen: React.FC<Props> = ({ 
  onBack, 
  onDirectTotpLogin, 
  onSetupAuthenticator 
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Google Authenticator Login</Text>
        <Text style={styles.subtitle}>
          Choose your preferred authentication method
        </Text>
        
        <TouchableOpacity 
          style={styles.optionButton} 
          onPress={onDirectTotpLogin}
        >
          <Text style={styles.optionButtonText}>Enter TOTP Code</Text>
          <Text style={styles.optionSubtext}>
            Use your 6-digit authenticator code to login directly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton} 
          onPress={onSetupAuthenticator}
        >
          <Text style={styles.optionButtonText}>Generate QR Code</Text>
          <Text style={styles.optionSubtext}>
            Set up Google Authenticator with QR code
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onBack} style={styles.mainBackButton}>
        <Text style={styles.backText}>← Back to Login Options</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AuthenticatorOptionSelectionScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5'
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  subtitle: { 
    fontSize: 16, 
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007C91',
    textAlign: 'center',
    marginBottom: 8,
  },
  optionSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  mainBackButton: { 
    alignItems: 'center',
    padding: 20,
    marginBottom: 20
  },
  backText: { 
    color: '#007C91', 
    fontSize: 16,
    fontWeight: '500'
  },
});