'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calculator,
  Package,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Building2,
  ShoppingCart,
  Utensils,
  Wrench,
  Truck,
  Briefcase,
  Store,
  Factory,
  Users,
  Receipt,
  Wallet,
  TrendingUp,
  PieChart,
  FileBarChart,
  Banknote,
  ShoppingBag,
  ClipboardList,
  Target,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessType, businessTypes } from '@/components/auth/BusinessTypeSelector';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: MenuItem[];
  badge?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const getBusinessIcon = (businessType: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    manufacturer: Factory,
    retailer: Store,
    restaurant: Utensils,
    service: Briefcase,
    wholesale: Truck,
    construction: Wrench,
    ecommerce: ShoppingCart,
    general: Building2
  };
  return icons[businessType] || Building2;
};

const getMenuItems = (businessType: string): MenuItem[] => {
  const baseItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard'
    },
    {
      id: 'accounting',
      label: 'Accounting',
      icon: Calculator,
      href: '/accounting'
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: TrendingUp,
      children: [
        { id: 'invoices', label: 'Invoices', icon: FileText, href: '/dashboard/sales/invoices' },
        { id: 'customers', label: 'Customers', icon: Users, href: '/dashboard/sales/customers' },
        { id: 'quotes', label: 'Quotes', icon: FileBarChart, href: '/dashboard/sales/quotes' }
      ]
    },
    {
      id: 'purchases',
      label: 'Purchases',
      icon: ShoppingBag,
      children: [
        { id: 'bills', label: 'Bills', icon: Receipt, href: '/dashboard/purchases/bills' },
        { id: 'suppliers', label: 'Suppliers', icon: Truck, href: '/dashboard/purchases/suppliers' },
        { id: 'purchase-orders', label: 'Purchase Orders', icon: ClipboardList, href: '/dashboard/purchases/orders' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      children: [
        { id: 'items', label: 'Items', icon: Package, href: '/dashboard/inventory/items' },
        { id: 'stock-movements', label: 'Stock Movements', icon: TrendingUp, href: '/dashboard/inventory/movements' },
        { id: 'stock-alerts', label: 'Stock Alerts', icon: Target, href: '/dashboard/inventory/alerts' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      children: [
        { id: 'profit-loss', label: 'Profit & Loss', icon: PieChart, href: '/dashboard/reports/profit-loss' },
        { id: 'balance-sheet', label: 'Balance Sheet', icon: FileBarChart, href: '/dashboard/reports/balance-sheet' },
        { id: 'cash-flow', label: 'Cash Flow', icon: Banknote, href: '/dashboard/reports/cash-flow' },
        { id: 'gst-returns', label: 'GST Returns', icon: Receipt, href: '/dashboard/reports/gst-returns' }
      ]
    }
  ];

  // Add business-specific modules
  const businessSpecificItems: Record<string, MenuItem[]> = {
    manufacturer: [
      {
        id: 'production',
        label: 'Production',
        icon: Factory,
        children: [
          { id: 'bom', label: 'Bill of Materials', icon: ClipboardList, href: '/dashboard/production/bom' },
          { id: 'work-orders', label: 'Work Orders', icon: Calendar, href: '/dashboard/production/work-orders' },
          { id: 'quality-control', label: 'Quality Control', icon: Target, href: '/dashboard/production/quality-control' }
        ]
      }
    ],
    restaurant: [
      {
        id: 'restaurant',
        label: 'Restaurant',
        icon: Utensils,
        children: [
          { id: 'menu', label: 'Menu Management', icon: ClipboardList, href: '/dashboard/restaurant/menu' },
          { id: 'tables', label: 'Table Management', icon: Calendar, href: '/dashboard/restaurant/tables' },
          { id: 'orders', label: 'Kitchen Orders', icon: Receipt, href: '/dashboard/restaurant/orders' }
        ]
      }
    ],
    retailer: [
      {
        id: 'pos',
        label: 'Point of Sale',
        icon: Store,
        children: [
          { id: 'pos-terminal', label: 'POS Terminal', icon: CreditCard, href: '/dashboard/pos/terminal' },
          { id: 'daily-sales', label: 'Daily Sales', icon: BarChart3, href: '/dashboard/pos/daily-sales' }
        ]
      }
    ],
    ecommerce: [
      {
        id: 'ecommerce',
        label: 'E-commerce',
        icon: ShoppingCart,
        children: [
          { id: 'online-orders', label: 'Online Orders', icon: Package, href: '/dashboard/ecommerce/orders' },
          { id: 'shipping', label: 'Shipping', icon: Truck, href: '/dashboard/ecommerce/shipping' },
          { id: 'marketplace', label: 'Marketplace', icon: Store, href: '/dashboard/ecommerce/marketplace' }
        ]
      }
    ]
  };

  const specificItems = businessSpecificItems[businessType] || [];
  
  return [
    ...baseItems.slice(0, -1), // All items except reports
    ...specificItems,
    baseItems[baseItems.length - 1] // Reports at the end
  ];
};

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);
  const pathname = usePathname();
  const { userProfile, logout } = useAuth();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Find the business type object from the businessTypes array
  const currentBusinessType = businessTypes.find(bt => bt.id === userProfile?.businessType) || businessTypes[0];
  
  const menuItems = getMenuItems(currentBusinessType.id);
  const BusinessIcon = getBusinessIcon(currentBusinessType.id);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 h-full flex flex-col shadow-sm"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">AccountPro</h1>
                <p className="text-xs text-gray-500">{currentBusinessType.name}</p>
              </div>
            )}
          </motion.div>
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <BusinessIcon className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile?.fullName || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userProfile?.email}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.href ? (
              <Link href={item.href}>
                <motion.div
                  whileHover={{ x: isCollapsed ? 0 : 4 }}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer
                    ${pathname === item.href 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                  {item.badge && !isCollapsed && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            ) : (
              <div>
                <motion.div
                  whileHover={{ x: isCollapsed ? 0 : 4 }}
                  onClick={() => !isCollapsed && toggleExpanded(item.id)}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer
                    ${expandedItems.includes(item.id) 
                      ? 'bg-gray-50 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1 truncate">{item.label}</span>
                      <motion.div
                        animate={{ rotate: expandedItems.includes(item.id) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </>
                  )}
                </motion.div>
                
                <AnimatePresence>
                  {!isCollapsed && expandedItems.includes(item.id) && item.children && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-8 mt-1 space-y-1"
                    >
                      {item.children.map((child) => (
                        <Link key={child.id} href={child.href || '#'}>
                          <motion.div
                            whileHover={{ x: 2 }}
                            className={`
                              flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer
                              ${pathname === child.href 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }
                            `}
                          >
                            <child.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate">{child.label}</span>
                            {child.badge && (
                              <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {child.badge}
                              </span>
                            )}
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link href="/dashboard/settings">
          <motion.div
            whileHover={{ x: isCollapsed ? 0 : 4 }}
            className={`
              flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer
              ${pathname === '/dashboard/settings' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </motion.div>
        </Link>
        
        <motion.div
          whileHover={{ x: isCollapsed ? 0 : 4 }}
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </motion.div>
      </div>
    </motion.div>
  );
}