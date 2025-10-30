import { supabase } from '@/lib/supabase';

// Loan Interface
export interface Loan {
  id?: string;
  loan_name: string;
  loan_type: 'PERSONAL' | 'BUSINESS' | 'HOME' | 'CAR' | 'EDUCATION' | 'OTHER';
  principal_amount: number;
  interest_rate: number; // Annual percentage rate
  tenure: number; // In months
  emi_amount: number;
  start_date: string;
  end_date: string;
  lender_name: string;
  lender_contact?: string;
  account_number?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'CLOSED';
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  // Calculated fields
  total_interest: number;
  total_amount: number;
  outstanding_balance: number;
  next_due_date: string;
  // Additional fields
  purpose?: string;
  collateral?: string;
  guarantor?: string;
  notes?: string;
}

// Loan Payment Interface
export interface LoanPayment {
  id?: string;
  loan_id: string;
  payment_date: string;
  amount: number;
  principal_amount: number;
  interest_amount: number;
  outstanding_balance: number;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE' | 'OTHER';
  reference_number?: string;
  notes?: string;
  user_id: string;
  created_at: string;
}

// Loan Form Data Interface
export interface LoanFormData {
  loan_name: string;
  loan_type: 'PERSONAL' | 'BUSINESS' | 'HOME' | 'CAR' | 'EDUCATION' | 'OTHER';
  principal_amount: number;
  interest_rate: number;
  tenure: number;
  start_date: string;
  lender_name: string;
  lender_contact?: string;
  account_number?: string;
  purpose?: string;
  collateral?: string;
  guarantor?: string;
  notes?: string;
}

// Loan Payment Form Data Interface
export interface LoanPaymentFormData {
  loan_id: string;
  payment_date: string;
  amount: number;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE' | 'OTHER';
  reference_number?: string;
  notes?: string;
}

// Loan Summary Interface
export interface LoanSummary {
  total_loans: number;
  active_loans: number;
  completed_loans: number;
  total_principal: number;
  total_outstanding: number;
  total_paid: number;
  monthly_emi: number;
}

// Loan Analytics Interface
export interface LoanAnalytics {
  loans_by_type: { [key: string]: number };
  loans_by_status: { [key: string]: number };
  monthly_payments: Array<{ month: string; amount: number }>;
  upcoming_payments: LoanPayment[];
}

// Helper function to calculate EMI
export const calculateEMI = (principal: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi * 100) / 100;
};

// Helper function to calculate loan details
export const calculateLoanDetails = (loanData: LoanFormData) => {
  const emiAmount = calculateEMI(loanData.principal_amount, loanData.interest_rate, loanData.tenure);
  const totalAmount = emiAmount * loanData.tenure;
  const totalInterest = totalAmount - loanData.principal_amount;
  
  const startDate = new Date(loanData.start_date);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + loanData.tenure);
  
  return {
    emi_amount: emiAmount,
    total_amount: totalAmount,
    total_interest: totalInterest,
    end_date: endDate.toISOString(),
    outstanding_balance: loanData.principal_amount,
    next_due_date: new Date(startDate.setMonth(startDate.getMonth() + 1)).toISOString()
  };
};

