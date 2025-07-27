import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

interface SelectScreenProps {
  onGetStarted: () => void;
  onAuthenticatorLogin?: () => void;
}

const SelectScreen: React.FC<SelectScreenProps> = ({ onGetStarted, onAuthenticatorLogin }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={require('./../../../assets/image/BackgroundScreen.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Bottom white card */}
          <View style={styles.bottomCard}>
            <Text style={styles.cardText}>Please select how you'd like to log in:</Text>
            
            <TouchableOpacity style={styles.loginButton} onPress={onGetStarted}>
              <Text style={styles.loginButtonText}>Mobile Number</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={onAuthenticatorLogin}
            >
              <Text style={styles.loginButtonText}>Authenticator Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 50,
    paddingBottom: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#007C91',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
    width: 220,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SelectScreen;