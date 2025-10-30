import { supabase } from '@/lib/supabase';

// Bank Account Interface
export interface BankAccount {
  id?: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  account_type: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'CREDIT_CARD';
  balance: number;
  currency: string;
  is_active: boolean;
  opening_date: string;
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  // Additional fields
  ifsc_code?: string;
  branch_name?: string;
  contact_number?: string;
  description?: string;
}

// Bank Transaction Interface
export interface BankTransaction {
  id?: string;
  account_id: string;
  transaction_type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'FEE' | 'INTEREST';
  amount: number;
  balance: number; // Balance after transaction
  description: string;
  reference?: string;
  category?: string;
  transaction_date: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  // Additional fields
  payment_method?: 'CASH' | 'CHEQUE' | 'ONLINE' | 'CARD' | 'UPI';
  counterparty?: string;
  notes?: string;
}

// Bank Reconciliation Interface
export interface BankReconciliation {
  id?: string;
  account_id: string;
  statement_date: string;
  statement_balance: number;
  book_balance: number;
  difference: number;
  status: 'PENDING' | 'RECONCILED' | 'DISCREPANCY';
  reconciled_by?: string;
  reconciled_date?: string;
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

// Form Data Interfaces
export interface BankAccountFormData {
  account_name: string;
  account_number: string;
  bank_name: string;
  account_type: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'CREDIT_CARD';
  balance: number;
  currency: string;
  opening_date: string;
  ifsc_code?: string;
  branch_name?: string;
  contact_number?: string;
  description?: string;
}

export interface BankTransactionFormData {
  account_id: string;
  transaction_type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'FEE' | 'INTEREST';
  amount: number;
  description: string;
  reference?: string;
  category?: string;
  transaction_date: string;
  payment_method?: 'CASH' | 'CHEQUE' | 'ONLINE' | 'CARD' | 'UPI';
  counterparty?: string;
  notes?: string;
}

// Summary Interfaces
export interface BankSummary {
  total_accounts: number;
  active_accounts: number;
  total_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  net_cash_flow: number;
}

export interface AccountSummary {
  account: BankAccount;
  total_deposits: number;
  total_withdrawals: number;
  transaction_count: number;
  average_balance: number;
  recent_transactions: BankTransaction[];
}

// Create a new bank account
export const createBankAccount = async (accountData: BankAccountFormData, userId: string, organizationId: string): Promise<BankAccount> => {
  try {
    const now = new Date().toISOString();
    
    const newAccount = {
      ...accountData,
      is_active: true,
      user_id: userId,
      organization_id: organizationId,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('bank_accounts')
      .insert(newAccount)
      .select()
      .single();

    if (error) throw error;

    // Create initial balance transaction if balance > 0
    if (accountData.balance > 0) {
      await createBankTransaction({
        account_id: data.id,
        transaction_type: 'DEPOSIT',
        amount: accountData.balance,
        description: 'Opening balance',
        transaction_date: accountData.opening_date,
        payment_method: 'CASH'
      }, userId, organizationId);
    }

    return data;
  } catch (error) {
    console.error('Error creating bank account:', error);
    throw error;
  }
};

// Update an existing bank account
export const updateBankAccount = async (accountId: string, accountData: Partial<BankAccountFormData>): Promise<void> => {
  try {
    const updateData = {
      ...accountData,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('bank_accounts')
      .update(updateData)
      .eq('id', accountId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating bank account:', error);
    throw error;
  }
};

// Delete a bank account
export const deleteBankAccount = async (accountId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bank_accounts')
      .delete()
      .eq('id', accountId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting bank account:', error);
    throw error;
  }
};

// Get a single bank account by ID
export const getBankAccount = async (accountId: string): Promise<BankAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error getting bank account:', error);
    throw error;
  }
};

// Get all bank accounts for a user
export const getBankAccounts = async (userId: string, organizationId?: string): Promise<BankAccount[]> => {
  try {
    let query = supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting bank accounts:', error);
    throw error;
  }
};

// Get active bank accounts
export const getActiveBankAccounts = async (userId: string, organizationId?: string): Promise<BankAccount[]> => {
  try {
    let query = supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('account_name');

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting active bank accounts:', error);
    throw error;
  }
};

// Create a bank transaction
export const createBankTransaction = async (
  transactionData: BankTransactionFormData, 
  userId: string, 
  organizationId: string
): Promise<BankTransaction> => {
  try {
    const { data: result, error } = await supabase.rpc('create_bank_transaction', {
      p_account_id: transactionData.account_id,
      p_transaction_type: transactionData.transaction_type,
      p_amount: transactionData.amount,
      p_description: transactionData.description,
      p_reference: transactionData.reference,
      p_category: transactionData.category,
      p_transaction_date: transactionData.transaction_date,
      p_payment_method: transactionData.payment_method,
      p_counterparty: transactionData.counterparty,
      p_notes: transactionData.notes,
      p_user_id: userId,
      p_organization_id: organizationId
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating bank transaction:', error);
    throw error;
  }
};

// Get bank transactions for an account
export const getAccountTransactions = async (accountId: string, limit?: number): Promise<BankTransaction[]> => {
  try {
    let query = supabase
      .from('bank_transactions')
      .select('*')
      .eq('account_id', accountId)
      .order('transaction_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting account transactions:', error);
    throw error;
  }
};

// Get all bank transactions for a user
export const getBankTransactions = async (userId: string, organizationId?: string): Promise<BankTransaction[]> => {
  try {
    let query = supabase
      .from('bank_transactions')
      .select(`
        *,
        bank_accounts (account_name, bank_name)
      `)
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting bank transactions:', error);
    throw error;
  }
};

// Update a bank transaction
export const updateBankTransaction = async (transactionId: string, transactionData: Partial<BankTransactionFormData>): Promise<void> => {
  try {
    const updateData = {
      ...transactionData,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('bank_transactions')
      .update(updateData)
      .eq('id', transactionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating bank transaction:', error);
    throw error;
  }
};

// Delete a bank transaction
export const deleteBankTransaction = async (transactionId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('delete_bank_transaction', {
      p_transaction_id: transactionId
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting bank transaction:', error);
    throw error;
  }
};

// Transfer money between accounts
export const transferMoney = async (
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  description: string,
  reference?: string,
  userId?: string,
  organizationId?: string
): Promise<{ fromTransaction: BankTransaction; toTransaction: BankTransaction }> => {
  try {
    const { data: result, error } = await supabase.rpc('transfer_money', {
      p_from_account_id: fromAccountId,
      p_to_account_id: toAccountId,
      p_amount: amount,
      p_description: description,
      p_reference: reference,
      p_user_id: userId,
      p_organization_id: organizationId
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error transferring money:', error);
    throw error;
  }
};

// Get bank summary
export const getBankSummary = async (userId: string, organizationId?: string): Promise<BankSummary> => {
  try {
    const { data, error } = await supabase.rpc('get_bank_summary', {
      p_user_id: userId,
      p_organization_id: organizationId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting bank summary:', error);
    throw error;
  }
};

// Get account summary
export const getAccountSummary = async (accountId: string): Promise<AccountSummary> => {
  try {
    const { data, error } = await supabase.rpc('get_account_summary', {
      p_account_id: accountId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting account summary:', error);
    throw error;
  }
};

// Get transactions by date range
export const getTransactionsByDateRange = async (
  userId: string,
  startDate: string,
  endDate: string,
  accountId?: string,
  organizationId?: string
): Promise<BankTransaction[]> => {
  try {
    let query = supabase
      .from('bank_transactions')
      .select(`
        *,
        bank_accounts (account_name, bank_name)
      `)
      .eq('user_id', userId)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)
      .order('transaction_date', { ascending: false });

    if (accountId) {
      query = query.eq('account_id', accountId);
    }

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting transactions by date range:', error);
    throw error;
  }
};

// Get transactions by category
export const getTransactionsByCategory = async (userId: string, category: string, organizationId?: string): Promise<BankTransaction[]> => {
  try {
    let query = supabase
      .from('bank_transactions')
      .select(`
        *,
        bank_accounts (account_name, bank_name)
      `)
      .eq('user_id', userId)
      .eq('category', category)
      .order('transaction_date', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting transactions by category:', error);
    throw error;
  }
};

// Search transactions
export const searchTransactions = async (userId: string, searchTerm: string, organizationId?: string): Promise<BankTransaction[]> => {
  try {
    let query = supabase
      .from('bank_transactions')
      .select(`
        *,
        bank_accounts (account_name, bank_name)
      `)
      .eq('user_id', userId)
      .or(`description.ilike.%${searchTerm}%,reference.ilike.%${searchTerm}%,counterparty.ilike.%${searchTerm}%`)
      .order('transaction_date', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching transactions:', error);
    throw error;
  }
};

// Deactivate bank account
export const deactivateBankAccount = async (accountId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bank_accounts')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', accountId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deactivating bank account:', error);
    throw error;
  }
};

// Reactivate bank account
export const reactivateBankAccount = async (accountId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bank_accounts')
      .update({ 
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', accountId);

    if (error) throw error;
  } catch (error) {
    console.error('Error reactivating bank account:', error);
    throw error;
  }
};

// Get account balance history
export const getAccountBalanceHistory = async (accountId: string, days: number = 30): Promise<{ date: string; balance: number }[]> => {
  try {
    const { data, error } = await supabase.rpc('get_account_balance_history', {
      p_account_id: accountId,
      p_days: days
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting account balance history:', error);
    throw error;
  }
};

// Create bank reconciliation
export const createBankReconciliation = async (
  reconciliationData: {
    account_id: string;
    statement_date: string;
    statement_balance: number;
    notes?: string;
  },
  userId: string,
  organizationId: string
): Promise<BankReconciliation> => {
  try {
    const { data: result, error } = await supabase.rpc('create_bank_reconciliation', {
      p_account_id: reconciliationData.account_id,
      p_statement_date: reconciliationData.statement_date,
      p_statement_balance: reconciliationData.statement_balance,
      p_notes: reconciliationData.notes,
      p_user_id: userId,
      p_organization_id: organizationId
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating bank reconciliation:', error);
    throw error;
  }
};

// Get bank reconciliations
export const getBankReconciliations = async (userId: string, organizationId?: string): Promise<BankReconciliation[]> => {
  try {
    let query = supabase
      .from('bank_reconciliations')
      .select(`
        *,
        bank_accounts (account_name, bank_name)
      `)
      .eq('user_id', userId)
      .order('statement_date', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting bank reconciliations:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToBankAccounts = (userId: string, callback: (accounts: BankAccount[]) => void) => {
  return supabase
    .channel('bank_accounts')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'bank_accounts',
        filter: `user_id=eq.${userId}`
      }, 
      () => {
        getBankAccounts(userId).then(callback);
      }
    )
    .subscribe();
};

export const subscribeToBankTransactions = (userId: string, callback: (transactions: BankTransaction[]) => void) => {
  return supabase
    .channel('bank_transactions')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'bank_transactions',
        filter: `user_id=eq.${userId}`
      }, 
      () => {
        getBankTransactions(userId).then(callback);
      }
    )
    .subscribe();
};
