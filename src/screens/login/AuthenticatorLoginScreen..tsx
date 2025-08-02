// src/screens/login/AuthenticatorLoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import axios from 'axios';

interface Props {
  onBack: () => void;
  onSuccess: (token: string) => void;
}

type AuthMode = 'optionSelection' | 'directTotpLogin' | 'phoneInput' | 'alreadyAuthenticated' | 'emailOtpVerification' | 'generateQR' | 'loginWithCode';

// Updated base URL
const BASE_URL = 'https://sb76775n-443.inc1.devtunnels.ms/api/auth/';

const AuthenticatorLoginScreen: React.FC<Props> = ({ onBack, onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('optionSelection');
  const [phone, setPhone] = useState('');
  const [qrImageData, setQrImageData] = useState('');
  const [otp, setOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const checkAuthenticated = async () => {
    if (!phone.startsWith('+91')) {
      Alert.alert('Invalid format', 'Phone number must start with +91');
      return;
    }

    setLoading(true);
    try {
      console.log('Checking authentication for phone:', phone);
      
      const response = await axios.post(
        `${BASE_URL}checkauthenticated`,
        { phone },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Check auth response:', JSON.stringify(response.data, null, 2));

      const message = response.data?.message;
      
      if (message?.status === true) {
        // User is already authenticated
        setUserEmail(message.email_id);
        setMode('alreadyAuthenticated');
      } else if (message?.status === false) {
        // User needs to authenticate, but we have their email
        setUserEmail(message.email_id);
        // Send email OTP for verification
        await sendEmailOtp();
      } else {
        Alert.alert('Error', 'Unexpected response from server');
      }

    } catch (error: any) {
      console.error('Check Authentication Error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        Alert.alert('Network Error', 'Cannot connect to server. Please check your connection.');
      } else if (error.code === 'ECONNABORTED') {
        Alert.alert('Timeout Error', 'Request timed out. Please try again.');
      } else {
        Alert.alert('Error', `Failed to check authentication: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendEmailOtp = async () => {
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
      setMode('emailOtpVerification');
    } else if (response.status === 200) {
      // If status is 200, assume success even if message format is different
      Alert.alert('OTP Sent', `Verification code sent to ${userEmail}`);
      setMode('emailOtpVerification');
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
};

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
        // Now generate QR code for authenticator setup
        await generateQR();
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

  const generateQR = async () => {
    setLoading(true);
    try {
      console.log('Generating QR for phone:', phone);
      
      const response = await axios.post(
        `${BASE_URL}authenticatorsignin`,
        { phone },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('QR Generation response:', JSON.stringify(response.data, null, 2));

      const message = response.data?.message;
      
      if (message?.qr_link) {
        setQrImageData(message.qr_link);
        setMode('generateQR');
      } else {
        console.log('Could not find qr_link in response:', response.data);
        Alert.alert('Error', 'Invalid response format from server');
      }

    } catch (error: any) {
      console.error('QR Generation Error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        Alert.alert('Network Error', 'Cannot connect to server. Please check your connection.');
      } else if (error.code === 'ECONNABORTED') {
        Alert.alert('Timeout Error', 'Request timed out. Please try again.');
      } else {
        Alert.alert('Error', `Failed to generate QR: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

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
        }
      );

      console.log('Verify response:', JSON.stringify(response.data, null, 2));

      if (response.data?.status === true || response.data?.success === true || response.status === 200) {
        const successMessage = mode === 'generateQR' 
          ? 'Authenticator setup completed successfully' 
          : 'Login successful';
        
        Alert.alert('Success', successMessage);
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

  const resetToOptions = () => {
    setMode('optionSelection');
    setPhone('');
    setQrImageData('');
    setOtp('');
    setEmailOtp('');
    setUserEmail('');
  };

  const resetToPhoneInput = () => {
    setMode('phoneInput');
    setPhone('');
    setQrImageData('');
    setOtp('');
    setEmailOtp('');
    setUserEmail('');
  };

  const renderOptionSelection = () => (
    <View style={styles.optionContainer}>
      <Text style={styles.title}>Google Authenticator Login</Text>
      <Text style={styles.subtitle}>
        Choose your preferred authentication method
      </Text>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => setMode('directTotpLogin')}
      >
        <Text style={styles.optionButtonText}>Enter TOTP Code</Text>
        <Text style={styles.optionSubtext}>
          Use your 6-digit authenticator code to login directly
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => setMode('phoneInput')}
      >
        <Text style={styles.optionButtonText}>Generate QR Code</Text>
        <Text style={styles.optionSubtext}>
          Set up Google Authenticator with QR code
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDirectTotpLogin = () => (
    <View style={styles.directTotpContainer}>
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

      <TouchableOpacity onPress={resetToOptions} style={styles.backButton}>
        <Text style={styles.backText}>← Back to Options</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPhoneInput = () => (
    <View style={styles.phoneContainer}>
      <Text style={styles.title}>Enter Phone Number</Text>
      <Text style={styles.subtitle}>
        Enter your phone number to check authentication status
      </Text>
      
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="+91..."
        editable={!loading}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={checkAuthenticated}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Checking...' : 'Continue'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resetToOptions} style={styles.backButton}>
        <Text style={styles.backText}>← Back to Options</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAlreadyAuthenticated = () => (
    <View style={styles.authenticatedContainer}>
      <Text style={styles.title}>Already Authenticated</Text>
      <Text style={styles.subtitle}>
        You are already authenticated with email: {userEmail}
      </Text>
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

      <TouchableOpacity onPress={resetToPhoneInput} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmailOtpVerification = () => (
    <View style={styles.otpContainer}>
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

      <TouchableOpacity onPress={resetToPhoneInput} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGenerateQR = () => (
    <View style={styles.qrContainer}>
      <Text style={styles.title}>Setup Google Authenticator</Text>
      
      <Text style={styles.subtitle}>
        1. Scan this QR code with Google Authenticator
      </Text>
      
      <View style={styles.qrImageContainer}>
        <Image 
          source={{ uri: qrImageData }} 
          style={styles.qrImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.subtitle}>
        2. Enter the 6-digit code from your authenticator app
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
          {loading ? 'Verifying...' : 'Verify & Complete Setup'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resetToPhoneInput} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {mode === 'optionSelection' && renderOptionSelection()}
      {mode === 'directTotpLogin' && renderDirectTotpLogin()}
      {mode === 'phoneInput' && renderPhoneInput()}
      {mode === 'alreadyAuthenticated' && renderAlreadyAuthenticated()}
      {mode === 'emailOtpVerification' && renderEmailOtpVerification()}
      {mode === 'generateQR' && renderGenerateQR()}

      <TouchableOpacity onPress={onBack} style={styles.mainBackButton}>
        <Text style={styles.backText}>← Back to Login Options</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AuthenticatorLoginScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  optionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  directTotpContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  phoneContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  authenticatedContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    backgroundColor: 'white',
    fontSize: 16
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
  codeInput: {
    borderWidth: 2,
    borderColor: '#007C91',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
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
  qrImageContainer: { 
    alignItems: 'center', 
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  backButton: { 
    marginTop: 20, 
    alignItems: 'center',
    padding: 10
  },
  mainBackButton: { 
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20
  },
  backText: { 
    color: '#007C91', 
    fontSize: 16,
    fontWeight: '500'
  },
});