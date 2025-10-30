import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmmuemrrsgvjnjnpgycl.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtbXVlbXJyc2d2am5qbnBneWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODM2OTEsImV4cCI6MjA2ODU1OTY5MX0.BvCl7vDpgVSYFVhO1W-pBvNmDf1VHTQ3qFzbNTP7h58'

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}
if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// MCP Integration utilities
export const mcpSupabase = {
  // Execute raw SQL queries through MCP
  async executeQuery(sql: string, params?: any[]) {
    try {
      const { data, error } = await supabase.rpc('execute_sql', {
        query: sql,
        parameters: params || []
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('MCP SQL Query Error:', error)
      throw error
    }
  },

  // Get table schema information
  async getTableSchema(tableName: string) {
    try {
      const { data, error } = await supabase
        .from('information_schema.columns')
        .select('*')
        .eq('table_name', tableName)
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Schema fetch error:', error)
      throw error
    }
  },

  // Health check for database connection
  async healthCheck() {
    try {
      const { data, error } = await supabase
        .from('pg_stat_activity')
        .select('count')
        .limit(1)
      
      return { healthy: !error, data }
    } catch (error) {
      return { healthy: false, error }
    }
  },

  // Get database statistics
  async getDatabaseStats() {
    try {
      // Get table count from information_schema
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name', { count: 'exact' })
        .eq('table_schema', 'public')
      
      if (tablesError) {
        console.warn('Could not get table count:', tablesError)
      }

      // Get row counts for each table
      const tableNames = ['transactions', 'partners', 'loans', 'loan_payments', 'inventory', 'leave_applications']
      let totalRows = 0
      
      for (const tableName of tableNames) {
        try {
          const { count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })
          totalRows += count || 0
        } catch (err) {
          console.warn(`Could not get row count for ${tableName}:`, err)
        }
      }

      return {
        table_count: tables?.length || tableNames.length,
        total_rows: totalRows,
        database_size: 'N/A (requires admin access)'
      }
    } catch (error) {
      console.error('Database stats error:', error)
      throw error
    }
  }
}

// Database operation utilities
export const dbOperations = {
  // Generic CRUD operations
  async create(table: string, data: any) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
    
    if (error) throw error
    return result
  },

  async read(table: string, filters?: any) {
    let query = supabase.from(table).select('*')
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async update(table: string, id: string, data: any) {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return result
  },

  async delete(table: string, id: string) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// Real-time subscriptions
export const realtimeOperations = {
  // Subscribe to table changes
  subscribeToTable(table: string, callback: (payload: any) => void) {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to specific row changes
  subscribeToRow(table: string, id: string, callback: (payload: any) => void) {
    return supabase
      .channel(`${table}_${id}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table, filter: `id=eq.${id}` }, 
        callback
      )
      .subscribe()
  }
}

// Authentication utilities
export const authOperations = {
  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }
}

export default supabase