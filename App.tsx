import React, { useState } from 'react';
import SplashScreen from './src/screens/login/SplashScreen';
import SelectScreen from './src/screens/login/SelectScreen';
import MobileInputScreen from './src/screens/login/MobileNumber';
import OTPInputScreen from './src/screens/login/OTPInputScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';

export type AuthScreen = 'splash' | 'select' | 'mobile' | 'otp' | 'dashboard';

interface AuthState {
  currentScreen: AuthScreen;
  mobileNumber: string;
  otpData: any;
  userToken: string | null;
  loginDetails: { loginType: string; id: number } | null; // Added loginDetails
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [authState, setAuthState] = useState<AuthState>({
    currentScreen: 'select',
    mobileNumber: '',
    otpData: null,
    userToken: null,
    loginDetails: null, // Initialize loginDetails
  });

  // Navigation handlers
  const navigateToScreen = (screen: AuthScreen, data?: Partial<AuthState>) => {
    setAuthState(prev => ({
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

  const handleMobileSubmit = (number: string, otpData?: any) => {
    navigateToScreen('otp', {
      mobileNumber: number,
      otpData: otpData
    });
  };

  const handleOTPSuccess = (userToken: string, loginDetails: { loginType: string; id: number }) => {
    console.log('OTP verification successful, navigating to dashboard');
    navigateToScreen('dashboard', { userToken, loginDetails }); // Pass loginDetails
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
      userToken: null,
      loginDetails: null // Reset loginDetails
    });
  };

  const handleLogout = () => {
    setAuthState({
      currentScreen: 'select',
      mobileNumber: '',
      otpData: null,
      userToken: null,
      loginDetails: null // Reset loginDetails
    });
  };

  const renderCurrentScreen = () => {
    switch (authState.currentScreen) {
      case 'select':
        return <SelectScreen onGetStarted={handleGetStarted} />;
      
      case 'mobile':
        return (
          <MobileInputScreen 
            onSubmit={handleMobileSubmit}
            onBack={handleBackToSelect}
            initialMobileNumber={authState.mobileNumber}
          />
        );
      
      case 'otp':
        return (
          <OTPInputScreen 
            mobileNumber={authState.mobileNumber}
            otpData={authState.otpData}
            onBack={handleBackToMobile}
            onSuccess={handleOTPSuccess}
          />
        );
      
      case 'dashboard':
        return (
          <DashboardScreen 
            onLogout={handleLogout}
            userToken={authState.userToken}
            loginDetails={authState.loginDetails} // Pass loginDetails
          />
        );
      
      default:
        return <SelectScreen onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        renderCurrentScreen()
      )}
    </>
  );
};

export default App;