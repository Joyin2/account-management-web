'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ReportForm } from '@/components/reports/ReportForm';
import { FinancialReportGenerator } from '@/components/reports/FinancialReportGenerator';
import { GSTCalculator } from '@/components/reports/GSTCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, DollarSign, FileText, BarChart3, PieChart, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportData {
  id: string;
  name: string;
  type: 'P&L' | 'Balance Sheet' | 'Cash Flow' | 'GST Return' | 'Custom';
  period: string;
  status: 'Generated' | 'Pending' | 'Draft';
  generatedDate: string;
  size: string;
}

interface FinancialMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface GeneratedReportData {
  type: string;
  period: string;
  data: Record<string, any>;
  generatedAt: string;
}

interface GSTData {
  period: string;
  sales: number;
  purchases: number;
  outputTax: number;
  inputTax: number;
  netTax: number;
}

const ReportCard: React.FC<{
  report: ReportData;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onEdit: (id: string) => void;
}> = ({ report, onView, onDownload, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Generated': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'P&L': return <TrendingUp className="h-4 w-4" />;
      case 'Balance Sheet': return <BarChart3 className="h-4 w-4" />;
      case 'Cash Flow': return <DollarSign className="h-4 w-4" />;
      case 'GST Return': return <FileText className="h-4 w-4" />;
      default: return <PieChart className="h-4 w-4" />;
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
          {getTypeIcon(report.type)}
          <h3 className="font-medium text-gray-900">{report.name}</h3>
        </div>
        <Badge className={getStatusColor(report.status)}>
          {report.status}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div>Type: {report.type}</div>
        <div>Period: {report.period}</div>
        <div>Generated: {report.generatedDate}</div>
        <div>Size: {report.size}</div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(report.id)}
          className="flex-1"
        >
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(report.id)}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(report.id)}
        >
          Edit
        </Button>
      </div>
    </motion.div>
  );
};

