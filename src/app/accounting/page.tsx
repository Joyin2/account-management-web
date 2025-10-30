'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Transaction } from '@/types/transaction';
import { SupabaseService } from '@/services/supabaseService';
// Using native Date objects instead of Firebase Timestamp
import { useAuth } from '@/contexts/AuthContext';
import { accountingInventoryIntegration } from '@/services/accountingInventoryIntegration';
import TransactionForm from '@/components/accounting/TransactionForm';
import DoubleEntryAccounting from '@/components/accounting/DoubleEntryAccounting';
import AuthGuard from '@/components/auth/AuthGuard';

import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  FileText,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Minus,
  ShoppingCart,
  ShoppingBag,
  BarChart3,
  Receipt,
  Wallet,
  Building2,
  CreditCard,
  Users
} from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

function TransactionCard({ transaction, onEdit, onDelete, onView }: TransactionCardProps) {
  const isIncome = transaction.type === 'SELL';
  const transactionDate = new Date(transaction.date);

  // Format transaction type display with subtype
  const getTransactionTypeDisplay = () => {
    if (transaction.sub_type) {
      // Capitalize and format subtype for better display
      const formattedSubType = transaction.sub_type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      return `${transaction.type} - ${formattedSubType}`;
    }
    return transaction.type;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isIncome ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isIncome ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
            <p className="text-sm text-gray-600">{getTransactionTypeDisplay()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onView(transaction.id!)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(transaction.id!)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(transaction.id!)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500 mb-1">Amount</p>
          <p className={`font-semibold flex items-center ${
            isIncome ? 'text-green-600' : 'text-red-600'
          }`}>
            <IndianRupee className="w-3 h-3 mr-1" />
            {transaction.amount.toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Date</p>
          <p className="font-medium text-gray-900 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {transactionDate.toLocaleDateString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Account</p>
          <p className="font-medium text-gray-900 flex items-center">
            <User className="w-3 h-3 mr-1" />
            {transaction.vendor_name || transaction.buyer_name || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Payment Method</p>
          <p className="font-medium text-gray-900 flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            {transaction.payment_method}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'credit' | 'debit' | 'balance';
  change?: number;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

function SummaryCard({ title, amount, type, change, icon: Icon }: SummaryCardProps) {
  const colors = {
    credit: 'text-green-600 bg-green-50 border-green-200',
    debit: 'text-red-600 bg-red-50 border-red-200',
    balance: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  return (
    <div className={`p-6 rounded-lg border ${colors[type]}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-6 h-6 ${type === 'credit' ? 'text-green-600' : type === 'debit' ? 'text-red-600' : 'text-blue-600'}`} />
        {change !== undefined && (
          <span className={`text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className={`text-2xl font-bold flex items-center ${
        type === 'credit' ? 'text-green-600' : type === 'debit' ? 'text-red-600' : 'text-blue-600'
      }`}>
        <IndianRupee className="w-5 h-5 mr-1" />
        {amount.toLocaleString('en-IN')}
      </p>
    </div>
  );
}

// Sample data - in real app, this would come from API
// Sample transactions are now loaded from the API

function AccountingPageContent() {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'double-entry', label: 'Double Entry', icon: FileText },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'expenditure', label: 'Expenditure', icon: Receipt },
    { id: 'capital', label: 'Capital & Drawings', icon: Wallet },
    { id: 'bank', label: 'Bank', icon: Building2 },
    { id: 'loan', label: 'Loan', icon: CreditCard },
    { id: 'equity', label: 'Equity', icon: Users }
  ];

  // Load transactions on component mount
  useEffect(() => {
    if (user && userProfile) {
      loadTransactions();
    }
  }, [user, userProfile]);

  const loadTransactions = async () => {
    if (!user || !userProfile) {
      console.log('DEBUG: loadTransactions called but user or userProfile is missing', { user: !!user, userProfile: !!userProfile });
      return;
    }
    
    try {
      console.log('DEBUG: Starting to load transactions for user:', user.id);
      setLoading(true);
      // Use user's ID as organization ID for now
      const data = await SupabaseService.getTransactions(user.id);
      console.log('DEBUG: Transactions loaded successfully:', { count: data.length, data });
      setTransactions(data);
    } catch (error) {
      console.error('DEBUG: Failed to load transactions:', error);
      console.error('DEBUG: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userId: user.id
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions by type based on active tab
  const currentTransactions = transactions.filter(t => {
    switch (activeTab) {
      case 'sales': return t.type === 'SELL';
      case 'purchases': return t.type === 'BUY';
      case 'expenditure': return t.type === 'EXPENDITURE';
      case 'capital': return t.type === 'CAPITAL_DRAWINGS';
      case 'bank': return t.type === 'BANK';
      case 'loan': return t.type === 'LOAN';
      case 'equity': return t.type === 'EQUITY';
      case 'overview': return true;
      default: return true;
    }
  });

  // Get transaction data by type
  const salesTransactions = transactions.filter(t => t.type === 'SELL');
  const purchasesTransactions = transactions.filter(t => t.type === 'BUY');
  const expenditureTransactions = transactions.filter(t => t.type === 'EXPENDITURE');
  const capitalTransactions = transactions.filter(t => t.type === 'CAPITAL_DRAWINGS');
  const bankTransactions = transactions.filter(t => t.type === 'BANK');
  const loanTransactions = transactions.filter(t => t.type === 'LOAN');
  const allTransactions = transactions;

  const handleEdit = (id: string) => {
    const transaction = currentTransactions.find(t => t.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setIsFormOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        setLoading(true);
        await transactionService.deleteTransaction(id);
        setTransactions(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        alert('Failed to delete transaction. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleView = (id: string) => {
    const transaction = currentTransactions.find(t => t.id === id);
    if (transaction) {
      const date = transaction.date.toDate().toLocaleDateString();
      alert(`Transaction Details:\n\nDescription: ${transaction.description}\nAmount: ₹${transaction.amount.toLocaleString()}\nDate: ${date}\nType: ${transaction.type}\nPayment Method: ${transaction.payment_method || 'N/A'}\nRemarks: ${transaction.remarks || 'N/A'}`);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleSubmitTransaction = async (formData: { type: string; date: string; amount: number; description?: string; [key: string]: unknown }) => {
    if (!user || !userProfile) {
      alert('Please log in to save transactions.');
      return;
    }

    try {
      setLoading(true);
      
      // Validate amount before processing
      const amount = Number(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid positive amount');
      }
      
      // Create Supabase transaction data with proper validation
      const baseTransactionData = {
        date: new Date(formData.date).toISOString(),
        type: formData.type as 'BUY' | 'SELL' | 'EXPENDITURE' | 'CAPITAL_DRAWINGS' | 'BANK' | 'LOAN',
        amount: amount, // Use validated number
        description: String(formData.productName || formData.assetName || formData.expenseType || formData.description || 'Transaction'),
        payment_method: String(formData.paymentMethod || 'Cash'),
        paymentMethod: String(formData.paymentMethod || 'Cash'),
        category: String(formData.type || 'General'),
        transactionType: (formData.type === 'SELL' ? 'income' : 'expense') as 'income' | 'expense' | 'transfer',
        gst_applicable: Boolean(formData.gstApplicable),
        user_id: user.id,
        organization_id: user.id, // Using user ID as org ID for now
      };

      // Add optional fields only if they have valid values
      const transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
        ...baseTransactionData,
        ...(formData.subType && String(formData.subType).trim() ? { sub_type: String(formData.subType) } : {}),
        ...(formData.vendorName && String(formData.vendorName).trim() ? { vendor_name: String(formData.vendorName) } : {}),
        ...(formData.buyerName && String(formData.buyerName).trim() ? { buyer_name: String(formData.buyerName) } : {}),
        ...(formData.gstn && String(formData.gstn).trim() ? { gstn: String(formData.gstn) } : {}),
        ...(formData.gstType && String(formData.gstType).trim() ? { gst_type: formData.gstType as 'Regular' | 'Composite' } : {}),
        ...(formData.remarks && String(formData.remarks).trim() ? { remarks: String(formData.remarks) } : {}),
        ...(formData.importExportTax && Number(formData.importExportTax) > 0 ? { import_export_tax: Number(formData.importExportTax) } : {}),
        // Type-specific fields
        ...(formData.productName && String(formData.productName).trim() ? { product_name: String(formData.productName) } : {}),
        ...(formData.quantity && Number(formData.quantity) > 0 ? { quantity: Number(formData.quantity) } : {}),
        ...(formData.price && Number(formData.price) > 0 ? { price: Number(formData.price) } : {}),
        ...(formData.assetName && String(formData.assetName).trim() ? { asset_name: String(formData.assetName) } : {}),
        ...(formData.expenseType && String(formData.expenseType).trim() ? { expense_type: String(formData.expenseType) } : {}),
        ...(formData.paidTo && String(formData.paidTo).trim() ? { paid_to: String(formData.paidTo) } : {}),
        ...(formData.billUrl && String(formData.billUrl).trim() ? { bill_url: String(formData.billUrl) } : {}),
        ...(formData.partnerOwner && String(formData.partnerOwner).trim() ? { partner_owner: String(formData.partnerOwner) } : {}),
        ...(formData.bankAccount && String(formData.bankAccount).trim() ? { bank_account: String(formData.bankAccount) } : {}),
        ...(formData.transactionType && String(formData.transactionType).trim() ? { transaction_type: String(formData.transactionType) } : {}),
        ...(formData.loanProvider && String(formData.loanProvider).trim() ? { loan_provider: String(formData.loanProvider) } : {}),
        ...(formData.interestRate && Number(formData.interestRate) > 0 ? { interest_rate: Number(formData.interestRate) } : {}),
        ...(formData.emiAmount && Number(formData.emiAmount) > 0 ? { emi_amount: Number(formData.emiAmount) } : {}),
      };
      
      // Add gstType only if GST is applicable and gstType is provided
      if (formData.gstApplicable && formData.gstType) {
        transactionData.gst_type = formData.gstType as 'Regular' | 'Composite';
      }
      
      // Add interest_rate for LOAN transactions if not provided
      if (transactionData.type === 'LOAN' && !formData.interestRate) {
        transactionData.interest_rate = 0;
      }
      

      
      if (editingTransaction && editingTransaction.id) {
        // Update existing transaction
        await transactionService.updateTransaction(editingTransaction.id, transactionData);
        // Reload transactions to get updated data
        await loadTransactions();
      } else {
        // Add new transaction
        const transactionId = await transactionService.createTransaction(transactionData);
        
        // TODO: Update inventory integration for Supabase
        // If this is a "Buy - Inventory" transaction, also create/update inventory
        if (transactionData.type === 'BUY' && transactionData.sub_type === 'inventory') {
          console.log('Inventory integration temporarily disabled during Supabase migration');
          // TODO: Implement Supabase-compatible inventory integration
        }
        
        // Reload transactions to get new data
        await loadTransactions();
      }

      setIsFormOpen(false);
      setEditingTransaction(null);
      alert('Transaction saved successfully!');
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert(`Failed to save transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary data based on active tab
  const getSummaryData = () => {
    switch (activeTab) {
      case 'sales':
        const totalSales = salesTransactions.reduce((sum, t) => sum + t.amount, 0);
        const salesCount = salesTransactions.length;
        const avgSaleAmount = salesCount > 0 ? totalSales / salesCount : 0;
        return {
          primary: { title: 'Total Sales', amount: totalSales, type: 'credit' as const, icon: TrendingUp },
          secondary: { title: 'Sales Count', amount: salesCount, type: 'balance' as const, icon: ShoppingCart },
          tertiary: { title: 'Avg Sale Amount', amount: avgSaleAmount, type: 'balance' as const, icon: BarChart3 }
        };
      case 'purchases':
        const totalPurchases = purchasesTransactions.reduce((sum, t) => sum + t.amount, 0);
        const purchasesCount = purchasesTransactions.length;
        const avgPurchaseAmount = purchasesCount > 0 ? totalPurchases / purchasesCount : 0;
        return {
          primary: { title: 'Total Purchases', amount: totalPurchases, type: 'debit' as const, icon: TrendingDown },
          secondary: { title: 'Purchase Count', amount: purchasesCount, type: 'balance' as const, icon: ShoppingBag },
          tertiary: { title: 'Avg Purchase Amount', amount: avgPurchaseAmount, type: 'balance' as const, icon: BarChart3 }
        };
      case 'expenditure':
        const totalExpenditure = expenditureTransactions.reduce((sum, t) => sum + t.amount, 0);
        const expenditureCount = expenditureTransactions.length;
        const avgExpenditureAmount = expenditureCount > 0 ? totalExpenditure / expenditureCount : 0;
        return {
          primary: { title: 'Total Expenses', amount: totalExpenditure, type: 'debit' as const, icon: TrendingDown },
          secondary: { title: 'Expense Count', amount: expenditureCount, type: 'balance' as const, icon: Receipt },
          tertiary: { title: 'Avg Expense Amount', amount: avgExpenditureAmount, type: 'balance' as const, icon: BarChart3 }
        };
      case 'capital':
        const totalCapital = capitalTransactions.reduce((sum, t) => sum + t.amount, 0);
        const capitalCount = capitalTransactions.length;
        const avgCapitalAmount = capitalCount > 0 ? totalCapital / capitalCount : 0;
        return {
          primary: { title: 'Total Capital & Drawings', amount: totalCapital, type: 'balance' as const, icon: Wallet },
          secondary: { title: 'Capital Transactions', amount: capitalCount, type: 'balance' as const, icon: Wallet },
          tertiary: { title: 'Avg Transaction Amount', amount: avgCapitalAmount, type: 'balance' as const, icon: BarChart3 }
        };
      case 'bank':
        const totalBank = bankTransactions.reduce((sum, t) => sum + t.amount, 0);
        const bankCount = bankTransactions.length;
        const avgBankAmount = bankCount > 0 ? totalBank / bankCount : 0;
        return {
          primary: { title: 'Total Bank Transactions', amount: totalBank, type: 'balance' as const, icon: Building2 },
          secondary: { title: 'Bank Transaction Count', amount: bankCount, type: 'balance' as const, icon: Building2 },
          tertiary: { title: 'Avg Transaction Amount', amount: avgBankAmount, type: 'balance' as const, icon: BarChart3 }
        };
      case 'loan':
        const totalLoan = loanTransactions.reduce((sum, t) => sum + t.amount, 0);
        const loanCount = loanTransactions.length;
        const avgLoanAmount = loanCount > 0 ? totalLoan / loanCount : 0;
        return {
          primary: { title: 'Total Loan Transactions', amount: totalLoan, type: 'debit' as const, icon: CreditCard },
          secondary: { title: 'Loan Transaction Count', amount: loanCount, type: 'balance' as const, icon: CreditCard },
          tertiary: { title: 'Avg Loan Amount', amount: avgLoanAmount, type: 'balance' as const, icon: BarChart3 }
        };
      default: // overview
        const totalIncome = allTransactions.filter(t => t.type === 'SELL').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = allTransactions.filter(t => ['BUY', 'EXPENDITURE', 'LOAN'].includes(t.type)).reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpense;
        return {
          primary: { title: 'Total Income', amount: totalIncome, type: 'credit' as const, icon: TrendingUp },
          secondary: { title: 'Total Expense', amount: totalExpense, type: 'debit' as const, icon: TrendingDown },
          tertiary: { title: 'Net Balance', amount: balance, type: 'balance' as const, icon: Minus }
        };
    }
  };

  const summaryData = getSummaryData();

  return (
    <DashboardLayout title="Accounting">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Accounting</h1>
              <p className="text-gray-600 mt-1">
                Streamlined financial overview and transaction management
              </p>
            </div>
            <button 
              onClick={handleAddTransaction}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Transaction
            </button>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title={summaryData.primary.title}
            amount={summaryData.primary.amount}
            type={summaryData.primary.type}
            change={activeTab === 'overview' ? 12.5 : undefined}
            icon={summaryData.primary.icon}
          />
          <SummaryCard
            title={summaryData.secondary.title}
            amount={summaryData.secondary.amount}
            type={summaryData.secondary.type}
            change={activeTab === 'overview' ? -5.2 : undefined}
            icon={summaryData.secondary.icon}
          />
          <SummaryCard
            title={summaryData.tertiary.title}
            amount={summaryData.tertiary.amount}
            type={summaryData.tertiary.type}
            icon={summaryData.tertiary.icon}
          />
        </div>

        {/* Double Entry Accounting System */}
        {activeTab === 'double-entry' && (
          <DoubleEntryAccounting
            organizationId={userProfile?.organization_id || user?.id || ''}
            userId={user?.id || ''}
          />
        )}

        {/* Transactions List */}
        {activeTab !== 'double-entry' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === 'sales' ? 'Sales Transactions' :
                 activeTab === 'purchases' ? 'Purchase Transactions' :
                 activeTab === 'expenditure' ? 'Expense Transactions' :
                 activeTab === 'capital' ? 'Capital and Drawings' :
                 activeTab === 'bank' ? 'Banking Transactions' :
                 activeTab === 'loan' ? 'Loan Transactions' :
                 activeTab === 'equity' ? 'Equity Transactions' :
                 'Recent Transactions'}
              </h2>
              <button 
                onClick={handleAddTransaction}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {currentTransactions.length > 0 ? (
              <div className="space-y-4">
                {currentTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'sales' ? (
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  ) : activeTab === 'purchases' ? (
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  ) : activeTab === 'expenditure' ? (
                    <Receipt className="w-8 h-8 text-gray-400" />
                  ) : activeTab === 'capital' ? (
                    <Wallet className="w-8 h-8 text-gray-400" />
                  ) : activeTab === 'bank' ? (
                    <Building2 className="w-8 h-8 text-gray-400" />
                  ) : activeTab === 'loan' ? (
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  ) : activeTab === 'equity' ? (
                    <Users className="w-8 h-8 text-gray-400" />
                  ) : (
                    <FileText className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'sales' ? 'No sales transactions found' :
                   activeTab === 'purchases' ? 'No purchase transactions found' :
                   activeTab === 'expenditure' ? 'No expense transactions found' :
                   activeTab === 'capital' ? 'No capital transactions found' :
                   activeTab === 'bank' ? 'No banking transactions found' :
                   activeTab === 'loan' ? 'No loan transactions found' :
                   activeTab === 'equity' ? 'No equity transactions found' :
                   'No transactions found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'sales' ? 'Start by recording your first sale.' :
                   activeTab === 'purchases' ? 'Start by recording your first purchase.' :
                   activeTab === 'expenditure' ? 'Start by recording your first expense.' :
                   activeTab === 'capital' ? 'Start by recording your first capital transaction.' :
                   activeTab === 'bank' ? 'Start by recording your first banking transaction.' :
                   activeTab === 'loan' ? 'Start by recording your first loan transaction.' :
                   activeTab === 'equity' ? 'Start by recording your first equity transaction.' :
                   'Start by adding your first transaction.'}
                </p>
                <button 
                  onClick={handleAddTransaction}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {activeTab === 'sales' ? 'Add Sale' :
                   activeTab === 'purchases' ? 'Add Purchase' :
                   activeTab === 'expenditure' ? 'Add Expense' :
                   activeTab === 'capital' ? 'Add Capital Transaction' :
                   activeTab === 'bank' ? 'Add Banking Transaction' :
                   activeTab === 'loan' ? 'Add Loan Transaction' :
                   activeTab === 'equity' ? 'Add Equity Transaction' :
                   'Add Transaction'}
                </button>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Transaction Form Modal */}
        <TransactionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        editData={editingTransaction ? {
          type: editingTransaction.type as 'BUY' | 'SELL' | 'EXPENDITURE' | 'CAPITAL_DRAWINGS' | 'BANK' | 'LOAN' | 'EQUITY',
          date: editingTransaction.date.toDate().toISOString().split('T')[0],
          amount: editingTransaction.amount,
          description: editingTransaction.description,
          // Map Supabase fields to form fields
          vendorName: editingTransaction.vendor_name,
          buyerName: editingTransaction.buyer_name,
          paymentMethod: editingTransaction.payment_method,
          gstApplicable: editingTransaction.gst_applicable,
          gstn: editingTransaction.gstn,
          gstType: editingTransaction.gst_type,
          remarks: editingTransaction.remarks,
          subType: editingTransaction.sub_type,
          productName: editingTransaction.product_name,
          quantity: editingTransaction.quantity,
          price: editingTransaction.price,
          assetName: editingTransaction.asset_name,
          expenseType: editingTransaction.expense_type,
          paidTo: editingTransaction.paid_to,
          billUrl: editingTransaction.bill_url,
          partnerOwner: editingTransaction.partner_owner,
          bankAccount: editingTransaction.bank_account,
          transactionType: editingTransaction.transaction_type,
          loanProvider: editingTransaction.loan_provider,
          interestRate: editingTransaction.interest_rate,
          emiAmount: editingTransaction.emi_amount
        } : undefined}
      />
      </div>

    </DashboardLayout>
  );
}

export default function AccountingPage() {
  return (
    <AuthGuard>
      <AccountingPageContent />
    </AuthGuard>
  );
}