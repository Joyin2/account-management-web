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
  Upload,
  Car,
  Wrench,
  Shield,
  Megaphone,
  Package,
  Briefcase,
  Lightbulb,
  ClipboardList,
  MoreHorizontal,
  Search,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard as PaymentIcon,
  Calculator,
  ChevronDown,
  ChevronUp,
  Info,
  Banknote,
  Receipt,
  UserCheck,
  Building2,
  ArrowRightLeft
} from 'lucide-react';

interface ExpenditureTransactionFormProps {
  onSubmit: (data: any) => void;
  onBack?: () => void;
  editData?: any;
}

// Comprehensive expense types matching database validation
const expenseTypes = [
  // Utilities & Infrastructure
  {
    id: 'electricity',
    name: 'Electricity',
    icon: Zap,
    category: 'Utilities',
    color: 'bg-yellow-500'
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: Lightbulb,
    category: 'Utilities',
    color: 'bg-orange-500'
  },

  // Office & Rent
  {
    id: 'rent',
    name: 'Rent',
    icon: Building,
    category: 'Office',
    color: 'bg-blue-500'
  },
  {
    id: 'office-expenses',
    name: 'Office Expenses',
    icon: ClipboardList,
    category: 'Office',
    color: 'bg-indigo-500'
  },

  // Human Resources
  {
    id: 'salary',
    name: 'Salary',
    icon: Users,
    category: 'HR',
    color: 'bg-green-500'
  },

  // Operations
  {
    id: 'travel',
    name: 'Travel',
    icon: Car,
    category: 'Operations',
    color: 'bg-purple-500'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    icon: Wrench,
    category: 'Operations',
    color: 'bg-gray-500'
  },
  {
    id: 'supplies',
    name: 'Supplies',
    icon: Package,
    category: 'Operations',
    color: 'bg-teal-500'
  },

  // Business Services
  {
    id: 'insurance',
    name: 'Insurance',
    icon: Shield,
    category: 'Services',
    color: 'bg-red-500'
  },
  {
    id: 'advertising',
    name: 'Advertising',
    icon: Megaphone,
    category: 'Services',
    color: 'bg-pink-500'
  },
  {
    id: 'professional-fees',
    name: 'Professional Fees',
    icon: Briefcase,
    category: 'Services',
    color: 'bg-cyan-500'
  },

  // Other
  {
    id: 'other',
    name: 'Other',
    icon: MoreHorizontal,
    category: 'Other',
    color: 'bg-slate-500'
  }
];

