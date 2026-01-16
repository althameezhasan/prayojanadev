// src/utils/auth.ts
import React from 'react';
import { useAuth, useAuthToken, useLoginDetails, useIsAuthenticated } from '../context/AuthContext';

/**
 * Utility functions and custom hooks for authentication
 */

// Higher-order component for protecting routes
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = (props: P) => {
    const isAuthenticated = useIsAuthenticated();
    
    if (!isAuthenticated) {
      // This should not happen if App.tsx is set up correctly,
      // but it's a good safeguard
      return null;
    }
    
    return React.createElement(WrappedComponent, props);
  };

  // Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return AuthenticatedComponent;
};

// Hook for checking specific login types
export const useHasLoginType = (requiredType: string): boolean => {
  const loginDetails = useLoginDetails();
  return loginDetails?.loginType === requiredType;
};

// Hook for getting user ID
export const useUserId = (): number | null => {
  const loginDetails = useLoginDetails();
  return loginDetails?.id || null;
};

// Hook for making authenticated API calls
export const useAuthenticatedAPI = () => {
  const token = useAuthToken();
  const { logout } = useAuth();

  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // If token is invalid, logout the user
    if (response.status === 401) {
      await logout();
      throw new Error('Authentication expired. Please login again.');
    }

    return response;
  };

  return { makeAuthenticatedRequest, token };
};

// Hook for token refresh (if your API supports it)
export const useTokenRefresh = () => {
  const { login, logout } = useAuth();
  const token = useAuthToken();

  const refreshToken = async (refreshUrl: string): Promise<boolean> => {
    try {
      if (!token) {
        throw new Error('No token to refresh');
      }

      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken && data.loginDetails) {
          await login(data.accessToken, data.loginDetails);
          return true;
        }
      }

      // If refresh fails, logout user
      await logout();
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      return false;
    }
  };

  return { refreshToken };
};

// Hook for checking if user has specific permissions
export const useHasPermission = (permission: string): boolean => {
  const loginDetails = useLoginDetails();
  // Add your permission logic here based on loginDetails
  // This is just an example - adjust based on your API structure
  return true; // Placeholder - implement based on your permission system
};

// Hook for user profile data
export const useUserProfile = () => {
  const token = useAuthToken();
  const loginDetails = useLoginDetails();
  const userId = useUserId();

  return {
    token,
    loginDetails,
    userId,
    isAdmin: loginDetails?.loginType === 'admin',
    isMember: loginDetails?.loginType === 'member',
    // Add more user profile computed properties as needed
  };
};

// Utility function to check token expiration (if your token includes exp claim)
export const isTokenExpired = (token: string): boolean => {
  try {
    // This assumes JWT token - adjust if you use a different token format
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if we can't parse it
  }
};

// Hook for automatic token validation
export const useTokenValidation = () => {
  const token = useAuthToken();
  const { logout } = useAuth();

  const validateToken = async (): Promise<boolean> => {
    if (!token) {
      return false;
    }

    // Check if token is expired (for JWT tokens)
    if (isTokenExpired(token)) {
      await logout();
      return false;
    }

    return true;
  };

  return { validateToken, isValid: token && !isTokenExpired(token) };
};

