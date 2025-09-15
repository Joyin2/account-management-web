// Simple test script to create a test employee
// This can be run in the browser console to test employee creation

const createTestEmployee = async () => {
  try {
    console.log('Creating test employee...');
    
    // Get current user and organization info
    const auth = window.firebase?.auth?.();
    const db = window.firebase?.firestore?.();
    
    if (!auth || !db) {
      console.error('Firebase not available');
      return;
    }
    
    const user = auth.currentUser;
    if (!user) {
      console.error('No user logged in');
      return;
    }
    
    // Create a test employee
    const testEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+91-9876543210',
      employeeId: 'EMP001',
      department: 'Engineering',
      designation: 'Software Developer',
      dateOfJoining: new Date(),
      employmentType: 'full-time',
      status: 'active',
      organizationId: 'test-org-id', // This should be the actual org ID
      basicSalary: 50000,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.uid
    };
    
    // Add to Firestore
    const docRef = await db.collection('employees').add(testEmployee);
    console.log('Test employee created with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating test employee:', error);
  }
};

// Instructions:
// 1. Open browser console (F12)
// 2. Copy and paste this function
// 3. Run: createTestEmployee()

console.log('Test employee creation function loaded. Run createTestEmployee() to create a test employee.');
