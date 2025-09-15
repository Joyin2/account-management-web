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

// Partner/Owner Interface
export interface Partner {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  partnerType: 'OWNER' | 'PARTNER' | 'INVESTOR' | 'SHAREHOLDER';
  joinDate: Timestamp;
  isActive: boolean;
  equityPercentage: number;
  initialCapital: number;
  currentCapitalBalance: number;
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Additional fields
  panNumber?: string;
  aadharNumber?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  notes?: string;
}

// Equity Transaction Interface
export interface EquityTransaction {
  id?: string;
  partnerId: string;
  transactionType: 'CAPITAL_CONTRIBUTION' | 'CAPITAL_WITHDRAWAL' | 'PROFIT_DISTRIBUTION' | 'LOSS_ALLOCATION' | 'EQUITY_ADJUSTMENT';
  amount: number;
  description: string;
  date: Timestamp;
  reference?: string;
  approvedBy?: string;
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Additional fields
  documentReference?: string;
  notes?: string;
  isApproved: boolean;
  approvalDate?: Timestamp;
}

// Capital Account Interface
export interface CapitalAccount {
  id?: string;
  partnerId: string;
  openingBalance: number;
  currentBalance: number;
  totalContributions: number;
  totalWithdrawals: number;
  totalProfitShare: number;
  totalLossShare: number;
  lastTransactionDate: Timestamp;
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Profit/Loss Allocation Interface
export interface ProfitLossAllocation {
  id?: string;
  period: {
    from: Timestamp;
    to: Timestamp;
  };
  totalProfit: number;
  totalLoss: number;
  allocations: {
    partnerId: string;
    partnerName: string;
    equityPercentage: number;
    profitShare: number;
    lossShare: number;
  }[];
  allocationDate: Timestamp;
  isFinalized: boolean;
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const PARTNERS_COLLECTION = 'partners';
const EQUITY_TRANSACTIONS_COLLECTION = 'equityTransactions';
const CAPITAL_ACCOUNTS_COLLECTION = 'capitalAccounts';
const PROFIT_LOSS_ALLOCATIONS_COLLECTION = 'profitLossAllocations';

export const equityService = {
  // Partner Management
  async createPartner(partnerData: Omit<Partner, 'id' | 'createdAt' | 'updatedAt' | 'currentCapitalBalance'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const partner: Omit<Partner, 'id'> = {
        ...partnerData,
        currentCapitalBalance: partnerData.initialCapital,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, PARTNERS_COLLECTION), partner);
      
      // Create initial capital account
      await this.createCapitalAccount(docRef.id, partnerData.initialCapital, partnerData.userId, partnerData.organizationId);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating partner:', error);
      throw new Error('Failed to create partner');
    }
  },

