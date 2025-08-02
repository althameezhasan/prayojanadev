// src/screens/login/authenticator/AuthenticatorAlreadyAuthenticatedScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import axios from 'axios';

interface Props {
  phone: string;
  userEmail: string;
  onBack: () => void;
  onSuccess: (token: string) => void;
}

const BASE_URL = 'https://sb76775n-443.inc1.devtunnels.ms/api/auth/';

const AuthenticatorAlreadyAuthenticatedScreen: React.FC<Props> = ({ 
  phone,
  userEmail,
  onBack, 
  onSuccess 
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyAuthenticatorCode = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      console.log('Verifying authenticator code:', otp);
      const response = await axios.post(
        `${BASE_URL}authenticatorverify`,
        {
          otp: otp,
          phone: phone
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Verify response:', JSON.stringify(response.data, null, 2));

      if (response.data?.status === true || response.data?.success === true || response.status === 200) {
        Alert.alert('Success', 'Login successful');
        onSuccess(response.data.token || response.data.accessToken || 'dummy-token');
      } else {
        Alert.alert('Failed', response.data?.message || response.data?.error || 'Invalid code');
      }
    } catch (error: any) {
      console.error('Verification Error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        Alert.alert('Failed', error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        Alert.alert('Network Error', 'Cannot connect to server. Please check your connection.');
      } else {
        Alert.alert('Error', 'Verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Already Authenticated</Text>
        <Text style={styles.subtitle}>
          You are already authenticated with email:
        </Text>
        <Text style={styles.emailText}>{userEmail}</Text>
        <Text style={styles.subtitle}>
          Please enter your 6-digit authenticator code to login
        </Text>

        <TextInput
          style={styles.codeInput}
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          placeholder="000000"
          maxLength={6}
          textAlign="center"
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleVerifyAuthenticatorCode}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verifying...' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AuthenticatorAlreadyAuthenticatedScreen;

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
    marginBottom: 15,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007C91',
    marginBottom: 15,
    textAlign: 'center',
  },
  codeInput: {
    borderWidth: 2,
    borderColor: '#007C91',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: 200,
    backgroundColor: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 8
  },
  button: {
    backgroundColor: '#007C91',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: { 
    color: 'white', 
    textAlign: 'center', 
    fontSize: 16,
    fontWeight: 'bold'
  },
  backButton: { 
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