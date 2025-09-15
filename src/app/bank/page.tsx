'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { bankService, type BankAccount, type BankTransaction } from '@/services/bankService';
import { useAuth } from '@/contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';
import AuthGuard from '@/components/auth/AuthGuard';

import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Building2,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  IndianRupee,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface BankAccountCardProps {
  account: BankAccount;
  onEdit: (account: BankAccount) => void;
  onDelete: (accountId: string) => void;
  onView: (account: BankAccount) => void;
}

function BankAccountCard({ account, onEdit, onDelete, onView }: BankAccountCardProps) {
  const getAccountTypeIcon = () => {
    switch (account.accountType) {
      case 'SAVINGS': return <Building2 className="w-5 h-5 text-blue-600" />;
      case 'CURRENT': return <Activity className="w-5 h-5 text-green-600" />;
      case 'FIXED_DEPOSIT': return <BarChart3 className="w-5 h-5 text-purple-600" />;
      case 'CREDIT_CARD': return <CreditCard className="w-5 h-5 text-red-600" />;
      default: return <Building2 className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAccountTypeColor = () => {
    switch (account.accountType) {
      case 'SAVINGS': return 'bg-blue-100 text-blue-800';
      case 'CURRENT': return 'bg-green-100 text-green-800';
      case 'FIXED_DEPOSIT': return 'bg-purple-100 text-purple-800';
      case 'CREDIT_CARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getAccountTypeIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{account.accountName}</h3>
            <p className="text-sm text-gray-600">{account.bankName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor()}`}>
            {account.accountType.replace('_', ' ')}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onView(account)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(account)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(account.id!)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Account Number:</span>
          <span className="text-sm font-medium">****{account.accountNumber.slice(-4)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Balance:</span>
          <div className="flex items-center">
            <IndianRupee className="w-4 h-4 text-gray-600 mr-1" />
            <span className={`text-lg font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {account.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  change?: number;
}

function SummaryCard({ title, amount, type, icon: Icon, change }: SummaryCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center mt-2">
            <IndianRupee className="w-5 h-5 text-gray-600 mr-1" />
            <p className="text-2xl font-bold text-gray-900">
              {Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${getTypeStyles()}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function BankPageContent() {
  const { user, userProfile } = useAuth();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    if (user) {
      loadAccounts();
    }
  }, [user]);

  const loadAccounts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const accountsData = await bankService.getAccounts(user.uid);
      setAccounts(accountsData);
      
      if (accountsData.length > 0 && !selectedAccount) {
        setSelectedAccount(accountsData[0]);
        loadTransactions(accountsData[0].id!);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (accountId: string) => {
    setLoading(true);
    try {
      const transactionsData = await bankService.getTransactions(accountId);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelect = (account: BankAccount) => {
    setSelectedAccount(account);
    loadTransactions(account.id!);
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowAccountForm(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setEditingAccount(account);
    setShowAccountForm(true);
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    
    try {
      await bankService.deleteAccount(accountId);
      await loadAccounts();
      
      if (selectedAccount?.id === accountId) {
        setSelectedAccount(null);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleViewAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    loadTransactions(account.id!);
  };

  // Calculate summary data
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const activeAccounts = accounts.filter(account => account.isActive).length;
  const totalAccounts = accounts.length;

  // Filter accounts
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.bankName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || account.accountType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Management</h1>
          <p className="text-gray-600">Manage your bank accounts and transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Import Statement
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={handleAddAccount}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Balance"
          amount={totalBalance}
          type={totalBalance >= 0 ? 'positive' : 'negative'}
          icon={IndianRupee}
          change={5.2}
        />
        <SummaryCard
          title="Active Accounts"
          amount={activeAccounts}
          type="neutral"
          icon={Building2}
        />
        <SummaryCard
          title="Total Accounts"
          amount={totalAccounts}
          type="neutral"
          icon={BarChart3}
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Types</option>
              <option value="SAVINGS">Savings</option>
              <option value="CURRENT">Current</option>
              <option value="FIXED_DEPOSIT">Fixed Deposit</option>
              <option value="CREDIT_CARD">Credit Card</option>
            </select>
          </div>
          <button 
            onClick={loadAccounts}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading accounts...</p>
          </div>
        ) : filteredAccounts.length > 0 ? (
          filteredAccounts.map((account) => (
            <BankAccountCard
              key={account.id}
              account={account}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
              onView={handleViewAccount}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bank accounts found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first bank account.</p>
            <button 
              onClick={handleAddAccount}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Bank Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BankPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <BankPageContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
