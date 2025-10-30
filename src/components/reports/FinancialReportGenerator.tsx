'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, FileText, Download, Calendar, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface FinancialData {
  revenue: number;
  expenses: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  equity: number;
  cashFlow: {
    operating: number;
    investing: number;
    financing: number;
    netCash: number;
  };
  monthlyData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  defaultDateRange: {
    startDate: Date;
    endDate: Date;
  };
  onGenerate: (reportData: any) => void;
}

export const FinancialReportGenerator: React.FC<ReportGeneratorProps> = ({
  isOpen,
  onClose,
  reportType,
  defaultDateRange,
  onGenerate
}) => {
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: 125000,
    expenses: 87500,
    netIncome: 37500,
    assets: 450000,
    liabilities: 180000,
    equity: 270000,
    cashFlow: {
      operating: 42000,
      investing: -15000,
      financing: -8000,
      netCash: 19000
    },
    monthlyData: [
      { month: 'Jan', revenue: 18000, expenses: 12000, profit: 6000 },
      { month: 'Feb', revenue: 22000, expenses: 14000, profit: 8000 },
      { month: 'Mar', revenue: 25000, expenses: 16000, profit: 9000 },
      { month: 'Apr', revenue: 28000, expenses: 18000, profit: 10000 },
      { month: 'May', revenue: 32000, expenses: 20000, profit: 12000 }
    ]
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const generateProfitLossReport = () => {
    const profitMargin = (financialData.netIncome / financialData.revenue) * 100;
    const expenseRatio = (financialData.expenses / financialData.revenue) * 100;
    
    return {
      title: 'Profit & Loss Statement',
      period: `${format(dateRange.startDate, 'MMM dd, yyyy')} - ${format(dateRange.endDate, 'MMM dd, yyyy')}`,
      sections: [
        {
          title: 'Revenue',
          items: [
            { label: 'Sales Revenue', amount: financialData.revenue, percentage: 100 },
            { label: 'Other Income', amount: 5000, percentage: 4 }
          ],
          total: financialData.revenue + 5000
        },
        {
          title: 'Cost of Goods Sold',
          items: [
            { label: 'Direct Materials', amount: 35000, percentage: 28 },
            { label: 'Direct Labor', amount: 25000, percentage: 20 },
            { label: 'Manufacturing Overhead', amount: 15000, percentage: 12 }
          ],
          total: 75000
        },
        {
          title: 'Operating Expenses',
          items: [
            { label: 'Salaries & Wages', amount: 45000, percentage: 36 },
            { label: 'Rent & Utilities', amount: 12000, percentage: 9.6 },
            { label: 'Marketing & Advertising', amount: 8000, percentage: 6.4 },
            { label: 'Office Supplies', amount: 3000, percentage: 2.4 },
            { label: 'Professional Services', amount: 7500, percentage: 6 }
          ],
          total: 75500
        }
      ],
      summary: {
        grossProfit: financialData.revenue - 75000,
        operatingIncome: financialData.revenue - 75000 - 75500,
        netIncome: financialData.netIncome,
        profitMargin: profitMargin.toFixed(2),
        expenseRatio: expenseRatio.toFixed(2)
      }
    };
  };

  const generateBalanceSheetReport = () => {
    return {
      title: 'Balance Sheet',
      period: `As of ${format(dateRange.endDate, 'MMM dd, yyyy')}`,
      sections: [
        {
          title: 'Assets',
          subsections: [
            {
              title: 'Current Assets',
              items: [
                { label: 'Cash & Cash Equivalents', amount: 85000 },
                { label: 'Accounts Receivable', amount: 65000 },
                { label: 'Inventory', amount: 45000 },
                { label: 'Prepaid Expenses', amount: 8000 }
              ],
              total: 203000
            },
            {
              title: 'Non-Current Assets',
              items: [
                { label: 'Property, Plant & Equipment', amount: 180000 },
                { label: 'Intangible Assets', amount: 35000 },
                { label: 'Investments', amount: 32000 }
              ],
              total: 247000
            }
          ],
          total: 450000
        },
        {
          title: 'Liabilities',
          subsections: [
            {
              title: 'Current Liabilities',
              items: [
                { label: 'Accounts Payable', amount: 35000 },
                { label: 'Short-term Loans', amount: 25000 },
                { label: 'Accrued Expenses', amount: 15000 },
                { label: 'Tax Payable', amount: 12000 }
              ],
              total: 87000
            },
            {
              title: 'Non-Current Liabilities',
              items: [
                { label: 'Long-term Loans', amount: 75000 },
                { label: 'Deferred Tax', amount: 18000 }
              ],
              total: 93000
            }
          ],
          total: 180000
        },
        {
          title: 'Equity',
          subsections: [
            {
              title: 'Shareholders\' Equity',
              items: [
                { label: 'Share Capital', amount: 150000 },
                { label: 'Retained Earnings', amount: 120000 }
              ],
              total: 270000
            }
          ],
          total: 270000
        }
      ],
      ratios: {
        currentRatio: (203000 / 87000).toFixed(2),
        debtToEquity: (180000 / 270000).toFixed(2),
        returnOnAssets: ((financialData.netIncome / financialData.assets) * 100).toFixed(2)
      }
    };
  };

  const generateCashFlowReport = () => {
    return {
      title: 'Cash Flow Statement',
      period: `${format(dateRange.startDate, 'MMM dd, yyyy')} - ${format(dateRange.endDate, 'MMM dd, yyyy')}`,
      sections: [
        {
          title: 'Operating Activities',
          items: [
            { label: 'Net Income', amount: financialData.netIncome },
            { label: 'Depreciation & Amortization', amount: 12000 },
            { label: 'Changes in Accounts Receivable', amount: -8000 },
            { label: 'Changes in Inventory', amount: -5000 },
            { label: 'Changes in Accounts Payable', amount: 6000 }
          ],
          total: financialData.cashFlow.operating
        },
        {
          title: 'Investing Activities',
          items: [
            { label: 'Purchase of Equipment', amount: -20000 },
            { label: 'Sale of Investments', amount: 5000 }
          ],
          total: financialData.cashFlow.investing
        },
        {
          title: 'Financing Activities',
          items: [
            { label: 'Loan Repayments', amount: -12000 },
            { label: 'Dividend Payments', amount: -8000 },
            { label: 'New Share Issue', amount: 12000 }
          ],
          total: financialData.cashFlow.financing
        }
      ],
      summary: {
        netCashFlow: financialData.cashFlow.netCash,
        beginningCash: 66000,
        endingCash: 85000
      }
    };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let reportData;
    switch (reportType) {
      case 'P&L':
        reportData = generateProfitLossReport();
        break;
      case 'Balance Sheet':
        reportData = generateBalanceSheetReport();
        break;
      case 'Cash Flow':
        reportData = generateCashFlowReport();
        break;
      default:
        reportData = generateProfitLossReport();
    }
    
    setIsGenerating(false);
    onGenerate(reportData);
  };

  const renderProfitLossPreview = () => {
    const data = generateProfitLossReport();
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${financialData.revenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">${financialData.expenses.toLocaleString()}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Net Income</p>
                  <p className="text-2xl font-bold text-blue-600">${financialData.netIncome.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Profit Margin Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Profit Margin</span>
                  <span>{data.summary.profitMargin}%</span>
                </div>
                <Progress value={parseFloat(data.summary.profitMargin)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Expense Ratio</span>
                  <span>{data.summary.expenseRatio}%</span>
                </div>
                <Progress value={parseFloat(data.summary.expenseRatio)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBalanceSheetPreview = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-blue-600">${financialData.assets.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Liabilities</p>
                <p className="text-2xl font-bold text-red-600">${financialData.liabilities.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Equity</p>
                <p className="text-2xl font-bold text-green-600">${financialData.equity.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Financial Ratios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Current Ratio</p>
                <p className="text-xl font-bold">2.33</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Debt-to-Equity</p>
                <p className="text-xl font-bold">0.67</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">ROA</p>
                <p className="text-xl font-bold">8.33%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCashFlowPreview = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Operating</p>
                <p className="text-xl font-bold text-green-600">${financialData.cashFlow.operating.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Investing</p>
                <p className="text-xl font-bold text-red-600">${financialData.cashFlow.investing.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Financing</p>
                <p className="text-xl font-bold text-red-600">${financialData.cashFlow.financing.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Net Cash Flow</p>
                <p className="text-xl font-bold text-blue-600">${financialData.cashFlow.netCash.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialData.monthlyData.map((month) => (
                  <TableRow key={month.month}>
                    <TableCell>{month.month}</TableCell>
                    <TableCell className="text-green-600">${month.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">${month.expenses.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-600">${month.profit.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPreview = () => {
    switch (reportType) {
      case 'P&L':
        return renderProfitLossPreview();
      case 'Balance Sheet':
        return renderBalanceSheetPreview();
      case 'Cash Flow':
        return renderCashFlowPreview();
      default:
        return renderProfitLossPreview();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {reportType} Report Generator
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Period: {format(dateRange.startDate, 'MMM dd, yyyy')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(), 'MMM dd, yyyy')}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};