// Create a new loan
export const createLoan = async (loanData: LoanFormData, userId: string, organizationId: string): Promise<Loan> => {
  try {
    const calculatedDetails = calculateLoanDetails(loanData);
    const now = new Date().toISOString();
    
    const newLoan = {
      ...loanData,
      ...calculatedDetails,
      user_id: userId,
      organization_id: organizationId,
      status: 'ACTIVE' as const,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('loans')
      .insert(newLoan)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
};

// Update an existing loan
export const updateLoan = async (loanId: string, loanData: Partial<LoanFormData>): Promise<void> => {
  try {
    let updateData: any = {
      ...loanData,
      updated_at: new Date().toISOString()
    };

    // Recalculate loan details if principal, rate, or tenure changed
    if (loanData.principal_amount || loanData.interest_rate || loanData.tenure) {
      const currentLoan = await getLoan(loanId);
      if (currentLoan) {
        const fullLoanData = {
          ...currentLoan,
          ...loanData
        } as LoanFormData;
        const calculatedDetails = calculateLoanDetails(fullLoanData);
        updateData = { ...updateData, ...calculatedDetails };
      }
    }

    const { error } = await supabase
      .from('loans')
      .update(updateData)
      .eq('id', loanId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating loan:', error);
    throw error;
  }
};

// Delete a loan
export const deleteLoan = async (loanId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('id', loanId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting loan:', error);
    throw error;
  }
};

// Get a single loan by ID
export const getLoan = async (loanId: string): Promise<Loan | null> => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('id', loanId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error getting loan:', error);
    throw error;
  }
};

// Get all loans for a user
export const getLoans = async (userId: string, organizationId?: string): Promise<Loan[]> => {
  try {
    let query = supabase
      .from('loans')
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
    console.error('Error getting loans:', error);
    throw error;
  }
};

// Get loans by status
export const getLoansByStatus = async (userId: string, status: string, organizationId?: string): Promise<Loan[]> => {
  try {
    let query = supabase
      .from('loans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting loans by status:', error);
    throw error;
  }
};

// Create a loan payment
export const createLoanPayment = async (paymentData: LoanPaymentFormData, userId: string): Promise<LoanPayment> => {
  try {
    const { data: result, error } = await supabase.rpc('create_loan_payment', {
      p_loan_id: paymentData.loan_id,
      p_payment_date: paymentData.payment_date,
      p_amount: paymentData.amount,
      p_payment_method: paymentData.payment_method,
      p_reference_number: paymentData.reference_number,
      p_notes: paymentData.notes,
      p_user_id: userId
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating loan payment:', error);
    throw error;
  }
};

// Get loan payments
export const getLoanPayments = async (loanId: string): Promise<LoanPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('loan_payments')
      .select('*')
      .eq('loan_id', loanId)
      .order('payment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting loan payments:', error);
    throw error;
  }
};

// Get all payments for a user
export const getAllLoanPayments = async (userId: string): Promise<LoanPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('loan_payments')
      .select('*')
      .eq('user_id', userId)
      .order('payment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting all loan payments:', error);
    throw error;
  }
};

// Delete a loan payment
export const deleteLoanPayment = async (paymentId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('loan_payments')
      .delete()
      .eq('id', paymentId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting loan payment:', error);
    throw error;
  }
};

// Get loan summary
export const getLoanSummary = async (userId: string, organizationId?: string): Promise<LoanSummary> => {
  try {
    const { data, error } = await supabase.rpc('get_loan_summary', {
      p_user_id: userId,
      p_organization_id: organizationId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting loan summary:', error);
    throw error;
  }
};

// Get loan analytics
export const getLoanAnalytics = async (userId: string, organizationId?: string): Promise<LoanAnalytics> => {
  try {
    const { data, error } = await supabase.rpc('get_loan_analytics', {
      p_user_id: userId,
      p_organization_id: organizationId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting loan analytics:', error);
    throw error;
  }
};

// Get upcoming payments (next 30 days)
export const getUpcomingPayments = async (userId: string, organizationId?: string): Promise<Loan[]> => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    let query = supabase
      .from('loans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .lte('next_due_date', thirtyDaysFromNow.toISOString())
      .order('next_due_date');

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting upcoming payments:', error);
    throw error;
  }
};

// Update loan status
export const updateLoanStatus = async (loanId: string, status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'CLOSED'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('loans')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', loanId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating loan status:', error);
    throw error;
  }
};

// Search loans
export const searchLoans = async (userId: string, searchTerm: string, organizationId?: string): Promise<Loan[]> => {
  try {
    let query = supabase
      .from('loans')
      .select('*')
      .eq('user_id', userId)
      .or(`loan_name.ilike.%${searchTerm}%,lender_name.ilike.%${searchTerm}%,account_number.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching loans:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToLoans = (userId: string, callback: (loans: Loan[]) => void) => {
  return supabase
    .channel('loans')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'loans',
        filter: `user_id=eq.${userId}`
      }, 
      () => {
        getLoans(userId).then(callback);
      }
    )
    .subscribe();
};

export const subscribeToLoanPayments = (loanId: string, callback: (payments: LoanPayment[]) => void) => {
  return supabase
    .channel('loan_payments')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'loan_payments',
        filter: `loan_id=eq.${loanId}`
      }, 
      () => {
        getLoanPayments(loanId).then(callback);
      }
    )
    .subscribe();
};