  async updatePartner(partnerId: string, updates: Partial<Partner>): Promise<void> {
    try {
      const partnerRef = doc(db, PARTNERS_COLLECTION, partnerId);
      await updateDoc(partnerRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating partner:', error);
      throw new Error('Failed to update partner');
    }
  },

  async deletePartner(partnerId: string): Promise<void> {
    try {
      const partnerRef = doc(db, PARTNERS_COLLECTION, partnerId);
      await deleteDoc(partnerRef);
      
      // Delete associated capital account
      const capitalAccountQuery = query(
        collection(db, CAPITAL_ACCOUNTS_COLLECTION),
        where('partnerId', '==', partnerId)
      );
      const capitalAccountSnapshot = await getDocs(capitalAccountQuery);
      
      const deletePromises = capitalAccountSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting partner:', error);
      throw new Error('Failed to delete partner');
    }
  },

  async getPartners(userId: string): Promise<Partner[]> {
    try {
      const q = query(
        collection(db, PARTNERS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Partner));
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw new Error('Failed to fetch partners');
    }
  },

  async getPartner(partnerId: string): Promise<Partner | null> {
    try {
      const partnerRef = doc(db, PARTNERS_COLLECTION, partnerId);
      const partnerSnap = await getDoc(partnerRef);
      
      if (partnerSnap.exists()) {
        return {
          id: partnerSnap.id,
          ...partnerSnap.data()
        } as Partner;
      }
      return null;
    } catch (error) {
      console.error('Error fetching partner:', error);
      throw new Error('Failed to fetch partner');
    }
  },

  // Equity Transaction Management
  async createEquityTransaction(transactionData: Omit<EquityTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const transaction: Omit<EquityTransaction, 'id'> = {
        ...transactionData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, EQUITY_TRANSACTIONS_COLLECTION), transaction);
      
      // Update partner's capital balance
      await this.updatePartnerCapitalBalance(transactionData.partnerId, transactionData.amount, transactionData.transactionType);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating equity transaction:', error);
      throw new Error('Failed to create equity transaction');
    }
  },

  async getEquityTransactions(partnerId?: string, userId?: string): Promise<EquityTransaction[]> {
    try {
      let q = query(collection(db, EQUITY_TRANSACTIONS_COLLECTION));
      
      if (partnerId) {
        q = query(q, where('partnerId', '==', partnerId));
      }
      
      if (userId) {
        q = query(q, where('userId', '==', userId));
      }
      
      q = query(q, orderBy('date', 'desc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EquityTransaction));
    } catch (error) {
      console.error('Error fetching equity transactions:', error);
      throw new Error('Failed to fetch equity transactions');
    }
  },

  // Capital Account Management
  async createCapitalAccount(partnerId: string, initialBalance: number, userId: string, organizationId: string): Promise<string> {
    try {
      const now = Timestamp.now();
      const capitalAccount: Omit<CapitalAccount, 'id'> = {
        partnerId,
        openingBalance: initialBalance,
        currentBalance: initialBalance,
        totalContributions: initialBalance,
        totalWithdrawals: 0,
        totalProfitShare: 0,
        totalLossShare: 0,
        lastTransactionDate: now,
        userId,
        organizationId,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, CAPITAL_ACCOUNTS_COLLECTION), capitalAccount);
      return docRef.id;
    } catch (error) {
      console.error('Error creating capital account:', error);
      throw new Error('Failed to create capital account');
    }
  },

  async getCapitalAccount(partnerId: string): Promise<CapitalAccount | null> {
    try {
      const q = query(
        collection(db, CAPITAL_ACCOUNTS_COLLECTION),
        where('partnerId', '==', partnerId)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as CapitalAccount;
      }
      return null;
    } catch (error) {
      console.error('Error fetching capital account:', error);
      throw new Error('Failed to fetch capital account');
    }
  },

  async updatePartnerCapitalBalance(partnerId: string, amount: number, transactionType: string): Promise<void> {
    try {
      const partner = await this.getPartner(partnerId);
      const capitalAccount = await this.getCapitalAccount(partnerId);
      
      if (!partner || !capitalAccount) {
        throw new Error('Partner or capital account not found');
      }
      
      let newBalance = partner.currentCapitalBalance;
      let updates: Partial<CapitalAccount> = {
        lastTransactionDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      switch (transactionType) {
        case 'CAPITAL_CONTRIBUTION':
          newBalance += amount;
          updates.totalContributions = capitalAccount.totalContributions + amount;
          break;
        case 'CAPITAL_WITHDRAWAL':
          newBalance -= amount;
          updates.totalWithdrawals = capitalAccount.totalWithdrawals + amount;
          break;
        case 'PROFIT_DISTRIBUTION':
          newBalance += amount;
          updates.totalProfitShare = capitalAccount.totalProfitShare + amount;
          break;
        case 'LOSS_ALLOCATION':
          newBalance -= amount;
          updates.totalLossShare = capitalAccount.totalLossShare + amount;
          break;
      }
      
      updates.currentBalance = newBalance;
      
      // Update partner balance
      await this.updatePartner(partnerId, { currentCapitalBalance: newBalance });
      
      // Update capital account
      const capitalAccountRef = doc(db, CAPITAL_ACCOUNTS_COLLECTION, capitalAccount.id!);
      await updateDoc(capitalAccountRef, updates);
    } catch (error) {
      console.error('Error updating partner capital balance:', error);
      throw new Error('Failed to update partner capital balance');
    }
  },

  // Profit/Loss Allocation
  async allocateProfitLoss(
    period: { from: Timestamp; to: Timestamp },
    totalProfit: number,
    totalLoss: number,
    userId: string,
    organizationId: string
  ): Promise<string> {
    try {
      const partners = await this.getPartners(userId);
      const activePartners = partners.filter(p => p.isActive);
      
      const allocations = activePartners.map(partner => {
        const profitShare = (totalProfit * partner.equityPercentage) / 100;
        const lossShare = (totalLoss * partner.equityPercentage) / 100;
        
        return {
          partnerId: partner.id!,
          partnerName: partner.name,
          equityPercentage: partner.equityPercentage,
          profitShare,
          lossShare
        };
      });
      
      const allocation: Omit<ProfitLossAllocation, 'id'> = {
        period,
        totalProfit,
        totalLoss,
        allocations,
        allocationDate: Timestamp.now(),
        isFinalized: false,
        userId,
        organizationId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, PROFIT_LOSS_ALLOCATIONS_COLLECTION), allocation);
      return docRef.id;
    } catch (error) {
      console.error('Error allocating profit/loss:', error);
      throw new Error('Failed to allocate profit/loss');
    }
  },

  async finalizeAllocation(allocationId: string): Promise<void> {
    try {
      const allocationRef = doc(db, PROFIT_LOSS_ALLOCATIONS_COLLECTION, allocationId);
      const allocationSnap = await getDoc(allocationRef);
      
      if (!allocationSnap.exists()) {
        throw new Error('Allocation not found');
      }
      
      const allocation = allocationSnap.data() as ProfitLossAllocation;
      
      // Create equity transactions for each partner
      const transactionPromises = allocation.allocations.map(async (alloc) => {
        if (alloc.profitShare > 0) {
          await this.createEquityTransaction({
            partnerId: alloc.partnerId,
            transactionType: 'PROFIT_DISTRIBUTION',
            amount: alloc.profitShare,
            description: `Profit distribution for period ${allocation.period.from.toDate().toDateString()} to ${allocation.period.to.toDate().toDateString()}`,
            date: allocation.allocationDate,
            isApproved: true,
            approvalDate: Timestamp.now(),
            userId: allocation.userId,
            organizationId: allocation.organizationId
          });
        }
        
        if (alloc.lossShare > 0) {
          await this.createEquityTransaction({
            partnerId: alloc.partnerId,
            transactionType: 'LOSS_ALLOCATION',
            amount: alloc.lossShare,
            description: `Loss allocation for period ${allocation.period.from.toDate().toDateString()} to ${allocation.period.to.toDate().toDateString()}`,
            date: allocation.allocationDate,
            isApproved: true,
            approvalDate: Timestamp.now(),
            userId: allocation.userId,
            organizationId: allocation.organizationId
          });
        }
      });
      
      await Promise.all(transactionPromises);
      
      // Mark allocation as finalized
      await updateDoc(allocationRef, {
        isFinalized: true,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error finalizing allocation:', error);
      throw new Error('Failed to finalize allocation');
    }
  },

  // Analytics
  async getEquitySummary(userId: string): Promise<{
    totalPartners: number;
    totalCapital: number;
    totalEquityPercentage: number;
    totalProfitDistributed: number;
    totalLossAllocated: number;
  }> {
    try {
      const partners = await this.getPartners(userId);
      const activePartners = partners.filter(p => p.isActive);
      
      const totalPartners = activePartners.length;
      const totalCapital = activePartners.reduce((sum, p) => sum + p.currentCapitalBalance, 0);
      const totalEquityPercentage = activePartners.reduce((sum, p) => sum + p.equityPercentage, 0);
      
      const transactions = await this.getEquityTransactions(undefined, userId);
      const totalProfitDistributed = transactions
        .filter(t => t.transactionType === 'PROFIT_DISTRIBUTION')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalLossAllocated = transactions
        .filter(t => t.transactionType === 'LOSS_ALLOCATION')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        totalPartners,
        totalCapital,
        totalEquityPercentage,
        totalProfitDistributed,
        totalLossAllocated
      };
    } catch (error) {
      console.error('Error calculating equity summary:', error);
      throw new Error('Failed to calculate equity summary');
    }
  }
};
