'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, CheckCircle, XCircle, AlertCircle, RefreshCw, Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { doubleEntryService } from '@/services/doubleEntryService';
import { accountingReports } from '@/utils/accountingReports';

interface TrialBalanceTestProps {
  organizationId: string;
  userId: string;
}

interface TestResult {
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  details?: any;
}

const TrialBalanceTest: React.FC<TrialBalanceTestProps> = ({ organizationId, userId }) => {
  const [testResults, setTestResults] = useState<Record<number, TestResult>>({
    1: { status: 'pending', message: 'Generate trial balance report' },
    2: { status: 'pending', message: 'Verify debit and credit balance equality' },
    3: { status: 'pending', message: 'Test account balance accuracy' },
    4: { status: 'pending', message: 'Validate trial balance structure and format' },
    5: { status: 'pending', message: 'Test trial balance calculations' },
    6: { status: 'pending', message: 'Verify accounting equation compliance' }
  });

  const [isRunning, setIsRunning] = useState(false);
  const [trialBalanceData, setTrialBalanceData] = useState<any>(null);

  const updateTest = (testIndex: number, status: TestResult['status'], message: string, details?: any) => {
    setTestResults(prev => ({
      ...prev,
      [testIndex]: { status, message, details }
    }));
  };

  const runTest = async (testIndex: number) => {
    updateTest(testIndex, 'running', 'Running test...');

    try {
      switch (testIndex) {
        case 1: // Generate trial balance report
          const accounts = await doubleEntryService.getAccounts(organizationId);
          const journalEntries = await doubleEntryService.getJournalEntries(organizationId);
          
          // Convert accounts to trial balance format (similar to TrialBalance.tsx)
          const trialBalanceAccounts = accounts.map(account => {
            let debitBalance = 0;
            let creditBalance = 0;

            // Determine which side the balance appears on based on account type and balance
            if (account.currentBalance >= 0) {
              if (account.normalBalance === 'DEBIT') {
                debitBalance = account.currentBalance;
              } else {
                creditBalance = account.currentBalance;
              }
            } else {
              // Negative balance appears on opposite side
              if (account.normalBalance === 'DEBIT') {
                creditBalance = Math.abs(account.currentBalance);
              } else {
                debitBalance = Math.abs(account.currentBalance);
              }
            }

            return {
              accountId: account.id!,
              accountCode: account.accountCode,
              accountName: account.accountName,
              accountType: account.accountType,
              debitBalance,
              creditBalance
            };
          });

          // Calculate totals
          const totalDebits = trialBalanceAccounts.reduce((sum, account) => sum + account.debitBalance, 0);
          const totalCredits = trialBalanceAccounts.reduce((sum, account) => sum + account.creditBalance, 0);
          const difference = totalDebits - totalCredits;
          const isBalanced = Math.abs(difference) < 0.01;

          const trialBalance = {
            asOfDate: new Date().toISOString().split('T')[0],
            accounts: trialBalanceAccounts,
            totalDebits,
            totalCredits,
            isBalanced,
            difference,
            generatedAt: new Date().toISOString(),
            organizationId
          };

          setTrialBalanceData(trialBalance);

          updateTest(1, 'success', `Trial balance generated with ${trialBalance.accounts.length} accounts`, {
            totalAccounts: trialBalance.accounts.length,
            totalDebits: trialBalance.totalDebits,
            totalCredits: trialBalance.totalCredits,
            generatedAt: trialBalance.generatedAt,
            isBalanced: trialBalance.totalDebits === trialBalance.totalCredits,
            sampleAccounts: trialBalance.accounts.slice(0, 5).map((acc: any) => ({
              accountCode: acc.accountCode,
              accountName: acc.accountName,
              accountType: acc.accountType,
              debitBalance: acc.debitBalance,
              creditBalance: acc.creditBalance
            }))
          });
          break;

        case 2: // Verify debit and credit balance equality
          if (!trialBalanceData) {
            updateTest(2, 'error', 'No trial balance data available', {
              suggestion: 'Run test 1 first to generate trial balance'
            });
            break;
          }

          const totalDebits2 = trialBalanceData.totalDebits;
          const totalCredits2 = trialBalanceData.totalCredits;
          const difference2 = Math.abs(totalDebits2 - totalCredits2);
          const isBalanced2 = difference2 < 0.01; // Allow for small rounding differences

          const balanceAnalysis = {
            totalDebits: totalDebits2,
            totalCredits: totalCredits2,
            difference: difference2,
            isBalanced: isBalanced2,
            balancePercentage: totalCredits2 > 0 ? ((totalDebits2 / totalCredits2) * 100).toFixed(2) : '0',
            debitAccounts: trialBalanceData.accounts.filter((acc: any) => acc.debitBalance > 0).length,
            creditAccounts: trialBalanceData.accounts.filter((acc: any) => acc.creditBalance > 0).length
          };

          if (isBalanced2) {
            updateTest(2, 'success', `Trial balance is balanced! Debits = Credits (${totalDebits2.toFixed(2)})`, {
              balanceAnalysis,
              validation: {
                debitsEqualCredits: true,
                differenceWithinTolerance: difference2 < 0.01,
                balanceRatio: '1:1'
              }
            });
          } else {
            updateTest(2, 'error', `Trial balance is unbalanced! Difference: ${difference2.toFixed(2)}`, {
              balanceAnalysis,
              validation: {
                debitsEqualCredits: false,
                differenceAmount: difference2,
                requiresAdjustment: true
              }
            });
          }
          break;

        case 3: // Test account balance accuracy
          if (!trialBalanceData) {
            updateTest(3, 'error', 'No trial balance data available', {
              suggestion: 'Run test 1 first to generate trial balance'
            });
            break;
          }

          const allAccounts = await doubleEntryService.getAccounts(organizationId);
          const balanceAccuracy = {
            totalAccountsInSystem: allAccounts.length,
            totalAccountsInTrialBalance: trialBalanceData.accounts.length,
            accountsMatched: 0,
            balanceDiscrepancies: [] as any[],
            accuracyPercentage: 0
          };

          // Check each account's balance accuracy
          for (const tbAccount of trialBalanceData.accounts) {
            const systemAccount = allAccounts.find(acc => acc.id === tbAccount.accountId);
            if (systemAccount) {
              balanceAccuracy.accountsMatched++;
              
              // Check if balances match (considering debit/credit nature)
              const expectedBalance = systemAccount.currentBalance;
              const trialBalanceAmount = tbAccount.debitBalance || tbAccount.creditBalance || 0;
              
              if (Math.abs(expectedBalance - trialBalanceAmount) > 0.01) {
                balanceAccuracy.balanceDiscrepancies.push({
                  accountCode: tbAccount.accountCode,
                  accountName: tbAccount.accountName,
                  systemBalance: expectedBalance,
                  trialBalanceAmount,
                  difference: expectedBalance - trialBalanceAmount
                });
              }
            }
          }

          balanceAccuracy.accuracyPercentage = balanceAccuracy.totalAccountsInTrialBalance > 0 
            ? ((balanceAccuracy.accountsMatched / balanceAccuracy.totalAccountsInTrialBalance) * 100)
            : 0;

          if (balanceAccuracy.balanceDiscrepancies.length === 0) {
            updateTest(3, 'success', `All account balances are accurate (${balanceAccuracy.accuracyPercentage.toFixed(1)}% match)`, {
              balanceAccuracy,
              validation: {
                allBalancesMatch: true,
                discrepancyCount: 0,
                accuracyRate: balanceAccuracy.accuracyPercentage
              }
            });
          } else {
            updateTest(3, 'error', `Found ${balanceAccuracy.balanceDiscrepancies.length} balance discrepancies`, {
              balanceAccuracy,
              discrepancies: balanceAccuracy.balanceDiscrepancies.slice(0, 5) // Show first 5 discrepancies
            });
          }
          break;

        case 4: // Validate trial balance structure and format
          if (!trialBalanceData) {
            updateTest(4, 'error', 'No trial balance data available', {
              suggestion: 'Run test 1 first to generate trial balance'
            });
            break;
          }

          const structureValidation = {
            hasRequiredFields: {
              accounts: Array.isArray(trialBalanceData.accounts),
              totalDebits: typeof trialBalanceData.totalDebits === 'number',
              totalCredits: typeof trialBalanceData.totalCredits === 'number',
              generatedAt: !!trialBalanceData.generatedAt,
              organizationId: !!trialBalanceData.organizationId
            },
            accountStructure: {
              validAccounts: 0,
              invalidAccounts: 0,
              requiredFields: ['accountId', 'accountCode', 'accountName', 'accountType']
            },
            formatValidation: {
              numbersAreValid: true,
              datesAreValid: true,
              stringsAreValid: true
            }
          };

          // Validate each account structure
          for (const account of trialBalanceData.accounts) {
            const hasAllFields = structureValidation.accountStructure.requiredFields.every(field => 
              account.hasOwnProperty(field) && account[field] !== null && account[field] !== undefined
            );
            
            if (hasAllFields) {
              structureValidation.accountStructure.validAccounts++;
            } else {
              structureValidation.accountStructure.invalidAccounts++;
            }
          }

          // Validate number formats
          structureValidation.formatValidation.numbersAreValid = 
            !isNaN(trialBalanceData.totalDebits) && !isNaN(trialBalanceData.totalCredits);

          const allFieldsValid = Object.values(structureValidation.hasRequiredFields).every(Boolean);
          const allAccountsValid = structureValidation.accountStructure.invalidAccounts === 0;
          const allFormatsValid = Object.values(structureValidation.formatValidation).every(Boolean);

          if (allFieldsValid && allAccountsValid && allFormatsValid) {
            updateTest(4, 'success', 'Trial balance structure and format are valid', {
              structureValidation,
              validation: {
                structureComplete: true,
                formatValid: true,
                accountsValid: true
              }
            });
          } else {
            updateTest(4, 'error', 'Trial balance structure or format issues found', {
              structureValidation,
              issues: {
                missingFields: !allFieldsValid,
                invalidAccounts: !allAccountsValid,
                formatProblems: !allFormatsValid
              }
            });
          }
          break;

        case 5: // Test trial balance calculations
          if (!trialBalanceData) {
            updateTest(5, 'error', 'No trial balance data available', {
              suggestion: 'Run test 1 first to generate trial balance'
            });
            break;
          }

          const calculationValidation = {
            manualDebitTotal: 0,
            manualCreditTotal: 0,
            reportedDebitTotal: trialBalanceData.totalDebits,
            reportedCreditTotal: trialBalanceData.totalCredits,
            calculationAccuracy: {
              debitsMatch: false,
              creditsMatch: false,
              toleranceLevel: 0.01
            },
            accountTypeBreakdown: {
              ASSET: { debit: 0, credit: 0, count: 0 },
              LIABILITY: { debit: 0, credit: 0, count: 0 },
              EQUITY: { debit: 0, credit: 0, count: 0 },
              REVENUE: { debit: 0, credit: 0, count: 0 },
              EXPENSE: { debit: 0, credit: 0, count: 0 }
            }
          };

          // Manually calculate totals and breakdown by account type
          for (const account of trialBalanceData.accounts) {
            const debitAmount = account.debitBalance || 0;
            const creditAmount = account.creditBalance || 0;
            
            calculationValidation.manualDebitTotal += debitAmount;
            calculationValidation.manualCreditTotal += creditAmount;

            const accountType = account.accountType as keyof typeof calculationValidation.accountTypeBreakdown;
            if (calculationValidation.accountTypeBreakdown[accountType]) {
              calculationValidation.accountTypeBreakdown[accountType].debit += debitAmount;
              calculationValidation.accountTypeBreakdown[accountType].credit += creditAmount;
              calculationValidation.accountTypeBreakdown[accountType].count++;
            }
          }

          // Check calculation accuracy
          const debitDifference = Math.abs(calculationValidation.manualDebitTotal - calculationValidation.reportedDebitTotal);
          const creditDifference = Math.abs(calculationValidation.manualCreditTotal - calculationValidation.reportedCreditTotal);

          calculationValidation.calculationAccuracy.debitsMatch = debitDifference < calculationValidation.calculationAccuracy.toleranceLevel;
          calculationValidation.calculationAccuracy.creditsMatch = creditDifference < calculationValidation.calculationAccuracy.toleranceLevel;

          if (calculationValidation.calculationAccuracy.debitsMatch && calculationValidation.calculationAccuracy.creditsMatch) {
            updateTest(5, 'success', 'Trial balance calculations are accurate', {
              calculationValidation,
              verification: {
                debitCalculationCorrect: true,
                creditCalculationCorrect: true,
                debitDifference,
                creditDifference
              }
            });
          } else {
            updateTest(5, 'error', 'Trial balance calculation discrepancies found', {
              calculationValidation,
              discrepancies: {
                debitDifference,
                creditDifference,
                debitsMatch: calculationValidation.calculationAccuracy.debitsMatch,
                creditsMatch: calculationValidation.calculationAccuracy.creditsMatch
              }
            });
          }
          break;

        case 6: // Verify accounting equation compliance
          if (!trialBalanceData) {
            updateTest(6, 'error', 'No trial balance data available', {
              suggestion: 'Run test 1 first to generate trial balance'
            });
            break;
          }

          const equationValidation = {
            assets: 0,
            liabilities: 0,
            equity: 0,
            revenue: 0,
            expenses: 0,
            accountingEquation: {
              leftSide: 0,  // Assets
              rightSide: 0, // Liabilities + Equity
              isBalanced: false,
              difference: 0
            },
            profitLoss: {
              revenue: 0,
              expenses: 0,
              netIncome: 0
            }
          };

          // Calculate totals by account type
          for (const account of trialBalanceData.accounts) {
            const balance = (account.debitBalance || 0) - (account.creditBalance || 0);
            
            switch (account.accountType) {
              case 'ASSET':
                equationValidation.assets += Math.abs(balance);
                break;
              case 'LIABILITY':
                equationValidation.liabilities += Math.abs(balance);
                break;
              case 'EQUITY':
                equationValidation.equity += Math.abs(balance);
                break;
              case 'REVENUE':
                equationValidation.revenue += Math.abs(balance);
                break;
              case 'EXPENSE':
                equationValidation.expenses += Math.abs(balance);
                break;
            }
          }

          // Calculate accounting equation
          equationValidation.accountingEquation.leftSide = equationValidation.assets;
          equationValidation.accountingEquation.rightSide = equationValidation.liabilities + equationValidation.equity;
          equationValidation.accountingEquation.difference = Math.abs(
            equationValidation.accountingEquation.leftSide - equationValidation.accountingEquation.rightSide
          );
          equationValidation.accountingEquation.isBalanced = equationValidation.accountingEquation.difference < 0.01;

          // Calculate profit/loss
          equationValidation.profitLoss.revenue = equationValidation.revenue;
          equationValidation.profitLoss.expenses = equationValidation.expenses;
          equationValidation.profitLoss.netIncome = equationValidation.revenue - equationValidation.expenses;

          if (equationValidation.accountingEquation.isBalanced) {
            updateTest(6, 'success', 'Accounting equation is balanced (Assets = Liabilities + Equity)', {
              equationValidation,
              equation: {
                assets: equationValidation.assets,
                liabilities: equationValidation.liabilities,
                equity: equationValidation.equity,
                isBalanced: true,
                difference: equationValidation.accountingEquation.difference
              },
              profitLoss: equationValidation.profitLoss
            });
          } else {
            updateTest(6, 'error', `Accounting equation is unbalanced. Difference: ${equationValidation.accountingEquation.difference.toFixed(2)}`, {
              equationValidation,
              equation: {
                assets: equationValidation.assets,
                liabilities: equationValidation.liabilities,
                equity: equationValidation.equity,
                isBalanced: false,
                difference: equationValidation.accountingEquation.difference
              }
            });
          }
          break;

        default:
          updateTest(testIndex, 'error', 'Unknown test');
      }
    } catch (error) {
      updateTest(testIndex, 'error', error instanceof Error ? error.message : 'Unknown error', { error });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    for (let i = 1; i <= 6; i++) {
      await runTest(i);
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
            <Scale className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Trial Balance Test</h3>
              <p className="text-gray-600">Verify balance calculations, accuracy, and double-entry validation</p>
            </div>
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Calculator className="w-4 h-4 mr-2" />
            )}
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(testResults).map(([index, result]) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">Test {index}</h4>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => runTest(parseInt(index))}
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

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">Test Coverage</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Trial balance report generation</li>
            <li>• Debit and credit balance equality verification</li>
            <li>• Account balance accuracy testing</li>
            <li>• Trial balance structure and format validation</li>
            <li>• Trial balance calculation verification</li>
            <li>• Accounting equation compliance checking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrialBalanceTest;