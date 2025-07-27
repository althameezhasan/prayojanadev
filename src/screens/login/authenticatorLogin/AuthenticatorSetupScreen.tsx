/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';

type Props = {
  onBack: () => void;
  onNext: () => void;
};

const AuthenticatorSetupScreen: React.FC<Props> = ({ onBack, onNext }) => {
  const [secret, setSecret] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    fetchSecret();
  }, []);

  const fetchSecret = async () => {
    try {
      console.log('Attempting to fetch QR code...');
      
      const res = await axios.post(
        'http://192.168.1.5:3000/api/auth/generate',
        { phone: '+916383162304' },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );

      console.log('QR fetch successful:', res.data);

      setSecret(res.data.base32);
      setOtpauthUrl(res.data.otpauth_url);

    } catch (err: any) {
      console.error('QR Fetch Error Details:', err.response?.data || err.message);
      
      let errorMessage = 'Failed to generate QR code.';
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (err.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check the server configuration.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      Alert.alert(
        'Connection Error', 
        errorMessage,
        [
          { text: 'Retry', onPress: () => fetchSecret() },
          { text: 'Go Back', onPress: onBack }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSecretVisibility = () => {
    setShowSecret(!showSecret);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007C91" />
        <Text style={styles.loadingText}>Generating QR Code...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up Google Authenticator</Text>
      
      <Text style={styles.instruction}>
        1. Open Google Authenticator app{'\n'}
        2. Tap the + button{'\n'}
        3. Select "Scan a QR code"{'\n'}
        4. Scan the QR code below
      </Text>

      <View style={styles.qrBox}>
        {otpauthUrl ? (
          <QRCode value={otpauthUrl} size={200} />
        ) : (
          <View style={styles.qrPlaceholder}>
            <Text>QR Code not available</Text>
          </View>
        )}
      </View>

      <Text style={styles.note}>Or manually enter this secret key:</Text>
      
      <View style={styles.secretContainer}>
        <Text style={styles.secret}>
          {showSecret ? secret : '••••••••••••••••••••••••••••••••'}
        </Text>
        <TouchableOpacity 
          style={styles.secretButton} 
          onPress={toggleSecretVisibility}
        >
          <Text style={styles.secretButtonText}>
            {showSecret ? 'Hide' : 'Show'} Secret
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonGroup}>
        <Button title="Back" onPress={onBack} color="#888" />
        <Button title="Next" onPress={onNext} color="#007C91" />
      </View>
    </View>
  );
};

export default AuthenticatorSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'left',
    lineHeight: 24,
  },
  qrBox: {
    padding: 20,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 12,
    marginBottom: 30,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  secretContainer: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
  },
  secret: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 250,
  },
  secretButton: {
    backgroundColor: '#007C91',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  secretButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
});