'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Download,
  FileText,
  Calculator,
  BarChart3,
  BookOpen,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';

// Import the components we'll create
import ChartOfAccounts from './ChartOfAccounts';
import JournalEntry from './JournalEntry';
import GeneralLedger from './GeneralLedger';
import TrialBalance from './TrialBalance';
import FinancialStatements from './FinancialStatements';
import DoubleEntrySetupWizard from './DoubleEntrySetupWizard';

// Import services and utilities
import { doubleEntryService, Account, JournalEntry as JournalEntryType, JournalEntryLine } from '@/services/doubleEntryService';
import { accountingReports, AccountingReportData } from '@/utils/accountingReports';
import { TransactionService } from '@/lib/firestore/transactions';
import AccountingSystemTest from './AccountingSystemTest';

interface DoubleEntryAccountingProps {
  organizationId: string;
  userId: string;
}

export default function DoubleEntryAccounting({ organizationId, userId }: DoubleEntryAccountingProps) {
  const [activeSubTab, setActiveSubTab] = useState<'journal' | 'ledger' | 'trial-balance' | 'chart-accounts' | 'statements' | 'test'>('journal');
  const [journalEntries, setJournalEntries] = useState<JournalEntryType[]>([]);
  const [journalLines, setJournalLines] = useState<JournalEntryLine[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // Sub-tabs for double-entry system
  const subTabs = [
    {
      id: 'journal',
      label: 'Journal Entries',
      icon: FileText,
      description: 'Record transactions with debits and credits'
    },
    {
      id: 'chart-accounts',
      label: 'Chart of Accounts',
      icon: BookOpen,
      description: 'Manage your account structure'
    },
    {
      id: 'ledger',
      label: 'General Ledger',
      icon: Calculator,
      description: 'View account-wise transactions'
    },
    {
      id: 'trial-balance',
      label: 'Trial Balance',
      icon: BarChart3,
      description: 'Verify debits equal credits'
    },
    {
      id: 'statements',
      label: 'Financial Statements',
      icon: TrendingUp,
      description: 'Generate P&L and Balance Sheet'
    },
    {
      id: 'test',
      label: 'System Test',
      icon: CheckCircle,
      description: 'Test all accounting system functionality'
    }
  ];

  const activeSubTabData = subTabs.find(tab => tab.id === activeSubTab);

  // Load data on component mount
  useEffect(() => {
    loadAccountingData();
  }, [organizationId, userId]);

  // Check if setup is needed
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const existingAccounts = await doubleEntryService.getAccounts(organizationId);
        const existingEntries = await doubleEntryService.getJournalEntries(organizationId);

        // If no accounts or very few journal entries, suggest setup
        if (existingAccounts.length === 0 || existingEntries.length < 3) {
          setIsSetupComplete(false);
        } else {
          setIsSetupComplete(true);
        }
      } catch (error) {
        console.error('Error checking setup status:', error);
      }
    };

    if (organizationId && userId) {
      checkSetupStatus();
    }
  }, [organizationId, userId, accounts.length, journalEntries.length]);

  const loadAccountingData = async () => {
    setLoading(true);
    try {
      // Load accounts
      const accountsData = await doubleEntryService.getAccounts(organizationId);
      setAccounts(accountsData);

      // Load journal entries
      const entriesData = await doubleEntryService.getJournalEntries(organizationId);
      setJournalEntries(entriesData);

      // Load journal lines for all entries
      const linesPromises = entriesData.map(entry =>
        doubleEntryService.getJournalEntryLines(entry.id!)
      );
      const allLines = await Promise.all(linesPromises);
      setJournalLines(allLines.flat());

    } catch (error) {
      console.error('Error loading accounting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncTransactions = async () => {
    try {
      setLoading(true);

      // First ensure default accounts exist
      const existingAccounts = await doubleEntryService.getAccounts(organizationId);
      if (existingAccounts.length === 0) {
        await doubleEntryService.createDefaultAccounts(organizationId, userId);
        alert('Default chart of accounts created. Now syncing transactions...');
      }

      // Sync transactions to journal entries
      const result = await new TransactionService().syncTransactionsToJournalEntries(organizationId);

      if (result.success > 0) {
        alert(`Successfully synced ${result.success} transactions to journal entries.${result.failed > 0 ? ` ${result.failed} transactions failed to sync.` : ''}`);
        // Reload data to show new journal entries
        await loadAccountingData();
      } else {
        alert('No transactions were synced. Please check if you have any transactions to sync.');
      }

      if (result.errors.length > 0) {
        console.error('Sync errors:', result.errors);
      }
    } catch (error) {
      console.error('Error syncing transactions:', error);
      alert('Error syncing transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setLoading(true);

      // Generate comprehensive accounting report package
      const reportData: AccountingReportData = {
        organizationName: 'Your Organization', // TODO: Get from user profile
        reportDate: new Date().toLocaleDateString(),
        reportType: 'Comprehensive Double-Entry Accounting Report',
        accounts,
        journalEntries,
        journalLines
      };

      // Download complete accounting package (multiple files)
      accountingReports.downloadAccountingPackage(reportData);

      alert('Accounting reports package is being downloaded. Multiple files will be downloaded including comprehensive report, chart of accounts, journal entries, trial balance, income statement, and balance sheet.');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Double-Entry Accounting System</h2>
            <p className="text-gray-600 mt-1">
              Complete bookkeeping with journal entries, ledgers, and financial statements
            </p>
          </div>
          <div className="flex space-x-3">
            {!isSetupComplete && (
              <button
                onClick={() => setShowSetupWizard(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Quick Setup
              </button>
            )}
            <button
              onClick={handleSyncTransactions}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Sync Transactions
            </button>
            <button
              onClick={handleDownloadReport}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </button>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-2 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active tab description */}
        {activeSubTabData && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>{activeSubTabData.label}:</strong> {activeSubTabData.description}
            </p>
          </div>
        )}
      </div>

      {/* Content based on active sub-tab */}
      <div className="min-h-[600px]">
        {activeSubTab === 'journal' && (
          <JournalEntry 
            organizationId={organizationId} 
            userId={userId}
            onEntryCreated={loadAccountingData}
          />
        )}
        
        {activeSubTab === 'chart-accounts' && (
          <ChartOfAccounts 
            organizationId={organizationId} 
            userId={userId}
            onAccountsUpdated={loadAccountingData}
          />
        )}
        
        {activeSubTab === 'ledger' && (
          <GeneralLedger 
            organizationId={organizationId} 
            userId={userId}
          />
        )}
        
        {activeSubTab === 'trial-balance' && (
          <TrialBalance 
            organizationId={organizationId} 
            userId={userId}
          />
        )}
        
        {activeSubTab === 'statements' && (
          <FinancialStatements 
            organizationId={organizationId} 
            userId={userId}
          />
        )}
        
        {activeSubTab === 'test' && (
          <AccountingSystemTest 
            organizationId={organizationId} 
            userId={userId}
          />
        )}
      </div>

      {/* Setup Wizard Modal */}
      {showSetupWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Double-Entry Accounting Setup</h3>
              <button
                onClick={() => setShowSetupWizard(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <DoubleEntrySetupWizard
              organizationId={organizationId}
              userId={userId}
              onComplete={() => {
                setShowSetupWizard(false);
                setIsSetupComplete(true);
                loadAccountingData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
