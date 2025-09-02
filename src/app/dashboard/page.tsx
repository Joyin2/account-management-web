'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { businessTypes } from '@/components/auth/BusinessTypeSelector';
import { 
  AccountingSummaryWidget,
  RecentTransactionsWidget,
  ExpenseCategoriesWidget,
  CashFlowWidget
} from '@/components/dashboard/AccountingWidgets';
import {
  DollarSign,
  Users,
  Package,
  TrendingUp,
  FileText,
  AlertTriangle,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
}

function StatCard({ title, value, change, changeType, icon: Icon, color }: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType];

  const ChangeIcon = changeType === 'positive' ? ArrowUpRight : changeType === 'negative' ? ArrowDownRight : null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            {ChangeIcon && <ChangeIcon className={`w-4 h-4 ${changeColor}`} />}
            <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  onClick: () => void;
}

function QuickAction({ title, description, icon: Icon, color, onClick }: QuickActionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>
    </motion.button>
  );
}

function DashboardPageContent() {
  const { user, userProfile } = useAuth();

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹0',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: DollarSign,
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      title: 'Active Customers',
      value: '0',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      title: 'Products in Stock',
      value: '0',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: Package,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      title: 'Monthly Growth',
      value: '0%',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice for your customers',
      icon: FileText,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      onClick: () => window.location.href = '/invoicing'
    },
    {
      title: 'Add Product',
      description: 'Add new products to your inventory',
      icon: Package,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      onClick: () => window.location.href = '/inventory'
    },
    {
      title: 'Record Transaction',
      description: 'Track your business income and expenses',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      onClick: () => window.location.href = '/accounting'
    },
    {
      title: 'View Reports',
      description: 'Analyze your business performance',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      onClick: () => window.location.href = '/reports'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'info',
      title: 'Welcome to AccountPro!',
      description: 'Complete your business setup to get started',
      time: 'Just now',
      icon: Calendar
    }
  ];

  const alerts: Array<{
    id: number;
    type: string;
    title: string;
    description: string;
    action: string;
  }> = [
    // Setup alert removed - accounting functionality is now fully implemented
  ];

  return (
    <DashboardLayout 
      title={`Welcome back, ${userProfile?.fullName?.split(' ')[0] || 'User'}!`}
      subtitle="Here's what's happening with your business today"
    >
      <div className="space-y-6">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-yellow-800">{alert.title}</h4>
                    <p className="text-sm text-yellow-700">{alert.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = '/accounting'}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  {alert.action}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <span className="text-sm text-gray-500">Get started with these common tasks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <QuickAction {...action} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Accounting Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <AccountingSummaryWidget />
          <RecentTransactionsWidget />
          <ExpenseCategoriesWidget />
          <CashFlowWidget />
        </div>

        {/* Recent Activity & Business Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>View All</span>
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Business Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Business Insights</h2>
              <span className="text-sm text-gray-500">Based on your business type</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-gray-900 mb-2">
                  {businessTypes.find(bt => bt.id === userProfile?.businessType)?.name || 'Business'} Best Practices
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Set up your chart of accounts to match your industry standards for better financial tracking.
                </p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Learn More →
                </button>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <h4 className="font-medium text-gray-900 mb-2">Tax Compliance</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Stay compliant with GST regulations and automate your tax calculations.
                </p>
                <button 
                  onClick={() => window.location.href = '/settings'}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Setup GST →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardPageContent />
    </AuthGuard>
  );
}