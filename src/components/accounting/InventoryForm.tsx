'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';

interface InventoryFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function InventoryForm({ onBack, onSave }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    productName: '',
    price: '',
    quantity: '',
    vendorName: '',
    paymentMethod: 'Cash',
    amount: '',
    gstApplicable: false,
    gstPercentage: '',
    gstn: '',
    gstType: '',
    remarks: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      transactionType: 'buy',
      subType: 'inventory'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Inventory Purchase</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Enter unit price"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="Enter quantity with unit (e.g., 50 pieces)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input
                  id="vendorName"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  placeholder="Enter vendor name (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="NEFT">NEFT</SelectItem>
                    <SelectItem value="RTGS">RTGS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="Enter total amount"
                  required
                />
              </div>
            </div>

            {/* GST Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="gstApplicable"
                  checked={formData.gstApplicable}
                  onCheckedChange={(checked: boolean) => handleInputChange('gstApplicable', checked)}
                />
                <Label htmlFor="gstApplicable">GST Applicable</Label>
              </div>

              {formData.gstApplicable && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="gstPercentage">GST Percentage *</Label>
                    <Input
                      id="gstPercentage"
                      value={formData.gstPercentage}
                      onChange={(e) => handleInputChange('gstPercentage', e.target.value)}
                      placeholder="Enter GST % (e.g., 18)"
                      required={formData.gstApplicable}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstn">GSTN *</Label>
                    <Input
                      id="gstn"
                      value={formData.gstn}
                      onChange={(e) => handleInputChange('gstn', e.target.value)}
                      placeholder="Enter GSTN"
                      required={formData.gstApplicable}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstType">Type of GST *</Label>
                    <Select value={formData.gstType} onValueChange={(value) => handleInputChange('gstType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select GST type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="composite">Composite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                placeholder="Enter remarks (IMPORT/EXPORT TAX, etc.)"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Transaction
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}