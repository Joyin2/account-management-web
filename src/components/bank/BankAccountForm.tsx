'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { bankService, type BankAccount } from '@/services/bankService';
import { useAuth } from '@/contexts/AuthContext';


import {
  X,
  Building2,
  CreditCard,
  Save,
  AlertCircle
} from 'lucide-react';

interface BankAccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAccount?: BankAccount | null;
}

export default function BankAccountForm({ isOpen, onClose, onSuccess, editingAccount }: BankAccountFormProps) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    accountType: 'SAVINGS' as 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'CREDIT_CARD',
    balance: 0,
    currency: 'INR',
    isActive: true,
    openingDate: new Date().toISOString().split('T')[0],
    ifscCode: '',
    branchName: '',
    contactNumber: '',
    description: ''
  });

  useEffect(() => {
    if (editingAccount) {
      setFormData({
        accountName: editingAccount.accountName,
        accountNumber: editingAccount.accountNumber,
        bankName: editingAccount.bankName,
        accountType: editingAccount.accountType,
        balance: editingAccount.balance,
        currency: editingAccount.currency,
        isActive: editingAccount.isActive,
        openingDate: new Date(editingAccount.openingDate).toISOString().split('T')[0],
        ifscCode: editingAccount.ifscCode || '',
        branchName: editingAccount.branchName || '',
        contactNumber: editingAccount.contactNumber || '',
        description: editingAccount.description || ''
      });
    } else {
      setFormData({
        accountName: '',
        accountNumber: '',
        bankName: '',
        accountType: 'SAVINGS',
        balance: 0,
        currency: 'INR',
        isActive: true,
        openingDate: new Date().toISOString().split('T')[0],
        ifscCode: '',
        branchName: '',
        contactNumber: '',
        description: ''
      });
    }
    setErrors({});
  }, [editingAccount, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (formData.balance < 0 && formData.accountType !== 'CREDIT_CARD') {
      newErrors.balance = 'Balance cannot be negative for this account type';
    }

    if (!formData.openingDate) {
      newErrors.openingDate = 'Opening date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user || !userProfile) return;

    setLoading(true);
    try {
      const accountData = {
        accountName: formData.accountName.trim(),
        accountNumber: formData.accountNumber.trim(),
        bankName: formData.bankName.trim(),
        accountType: formData.accountType,
        balance: formData.balance,
        currency: formData.currency,
        isActive: formData.isActive,
        openingDate: new Date(formData.openingDate).toISOString(),
        userId: user.uid,
        organizationId: user.uid,
        ifscCode: formData.ifscCode.trim(),
        branchName: formData.branchName.trim(),
        contactNumber: formData.contactNumber.trim(),
        description: formData.description.trim()
      };

      if (editingAccount) {
        await bankService.updateAccount(editingAccount.id!, accountData);
      } else {
        await bankService.createAccount(accountData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving bank account:', error);
      setErrors({ submit: 'Failed to save bank account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingAccount ? 'Edit Bank Account' : 'Add Bank Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{errors.submit}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name *
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => handleInputChange('accountName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.accountName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Primary Savings Account"
              />
              {errors.accountName && (
                <p className="text-red-500 text-sm mt-1">{errors.accountName}</p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.accountNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 1234567890"
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
              )}
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bankName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., State Bank of India"
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
              )}
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type *
              </label>
              <select
                value={formData.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SAVINGS">Savings Account</option>
                <option value="CURRENT">Current Account</option>
                <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                <option value="CREDIT_CARD">Credit Card</option>
              </select>
            </div>

            {/* Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Balance *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => handleInputChange('balance', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.balance ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.balance && (
                <p className="text-red-500 text-sm mt-1">{errors.balance}</p>
              )}
            </div>

            {/* Opening Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opening Date *
              </label>
              <input
                type="date"
                value={formData.openingDate}
                onChange={(e) => handleInputChange('openingDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.openingDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.openingDate && (
                <p className="text-red-500 text-sm mt-1">{errors.openingDate}</p>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code
              </label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., SBIN0001234"
              />
            </div>

            {/* Branch Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={(e) => handleInputChange('branchName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Main Branch"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., +91 9876543210"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={() => handleInputChange('isActive', true)}
                    className="mr-2"
                  />
                  Active
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    checked={!formData.isActive}
                    onChange={() => handleInputChange('isActive', false)}
                    className="mr-2"
                  />
                  Inactive
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about this account..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {editingAccount ? 'Update Account' : 'Create Account'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
