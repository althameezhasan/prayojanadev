import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const AuthenticatorScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [secretGenerated, setSecretGenerated] = useState(false);

  const BASE_URL = 'https://sb76775n-443.inc1.devtunnels.ms/api/auth';

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return;
    }

    try {
      setIsChecking(true);
      const res = await axios.post(`${BASE_URL}/checkauthenticated`, { phone: phoneNumber });
      const result = res.data?.message;

      if (result?.status === false) {
        // Not authenticated – generate QR code
        const qrRes = await axios.post(`${BASE_URL}/authenticatorsignin`, { phone: phoneNumber });
        const qrLink = qrRes.data?.message?.qr_link;

        if (qrLink) {
          setQrCode(qrLink);
          setSecretGenerated(true);
        } else {
          Alert.alert('QR Generation Failed', 'QR code link not received');
        }
      } else if (result?.status === true) {
        // Already registered – show OTP input only
        setSecretGenerated(true);
      } else {
        Alert.alert('Unexpected Response', 'Unable to determine authentication status');
      }
    } catch (error) {
      const err = error as any;
      const errorData = err?.response?.data;
      console.error('Phone check error:', errorData || err.message);
      Alert.alert('Error', errorData?.message || 'Something went wrong');
    } finally {
      setIsChecking(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert('Validation Error', 'Please enter the OTP');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/verifyotp`, {
        phone: phoneNumber,
        otp,
      });

      if (res.data?.message?.statusMsg?.includes('verified')) {
        setIsVerified(true);
        Alert.alert('Success', 'OTP Verified. You are logged in!');
        // 👉 Navigate to Home screen or perform auth logic here
      } else {
        Alert.alert('Invalid OTP', res.data?.message?.statusMsg || 'OTP not verified');
      }
    } catch (error) {
      const err = error as any;
      const errorData = err?.response?.data;
      console.error('OTP verification error:', errorData || err.message);
      Alert.alert('Error', errorData?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Authenticator Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <Button
        title="Check / Register"
        onPress={handlePhoneSubmit}
        disabled={isChecking}
      />

      {isChecking && <ActivityIndicator style={{ marginVertical: 10 }} />}

      {secretGenerated && (
        <>
          {qrCode ? (
            <>
              <Text style={styles.qrText}>Scan this QR with Google Authenticator</Text>
              <Image source={{ uri: qrCode }} style={styles.qrImage} />
            </>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit OTP"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} />
        </>
      )}

      {isVerified && (
        <Text style={styles.successText}>
          ✅ Authenticated successfully!
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 12,
    padding: 10,
    borderRadius: 8,
  },
  qrText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  qrImage: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  successText: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
});

export default AuthenticatorScreen;
