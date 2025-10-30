'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SalaryStructure } from '@/services/employeeService';
import {
  X,
  Save,
  DollarSign,
  Calculator,
  Plus,
  Minus,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SalaryStructureFormData {
  id?: string;
  employeeId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  
  // Basic Components
  basicSalary: number;
  hra: number;
  da: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  
  // Deductions
  pf: number;
  esi: number;
  professionalTax: number;
  incomeTax: number;
  
  // Calculated fields
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  isActive: boolean;
}

interface SalaryStructureFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (salaryStructure: SalaryStructureFormData) => void;
  editData?: SalaryStructureFormData;
  employeeName?: string;
  employees?: Array<{ id: string; firstName: string; lastName: string; employeeId: string }>;
}

export default function SalaryStructureForm({
  isOpen,
  onClose,
  onSave,
  editData,
  employeeName,
  employees = []
}: SalaryStructureFormProps) {
  const [formData, setFormData] = useState<SalaryStructureFormData>({
    employeeId: '',
    effectiveFrom: new Date().toISOString().split('T')[0],
    basicSalary: 0,
    hra: 0,
    da: 0,
    conveyanceAllowance: 0,
    medicalAllowance: 0,
    specialAllowance: 0,
    pf: 0,
    esi: 0,
    professionalTax: 0,
    incomeTax: 0,
    grossSalary: 0,
    totalDeductions: 0,
    netSalary: 0,
    isActive: true,
    ...editData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculationMode, setCalculationMode] = useState<'manual' | 'auto'>('auto');

  // Auto-calculate HRA, PF, and other components based on basic salary
  useEffect(() => {
    if (calculationMode === 'auto' && formData.basicSalary > 0) {
      const basicSalary = formData.basicSalary;
      
      // Standard calculations (can be customized)
      const hra = Math.round(basicSalary * 0.4); // 40% of basic salary
      const da = Math.round(basicSalary * 0.1); // 10% of basic salary
      const pf = Math.round(basicSalary * 0.12); // 12% of basic salary
      const esi = basicSalary <= 21000 ? Math.round(basicSalary * 0.0075) : 0; // 0.75% if salary <= 21000
      const professionalTax = basicSalary > 10000 ? 200 : 0; // Standard PT
      
      setFormData(prev => ({
        ...prev,
        hra,
        da,
        pf,
        esi,
        professionalTax
      }));
    }
  }, [formData.basicSalary, calculationMode]);

  // Calculate gross salary, total deductions, and net salary
  useEffect(() => {
    const grossSalary = 
      formData.basicSalary + 
      formData.hra + 
      formData.da + 
      formData.conveyanceAllowance + 
      formData.medicalAllowance + 
      formData.specialAllowance;

    const totalDeductions = 
      formData.pf + 
      formData.esi + 
      formData.professionalTax + 
      formData.incomeTax;

    const netSalary = grossSalary - totalDeductions;

    setFormData(prev => ({
      ...prev,
      grossSalary,
      totalDeductions,
      netSalary
    }));
  }, [
    formData.basicSalary,
    formData.hra,
    formData.da,
    formData.conveyanceAllowance,
    formData.medicalAllowance,
    formData.specialAllowance,
    formData.pf,
    formData.esi,
    formData.professionalTax,
    formData.incomeTax
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (!formData.effectiveFrom) newErrors.effectiveFrom = 'Effective from date is required';
    if (formData.basicSalary <= 0) newErrors.basicSalary = 'Basic salary must be greater than 0';
    if (formData.effectiveTo && formData.effectiveTo <= formData.effectiveFrom) {
      newErrors.effectiveTo = 'Effective to date must be after effective from date';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editData ? 'Edit Salary Structure' : 'Create Salary Structure'}
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
          {/* Employee Selection */}
          {!employeeName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee *
              </label>
              <select
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.employeeId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select an employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} ({employee.employeeId})
                  </option>
                ))}
              </select>
              {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective From *
              </label>
              <input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => handleInputChange('effectiveFrom', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.effectiveFrom ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.effectiveFrom && <p className="text-red-500 text-sm mt-1">{errors.effectiveFrom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective To
              </label>
              <input
                type="date"
                value={formData.effectiveTo || ''}
                onChange={(e) => handleInputChange('effectiveTo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.effectiveTo ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.effectiveTo && <p className="text-red-500 text-sm mt-1">{errors.effectiveTo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Mode
              </label>
              <select
                value={calculationMode}
                onChange={(e) => setCalculationMode(e.target.value as 'manual' | 'auto')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="auto">Auto Calculate</option>
                <option value="manual">Manual Entry</option>
              </select>
            </div>
          </div>

          {/* Salary Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Earnings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Basic Salary *
                  </label>
                  <input
                    type="number"
                    value={formData.basicSalary}
                    onChange={(e) => handleInputChange('basicSalary', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.basicSalary ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter basic salary"
                  />
                  {errors.basicSalary && <p className="text-red-500 text-sm mt-1">{errors.basicSalary}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HRA (House Rent Allowance)
                    {calculationMode === 'auto' && <span className="text-xs text-blue-600 ml-1">(40% of Basic)</span>}
                  </label>
                  <input
                    type="number"
                    value={formData.hra}
                    onChange={(e) => handleInputChange('hra', parseFloat(e.target.value) || 0)}
                    disabled={calculationMode === 'auto'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter HRA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DA (Dearness Allowance)
                    {calculationMode === 'auto' && <span className="text-xs text-blue-600 ml-1">(10% of Basic)</span>}
                  </label>
                  <input
                    type="number"
                    value={formData.da}
                    onChange={(e) => handleInputChange('da', parseFloat(e.target.value) || 0)}
                    disabled={calculationMode === 'auto'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter DA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conveyance Allowance</label>
                  <input
                    type="number"
                    value={formData.conveyanceAllowance}
                    onChange={(e) => handleInputChange('conveyanceAllowance', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter conveyance allowance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Allowance</label>
                  <input
                    type="number"
                    value={formData.medicalAllowance}
                    onChange={(e) => handleInputChange('medicalAllowance', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter medical allowance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Allowance</label>
                  <input
                    type="number"
                    value={formData.specialAllowance}
                    onChange={(e) => handleInputChange('specialAllowance', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter special allowance"
                  />
                </div>

                <div className="pt-4 border-t border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-900">Gross Salary:</span>
                    <span className="text-lg font-bold text-green-900">{formatCurrency(formData.grossSalary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <TrendingDown className="w-5 h-5 mr-2" />
                Deductions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PF (Provident Fund)
                    {calculationMode === 'auto' && <span className="text-xs text-blue-600 ml-1">(12% of Basic)</span>}
                  </label>
                  <input
                    type="number"
                    value={formData.pf}
                    onChange={(e) => handleInputChange('pf', parseFloat(e.target.value) || 0)}
                    disabled={calculationMode === 'auto'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter PF"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ESI (Employee State Insurance)
                    {calculationMode === 'auto' && <span className="text-xs text-blue-600 ml-1">(0.75% if &le;21k)</span>}
                  </label>
                  <input
                    type="number"
                    value={formData.esi}
                    onChange={(e) => handleInputChange('esi', parseFloat(e.target.value) || 0)}
                    disabled={calculationMode === 'auto'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter ESI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Tax
                    {calculationMode === 'auto' && <span className="text-xs text-blue-600 ml-1">(₹200 if &gt;10k)</span>}
                  </label>
                  <input
                    type="number"
                    value={formData.professionalTax}
                    onChange={(e) => handleInputChange('professionalTax', parseFloat(e.target.value) || 0)}
                    disabled={calculationMode === 'auto'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter professional tax"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Income Tax (TDS)</label>
                  <input
                    type="number"
                    value={formData.incomeTax}
                    onChange={(e) => handleInputChange('incomeTax', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter income tax"
                  />
                </div>

                <div className="pt-4 border-t border-red-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-900">Total Deductions:</span>
                    <span className="text-lg font-bold text-red-900">{formatCurrency(formData.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Summary */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Salary Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Gross Salary</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(formData.grossSalary)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(formData.totalDeductions)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Net Salary</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(formData.netSalary)}</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Set as active salary structure
              </label>
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
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editData ? 'Update Structure' : 'Create Structure'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
