// src/screens/login/OTPInputScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import useHTTP from '../../hooks/http';
import { AUTH_URL } from '../../constants';

// Define the expected response type based on your actual API response
interface VerifyOTPResponse {
  message: {
    accessToken: string;
    statusMsg: string;
    loginDetails: {
      loginType: string;
      id: number;
    };
  };
}

interface OTPInputScreenProps {
  mobileNumber: string;
  otpData?: any;
  onBack?: () => void;
}

const OTPInputScreen: React.FC<OTPInputScreenProps> = ({
  mobileNumber,
  otpData,
  onBack,
}) => {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [isValid, setIsValid] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  // Use global auth context
  const { login, clearError, state: authState } = useAuth();
  
  // HTTP hook for OTP verification with proper typing
  const { 
    loading: verifyLoading, 
    data: verifyResponse, 
    callAPI: handleVerifyOTP, 
    error: verifyError, 
    success: isVerified,
    reset: resetHTTP
  } = useHTTP<VerifyOTPResponse>();

  const validateOTP = (otpArray: string[]) => {
    return otpArray.every(digit => digit !== '') && otpArray.length === 6;
  };

  const handleInputChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    const digit = numericText.slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOTP(newOtp);
    setIsValid(validateOTP(newOtp));

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const clearOTP = () => {
    setOTP(['', '', '', '', '', '']);
    setIsValid(false);
    inputRefs.current[0]?.focus();
  };

  const handleVerify = async () => {
    if (isValid) {
      console.log('Verifying OTP:', otp.join(''));
      console.log('Mobile Number:', mobileNumber);
      
      // Clear any previous auth errors
      clearError();
      
      handleVerifyOTP({
        url: AUTH_URL+'membersverify',
        method: 'POST',
        data: {
          phone: `+91${mobileNumber}`,
          otp: otp.join(''),
        },
      });
    }
  };

  const handleGoBack = () => {
    console.log('Going back to mobile number screen');
    clearOTP();
    resetHTTP(); // Reset HTTP state
    clearError(); // Clear any auth errors
    onBack?.();
  };

  const handleResendOTP = () => {
    // Add resend OTP logic here
    console.log('Resending OTP...');
    clearOTP();
    resetHTTP(); // Reset HTTP state
    // You can add actual resend API call here
  };

  // Handle OTP verification response
  useEffect(() => {
    const handleVerificationResponse = async () => {
      if (isVerified && verifyResponse) {
        console.log('OTP verification successful:', verifyResponse);
        
        if (verifyResponse?.message?.statusMsg === "Authentication Success!!!") {
          console.log('Authentication successful, logging in globally');
          
          const userToken = verifyResponse.message.accessToken;
          const loginDetails = verifyResponse.message.loginDetails;
          
          console.log('Access Token:', userToken);
          console.log('Login Details:', loginDetails);
          
          try {
            // Use global login function
            await login(userToken, loginDetails);
            // Navigation will be handled automatically by App.tsx when auth state changes
          } catch (error) {
            console.error('Global login failed:', error);
            Alert.alert(
              'Login Error',
              'Failed to save login information. Please try again.',
              [{ text: 'OK' }]
            );
          }
        } else {
          console.log('Authentication failed - unexpected response structure');
          Alert.alert(
            'Verification Failed',
            'Invalid OTP. Please check and try again.',
            [{ text: 'OK', onPress: () => clearOTP() }]
          );
        }
      }

      if (verifyError) {
        console.error('OTP verification failed:', verifyError);
        Alert.alert(
          'Verification Error',
          'OTP verification failed. Please try again.',
          [{ text: 'OK', onPress: () => clearOTP() }]
        );
      }
    };

    handleVerificationResponse();
  }, [isVerified, verifyError, verifyResponse, login]);

  // Display auth errors from global state
  useEffect(() => {
    if (authState.error) {
      Alert.alert(
        'Authentication Error',
        authState.error,
        [{ text: 'OK', onPress: () => clearError() }]
      );
    }
  }, [authState.error, clearError]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/image/topbg.png')}
        style={styles.topBanner}
        resizeMode="contain"
      >
        {/* Improved back button with visual feedback */}
        <TouchableOpacity 
          style={styles.backArrow} 
          onPress={handleGoBack}
          disabled={verifyLoading || authState.isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
      </ImageBackground>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <View style={styles.userRow}>
          <Image
            source={require('../../../assets/image/Userlogo.png')}
            style={styles.userIcon}
          />
          <Text style={styles.loginTitle}>OTP Verification</Text>
        </View>
      </View>

      <View style={styles.loginSection}>
        <Text style={styles.inputLabel}>Enter your OTP code sent to</Text>
        <Text style={styles.inputSubtitle}>
          +91 {mobileNumber}
        </Text>
        {/* Add a clickable link to change mobile number */}
        <TouchableOpacity 
          onPress={handleGoBack}
          disabled={verifyLoading || authState.isLoading}
          style={styles.changeNumberButton}
        >
          <Text style={styles.changeNumberText}>Change mobile number?</Text>
        </TouchableOpacity>
        {otpData && otpData.statusMsg && (
          <Text style={styles.inputSubtitle}>{otpData.statusMsg}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
                styles.otpInput,
                digit !== '' && styles.otpInputFilled,
              ]}
              value={digit}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={2}
              textAlign="center"
              autoFocus={index === 0}
              editable={!verifyLoading && !authState.isLoading}
            />
          ))}
        </View>
        {otp.some(digit => digit !== '') && !isValid && (
          <Text style={styles.errorText}>Please enter complete 6-digit OTP</Text>
        )}
        {verifyError && (
          <Text style={styles.errorText}>
            OTP verification failed. Please try again.
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.verifyButton, 
          (!isValid || verifyLoading || authState.isLoading) && styles.verifyButtonDisabled
        ]}
        onPress={handleVerify}
        disabled={!isValid || verifyLoading || authState.isLoading}
      >
        <Text style={[
          styles.verifyButtonText, 
          (!isValid || verifyLoading || authState.isLoading) && styles.verifyButtonTextDisabled
        ]}>
          {verifyLoading || authState.isLoading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <TouchableOpacity 
          disabled={verifyLoading || authState.isLoading}
          onPress={handleResendOTP}
        >
          <Text style={[
            styles.resendLink, 
            (verifyLoading || authState.isLoading) && { color: '#ccc' }
          ]}>
            Resend OTP
          </Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
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
  changeNumberButton: {
    marginTop: 8,
    padding: 4,
  },
  changeNumberText: {
    fontSize: 14,
    color: '#065084',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  otpInput: {
    width: 45,
    height: 56,
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  otpInputFilled: {
    backgroundColor: '#e8f5ff',
    borderColor: '#065084',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 8,
  },
  verifyButton: {
    marginTop: 30,
    backgroundColor: '#065084',
    marginHorizontal: 24,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifyButtonTextDisabled: {
    color: '#999',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#065084',
    fontWeight: '600',
  },
});

export default OTPInputScreen;