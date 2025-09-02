'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Download, Filter, FileText, BarChart3, Calculator, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';

// Interfaces for report data
interface AccountingEntry {
  id: string;
  date: Timestamp;
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
  quantity: number;
  unitPrice: number;
  totalValue: number;
  category: string;
  lastUpdated: Timestamp;
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

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('ledger');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
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
  const [accounts, setAccounts] = useState<string[]>([]);

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
      // For now, create sample inventory data from transactions
      // In a real app, you would fetch from actual inventory collection
      const sampleInventory: InventoryItem[] = accountingData
        .filter(entry => entry.type === 'purchase' || entry.type === 'sale')
        .map((entry, index) => ({
          id: `inv-${index}`,
          name: `Product ${index + 1}`,
          quantity: Math.floor(Math.random() * 100) + 1,
          unitPrice: entry.accounts[0]?.debit || entry.accounts[0]?.credit || 0,
          totalValue: (Math.floor(Math.random() * 100) + 1) * (entry.accounts[0]?.debit || entry.accounts[0]?.credit || 0),
          category: 'General',
          lastUpdated: entry.date
        }));
      
      setInventoryData(sampleInventory);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  // Generate reports based on fetched data
  const generateLedger = () => {
    const ledgerEntries: LedgerEntry[] = [];
    let runningBalances: { [key: string]: number } = {};

    // Filter data by date range and additional filters
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      
      // Apply account type filter
      const accountTypeMatch = accountTypeFilter === 'all' || 
        entry.accounts.some(acc => {
          const account = acc.account.toLowerCase();
          switch(accountTypeFilter) {
            case 'asset': return account.includes('asset') || account.includes('cash') || account.includes('bank') || account.includes('inventory');
            case 'liability': return account.includes('liability') || account.includes('payable') || account.includes('loan');
            case 'equity': return account.includes('equity') || account.includes('capital') || account.includes('retained');
            case 'revenue': return account.includes('revenue') || account.includes('sales') || account.includes('income');
            case 'expense': return account.includes('expense') || account.includes('cost') || account.includes('salary');
            default: return true;
          }
        });
      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && accountTypeMatch && amountInRange;
    });

    // Sort by date to ensure proper balance calculation
    const sortedData = filteredData.sort((a, b) => 
      new Date(a.date.toDate()).getTime() - new Date(b.date.toDate()).getTime()
    );

    sortedData.forEach(entry => {
      entry.accounts.forEach(acc => {
        // Filter by selected account if not "all"
        if (selectedAccount !== 'all' && acc.account !== selectedAccount) {
          return;
        }

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
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      
      // Apply account type filter
      const accountTypeMatch = accountTypeFilter === 'all' || 
        entry.accounts.some(acc => {
          const account = acc.account.toLowerCase();
          switch(accountTypeFilter) {
            case 'asset': return account.includes('asset') || account.includes('cash') || account.includes('bank') || account.includes('inventory');
            case 'liability': return account.includes('liability') || account.includes('payable') || account.includes('loan');
            case 'equity': return account.includes('equity') || account.includes('capital') || account.includes('retained');
            case 'revenue': return account.includes('revenue') || account.includes('sales') || account.includes('income');
            case 'expense': return account.includes('expense') || account.includes('cost') || account.includes('salary');
            default: return true;
          }
        });
      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && accountTypeMatch && amountInRange;
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
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      
      // Apply account type filter
      const accountTypeMatch = accountTypeFilter === 'all' || 
        entry.accounts.some(acc => {
          const account = acc.account.toLowerCase();
          switch(accountTypeFilter) {
            case 'asset': return account.includes('asset') || account.includes('cash') || account.includes('bank') || account.includes('inventory');
            case 'liability': return account.includes('liability') || account.includes('payable') || account.includes('loan');
            case 'equity': return account.includes('equity') || account.includes('capital') || account.includes('retained');
            case 'revenue': return account.includes('revenue') || account.includes('sales') || account.includes('income');
            case 'expense': return account.includes('expense') || account.includes('cost') || account.includes('salary');
            default: return true;
          }
        });
      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && accountTypeMatch && amountInRange;
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
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      
      // Apply account type filter
      const accountTypeMatch = accountTypeFilter === 'all' || 
        entry.accounts.some(acc => {
          const account = acc.account.toLowerCase();
          switch(accountTypeFilter) {
            case 'asset': return account.includes('asset') || account.includes('cash') || account.includes('bank') || account.includes('inventory');
            case 'liability': return account.includes('liability') || account.includes('payable') || account.includes('loan');
            case 'equity': return account.includes('equity') || account.includes('capital') || account.includes('retained');
            case 'revenue': return account.includes('revenue') || account.includes('sales') || account.includes('income');
            case 'expense': return account.includes('expense') || account.includes('cost') || account.includes('salary');
            default: return true;
          }
        });
      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && accountTypeMatch && amountInRange;
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
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      
      // Apply account type filter
      const accountTypeMatch = accountTypeFilter === 'all' || 
        entry.accounts.some(acc => {
          const account = acc.account.toLowerCase();
          switch(accountTypeFilter) {
            case 'asset': return account.includes('asset') || account.includes('cash') || account.includes('bank') || account.includes('inventory');
            case 'liability': return account.includes('liability') || account.includes('payable') || account.includes('loan');
            case 'equity': return account.includes('equity') || account.includes('capital') || account.includes('retained');
            case 'revenue': return account.includes('revenue') || account.includes('sales') || account.includes('income');
            case 'expense': return account.includes('expense') || account.includes('cost') || account.includes('salary');
            default: return true;
          }
        });
      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && accountTypeMatch && amountInRange;
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
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      
      // Apply account type filter
      const accountTypeMatch = accountTypeFilter === 'all' || 
        entry.accounts.some(acc => {
          const account = acc.account.toLowerCase();
          switch(accountTypeFilter) {
            case 'asset': return account.includes('asset') || account.includes('cash') || account.includes('bank') || account.includes('inventory');
            case 'liability': return account.includes('liability') || account.includes('payable') || account.includes('loan');
            case 'equity': return account.includes('equity') || account.includes('capital') || account.includes('retained');
            case 'revenue': return account.includes('revenue') || account.includes('sales') || account.includes('income');
            case 'expense': return account.includes('expense') || account.includes('cost') || account.includes('salary');
            default: return true;
          }
        });
      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && accountTypeMatch && amountInRange;
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

  const generateGSTReturn = () => {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const minAmt = minAmount ? parseFloat(minAmount) : 0;
    const maxAmt = maxAmount ? parseFloat(maxAmount) : Infinity;
    
    const filteredData = accountingData.filter(entry => {
      const entryDate = new Date(entry.date.toDate());
      const dateInRange = entryDate >= fromDate && entryDate <= toDate;
      
      // Apply account type filter
      const accountTypeMatch = accountTypeFilter === 'all' || 
        entry.accounts.some(acc => {
          const account = acc.account.toLowerCase();
          switch(accountTypeFilter) {
            case 'asset': return account.includes('asset') || account.includes('cash') || account.includes('bank') || account.includes('inventory');
            case 'liability': return account.includes('liability') || account.includes('payable') || account.includes('loan');
            case 'equity': return account.includes('equity') || account.includes('capital') || account.includes('retained');
            case 'revenue': return account.includes('revenue') || account.includes('sales') || account.includes('income');
            case 'expense': return account.includes('expense') || account.includes('cost') || account.includes('salary');
            default: return true;
          }
        });
      
      // Apply amount range filter
      const amountInRange = entry.accounts.some(acc => 
        (acc.debit >= minAmt && acc.debit <= maxAmt) || 
        (acc.credit >= minAmt && acc.credit <= maxAmt)
      );
      
      return dateInRange && accountTypeMatch && amountInRange;
    });

    const sales: Array<{
      date: Timestamp;
      description: string;
      amount: number;
      gst: number;
      total: number;
    }> = [];
    const purchases: Array<{
      date: Timestamp;
      description: string;
      amount: number;
      gst: number;
      total: number;
    }> = [];
    let totalSalesGST = 0;
    let totalPurchasesGST = 0;
    let totalSales = 0;
    let totalPurchases = 0;

    filteredData.forEach(entry => {
      entry.accounts.forEach(acc => {
        const account = acc.account.toLowerCase();
        const amount = acc.debit || acc.credit;
        
        if (account.includes('sales') || account.includes('revenue') || account.includes('income')) {
          const gstAmount = amount * 0.1; // Assuming 10% GST
          sales.push({
            date: entry.date,
            description: entry.description,
            amount: amount,
            gst: gstAmount,
            total: amount + gstAmount
          });
          totalSales += amount;
          totalSalesGST += gstAmount;
        }
        
        if (account.includes('purchase') || account.includes('expense') || account.includes('cost')) {
          const gstAmount = amount * 0.1; // Assuming 10% GST
          purchases.push({
            date: entry.date,
            description: entry.description,
            amount: amount,
            gst: gstAmount,
            total: amount + gstAmount
          });
          totalPurchases += amount;
          totalPurchasesGST += gstAmount;
        }
      });
    });

    const summary = {
      totalSales,
      totalSalesGST,
      totalPurchases,
      totalPurchasesGST,
      netGST: totalSalesGST - totalPurchasesGST
    };

    setGstReturn({ sales, purchases, summary });
  };

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedAccount('');
    setAccountTypeFilter('all');
    setMinAmount('');
    setMaxAmount('');
  };

  const generateReport = async () => {
    setLoading(true);
    await fetchAccountingData();
    await fetchInventoryData();

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
        case 'gst-return':
          generateGSTReturn();
          break;
        default:
          break;
    }
    setLoading(false);
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
    switch (selectedReport) {
      case 'ledger':
        return ledgerData.map(entry => ({
          Account: entry.account,
          Date: entry.date,
          Description: entry.description,
          Debit: entry.debit.toFixed(2),
          Credit: entry.credit.toFixed(2),
          Balance: entry.balance.toFixed(2)
        }));
      case 'trial-balance':
        return trialBalance.map(entry => ({
          Account: entry.account,
          Debit: entry.debit.toFixed(2),
          Credit: entry.credit.toFixed(2)
        }));
      case 'balance-sheet':
        if (!balanceSheet) return [];
        const bsData: Array<{ Category: string; Account: string; Amount: string }> = [];
        // Assets
        Object.entries(balanceSheet.assets.current).forEach(([key, value]) => {
          bsData.push({ Category: 'Current Assets', Account: key, Amount: (value as number).toFixed(2) });
        });
        Object.entries(balanceSheet.assets.fixed).forEach(([key, value]) => {
          bsData.push({ Category: 'Fixed Assets', Account: key, Amount: (value as number).toFixed(2) });
        });
        // Liabilities
        Object.entries(balanceSheet.liabilities.current).forEach(([key, value]) => {
          bsData.push({ Category: 'Current Liabilities', Account: key, Amount: (value as number).toFixed(2) });
        });
        Object.entries(balanceSheet.liabilities.longTerm).forEach(([key, value]) => {
          bsData.push({ Category: 'Long-term Liabilities', Account: key, Amount: (value as number).toFixed(2) });
        });
        // Equity
        Object.entries(balanceSheet.equity).forEach(([key, value]) => {
          bsData.push({ Category: 'Equity', Account: key, Amount: (value as number).toFixed(2) });
        });
        return bsData;
      case 'profit-loss':
        if (!profitLoss) return [];
        const plData: Array<{ Category: string; Account: string; Amount: string }> = [];
        // Revenue
        Object.entries(profitLoss.revenue).forEach(([key, value]) => {
          plData.push({ Category: 'Revenue', Account: key, Amount: (value as number).toFixed(2) });
        });
        // Expenses
        Object.entries(profitLoss.expenses).forEach(([key, value]) => {
          plData.push({ Category: 'Expenses', Account: key, Amount: (value as number).toFixed(2) });
        });
        // Summary
        plData.push({ Category: 'Summary', Account: 'Gross Profit', Amount: profitLoss.grossProfit.toFixed(2) });
        plData.push({ Category: 'Summary', Account: 'Net Profit', Amount: profitLoss.netProfit.toFixed(2) });
        return plData;
      case 'inventory':
        return inventoryData.map(item => ({
          Name: item.name,
          Quantity: item.quantity,
          'Unit Price': item.unitPrice.toFixed(2),
          'Total Value': item.totalValue.toFixed(2),
          Category: item.category,
          'Last Updated': new Date(item.lastUpdated.toDate()).toLocaleDateString('en-IN')
        }));
      default:
        return [];
    }
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
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger className="bg-white border-gray-300 hover:bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="ledger" className="hover:bg-blue-50">Ledger</SelectItem>
                    <SelectItem value="journal" className="hover:bg-blue-50">Journal</SelectItem>
                    <SelectItem value="trial-balance" className="hover:bg-blue-50">Trial Balance</SelectItem>
                    <SelectItem value="balance-sheet" className="hover:bg-blue-50">Balance Sheet</SelectItem>
                    <SelectItem value="profit-loss" className="hover:bg-blue-50">Profit & Loss</SelectItem>
                    <SelectItem value="cash-flow" className="hover:bg-blue-50">Cash Flow</SelectItem>
                    <SelectItem value="gst-return" className="hover:bg-blue-50">GST Return</SelectItem>
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
              
              {selectedReport === 'ledger' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Account</label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger className="bg-white border-gray-300 hover:bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="all" className="hover:bg-blue-50">All Accounts</SelectItem>
                      {accounts.map(account => (
                        <SelectItem key={account} value={account} className="hover:bg-blue-50">{account}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium mb-2">Account Type</label>
                <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
                  <SelectTrigger className="bg-white border-gray-300 hover:bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all" className="hover:bg-blue-50">All Types</SelectItem>
                    <SelectItem value="asset" className="hover:bg-blue-50">Assets</SelectItem>
                    <SelectItem value="liability" className="hover:bg-blue-50">Liabilities</SelectItem>
                    <SelectItem value="equity" className="hover:bg-blue-50">Equity</SelectItem>
                    <SelectItem value="revenue" className="hover:bg-blue-50">Revenue</SelectItem>
                    <SelectItem value="expense" className="hover:bg-blue-50">Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
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
                    setAccountTypeFilter('all');
                    setMinAmount('');
                    setMaxAmount('');
                    setSelectedAccount('all');
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

            {selectedReport === 'gst-return' && gstReturn && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Sales (Output Tax)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">GST</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gstReturn.sales.map((sale: any, index: number) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">{sale.date}</td>
                              <td className="border border-gray-300 px-4 py-2">{sale.description}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">₹{sale.amount.toLocaleString()}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">₹{sale.gst.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Purchases (Input Tax)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">GST</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gstReturn.purchases.map((purchase: { date: any; description: string; amount: number; gst: number }, index: number) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">{purchase.date}</td>
                              <td className="border border-gray-300 px-4 py-2">{purchase.description}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">₹{purchase.amount.toLocaleString()}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">₹{purchase.gst.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">GST Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Sales GST</p>
                      <p className="text-lg font-semibold">₹{gstReturn.summary.totalSalesGST?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Purchase GST</p>
                      <p className="text-lg font-semibold">₹{gstReturn.summary.totalPurchasesGST?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net GST</p>
                      <p className="text-lg font-semibold">₹{gstReturn.summary.netGST?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-lg font-semibold">
                        {gstReturn.summary.netGST > 0 ? 'Payable' : 'Refundable'}
                      </p>
                    </div>
                  </div>
                </div>
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
                <p>No data available. Click "Generate Report" to fetch data from Firestore.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}