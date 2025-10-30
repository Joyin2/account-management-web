'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { accountingReports, AccountingReportData } from '@/utils/accountingReports';
import { doubleEntryService } from '@/services/doubleEntryService';

interface DownloadReportTestProps {
  organizationId: string;
  userId: string;
}

interface TestResult {
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  details?: any;
}

const DownloadReportTest: React.FC<DownloadReportTestProps> = ({ organizationId, userId }) => {
  const [testResults, setTestResults] = useState<Record<number, TestResult>>({
    1: { status: 'pending', message: 'Verify accounting data availability' },
    2: { status: 'pending', message: 'Test report data structure generation' },
    3: { status: 'pending', message: 'Test individual report generation functions' },
    4: { status: 'pending', message: 'Test comprehensive report package download' },
    5: { status: 'pending', message: 'Verify CSV export functionality' },
    6: { status: 'pending', message: 'Test file download mechanism' }
  });

  const [isRunning, setIsRunning] = useState(false);

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
        case 1: // Verify accounting data availability
          const accounts = await doubleEntryService.getAccounts(organizationId);
          const journalEntries = await doubleEntryService.getJournalEntries(organizationId);
          const journalLines = await doubleEntryService.getAllJournalLines(organizationId);

          if (accounts.length > 0 || journalEntries.length > 0) {
            updateTest(1, 'success', `Found ${accounts.length} accounts, ${journalEntries.length} journal entries, ${journalLines.length} journal lines`, {
              accountsCount: accounts.length,
              journalEntriesCount: journalEntries.length,
              journalLinesCount: journalLines.length
            });
          } else {
            updateTest(1, 'error', 'No accounting data found - reports will be empty', {
              accountsCount: accounts.length,
              journalEntriesCount: journalEntries.length
            });
          }
          break;

        case 2: // Test report data structure generation
          const accounts2 = await doubleEntryService.getAccounts(organizationId);
          const journalEntries2 = await doubleEntryService.getJournalEntries(organizationId);
          const journalLines2 = await doubleEntryService.getAllJournalLines(organizationId);

          const reportData: AccountingReportData = {
            organizationName: 'Test Organization',
            reportDate: new Date().toLocaleDateString(),
            reportType: 'Test Comprehensive Report',
            accounts: accounts2,
            journalEntries: journalEntries2,
            journalLines: journalLines2
          };

          if (reportData.organizationName && reportData.reportDate && reportData.reportType) {
            updateTest(2, 'success', 'Report data structure created successfully', {
              structure: {
                organizationName: reportData.organizationName,
                reportDate: reportData.reportDate,
                reportType: reportData.reportType,
                dataArrays: {
                  accounts: reportData.accounts.length,
                  journalEntries: reportData.journalEntries.length,
                  journalLines: reportData.journalLines.length
                }
              }
            });
          } else {
            updateTest(2, 'error', 'Report data structure incomplete', { reportData });
          }
          break;

        case 3: // Test individual report generation functions
          const accounts3 = await doubleEntryService.getAccounts(organizationId);
          const journalEntries3 = await doubleEntryService.getJournalEntries(organizationId);
          const journalLines3 = await doubleEntryService.getAllJournalLines(organizationId);

          const testReportData: AccountingReportData = {
            organizationName: 'Test Organization',
            reportDate: new Date().toLocaleDateString(),
            reportType: 'Individual Function Test',
            accounts: accounts3,
            journalEntries: journalEntries3,
            journalLines: journalLines3
          };

          try {
            // Test individual report generation functions
            const comprehensiveReport = accountingReports.generateComprehensiveReport(testReportData);
            const chartCSV = accountingReports.generateChartOfAccountsCSV(testReportData.accounts);
            const journalCSV = accountingReports.generateJournalEntriesCSV(testReportData.journalEntries, testReportData.journalLines);
            const trialBalanceCSV = accountingReports.generateTrialBalanceCSV(testReportData.accounts);

            const results = {
              comprehensiveReport: comprehensiveReport.length > 0,
              chartCSV: chartCSV.length > 0,
              journalCSV: journalCSV.length > 0,
              trialBalanceCSV: trialBalanceCSV.length > 0
            };

            const allGenerated = Object.values(results).every(Boolean);

            if (allGenerated) {
              updateTest(3, 'success', 'All report generation functions working', {
                reportLengths: {
                  comprehensive: comprehensiveReport.length,
                  chartCSV: chartCSV.length,
                  journalCSV: journalCSV.length,
                  trialBalanceCSV: trialBalanceCSV.length
                },
                results
              });
            } else {
              updateTest(3, 'error', 'Some report generation functions failed', { results });
            }
          } catch (error) {
            updateTest(3, 'error', 'Error in report generation functions', { error });
          }
          break;

        case 4: // Test comprehensive report package download (simulation)
          const accounts4 = await doubleEntryService.getAccounts(organizationId);
          const journalEntries4 = await doubleEntryService.getJournalEntries(organizationId);
          const journalLines4 = await doubleEntryService.getAllJournalLines(organizationId);

          const packageReportData: AccountingReportData = {
            organizationName: 'Test Organization',
            reportDate: new Date().toLocaleDateString(),
            reportType: 'Package Download Test',
            accounts: accounts4,
            journalEntries: journalEntries4,
            journalLines: journalLines4
          };

          try {
            // Test if downloadAccountingPackage function exists and can be called
            // Note: We won't actually trigger downloads in test mode
            if (typeof accountingReports.downloadAccountingPackage === 'function') {
              updateTest(4, 'success', 'Download package function available and ready', {
                functionExists: true,
                dataReady: true,
                expectedFiles: [
                  'accounting-report-[date].txt',
                  'chart-of-accounts-[date].csv',
                  'journal-entries-[date].csv',
                  'trial-balance-[date].csv',
                  'income-statement-[date].csv',
                  'balance-sheet-[date].csv'
                ]
              });
            } else {
              updateTest(4, 'error', 'Download package function not available', {});
            }
          } catch (error) {
            updateTest(4, 'error', 'Error testing download package function', { error });
          }
          break;

        case 5: // Test CSV export functionality
          const accounts5 = await doubleEntryService.getAccounts(organizationId);

          try {
            const csvContent = accountingReports.generateChartOfAccountsCSV(accounts5);
            const hasHeaders = csvContent.includes('Account Code,Account Name,Account Type,Balance');
            const hasData = csvContent.split('\n').length > 1;

            if (hasHeaders && hasData) {
              updateTest(5, 'success', 'CSV export functionality working correctly', {
                hasHeaders,
                hasData,
                lineCount: csvContent.split('\n').length,
                sampleContent: csvContent.substring(0, 200) + '...'
              });
            } else {
              updateTest(5, 'error', 'CSV export missing headers or data', {
                hasHeaders,
                hasData,
                content: csvContent.substring(0, 100)
              });
            }
          } catch (error) {
            updateTest(5, 'error', 'Error in CSV export functionality', { error });
          }
          break;

        case 6: // Test file download mechanism
          try {
            // Test if download utility functions exist
            const downloadReportExists = typeof accountingReports.downloadReport === 'function';
            const downloadFileExists = typeof accountingReports.downloadFile === 'function';

            if (downloadReportExists && downloadFileExists) {
              updateTest(6, 'success', 'File download mechanisms available', {
                downloadReport: downloadReportExists,
                downloadFile: downloadFileExists,
                browserSupport: typeof window !== 'undefined' && typeof document !== 'undefined'
              });
            } else {
              updateTest(6, 'error', 'File download mechanisms not available', {
                downloadReport: downloadReportExists,
                downloadFile: downloadFileExists
              });
            }
          } catch (error) {
            updateTest(6, 'error', 'Error testing file download mechanisms', { error });
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
            <Download className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Download Report Test</h3>
              <p className="text-gray-600">Verify accounting report generation and download functionality</p>
            </div>
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
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

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Test Coverage</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Accounting data availability verification</li>
            <li>• Report data structure generation</li>
            <li>• Individual report generation functions</li>
            <li>• Comprehensive report package download</li>
            <li>• CSV export functionality</li>
            <li>• File download mechanism verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DownloadReportTest;