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
} from 'react-native';
import useHTTP from '../../hooks/http';

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
  onVerify?: (otp: string) => void;
  onBack?: () => void;
  onSuccess?: () => void; // Add this prop for navigation to dashboard
}

const OTPInputScreen: React.FC<OTPInputScreenProps> = ({
  mobileNumber,
  otpData,
  onVerify,
  onBack,
  onSuccess,
}) => {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [isValid, setIsValid] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  // HTTP hook for OTP verification with proper typing
  const { 
    loading: verifyLoading, 
    data: verifyResponse, 
    callAPI: handleVerifyOTP, 
    error: verifyError, 
    success: isVerified 
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

  const handleVerify = () => {
    if (isValid) {
      console.log('Verifying OTP:', otp.join(''));
      console.log('Mobile Number:', mobileNumber);
      
      handleVerifyOTP({
        url: 'https://kwnfmv39-443.inc1.devtunnels.ms/api/auth/membersverify', // Replace with your verification endpoint
        method: 'POST',
        data: {
          phone: `+91${mobileNumber}`,
          otp: otp.join(''),
        },
      });
    }
  };

  // Handle OTP verification response
  useEffect(() => {
    if (isVerified && verifyResponse) {
      console.log('OTP verification successful:', verifyResponse);
      
      // Check if the response indicates successful authentication
      // Based on your actual API response structure: response.message.statusMsg
      if (verifyResponse?.message?.statusMsg === "Authentication Success!!!") {
        console.log('Authentication successful, navigating to dashboard');
        console.log('Access Token:', verifyResponse.message.accessToken);
        console.log('Login Details:', verifyResponse.message.loginDetails);
        onSuccess?.(); // Navigate to dashboard
      } else {
        console.log('Authentication failed - unexpected response structure');
      }
    }

    if (verifyError) {
      console.error('OTP verification failed:', verifyError);
      // You can add error handling UI here if needed
    }
  }, [isVerified, verifyError, verifyResponse, onSuccess]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/image/topbg.png')}
        style={styles.topBanner}
        resizeMode="contain"
      >
        <TouchableOpacity style={styles.backArrow} onPress={onBack} />
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
              editable={!verifyLoading} // Disable input while loading
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
          (!isValid || verifyLoading) && styles.verifyButtonDisabled
        ]}
        onPress={handleVerify}
        disabled={!isValid || verifyLoading}
      >
        <Text style={[
          styles.verifyButtonText, 
          (!isValid || verifyLoading) && styles.verifyButtonTextDisabled
        ]}>
          {verifyLoading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <TouchableOpacity disabled={verifyLoading}>
          <Text style={[
            styles.resendLink, 
            verifyLoading && { color: '#ccc' }
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
    top: 20,
    left: 20,
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
    borderColor: '#007C91',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 8,
  },
  verifyButton: {
    marginTop: 30,
    backgroundColor: '#007C91',
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
    color: '#007C91',
    fontWeight: '600',
  },
});

export default OTPInputScreen;