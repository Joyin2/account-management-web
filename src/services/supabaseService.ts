import { supabase, mcpSupabase, dbOperations, realtimeOperations, authOperations } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmmuemrrsgvjnjnpgycl.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtbXVlbXJyc2d2am5qbnBneWNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk4MzY5MSwiZXhwIjoyMDY4NTU5NjkxfQ.KVLkHK4W7OUwtvONVNaD6DKsakoIhJlMS1c5dNC1Rl0'

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    serviceKey: !!supabaseServiceKey
  })
}

// Service role client for admin operations
const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export class SupabaseService {
  // Account Management Operations
  static async createAccount(accountData: any) {
    try {
      const result = await dbOperations.create('accounts', {
        ...accountData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('Create account error:', error)
      return { success: false, error }
    }
  }

  static async getAccounts(filters?: any) {
    try {
      const accounts = await dbOperations.read('accounts', filters)
      return { success: true, data: accounts }
    } catch (error) {
      console.error('Get accounts error:', error)
      return { success: false, error }
    }
  }

  static async updateAccount(id: string, updateData: any) {
    try {
      const result = await dbOperations.update('accounts', id, {
        ...updateData,
        updated_at: new Date().toISOString()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('Update account error:', error)
      return { success: false, error }
    }
  }

  static async deleteAccount(id: string) {
    try {
      await dbOperations.delete('accounts', id)
      return { success: true }
    } catch (error) {
      console.error('Delete account error:', error)
      return { success: false, error }
    }
  }

  // Transaction Operations
  static async createTransaction(transactionData: any) {
    try {
      // Use MCP for complex transaction logic
      const result = await mcpSupabase.executeQuery(`
        INSERT INTO transactions (account_id, amount, type, description, date, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *;
      `, [
        transactionData.account_id,
        transactionData.amount,
        transactionData.type,
        transactionData.description,
        transactionData.date
      ])
      
      return { success: true, data: result }
    } catch (error) {
      console.error('Create transaction error:', error)
      return { success: false, error }
    }
  }

  static async getTransactions(accountId?: string, filters?: any) {
    try {
      let query = `
        SELECT t.*, a.name as account_name 
        FROM transactions t 
        LEFT JOIN accounts a ON t.account_id = a.id
      `
      const params: any[] = []
      
      if (accountId) {
        query += ' WHERE t.account_id = $1'
        params.push(accountId)
      }
      
      if (filters?.startDate) {
        query += params.length > 0 ? ' AND' : ' WHERE'
        query += ` t.date >= $${params.length + 1}`
        params.push(filters.startDate)
      }
      
      if (filters?.endDate) {
        query += params.length > 0 ? ' AND' : ' WHERE'
        query += ` t.date <= $${params.length + 1}`
        params.push(filters.endDate)
      }
      
      query += ' ORDER BY t.date DESC, t.created_at DESC'
      
      const result = await mcpSupabase.executeQuery(query, params)
      return { success: true, data: result }
    } catch (error) {
      console.error('Get transactions error:', error)
      return { success: false, error }
    }
  }

  // Inventory Operations
  static async createInventoryItem(itemData: any) {
    try {
      const result = await dbOperations.create('inventory', {
        ...itemData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('Create inventory item error:', error)
      return { success: false, error }
    }
  }

  static async updateInventoryQuantity(itemId: string, quantity: number, operation: 'add' | 'subtract' | 'set') {
    try {
      let query: string
      const params = [itemId.toString()]
      
      switch (operation) {
        case 'add':
          query = 'UPDATE inventory SET quantity = quantity + $2, updated_at = NOW() WHERE id = $1 RETURNING *'
          params.push(quantity.toString())
          break
        case 'subtract':
          query = 'UPDATE inventory SET quantity = quantity - $2, updated_at = NOW() WHERE id = $1 RETURNING *'
          params.push(quantity.toString())
          break
        case 'set':
          query = 'UPDATE inventory SET quantity = $2, updated_at = NOW() WHERE id = $1 RETURNING *'
          params.push(quantity.toString())
          break
        default:
          throw new Error('Invalid operation')
      }
      
      const result = await mcpSupabase.executeQuery(query, params)
      return { success: true, data: result }
    } catch (error) {
      console.error('Update inventory quantity error:', error)
      return { success: false, error }
    }
  }

  // Employee Operations
  static async createEmployee(employeeData: any) {
    try {
      const result = await dbOperations.create('employees', {
        ...employeeData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('Create employee error:', error)
      return { success: false, error }
    }
  }

  static async getEmployees(filters?: any) {
    try {
      const employees = await dbOperations.read('employees', filters)
      return { success: true, data: employees }
    } catch (error) {
      console.error('Get employees error:', error)
      return { success: false, error }
    }
  }

  // Reporting Operations
  static async generateFinancialReport(startDate: string, endDate: string) {
    try {
      const query = `
        SELECT 
          DATE_TRUNC('month', date) as month,
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
          SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_profit
        FROM transactions 
        WHERE date BETWEEN $1 AND $2
        GROUP BY DATE_TRUNC('month', date)
        ORDER BY month DESC
      `
      
      const result = await mcpSupabase.executeQuery(query, [startDate, endDate])
      return { success: true, data: result }
    } catch (error) {
      console.error('Generate financial report error:', error)
      return { success: false, error }
    }
  }

  static async getAccountBalances() {
    try {
      const query = `
        SELECT 
          a.id,
          a.name,
          a.type,
          COALESCE(SUM(
            CASE 
              WHEN t.type = 'income' THEN t.amount 
              WHEN t.type = 'expense' THEN -t.amount 
              ELSE 0 
            END
          ), 0) as balance
        FROM accounts a
        LEFT JOIN transactions t ON a.id = t.account_id
        GROUP BY a.id, a.name, a.type
        ORDER BY a.name
      `
      
      const result = await mcpSupabase.executeQuery(query)
      return { success: true, data: result }
    } catch (error) {
      console.error('Get account balances error:', error)
      return { success: false, error }
    }
  }

  // Real-time Operations
  static subscribeToAccountChanges(callback: (payload: any) => void) {
    return realtimeOperations.subscribeToTable('accounts', callback)
  }

  static subscribeToTransactionChanges(callback: (payload: any) => void) {
    return realtimeOperations.subscribeToTable('transactions', callback)
  }

  static subscribeToInventoryChanges(callback: (payload: any) => void) {
    return realtimeOperations.subscribeToTable('inventory', callback)
  }

  // Authentication Operations
  static async signUp(email: string, password: string, userData?: any) {
    return await authOperations.signUp(email, password, userData)
  }

  static async signIn(email: string, password: string) {
    return await authOperations.signIn(email, password)
  }

  static async signOut() {
    return await authOperations.signOut()
  }

  static async getCurrentUser() {
    return await authOperations.getCurrentUser()
  }

  // Database Health and Maintenance
  static async checkDatabaseHealth() {
    return await mcpSupabase.healthCheck()
  }

  static async getDatabaseStats() {
    return await mcpSupabase.getDatabaseStats()
  }

  static async getTableSchema(tableName: string) {
    return await mcpSupabase.getTableSchema(tableName)
  }

  // Backup and Export Operations
  static async exportData(tableName: string, format: 'json' | 'csv' = 'json') {
    try {
      const result = await dbOperations.read(tableName) 
      const data = result || []
      
      if (format === 'csv') {
        // Convert to CSV format
        if (data && data.length > 0) {
          const headers = Object.keys(data[0]).join(',')
          const rows = data.map((row: any) => Object.values(row).join(','))
          return { success: true, data: [headers, ...rows].join('\n'), format: 'csv' }
        }
      }
      
      return { success: true, data, format: 'json' }
    } catch (error) {
      console.error('Export data error:', error)
      return { success: false, error }
    }
  }

  // Advanced Query Operations
  static async executeCustomQuery(sql: string, params?: any[]) {
    try {
      const result = await mcpSupabase.executeQuery(sql, params)
      return { success: true, data: result }
    } catch (error) {
      console.error('Custom query error:', error)
      return { success: false, error }
    }
  }
}

export default SupabaseService