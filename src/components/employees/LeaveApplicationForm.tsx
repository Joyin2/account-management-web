'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LeaveApplication, LeaveType, LeaveBalance } from '@/services/employeeService';
import {
  X,
  Save,
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  User,
  FileText
} from 'lucide-react';

interface LeaveApplicationFormData {
  id?: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  halfDay: boolean;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

interface LeaveApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (application: LeaveApplicationFormData) => void;
  editData?: LeaveApplicationFormData;
  employeeName?: string;
  leaveTypes: LeaveType[];
  leaveBalances: LeaveBalance[];
}

export default function LeaveApplicationForm({
  isOpen,
  onClose,
  onSave,
  editData,
  employeeName,
  leaveTypes,
  leaveBalances
}: LeaveApplicationFormProps) {
  const [formData, setFormData] = useState<LeaveApplicationFormData>({
    employeeId: '',
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    totalDays: 0,
    halfDay: false,
    reason: '',
    status: 'pending',
    ...editData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  useEffect(() => {
    if (formData.leaveTypeId) {
      const leaveType = leaveTypes.find(lt => lt.id === formData.leaveTypeId);
      setSelectedLeaveType(leaveType || null);
      
      const balance = leaveBalances.find(lb => lb.leaveTypeId === formData.leaveTypeId);
      setAvailableBalance(balance?.available || 0);
    }
  }, [formData.leaveTypeId, leaveTypes, leaveBalances]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      calculateTotalDays();
    }
  }, [formData.startDate, formData.endDate, formData.halfDay]);

  const calculateTotalDays = () => {
    if (!formData.startDate || !formData.endDate) return;

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate < startDate) {
      setErrors(prev => ({ ...prev, endDate: 'End date must be after start date' }));
      return;
    }

    let totalDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      // Count only weekdays (Monday to Friday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        totalDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // If it's a half day and only one day, count as 0.5
    if (formData.halfDay && totalDays === 1) {
      totalDays = 0.5;
    }

    setFormData(prev => ({ ...prev, totalDays }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) newErrors.employeeId = 'Employee is required';
    if (!formData.leaveTypeId) newErrors.leaveTypeId = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }

      if (endDate < startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.totalDays > availableBalance) {
      newErrors.totalDays = `Insufficient leave balance. Available: ${availableBalance} days`;
    }

    if (selectedLeaveType && formData.totalDays > selectedLeaveType.maxDaysPerYear) {
      newErrors.totalDays = `Cannot exceed maximum ${selectedLeaveType.maxDaysPerYear} days per year for this leave type`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  const getLeaveTypeColor = (leaveType: LeaveType) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800'
    ];
    return colors[leaveType.name.length % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editData ? 'Edit Leave Application' : 'Apply for Leave'}
            </h2>
            {employeeName && (
              <p className="text-sm text-gray-600 mt-1">For: {employeeName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Leave Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Leave Type *
            </label>
            <select
              value={formData.leaveTypeId}
              onChange={(e) => handleInputChange('leaveTypeId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.leaveTypeId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select leave type</option>
              {leaveTypes.map(leaveType => (
                <option key={leaveType.id} value={leaveType.id}>
                  {leaveType.name} ({leaveType.code})
                </option>
              ))}
            </select>
            {errors.leaveTypeId && <p className="text-red-500 text-sm mt-1">{errors.leaveTypeId}</p>}
            
            {selectedLeaveType && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(selectedLeaveType)}`}>
                    {selectedLeaveType.name}
                  </span>
                  <span className="text-sm text-blue-700">
                    Available: {availableBalance} days
                  </span>
                </div>
                {selectedLeaveType.description && (
                  <p className="text-sm text-blue-700 mt-1">{selectedLeaveType.description}</p>
                )}
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                }`}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Half Day Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="halfDay"
              checked={formData.halfDay}
              onChange={(e) => handleInputChange('halfDay', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={formData.totalDays > 1}
            />
            <label htmlFor="halfDay" className="text-sm font-medium text-gray-700">
              Half Day Leave
            </label>
            {formData.totalDays > 1 && (
              <span className="text-xs text-gray-500">(Only available for single day leaves)</span>
            )}
          </div>

          {/* Total Days Display */}
          {formData.totalDays > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Leave Days:</span>
                <span className="text-lg font-bold text-blue-600">{formData.totalDays} day{formData.totalDays !== 1 ? 's' : ''}</span>
              </div>
              {formData.totalDays > availableBalance && (
                <div className="flex items-center space-x-2 mt-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Insufficient leave balance</span>
                </div>
              )}
              {errors.totalDays && <p className="text-red-500 text-sm mt-1">{errors.totalDays}</p>}
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Leave *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.reason ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Please provide a detailed reason for your leave application..."
            />
            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
          </div>

          {/* Leave Policy Information */}
          {selectedLeaveType && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Leave Policy Information:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Maximum {selectedLeaveType.maxDaysPerYear} days per year for this leave type</li>
                    {selectedLeaveType.carryForward && (
                      <li>• Up to {selectedLeaveType.maxCarryForwardDays} days can be carried forward</li>
                    )}
                    {selectedLeaveType.encashable && (
                      <li>• This leave type is encashable</li>
                    )}
                    {selectedLeaveType.applicableAfterDays > 0 && (
                      <li>• Applicable after {selectedLeaveType.applicableAfterDays} days of joining</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {editData ? 'Update your leave application' : 'Your application will be sent for approval'}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={formData.totalDays > availableBalance}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editData ? 'Update Application' : 'Submit Application'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
