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
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.5:3000';

type Props = {
  onBack: () => void;
  onSuccess: (token: string) => void;
  otpData: {
    secret: string;
    otpauth_url: string;
    phoneNumber: string;
  };
};


const AuthenticatorLoginScreen: React.FC<Props> = ({ onBack, onSuccess, otpData }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleVerify = async () => {
    const cleanToken = otp.trim();
    if (!cleanToken || cleanToken.length !== 6 || !/^\d+$/.test(cleanToken)) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-digit numeric code.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/verify`,
        {
          phone: otpData.phoneNumber,
          token: cleanToken
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Authentication successful!', [
          { text: 'OK', onPress: () => onSuccess('authenticated-token') }
        ]);
      } else {
        Alert.alert('Invalid OTP', response.data.message || 'Please try again');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Could not verify token');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Authenticator Login</Text>

        <Text style={styles.instruction}>Scan the QR code in your Authenticator app:</Text>

        <View style={styles.qrBox}>
          <QRCode value={otpData.otpauth_url} size={200} />
        </View>

        <TouchableOpacity onPress={() => setShowSecret(!showSecret)}>
          <Text style={styles.secretToggle}>
            {showSecret ? otpData.secret : '••••••••••••••••••••••• (Tap to reveal secret key)'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.otpPrompt}>Enter the 6-digit code from your app</Text>

        <TextInput
          style={[styles.input, otp.length === 6 && styles.inputComplete]}
          value={otp}
          onChangeText={handleOtpChange}
          keyboardType="numeric"
          maxLength={6}
          placeholder="000000"
          placeholderTextColor="#ccc"
          editable={!loading}
          autoFocus
        />

        <TouchableOpacity 
          style={[styles.verifyButton, (otp.length !== 6 || loading) && styles.disabledButton]} 
          onPress={handleVerify} 
          disabled={otp.length !== 6 || loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#007C91" style={{ marginTop: 10 }} />}

        <TouchableOpacity onPress={onBack} disabled={loading}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AuthenticatorLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  qrBox: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
  },
  secretToggle: {
    fontSize: 14,
    color: '#007C91',
    marginBottom: 30,
    textAlign: 'center',
  },
  otpPrompt: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 60,
    width: 200,
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 10,
    color: '#333',
    marginBottom: 16,
  },
  inputComplete: {
    borderColor: '#007C91',
    backgroundColor: '#e6f7fa',
  },
  verifyButton: {
    backgroundColor: '#007C91',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    width: 200,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
