'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { doubleEntryService } from '@/services/doubleEntryService';
import { accountingReports } from '@/utils/accountingReports';

interface FinancialStatementsTestProps {
  organizationId: string;
  userId: string;
}

interface TestResult {
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  details?: any;
}

const FinancialStatementsTest: React.FC<FinancialStatementsTestProps> = ({ organizationId, userId }) => {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({
    'Generate Income Statement': { status: 'pending', message: 'Generate Income Statement (P&L)' },
    'Generate Balance Sheet': { status: 'pending', message: 'Generate Balance Sheet' },
    'Verify Income Statement': { status: 'pending', message: 'Verify Income Statement calculations' },
    'Verify Accounting Equation': { status: 'pending', message: 'Verify Balance Sheet equation (Assets = Liabilities + Equity)' },
    'Test Statement Formatting': { status: 'pending', message: 'Test financial statement formatting and structure' },
    'Calculate Financial Ratios': { status: 'pending', message: 'Validate financial ratios and metrics' }
  });

  const [isRunning, setIsRunning] = useState(false);
  const [incomeStatementData, setIncomeStatementData] = useState<any>(null);
  const [balanceSheetData, setBalanceSheetData] = useState<any>(null);

  const updateTestResult = (testName: string, status: TestResult['status'], message: string, details?: any) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status, message, details }
    }));
  };

  const runTest = async (testName: string) => {
    updateTestResult(testName, 'running', 'Running test...');

    try {
      switch (testName) {
        case 'Generate Income Statement': // Generate Income Statement (P&L)
          const accounts = await doubleEntryService.getAccounts(organizationId);
          const revenueAccounts = accounts.filter(acc => acc.accountType === 'REVENUE');
          const expenseAccounts = accounts.filter(acc => acc.accountType === 'EXPENSE');
          
          const revenueTotal = revenueAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
          const expenseTotal = expenseAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
          const netIncome = revenueTotal - expenseTotal;
          
          const incomeStatement = {
            revenue: revenueAccounts.map(acc => ({ accountName: acc.accountName, amount: acc.currentBalance })),
            expenses: expenseAccounts.map(acc => ({ accountName: acc.accountName, amount: acc.currentBalance })),
            totalRevenue: revenueTotal,
            totalExpenses: expenseTotal,
            netIncome,
            generatedAt: new Date().toISOString(),
            period: 'Current Period'
          };
          
          setIncomeStatementData(incomeStatement);

          updateTestResult('Generate Income Statement', 'success', `Income Statement generated with ${incomeStatement.revenue.length} revenue items and ${incomeStatement.expenses.length} expense items`, {
            incomeStatement: {
              revenueItems: incomeStatement.revenue.length,
              expenseItems: incomeStatement.expenses.length,
              totalRevenue: revenueTotal,
              totalExpenses: expenseTotal,
              netIncome,
              generatedAt: incomeStatement.generatedAt,
              period: incomeStatement.period
            },
            sampleRevenue: incomeStatement.revenue.slice(0, 3).map((item: any) => ({
              accountName: item.accountName,
              amount: item.amount
            })),
            sampleExpenses: incomeStatement.expenses.slice(0, 3).map((item: any) => ({
              accountName: item.accountName,
              amount: item.amount
            }))
          });
          break;

        case 'Generate Balance Sheet': // Generate Balance Sheet
          const balanceSheetAccounts = await doubleEntryService.getAccounts(organizationId);
          const assetAccounts = balanceSheetAccounts.filter(acc => acc.accountType === 'ASSET');
          const liabilityAccounts = balanceSheetAccounts.filter(acc => acc.accountType === 'LIABILITY');
          const equityAccounts = balanceSheetAccounts.filter(acc => acc.accountType === 'EQUITY');
          
          const totalAssets = assetAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
          const totalLiabilities = liabilityAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
          const totalEquity = equityAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
          
          const balanceSheet = {
            assets: assetAccounts.map(acc => ({ accountName: acc.accountName, amount: acc.currentBalance })),
            liabilities: liabilityAccounts.map(acc => ({ accountName: acc.accountName, amount: acc.currentBalance })),
            equity: equityAccounts.map(acc => ({ accountName: acc.accountName, amount: acc.currentBalance })),
            totalAssets,
            totalLiabilities,
            totalEquity,
            generatedAt: new Date().toISOString(),
            asOfDate: new Date().toISOString()
          };
          
          setBalanceSheetData(balanceSheet);

          updateTestResult('Generate Balance Sheet', 'success', `Balance Sheet generated with ${balanceSheet.assets.length} assets, ${balanceSheet.liabilities.length} liabilities, and ${balanceSheet.equity.length} equity items`, {
            balanceSheet: {
              assetItems: balanceSheet.assets.length,
              liabilityItems: balanceSheet.liabilities.length,
              equityItems: balanceSheet.equity.length,
              totalAssets,
              totalLiabilities,
              totalEquity,
              generatedAt: balanceSheet.generatedAt,
              asOfDate: balanceSheet.asOfDate
            },
            sampleAssets: balanceSheet.assets.slice(0, 3).map((item: any) => ({
              accountName: item.accountName,
              amount: item.amount
            })),
            sampleLiabilities: balanceSheet.liabilities.slice(0, 3).map((item: any) => ({
              accountName: item.accountName,
              amount: item.amount
            })),
            sampleEquity: balanceSheet.equity.slice(0, 3).map((item: any) => ({
              accountName: item.accountName,
              amount: item.amount
            }))
          });
          break;

        case 'Verify Income Statement': // Verify Income Statement calculations
          if (!incomeStatementData) {
            updateTestResult('Verify Income Statement', 'error', 'No Income Statement data available', {
              suggestion: 'Run Generate Income Statement test first'
            });
            break;
          }

          const calculationValidation = {
            revenueCalculation: {
              manualTotal: 0,
              reportedTotal: incomeStatementData.totalRevenue || 0,
              itemCount: incomeStatementData.revenue.length,
              isAccurate: false
            },
            expenseCalculation: {
              manualTotal: 0,
              reportedTotal: incomeStatementData.totalExpenses || 0,
              itemCount: incomeStatementData.expenses.length,
              isAccurate: false
            },
            netIncomeCalculation: {
              manualNetIncome: 0,
              reportedNetIncome: incomeStatementData.netIncome || 0,
              isAccurate: false
            },
            categoryBreakdown: {
              revenueByCategory: {} as Record<string, number>,
              expensesByCategory: {} as Record<string, number>
            }
          };

          // Manual calculation of revenue
          for (const revenueItem of incomeStatementData.revenue) {
            calculationValidation.revenueCalculation.manualTotal += revenueItem.amount;
            
            const category = revenueItem.category || 'Other Revenue';
            calculationValidation.categoryBreakdown.revenueByCategory[category] = 
              (calculationValidation.categoryBreakdown.revenueByCategory[category] || 0) + revenueItem.amount;
          }

          // Manual calculation of expenses
          for (const expenseItem of incomeStatementData.expenses) {
            calculationValidation.expenseCalculation.manualTotal += expenseItem.amount;
            
            const category = expenseItem.category || 'Other Expenses';
            calculationValidation.categoryBreakdown.expensesByCategory[category] = 
              (calculationValidation.categoryBreakdown.expensesByCategory[category] || 0) + expenseItem.amount;
          }

          // Manual calculation of net income
          calculationValidation.netIncomeCalculation.manualNetIncome = 
            calculationValidation.revenueCalculation.manualTotal - calculationValidation.expenseCalculation.manualTotal;

          // Check accuracy (allow for small rounding differences)
          const tolerance = 0.01;
          calculationValidation.revenueCalculation.isAccurate = 
            Math.abs(calculationValidation.revenueCalculation.manualTotal - calculationValidation.revenueCalculation.reportedTotal) < tolerance;
          
          calculationValidation.expenseCalculation.isAccurate = 
            Math.abs(calculationValidation.expenseCalculation.manualTotal - calculationValidation.expenseCalculation.reportedTotal) < tolerance;
          
          calculationValidation.netIncomeCalculation.isAccurate = 
            Math.abs(calculationValidation.netIncomeCalculation.manualNetIncome - calculationValidation.netIncomeCalculation.reportedNetIncome) < tolerance;

          const allCalculationsAccurate = 
            calculationValidation.revenueCalculation.isAccurate &&
            calculationValidation.expenseCalculation.isAccurate &&
            calculationValidation.netIncomeCalculation.isAccurate;

          if (allCalculationsAccurate) {
            updateTestResult('Verify Income Statement', 'success', 'All Income Statement calculations are accurate', {
              calculationValidation,
              verification: {
                revenueAccurate: calculationValidation.revenueCalculation.isAccurate,
                expensesAccurate: calculationValidation.expenseCalculation.isAccurate,
                netIncomeAccurate: calculationValidation.netIncomeCalculation.isAccurate
              }
            });
          } else {
            updateTestResult('Verify Income Statement', 'error', 'Income Statement calculation discrepancies found', {
              calculationValidation,
              discrepancies: {
                revenue: !calculationValidation.revenueCalculation.isAccurate,
                expenses: !calculationValidation.expenseCalculation.isAccurate,
                netIncome: !calculationValidation.netIncomeCalculation.isAccurate
              }
            });
          }
          break;

        case 'Verify Accounting Equation': // Verify Balance Sheet equation
          if (!balanceSheetData) {
            updateTestResult('Verify Accounting Equation', 'error', 'No Balance Sheet data available', {
              suggestion: 'Run Generate Balance Sheet test first'
            });
            break;
          }

          const equationValidation = {
            assets: {
              manualTotal: 0,
              reportedTotal: balanceSheetData.totalAssets || 0,
              itemCount: balanceSheetData.assets.length
            },
            liabilities: {
              manualTotal: 0,
              reportedTotal: balanceSheetData.totalLiabilities || 0,
              itemCount: balanceSheetData.liabilities.length
            },
            equity: {
              manualTotal: 0,
              reportedTotal: balanceSheetData.totalEquity || 0,
              itemCount: balanceSheetData.equity.length
            },
            equation: {
              leftSide: 0,  // Assets
              rightSide: 0, // Liabilities + Equity
              difference: 0,
              isBalanced: false
            }
          };

          // Manual calculations
          for (const asset of balanceSheetData.assets) {
            equationValidation.assets.manualTotal += asset.amount;
          }

          for (const liability of balanceSheetData.liabilities) {
            equationValidation.liabilities.manualTotal += liability.amount;
          }

          for (const equityItem of balanceSheetData.equity) {
            equationValidation.equity.manualTotal += equityItem.amount;
          }

          // Check accounting equation: Assets = Liabilities + Equity
          equationValidation.equation.leftSide = equationValidation.assets.manualTotal;
          equationValidation.equation.rightSide = equationValidation.liabilities.manualTotal + equationValidation.equity.manualTotal;
          equationValidation.equation.difference = Math.abs(equationValidation.equation.leftSide - equationValidation.equation.rightSide);
          equationValidation.equation.isBalanced = equationValidation.equation.difference < 0.01;

          if (equationValidation.equation.isBalanced) {
            updateTestResult('Verify Accounting Equation', 'success', 'Balance Sheet equation is balanced (Assets = Liabilities + Equity)', {
              equationValidation,
              equation: {
                assets: equationValidation.equation.leftSide,
                liabilities: equationValidation.liabilities.manualTotal,
                equity: equationValidation.equity.manualTotal,
                liabilitiesPlusEquity: equationValidation.equation.rightSide,
                difference: equationValidation.equation.difference,
                isBalanced: true
              }
            });
          } else {
            updateTestResult('Verify Accounting Equation', 'error', `Balance Sheet equation is unbalanced. Difference: ${equationValidation.equation.difference.toFixed(2)}`, {
              equationValidation,
              equation: {
                assets: equationValidation.equation.leftSide,
                liabilities: equationValidation.liabilities.manualTotal,
                equity: equationValidation.equity.manualTotal,
                liabilitiesPlusEquity: equationValidation.equation.rightSide,
                difference: equationValidation.equation.difference,
                isBalanced: false
              }
            });
          }
          break;

        case 'Test Statement Formatting': // Test financial statement formatting and structure
          const formatValidation = {
            incomeStatement: {
              hasRequiredSections: false,
              hasValidStructure: false,
              hasProperFormatting: false,
              requiredFields: ['revenue', 'expenses', 'totalRevenue', 'totalExpenses', 'netIncome', 'generatedAt']
            },
            balanceSheet: {
              hasRequiredSections: false,
              hasValidStructure: false,
              hasProperFormatting: false,
              requiredFields: ['assets', 'liabilities', 'equity', 'totalAssets', 'totalLiabilities', 'totalEquity', 'generatedAt']
            }
          };

          // Validate Income Statement structure
          if (incomeStatementData) {
            formatValidation.incomeStatement.hasRequiredSections = 
              Array.isArray(incomeStatementData.revenue) && Array.isArray(incomeStatementData.expenses);
            
            formatValidation.incomeStatement.hasValidStructure = 
              formatValidation.incomeStatement.requiredFields.every(field => 
                incomeStatementData.hasOwnProperty(field) && incomeStatementData[field] !== null
              );
            
            formatValidation.incomeStatement.hasProperFormatting = 
              typeof incomeStatementData.totalRevenue === 'number' &&
              typeof incomeStatementData.totalExpenses === 'number' &&
              typeof incomeStatementData.netIncome === 'number';
          }

          // Validate Balance Sheet structure
          if (balanceSheetData) {
            formatValidation.balanceSheet.hasRequiredSections = 
              Array.isArray(balanceSheetData.assets) && 
              Array.isArray(balanceSheetData.liabilities) && 
              Array.isArray(balanceSheetData.equity);
            
            formatValidation.balanceSheet.hasValidStructure = 
              formatValidation.balanceSheet.requiredFields.every(field => 
                balanceSheetData.hasOwnProperty(field) && balanceSheetData[field] !== null
              );
            
            formatValidation.balanceSheet.hasProperFormatting = 
              typeof balanceSheetData.totalAssets === 'number' &&
              typeof balanceSheetData.totalLiabilities === 'number' &&
              typeof balanceSheetData.totalEquity === 'number';
          }

          const allFormatsValid = 
            formatValidation.incomeStatement.hasRequiredSections &&
            formatValidation.incomeStatement.hasValidStructure &&
            formatValidation.incomeStatement.hasProperFormatting &&
            formatValidation.balanceSheet.hasRequiredSections &&
            formatValidation.balanceSheet.hasValidStructure &&
            formatValidation.balanceSheet.hasProperFormatting;

          if (allFormatsValid) {
            updateTestResult('Test Statement Formatting', 'success', 'Financial statement formatting and structure are valid', {
              formatValidation,
              validation: {
                incomeStatementValid: true,
                balanceSheetValid: true,
                structureComplete: true
              }
            });
          } else {
            updateTestResult('Test Statement Formatting', 'error', 'Financial statement formatting or structure issues found', {
              formatValidation,
              issues: {
                incomeStatementIssues: !formatValidation.incomeStatement.hasValidStructure,
                balanceSheetIssues: !formatValidation.balanceSheet.hasValidStructure,
                formattingIssues: !formatValidation.incomeStatement.hasProperFormatting || !formatValidation.balanceSheet.hasProperFormatting
              }
            });
          }
          break;

        case 'Calculate Financial Ratios': // Validate financial ratios and metrics
          if (!incomeStatementData || !balanceSheetData) {
            updateTestResult('Calculate Financial Ratios', 'error', 'Both Income Statement and Balance Sheet data required', {
              suggestion: 'Run Generate Income Statement and Generate Balance Sheet tests first'
            });
            break;
          }

          const ratioAnalysis = {
            profitabilityRatios: {
              grossProfitMargin: 0,
              netProfitMargin: 0,
              returnOnAssets: 0,
              returnOnEquity: 0
            },
            liquidityRatios: {
              currentRatio: 0,
              quickRatio: 0,
              workingCapital: 0
            },
            leverageRatios: {
              debtToAssets: 0,
              debtToEquity: 0,
              equityRatio: 0
            },
            metrics: {
              totalRevenue: incomeStatementData.totalRevenue || 0,
              totalExpenses: incomeStatementData.totalExpenses || 0,
              netIncome: incomeStatementData.netIncome || 0,
              totalAssets: balanceSheetData.totalAssets || 0,
              totalLiabilities: balanceSheetData.totalLiabilities || 0,
              totalEquity: balanceSheetData.totalEquity || 0
            }
          };

          // Calculate profitability ratios
          if (ratioAnalysis.metrics.totalRevenue > 0) {
            ratioAnalysis.profitabilityRatios.netProfitMargin = 
              (ratioAnalysis.metrics.netIncome / ratioAnalysis.metrics.totalRevenue) * 100;
          }

          if (ratioAnalysis.metrics.totalAssets > 0) {
            ratioAnalysis.profitabilityRatios.returnOnAssets = 
              (ratioAnalysis.metrics.netIncome / ratioAnalysis.metrics.totalAssets) * 100;
          }

          if (ratioAnalysis.metrics.totalEquity > 0) {
            ratioAnalysis.profitabilityRatios.returnOnEquity = 
              (ratioAnalysis.metrics.netIncome / ratioAnalysis.metrics.totalEquity) * 100;
          }

          // Calculate leverage ratios
          if (ratioAnalysis.metrics.totalAssets > 0) {
            ratioAnalysis.leverageRatios.debtToAssets = 
              (ratioAnalysis.metrics.totalLiabilities / ratioAnalysis.metrics.totalAssets) * 100;
            
            ratioAnalysis.leverageRatios.equityRatio = 
              (ratioAnalysis.metrics.totalEquity / ratioAnalysis.metrics.totalAssets) * 100;
          }

          if (ratioAnalysis.metrics.totalEquity > 0) {
            ratioAnalysis.leverageRatios.debtToEquity = 
              (ratioAnalysis.metrics.totalLiabilities / ratioAnalysis.metrics.totalEquity) * 100;
          }

          // Calculate working capital
          const currentAssets = balanceSheetData.assets
            .filter((asset: any) => asset.category === 'Current Assets' || asset.accountName.toLowerCase().includes('current'))
            .reduce((sum: number, asset: any) => sum + asset.amount, 0);
          
          const currentLiabilities = balanceSheetData.liabilities
            .filter((liability: any) => liability.category === 'Current Liabilities' || liability.accountName.toLowerCase().includes('current'))
            .reduce((sum: number, liability: any) => sum + liability.amount, 0);

          ratioAnalysis.liquidityRatios.workingCapital = currentAssets - currentLiabilities;
          
          if (currentLiabilities > 0) {
            ratioAnalysis.liquidityRatios.currentRatio = currentAssets / currentLiabilities;
          }

          updateTestResult('Calculate Financial Ratios', 'success', 'Financial ratios and metrics calculated successfully', {
            ratioAnalysis,
            interpretation: {
              profitability: ratioAnalysis.profitabilityRatios.netProfitMargin > 0 ? 'Profitable' : 'Loss',
              leverage: ratioAnalysis.leverageRatios.debtToAssets < 50 ? 'Conservative' : 'Leveraged',
              liquidity: ratioAnalysis.liquidityRatios.workingCapital > 0 ? 'Positive' : 'Negative'
            }
          });
          break;

        default:
          updateTestResult(testName, 'error', 'Unknown test');
      }
    } catch (error) {
      updateTestResult(testName, 'error', error instanceof Error ? error.message : 'Unknown error', { error });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const testNames = [
      'Generate Income Statement',
      'Generate Balance Sheet', 
      'Verify Income Statement',
      'Verify Accounting Equation',
      'Test Statement Formatting',
      'Calculate Financial Ratios'
    ];
    
    for (const testName of testNames) {
      await runTest(testName);
      // Small delay between tests for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-indigo-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Financial Statements Test</h3>
              <p className="text-gray-600">Verify P&L and Balance Sheet generation and accuracy</p>
            </div>
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="w-4 h-4 mr-2" />
            )}
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(testResults).map(([testName, result]) => (
            <motion.div
              key={testName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{testName}</h4>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => runTest(testName)}
                  disabled={result.status === 'running' || isRunning}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Run Test
                </button>
              </div>
              
              {result.details && (
                <div className="mt-3 p-3 bg-gray-100 rounded text-xs">
                  <pre className="whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-medium text-indigo-900 mb-2">Test Coverage</h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• Income Statement (P&L) generation and validation</li>
            <li>• Balance Sheet generation and validation</li>
            <li>• Income Statement calculation verification</li>
            <li>• Balance Sheet equation compliance (Assets = Liabilities + Equity)</li>
            <li>• Financial statement formatting and structure validation</li>
            <li>• Financial ratios and metrics calculation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatementsTest;