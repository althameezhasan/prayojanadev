// src/screens/login/authenticator/DirectTotpLoginScreen.tsx
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
import { API_URL } from '../../../constants';

interface Props {
  onBack: () => void;
  onSuccess: (token: string) => void;
}

const BASE_URL = API_URL;

const DirectTotpLoginScreen: React.FC<Props> = ({ onBack, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDirectTotpLogin = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      console.log('Direct TOTP login with code:', otp);
      const response = await axios.post(
        `${BASE_URL}authenticatorverify`,
        {
          otp: otp
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Direct TOTP login response:', JSON.stringify(response.data, null, 2));

      if (response.data?.status === true || response.data?.success === true || response.status === 200) {
        Alert.alert('Success', 'Login successful');
        onSuccess(response.data.token || response.data.accessToken || 'dummy-token');
      } else {
        Alert.alert('Failed', response.data?.message || response.data?.error || 'Invalid code');
      }
    } catch (error: any) {
      console.error('Direct TOTP Login Error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        Alert.alert('Failed', error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        Alert.alert('Network Error', 'Cannot connect to server. Please check your connection.');
      } else {
        Alert.alert('Error', 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter TOTP Code</Text>
        <Text style={styles.subtitle}>
          Enter your 6-digit authenticator code to login
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
          onPress={handleDirectTotpLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login with TOTP'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back to Options</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DirectTotpLoginScreen;

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