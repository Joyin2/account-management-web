'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import TransactionTypeSelector from './TransactionTypeSelector';
import BuyTransactionForm from './BuyTransactionForm';
import SellTransactionForm from './SellTransactionForm';
import ExpenditureTransactionForm from './ExpenditureTransactionForm';
import CapitalDrawingsTransactionForm from './CapitalDrawingsTransactionForm';
import BankTransactionForm from './BankTransactionForm';
import LoanTransactionForm from './LoanTransactionForm';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData?: any;
}

type TransactionType = 'BUY' | 'SELL' | 'EXPENDITURE' | 'CAPITAL_DRAWINGS' | 'BANK' | 'LOAN';



export default function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  editData
}: TransactionFormProps) {
  const [selectedType, setSelectedType] = useState<TransactionType | null>(
    editData?.type || null
  );

  if (!isOpen) return null;

  const handleTypeSelect = (type: TransactionType) => {
    setSelectedType(type);
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      type: selectedType,
      id: editData?.id || Date.now().toString()
    });
    onClose();
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'BUY':
        return (
          <BuyTransactionForm
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            editData={editData}
          />
        );
      case 'SELL':
        return (
          <SellTransactionForm
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            editData={editData}
          />
        );
      case 'EXPENDITURE':
        return (
          <ExpenditureTransactionForm
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            editData={editData}
          />
        );
      case 'CAPITAL_DRAWINGS':
        return (
          <CapitalDrawingsTransactionForm
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            editData={editData}
          />
        );
      case 'BANK':
        return (
          <BankTransactionForm
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            editData={editData}
          />
        );
      case 'LOAN':
        return (
          <LoanTransactionForm
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            editData={editData}
          />
        );
      default:
        return (
          <TransactionTypeSelector
            onSelectType={handleTypeSelect}
            onClose={onClose}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Form Content */}
        <div className="p-6">
          {renderForm()}
        </div>
      </motion.div>
    </div>
  );
}