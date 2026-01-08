/**
 * Authentication Context
 * Manages user authentication state for the Community feature
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, canUseSupabase, signIn, signUp, signOut, signInWithProvider } from '../lib/supabase';
import { clearPersonalizedVehicleData } from '../components/PersonalizedVehicles';
import type { User } from '@supabase/supabase-js';

// Types
interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  clearError: () => void;
  // For demo mode without Supabase
  setDemoUser: (name: string, avatar?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get user from local storage for demo mode
function getDemoUser(): AuthUser | null {
  try {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      
      // Only consider authenticated if user has explicitly set up their profile
      // This requires a name (from onboarding or profile setup)
      const hasName = data.name && typeof data.name === 'string' && data.name.trim() !== '';
      const hasFullName = data.fullName && typeof data.fullName === 'string' && data.fullName.trim() !== '';
      
      // User must have a name to be considered authenticated
      if (hasName || hasFullName) {
        return {
          id: 'demo_user',
          email: data.email || 'demo@motortrend.com',
          displayName: data.name || data.fullName || 'Demo User',
          avatarUrl: data.avatar,
          isAnonymous: true,
        };
      }
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}

// Convert Supabase user to AuthUser
function supabaseUserToAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email || '',
    displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
    avatarUrl: user.user_metadata?.avatar_url,
    isAnonymous: false,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      if (canUseSupabase() && supabase) {
        // Get current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(supabaseUserToAuthUser(session.user));
        } else {
          // Fall back to demo user
          setUser(getDemoUser());
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUser(supabaseUserToAuthUser(session.user));
          } else {
            setUser(getDemoUser());
          }
        });
        
        setIsLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Demo mode - use localStorage
        setUser(getDemoUser());
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Listen for localStorage changes (demo mode)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'onboardingData' && !canUseSupabase()) {
        setUser(getDemoUser());
      }
    };

    const handleCustomUpdate = () => {
      if (!canUseSupabase()) {
        setUser(getDemoUser());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('onboardingDataUpdated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('onboardingDataUpdated', handleCustomUpdate);
    };
  }, []);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (!canUseSupabase()) {
        throw new Error('Authentication requires Supabase configuration. Using demo mode.');
      }
      
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignUp = useCallback(async (email: string, password: string, displayName: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (!canUseSupabase()) {
        // Demo mode - save to localStorage
        const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        onboardingData.name = displayName;
        onboardingData.email = email;
        localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
        window.dispatchEvent(new CustomEvent('onboardingDataUpdated'));
        setUser(getDemoUser());
        return;
      }
      
      await signUp(email, password, displayName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setError(null);
    
    try {
      if (canUseSupabase()) {
        await signOut();
      }
      
      // Clear personalized vehicle data (viewed/searched history)
      clearPersonalizedVehicleData();
      
      // Clear demo user data
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      delete onboardingData.name;
      delete onboardingData.avatar;
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    }
  }, []);

  const handleSignInWithGoogle = useCallback(async () => {
    setError(null);
    
    try {
      if (!canUseSupabase()) {
        throw new Error('OAuth requires Supabase configuration');
      }
      
      await signInWithProvider('google');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign in failed');
      throw err;
    }
  }, []);

  const setDemoUser = useCallback((name: string, avatar?: string) => {
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    onboardingData.name = name;
    if (avatar) onboardingData.avatar = avatar;
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    window.dispatchEvent(new CustomEvent('onboardingDataUpdated'));
    setUser(getDemoUser());
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGoogle: handleSignInWithGoogle,
    clearError,
    setDemoUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

