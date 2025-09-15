'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { equityService, type Partner, type EquityTransaction, type CapitalAccount } from '@/services/equityService';
import { useAuth } from '@/contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';
import AuthGuard from '@/components/auth/AuthGuard';

import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  IndianRupee,
  Calendar,
  User,
  Building,
  Award,
  Target,
  Activity,
  Download,
  Search,
  Filter,
  RefreshCw,
  UserPlus,
  DollarSign,
  Percent
} from 'lucide-react';

interface PartnerCardProps {
  partner: Partner;
  onEdit: (partner: Partner) => void;
  onDelete: (partnerId: string) => void;
  onView: (partner: Partner) => void;
  onTransaction: (partner: Partner) => void;
}

function PartnerCard({ partner, onEdit, onDelete, onView, onTransaction }: PartnerCardProps) {
  const getPartnerTypeColor = () => {
    switch (partner.partnerType) {
      case 'OWNER': return 'bg-purple-100 text-purple-800';
      case 'PARTNER': return 'bg-blue-100 text-blue-800';
      case 'INVESTOR': return 'bg-green-100 text-green-800';
      case 'SHAREHOLDER': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPartnerTypeIcon = () => {
    switch (partner.partnerType) {
      case 'OWNER': return <Award className="w-5 h-5 text-purple-600" />;
      case 'PARTNER': return <Users className="w-5 h-5 text-blue-600" />;
      case 'INVESTOR': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'SHAREHOLDER': return <BarChart3 className="w-5 h-5 text-orange-600" />;
      default: return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getPartnerTypeIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{partner.name}</h3>
            <p className="text-sm text-gray-600">{partner.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPartnerTypeColor()}`}>
            {partner.partnerType}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            partner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {partner.isActive ? 'Active' : 'Inactive'}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onView(partner)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(partner)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(partner.id!)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Equity Percentage:</span>
          <div className="flex items-center">
            <Percent className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium">{partner.equityPercentage}%</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Initial Capital:</span>
          <div className="flex items-center">
            <IndianRupee className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium">
              {partner.initialCapital.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Current Balance:</span>
          <div className="flex items-center">
            <IndianRupee className="w-4 h-4 text-gray-600 mr-1" />
            <span className={`text-sm font-medium ${
              partner.currentCapitalBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(partner.currentCapitalBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Join Date:</span>
          <span className="text-sm font-medium">
            {partner.joinDate.toDate().toLocaleDateString('en-IN')}
          </span>
        </div>

        {/* Equity Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Equity Share</span>
            <span className="text-sm font-medium">{partner.equityPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(partner.equityPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onTransaction(partner)}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Transaction
          </button>
          <button
            onClick={() => onView(partner)}
            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Activity className="w-4 h-4 mr-1" />
            Details
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

function EquityPageContent() {
  const { user, userProfile } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [transactions, setTransactions] = useState<EquityTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [equitySummary, setEquitySummary] = useState({
    totalPartners: 0,
    totalCapital: 0,
    totalEquityPercentage: 0,
    totalProfitDistributed: 0,
    totalLossAllocated: 0
  });

  useEffect(() => {
    if (user) {
      loadPartners();
      loadTransactions();
      loadEquitySummary();
    }
  }, [user]);

  const loadPartners = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const partnersData = await equityService.getPartners(user.uid);
      setPartners(partnersData);
    } catch (error) {
      console.error('Error loading partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      const transactionsData = await equityService.getEquityTransactions(undefined, user.uid);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadEquitySummary = async () => {
    if (!user) return;
    
    try {
      const summary = await equityService.getEquitySummary(user.uid);
      setEquitySummary(summary);
    } catch (error) {
      console.error('Error loading equity summary:', error);
    }
  };

  const handleAddPartner = () => {
    setEditingPartner(null);
    setShowPartnerForm(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setShowPartnerForm(true);
  };

  const handleDeletePartner = async (partnerId: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    
    try {
      await equityService.deletePartner(partnerId);
      await loadPartners();
      await loadEquitySummary();
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  const handleViewPartner = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  const handleTransaction = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowTransactionForm(true);
  };

  const handleProfitLossAllocation = () => {
    setShowAllocationForm(true);
  };

  // Filter partners
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (partner.email && partner.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'ALL' || partner.partnerType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equity Management</h1>
          <p className="text-gray-600">Manage partners, capital accounts, and profit/loss allocation</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleProfitLossAllocation}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PieChart className="w-4 h-4 mr-2" />
            Allocate P&L
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={handleAddPartner}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Partner
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <SummaryCard
          title="Total Capital"
          amount={equitySummary.totalCapital}
          type="positive"
          icon={IndianRupee}
          suffix="₹"
        />
        <SummaryCard
          title="Total Partners"
          amount={equitySummary.totalPartners}
          type="neutral"
          icon={Users}
        />
        <SummaryCard
          title="Equity Allocated"
          amount={equitySummary.totalEquityPercentage}
          type="neutral"
          icon={Percent}
          suffix="%"
        />
        <SummaryCard
          title="Profit Distributed"
          amount={equitySummary.totalProfitDistributed}
          type="positive"
          icon={TrendingUp}
          suffix="₹"
        />
        <SummaryCard
          title="Loss Allocated"
          amount={equitySummary.totalLossAllocated}
          type="negative"
          icon={TrendingDown}
          suffix="₹"
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
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Types</option>
              <option value="OWNER">Owner</option>
              <option value="PARTNER">Partner</option>
              <option value="INVESTOR">Investor</option>
              <option value="SHAREHOLDER">Shareholder</option>
            </select>
          </div>
          <button 
            onClick={() => { loadPartners(); loadTransactions(); loadEquitySummary(); }}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading partners...</p>
          </div>
        ) : filteredPartners.length > 0 ? (
          filteredPartners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onEdit={handleEditPartner}
              onDelete={handleDeletePartner}
              onView={handleViewPartner}
              onTransaction={handleTransaction}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No partners found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first partner or owner.</p>
            <button 
              onClick={handleAddPartner}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Partner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EquityPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <EquityPageContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
