import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FirestoreTransaction {
  id?: string;
  date: Timestamp;
  type: 'BUY' | 'SELL' | 'EXPENDITURE' | 'CAPITAL_DRAWINGS' | 'BANK' | 'LOAN';
  subType?: string;
  amount: number;
  description: string;
  vendorName?: string;
  buyerName?: string;
  paymentMethod: string;
  gstApplicable: boolean;
  gstn?: string;
  gstType?: 'Regular' | 'Composite';
  remarks?: string;
  importExportTax?: number;
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Type-specific fields
  productName?: string;
  quantity?: number;
  price?: number;
  assetName?: string;
  expenseType?: string;
  paidTo?: string;
  billUrl?: string;
  partnerOwner?: string;
  bankAccount?: string;
  transactionType?: string;
  loanProvider?: string;
  interestRate?: number;
  emiAmount?: number;
}

const COLLECTION_NAME = 'transactions';

export const transactionService = {
  // Create a new transaction
  async createTransaction(transaction: Omit<FirestoreTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const transactionData = {
        ...transaction,
        createdAt: now,
        updatedAt: now
      };
      
      // Validate required fields before sending to Firestore
      const requiredFields = ['date', 'type', 'amount', 'description', 'paymentMethod', 'gstApplicable', 'userId', 'organizationId'];
      const missingFields = requiredFields.filter(field => {
        const value = transactionData[field as keyof typeof transactionData];
        return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Missing or empty required fields: ${missingFields.join(', ')}`);
      }
      
      // Validate field types and constraints
      if (typeof transactionData.amount !== 'number' || transactionData.amount <= 0) {
        throw new Error('Amount must be a positive number');
      }
      
      if (typeof transactionData.description !== 'string' || transactionData.description.trim().length === 0) {
        throw new Error('Description must be a non-empty string');
      }
      
      if (typeof transactionData.paymentMethod !== 'string' || transactionData.paymentMethod.trim().length === 0) {
        throw new Error('Payment method must be a non-empty string');
      }
      
      // Validate transaction type
      const validTypes = ['BUY', 'SELL', 'EXPENDITURE', 'CAPITAL_DRAWINGS', 'BANK', 'LOAN'];
      if (!validTypes.includes(transactionData.type)) {
        throw new Error(`Invalid transaction type. Must be one of: ${validTypes.join(', ')}`);
      }
      
      // Validate payment method
      const validPaymentMethods = ['Cash', 'Bank', 'Credit', 'UPI', 'Card', 'Cheque', 'NEFT', 'RTGS'];
      if (!validPaymentMethods.includes(transactionData.paymentMethod)) {
        throw new Error(`Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`);
      }
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), transactionData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating transaction:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create transaction: ${error.message}`);
      }
      throw new Error('Failed to create transaction');
    }
  },

  // Get all transactions for an organization
  async getTransactions(organizationId: string): Promise<FirestoreTransaction[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreTransaction[];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  },

  // Get transactions by type
  async getTransactionsByType(organizationId: string, type: string): Promise<FirestoreTransaction[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId),
        where('type', '==', type),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreTransaction[];
    } catch (error) {
      console.error('Error fetching transactions by type:', error);
      throw new Error('Failed to fetch transactions by type');
    }
  },

  // Update a transaction
  async updateTransaction(id: string, updates: Partial<FirestoreTransaction>): Promise<void> {
    try {
      const transactionRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(transactionRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw new Error('Failed to update transaction');
    }
  },

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error('Failed to delete transaction');
    }
  },

  // Get transactions for a specific date range
  async getTransactionsByDateRange(
    organizationId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<FirestoreTransaction[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreTransaction[];
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw new Error('Failed to fetch transactions by date range');
    }
  }
};

export default transactionService;