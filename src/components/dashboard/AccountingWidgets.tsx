'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  AlertTriangle
} from 'lucide-react';
import { getTransactions, getTransactionStats, getTransactionsByCategory, type Transaction } from '@/lib/api/transactions';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface AccountingSummaryProps {
  className?: string;
}

interface FinancialMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export const AccountingSummaryWidget: React.FC<AccountingSummaryProps> = ({ className }) => {
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialMetrics();
  }, []);

  const loadFinancialMetrics = async () => {
    try {
      setLoading(true);
      
      // Get current month stats
      const currentMonth = {
        dateFrom: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        dateTo: format(endOfMonth(new Date()), 'yyyy-MM-dd')
      };
      
      // Get previous month stats for comparison
      const previousMonth = {
        dateFrom: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        dateTo: format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd')
      };
      
      const [currentStats, previousStats] = await Promise.all([
        getTransactionStats(currentMonth),
        getTransactionStats(previousMonth)
      ]);
      
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? '+100%' : '0%';
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
      };
      
      const getTrend = (current: number, previous: number): 'up' | 'down' | 'neutral' => {
        if (current > previous) return 'up';
        if (current < previous) return 'down';
        return 'neutral';
      };
      
      const metricsData: FinancialMetric[] = [
        {
          title: 'Total Income',
          value: `₹${currentStats.totalIncome.toLocaleString()}`,
          change: calculateChange(currentStats.totalIncome, previousStats.totalIncome),
          trend: getTrend(currentStats.totalIncome, previousStats.totalIncome),
          icon: <TrendingUp className="h-4 w-4" />,
          color: 'text-green-600'
        },
        {
          title: 'Total Expenses',
          value: `₹${currentStats.totalExpenses.toLocaleString()}`,
          change: calculateChange(currentStats.totalExpenses, previousStats.totalExpenses),
          trend: getTrend(currentStats.totalExpenses, previousStats.totalExpenses),
          icon: <TrendingDown className="h-4 w-4" />,
          color: 'text-red-600'
        },
        {
          title: 'Net Income',
          value: `₹${currentStats.netIncome.toLocaleString()}`,
          change: calculateChange(currentStats.netIncome, previousStats.netIncome),
          trend: getTrend(currentStats.netIncome, previousStats.netIncome),
          icon: <DollarSign className="h-4 w-4" />,
          color: currentStats.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
        },
        {
          title: 'Transactions',
          value: currentStats.transactionCount.toString(),
          change: calculateChange(currentStats.transactionCount, previousStats.transactionCount),
          trend: getTrend(currentStats.transactionCount, previousStats.transactionCount),
          icon: <CreditCard className="h-4 w-4" />,
          color: 'text-blue-600'
        }
      ];
      
      setMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load financial metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={metric.color}>{metric.icon}</div>
                <span className="text-sm text-gray-600">{metric.title}</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{metric.value}</p>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                  {metric.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                  <span className={`text-xs ${
                    metric.trend === 'up' ? 'text-green-500' : 
                    metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const RecentTransactionsWidget: React.FC<{ className?: string }> = ({ className }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentTransactions();
  }, []);

  const loadRecentTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data.slice(0, 5)); // Get latest 5 transactions
    } catch (error) {
      console.error('Failed to load recent transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {transaction.type === 'income' ? 
                  <ArrowUpRight className="h-4 w-4" /> : 
                  <ArrowDownRight className="h-4 w-4" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{transaction.description}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')} • {transaction.category}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent transactions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ExpenseCategoriesWidget: React.FC<{ className?: string }> = ({ className }) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenseCategories();
  }, []);

  const loadExpenseCategories = async () => {
    try {
      setLoading(true);
      
      const currentMonth = {
        dateFrom: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        dateTo: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
        type: 'expense' as const
      };
      
      const categoryData = await getTransactionsByCategory(currentMonth);
      const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.totalAmount, 0);
      
      const colors = [
        'bg-red-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-orange-500'
      ];
      
      const categoriesWithPercentage: CategoryData[] = categoryData
        .filter(cat => cat.type === 'expense')
        .slice(0, 8) // Top 8 categories
        .map((cat, index) => ({
          category: cat.category,
          amount: cat.totalAmount,
          percentage: totalExpenses > 0 ? (cat.totalAmount / totalExpenses) * 100 : 0,
          color: colors[index % colors.length]
        }));
      
      setCategories(categoriesWithPercentage);
    } catch (error) {
      console.error('Failed to load expense categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Expense Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm font-medium">{category.category}</span>
                </div>
                <span className="text-sm text-gray-600">
                  ₹{category.amount.toLocaleString()}
                </span>
              </div>
              <Progress value={category.percentage} className="h-2" />
              <div className="text-xs text-gray-500 text-right">
                {category.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No expense data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const CashFlowWidget: React.FC<{ className?: string }> = ({ className }) => {
  const [cashFlowData, setCashFlowData] = useState<{
    currentBalance: number;
    projectedBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    burnRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCashFlowData();
  }, []);

  const loadCashFlowData = async () => {
    try {
      setLoading(true);
      
      const currentMonth = {
        dateFrom: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        dateTo: format(endOfMonth(new Date()), 'yyyy-MM-dd')
      };
      
      const stats = await getTransactionStats(currentMonth);
      const allTimeStats = await getTransactionStats();
      
      const currentBalance = allTimeStats.netIncome;
      const monthlyIncome = stats.totalIncome;
      const monthlyExpenses = stats.totalExpenses;
      const burnRate = monthlyExpenses > 0 ? currentBalance / monthlyExpenses : 0;
      const projectedBalance = currentBalance + (monthlyIncome - monthlyExpenses);
      
      setCashFlowData({
        currentBalance,
        projectedBalance,
        monthlyIncome,
        monthlyExpenses,
        burnRate
      });
    } catch (error) {
      console.error('Failed to load cash flow data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Cash Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cashFlowData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Cash Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Unable to load cash flow data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Cash Flow Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className={`text-xl font-bold ${
                cashFlowData.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{cashFlowData.currentBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Projected (Next Month)</p>
              <p className={`text-xl font-bold ${
                cashFlowData.projectedBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{cashFlowData.projectedBalance.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Monthly Income</span>
              <span className="text-sm font-medium text-green-600">
                +₹{cashFlowData.monthlyIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Monthly Expenses</span>
              <span className="text-sm font-medium text-red-600">
                -₹{cashFlowData.monthlyExpenses.toLocaleString()}
              </span>
            </div>
          </div>
          
          {cashFlowData.burnRate > 0 && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Runway:</span>
                <Badge variant={cashFlowData.burnRate > 6 ? 'default' : 'destructive'}>
                  {cashFlowData.burnRate.toFixed(1)} months
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Export all widgets as a combined component
export const AccountingDashboardWidgets: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <AccountingSummaryWidget className="lg:col-span-2" />
      <RecentTransactionsWidget />
      <ExpenseCategoriesWidget />
      <CashFlowWidget className="lg:col-span-2" />
    </div>
  );
};