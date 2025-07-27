import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  SafeAreaView, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.5:3000';
const PHONE_NUMBER = '+916383162304';

type Props = {
  onBack: () => void;
  onSuccess: (token: string) => void;
  phoneNumber?: string;
};

const AuthenticatorLoginScreen: React.FC<Props> = ({ 
  onBack, 
  onSuccess, 
  phoneNumber = PHONE_NUMBER 
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    // Clean and validate the token
    const cleanToken = otp.trim();
    
    console.log('Verifying token:', cleanToken, 'Length:', cleanToken.length);
    
    if (!cleanToken || cleanToken.length !== 6) {
      Alert.alert('Invalid Code', `Please enter a valid 6-digit code. Current length: ${cleanToken.length}`);
      return;
    }

    if (!/^\d+$/.test(cleanToken)) {
      Alert.alert('Invalid Code', 'Code must contain only numbers');
      return;
    }

    setLoading(true);

    try {
      console.log('Sending request with token:', cleanToken);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/verify`,
        {
          phone: phoneNumber,
          token: cleanToken // Make sure we send the cleaned token
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );

      console.log('Response received:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Authentication successful!', [
          { text: 'OK', onPress: () => onSuccess('authenticated-token') }
        ]);
      } else {
        Alert.alert(
          'Invalid OTP', 
          response.data.message || 'Please try again'
        );
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      
      let errorMessage = 'Error verifying OTP';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to server';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || 'Invalid request';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string) => {
    // Only allow numbers and max 6 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericText);
    console.log('OTP updated to:', numericText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter Verification Code</Text>
        
        <Text style={styles.instruction}>
          Enter the 6-digit code from your authenticator app
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input, 
              otp.length === 6 && styles.inputComplete
            ]}
            value={otp}
            onChangeText={handleOtpChange}
            keyboardType="numeric"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#ccc"
            editable={!loading}
            autoFocus={true}
          />
        </View>

        <Text style={styles.otpLength}>
          {otp.length}/6 digits • Current: "{otp}"
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.verifyButton, 
              (otp.length !== 6 || loading) && styles.disabledButton
            ]} 
            onPress={handleVerify} 
            disabled={otp.length !== 6 || loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? "Verifying..." : "Verify Code"}
            </Text>
          </TouchableOpacity>

          {loading && (
            <ActivityIndicator 
              size="large" 
              color="#007C91" 
              style={styles.loadingIndicator} 
            />
          )}

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack} 
            disabled={loading}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 200,
    marginBottom: 16,
  },
  input: {
    height: 60,
    borderColor: '#ddd',
    borderWidth: 2,
    paddingHorizontal: 20,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    fontWeight: 'bold',
    color: '#333',
  },
  inputComplete: {
    borderColor: '#007C91',
    backgroundColor: '#f0f8ff',
  },
  otpLength: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#007C91',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingIndicator: {
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#888',
    fontSize: 16,
  },
});

export default AuthenticatorLoginScreen;