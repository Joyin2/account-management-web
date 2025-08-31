'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, FileText, Download, Plus, Trash2, Receipt } from 'lucide-react';
import { format } from 'date-fns';

interface GSTTransaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  type: 'sale' | 'purchase';
  category: string;
}

interface GSTSummary {
  totalSales: number;
  totalPurchases: number;
  gstOnSales: number;
  gstOnPurchases: number;
  netGST: number;
  gstPayable: number;
  gstRefund: number;
}

interface GSTCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const GSTCalculator: React.FC<GSTCalculatorProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [transactions, setTransactions] = useState<GSTTransaction[]>([
    {
      id: '1',
      date: new Date('2024-01-15'),
      description: 'Product Sales',
      amount: 10000,
      gstRate: 18,
      gstAmount: 1800,
      totalAmount: 11800,
      type: 'sale',
      category: 'Products'
    },
    {
      id: '2',
      date: new Date('2024-01-20'),
      description: 'Office Supplies Purchase',
      amount: 5000,
      gstRate: 18,
      gstAmount: 900,
      totalAmount: 5900,
      type: 'purchase',
      category: 'Office Expenses'
    },
    {
      id: '3',
      date: new Date('2024-01-25'),
      description: 'Service Income',
      amount: 15000,
      gstRate: 18,
      gstAmount: 2700,
      totalAmount: 17700,
      type: 'sale',
      category: 'Services'
    }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    gstRate: '18',
    type: 'sale' as 'sale' | 'purchase',
    category: ''
  });

  const [gstSummary, setGstSummary] = useState<GSTSummary>({
    totalSales: 0,
    totalPurchases: 0,
    gstOnSales: 0,
    gstOnPurchases: 0,
    netGST: 0,
    gstPayable: 0,
    gstRefund: 0
  });

  const gstRates = [
    { value: '0', label: '0% (Exempt)' },
    { value: '5', label: '5%' },
    { value: '12', label: '12%' },
    { value: '18', label: '18%' },
    { value: '28', label: '28%' }
  ];

  const categories = [
    'Products',
    'Services',
    'Office Expenses',
    'Equipment',
    'Travel',
    'Marketing',
    'Professional Services',
    'Utilities'
  ];

  useEffect(() => {
    calculateGSTSummary();
  }, [transactions]);

  const calculateGSTSummary = () => {
    const sales = transactions.filter(t => t.type === 'sale');
    const purchases = transactions.filter(t => t.type === 'purchase');

    const totalSales = sales.reduce((sum, t) => sum + t.amount, 0);
    const totalPurchases = purchases.reduce((sum, t) => sum + t.amount, 0);
    const gstOnSales = sales.reduce((sum, t) => sum + t.gstAmount, 0);
    const gstOnPurchases = purchases.reduce((sum, t) => sum + t.gstAmount, 0);
    
    const netGST = gstOnSales - gstOnPurchases;
    
    setGstSummary({
      totalSales,
      totalPurchases,
      gstOnSales,
      gstOnPurchases,
      netGST,
      gstPayable: netGST > 0 ? netGST : 0,
      gstRefund: netGST < 0 ? Math.abs(netGST) : 0
    });
  };

  const addTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) return;

    const amount = parseFloat(newTransaction.amount);
    const gstRate = parseFloat(newTransaction.gstRate);
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;

    const transaction: GSTTransaction = {
      id: Date.now().toString(),
      date: new Date(),
      description: newTransaction.description,
      amount,
      gstRate,
      gstAmount,
      totalAmount,
      type: newTransaction.type,
      category: newTransaction.category
    };

    setTransactions([...transactions, transaction]);
    setNewTransaction({
      description: '',
      amount: '',
      gstRate: '18',
      type: 'sale',
      category: ''
    });
  };

  const removeTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const generateGSTReturn = () => {
    const returnData = {
      period: format(new Date(), 'MMM yyyy'),
      summary: gstSummary,
      transactions,
      generatedAt: new Date()
    };
    
    onSave(returnData);
    console.log('GST Return generated:', returnData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              GST Calculator & Return
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Calculate GST and generate returns for {format(new Date(), 'MMM yyyy')}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="calculator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator">GST Calculator</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="return">GST Return</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-6">
              {/* GST Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Sales</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{gstSummary.totalSales.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">GST on Sales</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{gstSummary.gstOnSales.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">GST on Purchases</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{gstSummary.gstOnPurchases.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Net GST</p>
                      <p className={`text-2xl font-bold ${
                        gstSummary.netGST >= 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ₹{Math.abs(gstSummary.netGST).toLocaleString()}
                      </p>
                      <Badge variant={gstSummary.netGST >= 0 ? 'destructive' : 'default'} className="mt-1">
                        {gstSummary.netGST >= 0 ? 'Payable' : 'Refund'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Add New Transaction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Transaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Transaction description"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gstRate">GST Rate</Label>
                      <Select 
                        value={newTransaction.gstRate} 
                        onValueChange={(value) => setNewTransaction(prev => ({ ...prev, gstRate: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gstRates.map((rate) => (
                            <SelectItem key={rate.value} value={rate.value}>
                              {rate.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select 
                        value={newTransaction.type} 
                        onValueChange={(value: 'sale' | 'purchase') => setNewTransaction(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">Sale</SelectItem>
                          <SelectItem value="purchase">Purchase</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newTransaction.category} 
                        onValueChange={(value) => setNewTransaction(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end">
                      <Button onClick={addTransaction} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>GST Rate</TableHead>
                        <TableHead>GST Amount</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{format(transaction.date, 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === 'sale' ? 'default' : 'secondary'}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                          <TableCell>{transaction.gstRate}%</TableCell>
                          <TableCell>₹{transaction.gstAmount.toLocaleString()}</TableCell>
                          <TableCell>₹{transaction.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeTransaction(transaction.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="return" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    GST Return Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-4">Outward Supplies (Sales)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Taxable Value:</span>
                            <span>₹{gstSummary.totalSales.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total GST:</span>
                            <span>₹{gstSummary.gstOnSales.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-4">Inward Supplies (Purchases)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Taxable Value:</span>
                            <span>₹{gstSummary.totalPurchases.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Input Tax Credit:</span>
                            <span>₹{gstSummary.gstOnPurchases.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Net GST Liability:</span>
                          <span className={`font-bold text-lg ${
                            gstSummary.netGST >= 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            ₹{Math.abs(gstSummary.netGST).toLocaleString()}
                            {gstSummary.netGST >= 0 ? ' (Payable)' : ' (Refund)'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button onClick={generateGSTReturn} className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Generate GST Return
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};