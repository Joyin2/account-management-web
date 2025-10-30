'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/roles';

// Define the business type enum to match BusinessTypeSelector IDs
export type BusinessType = 'manufacturer' | 'retailer' | 'restaurant' | 'service' | 'wholesale' | 'construction' | 'ecommerce' | 'general' | 'distributor';
export type AccountType = 'personal' | 'business' | 'enterprise';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  business_type: BusinessType;
  role: UserRole;
  organization_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, fullName: string, phone: string, businessType: BusinessType) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
      } else if (data) {
        setUserProfile(data as UserProfile);
      } else {
        console.warn('User authenticated but no profile found in database');
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from sign in');

      return data.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    businessType: BusinessType
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from sign up');

      const user = data.user;

      // Create a default organization ID for new users
      const defaultOrgId = `org_${user.id}_${Date.now()}`;

      const userProfile: Omit<UserProfile, 'id'> = {
        email: user.email!,
        full_name: fullName,
        phone,
        business_type: businessType,
        role: 'admin',
        organization_id: defaultOrgId,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const organizationData = {
        organization_id: defaultOrgId,
        name: 'General Business',
        business_type: businessType,
        owner_id: user.id,
        settings: {
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          dateFormat: 'DD/MM/YYYY'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save both user profile and organization
      const { error: profileError } = await supabase
        .from('users')
        .insert([{ ...userProfile, id: user.id }]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw profileError;
      }

      const { error: orgError } = await supabase
        .from('organizations')
        .insert([organizationData]);

      if (orgError) {
        console.error('Error creating organization:', orgError);
        // Don't throw here as user is already created
      }

      setUserProfile({ ...userProfile, id: user.id } as UserProfile);
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    currentUser: user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};