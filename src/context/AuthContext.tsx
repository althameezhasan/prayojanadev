// src/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface LoginDetails {
  loginType: string;
  id: number;
  householdId?: number | null; // Add household ID here
}

export interface AuthUser {
  accessToken: string;
  loginDetails: LoginDetails;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESTORE_AUTH'; payload: AuthUser | null }
  | { type: 'UPDATE_HOUSEHOLD_ID'; payload: number | null }; // New action

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'RESTORE_AUTH':
      return {
        ...state,
        isAuthenticated: action.payload !== null,
        user: action.payload,
        isLoading: false,
      };

    case 'UPDATE_HOUSEHOLD_ID':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          loginDetails: {
            ...state.user.loginDetails,
            householdId: action.payload,
          },
        } : null,
      };

    default:
      return state;
  }
};

// Context
interface AuthContextType {
  state: AuthState;
  login: (accessToken: string, loginDetails: LoginDetails) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  restoreAuth: () => Promise<void>;
  updateHouseholdId: (householdId: number | null) => Promise<void>; // New function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  LOGIN_DETAILS: '@login_details',
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Store auth data in AsyncStorage
  const storeAuthData = async (user: AuthUser) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, user.accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.LOGIN_DETAILS, JSON.stringify(user.loginDetails));
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };

  // Remove auth data from AsyncStorage
  const removeAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.LOGIN_DETAILS]);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  };

  // Login function
  const login = async (accessToken: string, loginDetails: LoginDetails) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const user: AuthUser = {
        accessToken,
        loginDetails,
      };

      // Store in AsyncStorage
      await storeAuthData(user);

      // Update state
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      
      console.log('User logged in successfully:', user);
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_ERROR', payload: 'Failed to login. Please try again.' });
    }
  };

  // Update household ID function
  const updateHouseholdId = async (householdId: number | null) => {
    try {
      if (state.user) {
        const updatedUser: AuthUser = {
          ...state.user,
          loginDetails: {
            ...state.user.loginDetails,
            householdId,
          },
        };

        // Store updated data in AsyncStorage
        await storeAuthData(updatedUser);

        // Update state
        dispatch({ type: 'UPDATE_HOUSEHOLD_ID', payload: householdId });
        
        console.log('Household ID updated successfully:', householdId);
      }
    } catch (error) {
      console.error('Error updating household ID:', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Remove from AsyncStorage
      await removeAuthData();

      // Update state
      dispatch({ type: 'LOGOUT' });
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if AsyncStorage fails, we should still logout from state
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Restore authentication on app start
  const restoreAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const [accessToken, loginDetailsString] = await AsyncStorage.multiGet([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.LOGIN_DETAILS,
      ]);

      const token = accessToken[1];
      const loginDetailsJson = loginDetailsString[1];

      if (token && loginDetailsJson) {
        const loginDetails: LoginDetails = JSON.parse(loginDetailsJson);
        const user: AuthUser = {
          accessToken: token,
          loginDetails,
        };

        dispatch({ type: 'RESTORE_AUTH', payload: user });
        console.log('Auth restored successfully:', user);
      } else {
        dispatch({ type: 'RESTORE_AUTH', payload: null });
        console.log('No stored auth data found');
      }
    } catch (error) {
      console.error('Error restoring auth:', error);
      dispatch({ type: 'RESTORE_AUTH', payload: null });
    }
  };

  // Restore auth on mount
  useEffect(() => {
    restoreAuth();
  }, []);

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    clearError,
    restoreAuth,
    updateHouseholdId, // Add to context value
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Selectors for specific auth data
export const useAuthToken = (): string | null => {
  const { state } = useAuth();
  return state.user?.accessToken || null;
};

export const useLoginDetails = (): LoginDetails | null => {
  const { state } = useAuth();
  return state.user?.loginDetails || null;
};

export const useHouseholdId = (): number | null => {
  const { state } = useAuth();
  return state.user?.loginDetails?.householdId || null;
};

export const useIsAuthenticated = (): boolean => {
  const { state } = useAuth();
  return state.isAuthenticated;
};

export const useAuthLoading = (): boolean => {
  const { state } = useAuth();
  return state.isLoading;
};

export const useAuthError = (): string | null => {
  const { state } = useAuth();
  return state.error;
};