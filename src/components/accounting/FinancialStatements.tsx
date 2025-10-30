'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  FileText,
  Building2,
  Users,
  CreditCard,
  RefreshCw,
  Eye,
  Printer
} from 'lucide-react';

// Import service and types
import { doubleEntryService, Account } from '@/services/doubleEntryService';

interface FinancialStatementItem {
  accountCode: string;
  accountName: string;
  amount: number;
  percentage?: number;
}

interface FinancialStatementSection {
  title: string;
  items: FinancialStatementItem[];
  total: number;
}

interface IncomeStatement {
  period: string;
  revenue: FinancialStatementSection;
  costOfGoodsSold: FinancialStatementSection;
  grossProfit: number;
  operatingExpenses: FinancialStatementSection;
  operatingIncome: number;
  otherIncome: FinancialStatementSection;
  otherExpenses: FinancialStatementSection;
  netIncome: number;
}

interface BalanceSheet {
  asOfDate: string;
  assets: {
    currentAssets: FinancialStatementSection;
    fixedAssets: FinancialStatementSection;
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: FinancialStatementSection;
    longTermLiabilities: FinancialStatementSection;
    totalLiabilities: number;
  };
  equity: FinancialStatementSection;
  totalLiabilitiesAndEquity: number;
}

interface FinancialStatementsProps {
  organizationId: string;
  userId: string;
}

