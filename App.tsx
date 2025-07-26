import React, { useState } from 'react';
// import SplashScreen from '../MyNewApp/src/screens/login/SplashScreen';
// import BackgroundScreen from '../MyNewApp/src/screens/login/SelectScreen';
// import MobileInputScreen from '../MyNewApp/src/screens/login/MobileNumber';
// import OTPInputScreen from '../MyNewApp/src/screens/login/OTPInputScreen';
// import DashboardScreen from '../MyNewApp/src/screens/dashboard/DashboardScreen';
import SplashScreen from '../prayojanadev/src/screens/login/SplashScreen';
import BackgroundScreen from '../prayojanadev/src/screens/login/SelectScreen';
import MobileInputScreen from'../prayojanadev/src/screens/login/MobileNumber';
import OTPInputScreen from '../prayojanadev/src/screens/login/OTPInputScreen';
import DashboardScreen from '../prayojanadev/src/screens/dashboard/DashboardScreen';
const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('background');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpData, setOtpData] = useState<any>(null);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleGetStarted = () => {
    setCurrentScreen('mobile');
  };

  const handleMobileSubmit = (number: string, otpData?: any) => {
    setMobileNumber(number);
    if (otpData) setOtpData(otpData);
    setCurrentScreen('otp');
  };

  const handleOTPSuccess = () => {
    console.log('OTP verification successful, navigating to dashboard');
    setCurrentScreen('dashboard');
  };

  const handleBackToMobile = () => {
    setCurrentScreen('mobile');
  };

  const handleLogout = () => {
    // Reset all states and go back to background screen
    setMobileNumber('');
    setOtpData(null);
    setCurrentScreen('background');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'background':
        return <BackgroundScreen onGetStarted={handleGetStarted} />;
      case 'mobile':
        return <MobileInputScreen onSubmit={handleMobileSubmit} />;
      case 'otp':
        return (
          <OTPInputScreen 
            mobileNumber={mobileNumber} 
            otpData={otpData}
            onBack={handleBackToMobile}
            onSuccess={handleOTPSuccess}
          />
        );
      case 'dashboard':
        return <DashboardScreen onLogout={handleLogout} />;
      default:
        return <BackgroundScreen onGetStarted={handleGetStarted} />;
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