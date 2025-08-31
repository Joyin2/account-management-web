'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Calculator,
  Save,
  Send,
  Download,
  User,
  Building2,
  Calendar,
  FileText,
  Mail,
  Phone,
  MapPin,
  Percent,
  IndianRupee
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  gstRate: number;
  amount: number;
}

interface InvoiceFormData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerGSTIN?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  termsAndConditions?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
}

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InvoiceFormData) => void;
  editingInvoice?: any;
}

const gstRates = [0, 5, 12, 18, 28];

const defaultBankDetails = {
  accountName: 'Your Business Name',
  accountNumber: '1234567890',
  ifscCode: 'HDFC0001234',
  bankName: 'HDFC Bank'
};

export default function InvoiceForm({ isOpen, onClose, onSave, editingInvoice }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerGSTIN: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{
      id: '1',
      description: '',
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0
    }],
    notes: '',
    termsAndConditions: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
    bankDetails: defaultBankDetails
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    totalGST: 0,
    grandTotal: 0
  });

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        invoiceNumber: editingInvoice.invoiceNumber,
        customerName: editingInvoice.customerName,
        customerEmail: editingInvoice.customerEmail,
        customerPhone: editingInvoice.customerPhone || '',
        customerAddress: editingInvoice.customerAddress,
        customerGSTIN: editingInvoice.customerGSTIN || '',
        issueDate: editingInvoice.issueDate,
        dueDate: editingInvoice.dueDate,
        items: editingInvoice.items,
        notes: editingInvoice.notes || '',
        termsAndConditions: editingInvoice.termsAndConditions || 'Payment is due within 30 days of invoice date.',
        bankDetails: editingInvoice.bankDetails || defaultBankDetails
      });
    } else {
      // Generate new invoice number
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      setFormData(prev => ({ ...prev, invoiceNumber }));
    }
  }, [editingInvoice]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items]);

  const calculateTotals = () => {
    let subtotal = 0;
    let totalGST = 0;

    formData.items.forEach(item => {
      const itemAmount = item.quantity * item.rate;
      const gstAmount = (itemAmount * item.gstRate) / 100;
      subtotal += itemAmount;
      totalGST += gstAmount;
    });

    const grandTotal = subtotal + totalGST;

    setCalculations({ subtotal, totalGST, grandTotal });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }
    
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: updatedItems });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Customer email is required';
    if (!formData.customerAddress.trim()) newErrors.customerAddress = 'Customer address is required';
    if (!formData.issueDate) newErrors.issueDate = 'Issue date is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) newErrors[`item_${index}_description`] = 'Description is required';
      if (item.quantity <= 0) newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      if (item.rate <= 0) newErrors[`item_${index}_rate`] = 'Rate must be greater than 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'send') => {
    if (validateForm()) {
      onSave({ ...formData, action } as any);
      onClose();
    }
  };

  const handleDownloadPDF = () => {
    // This would integrate with a PDF generation library
    console.log('Generating PDF for invoice:', formData.invoiceNumber);
    alert('PDF generation would be implemented here using libraries like jsPDF or react-pdf');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Preview PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number *
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="INV-2024-001"
                />
                {errors.invoiceNumber && <p className="text-red-500 text-sm mt-1">{errors.invoiceNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.issueDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.issueDate && <p className="text-red-500 text-sm mt-1">{errors.issueDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dueDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ABC Corporation"
                  />
                  {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="contact@abc.com"
                  />
                  {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={formData.customerGSTIN}
                    onChange={(e) => setFormData({ ...formData, customerGSTIN: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.customerAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 Business Street, City, State, PIN"
                  />
                  {errors.customerAddress && <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>}
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Invoice Items
                </h3>
                <button
                  onClick={addItem}
                  className="flex items-center px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Description</th>
                      <th className="text-left py-2 px-2 text-sm font-medium text-gray-700 w-20">Qty</th>
                      <th className="text-left py-2 px-2 text-sm font-medium text-gray-700 w-24">Rate</th>
                      <th className="text-left py-2 px-2 text-sm font-medium text-gray-700 w-20">GST%</th>
                      <th className="text-left py-2 px-2 text-sm font-medium text-gray-700 w-24">Amount</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className={`w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm ${
                              errors[`item_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Item description"
                          />
                          {errors[`item_${index}_description`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_description`]}</p>
                          )}
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className={`w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm ${
                              errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            min="0"
                            step="0.01"
                          />
                          {errors[`item_${index}_quantity`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                          )}
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                            className={`w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm ${
                              errors[`item_${index}_rate`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            min="0"
                            step="0.01"
                          />
                          {errors[`item_${index}_rate`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_rate`]}</p>
                          )}
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={item.gstRate}
                            onChange={(e) => updateItem(index, 'gstRate', parseFloat(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            {gstRates.map(rate => (
                              <option key={rate} value={rate}>{rate}%</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{(item.quantity * item.rate).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          {formData.items.length > 1 && (
                            <button
                              onClick={() => removeItem(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{calculations.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total GST:</span>
                  <span className="font-medium">₹{calculations.totalGST.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Grand Total:</span>
                  <span className="text-lg font-bold text-gray-900">₹{calculations.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes for the customer..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  value={formData.termsAndConditions}
                  onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Payment terms and conditions..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSubmit('save')}
                className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </button>
              <button
                onClick={() => handleSubmit('send')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4 mr-2" />
                Save & Send
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}