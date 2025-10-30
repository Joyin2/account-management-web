'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  User,
  CreditCard,
  DollarSign,
  FileText,
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Building,
  Hash
} from 'lucide-react';

interface BankTransactionFormProps {
  onSubmit: (data: any) => void;
  onBack?: () => void;
  editData?: any;
}

const transactionTypes = [
  {
    id: 'deposit',
    name: 'Deposit',
    description: 'Money deposited to bank',
    icon: ArrowDownLeft,
    color: 'green'
  },
  {
    id: 'withdrawal',
    name: 'Withdrawal',
    description: 'Money withdrawn from bank',
    icon: ArrowUpRight,
    color: 'red'
  },
  {
    id: 'transfer',
    name: 'Transfer',
    description: 'Transfer between accounts',
    icon: CreditCard,
    color: 'blue'
  }
];

const gstTypes = ['Regular', 'Composite'];

export default function BankTransactionForm({ onSubmit, onBack, editData }: BankTransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'deposit',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    amount: '',
    transactionId: '',
    purpose: '',
    fromAccount: '',
    toAccount: '',
    partyName: '',
    gstApplicable: false,
    gstPercentage: '',
    gstn: '',
    gstType: 'Regular',
    remarks: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      transactionType: 'bank'
    });
  };

  const selectedType = transactionTypes.find(type => type.id === formData.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Bank Transaction</h2>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {transactionTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('type', type.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      isSelected ? `text-${type.color}-600` : 'text-gray-500'
                    }`} />
                    <div className="text-sm font-medium">{type.name}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bank Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter bank name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter account number"
                required
              />
            </div>
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IFSC Code
            </label>
            <input
              type="text"
              value={formData.ifscCode}
              onChange={(e) => handleInputChange('ifscCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter IFSC code"
              required
            />
          </div>

          {/* Transfer specific fields */}
          {formData.type === 'transfer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Account
                </label>
                <input
                  type="text"
                  value={formData.fromAccount}
                  onChange={(e) => handleInputChange('fromAccount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Source account"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Account
                </label>
                <input
                  type="text"
                  value={formData.toAccount}
                  onChange={(e) => handleInputChange('toAccount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Destination account"
                  required
                />
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID (Optional)
            </label>
            <input
              type="text"
              value={formData.transactionId}
              onChange={(e) => handleInputChange('transactionId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter transaction ID"
            />
          </div>

          {/* Party Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Party Name (Optional)
            </label>
            <input
              type="text"
              value={formData.partyName}
              onChange={(e) => handleInputChange('partyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter party name"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose
            </label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Purpose of transaction"
              required
            />
          </div>

          {/* GST Applicable */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.gstApplicable}
                onChange={(e) => handleInputChange('gstApplicable', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">GST Applicable</span>
            </label>
          </div>

          {/* GST Details */}
          {formData.gstApplicable && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Percentage
                </label>
                <input
                  type="number"
                  value={formData.gstPercentage}
                  onChange={(e) => handleInputChange('gstPercentage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter GST percentage"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GSTN
                </label>
                <input
                  type="text"
                  value={formData.gstn}
                  onChange={(e) => handleInputChange('gstn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter GSTN"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of GST
                </label>
                <select
                  value={formData.gstType}
                  onChange={(e) => handleInputChange('gstType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {gstTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Remarks - IMPORT/EXPORT TAX
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter remarks"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
            )}
            <div className="flex space-x-3 ml-auto">
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                formData.type === 'deposit'
                  ? 'bg-green-600 hover:bg-green-700'
                  : formData.type === 'withdrawal'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Save {selectedType?.name} Transaction
            </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}