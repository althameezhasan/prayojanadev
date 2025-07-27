import React, { useState } from 'react';
import SplashScreen from './src/screens/login/SplashScreen';
import SelectScreen from './src/screens/login/SelectScreen';
import MobileInputScreen from './src/screens/login/MobileNumber';
import OTPInputScreen from './src/screens/login/OTPInputScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import AuthenticatorLoginScreen from './src/screens/login/authenticatorLogin/AuthenticatorLoginScreen';
import AuthenticatorSetupScreen from './src/screens/login/authenticatorLogin/AuthenticatorSetupScreen';


export type AuthScreen = 'splash' | 'select' | 'mobile' | 'otp' | 'authenticator-setup' | 'authenticator-login' | 'dashboard';

interface AuthState {
  currentScreen: AuthScreen;
  mobileNumber: string;
  otpData: any;
  userToken: string | null;
  loginDetails: { loginType: string; id: number } | null;
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [authState, setAuthState] = useState<AuthState>({
    currentScreen: 'select',
    mobileNumber: '',
    otpData: null,
    userToken: null,
    loginDetails: null,
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
    navigateToScreen('dashboard', { userToken, loginDetails });
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
      loginDetails: null
    });
  };

const handleAuthenticatorLogin = () => {
  // For now, we assume QR setup is always needed
  navigateToScreen('authenticator-setup');
};

const handleAuthenticatorSetupNext = () => {
  navigateToScreen('authenticator-login');
};

  const handleLogout = () => {
    setAuthState({
      currentScreen: 'select',
      mobileNumber: '',
      otpData: null,
      userToken: null,
      loginDetails: null
    });
  };

  // Updated to match AuthenticatorLoginScreen's expected signature
  const handleAuthenticatorSuccess = (token: string) => {
    console.log('Authenticator login successful, navigating to dashboard');
    // Set default loginDetails for authenticator login
    const defaultLoginDetails = { loginType: 'authenticator', id: 0 };
    navigateToScreen('dashboard', { 
      userToken: token, 
      loginDetails: defaultLoginDetails 
    });
  };

  const renderCurrentScreen = () => {
    switch (authState.currentScreen) {
      case 'select':
        return <SelectScreen 
          onGetStarted={handleGetStarted} 
          onAuthenticatorLogin={handleAuthenticatorLogin}
        />;
      
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
      
case 'authenticator-setup':
  return (
    <AuthenticatorSetupScreen
      onBack={handleBackToSelect}
      onNext={handleAuthenticatorSetupNext}
    />
  );

case 'authenticator-login':
  return (
    <AuthenticatorLoginScreen 
      onBack={handleBackToSelect}
      onSuccess={handleAuthenticatorSuccess}
    />
  );
      
      case 'dashboard':
        return (
          <DashboardScreen 
            onLogout={handleLogout}
            userToken={authState.userToken}
            loginDetails={authState.loginDetails}
          />
        );
      
      default:
        return <SelectScreen 
          onGetStarted={handleGetStarted} 
          onAuthenticatorLogin={handleAuthenticatorLogin}
        />;
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