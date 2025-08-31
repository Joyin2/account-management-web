'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  CreditCard,
  Building2,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  FileText,
  Calendar,
  IndianRupee,
  Link,
  Unlink
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountType: 'savings' | 'current' | 'cc' | 'od';
  balance: number;
  lastSyncDate: string;
  isActive: boolean;
}

interface BankTransaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  category?: string;
  isReconciled: boolean;
  matchedTransactionId?: string;
  notes?: string;
}

interface ReconciliationMatch {
  bankTransactionId: string;
  accountingTransactionId: string;
  matchType: 'exact' | 'partial' | 'manual';
  confidence: number;
  difference?: number;
}

const sampleBankAccounts: BankAccount[] = [
  {
    id: '1',
    accountName: 'Business Current Account',
    accountNumber: '1234567890',
    bankName: 'HDFC Bank',
    ifscCode: 'HDFC0001234',
    accountType: 'current',
    balance: 250000,
    lastSyncDate: '2024-01-20T10:30:00Z',
    isActive: true
  },
  {
    id: '2',
    accountName: 'Business Savings Account',
    accountNumber: '0987654321',
    bankName: 'ICICI Bank',
    ifscCode: 'ICIC0000123',
    accountType: 'savings',
    balance: 150000,
    lastSyncDate: '2024-01-19T15:45:00Z',
    isActive: true
  },
  {
    id: '3',
    accountName: 'Business Credit Card',
    accountNumber: '4567890123456789',
    bankName: 'SBI Card',
    ifscCode: 'SBIN0001234',
    accountType: 'cc',
    balance: -25000,
    lastSyncDate: '2024-01-18T09:15:00Z',
    isActive: true
  }
];

const sampleBankTransactions: BankTransaction[] = [
  {
    id: '1',
    accountId: '1',
    date: '2024-01-20',
    description: 'Payment from ABC Corp',
    reference: 'TXN123456789',
    debit: 0,
    credit: 50000,
    balance: 250000,
    category: 'Sales Receipt',
    isReconciled: true,
    matchedTransactionId: 'ACC001'
  },
  {
    id: '2',
    accountId: '1',
    date: '2024-01-19',
    description: 'Office Rent Payment',
    reference: 'TXN123456788',
    debit: 25000,
    credit: 0,
    balance: 200000,
    category: 'Rent Expense',
    isReconciled: false
  },
  {
    id: '3',
    accountId: '1',
    date: '2024-01-18',
    description: 'Supplier Payment - XYZ Ltd',
    reference: 'TXN123456787',
    debit: 15000,
    credit: 0,
    balance: 225000,
    category: 'Purchase Payment',
    isReconciled: true,
    matchedTransactionId: 'ACC002'
  },
  {
    id: '4',
    accountId: '2',
    date: '2024-01-17',
    description: 'Interest Credit',
    reference: 'INT202401',
    debit: 0,
    credit: 1500,
    balance: 150000,
    category: 'Interest Income',
    isReconciled: false
  },
  {
    id: '5',
    accountId: '3',
    date: '2024-01-16',
    description: 'Fuel Purchase',
    reference: 'CC123456',
    debit: 5000,
    credit: 0,
    balance: -25000,
    category: 'Fuel Expense',
    isReconciled: false
  }
];

