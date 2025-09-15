// Simple test script to check Firestore connection
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, Timestamp } = require('firebase/firestore');

// Firebase config (same as in your app)
const firebaseConfig = {
  apiKey: "AIzaSyBM0y7Ns-pmQPohdfa02jYMV7Qt09PFcnw",
  authDomain: "accountmanagement-42375.firebaseapp.com",
  projectId: "accountmanagement-42375",
  storageBucket: "accountmanagement-42375.firebasestorage.app",
  messagingSenderId: "421676153467",
  appId: "1:421676153467:web:156e63e368a861c16380de",
  measurementId: "G-NL7GTPKB2N"
};

async function testFirestore() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('Testing Firestore connection...');
    
    // Try to read from transactions collection
    console.log('Reading transactions collection...');
    const transactionsRef = collection(db, 'transactions');
    const snapshot = await getDocs(transactionsRef);
    
    console.log(`Found ${snapshot.size} documents in transactions collection`);
    
    snapshot.forEach((doc) => {
      console.log('Document ID:', doc.id);
      console.log('Document data:', doc.data());
    });
    
    // Try to add a test document
    console.log('\nTrying to add a test transaction...');
    const testTransaction = {
      date: Timestamp.now(),
      type: 'SELL',
      amount: 1000,
      description: 'Test Transaction - ' + Date.now(),
      paymentMethod: 'Cash',
      gstApplicable: false,
      userId: 'test-user-id',
      organizationId: 'test-user-id',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(transactionsRef, testTransaction);
    console.log('Test transaction added with ID:', docRef.id);
    
    // Read again to confirm
    console.log('\nReading transactions again...');
    const snapshot2 = await getDocs(transactionsRef);
    console.log(`Now found ${snapshot2.size} documents in transactions collection`);
    
  } catch (error) {
    console.error('Error testing Firestore:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

testFirestore();