// Group expense types by category
const expenseCategories = expenseTypes.reduce((acc, expense) => {
  if (!acc[expense.category]) {
    acc[expense.category] = [];
  }
  acc[expense.category].push(expense);
  return acc;
}, {} as Record<string, typeof expenseTypes>);

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
    remarks: '',
    // Payment tracking fields
    paidAmount: '',
    outstandingAmount: '',
    dueDate: '',
    paymentDate: '',
    advancePayment: '',
    paymentStatus: 'pending', // pending, partial, paid, overdue
    // Detailed information toggle
    showDetailedInfo: false,
    // Detailed information fields
    detailedInfo: {
      tds: {
        applicable: false,
        percentage: '',
        amount: '',
        panNumber: '',
        tdsSection: ''
      },
      tcs: {
        applicable: false,
        percentage: '',
        amount: ''
      },
      providentFund: {
        applicable: false,
        employeeContribution: '',
        employerContribution: '',
        pfNumber: ''
      },
      insurance: {
        applicable: false,
        policyNumber: '',
        premium: '',
        coverage: '',
        provider: ''
      },
      transfers: {
        applicable: false,
        fromAccount: '',
        toAccount: '',
        transferType: '',
        referenceNumber: ''
      },
      salary: {
        basicSalary: '',
        hra: '',
        allowances: '',
        deductions: '',
        netSalary: '',
        employeeId: '',
        designation: ''
      }
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPaymentTracking, setShowPaymentTracking] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.type) {
      newErrors.type = 'Please select an expense type';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.gstApplicable) {
      if (!formData.gstPercentage || parseFloat(formData.gstPercentage) < 0) {
        newErrors.gstPercentage = 'Valid GST percentage is required';
      }
      if (!formData.gstn) {
        newErrors.gstn = 'GSTN is required when GST is applicable';
      }
    }

    // Payment tracking validation
    if (showPaymentTracking) {
      if (formData.paidAmount && parseFloat(formData.paidAmount) < 0) {
        newErrors.paidAmount = 'Paid amount cannot be negative';
      }
      if (formData.advancePayment && parseFloat(formData.advancePayment) < 0) {
        newErrors.advancePayment = 'Advance payment cannot be negative';
      }
    }

    // TDS validation
    if (formData.detailedInfo.tds.applicable) {
      if (!formData.detailedInfo.tds.percentage || parseFloat(formData.detailedInfo.tds.percentage) <= 0) {
        newErrors.tdsPercentage = 'Valid TDS percentage is required';
      }
      if (!formData.detailedInfo.tds.panNumber) {
        newErrors.tdsPan = 'PAN number is required for TDS';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper functions for calculations
  const calculateOutstanding = () => {
    const total = parseFloat(formData.amount) || 0;
    const paid = parseFloat(formData.paidAmount) || 0;
    const advance = parseFloat(formData.advancePayment) || 0;
    return Math.max(0, total - paid - advance);
  };

  const calculateTDSAmount = () => {
    if (!formData.detailedInfo.tds.applicable) return 0;
    const amount = parseFloat(formData.amount) || 0;
    const percentage = parseFloat(formData.detailedInfo.tds.percentage) || 0;
    return (amount * percentage) / 100;
  };

  const calculateTCSAmount = () => {
    if (!formData.detailedInfo.tcs.applicable) return 0;
    const amount = parseFloat(formData.amount) || 0;
    const percentage = parseFloat(formData.detailedInfo.tcs.percentage) || 0;
    return (amount * percentage) / 100;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Auto-show detailed information for salary expenses
      if (field === 'type') {
        if (value === 'salary') {
          newData.showDetailedInfo = true;
          // Auto-enable relevant sections for salary
          newData.detailedInfo.tds.applicable = true;
          newData.detailedInfo.providentFund.applicable = true;
          // Set default TDS percentage for salary (typically 10% for salary above exemption limit)
          newData.detailedInfo.tds.percentage = '10';
          newData.detailedInfo.tds.tdsSection = '194A';
        } else {
          // Reset detailed information for non-salary expenses
          newData.showDetailedInfo = false;
          newData.detailedInfo.tds.applicable = false;
          newData.detailedInfo.tds.percentage = '';
          newData.detailedInfo.tds.amount = '';
          newData.detailedInfo.tds.panNumber = '';
          newData.detailedInfo.tds.tdsSection = '';
          newData.detailedInfo.tcs.applicable = false;
          newData.detailedInfo.tcs.percentage = '';
          newData.detailedInfo.tcs.amount = '';
          newData.detailedInfo.providentFund.applicable = false;
          newData.detailedInfo.providentFund.employeeContribution = '';
          newData.detailedInfo.providentFund.employerContribution = '';
          newData.detailedInfo.providentFund.pfNumber = '';
          newData.detailedInfo.insurance.applicable = false;
          newData.detailedInfo.insurance.policyNumber = '';
          newData.detailedInfo.insurance.premium = '';
          newData.detailedInfo.insurance.coverage = '';
          newData.detailedInfo.insurance.provider = '';
          newData.detailedInfo.transfers.applicable = false;
          newData.detailedInfo.transfers.fromAccount = '';
          newData.detailedInfo.transfers.toAccount = '';
          newData.detailedInfo.transfers.transferType = '';
          newData.detailedInfo.transfers.referenceNumber = '';
          newData.detailedInfo.salary.basicSalary = '';
          newData.detailedInfo.salary.hra = '';
          newData.detailedInfo.salary.allowances = '';
          newData.detailedInfo.salary.deductions = '';
          newData.detailedInfo.salary.netSalary = '';
          newData.detailedInfo.salary.employeeId = '';
          newData.detailedInfo.salary.designation = '';
        }
      }

      // Auto-calculate outstanding amount when amount or paid amount changes
      if (field === 'amount' || field === 'paidAmount' || field === 'advancePayment') {
        const total = parseFloat(newData.amount) || 0;
        const paid = parseFloat(newData.paidAmount) || 0;
        const advance = parseFloat(newData.advancePayment) || 0;
        newData.outstandingAmount = Math.max(0, total - paid - advance).toString();

        // Update payment status
        if (paid + advance >= total && total > 0) {
          newData.paymentStatus = 'paid';
        } else if (paid + advance > 0) {
          newData.paymentStatus = 'partial';
        } else {
          newData.paymentStatus = 'pending';
        }
      }

      // Auto-calculate TDS amount
      if (field === 'amount' || field.includes('tds.percentage')) {
        if (newData.detailedInfo.tds.applicable) {
          const amount = parseFloat(newData.amount) || 0;
          const percentage = parseFloat(newData.detailedInfo.tds.percentage) || 0;
          newData.detailedInfo.tds.amount = ((amount * percentage) / 100).toString();
        }
      }

      // Auto-calculate TCS amount
      if (field === 'amount' || field.includes('tcs.percentage')) {
        if (newData.detailedInfo.tcs.applicable) {
          const amount = parseFloat(newData.amount) || 0;
          const percentage = parseFloat(newData.detailedInfo.tcs.percentage) || 0;
          newData.detailedInfo.tcs.amount = ((amount * percentage) / 100).toString();
        }
      }

      return newData;
    });

    // Auto-expand payment tracking for salary expenses
    if (field === 'type') {
      if (value === 'salary') {
        setShowPaymentTracking(true);
      } else {
        setShowPaymentTracking(false);
      }
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDetailedInfoChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      detailedInfo: {
        ...prev.detailedInfo,
        [section]: {
          ...prev.detailedInfo[section as keyof typeof prev.detailedInfo],
          [field]: value
        }
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, bill: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...formData,
      transactionType: 'expenditure',
      expenseType: formData.type // Ensure expenseType field is included
    });
  };

  const selectedExpenseType = expenseTypes.find(type => type.id === formData.type);

  // Filter expense types based on search and category
  const filteredExpenseTypes = expenseTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || type.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCategories = selectedCategory
    ? { [selectedCategory]: expenseCategories[selectedCategory] }
    : Object.fromEntries(
        Object.entries(expenseCategories).filter(([category, types]) =>
          types.some(type => type.name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Expenditure Transaction</h2>
            <p className="text-sm text-gray-600 mt-1">Record your business expenses with detailed categorization</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Amount Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
                required
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>
          </div>

          {/* Expense Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Expense Type *
            </label>

            {/* Search and Filter */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search expense types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    !selectedCategory
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>
                {Object.keys(expenseCategories).map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Expense Types Grid */}
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {Object.entries(filteredCategories).map(([category, types]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{category}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {types.filter(type =>
                      type.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((type) => {
                      const Icon = type.icon;
                      const isSelected = formData.type === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleInputChange('type', type.id)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-blue-100' : type.color
                          }`}>
                            <Icon className={`w-4 h-4 ${
                              isSelected ? 'text-blue-600' : 'text-white'
                            }`} />
                          </div>
                          <div className="text-xs font-medium">{type.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          {/* Payment Method and Paid To Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Payment Method *
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Paid To
              </label>
              <input
                type="text"
                value={formData.paidTo}
                onChange={(e) => handleInputChange('paidTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter recipient name"
              />
            </div>
          </div>

          {/* GST Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.gstApplicable}
                  onChange={(e) => handleInputChange('gstApplicable', e.target.checked)}
                  className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">GST Applicable</span>
              </label>
              {formData.gstApplicable && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  GST will be calculated
                </span>
              )}
            </div>

            {/* GST Details */}
            {formData.gstApplicable && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Percentage *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.gstPercentage}
                    onChange={(e) => handleInputChange('gstPercentage', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.gstPercentage ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 18"
                    required
                  />
                  {errors.gstPercentage && <p className="text-red-500 text-xs mt-1">{errors.gstPercentage}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GSTN *
                  </label>
                  <input
                    type="text"
                    value={formData.gstn}
                    onChange={(e) => handleInputChange('gstn', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.gstn ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter GSTN"
                    required
                  />
                  {errors.gstn && <p className="text-red-500 text-xs mt-1">{errors.gstn}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Type *
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
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Bill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Bill/Receipt
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  id="bill-upload"
                />
                <label htmlFor="bill-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG, DOC (max 10MB)
                  </p>
                </label>
              </div>
              {formData.bill && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                  <span className="text-sm text-green-700">
                    📄 {formData.bill.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('bill', null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Remarks & Notes
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Add any additional notes, import/export tax details, or special instructions..."
              />
            </div>
          </div>

          {/* Summary Section */}
          {formData.amount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Transaction Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Expense Type:</span>
                  <span className="font-medium">{selectedExpenseType?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{parseFloat(formData.amount || '0').toLocaleString()}</span>
                </div>
                {formData.gstApplicable && formData.gstPercentage && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST ({formData.gstPercentage}%):</span>
                      <span className="font-medium">
                        ₹{((parseFloat(formData.amount || '0') * parseFloat(formData.gstPercentage || '0')) / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-700 font-medium">Total Amount:</span>
                      <span className="font-bold text-lg">
                        ₹{(parseFloat(formData.amount || '0') * (1 + parseFloat(formData.gstPercentage || '0') / 100)).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{formData.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Tracking Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <PaymentIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Payment Tracking</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentTracking(!showPaymentTracking)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showPaymentTracking ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span className="ml-1 text-sm">{showPaymentTracking ? 'Hide' : 'Show'} Details</span>
              </button>
            </div>

            {showPaymentTracking && (
              <div className="space-y-4">
                {/* Payment Amount Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Paid Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.paidAmount}
                      onChange={(e) => handleInputChange('paidAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Amount paid"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      Outstanding Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.outstandingAmount || calculateOutstanding()}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Banknote className="w-4 h-4 inline mr-2" />
                      Advance Payment
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.advancePayment}
                      onChange={(e) => handleInputChange('advancePayment', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Advance paid"
                    />
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partially Paid</option>
                    <option value="paid">Fully Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Information Section */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">Detailed Information</h3>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showDetailedInfo}
                  onChange={(e) => handleInputChange('showDetailedInfo', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-purple-700">Show detailed information</span>
              </label>
            </div>

            {formData.showDetailedInfo && (
              <div className="space-y-6">
                {/* TDS Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-semibold text-gray-900 flex items-center">
                      <Receipt className="w-4 h-4 mr-2" />
                      TDS (Tax Deducted at Source)
                    </h4>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.detailedInfo.tds.applicable}
                        onChange={(e) => handleDetailedInfoChange('tds', 'applicable', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Applicable</span>
                    </label>
                  </div>

                  {formData.detailedInfo.tds.applicable && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TDS Percentage *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.tds.percentage}
                          onChange={(e) => handleDetailedInfoChange('tds', 'percentage', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.tdsPercentage ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 10"
                        />
                        {errors.tdsPercentage && <p className="text-red-500 text-xs mt-1">{errors.tdsPercentage}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TDS Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.tds.amount || calculateTDSAmount()}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                          placeholder="Auto-calculated"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number *</label>
                        <input
                          type="text"
                          value={formData.detailedInfo.tds.panNumber}
                          onChange={(e) => handleDetailedInfoChange('tds', 'panNumber', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.tdsPan ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="ABCDE1234F"
                        />
                        {errors.tdsPan && <p className="text-red-500 text-xs mt-1">{errors.tdsPan}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TDS Section</label>
                        <select
                          value={formData.detailedInfo.tds.tdsSection}
                          onChange={(e) => handleDetailedInfoChange('tds', 'tdsSection', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Section</option>
                          <option value="194A">194A - Interest on Securities</option>
                          <option value="194C">194C - Payments to Contractors</option>
                          <option value="194H">194H - Commission or Brokerage</option>
                          <option value="194I">194I - Rent</option>
                          <option value="194J">194J - Professional Services</option>
                          <option value="194O">194O - E-commerce</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* TCS Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-semibold text-gray-900 flex items-center">
                      <Receipt className="w-4 h-4 mr-2" />
                      TCS (Tax Collected at Source)
                    </h4>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.detailedInfo.tcs.applicable}
                        onChange={(e) => handleDetailedInfoChange('tcs', 'applicable', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Applicable</span>
                    </label>
                  </div>

                  {formData.detailedInfo.tcs.applicable && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TCS Percentage</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.tcs.percentage}
                          onChange={(e) => handleDetailedInfoChange('tcs', 'percentage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TCS Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.tcs.amount || calculateTCSAmount()}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                          placeholder="Auto-calculated"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Provident Fund Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-semibold text-gray-900 flex items-center">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Provident Fund
                    </h4>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.detailedInfo.providentFund.applicable}
                        onChange={(e) => handleDetailedInfoChange('providentFund', 'applicable', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Applicable</span>
                    </label>
                  </div>

                  {formData.detailedInfo.providentFund.applicable && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee Contribution</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.providentFund.employeeContribution}
                          onChange={(e) => handleDetailedInfoChange('providentFund', 'employeeContribution', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Employee PF"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employer Contribution</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.providentFund.employerContribution}
                          onChange={(e) => handleDetailedInfoChange('providentFund', 'employerContribution', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Employer PF"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PF Number</label>
                        <input
                          type="text"
                          value={formData.detailedInfo.providentFund.pfNumber}
                          onChange={(e) => handleDetailedInfoChange('providentFund', 'pfNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="PF Account Number"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Insurance Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-semibold text-gray-900 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Insurance
                    </h4>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.detailedInfo.insurance.applicable}
                        onChange={(e) => handleDetailedInfoChange('insurance', 'applicable', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Applicable</span>
                    </label>
                  </div>

                  {formData.detailedInfo.insurance.applicable && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                        <input
                          type="text"
                          value={formData.detailedInfo.insurance.policyNumber}
                          onChange={(e) => handleDetailedInfoChange('insurance', 'policyNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Policy Number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.insurance.premium}
                          onChange={(e) => handleDetailedInfoChange('insurance', 'premium', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Premium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.insurance.coverage}
                          onChange={(e) => handleDetailedInfoChange('insurance', 'coverage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Coverage"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                        <input
                          type="text"
                          value={formData.detailedInfo.insurance.provider}
                          onChange={(e) => handleDetailedInfoChange('insurance', 'provider', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Provider Name"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Transfers Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-semibold text-gray-900 flex items-center">
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Transfers
                    </h4>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.detailedInfo.transfers.applicable}
                        onChange={(e) => handleDetailedInfoChange('transfers', 'applicable', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Applicable</span>
                    </label>
                  </div>

                  {formData.detailedInfo.transfers.applicable && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                        <input
                          type="text"
                          value={formData.detailedInfo.transfers.fromAccount}
                          onChange={(e) => handleDetailedInfoChange('transfers', 'fromAccount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Source Account"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
                        <input
                          type="text"
                          value={formData.detailedInfo.transfers.toAccount}
                          onChange={(e) => handleDetailedInfoChange('transfers', 'toAccount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Destination Account"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Type</label>
                        <select
                          value={formData.detailedInfo.transfers.transferType}
                          onChange={(e) => handleDetailedInfoChange('transfers', 'transferType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Type</option>
                          <option value="NEFT">NEFT</option>
                          <option value="RTGS">RTGS</option>
                          <option value="IMPS">IMPS</option>
                          <option value="UPI">UPI</option>
                          <option value="INTERNAL">Internal Transfer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                        <input
                          type="text"
                          value={formData.detailedInfo.transfers.referenceNumber}
                          onChange={(e) => handleDetailedInfoChange('transfers', 'referenceNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Transaction Reference"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Salary Details Section - Only show for salary expense type */}
                {formData.type === 'salary' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 flex items-center mb-3">
                      <Users className="w-4 h-4 mr-2" />
                      Salary Breakdown
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.salary.basicSalary}
                          onChange={(e) => handleDetailedInfoChange('salary', 'basicSalary', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Basic Salary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">HRA</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.salary.hra}
                          onChange={(e) => handleDetailedInfoChange('salary', 'hra', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="House Rent Allowance"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Other Allowances</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.salary.allowances}
                          onChange={(e) => handleDetailedInfoChange('salary', 'allowances', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Other Allowances"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Deductions</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.salary.deductions}
                          onChange={(e) => handleDetailedInfoChange('salary', 'deductions', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Total Deductions"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Net Salary</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.detailedInfo.salary.netSalary}
                          onChange={(e) => handleDetailedInfoChange('salary', 'netSalary', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Net Salary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input
                          type="text"
                          value={formData.detailedInfo.salary.employeeId}
                          onChange={(e) => handleDetailedInfoChange('salary', 'employeeId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Employee ID"
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                          type="text"
                          value={formData.detailedInfo.salary.designation}
                          onChange={(e) => handleDetailedInfoChange('salary', 'designation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Employee Designation"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              * Required fields
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    date: new Date().toISOString().split('T')[0],
                    type: 'electricity',
                    paymentMethod: 'Cash',
                    amount: '',
                    paidTo: '',
                    gstApplicable: false,
                    gstPercentage: '',
                    gstn: '',
                    gstType: 'Regular',
                    bill: null,
                    remarks: '',
                    paidAmount: '',
                    outstandingAmount: '',
                    dueDate: '',
                    paymentDate: '',
                    advancePayment: '',
                    paymentStatus: 'pending',
                    showDetailedInfo: false,
                    detailedInfo: {
                      tds: { applicable: false, percentage: '', amount: '', panNumber: '', tdsSection: '' },
                      tcs: { applicable: false, percentage: '', amount: '' },
                      providentFund: { applicable: false, employeeContribution: '', employerContribution: '', pfNumber: '' },
                      insurance: { applicable: false, policyNumber: '', premium: '', coverage: '', provider: '' },
                      transfers: { applicable: false, fromAccount: '', toAccount: '', transferType: '', referenceNumber: '' },
                      salary: { basicSalary: '', hra: '', allowances: '', deductions: '', netSalary: '', employeeId: '', designation: '' }
                    }
                  });
                  setErrors({});
                  setShowPaymentTracking(false);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={Object.keys(errors).length > 0}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Save Expense
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}