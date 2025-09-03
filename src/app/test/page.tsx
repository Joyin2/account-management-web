import FirebaseTest from '@/components/debug/FirebaseTest';
import LogoutTest from '@/components/debug/LogoutTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug & Test Page</h1>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Logout Functionality Test</h2>
          <LogoutTest />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Firebase Connection Test</h2>
          <FirebaseTest />
        </div>
      </div>
    </div>
  );
}