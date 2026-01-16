// components/Dashboard/CurvedDashboardHeader.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ImageBackground,
  TouchableOpacity 
} from 'react-native';

interface CurvedDashboardHeaderProps {
  userToken?: string | null;
  loginDetails?: { loginType: string; id: number } | null;
  onBack?: () => void;
}

const CurvedDashboardHeader: React.FC<CurvedDashboardHeaderProps> = ({ 
  userToken, 
  loginDetails,
  onBack 
}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#007C91" barStyle="light-content" />
      
      {/* Background Image Header with Curve */}
      <ImageBackground
        source={require('../../../assets/image/topbg.png')}
        style={styles.topBanner}
        resizeMode="cover"
      >
        {onBack && (
          <TouchableOpacity style={styles.backArrow} onPress={onBack} />
        )}
        
        {/* Header Content */}
        <View style={styles.headerContent}>
          {/* <Text style={styles.welcomeText}>Welcome to Dashboard!</Text> */}
          
          {/* <View style={styles.tokenContainer}>
            <Text style={styles.tokenLabel}>Token:</Text>
            <Text style={styles.tokenText} numberOfLines={3} ellipsizeMode="middle">
              {userToken}
            </Text>
          </View> */}
          
          {loginDetails && (
            <View style={styles.loginDetailsContainer}>
              {/* <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Login Type:</Text>
                <Text style={styles.detailValue}>{loginDetails.loginType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>User ID:</Text>
                <Text style={styles.detailValue}>{loginDetails.id}</Text>
              </View> */}
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  topBanner: {
    minHeight: 200,
    paddingTop: StatusBar.currentHeight || 20,
    paddingHorizontal: 24,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  backArrow: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 20) + 10,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tokenContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tokenLabel: {
    fontSize: 14,
    color: '#e8f5ff',
    fontWeight: '600',
    marginBottom: 6,
  },
  tokenText: {
    fontSize: 11,
    color: '#fff',
    fontFamily: 'monospace',
    lineHeight: 14,
    opacity: 0.9,
  },
  loginDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  detailRow: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailLabel: {
    fontSize: 12,
    color: '#e8f5ff',
    marginBottom: 6,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default CurvedDashboardHeader;