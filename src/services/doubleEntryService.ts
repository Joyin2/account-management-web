import { supabase } from '@/lib/supabase';

// Account Interface
export interface Account {
  id?: string;
  account_code: string;
  account_name: string;
  account_type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  sub_type: string;
  normal_balance: 'DEBIT' | 'CREDIT';
  current_balance: number;
  parent_account_id?: string;
  is_active: boolean;
  description?: string;
  organization_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Journal Entry Line Interface
export interface JournalEntryLine {
  id?: string;
  journal_entry_id: string;
  account_id: string;
  account_code: string;
  account_name: string;
  debit_amount: number;
  credit_amount: number;
  description: string;
  line_number: number;
  organization_id: string;
  user_id: string;
  created_at: string;
}

// Journal Entry Interface
export interface JournalEntry {
  id?: string;
  entry_number: string;
  date: string;
  description: string;
  reference: string;
  total_debits: number;
  total_credits: number;
  is_balanced: boolean;
  status: 'DRAFT' | 'POSTED';
  organization_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const doubleEntryService = {
  // Account Management
  async createAccount(accountData: Omit<Account, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const account = {
        ...accountData,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('accounts')
        .insert(account)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  async getAccounts(organizationId: string): Promise<Account[]> {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('account_code');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },

  async updateAccount(accountId: string, accountData: Partial<Account>): Promise<void> {
    try {
      const { error } = await supabase
        .from('accounts')
        .update({
          ...accountData,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  },

  async deleteAccount(accountId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ is_active: false })
        .eq('id', accountId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  // Journal Entry Management
  async createJournalEntry(
    entryData: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>, 
    lines: Omit<JournalEntryLine, 'id' | 'journal_entry_id' | 'created_at'>[]
  ): Promise<string> {
    try {
      // Start a transaction
      const { data: entry, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
          ...entryData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (entryError) throw entryError;

      // Create journal lines
      const journalLines = lines.map((line, index) => ({
        ...line,
        journal_entry_id: entry.id,
        line_number: index + 1,
        created_at: new Date().toISOString()
      }));

      const { error: linesError } = await supabase
        .from('journal_lines')
        .insert(journalLines);

      if (linesError) throw linesError;

      // Update account balances
      await this.updateAccountBalances(lines);

      return entry.id;
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  },

  async getJournalEntries(organizationId: string): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw error;
    }
  },

  async getJournalEntryLines(journalEntryId: string): Promise<JournalEntryLine[]> {
    try {
      const { data, error } = await supabase
        .from('journal_lines')
        .select('*')
        .eq('journal_entry_id', journalEntryId)
        .order('line_number');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching journal entry lines:', error);
      throw error;
    }
  },

  async getAllJournalLines(organizationId: string): Promise<JournalEntryLine[]> {
    try {
      const { data, error } = await supabase
        .from('journal_lines')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all journal lines:', error);
      throw error;
    }
  },

  async updateJournalEntry(
    entryId: string, 
    entryData: Partial<JournalEntry>, 
    lines?: Omit<JournalEntryLine, 'id' | 'journal_entry_id' | 'created_at'>[]
  ): Promise<void> {
    try {
      // Update journal entry
      const { error: entryError } = await supabase
        .from('journal_entries')
        .update({
          ...entryData,
          updated_at: new Date().toISOString()
        })
        .eq('id', entryId);

      if (entryError) throw entryError;

      // If lines are provided, update them
      if (lines) {
        // Delete existing lines
        const { error: deleteError } = await supabase
          .from('journal_lines')
          .delete()
          .eq('journal_entry_id', entryId);

        if (deleteError) throw deleteError;

        // Insert new lines
        const journalLines = lines.map((line, index) => ({
          ...line,
          journal_entry_id: entryId,
          line_number: index + 1,
          created_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabase
          .from('journal_lines')
          .insert(journalLines);

        if (insertError) throw insertError;

        // Update account balances
        await this.updateAccountBalances(lines);
      }
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }
  },

  async deleteJournalEntry(entryId: string): Promise<void> {
    try {
      // Delete journal lines first
      const { error: linesError } = await supabase
        .from('journal_lines')
        .delete()
        .eq('journal_entry_id', entryId);

      if (linesError) throw linesError;

      // Delete journal entry
      const { error: entryError } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (entryError) throw entryError;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  },

  // Account Balance Management
  async updateAccountBalances(lines: Omit<JournalEntryLine, 'id' | 'journal_entry_id' | 'created_at'>[]): Promise<void> {
    try {
      for (const line of lines) {
        const { data: account, error: fetchError } = await supabase
          .from('accounts')
          .select('current_balance, normal_balance')
          .eq('id', line.account_id)
          .single();

        if (fetchError) throw fetchError;

        let newBalance = account.current_balance;
        
        if (account.normal_balance === 'DEBIT') {
          newBalance += line.debit_amount - line.credit_amount;
        } else {
          newBalance += line.credit_amount - line.debit_amount;
        }

        const { error: updateError } = await supabase
          .from('accounts')
          .update({ 
            current_balance: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('id', line.account_id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error updating account balances:', error);
      throw error;
    }
  },

  // Trial Balance
  async getTrialBalance(organizationId: string, asOfDate?: Date): Promise<Account[]> {
    try {
      let query = supabase
        .from('accounts')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('account_code');

      const { data, error } = await query;

      if (error) throw error;

      // If asOfDate is provided, calculate balances as of that date
      if (asOfDate) {
        // This would require more complex logic to calculate historical balances
        // For now, return current balances
        console.warn('Historical trial balance calculation not implemented yet');
      }

      return data || [];
    } catch (error) {
      console.error('Error generating trial balance:', error);
      throw error;
    }
  },

  // Utility Functions
  async generateEntryNumber(organizationId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('entry_number')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastNumber = parseInt(data[0].entry_number.replace(/\D/g, '')) || 0;
        return `JE${String(lastNumber + 1).padStart(6, '0')}`;
      }

      return 'JE000001';
    } catch (error) {
      console.error('Error generating entry number:', error);
      return `JE${Date.now()}`;
    }
  },

  async calculateAccountBalance(accountId: string, organizationId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('journal_lines')
        .select('debit_amount, credit_amount')
        .eq('account_id', accountId)
        .eq('organization_id', organizationId);

      if (error) throw error;

      const totalDebits = data.reduce((sum, line) => sum + line.debit_amount, 0);
      const totalCredits = data.reduce((sum, line) => sum + line.credit_amount, 0);

      // Get account normal balance to determine calculation
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('normal_balance')
        .eq('id', accountId)
        .single();

      if (accountError) throw accountError;

      return account.normal_balance === 'DEBIT' 
        ? totalDebits - totalCredits 
        : totalCredits - totalDebits;
    } catch (error) {
      console.error('Error calculating account balance:', error);
      throw error;
    }
  },

  async getAccountsWithCalculatedBalances(organizationId: string): Promise<Account[]> {
    try {
      const accounts = await this.getAccounts(organizationId);
      
      for (const account of accounts) {
        if (account.id) {
          const calculatedBalance = await this.calculateAccountBalance(account.id, organizationId);
          account.current_balance = calculatedBalance;
        }
      }

      return accounts;
    } catch (error) {
      console.error('Error getting accounts with calculated balances:', error);
      throw error;
    }
  },

  async cleanupDuplicateAccounts(organizationId: string): Promise<void> {
    try {
      const { data: accounts, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('organization_id', organizationId)
        .order('account_code, created_at');

      if (error) throw error;

      const seen = new Set<string>();
      const duplicates: string[] = [];

      for (const account of accounts) {
        const key = `${account.account_code}-${account.organization_id}`;
        if (seen.has(key)) {
          duplicates.push(account.id);
        } else {
          seen.add(key);
        }
      }

      if (duplicates.length > 0) {
        const { error: deleteError } = await supabase
          .from('accounts')
          .delete()
          .in('id', duplicates);

        if (deleteError) throw deleteError;
      }
    } catch (error) {
      console.error('Error cleaning up duplicate accounts:', error);
      throw error;
    }
  },

  async createDefaultAccounts(organizationId: string, userId: string): Promise<void> {
    const defaultAccounts = [
      { account_code: '1000', account_name: 'Cash', account_type: 'ASSET', sub_type: 'Current Asset', normal_balance: 'DEBIT' },
      { account_code: '1100', account_name: 'Accounts Receivable', account_type: 'ASSET', sub_type: 'Current Asset', normal_balance: 'DEBIT' },
      { account_code: '1200', account_name: 'Inventory', account_type: 'ASSET', sub_type: 'Current Asset', normal_balance: 'DEBIT' },
      { account_code: '1500', account_name: 'Equipment', account_type: 'ASSET', sub_type: 'Fixed Asset', normal_balance: 'DEBIT' },
      { account_code: '2000', account_name: 'Accounts Payable', account_type: 'LIABILITY', sub_type: 'Current Liability', normal_balance: 'CREDIT' },
      { account_code: '2100', account_name: 'Notes Payable', account_type: 'LIABILITY', sub_type: 'Long-term Liability', normal_balance: 'CREDIT' },
      { account_code: '3000', account_name: 'Owner\'s Equity', account_type: 'EQUITY', sub_type: 'Owner\'s Equity', normal_balance: 'CREDIT' },
      { account_code: '4000', account_name: 'Sales Revenue', account_type: 'REVENUE', sub_type: 'Operating Revenue', normal_balance: 'CREDIT' },
      { account_code: '5000', account_name: 'Cost of Goods Sold', account_type: 'EXPENSE', sub_type: 'Cost of Sales', normal_balance: 'DEBIT' },
      { account_code: '6000', account_name: 'Operating Expenses', account_type: 'EXPENSE', sub_type: 'Operating Expense', normal_balance: 'DEBIT' }
    ];

    try {
      const accountsToInsert = defaultAccounts.map(account => ({
        ...account,
        organization_id: organizationId,
        user_id: userId,
        current_balance: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('accounts')
        .insert(accountsToInsert);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating default accounts:', error);
      throw error;
    }
  }
};