export default function FinancialStatements({ organizationId, userId }: FinancialStatementsProps) {
  const [activeStatement, setActiveStatement] = useState<'income' | 'balance' | 'cash-flow'>('income');
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    loadFinancialStatements();
  }, [organizationId, userId, dateRange]);

  const loadFinancialStatements = async () => {
    setLoading(true);
    try {
      // Get accounts from Supabase
      const accounts = await doubleEntryService.getAccounts(organizationId);

      // Generate Income Statement
      const revenueAccounts = accounts.filter(acc => acc.accountType === 'REVENUE');
      const expenseAccounts = accounts.filter(acc => acc.accountType === 'EXPENSE');

      // Revenue section
      const revenueItems: FinancialStatementItem[] = revenueAccounts.map(acc => ({
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        amount: acc.currentBalance
      }));
      const totalRevenue = revenueItems.reduce((sum, item) => sum + item.amount, 0);

      // Separate COGS from other expenses
      const cogsAccounts = expenseAccounts.filter(acc => acc.accountCode.startsWith('5'));
      const operatingExpenseAccounts = expenseAccounts.filter(acc => acc.accountCode.startsWith('6') && !acc.accountCode.startsWith('64'));
      const otherExpenseAccounts = expenseAccounts.filter(acc => acc.accountCode.startsWith('64'));

      // COGS section
      const cogsItems: FinancialStatementItem[] = cogsAccounts.map(acc => ({
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        amount: acc.currentBalance
      }));
      const totalCOGS = cogsItems.reduce((sum, item) => sum + item.amount, 0);

      // Operating expenses section
      const operatingExpenseItems: FinancialStatementItem[] = operatingExpenseAccounts.map(acc => ({
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        amount: acc.currentBalance
      }));
      const totalOperatingExpenses = operatingExpenseItems.reduce((sum, item) => sum + item.amount, 0);

      // Other expenses section
      const otherExpenseItems: FinancialStatementItem[] = otherExpenseAccounts.map(acc => ({
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        amount: acc.currentBalance
      }));
      const totalOtherExpenses = otherExpenseItems.reduce((sum, item) => sum + item.amount, 0);

      const grossProfit = totalRevenue - totalCOGS;
      const operatingIncome = grossProfit - totalOperatingExpenses;
      const netIncome = operatingIncome - totalOtherExpenses;

      const incomeStatementData: IncomeStatement = {
        period: `${dateRange.startDate} to ${dateRange.endDate}`,
        revenue: {
          title: 'Revenue',
          items: revenueItems,
          total: totalRevenue
        },
        costOfGoodsSold: {
          title: 'Cost of Goods Sold',
          items: cogsItems,
          total: totalCOGS
        },
        grossProfit,
        operatingExpenses: {
          title: 'Operating Expenses',
          items: operatingExpenseItems,
          total: totalOperatingExpenses
        },
        operatingIncome,
        otherIncome: {
          title: 'Other Income',
          items: [],
          total: 0
        },
        otherExpenses: {
          title: 'Other Expenses',
          items: otherExpenseItems,
          total: totalOtherExpenses
        },
        netIncome
      };

      // Generate Balance Sheet
      const assetAccounts = accounts.filter(acc => acc.accountType === 'ASSET');
      const liabilityAccounts = accounts.filter(acc => acc.accountType === 'LIABILITY');
      const equityAccounts = accounts.filter(acc => acc.accountType === 'EQUITY');

      // Current Assets (account codes 1000-1499)
      const currentAssetAccounts = assetAccounts.filter(acc => parseInt(acc.accountCode) < 1500);
      const currentAssetItems: FinancialStatementItem[] = currentAssetAccounts.map(acc => ({
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        amount: acc.currentBalance
      }));
      const totalCurrentAssets = currentAssetItems.reduce((sum, item) => sum + item.amount, 0);

      // Fixed Assets (account codes 1500+)
      const fixedAssetAccounts = assetAccounts.filter(acc => parseInt(acc.accountCode) >= 1500);
      const fixedAssetItems: FinancialStatementItem[] = fixedAssetAccounts.map(acc => ({
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        amount: acc.currentBalance
      }));
      const totalFixedAssets = fixedAssetItems.reduce((sum, item) => sum + item.amount, 0);
      const totalAssets = totalCurrentAssets + totalFixedAssets;

      // Current Liabilities (account codes 2000-2499)
      const currentLiabilityAccounts = liabilityAccounts.filter(acc => parseInt(acc.accountCode) < 2500);
      const currentLiabilityItems: FinancialStatementItem[] = currentLiabilityAccounts.map(acc => ({
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        amount: acc.currentBalance
      }));
      const totalCurrentLiabilities = currentLiabilityItems.reduce((sum, item) => sum + item.amount, 0);

      // Long-term Liabilities (account codes 2500+)
      const longTermLiabilityAccounts = liabilityAccounts.filter(acc => parseInt(acc.accountCode) >= 2500);
      const longTermLiabilityItems: FinancialStatementItem[] = longTermLiabilityAccounts.map(acc => ({
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        amount: acc.currentBalance
      }));
      const totalLongTermLiabilities = longTermLiabilityItems.reduce((sum, item) => sum + item.amount, 0);
      const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

      // Equity
      const equityItems: FinancialStatementItem[] = equityAccounts.map(acc => ({
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        amount: acc.currentBalance
      }));
      const totalEquity = equityItems.reduce((sum, item) => sum + item.amount, 0);

      const balanceSheetData: BalanceSheet = {
        asOfDate: dateRange.endDate,
        assets: {
          currentAssets: {
            title: 'Current Assets',
            items: currentAssetItems,
            total: totalCurrentAssets
          },
          fixedAssets: {
            title: 'Fixed Assets',
            items: fixedAssetItems,
            total: totalFixedAssets
          },
          totalAssets
        },
        liabilities: {
          currentLiabilities: {
            title: 'Current Liabilities',
            items: currentLiabilityItems,
            total: totalCurrentLiabilities
          },
          longTermLiabilities: {
            title: 'Long-term Liabilities',
            items: longTermLiabilityItems,
            total: totalLongTermLiabilities
          },
          totalLiabilities
        },
        equity: {
          title: 'Owner\'s Equity',
          items: equityItems,
          total: totalEquity
        },
        totalLiabilitiesAndEquity: totalLiabilities + totalEquity
      };

      setIncomeStatement(incomeStatementData);
      setBalanceSheet(balanceSheetData);
    } catch (error) {
      console.error('Error loading financial statements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    console.log(`Downloading ${activeStatement} statement...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount);
    const formatted = `₹${absAmount.toLocaleString()}`;
    return amount < 0 ? `(${formatted})` : formatted;
  };

  const calculatePercentage = (amount: number, total: number) => {
    if (total === 0) return 0;
    return Math.abs((amount / total) * 100);
  };

  const renderIncomeStatement = () => {
    if (!incomeStatement) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Income Statement</h3>
          <p className="text-gray-600">{incomeStatement.period}</p>
        </div>

        <div className="space-y-6">
          {/* Revenue Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              {incomeStatement.revenue.title}
            </h4>
            {incomeStatement.revenue.items.map((item) => (
              <div key={item.accountCode} className="flex justify-between py-1">
                <span className="text-gray-700">{item.accountName}</span>
                <span className="font-mono">{formatAmount(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
              <span>Total Revenue</span>
              <span className="font-mono">{formatAmount(incomeStatement.revenue.total)}</span>
            </div>
          </div>

          {/* Cost of Goods Sold */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              {incomeStatement.costOfGoodsSold.title}
            </h4>
            {incomeStatement.costOfGoodsSold.items.map((item) => (
              <div key={item.accountCode} className="flex justify-between py-1">
                <span className="text-gray-700">{item.accountName}</span>
                <span className="font-mono">{formatAmount(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
              <span>Total Cost of Goods Sold</span>
              <span className="font-mono">{formatAmount(incomeStatement.costOfGoodsSold.total)}</span>
            </div>
          </div>

          {/* Gross Profit */}
          <div className="bg-blue-50 p-3 rounded">
            <div className="flex justify-between font-semibold text-blue-900">
              <span>Gross Profit</span>
              <span className="font-mono">{formatAmount(incomeStatement.grossProfit)}</span>
            </div>
          </div>

          {/* Operating Expenses */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              {incomeStatement.operatingExpenses.title}
            </h4>
            {incomeStatement.operatingExpenses.items.map((item) => (
              <div key={item.accountCode} className="flex justify-between py-1">
                <span className="text-gray-700">{item.accountName}</span>
                <span className="font-mono">{formatAmount(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
              <span>Total Operating Expenses</span>
              <span className="font-mono">{formatAmount(incomeStatement.operatingExpenses.total)}</span>
            </div>
          </div>

          {/* Operating Income */}
          <div className="bg-yellow-50 p-3 rounded">
            <div className="flex justify-between font-semibold text-yellow-900">
              <span>Operating Income</span>
              <span className="font-mono">{formatAmount(incomeStatement.operatingIncome)}</span>
            </div>
          </div>

          {/* Other Expenses */}
          {incomeStatement.otherExpenses.items.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                {incomeStatement.otherExpenses.title}
              </h4>
              {incomeStatement.otherExpenses.items.map((item) => (
                <div key={item.accountCode} className="flex justify-between py-1">
                  <span className="text-gray-700">{item.accountName}</span>
                  <span className="font-mono">{formatAmount(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                <span>Total Other Expenses</span>
                <span className="font-mono">{formatAmount(incomeStatement.otherExpenses.total)}</span>
              </div>
            </div>
          )}

          {/* Net Income */}
          <div className={`p-4 rounded-lg border-2 ${
            incomeStatement.netIncome >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className={`flex justify-between font-bold text-lg ${
              incomeStatement.netIncome >= 0 ? 'text-green-900' : 'text-red-900'
            }`}>
              <span>Net Income</span>
              <span className="font-mono">{formatAmount(incomeStatement.netIncome)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBalanceSheet = () => {
    if (!balanceSheet) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Balance Sheet</h3>
          <p className="text-gray-600">As of {balanceSheet.asOfDate}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assets */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">ASSETS</h3>
            
            {/* Current Assets */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">{balanceSheet.assets.currentAssets.title}</h4>
              {balanceSheet.assets.currentAssets.items.map((item) => (
                <div key={item.accountCode} className="flex justify-between py-1 pl-4">
                  <span className="text-gray-700">{item.accountName}</span>
                  <span className="font-mono">{formatAmount(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                <span>Total Current Assets</span>
                <span className="font-mono">{formatAmount(balanceSheet.assets.currentAssets.total)}</span>
              </div>
            </div>

            {/* Fixed Assets */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">{balanceSheet.assets.fixedAssets.title}</h4>
              {balanceSheet.assets.fixedAssets.items.map((item) => (
                <div key={item.accountCode} className="flex justify-between py-1 pl-4">
                  <span className="text-gray-700">{item.accountName}</span>
                  <span className="font-mono">{formatAmount(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                <span>Total Fixed Assets</span>
                <span className="font-mono">{formatAmount(balanceSheet.assets.fixedAssets.total)}</span>
              </div>
            </div>

            {/* Total Assets */}
            <div className="bg-blue-50 p-3 rounded">
              <div className="flex justify-between font-bold text-blue-900">
                <span>TOTAL ASSETS</span>
                <span className="font-mono">{formatAmount(balanceSheet.assets.totalAssets)}</span>
              </div>
            </div>
          </div>

          {/* Liabilities and Equity */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">LIABILITIES & EQUITY</h3>
            
            {/* Current Liabilities */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">{balanceSheet.liabilities.currentLiabilities.title}</h4>
              {balanceSheet.liabilities.currentLiabilities.items.map((item) => (
                <div key={item.accountCode} className="flex justify-between py-1 pl-4">
                  <span className="text-gray-700">{item.accountName}</span>
                  <span className="font-mono">{formatAmount(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                <span>Total Current Liabilities</span>
                <span className="font-mono">{formatAmount(balanceSheet.liabilities.currentLiabilities.total)}</span>
              </div>
            </div>

            {/* Long-term Liabilities */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">{balanceSheet.liabilities.longTermLiabilities.title}</h4>
              {balanceSheet.liabilities.longTermLiabilities.items.map((item) => (
                <div key={item.accountCode} className="flex justify-between py-1 pl-4">
                  <span className="text-gray-700">{item.accountName}</span>
                  <span className="font-mono">{formatAmount(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                <span>Total Long-term Liabilities</span>
                <span className="font-mono">{formatAmount(balanceSheet.liabilities.longTermLiabilities.total)}</span>
              </div>
            </div>

            {/* Total Liabilities */}
            <div className="bg-red-50 p-3 rounded mb-6">
              <div className="flex justify-between font-semibold text-red-900">
                <span>Total Liabilities</span>
                <span className="font-mono">{formatAmount(balanceSheet.liabilities.totalLiabilities)}</span>
              </div>
            </div>

            {/* Equity */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">{balanceSheet.equity.title}</h4>
              {balanceSheet.equity.items.map((item) => (
                <div key={item.accountCode} className="flex justify-between py-1 pl-4">
                  <span className="text-gray-700">{item.accountName}</span>
                  <span className="font-mono">{formatAmount(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                <span>Total Equity</span>
                <span className="font-mono">{formatAmount(balanceSheet.equity.total)}</span>
              </div>
            </div>

            {/* Total Liabilities and Equity */}
            <div className="bg-blue-50 p-3 rounded">
              <div className="flex justify-between font-bold text-blue-900">
                <span>TOTAL LIABILITIES & EQUITY</span>
                <span className="font-mono">{formatAmount(balanceSheet.totalLiabilitiesAndEquity)}</span>
              </div>
            </div>

            {/* Balance Check */}
            <div className="mt-4 p-3 rounded border-2 border-dashed">
              <div className="text-center text-sm">
                {Math.abs(balanceSheet.assets.totalAssets - balanceSheet.totalLiabilitiesAndEquity) < 0.01 ? (
                  <span className="text-green-600 font-medium">✓ Balance Sheet is Balanced</span>
                ) : (
                  <span className="text-red-600 font-medium">⚠ Balance Sheet is Out of Balance</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCashFlowStatement = () => {
    if (!incomeStatement || !balanceSheet) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Cash Flow Statement</h3>
            <p className="mt-1 text-sm text-gray-500">Please generate Income Statement and Balance Sheet first</p>
          </div>
        </div>
      );
    }

    // Calculate cash flow components
    const netIncome = incomeStatement.netIncome;

    // Operating Activities (simplified)
    const operatingCashFlow = netIncome + (incomeStatement.operatingExpenses.items.find(item =>
      item.accountName.toLowerCase().includes('depreciation'))?.amount || 0);

    // Net change in cash (simplified calculation)
    const currentCash = balanceSheet.assets.currentAssets.items.find(item =>
      item.accountName.toLowerCase().includes('cash'))?.amount || 0;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Cash Flow Statement</h3>
          <p className="text-gray-600">For the period {dateRange.startDate} to {dateRange.endDate}</p>
        </div>

        <div className="space-y-6">
          {/* Operating Activities */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              CASH FLOWS FROM OPERATING ACTIVITIES
            </h4>
            <div className="space-y-2 pl-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Net Income</span>
                <span className="font-mono">{formatAmount(netIncome)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 font-semibold text-blue-900">
                <span>Net Cash from Operating Activities</span>
                <span className="font-mono">{formatAmount(operatingCashFlow)}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded">
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-blue-900">
                <span>Cash at End of Period</span>
                <span className="font-mono">{formatAmount(currentCash)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Financial Statements</h3>
            <p className="text-gray-600 mt-1">Generate comprehensive financial reports</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Statement Type Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'income', label: 'Income Statement', icon: TrendingUp },
              { id: 'balance', label: 'Balance Sheet', icon: BarChart3 },
              { id: 'cash-flow', label: 'Cash Flow', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeStatement === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStatement(tab.id as any)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-2 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Date Range Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {activeStatement === 'balance' ? 'As of Date' : 'Start Date'}
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {activeStatement !== 'balance' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          <div className="flex items-end">
            <button
              onClick={loadFinancialStatements}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Statement Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
            <p className="mt-2 text-gray-600">Generating financial statements...</p>
          </div>
        </div>
      ) : (
        <>
          {activeStatement === 'income' && renderIncomeStatement()}
          {activeStatement === 'balance' && renderBalanceSheet()}
          {activeStatement === 'cash-flow' && renderCashFlowStatement()}
        </>
      )}
    </div>
  );


}
