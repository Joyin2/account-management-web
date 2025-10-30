'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Download, Filter, FileText, BarChart3, Calculator, RefreshCw, FileSpreadsheet, Code } from 'lucide-react';
import { motion } from 'framer-motion';
// Using Supabase instead of Firebase
import { supabase } from '@/lib/supabase';
// Using native Date objects instead of Firebase Timestamp
import { useAuth } from '@/contexts/AuthContext';
import { inventoryService, InventoryItem as ServiceInventoryItem } from '@/services/inventoryService';
import { TransactionService } from '@/lib/firestore/transactions';
import { Transaction } from '@/types/transaction';

// Interfaces for report data
interface AccountingEntry {
  id: string;
  date: string;
  description: string;
  accounts: {
    account: string;
    debit: number;
    credit: number;
  }[];
  reference: string;
  type: 'journal' | 'purchase' | 'sale' | 'payment' | 'receipt';
}

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  location: string;
  unit: string;
  totalValue: number;
  lastUpdated: string;
}

interface LedgerEntry {
  account: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

interface TrialBalanceEntry {
  account: string;
  debit: number;
  credit: number;
}

interface BalanceSheetData {
  assets: {
    current: { [key: string]: number };
    fixed: { [key: string]: number };
  };
  liabilities: {
    current: { [key: string]: number };
    longTerm: { [key: string]: number };
  };
  equity: { [key: string]: number };
}

interface ProfitLossData {
  revenue: { [key: string]: number };
  expenses: { [key: string]: number };
  grossProfit: number;
  netProfit: number;
}

interface CashFlowData {
  operating: { [key: string]: number };
  investing: { [key: string]: number };
  financing: { [key: string]: number };
}

interface ReceivablesData {
  customer: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  originalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  daysOverdue: number;
  status: 'Current' | 'Overdue' | 'Paid';
}

interface PayablesData {
  supplier: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  originalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  daysOverdue: number;
  status: 'Current' | 'Overdue' | 'Paid';
}

interface BankTransactionData {
  date: string;
  description: string;
  transactionType: 'Deposit' | 'Withdrawal' | 'Transfer';
  amount: number;
  balance: number;
  reconciled: boolean;
  reference: string;
}

interface LoanData {
  loanAccount: string;
  loanType: string;
  principalAmount: number;
  currentBalance: number;
  interestRate: number;
  emiAmount: number;
  nextDueDate: string;
  paymentsRemaining: number;
  totalInterestPaid: number;
}

interface EquityData {
  account: string;
  openingBalance: number;
  additions: number;
  withdrawals: number;
  closingBalance: number;
  percentage?: number;
}

interface ExpenseCategoryData {
  date: string;
  description: string;
  amount: number;
  category: string;
  subcategory?: string;
  reference: string;
  // Enhanced payment tracking fields
  totalAmount?: number;
  paidAmount?: number;
  outstandingAmount?: number;
  dueDate?: string;
  paymentDate?: string;
  advancePayment?: number;
  paymentStatus?: 'pending' | 'partial' | 'paid' | 'overdue';
  // Detailed information
  tdsAmount?: number;
  tcsAmount?: number;
  providentFund?: {
    employeeContribution?: number;
    employerContribution?: number;
  };
  insurance?: {
    premium?: number;
    coverage?: number;
  };
  salaryBreakdown?: {
    basicSalary?: number;
    hra?: number;
    allowances?: number;
    deductions?: number;
    netSalary?: number;
    employeeId?: string;
    designation?: string;
  };
}

// GST Export Functions
const exportGSTR1Data = (gstReturn: any) => {
  try {
    // GSTR-1 format for outward supplies
    const gstr1Data = {
      gstin: "YOUR_GSTIN_HERE", // Should be fetched from user profile
      ret_period: new Date().toISOString().slice(0, 7).replace('-', ''), // MMYYYY format
      b2b: gstReturn.sales.map((sale: any) => ({
        ctin: sale.gstn || "UNREGISTERED",
        inv: [{
          inum: sale.invoiceNumber,
          idt: sale.date,
          val: sale.totalAmount,
          pos: "07", // Place of supply - should be dynamic
          rchrg: "N",
          inv_typ: "R",
          itms: [{
            num: 1,
            itm_det: {
              txval: sale.amount,
              rt: sale.gstRate,
              iamt: 0,
              camt: sale.gstAmount / 2, // CGST
              samt: sale.gstAmount / 2, // SGST
              csamt: 0
            }
          }]
        }]
      })),
      b2cl: [], // B2C Large (>2.5L)
      b2cs: [], // B2C Small
      cdnr: [], // Credit/Debit Notes
      exp: [], // Exports
      at: [], // Advances
      atadj: [], // Advance Adjustments
      exemp: [], // Exempt supplies
      hsn: [] // HSN summary
    };

    const blob = new Blob([JSON.stringify(gstr1Data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSTR1_${new Date().toISOString().slice(0, 7)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting GSTR-1 data:', error);
    alert('Error exporting GSTR-1 data. Please try again.');
  }
};

const exportGSTR3BData = (gstReturn: any) => {
  try {
    // GSTR-3B format for monthly return
    const gstr3bData = {
      gstin: "YOUR_GSTIN_HERE",
      ret_period: new Date().toISOString().slice(0, 7).replace('-', ''),
      sup_details: {
        osup_det: {
          txval: gstReturn.summary.totalSalesAmount || 0,
          iamt: 0,
          camt: (gstReturn.summary.totalSalesGST || 0) / 2,
          samt: (gstReturn.summary.totalSalesGST || 0) / 2,
          csamt: 0
        },
        osup_zero: { txval: 0, iamt: 0, csamt: 0 },
        osup_nil_exmp: { txval: 0 },
        isup_rev: {
          txval: 0,
          iamt: 0,
          camt: 0,
          samt: 0,
          csamt: 0
        },
        osup_nongst: { txval: 0 }
      },
      inter_sup: {
        unreg_details: [],
        comp_details: [],
        uin_details: []
      },
      itc_elg: {
        itc_avl: [{
          ty: "IMPG",
          iamt: 0,
          camt: (gstReturn.summary.totalPurchasesGST || 0) / 2,
          samt: (gstReturn.summary.totalPurchasesGST || 0) / 2,
          csamt: 0
        }],
        itc_rev: [{
          ty: "RUL",
          iamt: 0,
          camt: 0,
          samt: 0,
          csamt: 0
        }],
        itc_net: {
          iamt: 0,
          camt: (gstReturn.summary.totalPurchasesGST || 0) / 2,
          samt: (gstReturn.summary.totalPurchasesGST || 0) / 2,
          csamt: 0
        },
        itc_inelg: []
      },
      inward_sup: {
        isup_details: []
      }
    };

    const blob = new Blob([JSON.stringify(gstr3bData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSTR3B_${new Date().toISOString().slice(0, 7)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting GSTR-3B data:', error);
    alert('Error exporting GSTR-3B data. Please try again.');
  }
};

const exportGSTSummaryPDF = (gstReturn: any) => {
  // This would typically use a PDF library like jsPDF
  alert('PDF export functionality would be implemented with a PDF library like jsPDF');
};

const exportGSTExcel = (gstReturn: any) => {
  try {
    // Create CSV data for Excel compatibility
    let csvContent = "data:text/csv;charset=utf-8,";

    // Sales data
    csvContent += "SALES (OUTPUT TAX)\n";
    csvContent += "Date,Invoice Number,Description,Amount,GST Rate,GST Amount,Total Amount\n";
    gstReturn.sales.forEach((sale: any) => {
      csvContent += `${sale.date},${sale.invoiceNumber},"${sale.description}",${sale.amount},${sale.gstRate}%,${sale.gstAmount},${sale.totalAmount}\n`;
    });

    csvContent += "\n\nPURCHASES (INPUT TAX)\n";
    csvContent += "Date,Bill Number,Description,Expense Type,Amount,GST Rate,GST Amount,Total Amount\n";
    gstReturn.purchases.forEach((purchase: any) => {
      csvContent += `${purchase.date},${purchase.billNumber},"${purchase.description}",${purchase.expenseType || ''},${purchase.amount},${purchase.gstRate}%,${purchase.gstAmount},${purchase.totalAmount}\n`;
    });

    csvContent += "\n\nSUMMARY\n";
    csvContent += "Description,Amount\n";
    csvContent += `Total Sales GST,${gstReturn.summary.totalSalesGST || 0}\n`;
    csvContent += `Total Purchase GST,${gstReturn.summary.totalPurchasesGST || 0}\n`;
    csvContent += `Net GST Liability,${gstReturn.summary.netGST || 0}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GST_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting Excel data:', error);
    alert('Error exporting Excel data. Please try again.');
  }
};

const exportGSTJSON = (gstReturn: any) => {
  try {
    const blob = new Blob([JSON.stringify(gstReturn, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GST_Data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting JSON data:', error);
    alert('Error exporting JSON data. Please try again.');
  }
};

export default function ReportsPage() {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedAdditionalReport, setSelectedAdditionalReport] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountingData, setAccountingData] = useState<AccountingEntry[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([]);
  const [trialBalance, setTrialBalance] = useState<TrialBalanceEntry[]>([]);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData | null>(null);
  const [profitLoss, setProfitLoss] = useState<ProfitLossData | null>(null);
  const [journal, setJournal] = useState<any[]>([]);
  const [cashFlow, setCashFlow] = useState<any>({ operating: {}, investing: {}, financing: {} });
  const [gstReturn, setGstReturn] = useState<any>({ sales: [], purchases: [], summary: {} });
  const [taxSummary, setTaxSummary] = useState<any>({ taxableIncome: 0, taxDeductions: 0, netTaxableIncome: 0, estimatedTax: 0 });
  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  // New report state variables
  const [receivablesData, setReceivablesData] = useState<ReceivablesData[]>([]);
  const [payablesData, setPayablesData] = useState<PayablesData[]>([]);
  const [bankTransactions, setBankTransactions] = useState<BankTransactionData[]>([]);
  const [loanData, setLoanData] = useState<LoanData[]>([]);
  const [equityData, setEquityData] = useState<EquityData[]>([]);
  const [rentExpenses, setRentExpenses] = useState<ExpenseCategoryData[]>([]);
  const [salaryExpenses, setSalaryExpenses] = useState<ExpenseCategoryData[]>([]);
  const [electricityExpenses, setElectricityExpenses] = useState<ExpenseCategoryData[]>([]);
  const [otherExpenses, setOtherExpenses] = useState<{ [category: string]: ExpenseCategoryData[] }>({});

  // Initialize date range to current month
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setDateFrom(firstDay.toISOString().split('T')[0]);
    setDateTo(lastDay.toISOString().split('T')[0]);
    
    fetchAccountingData();
  }, []);

  useEffect(() => {
    if (accountingData.length > 0) {
      fetchInventoryData();
    }
  }, [accountingData]);

  // Fetch data from Firestore
  const fetchAccountingData = async () => {
    try {
      // Fetch from transactions collection instead of accounting
      const transactionsRef = collection(db, 'transactions');
      const transactionsSnapshot = await getDocs(query(transactionsRef, orderBy('date', 'desc')));
      const transactionData = transactionsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Array<{ id: string } & any>;
      
      // Convert transaction data to accounting entry format
      const convertedData: AccountingEntry[] = transactionData.map(transaction => {
        // Create accounting entries based on transaction type
        const accounts = [];
        const amount = transaction.amount || 0;
        const type = transaction.type || 'EXPENDITURE';
        
        switch (type) {
          case 'BUY':
            accounts.push(
              { account: 'Purchases', debit: amount, credit: 0 },
              { account: 'Cash/Bank', debit: 0, credit: amount }
            );
            break;
          case 'SELL':
            accounts.push(
              { account: 'Cash/Bank', debit: amount, credit: 0 },
              { account: 'Sales', debit: 0, credit: amount }
            );
            break;
          case 'EXPENDITURE':
            accounts.push(
              { account: transaction.expenseType || 'Expenses', debit: amount, credit: 0 },
              { account: 'Cash/Bank', debit: 0, credit: amount }
            );
            break;
          case 'CAPITAL_DRAWINGS':
            if (transaction.subType === 'Capital') {
              accounts.push(
                { account: 'Cash/Bank', debit: amount, credit: 0 },
                { account: 'Capital', debit: 0, credit: amount }
              );
            } else {
              accounts.push(
                { account: 'Drawings', debit: amount, credit: 0 },
                { account: 'Cash/Bank', debit: 0, credit: amount }
              );
            }
            break;
          case 'BANK':
            if (transaction.transactionType === 'Deposit') {
              accounts.push(
                { account: 'Bank Account', debit: amount, credit: 0 },
                { account: 'Cash', debit: 0, credit: amount }
              );
            } else {
              accounts.push(
                { account: 'Cash', debit: amount, credit: 0 },
                { account: 'Bank Account', debit: 0, credit: amount }
              );
            }
            break;
          case 'LOAN':
            accounts.push(
              { account: 'Cash/Bank', debit: amount, credit: 0 },
              { account: 'Loan Payable', debit: 0, credit: amount }
            );
            break;
          default:
            accounts.push(
              { account: 'Miscellaneous', debit: amount, credit: 0 },
              { account: 'Cash/Bank', debit: 0, credit: amount }
            );
        }
        
        return {
          id: transaction.id,
          date: transaction.date || Timestamp.now(),
          description: transaction.description || 'No description',
          accounts,
          reference: transaction.id,
          type: (type.toLowerCase() === 'buy' ? 'purchase' : 
                 type.toLowerCase() === 'sell' ? 'sale' : 
                 'journal') as 'journal' | 'purchase' | 'sale' | 'payment' | 'receipt'
        };
      });
      
      setAccountingData(convertedData);
      
      // Extract unique accounts
      const uniqueAccounts = new Set<string>();
      convertedData.forEach(entry => {
        entry.accounts.forEach(acc => uniqueAccounts.add(acc.account));
      });
      setAccounts(Array.from(uniqueAccounts).sort());
    } catch (error) {
      console.error('Error fetching accounting data:', error);
    }
  };

  const fetchInventoryData = async () => {
    try {
      if (!user?.uid) {
        console.log('No user authenticated, skipping inventory fetch');
        return;
      }

      console.log('Fetching inventory data for user:', user.uid);
      const inventoryItems = await inventoryService.getInventoryItems(user.uid);

      // Transform service inventory items to match our interface
      const transformedInventory: InventoryItem[] = inventoryItems.map(item => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        maximumStock: item.maximumStock,
        unitPrice: item.unitPrice,
        costPrice: item.costPrice,
        supplier: item.supplier,
        location: item.location,
        unit: item.unit,
        totalValue: item.currentStock * item.unitPrice,
        lastUpdated: Timestamp.fromDate(item.updatedAt)
      }));

      console.log('Fetched inventory items:', transformedInventory.length);
      setInventoryData(transformedInventory);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setInventoryData([]); // Set empty array on error
    }
  };

  // Generate reports based on fetched data
  const generateLedger = () => {
    const ledgerEntries: LedgerEntry[] = [];
    let runningBalances: { [key: string]: number } = {};

    // Filter data by date range and additional filters
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
    const toDate = dateTo ? new Date(dateTo) : new Date();
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      

      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && amountInRange;
    });

    // Sort by date to ensure proper balance calculation
    const sortedData = filteredData.sort((a, b) => 
      new Date(a.date.toDate()).getTime() - new Date(b.date.toDate()).getTime()
    );

    sortedData.forEach(entry => {
      entry.accounts.forEach(acc => {
        if (!runningBalances[acc.account]) {
          runningBalances[acc.account] = 0;
        }

        runningBalances[acc.account] += acc.debit - acc.credit;

        ledgerEntries.push({
          account: acc.account,
          date: entry.date.toDate().toLocaleDateString('en-IN'),
          description: entry.description,
          debit: acc.debit,
          credit: acc.credit,
          balance: runningBalances[acc.account]
        });
      });
    });

    // Sort ledger entries by account name and then by date
    const sortedLedgerEntries = ledgerEntries.sort((a, b) => {
      if (a.account !== b.account) {
        return a.account.localeCompare(b.account);
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    setLedgerData(sortedLedgerEntries);
  };

  const generateTrialBalance = () => {
    const accountTotals: { [key: string]: { debit: number; credit: number } } = {};

    // Filter data by date range and additional filters
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
    const toDate = dateTo ? new Date(dateTo) : new Date();
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      

      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && amountInRange;
    });

    filteredData.forEach(entry => {
      entry.accounts.forEach(acc => {
        if (!accountTotals[acc.account]) {
          accountTotals[acc.account] = { debit: 0, credit: 0 };
        }
        accountTotals[acc.account].debit += acc.debit;
        accountTotals[acc.account].credit += acc.credit;
      });
    });

    // Only include accounts with non-zero balances
    const trialBalanceEntries = Object.entries(accountTotals)
      .filter(([account, totals]) => totals.debit > 0 || totals.credit > 0)
      .map(([account, totals]) => ({
        account,
        debit: totals.debit,
        credit: totals.credit
      }))
      .sort((a, b) => a.account.localeCompare(b.account));

    setTrialBalance(trialBalanceEntries);
  };

  const generateBalanceSheet = () => {
    const assets: BalanceSheetData['assets'] = { current: {}, fixed: {} };
    const liabilities: BalanceSheetData['liabilities'] = { current: {}, longTerm: {} };
    const equity: BalanceSheetData['equity'] = {};

    // Filter data by date range and additional filters
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
    const toDate = dateTo ? new Date(dateTo) : new Date();
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      

      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && amountInRange;
    });

    // Categorize accounts based on their names and nature
    filteredData.forEach(entry => {
      entry.accounts.forEach(acc => {
        const accountLower = acc.account.toLowerCase();
        const balance = acc.debit - acc.credit;
        
        // Current Assets
        if (accountLower.includes('cash') || accountLower.includes('bank') || 
            accountLower.includes('receivable') || accountLower.includes('inventory')) {
          assets.current[acc.account] = (assets.current[acc.account] || 0) + balance;
        }
        // Fixed Assets
        else if (accountLower.includes('equipment') || accountLower.includes('building') || 
                 accountLower.includes('machinery') || accountLower.includes('furniture') ||
                 accountLower.includes('vehicle') || accountLower.includes('land')) {
          assets.fixed[acc.account] = (assets.fixed[acc.account] || 0) + balance;
        }
        // Current Liabilities
        else if (accountLower.includes('payable') || accountLower.includes('accrued') ||
                 accountLower.includes('short-term loan') || accountLower.includes('overdraft')) {
          liabilities.current[acc.account] = (liabilities.current[acc.account] || 0) + (acc.credit - acc.debit);
        }
        // Long-term Liabilities
        else if (accountLower.includes('loan') && !accountLower.includes('short-term')) {
          liabilities.longTerm[acc.account] = (liabilities.longTerm[acc.account] || 0) + (acc.credit - acc.debit);
        }
        // Equity
        else if (accountLower.includes('capital') || accountLower.includes('equity') ||
                 accountLower.includes('retained earnings') || accountLower.includes('drawings')) {
          equity[acc.account] = (equity[acc.account] || 0) + (acc.credit - acc.debit);
        }
      });
    });

    // Remove accounts with zero balances
    Object.keys(assets.current).forEach(key => {
      if (assets.current[key] === 0) delete assets.current[key];
    });
    Object.keys(assets.fixed).forEach(key => {
      if (assets.fixed[key] === 0) delete assets.fixed[key];
    });
    Object.keys(liabilities.current).forEach(key => {
      if (liabilities.current[key] === 0) delete liabilities.current[key];
    });
    Object.keys(liabilities.longTerm).forEach(key => {
      if (liabilities.longTerm[key] === 0) delete liabilities.longTerm[key];
    });
    Object.keys(equity).forEach(key => {
      if (equity[key] === 0) delete equity[key];
    });

    setBalanceSheet({ assets, liabilities, equity });
  };

  const generateProfitLoss = () => {
    const revenue: ProfitLossData['revenue'] = {};
    const expenses: ProfitLossData['expenses'] = {};

    // Filter data by date range and additional filters
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
    const toDate = dateTo ? new Date(dateTo) : new Date();
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      

      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && amountInRange;
    });

    filteredData.forEach(entry => {
      entry.accounts.forEach(acc => {
        const accountLower = acc.account.toLowerCase();
        
        // Revenue accounts (credit increases revenue)
        if (accountLower.includes('sales') || accountLower.includes('revenue') ||
            accountLower.includes('income') || accountLower.includes('service revenue') ||
            accountLower.includes('interest income') || accountLower.includes('rental income')) {
          revenue[acc.account] = (revenue[acc.account] || 0) + (acc.credit - acc.debit);
        }
        // Expense accounts (debit increases expenses)
        else if (accountLower.includes('expense') || accountLower.includes('cost') ||
                 accountLower.includes('salary') || accountLower.includes('wage') ||
                 accountLower.includes('rent') || accountLower.includes('utilities') ||
                 accountLower.includes('depreciation') || accountLower.includes('insurance') ||
                 accountLower.includes('advertising') || accountLower.includes('supplies') ||
                 accountLower.includes('maintenance') || accountLower.includes('travel') ||
                 accountLower.includes('professional fees') || accountLower.includes('interest expense')) {
          expenses[acc.account] = (expenses[acc.account] || 0) + (acc.debit - acc.credit);
        }
      });
    });

    // Remove accounts with zero balances
    Object.keys(revenue).forEach(key => {
      if (revenue[key] === 0) delete revenue[key];
    });
    Object.keys(expenses).forEach(key => {
      if (expenses[key] === 0) delete expenses[key];
    });

    const totalRevenue = Object.values(revenue).reduce((sum: number, val: number) => sum + val, 0);
    const totalExpenses = Object.values(expenses).reduce((sum: number, val: number) => sum + val, 0);

    setProfitLoss({
      revenue,
      expenses,
      grossProfit: totalRevenue,
      netProfit: totalRevenue - totalExpenses
    });
  };

  const generateJournal = () => {
    // Filter data by date range and additional filters
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
    const toDate = dateTo ? new Date(dateTo) : new Date();
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      

      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && amountInRange;
    });

    // Sort by date and format for journal display
    const journalEntries = filteredData
      .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime())
      .map(entry => ({
        date: entry.date.toDate().toLocaleDateString(),
        description: entry.description,
        reference: entry.id,
        accounts: entry.accounts.map(acc => ({
          account: acc.account,
          debit: acc.debit > 0 ? acc.debit : null,
          credit: acc.credit > 0 ? acc.credit : null
        }))
      }));

    setJournal(journalEntries);
  };

  const generateCashFlow = () => {
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
    const toDate = dateTo ? new Date(dateTo) : new Date();
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      

      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && amountInRange;
    });

    const operating: CashFlowData['operating'] = {};
    const investing: CashFlowData['investing'] = {};
    const financing: CashFlowData['financing'] = {};

    filteredData.forEach(entry => {
      entry.accounts.forEach(acc => {
        const accountLower = acc.account.toLowerCase();
        const amount = acc.debit - acc.credit;

        // Operating activities
        if (accountLower.includes('revenue') || accountLower.includes('sales') || accountLower.includes('income') ||
            accountLower.includes('expense') || accountLower.includes('cost') || accountLower.includes('salary') ||
            accountLower.includes('rent') || accountLower.includes('utilities')) {
          operating[acc.account] = (operating[acc.account] || 0) + amount;
        }
        // Investing activities
        else if (accountLower.includes('equipment') || accountLower.includes('property') || accountLower.includes('investment') ||
                 accountLower.includes('asset') || accountLower.includes('machinery')) {
          investing[acc.account] = (investing[acc.account] || 0) + amount;
        }
        // Financing activities
        else if (accountLower.includes('loan') || accountLower.includes('capital') || accountLower.includes('equity') ||
                 accountLower.includes('dividend') || accountLower.includes('debt')) {
          financing[acc.account] = (financing[acc.account] || 0) + amount;
        }
      });
    });

    setCashFlow({ operating, investing, financing });
  };

  const generateGSTReturn = async () => {
    try {
      if (!user?.uid) {
        console.log('No user authenticated for GST return');
        setGstReturn({ sales: [], purchases: [], summary: {} });
        return;
      }

      const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
      const toDate = dateTo ? new Date(dateTo) : new Date();

      // Fetch transactions from Supabase
      const transactionService = new TransactionService();
      const transactions = await transactionService.getTransactions(user.uid);

      // Filter transactions by date range and GST applicable
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = transaction.date.toDate();
        const dateInRange = transactionDate >= fromDate && transactionDate <= toDate;
        return dateInRange && transaction.gst_applicable;
      });

      const sales: Array<{
        id: string;
        date: string;
        description: string;
        amount: number;
        gstRate: number;
        gstAmount: number;
        totalAmount: number;
        gstn?: string;
        invoiceNumber?: string;
      }> = [];

      const purchases: Array<{
        id: string;
        date: string;
        description: string;
        amount: number;
        gstRate: number;
        gstAmount: number;
        totalAmount: number;
        gstn?: string;
        billNumber?: string;
        expenseType?: string;
      }> = [];

      let totalSalesAmount = 0;
      let totalSalesGST = 0;
      let totalPurchasesAmount = 0;
      let totalPurchasesGST = 0;

      // Process transactions
      filteredTransactions.forEach(transaction => {
        const baseAmount = transaction.amount;
        const gstRate = parseFloat((transaction as any).gstPercentage || '18'); // Default 18% GST
        const gstAmount = (baseAmount * gstRate) / 100;
        const totalAmount = baseAmount + gstAmount;

        const transactionId = transaction.id || 'unknown';
        const transactionData = {
          id: transactionId,
          date: transaction.date.toDate().toLocaleDateString('en-IN'),
          description: transaction.description || 'Transaction',
          amount: baseAmount,
          gstRate: gstRate,
          gstAmount: gstAmount,
          totalAmount: totalAmount,
          gstn: transaction.gstn
        };

        if (transaction.type === 'SELL') {
          sales.push({
            ...transactionData,
            invoiceNumber: `INV-${transactionId.slice(-6).toUpperCase()}`
          });
          totalSalesAmount += baseAmount;
          totalSalesGST += gstAmount;
        } else if (transaction.type === 'BUY' || transaction.type === 'EXPENDITURE') {
          purchases.push({
            ...transactionData,
            billNumber: `BILL-${transactionId.slice(-6).toUpperCase()}`,
            expenseType: transaction.expense_type
          });
          totalPurchasesAmount += baseAmount;
          totalPurchasesGST += gstAmount;
        }
      });

      // Calculate GST summary with different rates
      const gstRateBreakdown: { [key: string]: { sales: number; purchases: number; salesGST: number; purchasesGST: number } } = {
        '5': { sales: 0, purchases: 0, salesGST: 0, purchasesGST: 0 },
        '12': { sales: 0, purchases: 0, salesGST: 0, purchasesGST: 0 },
        '18': { sales: 0, purchases: 0, salesGST: 0, purchasesGST: 0 },
        '28': { sales: 0, purchases: 0, salesGST: 0, purchasesGST: 0 }
      };

      // Categorize by GST rates
      sales.forEach(sale => {
        const rate = sale.gstRate.toString();
        if (gstRateBreakdown[rate]) {
          gstRateBreakdown[rate].sales += sale.amount;
          gstRateBreakdown[rate].salesGST += sale.gstAmount;
        }
      });

      purchases.forEach(purchase => {
        const rate = purchase.gstRate.toString();
        if (gstRateBreakdown[rate]) {
          gstRateBreakdown[rate].purchases += purchase.amount;
          gstRateBreakdown[rate].purchasesGST += purchase.gstAmount;
        }
      });

      const summary = {
        totalSalesAmount,
        totalSalesGST,
        totalPurchasesAmount,
        totalPurchasesGST,
        netGST: totalSalesGST - totalPurchasesGST,
        gstRateBreakdown,
        period: {
          from: fromDate.toLocaleDateString('en-IN'),
          to: toDate.toLocaleDateString('en-IN')
        },
        transactionCount: {
          sales: sales.length,
          purchases: purchases.length,
          total: sales.length + purchases.length
        }
      };

      setGstReturn({ sales, purchases, summary });
    } catch (error) {
      console.error('Error generating GST return:', error);
      setGstReturn({ sales: [], purchases: [], summary: {} });
    }
  };

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedAccount('');
    setMinAmount('');
    setMaxAmount('');
  };

  const generateReport = async () => {
    setLoading(true);
    await fetchAccountingData();
    await fetchInventoryData();

    // Only proceed if a report type is selected
    if (!selectedReport && !selectedAdditionalReport) {
      setLoading(false);
      return;
    }

    // Handle standard accounting reports
    if (selectedReport) {
      if (selectedReport === 'all-reports') {
        // Generate all standard reports
        generateLedger();
        generateTrialBalance();
        generateBalanceSheet();
        generateProfitLoss();
        generateJournal();
        generateCashFlow();
      } else {
        // Generate the selected report
        switch (selectedReport) {
          case 'ledger':
            generateLedger();
            break;
          case 'trial-balance':
            generateTrialBalance();
            break;
          case 'balance-sheet':
            generateBalanceSheet();
            break;
          case 'profit-loss':
            generateProfitLoss();
            break;
          case 'journal':
            generateJournal();
            break;
          case 'cash-flow':
            generateCashFlow();
            break;
        }
      }
    }
    
    // Handle additional reports
    if (selectedAdditionalReport) {
      if (selectedAdditionalReport === 'all-reports') {
        // Generate all additional reports
        generateGSTReturn();
        generateTaxSummary();
        generateReceivablesReport();
        generatePayablesReport();
        generateBankReport();
        generateLoanReport();
        generateEquityReport();
        generateRentReport();
        generateSalaryReport();
        generateElectricityReport();
        await generateOtherExpenseReports();
        // Inventory data is already loaded
      } else {
        // Generate the selected report
        switch (selectedAdditionalReport) {
          case 'gst-return':
            generateGSTReturn();
            break;
          case 'inventory':
            // Inventory data is already loaded in the inventoryData state
            // No additional processing needed as it's fetched from the inventory service
            console.log('Inventory report selected, data already loaded:', inventoryData.length, 'items');
            break;
          case 'tax-summary':
            generateTaxSummary();
            break;
          case 'receivables':
            generateReceivablesReport();
            break;
          case 'payables':
            generatePayablesReport();
            break;
          case 'bank':
            generateBankReport();
            break;
          case 'loan':
            generateLoanReport();
            break;
          case 'equity':
            generateEquityReport();
            break;
          case 'rent':
            generateRentReport();
            break;
          case 'salary':
            generateSalaryReport();
            break;
          case 'electricity':
            generateElectricityReport();
            break;
          case 'other-expenses':
            await generateOtherExpenseReports();
            break;
        }
      }
    }
    
    setLoading(false);
  };
  
  // Tax Summary Report Generation
  const generateTaxSummary = async () => {
    try {
      if (!user?.uid) {
        console.log('No user authenticated for tax summary');
        setTaxSummary({
          taxableIncome: 0,
          taxDeductions: 0,
          netTaxableIncome: 0,
          estimatedTax: 0,
          gstSummary: {},
          tdsDeducted: 0,
          advanceTaxPaid: 0
        });
        return;
      }

      const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
      const toDate = dateTo ? new Date(dateTo) : new Date();

      // Fetch transactions from Supabase
      const transactions = await transactionService.getTransactions(user.uid);

      // Filter transactions by date range
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = transaction.date.toDate();
        return transactionDate >= fromDate && transactionDate <= toDate;
      });

      // Calculate income and expenses
      let totalIncome = 0;
      let totalExpenses = 0;
      let totalGSTCollected = 0;
      let totalGSTPaid = 0;
      let tdsDeducted = 0;
      let advanceTaxPaid = 0;

      // Categorize expenses for tax deductions
      const expenseCategories: { [key: string]: number } = {
        'rent': 0,
        'salary': 0,
        'electricity': 0,
        'travel': 0,
        'maintenance': 0,
        'insurance': 0,
        'advertising': 0,
        'supplies': 0,
        'professional-fees': 0,
        'utilities': 0,
        'office-expenses': 0,
        'other': 0
      };

      filteredTransactions.forEach(transaction => {
        const amount = transaction.amount;

        if (transaction.type === 'SELL') {
          totalIncome += amount;
          if (transaction.gst_applicable && (transaction as any).gstPercentage) {
            totalGSTCollected += (amount * parseFloat((transaction as any).gstPercentage)) / 100;
          }
        } else if (transaction.type === 'BUY' || transaction.type === 'EXPENDITURE') {
          totalExpenses += amount;

          // Categorize expenses
          if (transaction.expense_type && expenseCategories.hasOwnProperty(transaction.expense_type)) {
            expenseCategories[transaction.expense_type] += amount;
          } else {
            expenseCategories['other'] += amount;
          }

          if (transaction.gst_applicable && (transaction as any).gstPercentage) {
            totalGSTPaid += (amount * parseFloat((transaction as any).gstPercentage)) / 100;
          }
        }

        // Check for TDS and advance tax (based on description or payment method)
        if (transaction.description?.toLowerCase().includes('tds')) {
          tdsDeducted += amount;
        }
        if (transaction.description?.toLowerCase().includes('advance tax')) {
          advanceTaxPaid += amount;
        }
      });

      // Calculate taxable income (simplified)
      const grossProfit = totalIncome - totalExpenses;
      const netTaxableIncome = Math.max(0, grossProfit);

      // Calculate estimated income tax (Indian tax slabs for individuals - FY 2023-24)
      let estimatedIncomeTax = 0;
      if (netTaxableIncome > 250000) {
        if (netTaxableIncome <= 500000) {
          estimatedIncomeTax = (netTaxableIncome - 250000) * 0.05; // 5%
        } else if (netTaxableIncome <= 1000000) {
          estimatedIncomeTax = 12500 + (netTaxableIncome - 500000) * 0.20; // 20%
        } else {
          estimatedIncomeTax = 112500 + (netTaxableIncome - 1000000) * 0.30; // 30%
        }
      }

      // Add cess (4% on income tax)
      const cess = estimatedIncomeTax * 0.04;
      const totalIncomeTax = estimatedIncomeTax + cess;

      // Net GST liability
      const netGSTLiability = totalGSTCollected - totalGSTPaid;

      // Set comprehensive tax summary data
      setTaxSummary({
        period: {
          from: fromDate.toLocaleDateString('en-IN'),
          to: toDate.toLocaleDateString('en-IN')
        },
        income: {
          totalIncome,
          grossProfit,
          netTaxableIncome
        },
        expenses: {
          totalExpenses,
          categoryBreakdown: expenseCategories
        },
        gstSummary: {
          totalGSTCollected,
          totalGSTPaid,
          netGSTLiability
        },
        incomeTax: {
          estimatedIncomeTax,
          cess,
          totalIncomeTax,
          tdsDeducted,
          advanceTaxPaid,
          netTaxLiability: Math.max(0, totalIncomeTax - tdsDeducted - advanceTaxPaid)
        },
        summary: {
          totalTaxLiability: Math.max(0, totalIncomeTax - tdsDeducted - advanceTaxPaid) + Math.max(0, netGSTLiability),
          complianceStatus: {
            gstFiling: netGSTLiability > 0 ? 'Required' : 'Not Required',
            incomeTaxFiling: netTaxableIncome > 250000 ? 'Required' : 'Not Required',
            tdsCompliance: tdsDeducted > 0 ? 'TDS Deducted' : 'No TDS'
          }
        }
      });
    } catch (error) {
      console.error('Error generating tax summary:', error);
      setTaxSummary({
        taxableIncome: 0,
        taxDeductions: 0,
        netTaxableIncome: 0,
        estimatedTax: 0,
        gstSummary: {},
        tdsDeducted: 0,
        advanceTaxPaid: 0
      });
    }
  };

  // Receivables Report Generation - Using Real Transaction Data
  const generateReceivablesReport = async () => {
    try {
      if (!user?.uid) {
        console.log('No user authenticated for receivables report');
        setReceivablesData([]);
        return;
      }

      // Handle date filtering with proper defaults
      const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
      const toDate = dateTo ? new Date(dateTo) : new Date();
      const minAmt = minAmount ? parseFloat(minAmount) : 0;
      const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;

      console.log('Fetching transactions for receivables report...');

      // Fetch real transactions from Supabase
      const transactions = await transactionService.getTransactionsByDateRange(
        user.uid, // Using user.uid as organizationId
        fromDate,
        toDate
      );

      console.log('Fetched transactions:', transactions.length);

      // Filter for sales transactions that create receivables
      const salesTransactions = transactions.filter(transaction => {
        const amountInRange = transaction.amount >= minAmt && transaction.amount <= maxAmt;
        const isSalesTransaction = transaction.type === 'SELL' ||
                                 transaction.description.toLowerCase().includes('sale') ||
                                 transaction.description.toLowerCase().includes('invoice');

        return amountInRange && isSalesTransaction;
      });

      console.log('Sales transactions found:', salesTransactions.length);

      // Track receivables by customer/invoice
      const receivablesMap = new Map<string, {
        customer: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalSales: number;
        totalPayments: number;
        transactionId: string;
      }>();

      salesTransactions.forEach(transaction => {
        const customer = transaction.buyer_name ||
                        transaction.description.split(' ')[0] ||
                        'Unknown Customer';
        const invoiceNumber = transaction.id || `INV-${Date.now()}`;
        const invoiceKey = `${customer}-${invoiceNumber}`;

        if (!receivablesMap.has(invoiceKey)) {
          receivablesMap.set(invoiceKey, {
            customer,
            invoiceNumber,
            invoiceDate: transaction.date.toDate(),
            totalSales: 0,
            totalPayments: 0,
            transactionId: transaction.id || ''
          });
        }

        const receivable = receivablesMap.get(invoiceKey)!;
        receivable.totalSales += transaction.amount; // Sales amount
      });

      // Look for payment transactions that reduce receivables
      const paymentTransactions = transactions.filter(transaction => {
        const isPaymentTransaction = transaction.type === 'BANK' ||
                                   transaction.description.toLowerCase().includes('payment') ||
                                   transaction.description.toLowerCase().includes('receipt');
        return isPaymentTransaction;
      });

      // Match payments to receivables (simplified matching by customer name)
      paymentTransactions.forEach(payment => {
        const customer = payment.description.split(' ')[0] || 'Unknown Customer';

        // Find matching receivable
        for (const [key, receivable] of receivablesMap.entries()) {
          if (receivable.customer === customer) {
            receivable.totalPayments += payment.amount;
            break; // Match to first found receivable for this customer
          }
        }
      });

    // Convert to receivables data format
    const receivables: ReceivablesData[] = Array.from(receivablesMap.values())
      .map(item => {
        const outstandingAmount = item.totalSales - item.totalPayments;
        const today = new Date();
        const dueDate = new Date(item.invoiceDate);
        dueDate.setDate(dueDate.getDate() + 30); // Assume 30-day payment terms

        const daysOverdue = outstandingAmount > 0 && today > dueDate
          ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        let status: 'Current' | 'Overdue' | 'Paid' = 'Paid';
        if (outstandingAmount > 0) {
          status = daysOverdue > 0 ? 'Overdue' : 'Current';
        }

        return {
          customer: item.customer,
          invoiceNumber: item.invoiceNumber,
          invoiceDate: item.invoiceDate.toLocaleDateString('en-IN'),
          dueDate: dueDate.toLocaleDateString('en-IN'),
          originalAmount: item.totalSales,
          paidAmount: item.totalPayments,
          outstandingAmount,
          daysOverdue,
          status
        };
      })
      .filter(item => item.originalAmount > 0) // Only include actual sales
      .sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());

      console.log('Generated receivables data:', receivables.length, 'items');
      setReceivablesData(receivables);
    } catch (error) {
      console.error('Error generating receivables report:', error);
      setReceivablesData([]);
    }
  };

  // Payables Report Generation - Using Real Transaction Data
  const generatePayablesReport = async () => {
    try {
      if (!user?.uid) {
        console.log('No user authenticated for payables report');
        setPayablesData([]);
        return;
      }

      // Handle date filtering with proper defaults
      const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
      const toDate = dateTo ? new Date(dateTo) : new Date();
      const minAmt = minAmount ? parseFloat(minAmount) : 0;
      const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;

      console.log('Fetching transactions for payables report...');

      // Fetch real transactions from Supabase
      const transactions = await transactionService.getTransactionsByDateRange(
        user.uid, // Using user.uid as organizationId
        fromDate,
        toDate
      );

      // Filter for purchase transactions that create payables
      const purchaseTransactions = transactions.filter(transaction => {
        const amountInRange = transaction.amount >= minAmt && transaction.amount <= maxAmt;
        const isPurchaseTransaction = transaction.type === 'BUY' ||
                                    transaction.description.toLowerCase().includes('purchase') ||
                                    transaction.description.toLowerCase().includes('bill');

        return amountInRange && isPurchaseTransaction;
      });

      // Track payables by supplier/bill
      const payablesMap = new Map<string, {
        supplier: string;
        billNumber: string;
        billDate: Date;
        totalPurchases: number;
        totalPayments: number;
        transactionId: string;
      }>();

      purchaseTransactions.forEach(transaction => {
        const supplier = transaction.vendor_name ||
                        transaction.description.split(' ')[0] ||
                        'Unknown Supplier';
        const billNumber = transaction.id || `BILL-${Date.now()}`;
        const billKey = `${supplier}-${billNumber}`;

        if (!payablesMap.has(billKey)) {
          payablesMap.set(billKey, {
            supplier,
            billNumber,
            billDate: transaction.date.toDate(),
            totalPurchases: 0,
            totalPayments: 0,
            transactionId: transaction.id || ''
          });
        }

        const payable = payablesMap.get(billKey)!;
        payable.totalPurchases += transaction.amount; // Purchase amount
      });

      // Look for payment transactions that reduce payables
      const paymentTransactions = transactions.filter(transaction => {
        const isPaymentTransaction = transaction.type === 'BANK' ||
                                   transaction.description.toLowerCase().includes('payment') ||
                                   transaction.description.toLowerCase().includes('paid');
        return isPaymentTransaction;
      });

      // Match payments to payables (simplified matching by supplier name)
      paymentTransactions.forEach(payment => {
        const supplier = payment.description.split(' ')[0] || 'Unknown Supplier';

        // Find matching payable
        for (const [key, payable] of payablesMap.entries()) {
          if (payable.supplier === supplier) {
            payable.totalPayments += payment.amount;
            break; // Match to first found payable for this supplier
          }
        }
      });

    // Convert to payables data format
    const payables: PayablesData[] = Array.from(payablesMap.values())
      .map(item => {
        const outstandingAmount = item.totalPurchases - item.totalPayments;
        const today = new Date();
        const dueDate = new Date(item.billDate);
        dueDate.setDate(dueDate.getDate() + 30); // Assume 30-day payment terms

        const daysOverdue = outstandingAmount > 0 && today > dueDate
          ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        let status: 'Current' | 'Overdue' | 'Paid' = 'Paid';
        if (outstandingAmount > 0) {
          status = daysOverdue > 0 ? 'Overdue' : 'Current';
        }

        return {
          supplier: item.supplier,
          billNumber: item.billNumber,
          billDate: item.billDate.toLocaleDateString('en-IN'),
          dueDate: dueDate.toLocaleDateString('en-IN'),
          originalAmount: item.totalPurchases,
          paidAmount: item.totalPayments,
          outstandingAmount,
          daysOverdue,
          status
        };
      })
      .filter(item => item.originalAmount > 0) // Only include actual purchases
      .sort((a, b) => new Date(b.billDate).getTime() - new Date(a.billDate).getTime());

      console.log('Generated payables data:', payables.length, 'items');
      setPayablesData(payables);
    } catch (error) {
      console.error('Error generating payables report:', error);
      setPayablesData([]);
    }
  };

  // Bank Report Generation - Using Real Transaction Data
  const generateBankReport = async () => {
    try {
      if (!user?.uid) {
        console.log('No user authenticated for bank report');
        setBankTransactions([]);
        return;
      }

      // Handle date filtering with proper defaults
      const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
      const toDate = dateTo ? new Date(dateTo) : new Date();
      const minAmt = minAmount ? parseFloat(minAmount) : 0;
      const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;

      console.log('Fetching transactions for bank report...');

      // Fetch real transactions from Supabase
      const transactions = await transactionService.getTransactionsByDateRange(
        user.uid, // Using user.uid as organizationId
        fromDate,
        toDate
      );

      // Filter for bank-related transactions
      const bankTransactions = transactions.filter(transaction => {
        const amountInRange = transaction.amount >= minAmt && transaction.amount <= maxAmt;
        const isBankTransaction = transaction.type === 'BANK' ||
                                transaction.paymentMethod === 'Bank' ||
                                transaction.description.toLowerCase().includes('bank') ||
                                transaction.description.toLowerCase().includes('transfer');

        return amountInRange && isBankTransaction;
      });

      // Track bank transactions and running balance
      const bankTransactionsList: BankTransactionData[] = [];
      let runningBalance = 10000; // Starting balance (could be fetched from settings)

      // Sort by date to ensure proper balance calculation
      const sortedTransactions = bankTransactions.sort((a, b) =>
        new Date(a.date.toDate()).getTime() - new Date(b.date.toDate()).getTime()
      );

      sortedTransactions.forEach(transaction => {
        // Determine transaction type based on transaction type and description
        let transactionType: 'Deposit' | 'Withdrawal' | 'Transfer' = 'Transfer';
        let amount = transaction.amount;

        if (transaction.type === 'SELL' || transaction.description.toLowerCase().includes('deposit')) {
          transactionType = 'Deposit';
          runningBalance += amount;
        } else if (transaction.type === 'BUY' || transaction.description.toLowerCase().includes('withdrawal')) {
          transactionType = 'Withdrawal';
          runningBalance -= amount;
        } else {
          // For other bank transactions, determine based on context
          if (transaction.description.toLowerCase().includes('received') ||
              transaction.description.toLowerCase().includes('income')) {
            transactionType = 'Deposit';
            runningBalance += amount;
          } else {
            transactionType = 'Withdrawal';
            runningBalance -= amount;
          }
        }

        // Check if this is a reconciled transaction (simplified logic - could be stored in transaction)
        const reconciled = Math.random() > 0.3; // 70% reconciled for demo

        bankTransactionsList.push({
          date: transaction.date.toDate().toLocaleDateString('en-IN'),
          description: transaction.description,
          transactionType,
          amount: amount,
          balance: runningBalance,
          reconciled,
          reference: transaction.id || `TXN-${Date.now()}`
        });
      });

      console.log('Generated bank transactions data:', bankTransactionsList.length, 'items');
      setBankTransactions(bankTransactionsList);
    } catch (error) {
      console.error('Error generating bank report:', error);
      setBankTransactions([]);
    }
  };

  // Loan Report Generation
  const generateLoanReport = () => {
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
    const toDate = dateTo ? new Date(dateTo) : new Date();
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;

    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;

      const amountInRange = entry.accounts.some(acc =>
        (acc.debit >= minAmt && acc.debit <= maxAmt) ||
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );

      return dateInRange && amountInRange;
    });

    // Track loan accounts and their balances
    const loanAccountsMap = new Map<string, {
      loanAccount: string;
      principalAmount: number;
      currentBalance: number;
      totalInterestPaid: number;
      lastPaymentDate?: Date;
    }>();

    filteredData.forEach(entry => {
      entry.accounts.forEach(acc => {
        const accountLower = acc.account.toLowerCase();

        // Loan-related accounts
        if (accountLower.includes('loan') || accountLower.includes('payable')) {
          const loanAccount = acc.account;

          if (!loanAccountsMap.has(loanAccount)) {
            loanAccountsMap.set(loanAccount, {
              loanAccount,
              principalAmount: 0,
              currentBalance: 0,
              totalInterestPaid: 0
            });
          }

          const loan = loanAccountsMap.get(loanAccount)!;

          // Credit increases loan liability (taking loan)
          // Debit decreases loan liability (paying loan)
          const balanceChange = acc.credit - acc.debit;
          loan.currentBalance += balanceChange;

          if (balanceChange > 0) {
            loan.principalAmount += balanceChange; // New loan amount
          }

          loan.lastPaymentDate = entry.date.toDate();
        }

        // Interest expense tracking
        if (accountLower.includes('interest') && accountLower.includes('expense')) {
          // Find corresponding loan account
          const loanEntry = entry.accounts.find(a =>
            a.account.toLowerCase().includes('loan')
          );

          if (loanEntry) {
            const loanAccount = loanEntry.account;
            if (loanAccountsMap.has(loanAccount)) {
              const loan = loanAccountsMap.get(loanAccount)!;
              loan.totalInterestPaid += acc.debit; // Debit to interest expense
            }
          }
        }
      });
    });

    // Convert to loan data format
    const loans: LoanData[] = Array.from(loanAccountsMap.values())
      .filter(loan => loan.principalAmount > 0) // Only include actual loans
      .map(loan => {
        // Calculate EMI and other details (simplified calculation)
        const interestRate = 12; // Assume 12% annual interest rate
        const loanTermMonths = 60; // Assume 5-year term
        const monthlyRate = interestRate / 100 / 12;
        const emiAmount = loan.principalAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
          (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

        const paymentsRemaining = Math.ceil(loan.currentBalance / emiAmount);
        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        return {
          loanAccount: loan.loanAccount,
          loanType: 'Term Loan', // Simplified
          principalAmount: loan.principalAmount,
          currentBalance: loan.currentBalance,
          interestRate,
          emiAmount,
          nextDueDate: nextDueDate.toLocaleDateString('en-IN'),
          paymentsRemaining,
          totalInterestPaid: loan.totalInterestPaid
        };
      })
      .sort((a, b) => b.currentBalance - a.currentBalance);

    setLoanData(loans);
  };

  // Equity Report Generation
  const generateEquityReport = () => {
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
    const toDate = dateTo ? new Date(dateTo) : new Date();
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;

    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;

      const amountInRange = entry.accounts.some(acc =>
        (acc.debit >= minAmt && acc.debit <= maxAmt) ||
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );

      return dateInRange && amountInRange;
    });

    // Track equity accounts
    const equityAccountsMap = new Map<string, {
      account: string;
      openingBalance: number;
      additions: number;
      withdrawals: number;
    }>();

    filteredData.forEach(entry => {
      entry.accounts.forEach(acc => {
        const accountLower = acc.account.toLowerCase();

        // Equity-related accounts
        if (accountLower.includes('capital') || accountLower.includes('equity') ||
            accountLower.includes('retained earnings') || accountLower.includes('drawings')) {

          const account = acc.account;

          if (!equityAccountsMap.has(account)) {
            equityAccountsMap.set(account, {
              account,
              openingBalance: 0,
              additions: 0,
              withdrawals: 0
            });
          }

          const equity = equityAccountsMap.get(account)!;

          if (accountLower.includes('drawings')) {
            // Drawings reduce equity (Debit: Drawings, Credit: Cash)
            equity.withdrawals += acc.debit;
          } else {
            // Capital/Equity increases with credits, decreases with debits
            equity.additions += acc.credit;
            equity.withdrawals += acc.debit;
          }
        }
      });
    });

    // Convert to equity data format
    const equity: EquityData[] = Array.from(equityAccountsMap.values())
      .map(item => {
        const closingBalance = item.openingBalance + item.additions - item.withdrawals;

        return {
          account: item.account,
          openingBalance: item.openingBalance,
          additions: item.additions,
          withdrawals: item.withdrawals,
          closingBalance
        };
      })
      .filter(item => item.additions > 0 || item.withdrawals > 0 || item.openingBalance > 0)
      .sort((a, b) => b.closingBalance - a.closingBalance);

    setEquityData(equity);
  };

  // Expense Category Reports Generation - Using Real Transaction Data
  const generateExpenseCategoryReport = async (category: string) => {
    try {
      if (!user?.uid) {
        console.log('No user authenticated for expense category report');
        return [];
      }

      const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
      const toDate = dateTo ? new Date(dateTo) : new Date();
      const minAmt = minAmount ? parseFloat(minAmount) : 0;
      const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;

      console.log(`Fetching transactions for ${category} expense report...`);

      // Fetch real transactions from Supabase
      const transactions = await transactionService.getTransactionsByDateRange(
        user.uid, // Using user.uid as organizationId
        fromDate,
        toDate
      );

      // Filter for expense transactions matching the category
      const expenseTransactions = transactions.filter(transaction => {
        const amountInRange = transaction.amount >= minAmt && transaction.amount <= maxAmt;
        const isExpenseTransaction = transaction.type === 'EXPENDITURE' || transaction.type === 'BUY';

        // Category matching logic
        const descriptionLower = transaction.description.toLowerCase();
        const categoryLower = category.toLowerCase();

        let matchesCategory = false;
        if (categoryLower === 'rent') {
          matchesCategory = descriptionLower.includes('rent') || descriptionLower.includes('lease');
        } else if (categoryLower === 'salary') {
          matchesCategory = descriptionLower.includes('salary') || descriptionLower.includes('wage') || descriptionLower.includes('payroll');
        } else if (categoryLower === 'electricity') {
          matchesCategory = descriptionLower.includes('electricity') || descriptionLower.includes('power') || descriptionLower.includes('electric');
        } else {
          // For other categories, match by description or expense type
          matchesCategory = descriptionLower.includes(categoryLower) ||
                          Boolean(transaction.expense_type && transaction.expense_type.toLowerCase().includes(categoryLower));
        }

        return amountInRange && isExpenseTransaction && matchesCategory;
      });

      const expenses: ExpenseCategoryData[] = expenseTransactions.map(transaction => {
        // Extract detailed information if available
        const detailedInfo = (transaction as any).detailedInfo || {};
        const tdsInfo = (detailedInfo.tds as any) || {};
        const tcsInfo = (detailedInfo.tcs as any) || {};
        const pfInfo = (detailedInfo.providentFund as any) || {};
        const insuranceInfo = (detailedInfo.insurance as any) || {};
        const salaryInfo = (detailedInfo.salary as any) || {};

        return {
          date: transaction.date.toDate().toLocaleDateString('en-IN'),
          description: transaction.description,
          amount: transaction.amount,
          category: category,
          subcategory: transaction.expense_type || '',
          reference: transaction.id || `REF-${Date.now()}`,
          // Payment tracking fields
          totalAmount: (transaction as any).totalAmount || transaction.amount,
          paidAmount: (transaction as any).paidAmount || 0,
          outstandingAmount: (transaction as any).outstandingAmount || 0,
          dueDate: (transaction as any).dueDate ? (transaction as any).dueDate.toDate().toLocaleDateString('en-IN') : undefined,
          paymentDate: (transaction as any).paymentDate ? (transaction as any).paymentDate.toDate().toLocaleDateString('en-IN') : undefined,
          advancePayment: (transaction as any).advancePayment || 0,
          paymentStatus: (transaction as any).paymentStatus || 'pending',
          // Detailed information
          tdsAmount: tdsInfo.applicable ? parseFloat(tdsInfo.amount || '0') : undefined,
          tcsAmount: tcsInfo.applicable ? parseFloat(tcsInfo.amount || '0') : undefined,
          providentFund: pfInfo.applicable ? {
            employeeContribution: parseFloat(pfInfo.employeeContribution || '0'),
            employerContribution: parseFloat(pfInfo.employerContribution || '0')
          } : undefined,
          insurance: insuranceInfo.applicable ? {
            premium: parseFloat(insuranceInfo.premium || '0'),
            coverage: parseFloat(insuranceInfo.coverage || '0')
          } : undefined,
          salaryBreakdown: category === 'salary' && salaryInfo.basicSalary ? {
            basicSalary: parseFloat(salaryInfo.basicSalary || '0'),
            hra: parseFloat(salaryInfo.hra || '0'),
            allowances: parseFloat(salaryInfo.allowances || '0'),
            deductions: parseFloat(salaryInfo.deductions || '0'),
            netSalary: parseFloat(salaryInfo.netSalary || '0'),
            employeeId: salaryInfo.employeeId,
            designation: salaryInfo.designation
          } : undefined
        };
      });

      // Sort by date (newest first)
      expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      console.log(`Generated ${category} expense data:`, expenses.length, 'items');
      return expenses;
    } catch (error) {
      console.error(`Error generating ${category} expense report:`, error);
      return [];
    }
  };

  // Specific expense category report generators
  const generateRentReport = async () => {
    const rentExpenses = await generateExpenseCategoryReport('rent');
    setRentExpenses(rentExpenses);
  };

  const generateSalaryReport = async () => {
    const salaryExpenses = await generateExpenseCategoryReport('salary');
    setSalaryExpenses(salaryExpenses);
  };

  const generateElectricityReport = async () => {
    const electricityExpenses = await generateExpenseCategoryReport('electricity');
    setElectricityExpenses(electricityExpenses);
  };

  const generateOtherExpenseReports = async () => {
    const categories = ['travel', 'maintenance', 'insurance', 'advertising', 'supplies', 'professional fees'];
    const otherExpensesData: { [category: string]: ExpenseCategoryData[] } = {};

    for (const category of categories) {
      otherExpensesData[category] = await generateExpenseCategoryReport(category);
    }

    setOtherExpenses(otherExpensesData);
  };

  const exportReport = () => {
    try {
      const reportData = getCurrentReportData();
      const reportName = `${selectedReport}_${new Date().toISOString().split('T')[0]}`;
      
      // Export as CSV (most compatible format)
      exportToCSV(reportData, reportName);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const getCurrentReportData = () => {
    // Return empty array if no report is selected
    if (!selectedReport && !selectedAdditionalReport) {
      return [];
    }
    
    // Get ledger data
    const getLedgerData = () => {
      return ledgerData.map(entry => ({
        Report: 'Ledger',
        Account: entry.account,
        Date: entry.date,
        Description: entry.description,
        Debit: entry.debit.toFixed(2),
        Credit: entry.credit.toFixed(2),
        Balance: entry.balance.toFixed(2)
      }));
    };
    
    // Get trial balance data
    const getTrialBalanceData = () => {
      return trialBalance.map(entry => ({
        Report: 'Trial Balance',
        Account: entry.account,
        Debit: entry.debit.toFixed(2),
        Credit: entry.credit.toFixed(2)
      }));
    };
    
    // Get balance sheet data
    const getBalanceSheetData = () => {
      if (!balanceSheet) return [];
      const bsData: Array<{ Report: string; Category: string; Account: string; Amount: string }> = [];
      // Assets
      Object.entries(balanceSheet.assets.current).forEach(([key, value]) => {
        bsData.push({ Report: 'Balance Sheet', Category: 'Current Assets', Account: key, Amount: (value as number).toFixed(2) });
      });
      Object.entries(balanceSheet.assets.fixed).forEach(([key, value]) => {
        bsData.push({ Report: 'Balance Sheet', Category: 'Fixed Assets', Account: key, Amount: (value as number).toFixed(2) });
      });
      // Liabilities
      Object.entries(balanceSheet.liabilities.current).forEach(([key, value]) => {
        bsData.push({ Report: 'Balance Sheet', Category: 'Current Liabilities', Account: key, Amount: (value as number).toFixed(2) });
      });
      Object.entries(balanceSheet.liabilities.longTerm).forEach(([key, value]) => {
        bsData.push({ Report: 'Balance Sheet', Category: 'Long-term Liabilities', Account: key, Amount: (value as number).toFixed(2) });
      });
      // Equity
      Object.entries(balanceSheet.equity).forEach(([key, value]) => {
        bsData.push({ Report: 'Balance Sheet', Category: 'Equity', Account: key, Amount: (value as number).toFixed(2) });
      });
      return bsData;
    };
    
    // Get profit and loss data
    const getProfitLossData = () => {
      if (!profitLoss) return [];
      const plData: Array<{ Report: string; Category: string; Account: string; Amount: string }> = [];
      // Revenue
      Object.entries(profitLoss.revenue).forEach(([key, value]) => {
        plData.push({ Report: 'Profit & Loss', Category: 'Revenue', Account: key, Amount: (value as number).toFixed(2) });
      });
      // Expenses
      Object.entries(profitLoss.expenses).forEach(([key, value]) => {
        plData.push({ Report: 'Profit & Loss', Category: 'Expenses', Account: key, Amount: (value as number).toFixed(2) });
      });
      // Summary
      plData.push({ Report: 'Profit & Loss', Category: 'Summary', Account: 'Gross Profit', Amount: profitLoss.grossProfit.toFixed(2) });
      plData.push({ Report: 'Profit & Loss', Category: 'Summary', Account: 'Net Profit', Amount: profitLoss.netProfit.toFixed(2) });
      return plData;
    };
    
    // Get journal data
    const getJournalData = () => {
      return journal.map(entry => ({
        Report: 'Journal',
        Date: entry.date,
        Description: entry.description,
        Reference: entry.reference,
        Accounts: entry.accounts.map((acc: any) => `${acc.account}: ${acc.debit ? 'Dr ' + acc.debit.toFixed(2) : 'Cr ' + acc.credit.toFixed(2)}`).join(', ')
      }));
    };
    
    // Get cash flow data
    const getCashFlowData = () => {
      if (!cashFlow) return [];
      const cfData: Array<{ Report: string; Category: string; Account: string; Amount: string }> = [];
      // Operating
      Object.entries(cashFlow.operating).forEach(([key, value]) => {
        cfData.push({ Report: 'Cash Flow', Category: 'Operating Activities', Account: key, Amount: (value as number).toFixed(2) });
      });
      // Investing
      Object.entries(cashFlow.investing).forEach(([key, value]) => {
        cfData.push({ Report: 'Cash Flow', Category: 'Investing Activities', Account: key, Amount: (value as number).toFixed(2) });
      });
      // Financing
      Object.entries(cashFlow.financing).forEach(([key, value]) => {
        cfData.push({ Report: 'Cash Flow', Category: 'Financing Activities', Account: key, Amount: (value as number).toFixed(2) });
      });
      return cfData;
    };
    
    // Get inventory data
    const getInventoryData = () => {
      return inventoryData.map(item => ({
        Report: 'Inventory',
        SKU: item.sku,
        Name: item.name,
        Category: item.category,
        'Current Stock': item.currentStock,
        'Minimum Stock': item.minimumStock,
        'Maximum Stock': item.maximumStock,
        'Unit Price': item.unitPrice.toFixed(2),
        'Cost Price': item.costPrice.toFixed(2),
        'Total Value': item.totalValue.toFixed(2),
        Supplier: item.supplier,
        Location: item.location,
        Unit: item.unit,
        'Last Updated': new Date(item.lastUpdated.toDate()).toLocaleDateString('en-IN')
      }));
    };
    
    // Get GST return data
    const getGSTReturnData = () => {
      if (!gstReturn) return [];
      const gstData: Array<{ Report: string; Type: string; Date: string; Description: string; Amount: string; GST: string; Total: string }> = [];
      
      // Sales
      gstReturn.sales.forEach((sale: any) => {
        gstData.push({
          Report: 'GST Return',
          Type: 'Sale',
          Date: new Date(sale.date.toDate()).toLocaleDateString('en-IN'),
          Description: sale.description,
          Amount: sale.amount.toFixed(2),
          GST: sale.gst.toFixed(2),
          Total: sale.total.toFixed(2)
        });
      });
      
      // Purchases
      gstReturn.purchases.forEach((purchase: any) => {
        gstData.push({
          Report: 'GST Return',
          Type: 'Purchase',
          Date: new Date(purchase.date.toDate()).toLocaleDateString('en-IN'),
          Description: purchase.description,
          Amount: purchase.amount.toFixed(2),
          GST: purchase.gst.toFixed(2),
          Total: purchase.total.toFixed(2)
        });
      });
      
      return gstData;
    };
    
    // Get tax summary data
    const getTaxSummaryData = () => {
      if (!taxSummary) return [];
      return [
        { Report: 'Tax Summary', Category: 'Income', Item: 'Taxable Income', Amount: taxSummary.taxableIncome.toFixed(2) },
        { Report: 'Tax Summary', Category: 'Deductions', Item: 'Tax Deductions', Amount: taxSummary.taxDeductions.toFixed(2) },
        { Report: 'Tax Summary', Category: 'Summary', Item: 'Net Taxable Income', Amount: taxSummary.netTaxableIncome.toFixed(2) },
        { Report: 'Tax Summary', Category: 'Summary', Item: 'Estimated Tax', Amount: taxSummary.estimatedTax.toFixed(2) }
      ];
    };

    // Get receivables data
    const getReceivablesData = () => {
      return receivablesData.map(item => ({
        Report: 'Receivables',
        Customer: item.customer,
        'Invoice Number': item.invoiceNumber,
        'Invoice Date': item.invoiceDate,
        'Due Date': item.dueDate,
        'Original Amount': item.originalAmount.toFixed(2),
        'Paid Amount': item.paidAmount.toFixed(2),
        'Outstanding Amount': item.outstandingAmount.toFixed(2),
        'Days Overdue': item.daysOverdue,
        Status: item.status
      }));
    };

    // Get payables data
    const getPayablesData = () => {
      return payablesData.map(item => ({
        Report: 'Payables',
        Supplier: item.supplier,
        'Bill Number': item.billNumber,
        'Bill Date': item.billDate,
        'Due Date': item.dueDate,
        'Original Amount': item.originalAmount.toFixed(2),
        'Paid Amount': item.paidAmount.toFixed(2),
        'Outstanding Amount': item.outstandingAmount.toFixed(2),
        'Days Overdue': item.daysOverdue,
        Status: item.status
      }));
    };

    // Get bank transactions data
    const getBankTransactionsData = () => {
      return bankTransactions.map(item => ({
        Report: 'Bank Transactions',
        Date: item.date,
        Description: item.description,
        'Transaction Type': item.transactionType,
        Amount: item.amount.toFixed(2),
        Balance: item.balance.toFixed(2),
        Reconciled: item.reconciled ? 'Yes' : 'No',
        Reference: item.reference
      }));
    };

    // Get loan data
    const getLoanData = () => {
      return loanData.map(item => ({
        Report: 'Loan Report',
        'Loan Account': item.loanAccount,
        'Loan Type': item.loanType,
        'Principal Amount': item.principalAmount.toFixed(2),
        'Current Balance': item.currentBalance.toFixed(2),
        'Interest Rate': `${item.interestRate}%`,
        'EMI Amount': item.emiAmount.toFixed(2),
        'Next Due Date': item.nextDueDate,
        'Payments Remaining': item.paymentsRemaining,
        'Total Interest Paid': item.totalInterestPaid.toFixed(2)
      }));
    };

    // Get equity data
    const getEquityData = () => {
      return equityData.map(item => ({
        Report: 'Equity Report',
        Account: item.account,
        'Opening Balance': item.openingBalance.toFixed(2),
        Additions: item.additions.toFixed(2),
        Withdrawals: item.withdrawals.toFixed(2),
        'Closing Balance': item.closingBalance.toFixed(2)
      }));
    };

    // Get expense category data
    const getExpenseCategoryData = (expenses: ExpenseCategoryData[], reportName: string) => {
      return expenses.map(item => ({
        Report: reportName,
        Date: item.date,
        Description: item.description,
        Amount: item.amount.toFixed(2),
        Category: item.category,
        Subcategory: item.subcategory || '',
        Reference: item.reference
      }));
    };
    
    // Handle standard accounting reports
    if (selectedReport) {
      if (selectedReport === 'all-reports') {
        // Combine all standard reports
        return [
          ...getLedgerData(),
          ...getTrialBalanceData(),
          ...getBalanceSheetData(),
          ...getProfitLossData(),
          ...getJournalData(),
          ...getCashFlowData()
        ];
      } else {
        // Return the selected report
        switch (selectedReport) {
          case 'ledger':
            return getLedgerData();
          case 'trial-balance':
            return getTrialBalanceData();
          case 'balance-sheet':
            return getBalanceSheetData();
          case 'profit-loss':
            return getProfitLossData();
          case 'journal':
            return getJournalData();
          case 'cash-flow':
            return getCashFlowData();
          default:
            return [];
        }
      }
    }
    
    // Handle additional reports
    if (selectedAdditionalReport) {
      if (selectedAdditionalReport === 'all-reports') {
        // Combine all additional reports
        return [
          ...getInventoryData(),
          ...getGSTReturnData(),
          ...getTaxSummaryData(),
          ...getReceivablesData(),
          ...getPayablesData(),
          ...getBankTransactionsData(),
          ...getLoanData(),
          ...getEquityData(),
          ...getExpenseCategoryData(rentExpenses, 'Rent Report'),
          ...getExpenseCategoryData(salaryExpenses, 'Salary Report'),
          ...getExpenseCategoryData(electricityExpenses, 'Electricity Report'),
          ...Object.entries(otherExpenses).flatMap(([category, expenses]) =>
            getExpenseCategoryData(expenses, `${category.charAt(0).toUpperCase() + category.slice(1)} Report`)
          )
        ];
      } else {
        // Return the selected report
        switch (selectedAdditionalReport) {
          case 'inventory':
            return getInventoryData();
          case 'gst-return':
            return getGSTReturnData();
          case 'tax-summary':
            return getTaxSummaryData();
          case 'receivables':
            return getReceivablesData();
          case 'payables':
            return getPayablesData();
          case 'bank':
            return getBankTransactionsData();
          case 'loan':
            return getLoanData();
          case 'equity':
            return getEquityData();
          case 'rent':
            return getExpenseCategoryData(rentExpenses, 'Rent Report');
          case 'salary':
            return getExpenseCategoryData(salaryExpenses, 'Salary Report');
          case 'electricity':
            return getExpenseCategoryData(electricityExpenses, 'Electricity Report');
          case 'other-expenses':
            return Object.entries(otherExpenses).flatMap(([category, expenses]) =>
              getExpenseCategoryData(expenses, `${category.charAt(0).toUpperCase() + category.slice(1)} Report`)
            );
          default:
            return [];
        }
      }
    }
    
    return [];
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <Button onClick={exportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Type (Double Entry Flow)</label>
                <Select 
                  value={selectedReport} 
                  onValueChange={(value) => {
                    setSelectedReport(value);
                    // Only clear the other dropdown if not selecting "all-reports"
                    if (value !== 'all-reports') {
                      setSelectedAdditionalReport('');
                    }
                  }}
                  disabled={!!selectedAdditionalReport && selectedAdditionalReport !== 'all-reports'}
                >
                  <SelectTrigger className="bg-white border-gray-300 hover:bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all-reports" className="hover:bg-blue-50 font-semibold">Select All</SelectItem>
                    <SelectItem value="journal" className="hover:bg-blue-50">Journal</SelectItem>
                    <SelectItem value="ledger" className="hover:bg-blue-50">Ledger</SelectItem>
                    <SelectItem value="trial-balance" className="hover:bg-blue-50">Trial Balance</SelectItem>
                    <SelectItem value="profit-loss" className="hover:bg-blue-50">Profit & Loss</SelectItem>
                    <SelectItem value="balance-sheet" className="hover:bg-blue-50">Balance Sheet</SelectItem>
                    <SelectItem value="cash-flow" className="hover:bg-blue-50">Cash Flow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Additional Reports</label>
                <Select 
                  value={selectedAdditionalReport} 
                  onValueChange={(value) => {
                    setSelectedAdditionalReport(value);
                    // Only clear the other dropdown if not selecting "all-reports"
                    if (value !== 'all-reports') {
                      setSelectedReport('');
                    }
                  }}
                  disabled={!!selectedReport && selectedReport !== 'all-reports'}
                >
                  <SelectTrigger className="bg-white border-gray-300 hover:bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all-reports" className="hover:bg-blue-50 font-semibold">Select All</SelectItem>
                    <SelectItem value="gst-return" className="hover:bg-blue-50">GST Return</SelectItem>
                    <SelectItem value="inventory" className="hover:bg-blue-50">Inventory Report</SelectItem>
                    <SelectItem value="tax-summary" className="hover:bg-blue-50">Tax Summary</SelectItem>
                    <SelectItem value="receivables" className="hover:bg-blue-50">Receivables Report</SelectItem>
                    <SelectItem value="payables" className="hover:bg-blue-50">Payables Report</SelectItem>
                    <SelectItem value="bank" className="hover:bg-blue-50">Bank Report</SelectItem>
                    <SelectItem value="loan" className="hover:bg-blue-50">Loan Report</SelectItem>
                    <SelectItem value="equity" className="hover:bg-blue-50">Equity Report</SelectItem>
                    <SelectItem value="rent" className="hover:bg-blue-50">Rent Report</SelectItem>
                    <SelectItem value="salary" className="hover:bg-blue-50">Salary Report</SelectItem>
                    <SelectItem value="electricity" className="hover:bg-blue-50">Electricity Report</SelectItem>
                    <SelectItem value="other-expenses" className="hover:bg-blue-50">Other Expense Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">From Date</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">To Date</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              
              {/* Account filter removed */}
            </div>
            
            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">

              
              <div>
                <label className="block text-sm font-medium mb-2">Min Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Max Amount</label>
                <Input
                  type="number"
                  placeholder="999999.99"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setMinAmount('');
                    setMaxAmount('');
                    setSelectedReport('');
                    setSelectedAdditionalReport('');
                  }}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              <Button onClick={generateReport} disabled={loading} className="flex items-center gap-2">
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Display */}
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReport === 'ledger' && ledgerData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Account</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Debit</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Credit</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerData.map((entry, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{entry.date}</td>
                        <td className="border border-gray-300 px-4 py-2">{entry.account}</td>
                        <td className="border border-gray-300 px-4 py-2">{entry.description}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '-'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : '-'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ₹{entry.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedReport === 'trial-balance' && trialBalance.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Account</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Debit</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trialBalance.map((entry, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{entry.account}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ₹{entry.debit.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ₹{entry.credit.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="border border-gray-300 px-4 py-2">Total</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        ₹{trialBalance.reduce((sum, entry) => sum + entry.debit, 0).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        ₹{trialBalance.reduce((sum, entry) => sum + entry.credit, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {selectedReport === 'journal' && journal.length > 0 && (
              <div className="overflow-x-auto">
                <div className="space-y-6">
                  {journal.map((entry, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Date: {entry.date}</span>
                          <span className="ml-4 text-sm text-gray-600">Ref: {entry.reference}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{entry.description}</p>
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Account</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Debit</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entry.accounts.map((acc: { account: string; debit: number; credit: number }, accIndex: number) => (
                            <tr key={accIndex}>
                              <td className="border border-gray-300 px-4 py-2">{acc.account}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">
                                {acc.debit ? `₹${acc.debit.toLocaleString()}` : '-'}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-right">
                                {acc.credit ? `₹${acc.credit.toLocaleString()}` : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedReport === 'balance-sheet' && balanceSheet && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Assets</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Current Assets</h4>
                      {Object.entries(balanceSheet.assets.current).map(([account, amount]) => (
                        <div key={account} className="flex justify-between">
                          <span>{account}</span>
                          <span>₹{amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-medium">Fixed Assets</h4>
                      {Object.entries(balanceSheet.assets.fixed).map(([account, amount]) => (
                        <div key={account} className="flex justify-between">
                          <span>{account}</span>
                          <span>₹{amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Liabilities & Equity</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Current Liabilities</h4>
                      {Object.entries(balanceSheet.liabilities.current).map(([account, amount]) => (
                        <div key={account} className="flex justify-between">
                          <span>{account}</span>
                          <span>₹{amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-medium">Equity</h4>
                      {Object.entries(balanceSheet.equity).map(([account, amount]) => (
                        <div key={account} className="flex justify-between">
                          <span>{account}</span>
                          <span>₹{amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'profit-loss' && profitLoss && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Revenue</h3>
                  {Object.entries(profitLoss.revenue).map(([account, amount]) => (
                    <div key={account} className="flex justify-between">
                      <span>{account}</span>
                      <span>₹{amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-semibold flex justify-between">
                    <span>Total Revenue</span>
                    <span>₹{profitLoss.grossProfit.toLocaleString()}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Expenses</h3>
                  {Object.entries(profitLoss.expenses).map(([account, amount]) => (
                    <div key={account} className="flex justify-between">
                      <span>{account}</span>
                      <span>₹{amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-semibold flex justify-between">
                    <span>Total Expenses</span>
                    <span>₹{Object.values(profitLoss.expenses).reduce((sum: number, val: number) => sum + val, 0).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="border-t-2 pt-4">
                  <div className="text-xl font-bold flex justify-between">
                    <span>Net Profit</span>
                    <span className={profitLoss.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ₹{profitLoss.netProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'cash-flow' && cashFlow && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Operating Activities</h3>
                  {Object.entries(cashFlow.operating).map((entry) => {
                    const [account, amount] = entry;
                    return (
                      <div key={account} className="flex justify-between">
                        <span>{account}</span>
                        <span>₹{(amount as number).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Investing Activities</h3>
                  {Object.entries(cashFlow.investing).map((entry) => {
                    const [account, amount] = entry;
                    return (
                      <div key={account} className="flex justify-between">
                        <span>{account}</span>
                        <span>₹{(amount as number).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Financing Activities</h3>
                  {Object.entries(cashFlow.financing).map((entry) => {
                    const [account, amount] = entry;
                    return (
                      <div key={account} className="flex justify-between">
                        <span>{account}</span>
                        <span>₹{(amount as number).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedAdditionalReport === 'gst-return' && gstReturn && (
              <div className="space-y-6">
                {/* GST Return Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">GST Return Report</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600">Period</p>
                      <p className="font-semibold">{gstReturn.summary.period?.from} to {gstReturn.summary.period?.to}</p>
                    </div>
                    <div>
                      <p className="text-blue-600">Total Transactions</p>
                      <p className="font-semibold">{gstReturn.summary.transactionCount?.total || 0}</p>
                    </div>
                    <div>
                      <p className="text-blue-600">Sales Transactions</p>
                      <p className="font-semibold">{gstReturn.summary.transactionCount?.sales || 0}</p>
                    </div>
                    <div>
                      <p className="text-blue-600">Purchase Transactions</p>
                      <p className="font-semibold">{gstReturn.summary.transactionCount?.purchases || 0}</p>
                    </div>
                  </div>
                </div>

                {/* GST Rate-wise Breakdown */}
                {gstReturn.summary.gstRateBreakdown && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold mb-4">GST Rate-wise Breakdown</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">GST Rate</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Sales Amount</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Sales GST</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Purchase Amount</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Purchase GST</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Net GST</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(gstReturn.summary.gstRateBreakdown).map(([rate, data]: [string, any]) => (
                            <tr key={rate}>
                              <td className="border border-gray-300 px-4 py-2 font-medium">{rate}%</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">₹{data.sales.toLocaleString()}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">₹{data.salesGST.toLocaleString()}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">₹{data.purchases.toLocaleString()}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">₹{data.purchasesGST.toLocaleString()}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                                ₹{(data.salesGST - data.purchasesGST).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sales and Purchases Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sales (Output Tax) */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold mb-4 text-green-700">Sales (Output Tax)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-green-50">
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs">Date</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs">Invoice #</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs">Description</th>
                            <th className="border border-gray-300 px-3 py-2 text-right text-xs">Amount</th>
                            <th className="border border-gray-300 px-3 py-2 text-right text-xs">GST Rate</th>
                            <th className="border border-gray-300 px-3 py-2 text-right text-xs">GST Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gstReturn.sales.map((sale: any, index: number) => (
                            <tr key={index} className="hover:bg-green-25">
                              <td className="border border-gray-300 px-3 py-2 text-xs">{sale.date}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs">{sale.invoiceNumber}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs">{sale.description}</td>
                              <td className="border border-gray-300 px-3 py-2 text-right text-xs">₹{sale.amount.toLocaleString()}</td>
                              <td className="border border-gray-300 px-3 py-2 text-right text-xs">{sale.gstRate}%</td>
                              <td className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold">₹{sale.gstAmount.toLocaleString()}</td>
                            </tr>
                          ))}
                          {gstReturn.sales.length === 0 && (
                            <tr>
                              <td colSpan={6} className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                                No sales transactions with GST found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Purchases (Input Tax) */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold mb-4 text-red-700">Purchases (Input Tax)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-red-50">
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs">Date</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs">Bill #</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs">Description</th>
                            <th className="border border-gray-300 px-3 py-2 text-right text-xs">Amount</th>
                            <th className="border border-gray-300 px-3 py-2 text-right text-xs">GST Rate</th>
                            <th className="border border-gray-300 px-3 py-2 text-right text-xs">GST Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gstReturn.purchases.map((purchase: any, index: number) => (
                            <tr key={index} className="hover:bg-red-25">
                              <td className="border border-gray-300 px-3 py-2 text-xs">{purchase.date}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs">{purchase.billNumber}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs">
                                {purchase.description}
                                {purchase.expenseType && (
                                  <span className="text-gray-500"> ({purchase.expenseType})</span>
                                )}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-right text-xs">₹{purchase.amount.toLocaleString()}</td>
                              <td className="border border-gray-300 px-3 py-2 text-right text-xs">{purchase.gstRate}%</td>
                              <td className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold">₹{purchase.gstAmount.toLocaleString()}</td>
                            </tr>
                          ))}
                          {gstReturn.purchases.length === 0 && (
                            <tr>
                              <td colSpan={6} className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                                No purchase transactions with GST found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* GST Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold mb-4">GST Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600">Total Sales GST</p>
                      <p className="text-xl font-bold text-green-600">₹{gstReturn.summary.totalSalesGST?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600">Total Purchase GST</p>
                      <p className="text-xl font-bold text-red-600">₹{gstReturn.summary.totalPurchasesGST?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600">Net GST Liability</p>
                      <p className={`text-xl font-bold ${gstReturn.summary.netGST > 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                        ₹{Math.abs(gstReturn.summary.netGST || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className={`text-lg font-semibold ${gstReturn.summary.netGST > 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                        {gstReturn.summary.netGST > 0 ? 'Payable' : 'Refundable'}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 20).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* GST Compliance & Export Options */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold mb-4 text-indigo-700">GST Compliance & Export</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* GSTR-1 Export */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">GSTR-1 (Outward Supplies)</h5>
                      <p className="text-sm text-gray-600 mb-4">Export sales data in GSTR-1 format for GST filing</p>
                      <button
                        onClick={() => exportGSTR1Data(gstReturn)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export GSTR-1 Data
                      </button>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>• B2B Sales: {gstReturn.sales.filter((s: any) => s.gstAmount > 0).length} transactions</p>
                        <p>• Total Value: ₹{gstReturn.summary.totalSalesAmount?.toLocaleString()}</p>
                        <p>• Total Tax: ₹{gstReturn.summary.totalSalesGST?.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* GSTR-3B Export */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">GSTR-3B (Monthly Return)</h5>
                      <p className="text-sm text-gray-600 mb-4">Export summary data in GSTR-3B format</p>
                      <button
                        onClick={() => exportGSTR3BData(gstReturn)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export GSTR-3B Data
                      </button>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>• Outward Supplies: ₹{gstReturn.summary.totalSalesGST?.toLocaleString()}</p>
                        <p>• Input Tax Credit: ₹{gstReturn.summary.totalPurchasesGST?.toLocaleString()}</p>
                        <p>• Net Liability: ₹{Math.abs(gstReturn.summary.netGST || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional GST Reports */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => exportGSTSummaryPDF(gstReturn)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Export PDF Report
                    </button>
                    <button
                      onClick={() => exportGSTExcel(gstReturn)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export Excel Report
                    </button>
                    <button
                      onClick={() => exportGSTJSON(gstReturn)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Export JSON Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tax Summary Report Display */}
            {selectedAdditionalReport === 'tax-summary' && taxSummary && (
              <div className="space-y-6">
                {/* Tax Summary Header */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-xl font-bold text-purple-900 mb-2">Tax Summary Report</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-purple-600">Period</p>
                      <p className="font-semibold">{taxSummary.period?.from} to {taxSummary.period?.to}</p>
                    </div>
                    <div>
                      <p className="text-purple-600">Total Income</p>
                      <p className="font-semibold">₹{taxSummary.income?.totalIncome?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <p className="text-purple-600">Total Expenses</p>
                      <p className="font-semibold">₹{taxSummary.expenses?.totalExpenses?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>

                {/* Income Tax Summary */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold mb-4 text-blue-700">Income Tax Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Gross Profit</p>
                      <p className="text-xl font-bold text-blue-800">₹{taxSummary.income?.grossProfit?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Taxable Income</p>
                      <p className="text-xl font-bold text-green-800">₹{taxSummary.income?.netTaxableIncome?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600">Estimated Tax</p>
                      <p className="text-xl font-bold text-orange-800">₹{taxSummary.incomeTax?.totalIncomeTax?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600">Net Tax Liability</p>
                      <p className="text-xl font-bold text-red-800">₹{taxSummary.incomeTax?.netTaxLiability?.toLocaleString() || '0'}</p>
                    </div>
                  </div>

                  {/* Income Tax Breakdown */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Component</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Income Tax</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">₹{taxSummary.incomeTax?.estimatedIncomeTax?.toLocaleString() || '0'}</td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Based on current tax slabs</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Health & Education Cess</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">₹{taxSummary.incomeTax?.cess?.toLocaleString() || '0'}</td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">4% on income tax</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">TDS Deducted</td>
                          <td className="border border-gray-300 px-4 py-2 text-right text-green-600">-₹{taxSummary.incomeTax?.tdsDeducted?.toLocaleString() || '0'}</td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Tax deducted at source</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Advance Tax Paid</td>
                          <td className="border border-gray-300 px-4 py-2 text-right text-green-600">-₹{taxSummary.incomeTax?.advanceTaxPaid?.toLocaleString() || '0'}</td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Advance tax payments</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-bold">Net Liability</td>
                          <td className="border border-gray-300 px-4 py-2 text-right font-bold">₹{taxSummary.incomeTax?.netTaxLiability?.toLocaleString() || '0'}</td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Amount to be paid</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* GST Summary */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold mb-4 text-green-700">GST Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">GST Collected</p>
                      <p className="text-xl font-bold text-green-800">₹{taxSummary.gstSummary?.totalGSTCollected?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">GST Paid</p>
                      <p className="text-xl font-bold text-blue-800">₹{taxSummary.gstSummary?.totalGSTPaid?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600">Net GST Liability</p>
                      <p className="text-xl font-bold text-orange-800">₹{Math.abs(taxSummary.gstSummary?.netGSTLiability || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Expense Breakdown */}
                {taxSummary.expenses?.categoryBreakdown && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold mb-4 text-red-700">Expense Category Breakdown</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(taxSummary.expenses.categoryBreakdown).map(([category, amount]: [string, any]) => (
                        amount > 0 && (
                          <div key={category} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 capitalize">{category.replace('-', ' ')}</p>
                            <p className="text-lg font-semibold">₹{amount.toLocaleString()}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance Status */}
                <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold mb-4">Compliance Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600">GST Filing</p>
                      <p className={`text-lg font-semibold ${taxSummary.summary?.complianceStatus?.gstFiling === 'Required' ? 'text-orange-600' : 'text-green-600'}`}>
                        {taxSummary.summary?.complianceStatus?.gstFiling || 'Not Required'}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600">Income Tax Filing</p>
                      <p className={`text-lg font-semibold ${taxSummary.summary?.complianceStatus?.incomeTaxFiling === 'Required' ? 'text-orange-600' : 'text-green-600'}`}>
                        {taxSummary.summary?.complianceStatus?.incomeTaxFiling || 'Not Required'}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600">TDS Compliance</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {taxSummary.summary?.complianceStatus?.tdsCompliance || 'No TDS'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Tax Liability */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
                  <h4 className="text-xl font-bold text-red-900 mb-2">Total Tax Liability</h4>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-700">₹{taxSummary.summary?.totalTaxLiability?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-red-600 mt-2">Combined Income Tax + GST Liability</p>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Report Display */}
            {selectedAdditionalReport === 'inventory' && inventoryData.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Inventory Report</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Items</p>
                    <p className="text-2xl font-bold text-blue-800">{inventoryData.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Total Value</p>
                    <p className="text-2xl font-bold text-green-800">₹{inventoryData.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-orange-800">{inventoryData.filter(item => item.currentStock <= item.minimumStock).length}</p>
                  </div>
                </div>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">SKU</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Current Stock</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Min Stock</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Total Value</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.sku}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{item.currentStock} {item.unit}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{item.minimumStock} {item.unit}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.unitPrice.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.totalValue.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Badge
                            variant={item.currentStock <= item.minimumStock ? "destructive" :
                                   item.currentStock <= item.minimumStock * 1.5 ? "secondary" : "default"}
                          >
                            {item.currentStock <= item.minimumStock ? "Low Stock" :
                             item.currentStock <= item.minimumStock * 1.5 ? "Warning" : "Normal"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Receivables Report Display */}
            {selectedAdditionalReport === 'receivables' && receivablesData.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Accounts Receivable Report</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Customer</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Invoice #</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Invoice Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Due Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Original Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Paid Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Outstanding</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Days Overdue</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivablesData.map((item, index) => (
                      <tr key={index} className={item.status === 'Overdue' ? 'bg-red-50' : ''}>
                        <td className="border border-gray-300 px-4 py-2">{item.customer}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.invoiceNumber}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.invoiceDate}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.dueDate}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.originalAmount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.paidAmount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.outstandingAmount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.daysOverdue}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Badge variant={item.status === 'Paid' ? 'default' : item.status === 'Overdue' ? 'destructive' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Outstanding</p>
                      <p className="text-lg font-semibold">₹{receivablesData.reduce((sum, item) => sum + item.outstandingAmount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current</p>
                      <p className="text-lg font-semibold">₹{receivablesData.filter(item => item.status === 'Current').reduce((sum, item) => sum + item.outstandingAmount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Overdue</p>
                      <p className="text-lg font-semibold text-red-600">₹{receivablesData.filter(item => item.status === 'Overdue').reduce((sum, item) => sum + item.outstandingAmount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Collection Rate</p>
                      <p className="text-lg font-semibold">
                        {receivablesData.length > 0 ?
                          ((receivablesData.reduce((sum, item) => sum + item.paidAmount, 0) /
                            receivablesData.reduce((sum, item) => sum + item.originalAmount, 0)) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payables Report Display */}
            {selectedAdditionalReport === 'payables' && payablesData.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Accounts Payable Report</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Supplier</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Bill #</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Bill Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Due Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Original Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Paid Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Outstanding</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Days Overdue</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payablesData.map((item, index) => (
                      <tr key={index} className={item.status === 'Overdue' ? 'bg-red-50' : ''}>
                        <td className="border border-gray-300 px-4 py-2">{item.supplier}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.billNumber}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.billDate}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.dueDate}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.originalAmount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.paidAmount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.outstandingAmount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.daysOverdue}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Badge variant={item.status === 'Paid' ? 'default' : item.status === 'Overdue' ? 'destructive' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Outstanding</p>
                      <p className="text-lg font-semibold">₹{payablesData.reduce((sum, item) => sum + item.outstandingAmount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current</p>
                      <p className="text-lg font-semibold">₹{payablesData.filter(item => item.status === 'Current').reduce((sum, item) => sum + item.outstandingAmount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Overdue</p>
                      <p className="text-lg font-semibold text-red-600">₹{payablesData.filter(item => item.status === 'Overdue').reduce((sum, item) => sum + item.outstandingAmount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Rate</p>
                      <p className="text-lg font-semibold">
                        {payablesData.length > 0 ?
                          ((payablesData.reduce((sum, item) => sum + item.paidAmount, 0) /
                            payablesData.reduce((sum, item) => sum + item.originalAmount, 0)) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Report Display */}
            {selectedAdditionalReport === 'bank' && bankTransactions.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Bank Transactions Report</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Balance</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Reconciled</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankTransactions.map((item, index) => (
                      <tr key={index} className={!item.reconciled ? 'bg-yellow-50' : ''}>
                        <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Badge variant={item.transactionType === 'Deposit' ? 'default' : item.transactionType === 'Withdrawal' ? 'destructive' : 'secondary'}>
                            {item.transactionType}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.amount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.balance.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Badge variant={item.reconciled ? 'default' : 'secondary'}>
                            {item.reconciled ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{item.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Deposits</p>
                      <p className="text-lg font-semibold text-green-600">₹{bankTransactions.filter(t => t.transactionType === 'Deposit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Withdrawals</p>
                      <p className="text-lg font-semibold text-red-600">₹{bankTransactions.filter(t => t.transactionType === 'Withdrawal').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reconciled</p>
                      <p className="text-lg font-semibold">{bankTransactions.filter(t => t.reconciled).length}/{bankTransactions.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Balance</p>
                      <p className="text-lg font-semibold">₹{bankTransactions.length > 0 ? bankTransactions[bankTransactions.length - 1].balance.toLocaleString() : '0'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loan Report Display */}
            {selectedAdditionalReport === 'loan' && loanData.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Loan Report</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Loan Account</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Principal Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Current Balance</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Interest Rate</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">EMI Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Next Due Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Payments Remaining</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Interest Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanData.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.loanAccount}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.loanType}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.principalAmount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.currentBalance.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.interestRate}%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.emiAmount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.nextDueDate}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.paymentsRemaining}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.totalInterestPaid.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Principal</p>
                      <p className="text-lg font-semibold">₹{loanData.reduce((sum, item) => sum + item.principalAmount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Outstanding</p>
                      <p className="text-lg font-semibold text-red-600">₹{loanData.reduce((sum, item) => sum + item.currentBalance, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Interest Paid</p>
                      <p className="text-lg font-semibold">₹{loanData.reduce((sum, item) => sum + item.totalInterestPaid, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly EMI</p>
                      <p className="text-lg font-semibold">₹{loanData.reduce((sum, item) => sum + item.emiAmount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Equity Report Display */}
            {selectedAdditionalReport === 'equity' && equityData.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Equity Report</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Account</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Opening Balance</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Additions</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Withdrawals</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equityData.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.account}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.openingBalance.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-green-600">₹{item.additions.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-red-600">₹{item.withdrawals.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-semibold">₹{item.closingBalance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold">
                      <td className="border border-gray-300 px-4 py-2">Total</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">₹{equityData.reduce((sum, item) => sum + item.openingBalance, 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-green-600">₹{equityData.reduce((sum, item) => sum + item.additions, 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-red-600">₹{equityData.reduce((sum, item) => sum + item.withdrawals, 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">₹{equityData.reduce((sum, item) => sum + item.closingBalance, 0).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Enhanced Expense Category Reports Display */}
            {(selectedAdditionalReport === 'rent' && rentExpenses.length > 0) && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Rent Expense Report - Enhanced Details</h3>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-2 py-2 text-left">Date</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">Total Amount</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">Paid</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">Outstanding</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">Status</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">Due Date</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">TDS</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentExpenses.map((item, index) => (
                      <tr key={index} className={`${item.paymentStatus === 'overdue' ? 'bg-red-50' : item.paymentStatus === 'paid' ? 'bg-green-50' : ''}`}>
                        <td className="border border-gray-300 px-2 py-2">{item.date}</td>
                        <td className="border border-gray-300 px-2 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right font-semibold">₹{(item.totalAmount || item.amount).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right text-green-600">₹{(item.paidAmount || 0).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right text-red-600">₹{(item.outstandingAmount || 0).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            item.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                            item.paymentStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.paymentStatus?.toUpperCase() || 'PENDING'}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2">{item.dueDate || '-'}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right">{item.tdsAmount ? `₹${item.tdsAmount.toLocaleString()}` : '-'}</td>
                        <td className="border border-gray-300 px-2 py-2">{item.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={2} className="border border-gray-300 px-2 py-2">Total Rent Expenses</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">₹{rentExpenses.reduce((sum, item) => sum + (item.totalAmount || item.amount), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right text-green-600">₹{rentExpenses.reduce((sum, item) => sum + (item.paidAmount || 0), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right text-red-600">₹{rentExpenses.reduce((sum, item) => sum + (item.outstandingAmount || 0), 0).toLocaleString()}</td>
                      <td colSpan={2} className="border border-gray-300 px-2 py-2"></td>
                      <td className="border border-gray-300 px-2 py-2 text-right">₹{rentExpenses.reduce((sum, item) => sum + (item.tdsAmount || 0), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {(selectedAdditionalReport === 'salary' && salaryExpenses.length > 0) && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Salary Expense Report - Enhanced Details</h3>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-2 py-2 text-left">Date</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">Employee</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">Designation</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">Basic</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">HRA</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">Allowances</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">Deductions</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">PF (Emp)</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">PF (Empr)</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">TDS</th>
                      <th className="border border-gray-300 px-2 py-2 text-right">Net Salary</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryExpenses.map((item, index) => (
                      <tr key={index} className={`${item.paymentStatus === 'overdue' ? 'bg-red-50' : item.paymentStatus === 'paid' ? 'bg-green-50' : ''}`}>
                        <td className="border border-gray-300 px-2 py-2">{item.date}</td>
                        <td className="border border-gray-300 px-2 py-2">
                          <div>
                            <div className="font-medium">{item.description}</div>
                            {item.salaryBreakdown?.employeeId && (
                              <div className="text-xs text-gray-500">ID: {item.salaryBreakdown.employeeId}</div>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-2 py-2">{item.salaryBreakdown?.designation || '-'}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right">₹{(item.salaryBreakdown?.basicSalary || 0).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right">₹{(item.salaryBreakdown?.hra || 0).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right">₹{(item.salaryBreakdown?.allowances || 0).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right text-red-600">₹{(item.salaryBreakdown?.deductions || 0).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right">₹{(item.providentFund?.employeeContribution || 0).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right">₹{(item.providentFund?.employerContribution || 0).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right">₹{(item.tdsAmount || 0).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-right font-semibold">₹{(item.salaryBreakdown?.netSalary || item.amount).toLocaleString()}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            item.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                            item.paymentStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.paymentStatus?.toUpperCase() || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={3} className="border border-gray-300 px-2 py-2">Total Salary Expenses</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">₹{salaryExpenses.reduce((sum, item) => sum + (item.salaryBreakdown?.basicSalary || 0), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">₹{salaryExpenses.reduce((sum, item) => sum + (item.salaryBreakdown?.hra || 0), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">₹{salaryExpenses.reduce((sum, item) => sum + (item.salaryBreakdown?.allowances || 0), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right text-red-600">₹{salaryExpenses.reduce((sum, item) => sum + (item.salaryBreakdown?.deductions || 0), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">₹{salaryExpenses.reduce((sum, item) => sum + (item.providentFund?.employeeContribution || 0), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">₹{salaryExpenses.reduce((sum, item) => sum + (item.providentFund?.employerContribution || 0), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">₹{salaryExpenses.reduce((sum, item) => sum + (item.tdsAmount || 0), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-right">₹{salaryExpenses.reduce((sum, item) => sum + (item.salaryBreakdown?.netSalary || item.amount), 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {(selectedAdditionalReport === 'electricity' && electricityExpenses.length > 0) && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Electricity Expense Report</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {electricityExpenses.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.amount.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={3} className="border border-gray-300 px-4 py-2">Total Electricity Expenses</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">₹{electricityExpenses.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {(selectedAdditionalReport === 'other-expenses' && Object.keys(otherExpenses).length > 0) && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Other Expense Reports</h3>
                {Object.entries(otherExpenses).map(([category, expenses]) => (
                  expenses.length > 0 && (
                    <div key={category} className="overflow-x-auto">
                      <h4 className="text-md font-medium mb-2 capitalize">{category} Expenses</h4>
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Reference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses.map((item, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">₹{item.amount.toLocaleString()}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.reference}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50 font-bold">
                            <td colSpan={3} className="border border-gray-300 px-4 py-2">Total {category.charAt(0).toUpperCase() + category.slice(1)} Expenses</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">₹{expenses.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</td>
                            <td className="border border-gray-300 px-4 py-2"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Empty state for inventory report */}
            {selectedAdditionalReport === 'inventory' && inventoryData.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No inventory items found. Add items to your inventory to see them in this report.</p>
              </div>
            )}

            {!loading && (
              selectedReport === 'ledger' && ledgerData.length === 0 ||
              selectedReport === 'trial-balance' && trialBalance.length === 0 ||
              selectedReport === 'balance-sheet' && !balanceSheet ||
              selectedReport === 'profit-loss' && !profitLoss
            ) && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No data available. Click "Generate Report" to fetch data from Supabase.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}