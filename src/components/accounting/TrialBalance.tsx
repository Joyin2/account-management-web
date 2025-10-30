'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Calendar,
  BarChart3,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  BookOpen,
  RefreshCw
} from 'lucide-react';

// Import service and types
import { doubleEntryService, Account } from '@/services/doubleEntryService';

interface TrialBalanceAccount {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  debitBalance: number;
  creditBalance: number;
}

interface TrialBalanceData {
  asOfDate: string;
  accounts: TrialBalanceAccount[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  difference: number;
}

interface TrialBalanceProps {
  organizationId: string;
  userId: string;
}

export default function TrialBalance({ organizationId, userId }: TrialBalanceProps) {
  const [trialBalance, setTrialBalance] = useState<TrialBalanceData | null>(null);
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [showOnlyNonZero, setShowOnlyNonZero] = useState(true);



  useEffect(() => {
    loadTrialBalance();
  }, [organizationId, userId, asOfDate]);

  const loadTrialBalance = async () => {
    setLoading(true);
    try {
      // Get trial balance from service
      const accounts = await doubleEntryService.getTrialBalance(organizationId, new Date(asOfDate));

      // Convert accounts to trial balance format
      const trialBalanceAccounts: TrialBalanceAccount[] = accounts.map(account => {
        let debitBalance = 0;
        let creditBalance = 0;

        // Determine which side the balance appears on based on account type and balance
        if (account.currentBalance >= 0) {
          if (account.normalBalance === 'DEBIT') {
            debitBalance = account.currentBalance;
          } else {
            creditBalance = account.currentBalance;
          }
        } else {
          // Negative balance appears on opposite side
          if (account.normalBalance === 'DEBIT') {
            creditBalance = Math.abs(account.currentBalance);
          } else {
            debitBalance = Math.abs(account.currentBalance);
          }
        }

        return {
          accountId: account.id!,
          accountCode: account.accountCode,
          accountName: account.accountName,
          accountType: account.accountType,
          debitBalance,
          creditBalance
        };
      });

      // Calculate totals
      const totalDebits = trialBalanceAccounts.reduce((sum, account) => sum + account.debitBalance, 0);
      const totalCredits = trialBalanceAccounts.reduce((sum, account) => sum + account.creditBalance, 0);
      const difference = totalDebits - totalCredits;
      const isBalanced = Math.abs(difference) < 0.01; // Allow for small rounding differences

      setTrialBalance({
        asOfDate,
        accounts: trialBalanceAccounts,
        totalDebits,
        totalCredits,
        isBalanced,
        difference
      });
    } catch (error) {
      console.error('Error loading trial balance:', error);
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

  const filteredAccounts = trialBalance?.accounts.filter(account => {
    if (showOnlyNonZero) {
      return account.debitBalance > 0 || account.creditBalance > 0;
    }
    return true;
  }) || [];

  // Group accounts by type
  const groupedAccounts = filteredAccounts.reduce((groups, account) => {
    const type = account.accountType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {} as Record<string, TrialBalanceAccount[]>);

  const handleDownloadTrialBalance = () => {
    // Generate and download trial balance report
    console.log('Downloading trial balance...');
  };

  const handleRefresh = () => {
    loadTrialBalance();
  };

  if (!trialBalance) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
          <p className="mt-2 text-gray-600">Loading trial balance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trial Balance</h3>
            <p className="text-gray-600 mt-1">Verify that total debits equal total credits</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleDownloadTrialBalance}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">As of Date</label>
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showOnlyNonZero}
                onChange={(e) => setShowOnlyNonZero(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Show only non-zero balances</span>
            </label>
          </div>
        </div>

        {/* Balance Status */}
        <div className="mb-6 p-4 rounded-lg border-2 border-dashed">
          <div className="flex items-center justify-center">
            {trialBalance.isBalanced ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="text-lg font-medium">Trial Balance is Balanced</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-6 h-6 mr-2" />
                <span className="text-lg font-medium">
                  Trial Balance is Out of Balance by ₹{Math.abs(trialBalance.difference).toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-2 space-x-8 text-sm text-gray-600">
            <span>Total Debits: ₹{trialBalance.totalDebits.toLocaleString()}</span>
            <span>Total Credits: ₹{trialBalance.totalCredits.toLocaleString()}</span>
          </div>
        </div>

        {/* Trial Balance Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Account Code</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Account Name</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Debit Balance</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Credit Balance</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedAccounts).map(([type, accounts]) => (
                <React.Fragment key={type}>
                  {/* Type Header */}
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="py-2 px-4">
                      <div className="flex items-center">
                        {getAccountTypeIcon(type)}
                        <span className="ml-2 font-medium text-gray-900">{type}S</span>
                        <span className="ml-2 text-sm text-gray-500">({accounts.length} accounts)</span>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Account Rows */}
                  {accounts.map((account) => (
                    <tr key={account.accountId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm text-gray-600">{account.accountCode}</td>
                      <td className="py-3 px-4 text-gray-900">{account.accountName}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getAccountTypeColor(account.accountType)}`}>
                          {account.accountType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {account.debitBalance > 0 ? `₹${account.debitBalance.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {account.creditBalance > 0 ? `₹${account.creditBalance.toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Type Subtotal */}
                  <tr className="bg-gray-100 font-medium">
                    <td colSpan={3} className="py-2 px-4 text-right">
                      {type} Subtotal:
                    </td>
                    <td className="py-2 px-4 text-right font-mono">
                      ₹{accounts.reduce((sum, acc) => sum + acc.debitBalance, 0).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right font-mono">
                      ₹{accounts.reduce((sum, acc) => sum + acc.creditBalance, 0).toLocaleString()}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              
              {/* Grand Total */}
              <tr className="border-t-2 border-gray-300 bg-gray-200 font-bold text-lg">
                <td colSpan={3} className="py-4 px-4 text-right">
                  TOTAL:
                </td>
                <td className="py-4 px-4 text-right font-mono">
                  ₹{trialBalance.totalDebits.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right font-mono">
                  ₹{trialBalance.totalCredits.toLocaleString()}
                </td>
              </tr>
              
              {/* Difference Row (if not balanced) */}
              {!trialBalance.isBalanced && (
                <tr className="bg-red-50 text-red-800 font-medium">
                  <td colSpan={3} className="py-2 px-4 text-right">
                    DIFFERENCE:
                  </td>
                  <td className="py-2 px-4 text-right font-mono">
                    {trialBalance.difference > 0 ? `₹${trialBalance.difference.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-2 px-4 text-right font-mono">
                    {trialBalance.difference < 0 ? `₹${Math.abs(trialBalance.difference).toLocaleString()}` : '-'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          {Object.entries(groupedAccounts).map(([type, accounts]) => {
            const totalDebits = accounts.reduce((sum, acc) => sum + acc.debitBalance, 0);
            const totalCredits = accounts.reduce((sum, acc) => sum + acc.creditBalance, 0);
            const netAmount = totalDebits - totalCredits;
            
            return (
              <div key={type} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  {getAccountTypeIcon(type)}
                  <span className="ml-2 text-sm font-medium text-gray-700">{type}S</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Debits: ₹{totalDebits.toLocaleString()}</div>
                  <div>Credits: ₹{totalCredits.toLocaleString()}</div>
                  <div className="font-medium">Net: ₹{Math.abs(netAmount).toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {showOnlyNonZero ? 'No accounts with balances found.' : 'No accounts available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
