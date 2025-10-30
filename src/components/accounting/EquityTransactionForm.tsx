'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Save, AlertCircle } from 'lucide-react';

interface EquityTransactionFormData {
  type: 'EQUITY';
  date: string;
  amount: number;
  description: string;
  partnerName?: string;
  transactionType?: string;
  equityPercentage?: number;
  notes?: string;
}

interface EquityTransactionFormProps {
  onSubmit: (data: EquityTransactionFormData) => void;
  onBack: () => void;
  editData?: any;
}

export default function EquityTransactionForm({ onSubmit, onBack, editData }: EquityTransactionFormProps) {
  const [formData, setFormData] = useState<EquityTransactionFormData>({
    type: 'EQUITY',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    description: '',
    partnerName: '',
    transactionType: 'CAPITAL_CONTRIBUTION',
    equityPercentage: 0,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editData) {
      setFormData({
        type: 'EQUITY',
        date: editData.date,
        amount: editData.amount,
        description: editData.description || '',
        partnerName: editData.partnerName || '',
        transactionType: editData.transactionType || 'CAPITAL_CONTRIBUTION',
        equityPercentage: editData.equityPercentage || 0,
        notes: editData.notes || ''
      });
    }
  }, [editData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.partnerName?.trim()) {
      newErrors.partnerName = 'Partner name is required';
    }

    if (formData.equityPercentage && (formData.equityPercentage < 0 || formData.equityPercentage > 100)) {
      newErrors.equityPercentage = 'Equity percentage must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof EquityTransactionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const transactionTypes = [
    { value: 'CAPITAL_CONTRIBUTION', label: 'Capital Contribution' },
    { value: 'CAPITAL_WITHDRAWAL', label: 'Capital Withdrawal' },
    { value: 'PROFIT_DISTRIBUTION', label: 'Profit Distribution' },
    { value: 'LOSS_ALLOCATION', label: 'Loss Allocation' },
    { value: 'EQUITY_ADJUSTMENT', label: 'Equity Adjustment' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Equity Transaction</h2>
                <p className="text-sm text-gray-600">Record capital and equity transactions</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type *
              </label>
              <select
                value={formData.transactionType}
                onChange={(e) => handleInputChange('transactionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {transactionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Partner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Partner/Owner Name *
              </label>
              <input
                type="text"
                value={formData.partnerName}
                onChange={(e) => handleInputChange('partnerName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.partnerName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter partner name"
              />
              {errors.partnerName && (
                <p className="text-red-500 text-sm mt-1">{errors.partnerName}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Equity Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equity Percentage (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.equityPercentage}
                onChange={(e) => handleInputChange('equityPercentage', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.equityPercentage ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.equityPercentage && (
                <p className="text-red-500 text-sm mt-1">{errors.equityPercentage}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter transaction description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Additional notes about this transaction..."
            />
          </div>

          {/* Transaction Type Information */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-purple-900 mb-1">Transaction Types:</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li><strong>Capital Contribution:</strong> Money invested by partners</li>
                  <li><strong>Capital Withdrawal:</strong> Money withdrawn by partners</li>
                  <li><strong>Profit Distribution:</strong> Profits shared among partners</li>
                  <li><strong>Loss Allocation:</strong> Losses allocated to partners</li>
                  <li><strong>Equity Adjustment:</strong> Changes in equity structure</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
