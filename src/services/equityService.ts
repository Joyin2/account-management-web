import { supabase } from '@/lib/supabase';

// Partner/Owner Interface
export interface Partner {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  partner_type: 'OWNER' | 'PARTNER' | 'INVESTOR' | 'SHAREHOLDER';
  join_date: string;
  is_active: boolean;
  equity_percentage: number;
  initial_capital: number;
  current_capital_balance: number;
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  // Additional fields
  pan_number?: string;
  aadhar_number?: string;
  bank_details?: {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
  };
  notes?: string;
}

// Equity Transaction Interface
export interface EquityTransaction {
  id?: string;
  partner_id: string;
  transaction_type: 'CAPITAL_CONTRIBUTION' | 'CAPITAL_WITHDRAWAL' | 'PROFIT_DISTRIBUTION' | 'LOSS_ALLOCATION' | 'EQUITY_ADJUSTMENT';
  amount: number;
  transaction_date: string;
  description?: string;
  reference_number?: string;
  payment_method?: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

// Capital Account Interface
export interface CapitalAccount {
  id?: string;
  partner_id: string;
  opening_balance: number;
  contributions: number;
  withdrawals: number;
  profit_share: number;
  loss_share: number;
  closing_balance: number;
  period_start: string;
  period_end: string;
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

// Profit Distribution Interface
export interface ProfitDistribution {
  id?: string;
  period_start: string;
  period_end: string;
  total_profit: number;
  total_loss: number;
  distribution_date: string;
  status: 'DRAFT' | 'APPROVED' | 'DISTRIBUTED';
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  partner_distributions: PartnerDistribution[];
}

// Partner Distribution Interface
export interface PartnerDistribution {
  id?: string;
  distribution_id: string;
  partner_id: string;
  equity_percentage: number;
  profit_share: number;
  loss_share: number;
  net_amount: number;
  payment_status: 'PENDING' | 'PAID' | 'CANCELLED';
  payment_date?: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
}

// Form Data Interfaces
export interface PartnerFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  partner_type: 'OWNER' | 'PARTNER' | 'INVESTOR' | 'SHAREHOLDER';
  join_date: string;
  equity_percentage: number;
  initial_capital: number;
  pan_number?: string;
  aadhar_number?: string;
  bank_details?: {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
  };
  notes?: string;
}

export interface EquityTransactionFormData {
  partner_id: string;
  transaction_type: 'CAPITAL_CONTRIBUTION' | 'CAPITAL_WITHDRAWAL' | 'PROFIT_DISTRIBUTION' | 'LOSS_ALLOCATION' | 'EQUITY_ADJUSTMENT';
  amount: number;
  transaction_date: string;
  description?: string;
  reference_number?: string;
  payment_method?: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  notes?: string;
}

// Summary Interfaces
export interface EquitySummary {
  total_partners: number;
  active_partners: number;
  total_capital: number;
  total_contributions: number;
  total_withdrawals: number;
  current_equity_value: number;
}

export interface PartnerSummary {
  partner: Partner;
  total_contributions: number;
  total_withdrawals: number;
  current_balance: number;
  profit_distributions: number;
  loss_allocations: number;
  recent_transactions: EquityTransaction[];
}

// Create a new partner
export const createPartner = async (partnerData: PartnerFormData, userId: string, organizationId: string): Promise<Partner> => {
  try {
    const now = new Date().toISOString();
    
    const newPartner = {
      ...partnerData,
      is_active: true,
      current_capital_balance: partnerData.initial_capital,
      user_id: userId,
      organization_id: organizationId,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('partners')
      .insert(newPartner)
      .select()
      .single();

    if (error) throw error;

    // Create initial capital contribution transaction
    if (partnerData.initial_capital > 0) {
      await createEquityTransaction({
        partner_id: data.id,
        transaction_type: 'CAPITAL_CONTRIBUTION',
        amount: partnerData.initial_capital,
        transaction_date: partnerData.join_date,
        description: 'Initial capital contribution',
        payment_method: 'BANK_TRANSFER'
      }, userId, organizationId);
    }

    return data;
  } catch (error) {
    console.error('Error creating partner:', error);
    throw error;
  }
};

// Update an existing partner
export const updatePartner = async (partnerId: string, partnerData: Partial<PartnerFormData>): Promise<void> => {
  try {
    const updateData = {
      ...partnerData,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('partners')
      .update(updateData)
      .eq('id', partnerId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating partner:', error);
    throw error;
  }
};

// Delete a partner
export const deletePartner = async (partnerId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', partnerId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting partner:', error);
    throw error;
  }
};

// Get a single partner by ID
export const getPartner = async (partnerId: string): Promise<Partner | null> => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', partnerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error getting partner:', error);
    throw error;
  }
};

// Get all partners for a user
export const getPartners = async (userId: string, organizationId?: string): Promise<Partner[]> => {
  try {
    let query = supabase
      .from('partners')
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
    console.error('Error getting partners:', error);
    throw error;
  }
};

// Get active partners
export const getActivePartners = async (userId: string, organizationId?: string): Promise<Partner[]> => {
  try {
    let query = supabase
      .from('partners')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('name');

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting active partners:', error);
    throw error;
  }
};

