'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BookOpen,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  CreditCard,
  Users,
  Package,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Import service and types
import { doubleEntryService, Account } from '@/services/doubleEntryService';

interface ChartOfAccountsProps {
  organizationId: string;
  userId: string;
  onAccountsUpdated: () => void;
}

export default function ChartOfAccounts({ organizationId, userId, onAccountsUpdated }: ChartOfAccountsProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'ASSET' as 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE',
    subType: '',
    normalBalance: 'DEBIT' as 'DEBIT' | 'CREDIT',
    description: '',
    isActive: true
  });

  // Default chart of accounts structure
  const defaultAccounts: Omit<Account, 'id' | 'organizationId' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
    // ASSETS
    { accountCode: '1000', accountName: 'Cash', accountType: 'ASSET', subType: 'Current Assets', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Cash on hand and in bank' },
    { accountCode: '1100', accountName: 'Accounts Receivable', accountType: 'ASSET', subType: 'Current Assets', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Money owed by customers' },
    { accountCode: '1200', accountName: 'Inventory', accountType: 'ASSET', subType: 'Current Assets', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Goods for sale' },
    { accountCode: '1300', accountName: 'Prepaid Expenses', accountType: 'ASSET', subType: 'Current Assets', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Expenses paid in advance' },
    { accountCode: '1500', accountName: 'Equipment', accountType: 'ASSET', subType: 'Fixed Assets', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Office and business equipment' },
    { accountCode: '1600', accountName: 'Accumulated Depreciation - Equipment', accountType: 'ASSET', subType: 'Fixed Assets', normalBalance: 'CREDIT', currentBalance: 0, isActive: true, description: 'Contra asset account for equipment depreciation' },
    
    // LIABILITIES
    { accountCode: '2000', accountName: 'Accounts Payable', accountType: 'LIABILITY', subType: 'Current Liabilities', normalBalance: 'CREDIT', currentBalance: 0, isActive: true, description: 'Money owed to suppliers' },
    { accountCode: '2100', accountName: 'Accrued Expenses', accountType: 'LIABILITY', subType: 'Current Liabilities', normalBalance: 'CREDIT', currentBalance: 0, isActive: true, description: 'Expenses incurred but not yet paid' },
    { accountCode: '2200', accountName: 'Unearned Revenue', accountType: 'LIABILITY', subType: 'Current Liabilities', normalBalance: 'CREDIT', currentBalance: 0, isActive: true, description: 'Payments received for services not yet provided' },
    { accountCode: '2500', accountName: 'Long-term Debt', accountType: 'LIABILITY', subType: 'Long-term Liabilities', normalBalance: 'CREDIT', currentBalance: 0, isActive: true, description: 'Loans and debt due after one year' },
    
    // EQUITY
    { accountCode: '3000', accountName: 'Owner\'s Capital', accountType: 'EQUITY', subType: 'Owner\'s Equity', normalBalance: 'CREDIT', currentBalance: 0, isActive: true, description: 'Owner\'s investment in the business' },
    { accountCode: '3100', accountName: 'Retained Earnings', accountType: 'EQUITY', subType: 'Owner\'s Equity', normalBalance: 'CREDIT', currentBalance: 0, isActive: true, description: 'Accumulated profits retained in business' },
    { accountCode: '3200', accountName: 'Owner\'s Drawings', accountType: 'EQUITY', subType: 'Owner\'s Equity', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Owner\'s withdrawals from business' },
    
    // REVENUE
    { accountCode: '4000', accountName: 'Sales Revenue', accountType: 'REVENUE', subType: 'Operating Revenue', normalBalance: 'CREDIT', currentBalance: 0, isActive: true, description: 'Revenue from primary business operations' },
    { accountCode: '4100', accountName: 'Service Revenue', accountType: 'REVENUE', subType: 'Operating Revenue', normalBalance: 'CREDIT', currentBalance: 0, isActive: true, description: 'Revenue from services provided' },
    { accountCode: '4200', accountName: 'Interest Income', accountType: 'REVENUE', subType: 'Other Revenue', normalBalance: 'CREDIT', currentBalance: 0, isActive: true, description: 'Interest earned on investments' },
    
    // EXPENSES
    { accountCode: '5000', accountName: 'Cost of Goods Sold', accountType: 'EXPENSE', subType: 'Cost of Sales', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Direct costs of producing goods sold' },
    { accountCode: '6000', accountName: 'Salaries Expense', accountType: 'EXPENSE', subType: 'Operating Expenses', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Employee salaries and wages' },
    { accountCode: '6100', accountName: 'Rent Expense', accountType: 'EXPENSE', subType: 'Operating Expenses', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Office and facility rent' },
    { accountCode: '6200', accountName: 'Utilities Expense', accountType: 'EXPENSE', subType: 'Operating Expenses', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Electricity, water, internet, phone' },
    { accountCode: '6300', accountName: 'Depreciation Expense', accountType: 'EXPENSE', subType: 'Operating Expenses', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Depreciation of fixed assets' },
    { accountCode: '6400', accountName: 'Interest Expense', accountType: 'EXPENSE', subType: 'Financial Expenses', normalBalance: 'DEBIT', currentBalance: 0, isActive: true, description: 'Interest paid on loans and debt' }
  ];

  useEffect(() => {
    loadAccounts();
  }, [organizationId, userId]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const accountsData = await doubleEntryService.getAccountsWithCalculatedBalances(organizationId);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading accounts:', error);
      // Fallback to default accounts for demo
      const accountsWithIds = defaultAccounts.map((account, index) => ({
        ...account,
        id: `account_${index + 1}`,
        organizationId,
        userId,
        createdAt: new Date() as any,
        updatedAt: new Date() as any
      }));
      setAccounts(accountsWithIds);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDefaultAccounts = async () => {
    try {
      setLoading(true);
      await doubleEntryService.createDefaultAccounts(organizationId, userId);
      await loadAccounts();
      onAccountsUpdated();
    } catch (error) {
      console.error('Error creating default accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      accountCode: '',
      accountName: '',
      accountType: 'ASSET',
      subType: '',
      normalBalance: 'DEBIT',
      description: '',
      isActive: true
    });
    setEditingAccount(null);
    setShowForm(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingAccount) {
        // Update existing account
        await doubleEntryService.updateAccount(editingAccount.id!, {
          ...formData,
          organizationId,
          userId,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create new account
        await doubleEntryService.createAccount({
          ...formData,
          organizationId,
          userId,
          currentBalance: 0
        });
      }
      
      await loadAccounts();
      onAccountsUpdated();
      resetForm();
    } catch (error) {
      console.error('Error saving account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccount = (account: Account) => {
    setFormData({
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountType: account.accountType,
      subType: account.subType,
      normalBalance: account.normalBalance,
      description: account.description || '',
      isActive: account.isActive
    });
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        setLoading(true);
        await doubleEntryService.deleteAccount(accountId);
        await loadAccounts();
        onAccountsUpdated();
      } catch (error) {
        console.error('Error deleting account:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCleanupDuplicates = async () => {
    try {
      setLoading(true);
      await doubleEntryService.cleanupDuplicateAccounts(organizationId);
      await loadAccounts();
      onAccountsUpdated();
    } catch (error) {
      console.error('Error cleaning up duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'ASSET': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'LIABILITY': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'EQUITY': return <Users className="w-4 h-4 text-blue-600" />;
      case 'REVENUE': return <DollarSign className="w-4 h-4 text-purple-600" />;
      case 'EXPENSE': return <CreditCard className="w-4 h-4 text-orange-600" />;
      default: return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'ASSET': return 'bg-green-100 text-green-800';
      case 'LIABILITY': return 'bg-red-100 text-red-800';
      case 'EQUITY': return 'bg-blue-100 text-blue-800';
      case 'REVENUE': return 'bg-purple-100 text-purple-800';
      case 'EXPENSE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountCode.includes(searchTerm);
    const matchesFilter = filterType === 'ALL' || account.accountType === filterType;
    return matchesSearch && matchesFilter;
  });

  // Group accounts by type
  const groupedAccounts = filteredAccounts.reduce((groups, account) => {
    const type = account.accountType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {} as Record<string, Account[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Chart of Accounts</h3>
            <p className="text-gray-600 mt-1">Manage your account structure for double-entry bookkeeping</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCreateDefaultAccounts}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Setup Default Accounts
            </button>
            <button
              onClick={handleCleanupDuplicates}
              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Cleanup Duplicates
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Types</option>
              <option value="ASSET">Assets</option>
              <option value="LIABILITY">Liabilities</option>
              <option value="EQUITY">Equity</option>
              <option value="REVENUE">Revenue</option>
              <option value="EXPENSE">Expenses</option>
            </select>
          </div>
        </div>

        {/* Accounts by Type */}
        <div className="space-y-6">
          {Object.entries(groupedAccounts).map(([type, typeAccounts]) => (
            <div key={type} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center">
                  {getAccountTypeIcon(type)}
                  <h4 className="ml-2 font-medium text-gray-900">{type}S</h4>
                  <span className="ml-2 text-sm text-gray-500">({typeAccounts.length} accounts)</span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {typeAccounts.map((account) => (
                  <div key={account.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-mono text-sm text-gray-500 mr-3">{account.accountCode}</span>
                          <span className="font-medium text-gray-900">{account.accountName}</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getAccountTypeColor(account.accountType)}`}>
                            {account.normalBalance}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{account.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span>Balance: ₹{account.currentBalance.toLocaleString()}</span>
                          <span className="mx-2">•</span>
                          <span>{account.subType}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAccount(account.id!)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by setting up your chart of accounts.</p>
            <div className="mt-6">
              <button
                onClick={handleCreateDefaultAccounts}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Setup Default Accounts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingAccount ? 'Edit Account' : 'Add New Account'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Code
                </label>
                <input
                  type="text"
                  value={formData.accountCode}
                  onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    accountType: e.target.value as 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE',
                    normalBalance: ['ASSET', 'EXPENSE'].includes(e.target.value) ? 'DEBIT' : 'CREDIT'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="ASSET">Asset</option>
                  <option value="LIABILITY">Liability</option>
                  <option value="EQUITY">Equity</option>
                  <option value="REVENUE">Revenue</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Type
                </label>
                <input
                  type="text"
                  value={formData.subType}
                  onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Current Asset, Fixed Asset"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Normal Balance
                </label>
                <select
                  value={formData.normalBalance}
                  onChange={(e) => setFormData({ ...formData, normalBalance: e.target.value as 'DEBIT' | 'CREDIT' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="DEBIT">Debit</option>
                  <option value="CREDIT">Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Account description"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active Account
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingAccount ? 'Update Account' : 'Create Account')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
