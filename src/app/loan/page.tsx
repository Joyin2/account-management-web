'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { loanService, type Loan, type LoanPayment, type LoanSchedule } from '@/services/loanService';
import { useAuth } from '@/contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';
import AuthGuard from '@/components/auth/AuthGuard';

import {
  Plus,
  Edit,
  Trash2,
  Eye,
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  IndianRupee,
  BarChart3,
  PieChart,
  Calculator,
  FileText,
  Download,
  Bell,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

interface LoanCardProps {
  loan: Loan;
  onEdit: (loan: Loan) => void;
  onDelete: (loanId: string) => void;
  onView: (loan: Loan) => void;
  onPayment: (loan: Loan) => void;
}

function LoanCard({ loan, onEdit, onDelete, onView, onPayment }: LoanCardProps) {
  const getStatusColor = () => {
    switch (loan.status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'DEFAULTED': return 'bg-red-100 text-red-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoanTypeIcon = () => {
    switch (loan.loanType) {
      case 'HOME': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'CAR': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'PERSONAL': return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'BUSINESS': return <BarChart3 className="w-5 h-5 text-orange-600" />;
      case 'EDUCATION': return <FileText className="w-5 h-5 text-indigo-600" />;
      default: return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const completionPercentage = ((loan.principalAmount - loan.outstandingBalance) / loan.principalAmount) * 100;
  const isOverdue = loan.status === 'ACTIVE' && loan.nextDueDate.toDate() < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getLoanTypeIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{loan.loanName}</h3>
            <p className="text-sm text-gray-600">{loan.lenderName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {loan.status}
          </span>
          {isOverdue && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onView(loan)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(loan)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(loan.id!)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Principal Amount:</span>
          <div className="flex items-center">
            <IndianRupee className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium">
              {loan.principalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Outstanding:</span>
          <div className="flex items-center">
            <IndianRupee className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-red-600">
              {loan.outstandingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">EMI Amount:</span>
          <div className="flex items-center">
            <IndianRupee className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium">
              {loan.emiAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Interest Rate:</span>
          <span className="text-sm font-medium">{loan.interestRate}% p.a.</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Next Due Date:</span>
          <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
            {loan.nextDueDate.toDate().toLocaleDateString('en-IN')}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Completion</span>
            <span className="text-sm font-medium">{completionPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onPayment(loan)}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <IndianRupee className="w-4 h-4 mr-1" />
            Pay EMI
          </button>
          <button
            onClick={() => onView(loan)}
            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Calculator className="w-4 h-4 mr-1" />
            Schedule
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  change?: number;
  suffix?: string;
}

function SummaryCard({ title, amount, type, icon: Icon, change, suffix = '' }: SummaryCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center mt-2">
            {suffix === '₹' && <IndianRupee className="w-5 h-5 text-gray-600 mr-1" />}
            <p className="text-2xl font-bold text-gray-900">
              {suffix === '₹' 
                ? amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })
                : amount.toLocaleString('en-IN')
              }
              {suffix && suffix !== '₹' && <span className="text-lg ml-1">{suffix}</span>}
            </p>
          </div>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${getTypeStyles()}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function LoanPageContent() {
  const { user, userProfile } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loanSummary, setLoanSummary] = useState({
    totalLoans: 0,
    activeLoans: 0,
    totalOutstanding: 0,
    monthlyEMI: 0,
    completedLoans: 0
  });

  useEffect(() => {
    if (user) {
      loadLoans();
      loadLoanSummary();
    }
  }, [user]);

  const loadLoans = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const loansData = await loanService.getLoans(user.uid);
      setLoans(loansData);
    } catch (error) {
      console.error('Error loading loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLoanSummary = async () => {
    if (!user) return;
    
    try {
      const summary = await loanService.getLoanSummary(user.uid);
      setLoanSummary(summary);
    } catch (error) {
      console.error('Error loading loan summary:', error);
    }
  };

  const handleAddLoan = () => {
    setEditingLoan(null);
    setShowLoanForm(true);
  };

  const handleEditLoan = (loan: Loan) => {
    setEditingLoan(loan);
    setShowLoanForm(true);
  };

  const handleDeleteLoan = async (loanId: string) => {
    if (!confirm('Are you sure you want to delete this loan?')) return;
    
    try {
      await loanService.deleteLoan(loanId);
      await loadLoans();
      await loadLoanSummary();
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  const handleViewLoan = (loan: Loan) => {
    setSelectedLoan(loan);
  };

  const handlePayment = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowPaymentForm(true);
  };

  // Filter loans
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.loanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.lenderName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || loan.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Get overdue loans
  const overdueLoans = loans.filter(loan => 
    loan.status === 'ACTIVE' && loan.nextDueDate.toDate() < new Date()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Management</h1>
          <p className="text-gray-600">Track your loans, payments, and schedules</p>
        </div>
        <div className="flex items-center space-x-3">
          {overdueLoans.length > 0 && (
            <div className="flex items-center px-3 py-2 bg-red-100 text-red-800 rounded-lg">
              <Bell className="w-4 h-4 mr-2" />
              {overdueLoans.length} Overdue
            </div>
          )}
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={handleAddLoan}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Loan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <SummaryCard
          title="Total Outstanding"
          amount={loanSummary.totalOutstanding}
          type="negative"
          icon={IndianRupee}
          suffix="₹"
        />
        <SummaryCard
          title="Monthly EMI"
          amount={loanSummary.monthlyEMI}
          type="neutral"
          icon={Calendar}
          suffix="₹"
        />
        <SummaryCard
          title="Active Loans"
          amount={loanSummary.activeLoans}
          type="neutral"
          icon={CreditCard}
        />
        <SummaryCard
          title="Completed Loans"
          amount={loanSummary.completedLoans}
          type="positive"
          icon={CheckCircle}
        />
        <SummaryCard
          title="Total Loans"
          amount={loanSummary.totalLoans}
          type="neutral"
          icon={BarChart3}
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="DEFAULTED">Defaulted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <button 
            onClick={() => { loadLoans(); loadLoanSummary(); }}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Loans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading loans...</p>
          </div>
        ) : filteredLoans.length > 0 ? (
          filteredLoans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onEdit={handleEditLoan}
              onDelete={handleDeleteLoan}
              onView={handleViewLoan}
              onPayment={handlePayment}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first loan.</p>
            <button 
              onClick={handleAddLoan}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Loan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoanPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <LoanPageContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
