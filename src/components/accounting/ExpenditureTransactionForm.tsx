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
  Zap,
  Building,
  Users,
  Upload
} from 'lucide-react';

interface ExpenditureTransactionFormProps {
  onSubmit: (data: any) => void;
  onBack?: () => void;
  editData?: any;
}

const expenseTypes = [
  {
    id: 'electricity',
    name: 'Electricity',
    icon: Zap
  },
  {
    id: 'office-rent',
    name: 'Office Rent',
    icon: Building
  },
  {
    id: 'salary',
    name: 'Salary',
    icon: Users
  }
];

const paymentMethods = ['Cash', 'Bank', 'Credit', 'UPI', 'Card', 'Cheque', 'NEFT', 'RTGS'];
const gstTypes = ['Regular', 'Composite'];

export default function ExpenditureTransactionForm({ onSubmit, onBack, editData }: ExpenditureTransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'electricity',
    paymentMethod: 'Cash',
    amount: '',
    paidTo: '',
    gstApplicable: false,
    gstPercentage: '',
    gstn: '',
    gstType: 'Regular',
    bill: null as File | null,
    remarks: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, bill: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      transactionType: 'expenditure'
    });
  };

  const selectedExpenseType = expenseTypes.find(type => type.id === formData.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Expenditure Transaction</h2>
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

          {/* Expense Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expense Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {expenseTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('type', type.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      isSelected ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <div className="text-sm font-medium">{type.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

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

          {/* Paid To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Paid To (Optional)
            </label>
            <input
              type="text"
              value={formData.paidTo}
              onChange={(e) => handleInputChange('paidTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter recipient name"
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

          {/* Upload Bill */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Bill (Optional)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.bill && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {formData.bill.name}
              </p>
            )}
          </div>

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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Save Transaction
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}