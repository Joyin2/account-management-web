// Transaction API functions for data persistence

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  account: string;
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  type?: 'income' | 'expense';
  category?: string;
  account?: string;
  search?: string;
}

// Mock data storage (in a real app, this would be a database)
const transactionsStore: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Product Sales Revenue',
    amount: 25000,
    type: 'income',
    category: 'Sales',
    account: 'Revenue Account',
    reference: 'INV-001',
    notes: 'Monthly product sales',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    date: '2024-01-16',
    description: 'Office Rent Payment',
    amount: 15000,
    type: 'expense',
    category: 'Rent',
    account: 'Expense Account',
    reference: 'RENT-JAN',
    notes: 'Monthly office rent',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z'
  },
  {
    id: '3',
    date: '2024-01-17',
    description: 'Service Income',
    amount: 18000,
    type: 'income',
    category: 'Services',
    account: 'Revenue Account',
    reference: 'SRV-002',
    notes: 'Consulting services',
    createdAt: '2024-01-17T14:30:00Z',
    updatedAt: '2024-01-17T14:30:00Z'
  },
  {
    id: '4',
    date: '2024-01-18',
    description: 'Equipment Purchase',
    amount: 12000,
    type: 'expense',
    category: 'Equipment',
    account: 'Asset Account',
    reference: 'EQ-001',
    notes: 'New laptop for development',
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-18T11:15:00Z'
  },
  {
    id: '5',
    date: '2024-01-19',
    description: 'Marketing Campaign',
    amount: 8000,
    type: 'expense',
    category: 'Marketing',
    account: 'Expense Account',
    reference: 'MKT-001',
    notes: 'Social media advertising',
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-19T16:45:00Z'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all transactions with optional filtering
export async function getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  await delay(300); // Simulate API call
  
  let filteredTransactions = [...transactionsStore];
  
  if (filters) {
    if (filters.dateFrom) {
      filteredTransactions = filteredTransactions.filter(
        t => new Date(t.date) >= new Date(filters.dateFrom!)
      );
    }
    
    if (filters.dateTo) {
      filteredTransactions = filteredTransactions.filter(
        t => new Date(t.date) <= new Date(filters.dateTo!)
      );
    }
    
    if (filters.type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
    }
    
    if (filters.category) {
      filteredTransactions = filteredTransactions.filter(t => t.category === filters.category);
    }
    
    if (filters.account) {
      filteredTransactions = filteredTransactions.filter(t => t.account === filters.account);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(
        t => t.description.toLowerCase().includes(searchLower) ||
             t.reference?.toLowerCase().includes(searchLower) ||
             t.notes?.toLowerCase().includes(searchLower)
      );
    }
  }
  
  // Sort by date (newest first)
  return filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get a single transaction by ID
export async function getTransaction(id: string): Promise<Transaction | null> {
  await delay(200);
  return transactionsStore.find(t => t.id === id) || null;
}

// Create a new transaction
export async function createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
  await delay(400);
  
  const newTransaction: Transaction = {
    ...transactionData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  transactionsStore.push(newTransaction);
  return newTransaction;
}

// Update an existing transaction
export async function updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Promise<Transaction | null> {
  await delay(400);
  
  const index = transactionsStore.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  const updatedTransaction = {
    ...transactionsStore[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  transactionsStore[index] = updatedTransaction;
  return updatedTransaction;
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<boolean> {
  await delay(300);
  
  const index = transactionsStore.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  transactionsStore.splice(index, 1);
  return true;
}

// Get transaction statistics
export async function getTransactionStats(filters?: TransactionFilters): Promise<{
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  averageTransaction: number;
}> {
  await delay(250);
  
  const transactions = await getTransactions(filters);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netIncome = totalIncome - totalExpenses;
  const transactionCount = transactions.length;
  const averageTransaction = transactionCount > 0 ? 
    transactions.reduce((sum, t) => sum + t.amount, 0) / transactionCount : 0;
  
  return {
    totalIncome,
    totalExpenses,
    netIncome,
    transactionCount,
    averageTransaction
  };
}

// Get transactions by category
export async function getTransactionsByCategory(filters?: TransactionFilters): Promise<{
  category: string;
  totalAmount: number;
  transactionCount: number;
  type: 'income' | 'expense';
}[]> {
  await delay(200);
  
  const transactions = await getTransactions(filters);
  const categoryMap = new Map<string, { amount: number; count: number; type: 'income' | 'expense' }>();
  
  transactions.forEach(transaction => {
    const key = `${transaction.category}-${transaction.type}`;
    const existing = categoryMap.get(key) || { amount: 0, count: 0, type: transaction.type };
    
    categoryMap.set(key, {
      amount: existing.amount + transaction.amount,
      count: existing.count + 1,
      type: transaction.type
    });
  });
  
  return Array.from(categoryMap.entries()).map(([key, data]) => {
    const [category] = key.split('-');
    return {
      category,
      totalAmount: data.amount,
      transactionCount: data.count,
      type: data.type
    };
  }).sort((a, b) => b.totalAmount - a.totalAmount);
}

// Export all transactions (for backup/export functionality)
export async function exportTransactions(format: 'json' | 'csv' = 'json'): Promise<string> {
  await delay(500);
  
  const transactions = await getTransactions();
  
  if (format === 'csv') {
    const headers = ['ID', 'Date', 'Description', 'Amount', 'Type', 'Category', 'Account', 'Reference', 'Notes'];
    const csvRows = [headers.join(',')];
    
    transactions.forEach(t => {
      const row = [
        t.id,
        t.date,
        `"${t.description}"`,
        t.amount.toString(),
        t.type,
        t.category,
        t.account,
        t.reference || '',
        `"${t.notes || ''}"`
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }
  
  return JSON.stringify(transactions, null, 2);
}

// Import transactions (for data migration)
export async function importTransactions(data: Transaction[]): Promise<{ success: number; errors: string[] }> {
  await delay(800);
  
  const errors: string[] = [];
  let success = 0;
  
  for (const transaction of data) {
    try {
      // Validate required fields
      if (!transaction.description || !transaction.amount || !transaction.type) {
        errors.push(`Invalid transaction: ${transaction.id || 'Unknown ID'}`);
        continue;
      }
      
      // Check if transaction already exists
      const existing = transactionsStore.find(t => t.id === transaction.id);
      if (existing) {
        errors.push(`Transaction already exists: ${transaction.id}`);
        continue;
      }
      
      transactionsStore.push({
        ...transaction,
        createdAt: transaction.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      success++;
    } catch (error) {
      errors.push(`Error importing transaction ${transaction.id}: ${error}`);
    }
  }
  
  return { success, errors };
}