'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Minus,
  Save,
  X,
  Calendar,
  FileText,
  DollarSign,
  Calculator,
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

import { doubleEntryService, Account } from '@/services/doubleEntryService';

interface JournalEntryLine {
  id: string;
  accountId: string;
  accountName: string;
  accountCode: string;
  debitAmount: number;
  creditAmount: number;
  description: string;
}

interface JournalEntryData {
  id?: string;
  entryNumber: string;
  date: string;
  description: string;
  reference: string;
  lines: JournalEntryLine[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  status: 'DRAFT' | 'POSTED';
  organizationId: string;
  userId: string;
  createdAt?: any;
  updatedAt?: any;
}

interface JournalEntryProps {
  organizationId: string;
  userId: string;
  onEntryCreated: () => void;
}

export default function JournalEntry({ organizationId, userId, onEntryCreated }: JournalEntryProps) {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<JournalEntryData>({
    entryNumber: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    lines: [
      { id: '1', accountId: '', accountName: '', accountCode: '', debitAmount: 0, creditAmount: 0, description: '' },
      { id: '2', accountId: '', accountName: '', accountCode: '', debitAmount: 0, creditAmount: 0, description: '' }
    ],
    totalDebits: 0,
    totalCredits: 0,
    isBalanced: false,
    status: 'DRAFT',
    organizationId,
    userId
  });

  // Load data on component mount
  useEffect(() => {
    loadJournalEntries();
    loadAccounts();
  }, [organizationId]);

  const loadAccounts = async () => {
    try {
      const accountsData = await doubleEntryService.getAccounts(organizationId);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };



  useEffect(() => {
    loadJournalEntries();
  }, [organizationId, userId]);

  useEffect(() => {
    calculateTotals();
  }, [formData.lines]);

  const loadJournalEntries = async () => {
    setLoading(true);
    try {
      const entriesData = await doubleEntryService.getJournalEntries(organizationId);

      // Convert Supabase data to component format
      const formattedEntries: JournalEntryData[] = [];

      for (const entry of entriesData) {
        const lines = await doubleEntryService.getJournalEntryLines(entry.id!);
        formattedEntries.push({
          ...entry,
          lines: lines.map(line => ({
            id: line.id!,
            accountId: line.accountId,
            accountName: line.accountName,
            accountCode: line.accountCode,
            debitAmount: line.debitAmount,
            creditAmount: line.creditAmount,
            description: line.description
          }))
        });
      }

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalDebits = formData.lines.reduce((sum, line) => sum + (line.debitAmount || 0), 0);
    const totalCredits = formData.lines.reduce((sum, line) => sum + (line.creditAmount || 0), 0);
    const isBalanced = totalDebits === totalCredits && totalDebits > 0;

    setFormData(prev => ({
      ...prev,
      totalDebits,
      totalCredits,
      isBalanced
    }));
  };

  const addLine = () => {
    const newLine: JournalEntryLine = {
      id: Date.now().toString(),
      accountId: '',
      accountName: '',
      accountCode: '',
      debitAmount: 0,
      creditAmount: 0,
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, newLine]
    }));
  };

  const removeLine = (lineId: string) => {
    if (formData.lines.length > 2) {
      setFormData(prev => ({
        ...prev,
        lines: prev.lines.filter(line => line.id !== lineId)
      }));
    }
  };

  const updateLine = (lineId: string, field: keyof JournalEntryLine, value: any) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.map(line => {
        if (line.id === lineId) {
          const updatedLine = { ...line, [field]: value };

          // Auto-populate account details when account is selected
          if (field === 'accountId') {
            const account = accounts.find(acc => acc.id === value);
            if (account) {
              updatedLine.accountName = account.accountName;
              updatedLine.accountCode = account.accountCode;
            }
          }

          return updatedLine;
        }
        return line;
      })
    }));
  };

  const handleSave = async () => {
    if (!formData.isBalanced) {
      alert('Journal entry must be balanced (debits must equal credits)');
      return;
    }

    // Validate that all lines have accounts selected
    const invalidLines = formData.lines.filter(line => !line.accountId || (!line.debitAmount && !line.creditAmount));
    if (invalidLines.length > 0) {
      alert('Please select accounts and enter amounts for all lines');
      return;
    }

    try {
      setSaving(true);

      // Generate entry number if new
      let entryNumber = formData.entryNumber;
      if (!entryNumber) {
        entryNumber = await doubleEntryService.generateEntryNumber(organizationId);
      }

      // Prepare journal entry data
      const entryData = {
        entryNumber,
        date: formData.date,
        description: formData.description,
        reference: formData.reference,
        status: formData.status,
        totalDebits: formData.totalDebits,
        totalCredits: formData.totalCredits,
        isBalanced: formData.isBalanced,
        organizationId,
        userId
      };

      // Prepare journal lines data
      const linesData = formData.lines.map((line, index) => ({
        accountId: line.accountId,
        accountCode: line.accountCode,
        accountName: line.accountName,
        debitAmount: line.debitAmount || 0,
        creditAmount: line.creditAmount || 0,
        description: line.description,
        lineNumber: index + 1,
        organizationId,
        userId
      }));

      if (editingEntry && editingEntry.id) {
        // Update existing entry
        await doubleEntryService.updateJournalEntry(editingEntry.id, entryData, linesData);
      } else {
        // Create new entry
        await doubleEntryService.createJournalEntry(entryData, linesData);
      }

      setShowForm(false);
      setEditingEntry(null);
      resetForm();
      await loadJournalEntries();
      onEntryCreated();

      alert('Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert(`Error saving journal entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      entryNumber: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      lines: [
        { id: '1', accountId: '', accountName: '', accountCode: '', debitAmount: 0, creditAmount: 0, description: '' },
        { id: '2', accountId: '', accountName: '', accountCode: '', debitAmount: 0, creditAmount: 0, description: '' }
      ],
      totalDebits: 0,
      totalCredits: 0,
      isBalanced: false,
      status: 'DRAFT',
      organizationId,
      userId
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Journal Entries</h3>
            <p className="text-gray-600 mt-1">Record transactions using double-entry bookkeeping</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Journal Entry
            </button>
          </div>
        </div>

        {/* Journal Entries List */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{entry.entryNumber}</span>
                  <span className="text-sm text-gray-600">{entry.date}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    entry.status === 'POSTED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status}
                  </span>
                  {entry.isBalanced && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-900 font-medium mb-3">{entry.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-600 mb-2">
                  <div className="col-span-1">Code</div>
                  <div className="col-span-4">Account</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-2 text-right">Debit</div>
                  <div className="col-span-2 text-right">Credit</div>
                </div>
                {entry.lines.map((line) => (
                  <div key={line.id} className="grid grid-cols-12 gap-2 text-sm py-1">
                    <div className="col-span-1 font-mono text-gray-600">{line.accountCode}</div>
                    <div className="col-span-4">{line.accountName}</div>
                    <div className="col-span-3 text-gray-600">{line.description}</div>
                    <div className="col-span-2 text-right">
                      {line.debitAmount > 0 ? `₹${line.debitAmount.toLocaleString()}` : ''}
                    </div>
                    <div className="col-span-2 text-right">
                      {line.creditAmount > 0 ? `₹${line.creditAmount.toLocaleString()}` : ''}
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2 grid grid-cols-12 gap-2 text-sm font-medium">
                  <div className="col-span-8"></div>
                  <div className="col-span-2 text-right">₹{entry.totalDebits.toLocaleString()}</div>
                  <div className="col-span-2 text-right">₹{entry.totalCredits.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No journal entries found</h3>
            <p className="mt-1 text-sm text-gray-500">Start by creating your first journal entry.</p>
          </div>
        )}
      </div>

      {/* Journal Entry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Entry Header */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entry Number</label>
                  <input
                    type="text"
                    value={formData.entryNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, entryNumber: e.target.value }))}
                    placeholder="Auto-generated"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                    placeholder="Invoice, PO, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'DRAFT' | 'POSTED' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="POSTED">Posted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the transaction..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Journal Lines */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">Journal Lines</h4>
                  <button
                    onClick={addLine}
                    className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Line
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 grid grid-cols-12 gap-2 p-3 text-sm font-medium text-gray-600">
                    <div className="col-span-3">Account</div>
                    <div className="col-span-3">Description</div>
                    <div className="col-span-2">Debit</div>
                    <div className="col-span-2">Credit</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  
                  {formData.lines.map((line, index) => (
                    <div key={line.id} className="grid grid-cols-12 gap-2 p-3 border-t border-gray-200">
                      <div className="col-span-3">
                        <select
                          value={line.accountId}
                          onChange={(e) => updateLine(line.id, 'accountId', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Account</option>
                          {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.accountCode} - {account.accountName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                          placeholder="Line description"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={line.debitAmount || ''}
                          onChange={(e) => updateLine(line.id, 'debitAmount', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={line.creditAmount || ''}
                          onChange={(e) => updateLine(line.id, 'creditAmount', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <button
                          onClick={() => removeLine(line.id)}
                          disabled={formData.lines.length <= 2}
                          className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Totals */}
                  <div className="bg-gray-50 grid grid-cols-12 gap-2 p-3 border-t border-gray-200 font-medium">
                    <div className="col-span-6 text-right">Totals:</div>
                    <div className="col-span-2 text-right">₹{formData.totalDebits.toLocaleString()}</div>
                    <div className="col-span-2 text-right">₹{formData.totalCredits.toLocaleString()}</div>
                    <div className="col-span-2 flex items-center">
                      {formData.isBalanced ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`ml-1 text-xs ${formData.isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                        {formData.isBalanced ? 'Balanced' : 'Unbalanced'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.isBalanced || saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
