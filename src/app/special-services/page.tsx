'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  ShoppingCart, 
  Utensils, 
  Factory, 
  Store, 
  Truck, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BOMItem {
  id: string;
  productName: string;
  components: {
    itemName: string;
    quantity: number;
    unit: string;
    cost: number;
  }[];
  totalCost: number;
  laborCost: number;
  overheadCost: number;
  finalCost: number;
  status: 'Active' | 'Draft' | 'Archived';
}

interface POSTransaction {
  id: string;
  transactionId: string;
  customerName?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

interface MenuManagement {
  id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  cost: number;
  margin: number;
  availability: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  image?: string;
}

const BOMCard: React.FC<{
  bom: BOMItem;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ bom, onView, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">{bom.productName}</h3>
        </div>
        <Badge className={getStatusColor(bom.status)}>
          {bom.status}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div>Components: {bom.components.length}</div>
        <div>Material Cost: ₹{bom.totalCost.toLocaleString()}</div>
        <div>Labor Cost: ₹{bom.laborCost.toLocaleString()}</div>
        <div>Final Cost: ₹{bom.finalCost.toLocaleString()}</div>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => onView(bom.id)} className="flex-1">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(bom.id)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(bom.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

const POSTransactionCard: React.FC<{
  transaction: POSTransaction;
  onView: (id: string) => void;
}> = ({ transaction, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5 text-green-600" />
          <div>
            <h3 className="font-medium text-gray-900">#{transaction.transactionId}</h3>
            {transaction.customerName && (
              <p className="text-sm text-gray-600">{transaction.customerName}</p>
            )}
          </div>
        </div>
        <Badge className={getStatusColor(transaction.status)}>
          {transaction.status}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div>Items: {transaction.items.length}</div>
        <div>Total: ₹{transaction.total.toLocaleString()}</div>
        <div>Payment: {transaction.paymentMethod}</div>
        <div>Time: {new Date(transaction.timestamp).toLocaleString()}</div>
      </div>
      
      <Button variant="outline" size="sm" onClick={() => onView(transaction.id)} className="w-full">
        <Eye className="h-4 w-4 mr-2" />
        View Details
      </Button>
    </motion.div>
  );
};

const MenuItemCard: React.FC<{
  item: MenuManagement;
  onEdit: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}> = ({ item, onEdit, onToggleAvailability }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Utensils className="h-5 w-5 text-orange-600" />
          <div>
            <h3 className="font-medium text-gray-900">{item.itemName}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
          </div>
        </div>
        <Badge className={item.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {item.availability ? 'Available' : 'Unavailable'}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex justify-between">
          <span>Price:</span>
          <span className="font-medium">₹{item.price}</span>
        </div>
        <div className="flex justify-between">
          <span>Cost:</span>
          <span>₹{item.cost}</span>
        </div>
        <div className="flex justify-between">
          <span>Margin:</span>
          <span className="font-medium text-green-600">{item.margin}%</span>
        </div>
        <div className="flex justify-between">
          <span>Prep Time:</span>
          <span>{item.preparationTime} min</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(item.id)} className="flex-1">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onToggleAvailability(item.id)}
          className={item.availability ? 'text-red-600' : 'text-green-600'}
        >
          {item.availability ? 'Disable' : 'Enable'}
        </Button>
      </div>
    </motion.div>
  );
};

