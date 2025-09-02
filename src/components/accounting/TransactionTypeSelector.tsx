'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Building2,
  Banknote,
  HandCoins
} from 'lucide-react';

type TransactionType = 'BUY' | 'SELL' | 'EXPENDITURE' | 'CAPITAL_DRAWINGS' | 'BANK' | 'LOAN';

interface TransactionTypeSelectorProps {
  onSelectType: (type: TransactionType) => void;
  onClose: () => void;
}

const transactionTypes = [
  {
    id: 'buy',
    name: 'BUY',
    type: 'BUY',
    description: 'Purchase transactions',
    icon: ShoppingCart,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  {
    id: 'sell',
    name: 'SELL',
    type: 'SELL',
    description: 'Sales transactions',
    icon: TrendingUp,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  {
    id: 'expenditure',
    name: 'EXPENDITURE',
    type: 'EXPENDITURE',
    description: 'Expense transactions',
    icon: CreditCard,
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600'
  },
  {
    id: 'capital-drawings',
    name: 'CAPITAL & DRAWINGS',
    type: 'CAPITAL_DRAWINGS',
    description: 'Capital and drawings',
    icon: Building2,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600'
  },
  {
    id: 'bank',
    name: 'BANK',
    type: 'BANK',
    description: 'Banking transactions',
    icon: Banknote,
    color: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600'
  },
  {
    id: 'loan',
    name: 'LOAN',
    type: 'LOAN',
    description: 'Loan transactions',
    icon: HandCoins,
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600'
  }
];

export default function TransactionTypeSelector({ onSelectType, onClose }: TransactionTypeSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Select Transaction Type</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactionTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                onClick={() => onSelectType(type.type as TransactionType)}
                className={`p-6 rounded-lg text-white ${type.color} ${type.hoverColor} transition-all duration-200 text-left`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center mb-3">
                  <Icon className="w-8 h-8 mr-3" />
                  <h3 className="text-lg font-semibold">{type.name}</h3>
                </div>
                <p className="text-sm opacity-90">{type.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}