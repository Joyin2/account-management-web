'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Define the business type enum to match BusinessTypeSelector IDs
export type BusinessType = 'manufacturer' | 'retailer' | 'restaurant' | 'service' | 'wholesale' | 'construction' | 'ecommerce' | 'general' | 'distributor';
export type AccountType = 'personal' | 'business' | 'enterprise';

interface UserProfile {
  uid: string;
  email: string;
  // Support both old and new formats
  fullName?: string; // Legacy format
  firstName?: string; // New format
  lastName?: string; // New format
  phone: string;
  // Support both old and new formats
  businessType?: BusinessType; // Legacy format
  accountType?: AccountType; // New format
  // Additional fields from SignupForm
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    newsletter: boolean;
  };
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, fullName: string, phone: string, businessType: BusinessType) => Promise<User>;
  logout: () => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Convert Date objects to Timestamp for consistency
            if (userData.createdAt instanceof Date) {
              userData.createdAt = Timestamp.fromDate(userData.createdAt);
            }
            if (userData.updatedAt instanceof Date) {
              userData.updatedAt = Timestamp.fromDate(userData.updatedAt);
            }
            setUserProfile(userData as UserProfile);
          } else {
            // User exists in Auth but no profile in Firestore
            console.warn('User authenticated but no profile found in Firestore');
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
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
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(user, {
        displayName: fullName
      });

      // Create user document in Firestore
      const now = Timestamp.now();
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        fullName,
        phone,
        businessType: businessType, // Store the business type ID
        createdAt: now,
        updatedAt: now
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      setUserProfile(userProfile);
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};