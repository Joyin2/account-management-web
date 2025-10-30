'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Save,
  Package,
  Barcode,
  Tag,
  Building2,
  User,
  MapPin,
  IndianRupee,
  AlertTriangle,
  Upload
} from 'lucide-react';

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryFormData) => void;
  editData?: InventoryFormData;
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

const categories = [
  { value: 'raw-materials', label: 'Raw Materials' },
  { value: 'components', label: 'Components' },
  { value: 'finished-goods', label: 'Finished Goods' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'tools', label: 'Tools & Equipment' },
  { value: 'office-supplies', label: 'Office Supplies' },
  { value: 'other', label: 'Other' }
];

const units = [
  { value: 'pcs', label: 'Pieces' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'gm', label: 'Grams' },
  { value: 'ltr', label: 'Liters' },
  { value: 'ml', label: 'Milliliters' },
  { value: 'mtr', label: 'Meters' },
  { value: 'cm', label: 'Centimeters' },
  { value: 'sqft', label: 'Square Feet' },
  { value: 'box', label: 'Box' },
  { value: 'pack', label: 'Pack' }
];

const locations = [
  { value: 'warehouse-a', label: 'Warehouse A' },
  { value: 'warehouse-b', label: 'Warehouse B' },
  { value: 'warehouse-c', label: 'Warehouse C' },
  { value: 'store-room', label: 'Store Room' },
  { value: 'production-floor', label: 'Production Floor' },
  { value: 'office', label: 'Office' }
];

export default function InventoryForm({
  isOpen,
  onClose,
  onSave,
  editData
}: InventoryFormProps) {
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    sku: '',
    category: '',
    currentStock: 0,
    minimumStock: 0,
    maximumStock: 0,
    unitPrice: 0,
    costPrice: 0,
    supplier: '',
    location: '',
    unit: 'pcs',
    ...editData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (formData.minimumStock < 0) {
      newErrors.minimumStock = 'Minimum stock cannot be negative';
    }
    if (formData.maximumStock <= formData.minimumStock) {
      newErrors.maximumStock = 'Maximum stock must be greater than minimum stock';
    }
    if (formData.unitPrice < 0) {
      newErrors.unitPrice = 'Unit price cannot be negative';
    }
    if (formData.costPrice < 0) {
      newErrors.costPrice = 'Cost price cannot be negative';
    }
    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const finalData = {
        ...formData,
        id: editData?.id || Date.now().toString()
      };
      onSave(finalData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof InventoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateSKU = () => {
    const prefix = formData.category.toUpperCase().slice(0, 2);
    const timestamp = Date.now().toString().slice(-6);
    const sku = `${prefix}-${timestamp}`;
    handleInputChange('sku', sku);
  };

  if (!isOpen) return null;

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
            {editData ? 'Edit' : 'Add'} Inventory Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Item Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter item name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Barcode className="w-4 h-4 inline mr-2" />
                SKU *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.sku ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter SKU"
                />
                <button
                  type="button"
                  onClick={generateSKU}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Generate
                </button>
              </div>
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit of Measurement
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter item description"
            />
          </div>

          {/* Stock Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.currentStock}
                  onChange={(e) => handleInputChange('currentStock', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Minimum Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumStock}
                onChange={(e) => handleInputChange('minimumStock', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.minimumStock ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.minimumStock && <p className="text-red-500 text-sm mt-1">{errors.minimumStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maximumStock}
                onChange={(e) => handleInputChange('maximumStock', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.maximumStock ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.maximumStock && <p className="text-red-500 text-sm mt-1">{errors.maximumStock}</p>}
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IndianRupee className="w-4 h-4 inline mr-2" />
                  Cost Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.costPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.costPrice && <p className="text-red-500 text-sm mt-1">{errors.costPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IndianRupee className="w-4 h-4 inline mr-2" />
                  Selling Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.unitPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.unitPrice && <p className="text-red-500 text-sm mt-1">{errors.unitPrice}</p>}
              </div>
            </div>
          </div>

          {/* Supplier and Location */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Supplier & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Supplier *
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.supplier ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter supplier name"
                />
                {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Storage Location *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Barcode className="w-4 h-4 inline mr-2" />
                  Barcode
                </label>
                <input
                  type="text"
                  value={formData.barcode || ''}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter barcode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Item Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes about this item"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {editData ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}