/**
 * USAGE GUIDE AND EXAMPLES
 * 
 * 1. BASIC USAGE IN COMPONENTS:
 * 
 * import { useAuth, useAuthToken, useLoginDetails } from '../context/AuthContext';
 * 
 * const MyComponent = () => {
 *   const { login, logout, state } = useAuth();
 *   const token = useAuthToken();
 *   const loginDetails = useLoginDetails();
 *   
 *   return (
 *     <View>
 *       {state.isAuthenticated ? (
 *         <Text>Welcome, User ID: {loginDetails?.id}</Text>
 *       ) : (
 *         <Text>Please login</Text>
 *       )}
 *     </View>
 *   );
 * };
 * 
 * 
 * 2. MAKING AUTHENTICATED API CALLS:
 * 
 * import { useAuthenticatedAPI } from '../utils/auth';
 * 
 * const MyComponent = () => {
 *   const { makeAuthenticatedRequest } = useAuthenticatedAPI();
 *   
 *   const fetchUserData = async () => {
 *     try {
 *       const response = await makeAuthenticatedRequest('/api/user/profile');
 *       const userData = await response.json();
 *       console.log(userData);
 *     } catch (error) {
 *       console.error('API call failed:', error);
 *     }
 *   };
 *   
 *   return <Button title="Fetch Data" onPress={fetchUserData} />;
 * };
 * 
 * 
 * 3. PROTECTING COMPONENTS/SCREENS:
 * 
 * import { withAuth } from '../utils/auth';
 * 
 * const ProtectedScreen = () => {
 *   return <Text>This is only visible to authenticated users</Text>;
 * };
 * 
 * export default withAuth(ProtectedScreen);
 * 
 * 
 * 4. CONDITIONAL RENDERING BASED ON LOGIN TYPE:
 * 
 * import { useHasLoginType } from '../utils/auth';
 * 
 * const AdminPanel = () => {
 *   const isAdmin = useHasLoginType('admin');
 *   
 *   if (!isAdmin) {
 *     return <Text>Access Denied</Text>;
 *   }
 *   
 *   return <Text>Admin Panel Content</Text>;
 * };
 * 
 * 
 * 5. USING IN NAVIGATION LOGIC:
 * 
 * import { useIsAuthenticated } from '../context/AuthContext';
 * 
 * const NavigationContainer = () => {
 *   const isAuthenticated = useIsAuthenticated();
 *   
 *   return (
 *     <Stack.Navigator>
 *       {isAuthenticated ? (
 *         <Stack.Screen name="Dashboard" component={DashboardScreen} />
 *       ) : (
 *         <Stack.Screen name="Login" component={LoginScreen} />
 *       )}
 *     </Stack.Navigator>
 *   );
 * };
 * 
 * 
 * 6. LOGGING IN FROM ANY COMPONENT:
 * 
 * import { useAuth } from '../context/AuthContext';
 * 
 * const LoginForm = () => {
 *   const { login, state } = useAuth();
 *   
 *   const handleLogin = async () => {
 *     try {
 *       await login('your-token-here', { loginType: 'member', id: 123 });
 *       // User will be automatically redirected by App.tsx
 *     } catch (error) {
 *       console.error('Login failed:', error);
 *     }
 *   };
 *   
 *   return (
 *     <Button 
 *       title={state.isLoading ? "Logging in..." : "Login"} 
 *       onPress={handleLogin}
 *       disabled={state.isLoading}
 *     />
 *   );
 * };
 * 
 * 
 * 7. HANDLING LOGOUT:
 * 
 * import { useAuth } from '../context/AuthContext';
 * 
 * const LogoutButton = () => {
 *   const { logout } = useAuth();
 *   
 *   const handleLogout = async () => {
 *     try {
 *       await logout();
 *       // User will be automatically redirected to login screens
 *     } catch (error) {
 *       console.error('Logout failed:', error);
 *     }
 *   };
 *   
 *   return <Button title="Logout" onPress={handleLogout} />;
 * };
 * 
 * 
 * 8. ACCESSING USER PROFILE DATA:
 * 
 * import { useUserProfile } from '../utils/auth';
 * 
 * const UserProfile = () => {
 *   const { userId, loginDetails, isAdmin, isMember } = useUserProfile();
 *   
 *   return (
 *     <View>
 *       <Text>User ID: {userId}</Text>
 *       <Text>Login Type: {loginDetails?.loginType}</Text>
 *       {isAdmin && <Text>You have admin privileges</Text>}
 *       {isMember && <Text>You are a member</Text>}
 *     </View>
 *   );
 * };
 * 
 * 
 * 9. INTEGRATION WITH EXISTING HTTP HOOK:
 * 
 * import useHTTP from '../hooks/http';
 * import { useAuthToken } from '../context/AuthContext';
 * 
 * const MyComponent = () => {
 *   const token = useAuthToken();
 *   const { loading, data, callAPI } = useHTTP();
 *   
 *   const fetchData = () => {
 *     callAPI({
 *       url: '/api/protected-endpoint',
 *       method: 'GET',
 *       headers: {
 *         'Authorization': `Bearer ${token}`,
 *       },
 *     });
 *   };
 *   
 *   return <Button title="Fetch Protected Data" onPress={fetchData} />;
 * };
 * 
 * 
 * 10. ERROR HANDLING:
 * 
 * import { useAuthError } from '../context/AuthContext';
 * 
 * const ErrorDisplay = () => {
 *   const error = useAuthError();
 *   
 *   if (!error) return null;
 *   
 *   return (
 *     <View style={{backgroundColor: 'red', padding: 10}}>
 *       <Text style={{color: 'white'}}>{error}</Text>
 *     </View>
 *   );
 * };
 * 
 * 
 * INSTALLATION REQUIREMENTS:
 * 
 * You'll need to install AsyncStorage for persistent storage:
 * npm install @react-native-async-storage/async-storage
 * 
 * For iOS, you may need to run:
 * cd ios && pod install
 * 
 * 
 * BENEFITS OF THIS APPROACH:
 * 
 * 1. ✅ Global state management - no prop drilling
 * 2. ✅ Persistent authentication across app restarts
 * 3. ✅ Automatic token validation and cleanup
 * 4. ✅ Centralized authentication logic
 * 5. ✅ Easy to extend with additional features
 * 6. ✅ Type-safe with TypeScript
 * 7. ✅ Automatic navigation handling
 * 8. ✅ Error handling and loading states
 * 9. ✅ Easy logout from anywhere in the app
 * 10. ✅ Flexible architecture for future changes
 * 
 * 
 * MIGRATION STEPS FROM YOUR CURRENT CODE:
 * 
 * 1. Install AsyncStorage
 * 2. Add the AuthContext.tsx file
 * 3. Update App.tsx to use AuthProvider
 * 4. Update OTPInputScreen to use global auth
 * 5. Update DashboardScreen to use global auth
 * 6. Remove userToken and loginDetails props from components
 * 7. Use auth hooks instead of props throughout your app
 * 8. Test authentication flow thoroughly
 * 
 */