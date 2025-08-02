// src/screens/login/authenticator/AuthenticatorEmailOtpScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
  onEmailVerified: (phone: string) => void;
}

const BASE_URL = 'https://sb76775n-443.inc1.devtunnels.ms/api/auth/';

const AuthenticatorEmailOtpScreen: React.FC<Props> = ({ 
  phone,
  userEmail,
  onBack, 
  onEmailVerified 
}) => {
  const [emailOtp, setEmailOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Use useCallback to memoize the function and prevent unnecessary re-renders
  const sendEmailOtp = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Sending email OTP to:', userEmail);
      
      const response = await axios.post(
        `${BASE_URL}sendmailotp`,
        { 
          phone: phone,
          email_id: userEmail 
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Send email OTP response:', JSON.stringify(response.data, null, 2));

      // Check if OTP was sent successfully
      const message = response.data?.message;
      
      // Make sure message is a string before using includes()
      if (typeof message === 'string' && (message.includes('sent') || message.includes('OTP'))) {
        Alert.alert('OTP Sent', `Verification code sent to ${userEmail}`);
      } else if (response.status === 200) {
        // If status is 200, assume success even if message format is different
        Alert.alert('OTP Sent', `Verification code sent to ${userEmail}`);
      } else {
        Alert.alert('Error', 'Failed to send OTP');
      }

    } catch (error: any) {
      console.error('Send Email OTP Error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        Alert.alert('Network Error', 'Cannot connect to server. Please check your connection.');
      } else if (error.code === 'ECONNABORTED') {
        Alert.alert('Timeout Error', 'Request timed out. Please try again.');
      } else {
        Alert.alert('Error', `Failed to send email OTP: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [phone, userEmail]); // Include dependencies here

  // Send email OTP when component mounts
  useEffect(() => {
    sendEmailOtp();
  }, [sendEmailOtp]); // Include sendEmailOtp in dependency array

  const verifyEmailOtp = async () => {
    if (emailOtp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP');
      return;
    }

    setLoading(true);
    try {
      console.log('Verifying email OTP:', emailOtp);
      
      const response = await axios.post(
        `${BASE_URL}verifyotp`,
        { 
          otp: emailOtp,
          phone: phone,
          email_id: userEmail 
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Verify email OTP response:', JSON.stringify(response.data, null, 2));

      // Check if OTP verification was successful
      if (response.data?.status === true || response.data?.success === true || response.status === 200) {
        Alert.alert('Verification Successful', 'Email verified successfully');
        // Navigate to QR code generation
        onEmailVerified(phone);
      } else {
        Alert.alert('Verification Failed', response.data?.message || 'Invalid OTP');
      }

    } catch (error: any) {
      console.error('Verify Email OTP Error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        Alert.alert('Verification Failed', error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        Alert.alert('Network Error', 'Cannot connect to server. Please check your connection.');
      } else if (error.code === 'ECONNABORTED') {
        Alert.alert('Timeout Error', 'Request timed out. Please try again.');
      } else {
        Alert.alert('Error', `Failed to verify email OTP: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Email Verification</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to:
        </Text>
        <Text style={styles.emailText}>{userEmail}</Text>
        <Text style={styles.subtitle}>
          Please enter the OTP to verify your identity
        </Text>

        <TextInput
          style={styles.otpInput}
          value={emailOtp}
          onChangeText={setEmailOtp}
          keyboardType="numeric"
          placeholder="Enter OTP"
          textAlign="center"
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={verifyEmailOtp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verifying...' : 'Verify Email OTP'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resendButton} 
          onPress={sendEmailOtp}
          disabled={loading}
        >
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AuthenticatorEmailOtpScreen;

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
  otpInput: {
    borderWidth: 2,
    borderColor: '#007C91',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: 150,
    backgroundColor: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#007C91',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
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
  resendButton: {
    backgroundColor: 'transparent',
    padding: 10,
    marginBottom: 10,
  },
  resendText: {
    color: '#007C91',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline'
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