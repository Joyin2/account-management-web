'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { transactionService, FirestoreTransaction } from '@/lib/firestore/transactions';
import {
  ShoppingCart,
  Calendar,
  IndianRupee,
  User,
  CreditCard,
  FileText,
  Eye,
  Edit,
  Package
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface PurchaseTransactionsProps {
  className?: string;
}

const PurchaseTransactions: React.FC<PurchaseTransactionsProps> = ({ className = '' }) => {
  const { user, userProfile } = useAuth();
  const [transactions, setTransactions] = useState<FirestoreTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && userProfile) {
      loadPurchaseTransactions();
    }
  }, [user, userProfile]);

  const loadPurchaseTransactions = async () => {
    if (!user || !userProfile) return;
    
    setLoading(true);
    try {
      const allTransactions = await transactionService.getTransactions(user.uid);
      // Filter for BUY transactions with inventory subtype
      const purchaseTransactions = allTransactions.filter(
        (transaction) => transaction.type === 'BUY' && transaction.subType === 'inventory'
      );
      setTransactions(purchaseTransactions);
    } catch (error) {
      console.error('Error loading purchase transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.productName?.toLowerCase().includes(searchLower) ||
      transaction.vendorName?.toLowerCase().includes(searchLower) ||
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.paymentMethod.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (date: Timestamp | Date) => {
    const dateObj = date instanceof Timestamp ? date.toDate() : date;
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleViewTransaction = (transactionId: string) => {
    // Navigate to accounting page with transaction highlighted
    window.open(`/accounting?highlight=${transactionId}`, '_blank');
  };

  const totalPurchaseValue = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalQuantity = filteredTransactions.reduce((sum, transaction) => sum + (transaction.quantity || 0), 0);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Purchase Transactions</h3>
              <p className="text-sm text-gray-600">Inventory purchases from accounting</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500">Total Purchases</p>
              <p className="font-semibold text-gray-900">{filteredTransactions.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Total Quantity</p>
              <p className="font-semibold text-gray-900">{totalQuantity}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Total Value</p>
              <p className="font-semibold text-green-600">{formatCurrency(totalPurchaseValue)}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Package className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product, vendor, or payment method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading purchase transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase transactions found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No transactions match your search criteria.' : 'Purchase transactions will appear here when you create "BUY - Inventory" transactions in the accounting section.'}
            </p>
            <button
              onClick={() => window.open('/accounting', '_blank')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Go to Accounting
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {transaction.productName || 'Product Purchase'}
                          </h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            BUY - Inventory
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{formatDate(transaction.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{formatCurrency(transaction.amount)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{transaction.vendorName || 'Unknown Vendor'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{transaction.paymentMethod}</span>
                          </div>
                        </div>
                        {transaction.quantity && transaction.price && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span>Quantity: {transaction.quantity} × {formatCurrency(transaction.price)} each</span>
                          </div>
                        )}
                        {transaction.remarks && (
                          <div className="mt-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4 inline mr-1" />
                            {transaction.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewTransaction(transaction.id!)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View in Accounting"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseTransactions;