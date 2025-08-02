// src/screens/login/SelectScreen.tsx
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
}

const SelectScreen: React.FC<SelectScreenProps> = ({ onGetStarted }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={require('../../../assets/image/BackgroundScreen.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Bottom white card */}
          <View style={styles.bottomCard}>
            <Text style={styles.cardText}>Please select how you'd like to log in:</Text>
            <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
              <Text style={styles.getStartedButtonText}>Mobile Number</Text>
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
    marginBottom: 70,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#065084',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectScreen;