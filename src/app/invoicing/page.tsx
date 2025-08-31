'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  IndianRupee,
  User,
  Building2,
  Mail,
  Printer,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import InvoiceForm from '@/components/invoicing/InvoiceForm';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  gstRate: number;
  amount: number;
}

const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerName: 'ABC Corporation',
    customerEmail: 'contact@abc.com',
    customerAddress: '123 Business Street, Mumbai, Maharashtra 400001',
    issueDate: '2024-01-15',
    dueDate: '2024-02-14',
    items: [
      {
        id: '1',
        description: 'Product A',
        quantity: 10,
        rate: 1000,
        gstRate: 18,
        amount: 10000
      },
      {
        id: '2',
        description: 'Service B',
        quantity: 5,
        rate: 500,
        gstRate: 18,
        amount: 2500
      }
    ],
    subtotal: 12500,
    gstAmount: 2250,
    total: 14750,
    status: 'sent',
    notes: 'Payment terms: Net 30 days'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerName: 'XYZ Enterprises',
    customerEmail: 'billing@xyz.com',
    customerAddress: '456 Commerce Road, Delhi, Delhi 110001',
    issueDate: '2024-01-10',
    dueDate: '2024-01-25',
    items: [
      {
        id: '1',
        description: 'Consulting Services',
        quantity: 20,
        rate: 2000,
        gstRate: 18,
        amount: 40000
      }
    ],
    subtotal: 40000,
    gstAmount: 7200,
    total: 47200,
    status: 'overdue'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customerName: 'Tech Solutions Ltd',
    customerEmail: 'accounts@techsol.com',
    customerAddress: '789 Tech Park, Bangalore, Karnataka 560001',
    issueDate: '2024-01-20',
    dueDate: '2024-02-19',
    items: [
      {
        id: '1',
        description: 'Software License',
        quantity: 1,
        rate: 50000,
        gstRate: 18,
        amount: 50000
      }
    ],
    subtotal: 50000,
    gstAmount: 9000,
    total: 59000,
    status: 'paid'
  }
];

function InvoiceCard({ invoice, onView, onEdit, onDelete, onSend, onDownload }: {
  invoice: Invoice;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
  onDownload: (id: string) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'sent': return <Mail className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const daysToDue = Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-1">{invoice.customerName}</p>
          <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
          {getStatusIcon(invoice.status)}
          <span className="ml-1 capitalize">{invoice.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Issue Date</p>
          <p className="font-medium text-gray-900">{new Date(invoice.issueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Due Date</p>
          <p className={`font-medium ${
            daysToDue < 0 ? 'text-red-600' : daysToDue <= 7 ? 'text-yellow-600' : 'text-gray-900'
          }`}>
            {new Date(invoice.dueDate).toLocaleDateString()}
            {daysToDue < 0 && <span className="text-xs ml-1">(Overdue)</span>}
            {daysToDue >= 0 && daysToDue <= 7 && <span className="text-xs ml-1">(Due Soon)</span>}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Subtotal:</span>
          <span className="font-medium">₹{invoice.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">GST:</span>
          <span className="font-medium">₹{invoice.gstAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-200 pt-2">
          <span className="font-semibold text-gray-900">Total:</span>
          <span className="font-bold text-lg text-gray-900">₹{invoice.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{invoice.items.length} item(s)</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(invoice.id)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Invoice"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownload(invoice.id)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          {invoice.status !== 'paid' && (
            <button
              onClick={() => onSend(invoice.id)}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Send Email"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(invoice.id)}
            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Edit Invoice"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(invoice.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Invoice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function StatsCard({ title, value, icon: Icon, color, subtitle }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );
}

export default function InvoicingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);

  const handleView = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      // Open invoice preview/view modal
      console.log('View invoice:', invoice);
    }
  };

  const handleEdit = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      setEditingInvoice(invoice);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const handleSend = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      // Update invoice status to sent
      setInvoices(invoices.map(inv => 
        inv.id === id ? { ...inv, status: 'sent' as const } : inv
      ));
      console.log('Invoice sent:', invoice.invoiceNumber);
    }
  };

  const handleDownload = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      console.log('Download PDF for invoice:', invoice.invoiceNumber);
      // Implement PDF download functionality
    }
  };

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setIsFormOpen(true);
  };

  const handleSaveInvoice = (formData: Partial<Invoice>) => {
    if (editingInvoice) {
      // Update existing invoice
      setInvoices(invoices.map(inv => 
        inv.id === editingInvoice.id ? { ...inv, ...formData } : inv
      ));
    } else {
      // Create new invoice
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        ...formData,
        status: formData.action === 'send' ? 'sent' : 'draft'
      };
      setInvoices([newInvoice, ...invoices]);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingInvoice(null);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoicing</h1>
              <p className="text-gray-600">Create, manage, and track your invoices</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button 
                onClick={handleAddInvoice}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Total Invoices"
              value={totalInvoices}
              icon={FileText}
              color="text-blue-600"
            />
            <StatsCard
              title="Total Amount"
              value={`₹${totalAmount.toLocaleString()}`}
              icon={IndianRupee}
              color="text-green-600"
            />
            <StatsCard
              title="Paid Amount"
              value={`₹${paidAmount.toLocaleString()}`}
              icon={CheckCircle}
              color="text-green-600"
              subtitle={`${paidInvoices.length} invoices`}
            />
            <StatsCard
              title="Overdue Amount"
              value={`₹${overdueAmount.toLocaleString()}`}
              icon={AlertCircle}
              color="text-red-600"
              subtitle={`${overdueInvoices.length} invoices`}
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button 
                onClick={handleAddInvoice}
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700">Create Invoice</span>
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <Send className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700">Send Reminders</span>
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                <Download className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700">Bulk Export</span>
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
                <Printer className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700">Print Invoices</span>
              </button>
            </div>
          </div>

          {/* Invoices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSend={handleSend}
                onDownload={handleDownload}
              />
            ))}
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first invoice.</p>
              <button 
                onClick={handleAddInvoice}
                className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </button>
            </div>
          )}
        </div>
      </DashboardLayout>
      
      <InvoiceForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveInvoice}
        editingInvoice={editingInvoice}
      />
    </div>
  );
}