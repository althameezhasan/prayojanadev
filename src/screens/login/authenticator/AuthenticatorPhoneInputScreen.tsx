// src/screens/login/authenticator/AuthenticatorPhoneInputScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

interface Props {
  onBack: () => void;
  onAlreadyAuthenticated: (phone: string, email: string) => void;
  onNeedsEmailVerification: (phone: string, email: string) => void;
}

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const BASE_URL = 'https://sb76775n-443.inc1.devtunnels.ms/api/auth/';

const COUNTRY_CODES: CountryCode[] = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
];

const AuthenticatorPhoneInputScreen: React.FC<Props> = ({
  onBack,
  onAlreadyAuthenticated,
  onNeedsEmailVerification,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    COUNTRY_CODES.find(c => c.code === '+91') || COUNTRY_CODES[0]
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const checkAuthenticated = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Invalid Input', 'Please enter a phone number');
      return;
    }

    const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');

    if (cleanPhoneNumber.length !== 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
      return;
    }

    const fullPhoneNumber = `${selectedCountryCode.code}${cleanPhoneNumber}`;

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}checkauthenticated`,
        { phone: fullPhoneNumber },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const message = response.data?.message;

      if (message?.status === true) {
        onAlreadyAuthenticated(fullPhoneNumber, message.email_id?.trim()?.toLowerCase());
      } else if (message?.status === false) {
        onNeedsEmailVerification(fullPhoneNumber, message.email_id?.trim()?.toLowerCase());
      } else {
        Alert.alert('Error', 'Unexpected response from server');
      }
    } catch (error: any) {
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

  const selectCountryCode = (countryCode: CountryCode) => {
    setSelectedCountryCode(countryCode);
    setShowCountryPicker(false);
  };

  const renderCountryItem = ({ item }: { item: CountryCode }) => (
    <TouchableOpacity style={styles.countryItem} onPress={() => selectCountryCode(item)}>
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.country}</Text>
        <Text style={styles.countryCode}>{item.code}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter Phone Number</Text>
        <Text style={styles.subtitle}>Select your country code and enter your 10-digit mobile number</Text>

        <View style={styles.phoneInputContainer}>
          <TouchableOpacity
            style={styles.countrySelector}
            onPress={() => setShowCountryPicker(true)}
            disabled={loading}
          >
            <Text style={styles.countryFlag}>{selectedCountryCode.flag}</Text>
            <Text style={styles.selectedCountryCode}>{selectedCountryCode.code}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={(text) => {
              const digitsOnly = text.replace(/[^\d]/g, '');
              setPhoneNumber(digitsOnly);
            }}
            keyboardType="number-pad"
            placeholder="Enter 10-digit number"
            editable={!loading}
            maxLength={10}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={checkAuthenticated}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back to Options</Text>
      </TouchableOpacity>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country Code</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={renderCountryItem}
              style={styles.countryList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AuthenticatorPhoneInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 30,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 10,
    minWidth: 100,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  selectedCountryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
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
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  backText: {
    color: '#007C91',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryInfo: {
    marginLeft: 15,
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  countryCode: {
    fontSize: 14,
    color: '#666',
  },
});
