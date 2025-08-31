'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Calendar as CalendarIcon, FileText, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportFormData {
  name: string;
  type: string;
  period: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  format: string;
  includeComparisons: boolean;
  includeCharts: boolean;
  includeDetails: boolean;
  filters: {
    accounts: string[];
    categories: string[];
    departments: string[];
  };
  notes: string;
}

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ReportFormData) => void;
  editingReport?: any;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingReport
}) => {
  const [formData, setFormData] = useState<ReportFormData>({
    name: editingReport?.name || '',
    type: editingReport?.type || '',
    period: editingReport?.period || 'custom',
    startDate: editingReport?.startDate || undefined,
    endDate: editingReport?.endDate || undefined,
    format: editingReport?.format || 'pdf',
    includeComparisons: editingReport?.includeComparisons || false,
    includeCharts: editingReport?.includeCharts || true,
    includeDetails: editingReport?.includeDetails || true,
    filters: editingReport?.filters || {
      accounts: [],
      categories: [],
      departments: []
    },
    notes: editingReport?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const reportTypes = [
    { value: 'P&L', label: 'Profit & Loss Statement' },
    { value: 'Balance Sheet', label: 'Balance Sheet' },
    { value: 'Cash Flow', label: 'Cash Flow Statement' },
    { value: 'GST Return', label: 'GST Return' },
    { value: 'Trial Balance', label: 'Trial Balance' },
    { value: 'Ledger', label: 'General Ledger' },
    { value: 'Custom', label: 'Custom Report' }
  ];

  const periodOptions = [
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'this-quarter', label: 'This Quarter' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'this-year', label: 'This Year' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Date Range' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel (XLSX)' },
    { value: 'csv', label: 'CSV' },
    { value: 'html', label: 'HTML' }
  ];

  const accountOptions = [
    'Cash & Bank',
    'Accounts Receivable',
    'Inventory',
    'Fixed Assets',
    'Accounts Payable',
    'Loans & Borrowings',
    'Capital',
    'Revenue',
    'Cost of Goods Sold',
    'Operating Expenses'
  ];

  const categoryOptions = [
    'Sales',
    'Purchases',
    'Expenses',
    'Assets',
    'Liabilities',
    'Equity'
  ];

  const departmentOptions = [
    'Administration',
    'Sales & Marketing',
    'Production',
    'Finance',
    'HR',
    'IT'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Report name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Report type is required';
    }

    if (formData.period === 'custom') {
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required for custom period';
      }
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required for custom period';
      }
      if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleFilterChange = (filterType: keyof typeof formData.filters, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: checked
          ? [...prev.filters[filterType], value]
          : prev.filters[filterType].filter(item => item !== value)
      }
    }));
  };

  const handlePreview = () => {
    console.log('Previewing report with data:', formData);
    // Implement preview logic
  };

  const handleGenerate = () => {
    if (validateForm()) {
      console.log('Generating report with data:', formData);
      onSave(formData);
      // Don't close form, allow user to download
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingReport ? 'Edit Report' : 'Generate New Report'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Report Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter report name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="type">Report Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="period">Period</Label>
                  <Select value={formData.period} onValueChange={(value) => setFormData(prev => ({ ...prev, period: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periodOptions.map((period) => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.period === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground",
                            errors.startDate && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date: Date | undefined) => setFormData(prev => ({ ...prev, startDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.startDate && <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground",
                            errors.endDate && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date: Date | undefined) => setFormData(prev => ({ ...prev, endDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.endDate && <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report Options */}
          <Card>
            <CardHeader>
              <CardTitle>Report Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeComparisons"
                    checked={formData.includeComparisons}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, includeComparisons: checked }))}
                  />
                  <Label htmlFor="includeComparisons">Include Comparisons</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCharts"
                    checked={formData.includeCharts}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, includeCharts: checked }))}
                  />
                  <Label htmlFor="includeCharts">Include Charts</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDetails"
                    checked={formData.includeDetails}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, includeDetails: checked }))}
                  />
                  <Label htmlFor="includeDetails">Include Details</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Accounts</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {accountOptions.map((account) => (
                      <div key={account} className="flex items-center space-x-2">
                        <Checkbox
                          id={`account-${account}`}
                          checked={formData.filters.accounts.includes(account)}
                          onCheckedChange={(checked: boolean) => handleFilterChange('accounts', account, checked)}
                        />
                        <Label htmlFor={`account-${account}`} className="text-sm">{account}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Categories</Label>
                  <div className="space-y-2">
                    {categoryOptions.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={formData.filters.categories.includes(category)}
                          onCheckedChange={(checked: boolean) => handleFilterChange('categories', category, checked)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Departments</Label>
                  <div className="space-y-2">
                    {departmentOptions.map((department) => (
                      <div key={department} className="flex items-center space-x-2">
                        <Checkbox
                          id={`department-${department}`}
                          checked={formData.filters.departments.includes(department)}
                          onCheckedChange={(checked: boolean) => handleFilterChange('departments', department, checked)}
                        />
                        <Label htmlFor={`department-${department}`} className="text-sm">{department}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional notes or instructions for this report..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleGenerate} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Generate & Download
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Save Report
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};