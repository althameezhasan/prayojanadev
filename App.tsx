// App.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { AuthProvider, useAuth, useIsAuthenticated, useAuthLoading } from './src/context/AuthContext';
import SplashScreen from './src/screens/login/SplashScreen';
import SelectScreen from './src/screens/login/SelectScreen';
import MobileInputScreen from './src/screens/login/MobileNumber';
import OTPInputScreen from './src/screens/login/OTPInputScreen';
import AuthenticatorScreen from './src/screens/login/AuthenticatorLoginScreen.';
import NavbarScreen from './src/screens/navigation/NavbarScreen';

export type AuthScreen = 'splash' | 'select' | 'mobile' | 'otp' | 'authenticator';

interface NavigationState {
  currentScreen: AuthScreen;
  mobileNumber: string;
  otpData: any;
}

// Main App Content Component
const AppContent: React.FC = () => {
  useAuth();
  const isAuthenticated = useIsAuthenticated();
  const isAuthLoading = useAuthLoading();
  
  const [showSplash, setShowSplash] = useState(true);
  const [navState, setNavState] = useState<NavigationState>({
    currentScreen: 'select',
    mobileNumber: '',
    otpData: null,
  });

  // Reset navigation state when user logs out
  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) {
      // Reset to SelectScreen when user is logged out
      setNavState({
        currentScreen: 'select',
        mobileNumber: '',
        otpData: null,
      });
    }
  }, [isAuthenticated, isAuthLoading]);

  // Show loading spinner while checking authentication
  if (isAuthLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007C91" />
      </View>
    );
  }

  // If authenticated, show navbar screen instead of dashboard directly
  if (isAuthenticated) {
    return <NavbarScreen />;
  }

  // Navigation handlers for auth flow
  const navigateToScreen = (screen: AuthScreen, data?: Partial<NavigationState>) => {
    setNavState(prev => ({
      ...prev,
      currentScreen: screen,
      ...data
    }));
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleGetStarted = () => {
    navigateToScreen('mobile');
  };

  const handleAuthenticatorLogin = () => {
    navigateToScreen('authenticator');
  };

  const handleMobileSubmit = (number: string, otpData?: any) => {
    navigateToScreen('otp', {
      mobileNumber: number,
      otpData: otpData
    });
  };

  const handleAuthenticatorSubmit = (code: string) => {
  console.log('Authenticator code received:', code);

  Alert.alert('Success', 'Authenticator code verified successfully!');
  
  // Add real logic here (e.g., navigate to home)
};


  const handleBackToMobile = () => {
    navigateToScreen('mobile', {
      otpData: null
    });
  };

  const handleBackToSelect = () => {
    navigateToScreen('select', {
      mobileNumber: '',
      otpData: null,
    });
  };

  // Render auth screens
  const renderAuthScreen = () => {
    switch (navState.currentScreen) {
      case 'select':
        return (
          <SelectScreen 
            onGetStarted={handleGetStarted} 
            onAuthenticatorLogin={handleAuthenticatorLogin}
          />
        );
      
      case 'mobile':
        return (
          <MobileInputScreen 
            onSubmit={handleMobileSubmit}
            onBack={handleBackToSelect}
            initialMobileNumber={navState.mobileNumber}
          />
        );
      
      case 'otp':
        return (
          <OTPInputScreen 
            mobileNumber={navState.mobileNumber}
            otpData={navState.otpData}
            onBack={handleBackToMobile}
            // No need to pass onSuccess - OTP screen will handle login globally
            // After successful login, user will be redirected to NavbarScreen automatically
          />
        );
      
      case 'authenticator':
        return (
          <AuthenticatorScreen
            onBack={handleBackToSelect}
            onSuccess={handleAuthenticatorSubmit} 
          />
        );
      
      default:
        return (
          <SelectScreen 
            onGetStarted={handleGetStarted} 
            onAuthenticatorLogin={handleAuthenticatorLogin}
          />
        );
    }
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        renderAuthScreen()
      )}
    </>
  );
};

// Main App Component with Provider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default App;