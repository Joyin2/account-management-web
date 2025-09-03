'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, CheckCircle, AlertCircle } from 'lucide-react';

const LogoutTest: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('Testing logout functionality...');
      await logout();
      console.log('Logout successful - should redirect to home page');
    } catch (error) {
      console.error('Logout test failed:', error);
      alert('Logout failed: ' + (error as Error).message);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">✅ Not logged in - logout functionality working correctly</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Logout Test Component</h3>
        <p className="text-blue-700 mb-4">Current user: {user.email}</p>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut size={16} />
          <span>Test Logout</span>
        </button>
        <p className="text-sm text-blue-600 mt-2">
          Click the button above to test logout. You should be redirected to the home page.
        </p>
      </div>
      
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-yellow-800 font-medium mb-2">Navbar Logout Test Instructions</h4>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Look at the top navigation bar</li>
              <li>Click on your user name/email in the top right</li>
              <li>A dropdown menu should appear</li>
              <li>Click "Logout" in the dropdown</li>
              <li>The menu should stay open long enough for the logout to complete</li>
              <li>You should be redirected to the home page</li>
              <li>The navigation should show "Login" and "Sign Up" buttons again</li>
            </ol>
            <p className="text-yellow-600 text-xs mt-2 font-medium">
              🔧 Fixed: Menu no longer closes too quickly, proper outside click detection added
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutTest;