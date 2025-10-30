import { Account, JournalEntry, JournalEntryLine } from '@/services/doubleEntryService';

// Report generation utilities for double-entry accounting
export interface AccountingReportData {
  organizationName: string;
  reportDate: string;
  reportType: string;
  accounts: Account[];
  journalEntries: JournalEntry[];
  journalLines: JournalEntryLine[];
}

export interface TrialBalanceData {
  accounts: Array<{
    accountCode: string;
    accountName: string;
    accountType: string;
    debitBalance: number;
    creditBalance: number;
  }>;
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
}

export interface IncomeStatementData {
  revenue: Array<{ accountName: string; amount: number }>;
  expenses: Array<{ accountName: string; amount: number }>;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
}

export interface BalanceSheetData {
  assets: {
    currentAssets: Array<{ accountName: string; amount: number }>;
    fixedAssets: Array<{ accountName: string; amount: number }>;
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: Array<{ accountName: string; amount: number }>;
    longTermLiabilities: Array<{ accountName: string; amount: number }>;
    totalLiabilities: number;
  };
  equity: Array<{ accountName: string; amount: number }>;
  totalEquity: number;
}

export const accountingReports = {
  // Generate comprehensive accounting report
  generateComprehensiveReport(data: AccountingReportData): string {
    const report = `
COMPREHENSIVE DOUBLE-ENTRY ACCOUNTING REPORT
============================================

Organization: ${data.organizationName}
Report Date: ${data.reportDate}
Report Type: ${data.reportType}

CHART OF ACCOUNTS
=================
${this.generateChartOfAccountsText(data.accounts)}

JOURNAL ENTRIES
===============
${this.generateJournalEntriesText(data.journalEntries, data.journalLines)}

TRIAL BALANCE
=============
${this.generateTrialBalanceText(data.accounts)}

FINANCIAL STATEMENTS
====================
${this.generateFinancialStatementsText(data.accounts)}

ACCOUNTING PRINCIPLES APPLIED
=============================
1. Double-Entry Bookkeeping: Every transaction affects at least two accounts
2. Accounting Equation: Assets = Liabilities + Equity
3. Debit/Credit Rules:
   - Assets & Expenses: Debit increases, Credit decreases
   - Liabilities, Equity & Revenue: Credit increases, Debit decreases
4. Trial Balance: Total Debits = Total Credits
5. Accrual Accounting: Transactions recorded when they occur

AUDIT TRAIL
===========
All transactions are recorded with:
- Unique journal entry numbers
- Date and time stamps
- User identification
- Reference documentation
- Balanced debit/credit entries

Generated on: ${new Date().toLocaleString()}
    `.trim();

    return report;
  },

  // Generate Chart of Accounts text
  generateChartOfAccountsText(accounts: Account[]): string {
    const groupedAccounts = accounts.reduce((groups, account) => {
      if (!groups[account.accountType]) {
        groups[account.accountType] = [];
      }
      groups[account.accountType].push(account);
      return groups;
    }, {} as Record<string, Account[]>);

    let text = '';
    const accountTypes = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];

    accountTypes.forEach(type => {
      if (groupedAccounts[type]) {
        text += `\n${type}S:\n`;
        text += '-'.repeat(type.length + 2) + '\n';
        
        groupedAccounts[type].forEach(account => {
          const balance = account.currentBalance;
          const formattedBalance = balance >= 0 ? 
            `₹${balance.toLocaleString()}` : 
            `(₹${Math.abs(balance).toLocaleString()})`;
          
          text += `${account.accountCode.padEnd(6)} ${account.accountName.padEnd(30)} ${formattedBalance.padStart(15)} ${account.normalBalance}\n`;
        });
        text += '\n';
      }
    });

    return text;
  },

  // Generate Journal Entries text
  generateJournalEntriesText(entries: JournalEntry[], lines: JournalEntryLine[]): string {
    let text = '';

    entries.forEach(entry => {
      const entryLines = lines.filter(line => line.journalEntryId === entry.id);
      
      text += `\nEntry: ${entry.entryNumber}\n`;
      text += `Date: ${entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A'}\n`;
      text += `Description: ${entry.description}\n`;
      text += `Reference: ${entry.reference}\n`;
      text += `Status: ${entry.status}\n`;
      text += '-'.repeat(80) + '\n';
      text += 'Account'.padEnd(25) + 'Description'.padEnd(25) + 'Debit'.padStart(12) + 'Credit'.padStart(12) + '\n';
      text += '-'.repeat(80) + '\n';

      entryLines.forEach(line => {
        const debit = line.debitAmount > 0 ? `₹${line.debitAmount.toLocaleString()}` : '';
        const credit = line.creditAmount > 0 ? `₹${line.creditAmount.toLocaleString()}` : '';
        
        text += `${line.accountName.padEnd(25)} ${line.description.padEnd(25)} ${debit.padStart(12)} ${credit.padStart(12)}\n`;
      });

      text += '-'.repeat(80) + '\n';
      text += `${'TOTALS:'.padEnd(50)} ${'₹' + entry.totalDebits.toLocaleString().padStart(11)} ${'₹' + entry.totalCredits.toLocaleString().padStart(11)}\n`;
      text += `Balanced: ${entry.isBalanced ? 'YES' : 'NO'}\n\n`;
    });

    return text;
  },

  // Generate Trial Balance text
  generateTrialBalanceText(accounts: Account[]): string {
    let text = '';
    let totalDebits = 0;
    let totalCredits = 0;

    text += 'Account Code'.padEnd(12) + 'Account Name'.padEnd(30) + 'Debit Balance'.padStart(15) + 'Credit Balance'.padStart(15) + '\n';
    text += '-'.repeat(72) + '\n';

    accounts.forEach(account => {
      const balance = account.currentBalance;
      let debitBalance = 0;
      let creditBalance = 0;

      if (account.normalBalance === 'DEBIT') {
        debitBalance = balance >= 0 ? balance : 0;
        creditBalance = balance < 0 ? Math.abs(balance) : 0;
      } else {
        creditBalance = balance >= 0 ? balance : 0;
        debitBalance = balance < 0 ? Math.abs(balance) : 0;
      }

      totalDebits += debitBalance;
      totalCredits += creditBalance;

      const debitText = debitBalance > 0 ? `₹${debitBalance.toLocaleString()}` : '';
      const creditText = creditBalance > 0 ? `₹${creditBalance.toLocaleString()}` : '';

      text += `${account.accountCode.padEnd(12)} ${account.accountName.padEnd(30)} ${debitText.padStart(15)} ${creditText.padStart(15)}\n`;
    });

    text += '-'.repeat(72) + '\n';
    text += `${'TOTALS:'.padEnd(42)} ${'₹' + totalDebits.toLocaleString().padStart(14)} ${'₹' + totalCredits.toLocaleString().padStart(14)}\n`;
    text += `\nTrial Balance is ${Math.abs(totalDebits - totalCredits) < 0.01 ? 'BALANCED' : 'OUT OF BALANCE'}\n`;
    
    if (Math.abs(totalDebits - totalCredits) >= 0.01) {
      text += `Difference: ₹${Math.abs(totalDebits - totalCredits).toLocaleString()}\n`;
    }

    return text;
  },

  // Generate Financial Statements text
  generateFinancialStatementsText(accounts: Account[]): string {
    let text = '';

    // Income Statement
    text += '\nINCOME STATEMENT\n';
    text += '================\n';

    const revenueAccounts = accounts.filter(acc => acc.accountType === 'REVENUE');
    const expenseAccounts = accounts.filter(acc => acc.accountType === 'EXPENSE');

    text += '\nREVENUE:\n';
    let totalRevenue = 0;
    revenueAccounts.forEach(account => {
      const amount = account.currentBalance;
      totalRevenue += amount;
      text += `  ${account.accountName.padEnd(30)} ₹${amount.toLocaleString().padStart(12)}\n`;
    });
    text += `  ${'Total Revenue:'.padEnd(30)} ₹${totalRevenue.toLocaleString().padStart(12)}\n\n`;

    text += 'EXPENSES:\n';
    let totalExpenses = 0;
    expenseAccounts.forEach(account => {
      const amount = account.currentBalance;
      totalExpenses += amount;
      text += `  ${account.accountName.padEnd(30)} ₹${amount.toLocaleString().padStart(12)}\n`;
    });
    text += `  ${'Total Expenses:'.padEnd(30)} ₹${totalExpenses.toLocaleString().padStart(12)}\n\n`;

    const netIncome = totalRevenue - totalExpenses;
    text += `${'NET INCOME:'.padEnd(30)} ₹${netIncome.toLocaleString().padStart(12)}\n\n`;

    // Balance Sheet
    text += 'BALANCE SHEET\n';
    text += '=============\n';

    const assetAccounts = accounts.filter(acc => acc.accountType === 'ASSET');
    const liabilityAccounts = accounts.filter(acc => acc.accountType === 'LIABILITY');
    const equityAccounts = accounts.filter(acc => acc.accountType === 'EQUITY');

    text += '\nASSETS:\n';
    let totalAssets = 0;
    assetAccounts.forEach(account => {
      const amount = account.currentBalance;
      totalAssets += amount;
      text += `  ${account.accountName.padEnd(30)} ₹${amount.toLocaleString().padStart(12)}\n`;
    });
    text += `  ${'Total Assets:'.padEnd(30)} ₹${totalAssets.toLocaleString().padStart(12)}\n\n`;

    text += 'LIABILITIES:\n';
    let totalLiabilities = 0;
    liabilityAccounts.forEach(account => {
      const amount = account.currentBalance;
      totalLiabilities += amount;
      text += `  ${account.accountName.padEnd(30)} ₹${amount.toLocaleString().padStart(12)}\n`;
    });
    text += `  ${'Total Liabilities:'.padEnd(30)} ₹${totalLiabilities.toLocaleString().padStart(12)}\n\n`;

    text += 'EQUITY:\n';
    let totalEquity = 0;
    equityAccounts.forEach(account => {
      const amount = account.currentBalance;
      totalEquity += amount;
      text += `  ${account.accountName.padEnd(30)} ₹${amount.toLocaleString().padStart(12)}\n`;
    });
    // Add net income to equity
    totalEquity += netIncome;
    text += `  ${'Net Income (Current Period):'.padEnd(30)} ₹${netIncome.toLocaleString().padStart(12)}\n`;
    text += `  ${'Total Equity:'.padEnd(30)} ₹${totalEquity.toLocaleString().padStart(12)}\n\n`;

    text += `${'TOTAL LIABILITIES & EQUITY:'.padEnd(30)} ₹${(totalLiabilities + totalEquity).toLocaleString().padStart(12)}\n\n`;

    // Balance check
    const balanceCheck = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;
    text += `Balance Sheet is ${balanceCheck ? 'BALANCED' : 'OUT OF BALANCE'}\n`;
    if (!balanceCheck) {
      text += `Difference: ₹${Math.abs(totalAssets - (totalLiabilities + totalEquity)).toLocaleString()}\n`;
    }

    return text;
  },

  // Download report as text file
  downloadReport(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Generate CSV for trial balance
  generateTrialBalanceCSV(accounts: Account[]): string {
    let csv = 'Account Code,Account Name,Account Type,Debit Balance,Credit Balance\n';
    
    accounts.forEach(account => {
      const balance = account.currentBalance;
      let debitBalance = 0;
      let creditBalance = 0;

      if (account.normalBalance === 'DEBIT') {
        debitBalance = balance >= 0 ? balance : 0;
        creditBalance = balance < 0 ? Math.abs(balance) : 0;
      } else {
        creditBalance = balance >= 0 ? balance : 0;
        debitBalance = balance < 0 ? Math.abs(balance) : 0;
      }

      csv += `${account.accountCode},"${account.accountName}",${account.accountType},${debitBalance},${creditBalance}\n`;
    });

    return csv;
  },

  // Generate CSV for journal entries
  generateJournalEntriesCSV(entries: JournalEntry[], lines: JournalEntryLine[]): string {
    let csv = 'Entry Number,Date,Description,Reference,Account Code,Account Name,Debit Amount,Credit Amount,Line Description\n';

    entries.forEach(entry => {
      const entryLines = lines.filter(line => line.journalEntryId === entry.id);

      entryLines.forEach(line => {
        const date = entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A';
        csv += `${entry.entryNumber},"${date}","${entry.description}","${entry.reference}",${line.accountCode},"${line.accountName}",${line.debitAmount},${line.creditAmount},"${line.description}"\n`;
      });
    });

    return csv;
  },

  // Generate CSV for chart of accounts
  generateChartOfAccountsCSV(accounts: Account[]): string {
    let csv = 'Account Code,Account Name,Account Type,Sub Type,Normal Balance,Current Balance,Description\n';

    accounts.forEach(account => {
      csv += `${account.accountCode},"${account.accountName}",${account.accountType},"${account.subType}",${account.normalBalance},${account.currentBalance},"${account.description || ''}"\n`;
    });

    return csv;
  },

  // Generate Income Statement CSV
  generateIncomeStatementCSV(revenueAccounts: Account[], expenseAccounts: Account[]): string {
    let csv = 'Statement,Account Code,Account Name,Amount\n';

    // Revenue section
    csv += 'REVENUE SECTION\n';
    revenueAccounts.forEach(account => {
      csv += `Revenue,${account.accountCode},"${account.accountName}",${account.currentBalance}\n`;
    });

    const totalRevenue = revenueAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    csv += `Revenue Total,,,${totalRevenue}\n\n`;

    // Expense section
    csv += 'EXPENSE SECTION\n';
    expenseAccounts.forEach(account => {
      csv += `Expense,${account.accountCode},"${account.accountName}",${account.currentBalance}\n`;
    });

    const totalExpenses = expenseAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    csv += `Expense Total,,,${totalExpenses}\n\n`;

    const netIncome = totalRevenue - totalExpenses;
    csv += `Net Income,,,${netIncome}\n`;

    return csv;
  },

  // Generate Balance Sheet CSV
  generateBalanceSheetCSV(accounts: Account[]): string {
    let csv = 'Statement Section,Account Code,Account Name,Amount\n';

    const assetAccounts = accounts.filter(acc => acc.accountType === 'ASSET');
    const liabilityAccounts = accounts.filter(acc => acc.accountType === 'LIABILITY');
    const equityAccounts = accounts.filter(acc => acc.accountType === 'EQUITY');

    // Assets section
    csv += 'ASSETS\n';
    assetAccounts.forEach(account => {
      csv += `Asset,${account.accountCode},"${account.accountName}",${account.currentBalance}\n`;
    });
    const totalAssets = assetAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    csv += `Total Assets,,,${totalAssets}\n\n`;

    // Liabilities section
    csv += 'LIABILITIES\n';
    liabilityAccounts.forEach(account => {
      csv += `Liability,${account.accountCode},"${account.accountName}",${account.currentBalance}\n`;
    });
    const totalLiabilities = liabilityAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    csv += `Total Liabilities,,,${totalLiabilities}\n\n`;

    // Equity section
    csv += 'EQUITY\n';
    equityAccounts.forEach(account => {
      csv += `Equity,${account.accountCode},"${account.accountName}",${account.currentBalance}\n`;
    });
    const totalEquity = equityAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    csv += `Total Equity,,,${totalEquity}\n\n`;

    csv += `Total Liabilities and Equity,,,${totalLiabilities + totalEquity}\n`;

    return csv;
  },

  // Download file utility
  downloadFile(content: string, filename: string, contentType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Generate and download comprehensive accounting package
  downloadAccountingPackage(data: AccountingReportData): void {
    const timestamp = new Date().toISOString().split('T')[0];

    // Generate comprehensive text report
    const textReport = this.generateComprehensiveReport(data);
    this.downloadFile(textReport, `accounting-report-${timestamp}.txt`, 'text/plain');

    // Generate CSV files
    setTimeout(() => {
      const chartCSV = this.generateChartOfAccountsCSV(data.accounts);
      this.downloadFile(chartCSV, `chart-of-accounts-${timestamp}.csv`, 'text/csv');
    }, 500);

    setTimeout(() => {
      const journalCSV = this.generateJournalEntriesCSV(data.journalEntries, data.journalLines);
      this.downloadFile(journalCSV, `journal-entries-${timestamp}.csv`, 'text/csv');
    }, 1000);

    setTimeout(() => {
      const trialBalanceCSV = this.generateTrialBalanceCSV(data.accounts);
      this.downloadFile(trialBalanceCSV, `trial-balance-${timestamp}.csv`, 'text/csv');
    }, 1500);

    setTimeout(() => {
      const revenueAccounts = data.accounts.filter(acc => acc.accountType === 'REVENUE');
      const expenseAccounts = data.accounts.filter(acc => acc.accountType === 'EXPENSE');
      const incomeStatementCSV = this.generateIncomeStatementCSV(revenueAccounts, expenseAccounts);
      this.downloadFile(incomeStatementCSV, `income-statement-${timestamp}.csv`, 'text/csv');
    }, 2000);

    setTimeout(() => {
      const balanceSheetCSV = this.generateBalanceSheetCSV(data.accounts);
      this.downloadFile(balanceSheetCSV, `balance-sheet-${timestamp}.csv`, 'text/csv');
    }, 2500);
  }
};
