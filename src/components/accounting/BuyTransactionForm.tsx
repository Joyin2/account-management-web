'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Building,
  Boxes,
  ArrowLeft
} from 'lucide-react';
import RawMaterialForm from './RawMaterialForm';
import InventoryTransactionForm from './InventoryTransactionForm';
import CapitalAssetForm from './CapitalAssetForm';

interface BuyTransactionFormProps {
  onSubmit: (data: any) => void;
  onBack?: () => void;
  editData?: any;
}

const buyTypes = [
  {
    id: 'raw-material',
    name: 'Raw Material',
    icon: Package,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: Boxes,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  {
    id: 'capital-asset',
    name: 'Capital Asset',
    icon: Building,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600'
  }
];



export default function BuyTransactionForm({ onSubmit, onBack, editData }: BuyTransactionFormProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    // This function is kept for compatibility with the type selection
  };

  if (!selectedType) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Buy Transaction - Select Type</h2>
            </div>
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {buyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    handleInputChange('type', type.name);
                  }}
                  className={`p-6 rounded-lg text-white ${type.color} ${type.hoverColor} transition-all duration-200 text-center`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold">{type.name}</h3>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // Render specific form based on selected type
  if (selectedType === 'raw-material') {
    return (
      <RawMaterialForm
        onSave={onSubmit}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  if (selectedType === 'inventory') {
    return (
      <InventoryTransactionForm
        onSave={onSubmit}
        onBack={() => setSelectedType(null)}
        editData={editData}
      />
    );
  }

  if (selectedType === 'capital-asset') {
    return (
      <CapitalAssetForm
        onSave={onSubmit}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Buy Transaction - Select Type</h2>
          </div>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {buyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id);
                  handleInputChange('type', type.name);
                }}
                className={`p-6 rounded-lg text-white ${type.color} ${type.hoverColor} transition-all duration-200 text-center`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-8 h-8 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">{type.name}</h3>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}