function BankAccountCard({ account, onSync, onEdit, onToggleStatus }: {
  account: BankAccount;
  onSync: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
}) {
  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'savings': return 'Savings';
      case 'current': return 'Current';
      case 'cc': return 'Credit Card';
      case 'od': return 'Overdraft';
      default: return type;
    }
  };

  const getBalanceColor = (balance: number, type: string) => {
    if (type === 'cc') {
      return balance < 0 ? 'text-red-600' : 'text-green-600';
    }
    return balance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">{account.accountName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              account.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {account.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{account.bankName}</p>
          <p className="text-sm text-gray-500">****{account.accountNumber.slice(-4)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Balance</p>
          <p className={`text-xl font-bold ${getBalanceColor(account.balance, account.accountType)}`}>
            ₹{Math.abs(account.balance).toLocaleString()}
            {account.accountType === 'cc' && account.balance < 0 && ' (Due)'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Account Type</p>
          <p className="font-medium text-gray-900">{getAccountTypeLabel(account.accountType)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Last Sync</p>
          <p className="font-medium text-gray-900">
            {new Date(account.lastSyncDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSync(account.id)}
            className="flex items-center px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </button>
          <button
            onClick={() => onEdit(account.id)}
            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Edit Account"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => onToggleStatus(account.id)}
          className={`px-3 py-2 rounded-lg transition-colors ${
            account.isActive 
              ? 'text-red-600 border border-red-600 hover:bg-red-50'
              : 'text-green-600 border border-green-600 hover:bg-green-50'
          }`}
        >
          {account.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </motion.div>
  );
}

function TransactionRow({ transaction, onReconcile, onView, onEdit }: {
  transaction: BankTransaction;
  onReconcile: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          {transaction.isReconciled ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Clock className="w-4 h-4 text-yellow-600" />
          )}
          <span className="text-sm font-medium text-gray-900">
            {new Date(transaction.date).toLocaleDateString()}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div>
          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
          <p className="text-xs text-gray-500">{transaction.reference}</p>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
          {transaction.category || 'Uncategorized'}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        {transaction.debit > 0 && (
          <span className="text-red-600 font-medium">-₹{transaction.debit.toLocaleString()}</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        {transaction.credit > 0 && (
          <span className="text-green-600 font-medium">+₹{transaction.credit.toLocaleString()}</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <span className="font-medium text-gray-900">₹{transaction.balance.toLocaleString()}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(transaction.id)}
            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {!transaction.isReconciled && (
            <button
              onClick={() => onReconcile(transaction.id)}
              className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Reconcile"
            >
              <Link className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(transaction.id)}
            className="p-1 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatsCard({ title, value, icon: Icon, color, subtitle }: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );
}

export default function BankingPage() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'transactions' | 'reconciliation'>('accounts');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accounts, setAccounts] = useState<BankAccount[]>(sampleBankAccounts);
  const [transactions, setTransactions] = useState<BankTransaction[]>(sampleBankTransactions);

  const handleSyncAccount = (id: string) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, lastSyncDate: new Date().toISOString() } : acc
    ));
    console.log('Syncing account:', id);
  };

  const handleEditAccount = (id: string) => {
    console.log('Edit account:', id);
  };

  const handleToggleAccountStatus = (id: string) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, isActive: !acc.isActive } : acc
    ));
  };

  const handleReconcileTransaction = (id: string) => {
    setTransactions(transactions.map(txn => 
      txn.id === id ? { ...txn, isReconciled: true, matchedTransactionId: `ACC${Date.now()}` } : txn
    ));
  };

  const handleViewTransaction = (id: string) => {
    console.log('View transaction:', id);
  };

  const handleEditTransaction = (id: string) => {
    console.log('Edit transaction:', id);
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesAccount = selectedAccount === 'all' || txn.accountId === selectedAccount;
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'reconciled' && txn.isReconciled) ||
                         (statusFilter === 'unreconciled' && !txn.isReconciled);
    return matchesAccount && matchesSearch && matchesStatus;
  });

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalTransactions = transactions.length;
  const reconciledTransactions = transactions.filter(txn => txn.isReconciled).length;
  const unreconciledTransactions = totalTransactions - reconciledTransactions;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Banking</h1>
              <p className="text-gray-600">Manage bank accounts and reconcile transactions</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Import Statement
              </button>
              <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Total Balance"
              value={`₹${totalBalance.toLocaleString()}`}
              icon={IndianRupee}
              color="text-green-600"
            />
            <StatsCard
              title="Active Accounts"
              value={accounts.filter(acc => acc.isActive).length}
              icon={Building2}
              color="text-blue-600"
              subtitle={`${accounts.length} total`}
            />
            <StatsCard
              title="Reconciled"
              value={reconciledTransactions}
              icon={CheckCircle}
              color="text-green-600"
              subtitle={`${totalTransactions} total`}
            />
            <StatsCard
              title="Pending"
              value={unreconciledTransactions}
              icon={Clock}
              color="text-yellow-600"
              subtitle="transactions"
            />
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'accounts', label: 'Bank Accounts', icon: Building2 },
                  { id: 'transactions', label: 'Transactions', icon: ArrowUpDown },
                  { id: 'reconciliation', label: 'Reconciliation', icon: Link }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'accounts' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((account) => (
                      <BankAccountCard
                        key={account.id}
                        account={account}
                        onSync={handleSyncAccount}
                        onEdit={handleEditAccount}
                        onToggleStatus={handleToggleAccountStatus}
                      />
                    ))}
                  </div>
                  
                  {accounts.length === 0 && (
                    <div className="text-center py-12">
                      <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No bank accounts</h3>
                      <p className="text-gray-600 mb-4">Add your first bank account to get started.</p>
                      <button className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Bank Account
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transactions' && (
                <div>
                  {/* Filters */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Accounts</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>{account.accountName}</option>
                      ))}
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="reconciled">Reconciled</option>
                      <option value="unreconciled">Unreconciled</option>
                    </select>
                  </div>

                  {/* Transactions Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Debit</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Credit</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Balance</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((transaction) => (
                          <TransactionRow
                            key={transaction.id}
                            transaction={transaction}
                            onReconcile={handleReconcileTransaction}
                            onView={handleViewTransaction}
                            onEdit={handleEditTransaction}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-12">
                      <ArrowUpDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                      <p className="text-gray-600">Try adjusting your filters or sync your bank accounts.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reconciliation' && (
                <div className="text-center py-12">
                  <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Reconciliation Center</h3>
                  <p className="text-gray-600 mb-4">Advanced reconciliation features coming soon.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Auto-Match</h4>
                      <p className="text-sm text-gray-600">Automatically match transactions based on amount and date</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Manual Review</h4>
                      <p className="text-sm text-gray-600">Review and approve suggested matches</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Bulk Actions</h4>
                      <p className="text-sm text-gray-600">Process multiple reconciliations at once</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}