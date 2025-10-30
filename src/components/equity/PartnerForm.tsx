'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { equityService, type Partner } from '@/services/equityService';
import { useAuth } from '@/contexts/AuthContext';
// Using native Date objects instead of Firebase Timestamp


import {
  X,
  Users,
  Save,
  AlertCircle,
  User,
  Award,
  Building,
  TrendingUp
} from 'lucide-react';

interface PartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingPartner?: Partner | null;
}

export default function PartnerForm({ isOpen, onClose, onSuccess, editingPartner }: PartnerFormProps) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    partnerType: 'PARTNER' as 'OWNER' | 'PARTNER' | 'INVESTOR' | 'SHAREHOLDER',
    joinDate: new Date().toISOString().split('T')[0],
    isActive: true,
    equityPercentage: 0,
    initialCapital: 0,
    panNumber: '',
    aadharNumber: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
    notes: ''
  });

  useEffect(() => {
    if (editingPartner) {
      setFormData({
        name: editingPartner.name,
        email: editingPartner.email || '',
        phone: editingPartner.phone || '',
        address: editingPartner.address || '',
        partnerType: editingPartner.partnerType,
        joinDate: editingPartner.joinDate.toDate().toISOString().split('T')[0],
        isActive: editingPartner.isActive,
        equityPercentage: editingPartner.equityPercentage,
        initialCapital: editingPartner.initialCapital,
        panNumber: editingPartner.panNumber || '',
        aadharNumber: editingPartner.aadharNumber || '',
        bankAccountNumber: editingPartner.bankDetails?.accountNumber || '',
        bankName: editingPartner.bankDetails?.bankName || '',
        ifscCode: editingPartner.bankDetails?.ifscCode || '',
        notes: editingPartner.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        partnerType: 'PARTNER',
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true,
        equityPercentage: 0,
        initialCapital: 0,
        panNumber: '',
        aadharNumber: '',
        bankAccountNumber: '',
        bankName: '',
        ifscCode: '',
        notes: ''
      });
    }
    setErrors({});
  }, [editingPartner, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.equityPercentage < 0 || formData.equityPercentage > 100) {
      newErrors.equityPercentage = 'Equity percentage must be between 0 and 100';
    }

    if (formData.initialCapital < 0) {
      newErrors.initialCapital = 'Initial capital cannot be negative';
    }

    if (!formData.joinDate) {
      newErrors.joinDate = 'Join date is required';
    }

    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
    }

    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ''))) {
      newErrors.aadharNumber = 'Please enter a valid 12-digit Aadhar number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user || !userProfile) return;

    setLoading(true);
    try {
      const partnerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        partnerType: formData.partnerType,
        joinDate: Timestamp.fromDate(new Date(formData.joinDate)),
        isActive: formData.isActive,
        equityPercentage: formData.equityPercentage,
        initialCapital: formData.initialCapital,
        userId: user.uid,
        organizationId: user.uid,
        panNumber: formData.panNumber.trim().toUpperCase(),
        aadharNumber: formData.aadharNumber.trim(),
        bankDetails: formData.bankAccountNumber.trim() ? {
          accountNumber: formData.bankAccountNumber.trim(),
          bankName: formData.bankName.trim(),
          ifscCode: formData.ifscCode.trim().toUpperCase()
        } : undefined,
        notes: formData.notes.trim()
      };

      if (editingPartner) {
        await equityService.updatePartner(editingPartner.id!, partnerData);
      } else {
        await equityService.createPartner(partnerData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving partner:', error);
      setErrors({ submit: 'Failed to save partner. Please try again.' });
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

  const getPartnerTypeIcon = () => {
    switch (formData.partnerType) {
      case 'OWNER': return <Award className="w-5 h-5 text-purple-600" />;
      case 'PARTNER': return <Users className="w-5 h-5 text-blue-600" />;
      case 'INVESTOR': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'SHAREHOLDER': return <Building className="w-5 h-5 text-orange-600" />;
      default: return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

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
              {getPartnerTypeIcon()}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingPartner ? 'Edit Partner' : 'Add New Partner'}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>

                {/* Partner Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Type *
                  </label>
                  <select
                    value={formData.partnerType}
                    onChange={(e) => handleInputChange('partnerType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="OWNER">Owner</option>
                    <option value="PARTNER">Partner</option>
                    <option value="INVESTOR">Investor</option>
                    <option value="SHAREHOLDER">Shareholder</option>
                  </select>
                </div>

                {/* Join Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Join Date *
                  </label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => handleInputChange('joinDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.joinDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.joinDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.joinDate}</p>
                  )}
                </div>

                {/* PAN Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.panNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                  {errors.panNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>
                  )}
                </div>

                {/* Aadhar Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    value={formData.aadharNumber}
                    onChange={(e) => handleInputChange('aadharNumber', e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.aadharNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="1234 5678 9012"
                    maxLength={12}
                  />
                  {errors.aadharNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Complete address..."
                />
              </div>
            </div>

            {/* Right Column - Business & Financial Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Business & Financial Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Equity Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equity Percentage *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.equityPercentage}
                    onChange={(e) => handleInputChange('equityPercentage', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.equityPercentage ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.equityPercentage && (
                    <p className="text-red-500 text-sm mt-1">{errors.equityPercentage}</p>
                  )}
                </div>

                {/* Initial Capital */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Capital *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.initialCapital}
                    onChange={(e) => handleInputChange('initialCapital', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.initialCapital ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.initialCapital && (
                    <p className="text-red-500 text-sm mt-1">{errors.initialCapital}</p>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800">Bank Details (Optional)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1234567890"
                    />
                  </div>

                  {/* Bank Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State Bank of India"
                    />
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
                      placeholder="SBIN0001234"
                      maxLength={11}
                    />
                  </div>
                </div>
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

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about this partner..."
                />
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
              {editingPartner ? 'Update Partner' : 'Create Partner'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