const MetricCard: React.FC<{ metric: FinancialMetric }> = ({ metric }) => {
  const getTrendIcon = () => {
    if (metric.trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (metric.trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (metric.trend === 'up') return 'text-green-600';
    if (metric.trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{metric.value.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('this-month');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ReportData | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('P&L');
  const [generatedReportData, setGeneratedReportData] = useState<GeneratedReportData | null>(null);
  const [showGSTCalculator, setShowGSTCalculator] = useState(false);

  // Sample data
  const sampleReports: ReportData[] = [
    {
      id: '1',
      name: 'Monthly P&L Statement',
      type: 'P&L',
      period: 'January 2024',
      status: 'Generated',
      generatedDate: '2024-02-01',
      size: '245 KB'
    },
    {
      id: '2',
      name: 'Balance Sheet Q4 2023',
      type: 'Balance Sheet',
      period: 'Q4 2023',
      status: 'Generated',
      generatedDate: '2024-01-15',
      size: '189 KB'
    },
    {
      id: '3',
      name: 'Cash Flow Analysis',
      type: 'Cash Flow',
      period: 'December 2023',
      status: 'Pending',
      generatedDate: '2024-01-30',
      size: '156 KB'
    },
    {
      id: '4',
      name: 'GST Return GSTR-1',
      type: 'GST Return',
      period: 'January 2024',
      status: 'Draft',
      generatedDate: '2024-02-05',
      size: '98 KB'
    }
  ];

  const financialMetrics: FinancialMetric[] = [
    { label: 'Total Revenue', value: 2450000, change: 12.5, trend: 'up' },
    { label: 'Net Profit', value: 485000, change: 8.3, trend: 'up' },
    { label: 'Total Expenses', value: 1965000, change: -5.2, trend: 'down' },
    { label: 'Cash Flow', value: 325000, change: 15.7, trend: 'up' }
  ];

  const allReports = [...reports, ...sampleReports];
  const filteredReports = allReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleView = (id: string) => {
    console.log('Viewing report:', id);
    // Implement view logic
  };

  const handleDownload = (id: string) => {
    console.log('Downloading report:', id);
    // Implement download logic
  };

  const handleEdit = (id: string) => {
    const report = sampleReports.find(r => r.id === id);
    if (report) {
      setEditingReport(report);
      setIsFormOpen(true);
    }
  };

  const handleGenerateReport = () => {
    setEditingReport(null);
    setIsFormOpen(true);
  };

  const handleSaveReport = (reportData: Partial<ReportData>) => {
    if (editingReport) {
      // Update existing report
      console.log('Updating report:', editingReport.id, reportData);
    } else {
      // Create new report
      const newReport: ReportData = {
        id: Date.now().toString(),
        name: reportData.name,
        type: reportData.type,
        period: reportData.period === 'custom' 
          ? `${reportData.startDate?.toLocaleDateString()} - ${reportData.endDate?.toLocaleDateString()}`
          : reportData.period,
        status: 'Generated',
        generatedDate: new Date().toISOString().split('T')[0],
        size: '156 KB'
      };
      setReports(prev => [newReport, ...prev]);
      console.log('Creating new report:', newReport);
    }
    setIsFormOpen(false);
    setEditingReport(null);
  };

  const handleGenerateFinancialReport = (reportData: GeneratedReportData) => {
    setGeneratedReportData(reportData);
    console.log('Generated financial report:', reportData);
  };

  const handleQuickGenerate = (reportType: string) => {
    setSelectedReportType(reportType);
    setShowReportGenerator(true);
  };

  const getDefaultDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3); // Last 3 months
    return { startDate, endDate };
  };

  const handleOpenGSTCalculator = () => {
    setShowGSTCalculator(true);
  };

  const handleSaveGSTReturn = (gstData: any) => {
    console.log('GST Return saved:', gstData);
    // Here you would typically save to your backend
    setShowGSTCalculator(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingReport(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate and manage financial reports</p>
          </div>
          <Button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financialMetrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* Quick Report Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Financial Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => handleQuickGenerate('P&L')}
                className="flex items-center gap-2 h-20 flex-col"
                variant="outline"
              >
                <TrendingUp className="h-6 w-6" />
                <span>Profit & Loss</span>
              </Button>
              <Button 
                onClick={() => handleQuickGenerate('Balance Sheet')}
                className="flex items-center gap-2 h-20 flex-col"
                variant="outline"
              >
                <BarChart3 className="h-6 w-6" />
                <span>Balance Sheet</span>
              </Button>
              <Button 
                onClick={() => handleQuickGenerate('Cash Flow')}
                className="flex items-center gap-2 h-20 flex-col"
                variant="outline"
              >
                <DollarSign className="h-6 w-6" />
                <span>Cash Flow</span>
              </Button>
              <Button 
                onClick={handleOpenGSTCalculator}
                className="flex items-center gap-2 h-20 flex-col"
                variant="outline"
              >
                <Calculator className="h-6 w-6" />
                <span>GST Calculator</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reports">All Reports</TabsTrigger>
            <TabsTrigger value="pl">P&L Statements</TabsTrigger>
            <TabsTrigger value="balance">Balance Sheets</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="gst">GST Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="P&L">P&L Statement</SelectItem>
                        <SelectItem value="Balance Sheet">Balance Sheet</SelectItem>
                        <SelectItem value="Cash Flow">Cash Flow</SelectItem>
                        <SelectItem value="GST Return">GST Return</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Generated">Generated</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="this-quarter">This Quarter</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={handleView}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                />
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or generate a new report.</p>
              </div>
            )}
          </TabsContent>

          {/* Other tab contents would be similar with filtered data */}
          <TabsContent value="pl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.filter(r => r.type === 'P&L').map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={handleView}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="balance">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.filter(r => r.type === 'Balance Sheet').map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={handleView}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cashflow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.filter(r => r.type === 'Cash Flow').map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={handleView}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gst">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.filter(r => r.type === 'GST Return').map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={handleView}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Report Form Modal */}
        <ReportForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveReport}
          editingReport={editingReport}
        />

        {/* Financial Report Generator */}
        <FinancialReportGenerator
          isOpen={showReportGenerator}
          onClose={() => setShowReportGenerator(false)}
          onGenerate={handleGenerateFinancialReport}
          reportType={selectedReportType}
          defaultDateRange={getDefaultDateRange()}
        />

        {/* GST Calculator */}
        <GSTCalculator
          isOpen={showGSTCalculator}
          onClose={() => setShowGSTCalculator(false)}
          onSave={handleSaveGSTReturn}
        />
      </div>
    </DashboardLayout>
  );
}