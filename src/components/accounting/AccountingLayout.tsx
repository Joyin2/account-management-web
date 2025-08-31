'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  DollarSign,
  CreditCard,
  TrendingUp,
  Building2,
  Banknote,
  Plus,
  Filter,
  Download,
  Search,
  Calendar,
  MoreVertical
} from 'lucide-react';

interface AccountingLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewTransaction?: () => void;
}

const accountingTabs = [
  {
    id: 'overview',
    name: 'OVERVIEW',
    icon: DollarSign,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Financial overview and summary'
  }
];

export default function AccountingLayout({ children, activeTab, onTabChange, onNewTransaction }: AccountingLayoutProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('this-month');

  const activeTabData = accountingTabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Accounting</h1>
              <p className="text-gray-600 mt-1">
                Streamlined financial overview and transaction management
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={onNewTransaction}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Transaction
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {accountingTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-4 h-4 mr-2 ${
                    isActive ? tab.color : 'text-gray-500'
                  }`} />
                  {tab.name}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Tab Header */}
      {activeTabData && (
        <div className={`${activeTabData.bgColor} border-b border-gray-200`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                  <activeTabData.icon className={`w-5 h-5 ${activeTabData.color}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activeTabData.name} Transactions
                  </h2>
                  <p className="text-sm text-gray-600">
                    {activeTabData.description}
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>
                
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="this-quarter">This Quarter</option>
                  <option value="this-year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>

                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
}