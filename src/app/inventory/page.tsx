'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import InventoryForm from '@/components/inventory/InventoryForm';
import StockMovementHistory from '@/components/inventory/StockMovementHistory';

import { inventoryService, InventoryItem, InventoryFormData } from '@/services/inventoryService';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  Download,
  Upload,
  History
} from 'lucide-react';

// Interfaces are now imported from inventoryService

function InventoryPageContent() {
  const { user, userProfile } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState<InventoryItem | null>(null);

  useEffect(() => {
    if (user) {
      loadInventoryItems();
      
      // Set up real-time subscription
      const unsubscribe = inventoryService.subscribeToInventoryChanges(
        user.uid,
        (updatedItems) => {
          setItems(updatedItems);
          setFilteredItems(updatedItems);
        }
      );
      
      return () => unsubscribe();
    }
  }, [user]);

  const loadInventoryItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const inventoryItems = await inventoryService.getInventoryItems(user.uid);
      setItems(inventoryItems);
      setFilteredItems(inventoryItems);
    } catch (error) {
      console.error('Error loading inventory items:', error);
      // Show error message to user
      alert('Failed to load inventory items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search and category
  useEffect(() => {
    let filtered = items;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory]);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleViewHistory = (item: InventoryItem) => {
    setSelectedItemForHistory(item);
    setHistoryModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item? This will also delete all related stock movement records.')) {
      try {
        setLoading(true);
        if (!user) throw new Error('User not authenticated');
        await inventoryService.deleteInventoryItem(itemId, user.uid);
        // Items will be updated via real-time subscription
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveItem = async (formData: InventoryFormData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      if (editingItem) {
        // Update existing item
        await inventoryService.updateInventoryItem(editingItem.id, formData, user.uid);
      } else {
        // Create new item
        await inventoryService.addInventoryItem(formData, user.uid);
      }
      
      setIsFormOpen(false);
      setEditingItem(null);
      // Items will be updated via real-time subscription
    } catch (error) {
      console.error('Error saving item:', error);
      alert(error instanceof Error ? error.message : 'Failed to save item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'raw-materials', label: 'Raw Materials' },
    { value: 'components', label: 'Components' },
    { value: 'finished-goods', label: 'Finished Goods' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'tools', label: 'Tools & Equipment' },
    { value: 'office-supplies', label: 'Office Supplies' },
    { value: 'other', label: 'Other' }
  ];

  const lowStockItems = items.filter(item => item.currentStock <= item.minimumStock);
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  const totalItems = items.reduce((sum, item) => sum + item.currentStock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your products, stock levels, and inventory data</p>
        </div>
        <button
          onClick={handleAddItem}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Product Types</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items by name, SKU, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Loading inventory items...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first inventory item.</p>
                    <button
                      onClick={handleAddItem}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Add Item
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const stockStatus = item.currentStock <= item.minimumStock ? 'low' :
        item.currentStock >= item.maximumStock ? 'high' : 'normal';
                  const totalValue = item.currentStock * item.unitPrice;
                  
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{totalValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          stockStatus === 'low' ? 'bg-red-100 text-red-800' :
                          stockStatus === 'high' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {stockStatus === 'low' ? 'Low Stock' :
                           stockStatus === 'high' ? 'Overstock' :
                           'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewHistory(item)}
                            className="text-green-600 hover:text-green-900"
                            title="View Stock Movement History"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Item"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* Inventory Form Modal */}
      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editData={editingItem ? {
          id: editingItem.id,
          name: editingItem.name,
          sku: editingItem.sku,
          category: editingItem.category,
          description: editingItem.description,
          currentStock: editingItem.currentStock,
          minimumStock: editingItem.minimumStock,
        maximumStock: editingItem.maximumStock,
          unitPrice: editingItem.unitPrice,
          costPrice: editingItem.costPrice,
          supplier: editingItem.supplier,
          location: editingItem.location,
          unit: editingItem.unit,
          barcode: editingItem.barcode,
          notes: editingItem.notes
        } : undefined}
      />

      {/* Stock Movement History Modal */}
      {selectedItemForHistory && (
        <StockMovementHistory
          isOpen={historyModalOpen}
          onClose={() => {
            setHistoryModalOpen(false);
            setSelectedItemForHistory(null);
          }}
          itemId={selectedItemForHistory.id}
          itemName={selectedItemForHistory.name}
          itemSku={selectedItemForHistory.sku}
        />
      )}
    </div>
  );
}

export default function InventoryPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <InventoryPageContent />
      </DashboardLayout>
    </AuthGuard>
  );
}