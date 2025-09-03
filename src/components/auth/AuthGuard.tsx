'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireProfile?: boolean;
  requireCompleteProfile?: boolean;
}

export default function AuthGuard({ 
  children, 
  redirectTo = '/login',
  requireProfile = false,
  requireCompleteProfile = false 
}: AuthGuardProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not authenticated, redirect to login
        router.push(redirectTo);
        return;
      }
      
      if (requireProfile && !userProfile) {
        // User is authenticated but profile is missing, redirect to complete signup
        router.push('/signup');
        return;
      }
      
      if (requireCompleteProfile && userProfile) {
        // Check if profile is complete (has required fields)
        const hasBasicInfo = userProfile.firstName || userProfile.fullName;
        const hasAccountType = userProfile.accountType || userProfile.businessType;
        
        if (!hasBasicInfo || !hasAccountType) {
          router.push('/signup');
          return;
        }
      }
    }
  }, [user, userProfile, loading, router, redirectTo, requireProfile, requireCompleteProfile]);
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null;
  }
  
  // Don't render if profile is required but missing
  if (requireProfile && !userProfile) {
    return null;
  }
  
  // Don't render if complete profile is required but incomplete
  if (requireCompleteProfile && userProfile) {
    const hasBasicInfo = userProfile.firstName || userProfile.fullName;
    const hasAccountType = userProfile.accountType || userProfile.businessType;
    
    if (!hasBasicInfo || !hasAccountType) {
      return null;
    }
  }
  
  // Don't render if complete profile is required but no profile exists
  if (requireCompleteProfile && !userProfile) {
    return null;
  }

  // User is authenticated and has profile, render children
  return <>{children}</>;
}

// Higher-order component for easier usage
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: { redirectTo?: string; requireProfile?: boolean }
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}