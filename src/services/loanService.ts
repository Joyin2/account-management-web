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

// Loan Interface
export interface Loan {
  id?: string;
  loanName: string;
  loanType: 'PERSONAL' | 'BUSINESS' | 'HOME' | 'CAR' | 'EDUCATION' | 'OTHER';
  principalAmount: number;
  interestRate: number; // Annual percentage rate
  tenure: number; // In months
  emiAmount: number;
  startDate: Timestamp;
  endDate: Timestamp;
  lenderName: string;
  lenderContact?: string;
  accountNumber?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'CLOSED';
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Calculated fields
  totalInterest: number;
  totalAmount: number;
  outstandingBalance: number;
  nextDueDate: Timestamp;
  // Additional fields
  purpose?: string;
  collateral?: string;
  guarantor?: string;
  notes?: string;
}

// Loan Payment Interface
export interface LoanPayment {
  id?: string;
  loanId: string;
  paymentDate: Timestamp;
  dueDate: Timestamp;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  outstandingBalance: number;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  actualAmountPaid?: number;
  paymentMethod?: string;
  transactionReference?: string;
  lateFee?: number;
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Additional fields
  notes?: string;
  receiptNumber?: string;
}

// Loan Schedule Interface
export interface LoanSchedule {
  installmentNumber: number;
  dueDate: Timestamp;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  outstandingBalance: number;
  isPaid: boolean;
  paymentId?: string;
}

const LOANS_COLLECTION = 'loans';
const LOAN_PAYMENTS_COLLECTION = 'loanPayments';

