// Transaction types for Supabase integration

export interface Transaction {
  id: string;
  date: Date | string;
  description: string;
  amount: number;
  type: 'BUY' | 'SELL' | 'EXPENDITURE' | 'CAPITAL_DRAWINGS' | 'BANK' | 'LOAN' | 'EQUITY';
  sub_type?: string;
  category?: string;
  account?: string;
  reference?: string;
  notes?: string;
  product_name?: string;
  quantity?: number;
  price?: number;
  payment_method?: string;
  gst_type?: string;
  gst_amount?: number;
  organizationId: string;
  userId: string;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  type?: Transaction['type'];
  category?: string;
  account?: string;
  search?: string;
  organizationId?: string;
}

export interface CreateTransactionData {
  date: string;
  description: string;
  amount: number;
  type: Transaction['type'];
  sub_type?: string;
  category?: string;
  account?: string;
  reference?: string;
  notes?: string;
  product_name?: string;
  quantity?: number;
  price?: number;
  payment_method?: string;
  gst_type?: string;
  gst_amount?: number;
  organizationId: string;
  userId: string;
}

export interface UpdateTransactionData extends Partial<CreateTransactionData> {
  id: string;
}

// Transaction summary types for reports
export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface TransactionsByType {
  [key: string]: {
    count: number;
    total: number;
    percentage: number;
  };
}

export interface TransactionsByCategory {
  [key: string]: {
    count: number;
    total: number;
    transactions: Transaction[];
  };
}