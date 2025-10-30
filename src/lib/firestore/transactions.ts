// Transaction service using Supabase MCP integration
import { supabase, mcpSupabase, dbOperations } from '@/lib/supabase';
import { Transaction, TransactionFilters, CreateTransactionData, UpdateTransactionData, TransactionSummary, TransactionsByType, TransactionsByCategory } from '@/types/transaction';

export class TransactionService {
  private tableName = 'transactions';

  // Create a new transaction using MCP operations
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const transactionData = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const result = await dbOperations.create(this.tableName, transactionData);
      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  // Get all transactions using MCP
  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const data = await dbOperations.read(this.tableName);
      return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error: any) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  // Get transaction by ID
  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const data = await dbOperations.read(this.tableName, { id });
      return data.length > 0 ? data[0] : null;
    } catch (error: any) {
      throw new Error(`Failed to fetch transaction: ${error.message}`);
    }
  }

  // Get transactions by organization using MCP
  async getTransactionsByOrganization(organizationId: string): Promise<Transaction[]> {
    try {
      const data = await dbOperations.read(this.tableName, { organization_id: organizationId });
      return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error: any) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  // Get transactions with filters using raw SQL through MCP
  async getTransactionsWithFilters(filters: TransactionFilters): Promise<Transaction[]> {
    try {
      let whereConditions: string[] = [];
      let params: any[] = [];
      let paramIndex = 1;

      if (filters.organizationId) {
        whereConditions.push(`organization_id = $${paramIndex}`);
        params.push(filters.organizationId);
        paramIndex++;
      }

      if (filters.type) {
        whereConditions.push(`type = $${paramIndex}`);
        params.push(filters.type);
        paramIndex++;
      }

      if (filters.category) {
        whereConditions.push(`category = $${paramIndex}`);
        params.push(filters.category);
        paramIndex++;
      }

      if (filters.startDate) {
        whereConditions.push(`date >= $${paramIndex}`);
        params.push(filters.startDate);
        paramIndex++;
      }

      if (filters.endDate) {
        whereConditions.push(`date <= $${paramIndex}`);
        params.push(filters.endDate);
        paramIndex++;
      }

      if (filters.minAmount !== undefined) {
        whereConditions.push(`amount >= $${paramIndex}`);
        params.push(filters.minAmount);
        paramIndex++;
      }

      if (filters.maxAmount !== undefined) {
        whereConditions.push(`amount <= $${paramIndex}`);
        params.push(filters.maxAmount);
        paramIndex++;
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      const sql = `SELECT * FROM ${this.tableName} ${whereClause} ORDER BY created_at DESC`;

      const data = await mcpSupabase.executeQuery(sql, params);
      return data || [];
    } catch (mcpError: any) {
      // Fallback to regular Supabase query if MCP fails
      let query = supabase.from(this.tableName).select('*');

      if (filters.organizationId) {
        query = query.eq('organization_id', filters.organizationId);
      }

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.startDate) {
        query = query.gte('date', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('date', filters.endDate);
      }

      if (filters.minAmount !== undefined) {
        query = query.gte('amount', filters.minAmount);
      }

      if (filters.maxAmount !== undefined) {
        query = query.lte('amount', filters.maxAmount);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch transactions: ${error.message}`);
      }

      return data || [];
    }
  }

  // Get transactions by date range
  async getTransactionsByDateRange(startDate: string, endDate: string, organizationId?: string): Promise<Transaction[]> {
    const filters: TransactionFilters = {
      startDate,
      endDate,
      organizationId
    };
    return this.getTransactionsWithFilters(filters);
  }

  // Get transactions by type
  async getTransactionsByType(type: string, organizationId?: string): Promise<Transaction[]> {
    const filters: TransactionFilters = {
      type,
      organizationId
    };
    return this.getTransactionsWithFilters(filters);
  }

  // Update transaction using MCP
  async updateTransaction(id: string, data: UpdateTransactionData): Promise<Transaction> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    try {
      const result = await dbOperations.update(this.tableName, id, updateData);
      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  }

  // Delete transaction using MCP
  async deleteTransaction(id: string): Promise<void> {
    try {
      await dbOperations.delete(this.tableName, id);
    } catch (error: any) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  }

  // Get transaction summary using MCP
  async getTransactionSummary(organizationId?: string): Promise<TransactionSummary> {
    try {
      const whereClause = organizationId ? `WHERE organization_id = $1` : '';
      const params = organizationId ? [organizationId] : [];
      
      const sql = `
        SELECT 
          COUNT(*) as total_transactions,
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense
        FROM ${this.tableName} 
        ${whereClause}
      `;

      const result = await mcpSupabase.executeQuery(sql, params);
      
      if (result && result.length > 0) {
        const row = result[0];
        return {
          totalTransactions: parseInt(row.total_transactions) || 0,
          totalIncome: parseFloat(row.total_income) || 0,
          totalExpense: parseFloat(row.total_expense) || 0,
          netAmount: (parseFloat(row.total_income) || 0) - (parseFloat(row.total_expense) || 0),
        };
      }
    } catch (error) {
      console.warn('MCP query failed, falling back to regular query:', error);
    }

    // Fallback to regular query
    const transactions = await this.getTransactionsWithFilters({ organizationId });
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTransactions: transactions.length,
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense,
    };
  }

  // Get transactions grouped by type
  async getTransactionsByTypeGrouped(organizationId?: string): Promise<TransactionsByType> {
    const transactions = await this.getTransactionsWithFilters({ organizationId });
    
    const grouped: TransactionsByType = {
      income: transactions.filter(t => t.type === 'income'),
      expense: transactions.filter(t => t.type === 'expense'),
      transfer: transactions.filter(t => t.type === 'transfer'),
    };

    return grouped;
  }

  // Get transactions grouped by category
  async getTransactionsByCategory(organizationId?: string): Promise<TransactionsByCategory> {
    const transactions = await this.getTransactionsWithFilters({ organizationId });
    const grouped: TransactionsByCategory = {};

    transactions.forEach(transaction => {
      const category = transaction.category || 'uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(transaction);
    });

    return grouped;
  }

  // Test MCP connection
  async testMCPConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const health = await mcpSupabase.healthCheck();
      if (health.healthy) {
        return { success: true, message: 'MCP connection successful' };
      } else {
        return { success: false, message: `MCP connection failed: ${health.error}` };
      }
    } catch (error: any) {
      return { success: false, message: `MCP test failed: ${error.message}` };
    }
  }

  // Get database statistics through MCP
  async getDatabaseStats() {
    try {
      return await mcpSupabase.getDatabaseStats();
    } catch (error: any) {
      throw new Error(`Failed to get database stats: ${error.message}`);
    }
  }
}

// Export singleton instance
export const transactionService = new TransactionService();