'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InventoryForm from '@/components/inventory/InventoryForm';
import { ArrowLeft } from 'lucide-react';

interface InventoryTransactionFormProps {
  onSave: (data: any) => void;
  onBack: () => void;
  editData?: any;
}

interface InventoryFormData {
  id?: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  location: string;
  unit: string;
  barcode?: string;
  notes?: string;
  images?: File[];
}

export default function InventoryTransactionForm({ onSave, onBack, editData }: InventoryTransactionFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleInventorySave = (inventoryData: InventoryFormData) => {
    // Convert inventory form data to accounting transaction format
    const transactionData = {
      type: 'BUY',
      subType: 'inventory',
      date: new Date().toISOString().split('T')[0],
      productName: inventoryData.name,
      quantity: inventoryData.currentStock,
      price: inventoryData.costPrice,
      amount: inventoryData.currentStock * inventoryData.costPrice,
      vendorName: inventoryData.supplier,
      paymentMethod: 'Cash', // Default, can be made configurable
      description: `Purchase of ${inventoryData.name} - ${inventoryData.description || ''}`,
      remarks: inventoryData.notes || '',
      gstApplicable: false, // Default, can be made configurable
      // Additional inventory-specific fields for integration
      inventoryData: {
        sku: inventoryData.sku,
        category: inventoryData.category,
        minimumStock: inventoryData.minimumStock,
        maximumStock: inventoryData.maximumStock,
        unitPrice: inventoryData.unitPrice,
        location: inventoryData.location,
        unit: inventoryData.unit,
        barcode: inventoryData.barcode
      }
    };

    onSave(transactionData);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    onBack();
  };

  // Convert edit data from transaction format to inventory format if needed
  const inventoryEditData = editData ? {
    name: editData.productName || '',
    sku: editData.inventoryData?.sku || '',
    category: editData.inventoryData?.category || 'raw-materials',
    description: editData.description || '',
    currentStock: editData.quantity || 0,
    minimumStock: editData.inventoryData?.minimumStock || 1,
    maximumStock: editData.inventoryData?.maximumStock || 100,
    unitPrice: editData.inventoryData?.unitPrice || editData.price || 0,
    costPrice: editData.price || 0,
    supplier: editData.vendorName || '',
    location: editData.inventoryData?.location || 'warehouse-a',
    unit: editData.inventoryData?.unit || 'pcs',
    barcode: editData.inventoryData?.barcode || '',
    notes: editData.remarks || ''
  } : undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[95vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Inventory Purchase Transaction</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <InventoryForm
            isOpen={isFormOpen}
            onClose={handleClose}
            onSave={handleInventorySave}
            editData={inventoryEditData}
          />
        </div>
      </motion.div>
    </div>
  );
}