/**
 * Supabase Client Configuration
 * Provides database, authentication, and real-time functionality for the Community feature
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create the Supabase client
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Helper to check if we can use Supabase
 */
export function canUseSupabase(): boolean {
  return isSupabaseConfigured && supabase !== null;
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, displayName: string) {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });
  
  if (error) throw error;
  
  // Create user profile in database
  if (data.user) {
    await (supabase as any).from('profiles').insert({
      id: data.user.id,
      display_name: displayName,
      email: email,
      created_at: new Date().toISOString(),
    });
  }
  
  return data;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

/**
 * Sign out
 */
export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithProvider(provider: 'google' | 'github' | 'facebook') {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/community`,
    },
  });
  
  if (error) throw error;
  return data;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: any) => void) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}

export default supabase;

