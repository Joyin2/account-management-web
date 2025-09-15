'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { loanService, type Loan } from '@/services/loanService';
import { useAuth } from '@/contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';

import {
  X,
  CreditCard,
  Save,
  AlertCircle,
  Calculator
} from 'lucide-react';

interface LoanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingLoan?: Loan | null;
}

export default function LoanForm({ isOpen, onClose, onSuccess, editingLoan }: LoanFormProps) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculatedEMI, setCalculatedEMI] = useState<number>(0);

  const [formData, setFormData] = useState({
    loanName: '',
    loanType: 'PERSONAL' as 'PERSONAL' | 'BUSINESS' | 'HOME' | 'CAR' | 'EDUCATION' | 'OTHER',
    principalAmount: 0,
    interestRate: 0,
    tenure: 0,
    startDate: new Date().toISOString().split('T')[0],
    lenderName: '',
    lenderContact: '',
    accountNumber: '',
    purpose: '',
    collateral: '',
    guarantor: '',
    notes: ''
  });

  useEffect(() => {
    if (editingLoan) {
      setFormData({
        loanName: editingLoan.loanName,
        loanType: editingLoan.loanType,
        principalAmount: editingLoan.principalAmount,
        interestRate: editingLoan.interestRate,
        tenure: editingLoan.tenure,
        startDate: editingLoan.startDate.toDate().toISOString().split('T')[0],
        lenderName: editingLoan.lenderName,
        lenderContact: editingLoan.lenderContact || '',
        accountNumber: editingLoan.accountNumber || '',
        purpose: editingLoan.purpose || '',
        collateral: editingLoan.collateral || '',
        guarantor: editingLoan.guarantor || '',
        notes: editingLoan.notes || ''
      });
    } else {
      setFormData({
        loanName: '',
        loanType: 'PERSONAL',
        principalAmount: 0,
        interestRate: 0,
        tenure: 0,
        startDate: new Date().toISOString().split('T')[0],
        lenderName: '',
        lenderContact: '',
        accountNumber: '',
        purpose: '',
        collateral: '',
        guarantor: '',
        notes: ''
      });
    }
    setErrors({});
  }, [editingLoan, isOpen]);

  // Calculate EMI whenever relevant fields change
  useEffect(() => {
    if (formData.principalAmount > 0 && formData.interestRate > 0 && formData.tenure > 0) {
      const monthlyRate = formData.interestRate / 100 / 12;
      const emi = loanService.calculateEMI(formData.principalAmount, monthlyRate, formData.tenure);
      setCalculatedEMI(emi);
    } else {
      setCalculatedEMI(0);
    }
  }, [formData.principalAmount, formData.interestRate, formData.tenure]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.loanName.trim()) {
      newErrors.loanName = 'Loan name is required';
    }

    if (formData.principalAmount <= 0) {
      newErrors.principalAmount = 'Principal amount must be greater than 0';
    }

    if (formData.interestRate < 0) {
      newErrors.interestRate = 'Interest rate cannot be negative';
    }

    if (formData.tenure <= 0) {
      newErrors.tenure = 'Tenure must be greater than 0';
    }

    if (!formData.lenderName.trim()) {
      newErrors.lenderName = 'Lender name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user || !userProfile) return;

    setLoading(true);
    try {
      const loanData = {
        loanName: formData.loanName.trim(),
        loanType: formData.loanType,
        principalAmount: formData.principalAmount,
        interestRate: formData.interestRate,
        tenure: formData.tenure,
        startDate: Timestamp.fromDate(new Date(formData.startDate)),
        lenderName: formData.lenderName.trim(),
        lenderContact: formData.lenderContact.trim(),
        accountNumber: formData.accountNumber.trim(),
        userId: user.uid,
        organizationId: user.uid,
        purpose: formData.purpose.trim(),
        collateral: formData.collateral.trim(),
        guarantor: formData.guarantor.trim(),
        notes: formData.notes.trim()
      };

      if (editingLoan) {
        await loanService.updateLoan(editingLoan.id!, loanData);
      } else {
        await loanService.createLoan(loanData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving loan:', error);
      setErrors({ submit: 'Failed to save loan. Please try again.' });
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

  const totalAmount = calculatedEMI * formData.tenure;
  const totalInterest = totalAmount - formData.principalAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingLoan ? 'Edit Loan' : 'Add New Loan'}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loan Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Name *
                  </label>
                  <input
                    type="text"
                    value={formData.loanName}
                    onChange={(e) => handleInputChange('loanName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.loanName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Home Loan - SBI"
                  />
                  {errors.loanName && (
                    <p className="text-red-500 text-sm mt-1">{errors.loanName}</p>
                  )}
                </div>

                {/* Loan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Type *
                  </label>
                  <select
                    value={formData.loanType}
                    onChange={(e) => handleInputChange('loanType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PERSONAL">Personal Loan</option>
                    <option value="BUSINESS">Business Loan</option>
                    <option value="HOME">Home Loan</option>
                    <option value="CAR">Car Loan</option>
                    <option value="EDUCATION">Education Loan</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Principal Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Principal Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.principalAmount}
                    onChange={(e) => handleInputChange('principalAmount', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.principalAmount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.principalAmount && (
                    <p className="text-red-500 text-sm mt-1">{errors.principalAmount}</p>
                  )}
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (% p.a.) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.interestRate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.interestRate && (
                    <p className="text-red-500 text-sm mt-1">{errors.interestRate}</p>
                  )}
                </div>

                {/* Tenure */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tenure (Months) *
                  </label>
                  <input
                    type="number"
                    value={formData.tenure}
                    onChange={(e) => handleInputChange('tenure', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.tenure ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="12"
                  />
                  {errors.tenure && (
                    <p className="text-red-500 text-sm mt-1">{errors.tenure}</p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.startDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                  )}
                </div>

                {/* Lender Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lender Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lenderName}
                    onChange={(e) => handleInputChange('lenderName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lenderName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., State Bank of India"
                  />
                  {errors.lenderName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lenderName}</p>
                  )}
                </div>

                {/* Lender Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lender Contact
                  </label>
                  <input
                    type="text"
                    value={formData.lenderContact}
                    onChange={(e) => handleInputChange('lenderContact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., +91 9876543210"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., LA1234567890"
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
                    placeholder="e.g., Home purchase"
                  />
                </div>

                {/* Collateral */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collateral
                  </label>
                  <input
                    type="text"
                    value={formData.collateral}
                    onChange={(e) => handleInputChange('collateral', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Property documents"
                  />
                </div>

                {/* Guarantor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guarantor
                  </label>
                  <input
                    type="text"
                    value={formData.guarantor}
                    onChange={(e) => handleInputChange('guarantor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., John Doe"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about this loan..."
                />
              </div>
            </div>

            {/* Right Column - Loan Calculator */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Loan Calculator</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">EMI Amount:</span>
                  <span className="text-lg font-bold text-blue-600">
                    ₹{calculatedEMI.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="text-sm font-medium">
                    ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Interest:</span>
                  <span className="text-sm font-medium text-red-600">
                    ₹{totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Principal:</span>
                  <span className="text-sm font-medium">
                    ₹{formData.principalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tenure:</span>
                  <span className="text-sm font-medium">
                    {formData.tenure} months ({(formData.tenure / 12).toFixed(1)} years)
                  </span>
                </div>
              </div>
            </div>
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
              {editingLoan ? 'Update Loan' : 'Create Loan'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
