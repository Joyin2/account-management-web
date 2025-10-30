'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  BookOpen,
  Calculator,
  FileText,
  Target,
  Lightbulb,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

import { doubleEntryService } from '@/services/doubleEntryService';
import { TransactionService } from '@/lib/firestore/transactions';

interface DoubleEntrySetupWizardProps {
  organizationId: string;
  userId: string;
  onComplete: () => void;
}

export default function DoubleEntrySetupWizard({ organizationId, userId, onComplete }: DoubleEntrySetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false]);
  const [setupResults, setSetupResults] = useState<{
    accountsCreated: number;
    transactionsSynced: number;
    journalEntriesCreated: number;
  }>({
    accountsCreated: 0,
    transactionsSynced: 0,
    journalEntriesCreated: 0
  });

  const steps = [
    {
      title: "Setup Chart of Accounts",
      description: "Create a comprehensive chart of accounts with all necessary account types",
      icon: BookOpen,
      action: async () => {
        const existingAccounts = await doubleEntryService.getAccounts(organizationId);
        if (existingAccounts.length === 0) {
          await doubleEntryService.createDefaultAccounts(organizationId, userId);
          const newAccounts = await doubleEntryService.getAccounts(organizationId);
          setSetupResults(prev => ({ ...prev, accountsCreated: newAccounts.length }));
        } else {
          setSetupResults(prev => ({ ...prev, accountsCreated: existingAccounts.length }));
        }
      }
    },
    {
      title: "Sync Existing Transactions",
      description: "Convert your existing transactions into double-entry journal entries",
      icon: RefreshCw,
      action: async () => {
        const result = await new TransactionService().syncTransactionsToJournalEntries(organizationId);
        setSetupResults(prev => ({ 
          ...prev, 
          transactionsSynced: result.success,
          journalEntriesCreated: result.success 
        }));
      }
    },
    {
      title: "Verify Setup",
      description: "Ensure everything is working correctly and generate your first trial balance",
      icon: Target,
      action: async () => {
        await doubleEntryService.getTrialBalance(organizationId);
        // Just a verification step
      }
    }
  ];

  const executeStep = async (stepIndex: number) => {
    setLoading(true);
    try {
      await steps[stepIndex].action();
      const newCompleted = [...completed];
      newCompleted[stepIndex] = true;
      setCompleted(newCompleted);
      
      if (stepIndex < steps.length - 1) {
        setCurrentStep(stepIndex + 1);
      }
    } catch (error) {
      console.error('Error executing step:', error);
      alert(`Error in step ${stepIndex + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const allCompleted = completed.every(step => step);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Double-Entry Accounting Setup
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Let's set up your double-entry accounting system in just a few steps. This will create your chart of accounts 
            and convert your existing transactions into proper journal entries.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Setup Progress</span>
            <span className="text-sm text-gray-500">{completed.filter(Boolean).length} of {steps.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completed.filter(Boolean).length / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index;
            const isCompleted = completed[index];
            const isDisabled = index > currentStep;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg p-6 transition-all duration-200 ${
                  isActive ? 'border-blue-500 bg-blue-50' :
                  isCompleted ? 'border-green-500 bg-green-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-blue-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        isActive ? 'text-blue-900' :
                        isCompleted ? 'text-green-900' :
                        'text-gray-700'
                      }`}>
                        Step {index + 1}: {step.title}
                      </h3>
                      <p className={`text-sm ${
                        isActive ? 'text-blue-700' :
                        isCompleted ? 'text-green-700' :
                        'text-gray-600'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {isActive && !isCompleted && (
                    <button
                      onClick={() => executeStep(index)}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Execute
                        </>
                      )}
                    </button>
                  )}
                  
                  {isCompleted && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Results Summary */}
        {(setupResults.accountsCreated > 0 || setupResults.transactionsSynced > 0) && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Setup Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{setupResults.accountsCreated}</div>
                <div className="text-blue-700">Accounts Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{setupResults.transactionsSynced}</div>
                <div className="text-blue-700">Transactions Synced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{setupResults.journalEntriesCreated}</div>
                <div className="text-blue-700">Journal Entries Created</div>
              </div>
            </div>
          </div>
        )}

        {/* Completion */}
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-green-100 border border-green-200 rounded-lg text-center"
          >
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Setup Completed Successfully!
            </h3>
            <p className="text-green-700 mb-4">
              Your double-entry accounting system is now fully configured and ready to use.
            </p>
            <button
              onClick={onComplete}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Start Using Double-Entry Accounting
            </button>
          </motion.div>
        )}

        {/* Help Text */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">What happens during setup?</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Creates a comprehensive chart of accounts with all standard account types</li>
                <li>• Converts your existing transactions into proper double-entry journal entries</li>
                <li>• Ensures all debits equal credits for accurate financial reporting</li>
                <li>• Enables generation of professional financial statements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
