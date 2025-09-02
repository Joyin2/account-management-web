'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, RotateCcw, Calendar, FileText, ExternalLink } from 'lucide-react';
import { inventoryService, StockMovement } from '@/services/inventoryService';
import { useAuth } from '@/contexts/AuthContext';

interface StockMovementHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemName: string;
  itemSku: string;
}

const StockMovementHistory: React.FC<StockMovementHistoryProps> = ({
  isOpen,
  onClose,
  itemId,
  itemName,
  itemSku
}) => {
  const { user } = useAuth();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user && itemId) {
      loadStockMovements();
    }
  }, [isOpen, user, itemId]);

  const loadStockMovements = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const stockMovements = await inventoryService.getStockMovements(itemId, user.uid);
      setMovements(stockMovements);
    } catch (error) {
      console.error('Error loading stock movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'out':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'adjustment':
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'text-green-600';
      case 'out':
        return 'text-red-600';
      case 'adjustment':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isTransactionReference = (reference?: string) => {
    return reference && reference.startsWith('TXN-');
  };

  const handleViewTransaction = (reference: string) => {
    // Navigate to accounting page with transaction filter
    // This could be implemented to highlight the specific transaction
    window.open('/accounting', '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Stock Movement History</h2>
              <p className="text-sm text-gray-600 mt-1">
                {itemName} ({itemSku})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading stock movements...</div>
              </div>
            ) : movements.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stock movements found</h3>
                <p className="text-gray-600">This item has no recorded stock movements yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {movements.map((movement) => (
                  <motion.div
                    key={movement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getMovementIcon(movement.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${getMovementColor(movement.type)}`}>
                              {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}
                              {movement.quantity}
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-sm text-gray-600">{movement.reason}</span>
                          </div>
                          
                          <div className="mt-1 text-sm text-gray-500">
                            Stock: {movement.previousStock} → {movement.newStock}
                          </div>
                          
                          {movement.notes && (
                            <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border">
                              {movement.notes}
                            </div>
                          )}
                          
                          {movement.reference && (
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Reference:</span>
                              {isTransactionReference(movement.reference) ? (
                                <button
                                  onClick={() => handleViewTransaction(movement.reference!)}
                                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 hover:underline"
                                >
                                  <span>{movement.reference}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              ) : (
                                <span className="text-xs text-gray-600">{movement.reference}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(movement.createdAt)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StockMovementHistory;