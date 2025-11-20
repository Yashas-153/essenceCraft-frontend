import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authAPI } from '../services/api.js';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wrap your app with this to provide auth state globally
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokensState] = useState(() => {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set tokens in state and localStorage
  const setTokens = useCallback((tokenData) => {
    if (tokenData) {
      localStorage.setItem('auth_tokens', JSON.stringify(tokenData));
      setTokensState(tokenData);
    } else {
      localStorage.removeItem('auth_tokens');
      setTokensState(null);
    }
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    if (tokens?.access_token) {
      getCurrentUser();
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (email, firstName, lastName, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authAPI.register(email, firstName, lastName, password);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Request OTP for phone signup
   */
  const phoneSignup = useCallback(async (phone) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.phoneSignup(phone);
      return { success: true, message: data.message };
    } catch (err) {
      const message = err.message || 'Failed to send OTP';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verify OTP for phone signup/login
   */
  const verifyOTP = useCallback(async (phone, otp) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.verifyOTP(phone, otp);
      
      // If user exists and logged in
      if (data.access_token) {
        setTokens({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
        });
        setUser(data.user);
        return { 
          success: true, 
          profile_completed: data.profile_completed,
          user: data.user 
        };
      }
      
      // New user needs to complete profile
      return { 
        success: true, 
        profile_completed: false,
        phone: data.phone 
      };
    } catch (err) {
      const message = err.message || 'OTP verification failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setTokens]);

  /**
   * Complete profile after OTP verification
   */
  const completeProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authAPI.completeProfile(profileData);
      setUser(userData);
      
      // After completing profile, need to verify OTP again to get tokens
      const loginData = await authAPI.verifyOTP(profileData.phone, '123456'); // Use stored OTP
      if (loginData.access_token) {
        setTokens({
          access_token: loginData.access_token,
          refresh_token: loginData.refresh_token,
          token_type: loginData.token_type,
        });
      }
      
      return { success: true, user: userData };
    } catch (err) {
      const message = err.message || 'Profile completion failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setTokens]);

  /**
   * Login with email and password
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login(email, password);
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type,
      });
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setTokens]);

  /**
   * Verify email with token
   */
  const verifyEmail = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.verifyEmail(token);
      setUser((prev) => (prev ? { ...prev, is_verified: true } : null));
      return { success: true };
    } catch (err) {
      const message = err.message || 'Email verification failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Request OTP for phone verification
   */
  const addPhone = useCallback(async (phone) => {
    if (!tokens?.access_token) {
      return { success: false, error: 'Not authenticated' };
    }
    setLoading(true);
    setError(null);
    try {
      await authAPI.addPhone(phone, tokens.access_token, tokens.token_type);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Failed to send OTP';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens?.access_token, tokens?.token_type]);

  /**
   * Verify phone with OTP
   */
  const verifyPhone = useCallback(async (phone, otp) => {
    if (!tokens?.access_token) {
      return { success: false, error: 'Not authenticated' };
    }
    setLoading(true);
    setError(null);
    try {
      await authAPI.verifyPhone(phone, otp, tokens.access_token, tokens.token_type);
      setUser((prev) =>
        prev ? { ...prev, phone, is_verified: true } : null
      );
      return { success: true };
    } catch (err) {
      const message = err.message || 'Phone verification failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens?.access_token, tokens?.token_type]);

  /**
   * Refresh access token
   */
  const refreshTokens = useCallback(async () => {
    if (!tokens?.refresh_token) {
      return { success: false };
    }
    try {
      const data = await authAPI.refreshToken(tokens.refresh_token);
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type,
      });
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setTokens(null);
      setUser(null);
      return { success: false };
    }
  }, [tokens?.refresh_token, setTokens]);

  /**
   * Get current user profile
   */
  const getCurrentUser = useCallback(async () => {
    if (!tokens?.access_token) {
      return { success: false };
    }
    setLoading(true);
    try {
      const userData = await authAPI.getCurrentUser(tokens.access_token, tokens.token_type);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [tokens?.access_token, tokens?.token_type]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    if (tokens?.access_token) {
      try {
        await authAPI.logout(tokens.access_token, tokens.token_type);
      } catch (err) {
        console.error('Logout API error:', err);
      }
    }
    setTokens(null);
    setUser(null);
    setError(null);
  }, [tokens?.access_token, tokens?.token_type, setTokens]);

  const value = {
    user,
    tokens,
    loading,
    error,
    isAuthenticated: !!tokens?.access_token,
    register,
    login,
    logout,
    verifyEmail,
    addPhone,
    verifyPhone,
    refreshTokens,
    getCurrentUser,
    phoneSignup,
    verifyOTP,
    completeProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};