import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Bank Account Interface
export interface BankAccount {
  id?: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'CREDIT_CARD';
  balance: number;
  currency: string;
  isActive: boolean;
  openingDate: Timestamp;
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Additional fields
  ifscCode?: string;
  branchName?: string;
  contactNumber?: string;
  description?: string;
}

// Bank Transaction Interface
export interface BankTransaction {
  id?: string;
  accountId: string;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'FEE' | 'INTEREST';
  amount: number;
  balance: number; // Balance after transaction
  description: string;
  reference?: string;
  category?: string;
  date: Timestamp;
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Transfer specific fields
  transferToAccountId?: string;
  transferFromAccountId?: string;
  // Reconciliation fields
  isReconciled: boolean;
  reconciledDate?: Timestamp;
  statementReference?: string;
}

// Bank Statement Import Interface
export interface BankStatement {
  id?: string;
  accountId: string;
  fileName: string;
  importDate: Timestamp;
  statementPeriod: {
    from: Timestamp;
    to: Timestamp;
  };
  totalTransactions: number;
  userId: string;
  organizationId: string;
}

const BANK_ACCOUNTS_COLLECTION = 'bankAccounts';
const BANK_TRANSACTIONS_COLLECTION = 'bankTransactions';
const BANK_STATEMENTS_COLLECTION = 'bankStatements';

export const bankService = {
  // Bank Account Management
  async createAccount(accountData: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const account: Omit<BankAccount, 'id'> = {
        ...accountData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, BANK_ACCOUNTS_COLLECTION), account);
      return docRef.id;
    } catch (error) {
      console.error('Error creating bank account:', error);
      throw new Error('Failed to create bank account');
    }
  },

  async updateAccount(accountId: string, updates: Partial<BankAccount>): Promise<void> {
    try {
      const accountRef = doc(db, BANK_ACCOUNTS_COLLECTION, accountId);
      await updateDoc(accountRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating bank account:', error);
      throw new Error('Failed to update bank account');
    }
  },

  async deleteAccount(accountId: string): Promise<void> {
    try {
      const accountRef = doc(db, BANK_ACCOUNTS_COLLECTION, accountId);
      await deleteDoc(accountRef);
    } catch (error) {
      console.error('Error deleting bank account:', error);
      throw new Error('Failed to delete bank account');
    }
  },

  async getAccounts(userId: string): Promise<BankAccount[]> {
    try {
      const q = query(
        collection(db, BANK_ACCOUNTS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BankAccount));
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      throw new Error('Failed to fetch bank accounts');
    }
  },

  async getAccount(accountId: string): Promise<BankAccount | null> {
    try {
      const accountRef = doc(db, BANK_ACCOUNTS_COLLECTION, accountId);
      const accountSnap = await getDoc(accountRef);
      
      if (accountSnap.exists()) {
        return {
          id: accountSnap.id,
          ...accountSnap.data()
        } as BankAccount;
      }
      return null;
    } catch (error) {
      console.error('Error fetching bank account:', error);
      throw new Error('Failed to fetch bank account');
    }
  },

  // Bank Transaction Management
  async createTransaction(transactionData: Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const transaction: Omit<BankTransaction, 'id'> = {
        ...transactionData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, BANK_TRANSACTIONS_COLLECTION), transaction);
      
      // Update account balance
      await this.updateAccountBalance(transactionData.accountId, transactionData.balance);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating bank transaction:', error);
      throw new Error('Failed to create bank transaction');
    }
  },

  async getTransactions(accountId: string, limit?: number): Promise<BankTransaction[]> {
    try {
      let q = query(
        collection(db, BANK_TRANSACTIONS_COLLECTION),
        where('accountId', '==', accountId),
        orderBy('date', 'desc')
      );
      
      if (limit) {
        q = query(q, orderBy('date', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BankTransaction));
    } catch (error) {
      console.error('Error fetching bank transactions:', error);
      throw new Error('Failed to fetch bank transactions');
    }
  },

  async updateAccountBalance(accountId: string, newBalance: number): Promise<void> {
    try {
      const accountRef = doc(db, BANK_ACCOUNTS_COLLECTION, accountId);
      await updateDoc(accountRef, {
        balance: newBalance,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating account balance:', error);
      throw new Error('Failed to update account balance');
    }
  },

  // Reconciliation
  async reconcileTransaction(transactionId: string, statementReference?: string): Promise<void> {
    try {
      const transactionRef = doc(db, BANK_TRANSACTIONS_COLLECTION, transactionId);
      await updateDoc(transactionRef, {
        isReconciled: true,
        reconciledDate: Timestamp.now(),
        statementReference: statementReference || '',
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error reconciling transaction:', error);
      throw new Error('Failed to reconcile transaction');
    }
  },

  // Transfer between accounts
  async transferFunds(
    fromAccountId: string, 
    toAccountId: string, 
    amount: number, 
    description: string,
    userId: string,
    organizationId: string
  ): Promise<{ fromTransactionId: string; toTransactionId: string }> {
    try {
      const now = Timestamp.now();
      
      // Get current balances
      const fromAccount = await this.getAccount(fromAccountId);
      const toAccount = await this.getAccount(toAccountId);
      
      if (!fromAccount || !toAccount) {
        throw new Error('Account not found');
      }
      
      if (fromAccount.balance < amount) {
        throw new Error('Insufficient funds');
      }
      
      const newFromBalance = fromAccount.balance - amount;
      const newToBalance = toAccount.balance + amount;
      
      // Create withdrawal transaction
      const fromTransaction: Omit<BankTransaction, 'id'> = {
        accountId: fromAccountId,
        transactionType: 'TRANSFER_OUT',
        amount: -amount,
        balance: newFromBalance,
        description: `Transfer to ${toAccount.accountName}: ${description}`,
        transferToAccountId: toAccountId,
        date: now,
        userId,
        organizationId,
        isReconciled: false,
        createdAt: now,
        updatedAt: now
      };
      
      // Create deposit transaction
      const toTransaction: Omit<BankTransaction, 'id'> = {
        accountId: toAccountId,
        transactionType: 'TRANSFER_IN',
        amount: amount,
        balance: newToBalance,
        description: `Transfer from ${fromAccount.accountName}: ${description}`,
        transferFromAccountId: fromAccountId,
        date: now,
        userId,
        organizationId,
        isReconciled: false,
        createdAt: now,
        updatedAt: now
      };
      
      // Execute transactions
      const fromDocRef = await addDoc(collection(db, BANK_TRANSACTIONS_COLLECTION), fromTransaction);
      const toDocRef = await addDoc(collection(db, BANK_TRANSACTIONS_COLLECTION), toTransaction);
      
      // Update balances
      await this.updateAccountBalance(fromAccountId, newFromBalance);
      await this.updateAccountBalance(toAccountId, newToBalance);
      
      return {
        fromTransactionId: fromDocRef.id,
        toTransactionId: toDocRef.id
      };
    } catch (error) {
      console.error('Error transferring funds:', error);
      throw new Error('Failed to transfer funds');
    }
  }
};