export default function SpecialServicesPage() {
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Sample data for different business types
  const sampleBOMs: BOMItem[] = [
    {
      id: '1',
      productName: 'Wooden Chair',
      components: [
        { itemName: 'Wood Planks', quantity: 5, unit: 'pieces', cost: 500 },
        { itemName: 'Screws', quantity: 20, unit: 'pieces', cost: 100 },
        { itemName: 'Wood Glue', quantity: 1, unit: 'bottle', cost: 150 }
      ],
      totalCost: 750,
      laborCost: 300,
      overheadCost: 150,
      finalCost: 1200,
      status: 'Active'
    },
    {
      id: '2',
      productName: 'Dining Table',
      components: [
        { itemName: 'Wood Planks', quantity: 12, unit: 'pieces', cost: 1200 },
        { itemName: 'Table Legs', quantity: 4, unit: 'pieces', cost: 800 },
        { itemName: 'Hardware Kit', quantity: 1, unit: 'set', cost: 200 }
      ],
      totalCost: 2200,
      laborCost: 800,
      overheadCost: 400,
      finalCost: 3400,
      status: 'Active'
    }
  ];

  const samplePOSTransactions: POSTransaction[] = [
    {
      id: '1',
      transactionId: 'TXN001',
      customerName: 'John Doe',
      items: [
        { name: 'Coffee', quantity: 2, price: 150, total: 300 },
        { name: 'Sandwich', quantity: 1, price: 250, total: 250 }
      ],
      subtotal: 550,
      tax: 99,
      discount: 0,
      total: 649,
      paymentMethod: 'Card',
      timestamp: '2024-02-15T10:30:00Z',
      status: 'Completed'
    },
    {
      id: '2',
      transactionId: 'TXN002',
      items: [
        { name: 'Pizza', quantity: 1, price: 450, total: 450 },
        { name: 'Coke', quantity: 2, price: 80, total: 160 }
      ],
      subtotal: 610,
      tax: 109.8,
      discount: 50,
      total: 669.8,
      paymentMethod: 'Cash',
      timestamp: '2024-02-15T12:15:00Z',
      status: 'Completed'
    }
  ];

  const sampleMenuItems: MenuManagement[] = [
    {
      id: '1',
      itemName: 'Margherita Pizza',
      category: 'Main Course',
      description: 'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil',
      price: 450,
      cost: 180,
      margin: 60,
      availability: true,
      preparationTime: 15,
      ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
      allergens: ['Gluten', 'Dairy']
    },
    {
      id: '2',
      itemName: 'Caesar Salad',
      category: 'Appetizer',
      description: 'Fresh romaine lettuce with caesar dressing, croutons, and parmesan',
      price: 280,
      cost: 120,
      margin: 57,
      availability: true,
      preparationTime: 8,
      ingredients: ['Romaine Lettuce', 'Caesar Dressing', 'Croutons', 'Parmesan'],
      allergens: ['Dairy', 'Eggs']
    }
  ];

  const handleBOMView = (id: string) => {
    console.log('Viewing BOM:', id);
  };

  const handleBOMEdit = (id: string) => {
    console.log('Editing BOM:', id);
  };

  const handleBOMDelete = (id: string) => {
    console.log('Deleting BOM:', id);
  };

  const handlePOSView = (id: string) => {
    console.log('Viewing POS transaction:', id);
  };

  const handleMenuEdit = (id: string) => {
    console.log('Editing menu item:', id);
  };

  const handleMenuToggleAvailability = (id: string) => {
    console.log('Toggling availability for menu item:', id);
  };

  const getBusinessTypeContent = () => {
    const businessType = userProfile?.businessType || 'manufacturer';

    switch (businessType) {
      case 'manufacturer':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Factory className="h-6 w-6 mr-2 text-blue-600" />
                  Bill of Materials (BOM)
                </h2>
                <p className="text-gray-600">Manage product components and manufacturing costs</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create BOM
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleBOMs.map((bom) => (
                <BOMCard
                  key={bom.id}
                  bom={bom}
                  onView={handleBOMView}
                  onEdit={handleBOMEdit}
                  onDelete={handleBOMDelete}
                />
              ))}
            </div>
          </div>
        );

      case 'restaurant':
        return (
          <Tabs defaultValue="menu" className="space-y-4">
            <TabsList>
              <TabsTrigger value="menu">Menu Management</TabsTrigger>
              <TabsTrigger value="pos">POS Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Utensils className="h-6 w-6 mr-2 text-orange-600" />
                    Menu Management
                  </h2>
                  <p className="text-gray-600">Manage menu items, pricing, and availability</p>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleMenuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleMenuEdit}
                    onToggleAvailability={handleMenuToggleAvailability}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pos" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <ShoppingCart className="h-6 w-6 mr-2 text-green-600" />
                    POS Transactions
                  </h2>
                  <p className="text-gray-600">View and manage point of sale transactions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {samplePOSTransactions.map((transaction) => (
                  <POSTransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onView={handlePOSView}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        );

      case 'retailer':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Store className="h-6 w-6 mr-2 text-purple-600" />
                  Point of Sale (POS)
                </h2>
                <p className="text-gray-600">Manage retail transactions and customer sales</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {samplePOSTransactions.map((transaction) => (
                <POSTransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onView={handlePOSView}
                />
              ))}
            </div>
          </div>
        );

      case 'distributor':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Truck className="h-6 w-6 mr-2 text-indigo-600" />
                  Distribution Management
                </h2>
                <p className="text-gray-600">Manage distribution routes and logistics</p>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Route
              </Button>
            </div>

            <div className="text-center py-12">
              <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Distribution Features Coming Soon</h3>
              <p className="text-gray-600">Route planning, delivery tracking, and logistics management features will be available soon.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Special Services Available</h3>
            <p className="text-gray-600">Special services are customized based on your business type.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Special Services</h1>
            <p className="text-gray-600">Business-type specific tools and features</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Type Specific Content */}
        {getBusinessTypeContent()}
      </div>
    </DashboardLayout>
  );
}