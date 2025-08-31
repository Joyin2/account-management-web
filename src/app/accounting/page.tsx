'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, type Transaction as ApiTransaction } from '@/lib/api/transactions';
import TransactionForm from '@/components/accounting/TransactionForm';
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
  Minus
} from 'lucide-react';

interface TransactionCardProps {
  transaction: ApiTransaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

function TransactionCard({ transaction, onEdit, onDelete, onView }: TransactionCardProps) {
  const typeColors = {
    income: 'text-green-600',
    expense: 'text-red-600'
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
            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {transaction.type === 'income' ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
            <p className="text-sm text-gray-600">{transaction.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onView(transaction.id)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(transaction.id)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
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
          <p className={`font-semibold flex items-center ${typeColors[transaction.type]}`}>
            <IndianRupee className="w-3 h-3 mr-1" />
            {transaction.amount.toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Date</p>
          <p className="font-medium text-gray-900 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(transaction.date).toLocaleDateString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Account</p>
          <p className="font-medium text-gray-900 flex items-center">
            <User className="w-3 h-3 mr-1" />
            {transaction.account}
          </p>
        </div>
        {transaction.reference && (
          <div>
            <p className="text-gray-500 mb-1">Reference</p>
            <p className="font-medium text-gray-900 flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              {transaction.reference}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'credit' | 'debit' | 'balance';
  change?: number;
  icon: React.ComponentType<any>;
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

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ApiTransaction | null>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Load transactions on component mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions by category based on active tab
  const currentTransactions = transactions.filter(t => {
    switch (activeTab) {
      case 'buy': return t.category?.toLowerCase().includes('purchase') || t.category?.toLowerCase().includes('buy');
      case 'sell': return t.category?.toLowerCase().includes('sales') || t.category?.toLowerCase().includes('revenue');
      case 'expenditure': return t.type === 'expense' && !t.category?.toLowerCase().includes('purchase');
      case 'capital': return t.category?.toLowerCase().includes('capital');
      case 'bank': return t.account?.toLowerCase().includes('bank');
      case 'loan': return t.category?.toLowerCase().includes('loan');
      default: return true;
    }
  });

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
        const success = await deleteTransaction(id);
        if (success) {
          setTransactions(prev => prev.filter(t => t.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleView = (id: string) => {
    const transaction = currentTransactions.find(t => t.id === id);
    if (transaction) {
      alert(`Transaction Details:\n\nDescription: ${transaction.description}\nAmount: ₹${transaction.amount.toLocaleString()}\nDate: ${transaction.date}\nCategory: ${transaction.category || 'N/A'}\nAccount: ${transaction.account}\nReference: ${transaction.reference || 'N/A'}`);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleSubmitTransaction = async (formData: any) => {
    try {
      setLoading(true);
      
      // Map transaction types to income/expense
      const getTransactionType = (type: string): 'income' | 'expense' => {
        const incomeTypes = ['SELL'];
        const expenseTypes = ['BUY', 'EXPENDITURE', 'CAPITAL_DRAWINGS', 'BANK', 'LOAN'];
        
        if (incomeTypes.includes(type)) return 'income';
        if (expenseTypes.includes(type)) return 'expense';
        return 'expense'; // default
      };

      // Map the new form data structure to the API format
      const transactionData = {
        date: formData.date,
        description: formData.productName || formData.assetName || formData.itemName || formData.expenseType || formData.transactionType || formData.description || 'Transaction',
        amount: formData.amount,
        type: getTransactionType(formData.type),
        category: formData.type,
        account: formData.vendorName || formData.buyerName || formData.paidTo || formData.ownerName || formData.bankName || formData.lenderName || 'General',
        reference: formData.transactionId || formData.remarks || ''
      };
      
      if (editingTransaction) {
        // Update existing transaction
        const updatedTransaction = await updateTransaction(editingTransaction.id, transactionData);
        
        if (updatedTransaction) {
          setTransactions(prev => prev.map(t => 
            t.id === editingTransaction.id ? updatedTransaction : t
          ));
        }
      } else {
        // Add new transaction
        const newTransaction = await createTransaction(transactionData);
        
        if (newTransaction) {
          setTransactions(prev => [...prev, newTransaction]);
        }
      }

      setIsFormOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Failed to save transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary data
  const totalIncome = currentTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = currentTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Income"
            amount={totalIncome}
            type="credit"
            change={12.5}
            icon={TrendingUp}
          />
          <SummaryCard
            title="Total Expense"
            amount={totalExpense}
            type="debit"
            change={-5.2}
            icon={TrendingDown}
          />
          <SummaryCard
            title="Net Balance"
            amount={balance}
            type="balance"
            icon={Minus}
          />
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Transactions
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
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your first transaction.
                </p>
                <button 
                  onClick={handleAddTransaction}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        editData={editingTransaction ? {
          id: editingTransaction.id,
          date: editingTransaction.date,
          description: editingTransaction.description,
          amount: editingTransaction.amount,
          type: editingTransaction.category || 'BUY',
          account: editingTransaction.account,
          reference: editingTransaction.reference
        } : undefined}
      />
    </DashboardLayout>
  );
}