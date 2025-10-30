'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ShoppingCart, 
  Utensils, 
  Wrench, 
  Truck, 
  Briefcase,
  Store,
  Factory
} from 'lucide-react';

interface BusinessType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
}

const businessTypes: BusinessType[] = [
  {
    id: 'manufacturer',
    name: 'Manufacturer',
    description: 'Production and manufacturing business',
    icon: Factory,
    features: ['Bill of Materials', 'Production Planning', 'Quality Control', 'Raw Material Management']
  },
  {
    id: 'retailer',
    name: 'Retailer',
    description: 'Retail and sales business',
    icon: Store,
    features: ['Point of Sale', 'Inventory Management', 'Customer Management', 'Sales Analytics']
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Food service and hospitality',
    icon: Utensils,
    features: ['Menu Management', 'Table Management', 'Kitchen Orders', 'Food Cost Analysis']
  },
  {
    id: 'service',
    name: 'Service Provider',
    description: 'Professional services business',
    icon: Briefcase,
    features: ['Project Management', 'Time Tracking', 'Client Management', 'Service Billing']
  },
  {
    id: 'wholesale',
    name: 'Wholesaler',
    description: 'Wholesale and distribution',
    icon: Truck,
    features: ['Bulk Inventory', 'Distribution Management', 'B2B Sales', 'Supplier Network']
  },
  {
    id: 'construction',
    name: 'Construction',
    description: 'Construction and contracting',
    icon: Wrench,
    features: ['Project Costing', 'Material Tracking', 'Labor Management', 'Progress Billing']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Online retail business',
    icon: ShoppingCart,
    features: ['Multi-channel Sales', 'Order Management', 'Shipping Integration', 'Online Analytics']
  },
  {
    id: 'general',
    name: 'General Business',
    description: 'Other business types',
    icon: Building2,
    features: ['Basic Accounting', 'Invoice Management', 'Expense Tracking', 'Financial Reports']
  }
];

interface BusinessTypeSelectorProps {
  selectedType: string | null;
  onSelect: (businessType: BusinessType) => void;
  onNext: () => void;
}

export default function BusinessTypeSelector({ selectedType, onSelect, onNext }: BusinessTypeSelectorProps) {
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What type of business do you run?
        </h2>
        <p className="text-gray-600">
          Choose your business type to customize your dashboard and features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {businessTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          const isHovered = hoveredType === type.id;

          return (
            <motion.div
              key={type.id}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                }
              `}
              onClick={() => onSelect(type)}
              onMouseEnter={() => setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className={`
                  inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3
                  ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                `}>
                  <Icon size={24} />
                </div>
                
                <h3 className={`
                  font-semibold mb-1
                  ${isSelected ? 'text-blue-900' : 'text-gray-900'}
                `}>
                  {type.name}
                </h3>
                
                <p className={`
                  text-sm mb-3
                  ${isSelected ? 'text-blue-700' : 'text-gray-600'}
                `}>
                  {type.description}
                </p>

                {(isSelected || isHovered) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-left"
                  >
                    <div className={`
                      p-2 rounded border
                      ${isSelected ? 'bg-blue-100 border-blue-200' : 'bg-gray-50 border-gray-200'}
                    `}>
                      <p className="font-medium mb-1 text-gray-700">Key Features:</p>
                      <ul className="space-y-1">
                        {type.features.map((feature, index) => (
                          <li key={index} className="text-gray-600 flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            onClick={onNext}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Continue Setup
          </button>
        </motion.div>
      )}
    </div>
  );
}

export { businessTypes };
export type { BusinessType };