// Create an equity transaction
export const createEquityTransaction = async (
  transactionData: EquityTransactionFormData, 
  userId: string, 
  organizationId: string
): Promise<EquityTransaction> => {
  try {
    const { data: result, error } = await supabase.rpc('create_equity_transaction', {
      p_partner_id: transactionData.partner_id,
      p_transaction_type: transactionData.transaction_type,
      p_amount: transactionData.amount,
      p_transaction_date: transactionData.transaction_date,
      p_description: transactionData.description,
      p_reference_number: transactionData.reference_number,
      p_payment_method: transactionData.payment_method,
      p_notes: transactionData.notes,
      p_user_id: userId,
      p_organization_id: organizationId
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating equity transaction:', error);
    throw error;
  }
};

// Get equity transactions for a partner
export const getPartnerTransactions = async (partnerId: string): Promise<EquityTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('equity_transactions')
      .select('*')
      .eq('partner_id', partnerId)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting partner transactions:', error);
    throw error;
  }
};

// Get all equity transactions for a user
export const getEquityTransactions = async (userId: string, organizationId?: string): Promise<EquityTransaction[]> => {
  try {
    let query = supabase
      .from('equity_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting equity transactions:', error);
    throw error;
  }
};

// Delete an equity transaction
export const deleteEquityTransaction = async (transactionId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('equity_transactions')
      .delete()
      .eq('id', transactionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting equity transaction:', error);
    throw error;
  }
};

// Get equity summary
export const getEquitySummary = async (userId: string, organizationId?: string): Promise<EquitySummary> => {
  try {
    const { data, error } = await supabase.rpc('get_equity_summary', {
      p_user_id: userId,
      p_organization_id: organizationId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting equity summary:', error);
    throw error;
  }
};

// Get partner summary
export const getPartnerSummary = async (partnerId: string): Promise<PartnerSummary> => {
  try {
    const { data, error } = await supabase.rpc('get_partner_summary', {
      p_partner_id: partnerId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting partner summary:', error);
    throw error;
  }
};

// Create profit distribution
export const createProfitDistribution = async (
  distributionData: {
    period_start: string;
    period_end: string;
    total_profit: number;
    total_loss: number;
  },
  userId: string,
  organizationId: string
): Promise<ProfitDistribution> => {
  try {
    const { data: result, error } = await supabase.rpc('create_profit_distribution', {
      p_period_start: distributionData.period_start,
      p_period_end: distributionData.period_end,
      p_total_profit: distributionData.total_profit,
      p_total_loss: distributionData.total_loss,
      p_user_id: userId,
      p_organization_id: organizationId
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating profit distribution:', error);
    throw error;
  }
};

// Get profit distributions
export const getProfitDistributions = async (userId: string, organizationId?: string): Promise<ProfitDistribution[]> => {
  try {
    let query = supabase
      .from('profit_distributions')
      .select(`
        *,
        partner_distributions (
          *,
          partners (name)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting profit distributions:', error);
    throw error;
  }
};

// Approve profit distribution
export const approveProfitDistribution = async (distributionId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('approve_profit_distribution', {
      p_distribution_id: distributionId
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error approving profit distribution:', error);
    throw error;
  }
};

// Mark partner distribution as paid
export const markDistributionPaid = async (
  distributionId: string,
  partnerId: string,
  paymentData: {
    payment_date: string;
    payment_method: string;
    reference_number?: string;
    notes?: string;
  }
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('mark_distribution_paid', {
      p_distribution_id: distributionId,
      p_partner_id: partnerId,
      p_payment_date: paymentData.payment_date,
      p_payment_method: paymentData.payment_method,
      p_reference_number: paymentData.reference_number,
      p_notes: paymentData.notes
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error marking distribution as paid:', error);
    throw error;
  }
};

// Update partner equity percentage
export const updatePartnerEquity = async (partnerId: string, newEquityPercentage: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('partners')
      .update({ 
        equity_percentage: newEquityPercentage,
        updated_at: new Date().toISOString()
      })
      .eq('id', partnerId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating partner equity:', error);
    throw error;
  }
};

// Deactivate partner
export const deactivatePartner = async (partnerId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('partners')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', partnerId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deactivating partner:', error);
    throw error;
  }
};

// Reactivate partner
export const reactivatePartner = async (partnerId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('partners')
      .update({ 
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', partnerId);

    if (error) throw error;
  } catch (error) {
    console.error('Error reactivating partner:', error);
    throw error;
  }
};

// Search partners
export const searchPartners = async (userId: string, searchTerm: string, organizationId?: string): Promise<Partner[]> => {
  try {
    let query = supabase
      .from('partners')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .order('name');

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching partners:', error);
    throw error;
  }
};

// Get capital accounts
export const getCapitalAccounts = async (userId: string, organizationId?: string): Promise<CapitalAccount[]> => {
  try {
    let query = supabase
      .from('capital_accounts')
      .select(`
        *,
        partners (name, partner_type)
      `)
      .eq('user_id', userId)
      .order('period_end', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting capital accounts:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToPartners = (userId: string, callback: (partners: Partner[]) => void) => {
  return supabase
    .channel('partners')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'partners',
        filter: `user_id=eq.${userId}`
      }, 
      () => {
        getPartners(userId).then(callback);
      }
    )
    .subscribe();
};

export const subscribeToEquityTransactions = (userId: string, callback: (transactions: EquityTransaction[]) => void) => {
  return supabase
    .channel('equity_transactions')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'equity_transactions',
        filter: `user_id=eq.${userId}`
      }, 
      () => {
        getEquityTransactions(userId).then(callback);
      }
    )
    .subscribe();
};
