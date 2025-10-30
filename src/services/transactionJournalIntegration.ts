import { doubleEntryService, JournalEntryLine } from './doubleEntryService';
import { Transaction } from '@/types/transaction';

// Service to integrate transactions with double-entry journal entries
export const transactionJournalIntegration = {
  
  // Create journal entry from transaction
  async createJournalEntryFromTransaction(transaction: Transaction): Promise<string | null> {
    try {
      // Get accounts for the organization
      const accounts = await doubleEntryService.getAccounts(transaction.organizationId);
      
      // Map transaction to journal entry lines based on transaction type
      const journalLines = await this.mapTransactionToJournalLines(transaction, accounts);
      
      if (journalLines.length === 0) {
        console.warn('No journal lines generated for transaction:', transaction.id);
        return null;
      }
      
      // Generate entry number
      const entryNumber = await doubleEntryService.generateEntryNumber(transaction.organizationId);
      
      // Create journal entry data
      const totalAmount = transaction.amount;
      const journalEntryData = {
        entryNumber,
        date: transaction.date.toDate().toISOString().split('T')[0],
        description: `Auto-generated from transaction: ${transaction.description}`,
        reference: `TXN-${transaction.id}`,
        status: 'POSTED' as const,
        organizationId: transaction.organizationId,
        userId: transaction.userId,
        totalDebits: totalAmount,
        totalCredits: totalAmount,
        isBalanced: true
      };
      
      // Create the journal entry
      const journalEntryId = await doubleEntryService.createJournalEntry(journalEntryData, journalLines);
      
      console.log('Journal entry created successfully:', journalEntryId);
      return journalEntryId;
      
    } catch (error) {
      console.error('Error creating journal entry from transaction:', error);
      throw error;
    }
  },
  
  // Map transaction to journal entry lines
  async mapTransactionToJournalLines(transaction: Transaction, accounts: any[]): Promise<Omit<JournalEntryLine, 'id' | 'journalEntryId' | 'createdAt'>[]> {
    const lines: Omit<JournalEntryLine, 'id' | 'journalEntryId' | 'createdAt'>[] = [];
    
    // Helper function to find account by code or name
    const findAccount = (codeOrName: string) => {
      return accounts.find(acc => 
        acc.accountCode === codeOrName || 
        acc.accountName.toLowerCase().includes(codeOrName.toLowerCase())
      );
    };
    
    switch (transaction.type) {
      case 'SELL': // Sales transaction
        // Debit: Cash/Accounts Receivable
        const cashAccount = findAccount('1000') || findAccount('cash');
        const arAccount = findAccount('1020') || findAccount('receivable');
        const salesAccount = findAccount('4000') || findAccount('sales');
        
        if (cashAccount && salesAccount) {
          // Cash sale
          lines.push({
            accountId: cashAccount.id,
            accountCode: cashAccount.accountCode,
            accountName: cashAccount.accountName,
            debitAmount: transaction.amount,
            creditAmount: 0,
            description: `Cash received from sale - ${transaction.description}`,
            lineNumber: 1,
            organizationId: transaction.organizationId,
            userId: transaction.userId
          });
          
          lines.push({
            accountId: salesAccount.id,
            accountCode: salesAccount.accountCode,
            accountName: salesAccount.accountName,
            debitAmount: 0,
            creditAmount: transaction.amount,
            description: `Sales revenue - ${transaction.description}`,
            lineNumber: 2,
            organizationId: transaction.organizationId,
            userId: transaction.userId
          });
        }
        break;
        
      case 'BUY': // Purchase transaction
        const inventoryAccount = findAccount('1030') || findAccount('inventory');
        const apAccount = findAccount('2000') || findAccount('payable');
        const purchaseCashAccount = findAccount('1000') || findAccount('cash');
        
        if (transaction.sub_type === 'inventory' && inventoryAccount) {
          // Inventory purchase
          lines.push({
            accountId: inventoryAccount.id,
            accountCode: inventoryAccount.accountCode,
            accountName: inventoryAccount.accountName,
            debitAmount: transaction.amount,
            creditAmount: 0,
            description: `Inventory purchase - ${transaction.description}`,
            lineNumber: 1,
            organizationId: transaction.organizationId,
            userId: transaction.userId
          });
          
          // Credit: Cash or Accounts Payable
          const creditAccount = transaction.payment_method === 'Cash' ? purchaseCashAccount : apAccount;
          if (creditAccount) {
            lines.push({
              accountId: creditAccount.id,
              accountCode: creditAccount.accountCode,
              accountName: creditAccount.accountName,
              debitAmount: 0,
              creditAmount: transaction.amount,
              description: `Payment for inventory - ${transaction.description}`,
              lineNumber: 2,
              organizationId: transaction.organizationId,
              userId: transaction.userId
            });
          }
        }
        break;
        
      case 'EXPENDITURE': // Expense transaction
        // Find appropriate expense account
        let expenseAccount = null;
        
        if (transaction.expense_type) {
          // Try to match expense type to account
          if (transaction.expense_type.toLowerCase().includes('rent')) {
            expenseAccount = findAccount('6000') || findAccount('rent');
          } else if (transaction.expense_type.toLowerCase().includes('utilities')) {
            expenseAccount = findAccount('6010') || findAccount('utilities');
          } else if (transaction.expense_type.toLowerCase().includes('salary')) {
            expenseAccount = findAccount('6020') || findAccount('salaries');
          } else {
            // Default to general expense account
            expenseAccount = findAccount('6030') || findAccount('office supplies');
          }
        }
        
        if (!expenseAccount) {
          expenseAccount = findAccount('6030') || accounts.find(acc => acc.accountType === 'EXPENSE');
        }
        
        const expenseCashAccount = findAccount('1000') || findAccount('cash');
        
        if (expenseAccount && expenseCashAccount) {
          lines.push({
            accountId: expenseAccount.id,
            accountCode: expenseAccount.accountCode,
            accountName: expenseAccount.accountName,
            debitAmount: transaction.amount,
            creditAmount: 0,
            description: `Expense - ${transaction.description}`,
            lineNumber: 1,
            organizationId: transaction.organizationId,
            userId: transaction.userId
          });
          
          lines.push({
            accountId: expenseCashAccount.id,
            accountCode: expenseCashAccount.accountCode,
            accountName: expenseCashAccount.accountName,
            debitAmount: 0,
            creditAmount: transaction.amount,
            description: `Cash payment for expense - ${transaction.description}`,
            lineNumber: 2,
            organizationId: transaction.organizationId,
            userId: transaction.userId
          });
        }
        break;
        
      case 'CAPITAL_DRAWINGS': // Capital and drawings
        const capitalAccount = findAccount('3000') || findAccount('capital');
        const drawingsAccount = findAccount('3010') || findAccount('drawings');
        const capitalCashAccount = findAccount('1000') || findAccount('cash');
        
        if (transaction.sub_type === 'capital_investment' && capitalAccount && capitalCashAccount) {
          // Capital investment
          lines.push({
            accountId: capitalCashAccount.id,
            accountCode: capitalCashAccount.accountCode,
            accountName: capitalCashAccount.accountName,
            debitAmount: transaction.amount,
            creditAmount: 0,
            description: `Capital investment - ${transaction.description}`,
            lineNumber: 1,
            organizationId: transaction.organizationId,
            userId: transaction.userId
          });
          
          lines.push({
            accountId: capitalAccount.id,
            accountCode: capitalAccount.accountCode,
            accountName: capitalAccount.accountName,
            debitAmount: 0,
            creditAmount: transaction.amount,
            description: `Owner's capital investment - ${transaction.description}`,
            lineNumber: 2,
            organizationId: transaction.organizationId,
            userId: transaction.userId
          });
        } else if (transaction.sub_type === 'drawings' && drawingsAccount && capitalCashAccount) {
          // Owner's drawings
          lines.push({
            accountId: drawingsAccount.id,
            accountCode: drawingsAccount.accountCode,
            accountName: drawingsAccount.accountName,
            debitAmount: transaction.amount,
            creditAmount: 0,
            description: `Owner's drawings - ${transaction.description}`,
            lineNumber: 1,
            organizationId: transaction.organizationId,
            userId: transaction.userId
          });
          
          lines.push({
            accountId: capitalCashAccount.id,
            accountCode: capitalCashAccount.accountCode,
            accountName: capitalCashAccount.accountName,
            debitAmount: 0,
            creditAmount: transaction.amount,
            description: `Cash withdrawal - ${transaction.description}`,
            lineNumber: 2,
            organizationId: transaction.organizationId,
            userId: transaction.userId
          });
        }
        break;
        
      case 'BANK': // Bank transactions
        const bankAccount = findAccount('1010') || findAccount('bank');
        const bankCashAccount = findAccount('1000') || findAccount('cash');
        
        if (bankAccount && bankCashAccount) {
          if (transaction.transaction_type === 'deposit') {
            // Cash to bank
            lines.push({
              accountId: bankAccount.id,
              accountCode: bankAccount.accountCode,
              accountName: bankAccount.accountName,
              debitAmount: transaction.amount,
              creditAmount: 0,
              description: `Bank deposit - ${transaction.description}`,
              lineNumber: 1,
              organizationId: transaction.organizationId,
              userId: transaction.userId
            });
            
            lines.push({
              accountId: bankCashAccount.id,
              accountCode: bankCashAccount.accountCode,
              accountName: bankCashAccount.accountName,
              debitAmount: 0,
              creditAmount: transaction.amount,
              description: `Cash deposited to bank - ${transaction.description}`,
              lineNumber: 2,
              organizationId: transaction.organizationId,
              userId: transaction.userId
            });
          } else if (transaction.transaction_type === 'withdrawal') {
            // Bank to cash
            lines.push({
              accountId: bankCashAccount.id,
              accountCode: bankCashAccount.accountCode,
              accountName: bankCashAccount.accountName,
              debitAmount: transaction.amount,
              creditAmount: 0,
              description: `Cash withdrawal from bank - ${transaction.description}`,
              lineNumber: 1,
              organizationId: transaction.organizationId,
              userId: transaction.userId
            });
            
            lines.push({
              accountId: bankAccount.id,
              accountCode: bankAccount.accountCode,
              accountName: bankAccount.accountName,
              debitAmount: 0,
              creditAmount: transaction.amount,
              description: `Bank withdrawal - ${transaction.description}`,
              lineNumber: 2,
              organizationId: transaction.organizationId,
              userId: transaction.userId
            });
          }
        }
        break;
        
      case 'LOAN': // Loan transactions
        const loanAccount = findAccount('2020') || findAccount('2500') || findAccount('loan');
        const loanCashAccount = findAccount('1000') || findAccount('cash');
        
        if (loanAccount && loanCashAccount) {
          if (transaction.sub_type === 'loan_received') {
            // Loan received
            lines.push({
              accountId: loanCashAccount.id,
              accountCode: loanCashAccount.accountCode,
              accountName: loanCashAccount.accountName,
              debitAmount: transaction.amount,
              creditAmount: 0,
              description: `Cash received from loan - ${transaction.description}`,
              lineNumber: 1,
              organizationId: transaction.organizationId,
              userId: transaction.userId
            });
            
            lines.push({
              accountId: loanAccount.id,
              accountCode: loanAccount.accountCode,
              accountName: loanAccount.accountName,
              debitAmount: 0,
              creditAmount: transaction.amount,
              description: `Loan liability - ${transaction.description}`,
              lineNumber: 2,
              organizationId: transaction.organizationId,
              userId: transaction.userId
            });
          } else if (transaction.sub_type === 'loan_payment') {
            // Loan payment
            lines.push({
              accountId: loanAccount.id,
              accountCode: loanAccount.accountCode,
              accountName: loanAccount.accountName,
              debitAmount: transaction.amount,
              creditAmount: 0,
              description: `Loan payment - ${transaction.description}`,
              lineNumber: 1,
              organizationId: transaction.organizationId,
              userId: transaction.userId
            });
            
            lines.push({
              accountId: loanCashAccount.id,
              accountCode: loanCashAccount.accountCode,
              accountName: loanCashAccount.accountName,
              debitAmount: 0,
              creditAmount: transaction.amount,
              description: `Cash paid for loan - ${transaction.description}`,
              lineNumber: 2,
              organizationId: transaction.organizationId,
              userId: transaction.userId
            });
          }
        }
        break;
        
      default:
        console.warn('Unsupported transaction type for journal entry:', transaction.type);
        break;
    }
    
    return lines;
  }
};