export const loanService = {
  // Loan Management
  async createLoan(loanData: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'totalInterest' | 'totalAmount' | 'outstandingBalance' | 'nextDueDate' | 'emiAmount' | 'endDate' | 'status'>): Promise<string> {
    try {
      const now = Timestamp.now();
      
      // Calculate loan details
      const monthlyRate = loanData.interestRate / 100 / 12;
      const emiAmount = this.calculateEMI(loanData.principalAmount, monthlyRate, loanData.tenure);
      const totalAmount = emiAmount * loanData.tenure;
      const totalInterest = totalAmount - loanData.principalAmount;
      
      // Calculate end date
      const endDate = new Date(loanData.startDate.toDate());
      endDate.setMonth(endDate.getMonth() + loanData.tenure);
      
      // Calculate next due date (first EMI date)
      const nextDueDate = new Date(loanData.startDate.toDate());
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      
      const loan: Omit<Loan, 'id'> = {
        ...loanData,
        emiAmount,
        endDate: Timestamp.fromDate(endDate),
        totalInterest,
        totalAmount,
        outstandingBalance: loanData.principalAmount,
        nextDueDate: Timestamp.fromDate(nextDueDate),
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, LOANS_COLLECTION), loan);
      
      // Generate payment schedule
      await this.generatePaymentSchedule(docRef.id, loan);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating loan:', error);
      throw new Error('Failed to create loan');
    }
  },

  async updateLoan(loanId: string, updates: Partial<Loan>): Promise<void> {
    try {
      const loanRef = doc(db, LOANS_COLLECTION, loanId);
      await updateDoc(loanRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating loan:', error);
      throw new Error('Failed to update loan');
    }
  },

  async deleteLoan(loanId: string): Promise<void> {
    try {
      const loanRef = doc(db, LOANS_COLLECTION, loanId);
      await deleteDoc(loanRef);
      
      // Delete associated payments
      const paymentsQuery = query(
        collection(db, LOAN_PAYMENTS_COLLECTION),
        where('loanId', '==', loanId)
      );
      const paymentsSnapshot = await getDocs(paymentsQuery);
      
      const deletePromises = paymentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting loan:', error);
      throw new Error('Failed to delete loan');
    }
  },

  async getLoans(userId: string): Promise<Loan[]> {
    try {
      const q = query(
        collection(db, LOANS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Loan));
    } catch (error) {
      console.error('Error fetching loans:', error);
      throw new Error('Failed to fetch loans');
    }
  },

  async getLoan(loanId: string): Promise<Loan | null> {
    try {
      const loanRef = doc(db, LOANS_COLLECTION, loanId);
      const loanSnap = await getDoc(loanRef);
      
      if (loanSnap.exists()) {
        return {
          id: loanSnap.id,
          ...loanSnap.data()
        } as Loan;
      }
      return null;
    } catch (error) {
      console.error('Error fetching loan:', error);
      throw new Error('Failed to fetch loan');
    }
  },

  // Payment Management
  async recordPayment(paymentData: Omit<LoanPayment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const payment: Omit<LoanPayment, 'id'> = {
        ...paymentData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, LOAN_PAYMENTS_COLLECTION), payment);
      
      // Update loan outstanding balance and next due date
      const loan = await this.getLoan(paymentData.loanId);
      if (loan) {
        const newOutstandingBalance = paymentData.outstandingBalance;
        const nextDueDate = new Date(paymentData.dueDate.toDate());
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        
        await this.updateLoan(paymentData.loanId, {
          outstandingBalance: newOutstandingBalance,
          nextDueDate: Timestamp.fromDate(nextDueDate),
          status: newOutstandingBalance <= 0 ? 'COMPLETED' : 'ACTIVE'
        });
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error recording payment:', error);
      throw new Error('Failed to record payment');
    }
  },

  async getPayments(loanId: string): Promise<LoanPayment[]> {
    try {
      const q = query(
        collection(db, LOAN_PAYMENTS_COLLECTION),
        where('loanId', '==', loanId),
        orderBy('dueDate', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LoanPayment));
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new Error('Failed to fetch payments');
    }
  },

  // Utility Functions
  calculateEMI(principal: number, monthlyRate: number, tenure: number): number {
    if (monthlyRate === 0) {
      return principal / tenure;
    }
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                 (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi * 100) / 100;
  },

  async generatePaymentSchedule(loanId: string, loan: Omit<Loan, 'id'>): Promise<void> {
    try {
      const monthlyRate = loan.interestRate / 100 / 12;
      let outstandingBalance = loan.principalAmount;
      const payments: Omit<LoanPayment, 'id'>[] = [];
      
      for (let i = 1; i <= loan.tenure; i++) {
        const dueDate = new Date(loan.startDate.toDate());
        dueDate.setMonth(dueDate.getMonth() + i);
        
        const interestAmount = outstandingBalance * monthlyRate;
        const principalAmount = loan.emiAmount - interestAmount;
        outstandingBalance = Math.max(0, outstandingBalance - principalAmount);
        
        const payment: Omit<LoanPayment, 'id'> = {
          loanId,
          paymentDate: Timestamp.fromDate(dueDate),
          dueDate: Timestamp.fromDate(dueDate),
          emiAmount: loan.emiAmount,
          principalAmount: Math.round(principalAmount * 100) / 100,
          interestAmount: Math.round(interestAmount * 100) / 100,
          outstandingBalance: Math.round(outstandingBalance * 100) / 100,
          paymentStatus: 'PENDING',
          userId: loan.userId,
          organizationId: loan.organizationId,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        payments.push(payment);
      }
      
      // Batch create payments
      const promises = payments.map(payment => 
        addDoc(collection(db, LOAN_PAYMENTS_COLLECTION), payment)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Error generating payment schedule:', error);
      throw new Error('Failed to generate payment schedule');
    }
  },

  async getLoanSchedule(loanId: string): Promise<LoanSchedule[]> {
    try {
      const payments = await this.getPayments(loanId);
      
      return payments.map((payment, index) => ({
        installmentNumber: index + 1,
        dueDate: payment.dueDate,
        emiAmount: payment.emiAmount,
        principalAmount: payment.principalAmount,
        interestAmount: payment.interestAmount,
        outstandingBalance: payment.outstandingBalance,
        isPaid: payment.paymentStatus === 'PAID',
        paymentId: payment.id
      }));
    } catch (error) {
      console.error('Error fetching loan schedule:', error);
      throw new Error('Failed to fetch loan schedule');
    }
  },

  // Analytics
  async getLoanSummary(userId: string): Promise<{
    totalLoans: number;
    activeLoans: number;
    totalOutstanding: number;
    monthlyEMI: number;
    completedLoans: number;
  }> {
    try {
      const loans = await this.getLoans(userId);
      
      const totalLoans = loans.length;
      const activeLoans = loans.filter(loan => loan.status === 'ACTIVE').length;
      const completedLoans = loans.filter(loan => loan.status === 'COMPLETED').length;
      const totalOutstanding = loans
        .filter(loan => loan.status === 'ACTIVE')
        .reduce((sum, loan) => sum + loan.outstandingBalance, 0);
      const monthlyEMI = loans
        .filter(loan => loan.status === 'ACTIVE')
        .reduce((sum, loan) => sum + loan.emiAmount, 0);
      
      return {
        totalLoans,
        activeLoans,
        totalOutstanding,
        monthlyEMI,
        completedLoans
      };
    } catch (error) {
      console.error('Error calculating loan summary:', error);
      throw new Error('Failed to calculate loan summary');
    }
  }
};
