// src/screens/login/MobileNumber.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import useHTTP from '../../hooks/http';

interface MobileInputScreenProps {
  onSubmit: (number: string, otpData?: any) => void;
  onBack?: () => void;
  initialMobileNumber?: string;
}

const MobileInputScreen: React.FC<MobileInputScreenProps> = ({ 
  onSubmit, 
  onBack,
  initialMobileNumber = ''
}) => {
  const [mobileNumber, setMobileNumber] = useState(initialMobileNumber);
  const [isValid, setIsValid] = useState(false);
  const { 
    loading, 
    data: responseLogin, 
    callAPI: handleSignin, 
    error: errorForSignin, 
    success: isSigned 
  } = useHTTP();

  const validateMobileNumber = (number: string) => /^[0-9]{10}$/.test(number);

  useEffect(() => {
    // Validate initial mobile number if provided
    if (initialMobileNumber) {
      setIsValid(validateMobileNumber(initialMobileNumber));
    }
  }, [initialMobileNumber]);

  const handleInputChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setMobileNumber(numericText);
    setIsValid(validateMobileNumber(numericText));
  };

  const handleContinue = () => {
    console.log('isValid:', isValid);

    if (isValid) {
      console.log('Sending login request...');

      handleSignin({
        url: 'https://kwnfmv39-443.inc1.devtunnels.ms/api/auth/membersignin',
        method: 'POST',
        data: {
          phone: `+91${mobileNumber}`,
        },
      });
    }
  };

  // Handle response and errors
  useEffect(() => {
    if (isSigned) {
      console.log('Login successful:', responseLogin);
      onSubmit(mobileNumber, responseLogin);
    }

    if (errorForSignin) {
      console.error('Login failed:', errorForSignin);
    }
  }, [isSigned, errorForSignin, mobileNumber, onSubmit]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/image/topbg.png')}
        style={styles.topBanner}
        resizeMode="contain"
      >
        <TouchableOpacity 
          style={styles.backArrow} 
          onPress={onBack}
          disabled={loading}
        >
          {/* Add your back arrow icon here */}
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
      </ImageBackground>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <View style={styles.userRow}>
          <Image
            source={require('../../../assets/image/Userlogo.png')}
            style={styles.userIcon}
          />
          <Text style={styles.loginTitle}>User Login</Text>
        </View>
      </View>

      <View style={styles.loginSection}>
        <Text style={styles.inputLabel}>Enter your Mobile number</Text>
        <Text style={styles.inputSubtitle}>
          We will send a one-time password (OTP) to your number
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.phoneInputWrapper}>
          <View style={styles.flagSection}>
            <Text style={styles.flag}>🇮🇳</Text>
            <Text style={styles.countryCode}>+91</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="98404 32810"
            placeholderTextColor="#999"
            value={mobileNumber}
            onChangeText={handleInputChange}
            keyboardType="numeric"
            maxLength={10}
            editable={!loading}
          />
        </View>
        {mobileNumber.length > 0 && !isValid && (
          <Text style={styles.errorText}>Please enter a valid 10-digit mobile number</Text>
        )}
        {errorForSignin && (
          <Text style={styles.errorText}>
            Failed to send OTP. Please try again.
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.sendButton, 
          (!isValid || loading) && styles.sendButtonDisabled
        ]}
        onPress={handleContinue}
        disabled={!isValid || loading}
      >
        <Text style={[
          styles.sendButtonText, 
          (!isValid || loading) && styles.sendButtonTextDisabled
        ]}>
          {loading ? 'Sending...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBanner: {
    height: 150,
    marginRight: 3,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 20,
  },
  backArrow: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  backArrowText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  loginSection: {
    alignItems: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 30,
  },
  userIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  inputSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    height: 56,
  },
  flagSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    paddingRight: 10,
    marginRight: 10,
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 8,
  },
  sendButton: {
    marginTop: 30,
    backgroundColor: '#007C91',
    marginHorizontal: 24,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendButtonTextDisabled: {
    color: '#999',
  },
});

export default MobileInputScreen;