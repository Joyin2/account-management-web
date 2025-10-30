'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Calculator,
  FileText,
  Download,
  Lightbulb,
  Target
} from 'lucide-react';

import { doubleEntryService } from '@/services/doubleEntryService';

interface DoubleEntryDemoProps {
  organizationId: string;
  userId: string;
  onComplete: () => void;
}

export default function DoubleEntryDemo({ organizationId, userId, onComplete }: DoubleEntryDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);

  const steps = [
    {
      title: "Setup Chart of Accounts",
      description: "Create the foundation of your accounting system with a comprehensive chart of accounts",
      icon: BookOpen,
      action: async () => {
        await doubleEntryService.createDefaultAccounts(organizationId, userId);
      }
    },
    {
      title: "Create Sample Journal Entry",
      description: "Learn how to record transactions using double-entry bookkeeping",
      icon: Calculator,
      action: async () => {
        // Create a sample journal entry
        const entryData = {
          entryNumber: await doubleEntryService.generateEntryNumber(organizationId),
          date: new Date().toISOString().split('T')[0],
          description: "Demo: Cash sale of goods",
          reference: "DEMO-001",
          status: 'POSTED' as const,
          totalDebits: 1000,
          totalCredits: 1000,
          isBalanced: true,
          organizationId,
          userId
        };

        const lines = [
          {
            accountId: '', // Will be filled with actual account ID
            accountCode: '1000',
            accountName: 'Cash',
            debitAmount: 1000,
            creditAmount: 0,
            description: 'Cash received from sale',
            lineNumber: 1,
            organizationId,
            userId
          },
          {
            accountId: '', // Will be filled with actual account ID
            accountCode: '4000',
            accountName: 'Sales Revenue',
            debitAmount: 0,
            creditAmount: 1000,
            description: 'Revenue from sale',
            lineNumber: 2,
            organizationId,
            userId
          }
        ];

        // Get actual account IDs
        const accounts = await doubleEntryService.getAccounts(organizationId);
        const cashAccount = accounts.find(acc => acc.accountCode === '1000');
        const salesAccount = accounts.find(acc => acc.accountCode === '4000');

        if (cashAccount && salesAccount) {
          lines[0].accountId = cashAccount.id!;
          lines[1].accountId = salesAccount.id!;
          await doubleEntryService.createJournalEntry(entryData, lines);
        }
      }
    },
    {
      title: "Generate Trial Balance",
      description: "Verify that your books are balanced with an automated trial balance",
      icon: FileText,
      action: async () => {
        await doubleEntryService.getTrialBalance(organizationId);
      }
    },
    {
      title: "View Financial Statements",
      description: "Generate professional financial statements from your accounting data",
      icon: Target,
      action: async () => {
        // This step just demonstrates the concept
        await new Promise(resolve => setTimeout(resolve, 1000));
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
            <Lightbulb className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Double-Entry Accounting Demo
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow this guided demo to set up your double-entry accounting system and learn the basics of professional bookkeeping.
          </p>
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
                          <Play className="w-4 h-4 mr-2" />
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

        {/* Completion */}
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-green-100 border border-green-200 rounded-lg text-center"
          >
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Demo Completed Successfully!
            </h3>
            <p className="text-green-700 mb-4">
              Your double-entry accounting system is now set up and ready to use. You can now:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="text-left">
                <h4 className="font-semibold text-green-900 mb-2">✅ What's Ready:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Complete chart of accounts</li>
                  <li>• Sample journal entry</li>
                  <li>• Trial balance verification</li>
                  <li>• Financial statements</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-green-900 mb-2">🚀 Next Steps:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Create your own journal entries</li>
                  <li>• Record business transactions</li>
                  <li>• Generate financial reports</li>
                  <li>• Download accounting packages</li>
                </ul>
              </div>
            </div>
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
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Pro Tip</h4>
              <p className="text-sm text-blue-700">
                Double-entry bookkeeping ensures that every transaction affects at least two accounts and that 
                total debits always equal total credits. This provides a complete audit trail and helps maintain 
                accurate financial records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
