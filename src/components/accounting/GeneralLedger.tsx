'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  Download,
  BookOpen,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// Import service and types
import { doubleEntryService, Account, JournalEntry, JournalEntryLine } from '@/services/doubleEntryService';

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  journalEntryId: string;
}

interface AccountLedger {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  normalBalance: 'DEBIT' | 'CREDIT';
  openingBalance: number;
  closingBalance: number;
  totalDebits: number;
  totalCredits: number;
  entries: LedgerEntry[];
}

interface GeneralLedgerProps {
  organizationId: string;
  userId: string;
}

export default function GeneralLedger({ organizationId, userId }: GeneralLedgerProps) {
  const [ledgers, setLedgers] = useState<AccountLedger[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    loadLedgers();
  }, [organizationId, userId, dateRange]);

  const loadLedgers = async () => {
    setLoading(true);
    try {
      // Load accounts
      const accounts = await doubleEntryService.getAccounts(organizationId);

      // Load journal entries
      const allJournalEntries = await doubleEntryService.getJournalEntries(organizationId);
      
      // Filter journal entries by date range
      const journalEntries = allJournalEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return entryDate >= startDate && entryDate <= endDate;
      });

      // Build ledgers for each account
      const accountLedgers: AccountLedger[] = [];

      for (const account of accounts) {
        const ledgerEntries: LedgerEntry[] = [];
        let runningBalance = 0; // Start with 0, in real system this would be opening balance

        // Get all journal lines for this account
        for (const entry of journalEntries) {
          const lines = await doubleEntryService.getJournalEntryLines(entry.id!);
          const accountLines = lines.filter(line => line.accountId === account.id);

          for (const line of accountLines) {
            // Calculate balance change based on account's normal balance
            let balanceChange = 0;
            if (account.normalBalance === 'DEBIT') {
              balanceChange = line.debitAmount - line.creditAmount;
            } else {
              balanceChange = line.creditAmount - line.debitAmount;
            }

            runningBalance += balanceChange;

            ledgerEntries.push({
              id: line.id!,
              date: entry.date,
              description: line.description,
              reference: entry.entryNumber,
              debitAmount: line.debitAmount,
              creditAmount: line.creditAmount,
              balance: runningBalance,
              journalEntryId: entry.id!
            });
          }
        }

        // Sort entries by date
        ledgerEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Calculate totals
        const totalDebits = ledgerEntries.reduce((sum, entry) => sum + entry.debitAmount, 0);
        const totalCredits = ledgerEntries.reduce((sum, entry) => sum + entry.creditAmount, 0);

        accountLedgers.push({
          accountId: account.id!,
          accountCode: account.accountCode,
          accountName: account.accountName,
          accountType: account.accountType,
          normalBalance: account.normalBalance,
          openingBalance: 0, // In real system, this would be calculated
          closingBalance: account.currentBalance,
          totalDebits,
          totalCredits,
          entries: ledgerEntries
        });
      }

      setLedgers(accountLedgers);
    } catch (error) {
      console.error('Error loading ledgers:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccountExpansion = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
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

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'ASSET': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'LIABILITY': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'EQUITY': return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'REVENUE': return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'EXPENSE': return <TrendingDown className="w-4 h-4 text-orange-600" />;
      default: return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatBalance = (amount: number, normalBalance: 'DEBIT' | 'CREDIT') => {
    const absAmount = Math.abs(amount);
    if (amount === 0) return '₹0.00';
    
    if ((amount > 0 && normalBalance === 'DEBIT') || (amount < 0 && normalBalance === 'CREDIT')) {
      return `₹${absAmount.toLocaleString()}`;
    } else {
      return `(₹${absAmount.toLocaleString()})`;
    }
  };

  const filteredLedgers = ledgers.filter(ledger => {
    const matchesSearch = ledger.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ledger.accountCode.includes(searchTerm);
    const matchesAccount = selectedAccount === '' || ledger.accountId === selectedAccount;
    return matchesSearch && matchesAccount;
  });

  const handleDownloadLedger = () => {
    // Generate and download ledger report
    console.log('Downloading general ledger...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">General Ledger</h3>
            <p className="text-gray-600 mt-1">View account-wise transaction details and running balances</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadLedger}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Ledger
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Accounts</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Accounts</option>
              {ledgers.map((ledger) => (
                <option key={ledger.accountId} value={ledger.accountId}>
                  {ledger.accountCode} - {ledger.accountName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Ledger Accounts */}
        <div className="space-y-4">
          {filteredLedgers.map((ledger) => {
            const isExpanded = expandedAccounts.has(ledger.accountId);
            
            return (
              <div key={ledger.accountId} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Account Header */}
                <div 
                  className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleAccountExpansion(ledger.accountId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        {getAccountTypeIcon(ledger.accountType)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-gray-600">{ledger.accountCode}</span>
                          <span className="font-medium text-gray-900">{ledger.accountName}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getAccountTypeColor(ledger.accountType)}`}>
                            {ledger.accountType}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Normal Balance: {ledger.normalBalance} | Entries: {ledger.entries.length}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Closing Balance</div>
                      <div className="font-medium text-gray-900">
                        {formatBalance(ledger.closingBalance, ledger.normalBalance)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                {isExpanded && (
                  <div className="p-4 bg-white">
                    {/* Summary */}
                    <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Opening Balance</div>
                        <div className="font-medium">{formatBalance(ledger.openingBalance, ledger.normalBalance)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total Debits</div>
                        <div className="font-medium text-green-600">₹{ledger.totalDebits.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total Credits</div>
                        <div className="font-medium text-red-600">₹{ledger.totalCredits.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Closing Balance</div>
                        <div className="font-medium">{formatBalance(ledger.closingBalance, ledger.normalBalance)}</div>
                      </div>
                    </div>

                    {/* Transactions */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 font-medium text-gray-600">Date</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-600">Description</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-600">Reference</th>
                            <th className="text-right py-2 px-3 font-medium text-gray-600">Debit</th>
                            <th className="text-right py-2 px-3 font-medium text-gray-600">Credit</th>
                            <th className="text-right py-2 px-3 font-medium text-gray-600">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Opening Balance Row */}
                          <tr className="border-b border-gray-100 bg-blue-50">
                            <td className="py-2 px-3 text-gray-600">-</td>
                            <td className="py-2 px-3 font-medium">Opening Balance</td>
                            <td className="py-2 px-3 text-gray-600">-</td>
                            <td className="py-2 px-3 text-right">-</td>
                            <td className="py-2 px-3 text-right">-</td>
                            <td className="py-2 px-3 text-right font-medium">
                              {formatBalance(ledger.openingBalance, ledger.normalBalance)}
                            </td>
                          </tr>
                          
                          {/* Transaction Rows */}
                          {ledger.entries.map((entry) => (
                            <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3">{entry.date}</td>
                              <td className="py-2 px-3">{entry.description}</td>
                              <td className="py-2 px-3 font-mono text-xs">{entry.reference}</td>
                              <td className="py-2 px-3 text-right">
                                {entry.debitAmount > 0 ? `₹${entry.debitAmount.toLocaleString()}` : '-'}
                              </td>
                              <td className="py-2 px-3 text-right">
                                {entry.creditAmount > 0 ? `₹${entry.creditAmount.toLocaleString()}` : '-'}
                              </td>
                              <td className="py-2 px-3 text-right font-medium">
                                {formatBalance(entry.balance, ledger.normalBalance)}
                              </td>
                            </tr>
                          ))}
                          
                          {/* Closing Balance Row */}
                          <tr className="border-b border-gray-200 bg-blue-50 font-medium">
                            <td className="py-2 px-3 text-gray-600">-</td>
                            <td className="py-2 px-3">Closing Balance</td>
                            <td className="py-2 px-3 text-gray-600">-</td>
                            <td className="py-2 px-3 text-right">₹{ledger.totalDebits.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right">₹{ledger.totalCredits.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right">
                              {formatBalance(ledger.closingBalance, ledger.normalBalance)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredLedgers.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No ledger entries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedAccount ? 'Try adjusting your search criteria.' : 'Start by creating journal entries.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
