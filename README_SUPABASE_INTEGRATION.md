# Supabase MCP Integration Guide

## Overview

This project now includes comprehensive Supabase integration with Model Context Protocol (MCP) support, working alongside the existing Firebase infrastructure. This dual-database setup provides enhanced flexibility, performance, and reliability.

## 🚀 Features

### Core Integration
- **Supabase Client**: Full PostgreSQL database access
- **MCP Support**: Direct SQL query execution through MCP protocol
- **Real-time Subscriptions**: Live data updates
- **Authentication**: Supabase Auth integration
- **Database Adapter**: Seamless switching between Firebase and Supabase

### Advanced Capabilities
- **Health Monitoring**: Real-time database status checking
- **Fallback System**: Automatic failover between databases
- **Data Synchronization**: Optional sync between Firebase and Supabase
- **Custom Queries**: Direct SQL execution with MCP
- **Export/Import**: Data backup and migration tools

## 📁 File Structure

```
src/
├── lib/
│   ├── supabase.ts              # Supabase configuration and utilities
│   └── databaseAdapter.ts       # Unified database interface
├── services/
│   └── supabaseService.ts       # Comprehensive Supabase operations
└── components/
    └── common/
        └── DatabaseStatus.tsx   # Database health monitoring UI
```

## 🔧 Setup Instructions

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://cmmuemrrsgvjnjnpgycl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# MCP Supabase Configuration
MCP_SUPABASE_PROJECT_REF=cmmuemrrsgvjnjnpgycl
MCP_SUPABASE_ENDPOINT=https://mcp.supabase.com/mcp?project_ref=cmmuemrrsgvjnjnpgycl

# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.cmmuemrrsgvjnjnpgycl.supabase.co:5432/postgres
```

### 2. Get Your Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `cmmuemrrsgvjnjnpgycl`
3. Navigate to Settings > API
4. Copy the following:
   - **Project URL**: Already configured
   - **Anon/Public Key**: Replace `your_supabase_anon_key_here`
   - **Service Role Key**: Replace `your_supabase_service_role_key_here`

### 3. Database Schema Setup

Create the following tables in your Supabase database:

```sql
-- Accounts table
CREATE TABLE accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 0,
  unit_price DECIMAL(10,2),
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table
CREATE TABLE employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  position VARCHAR(100),
  department VARCHAR(100),
  salary DECIMAL(12,2),
  hire_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
CREATE POLICY "Users can view their own data" ON accounts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert their own data" ON accounts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own data" ON accounts FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete their own data" ON accounts FOR DELETE USING (auth.uid() IS NOT NULL);

-- Repeat similar policies for other tables
```

## 💻 Usage Examples

### Basic Operations

```typescript
import SupabaseService from '@/services/supabaseService'
import { dbAdapter } from '@/lib/databaseAdapter'

// Create an account
const result = await SupabaseService.createAccount({
  name: 'Business Checking',
  type: 'asset',
  description: 'Main business account'
})

// Get all accounts
const accounts = await SupabaseService.getAccounts()

// Create a transaction
const transaction = await SupabaseService.createTransaction({
  account_id: 'account-uuid',
  amount: 1500.00,
  type: 'income',
  description: 'Client payment',
  date: '2024-01-15'
})

// Generate financial report
const report = await SupabaseService.generateFinancialReport(
  '2024-01-01',
  '2024-12-31'
)
```

### Using Database Adapter

```typescript
import { dbAdapter } from '@/lib/databaseAdapter'

// Configure to use Supabase as primary
dbAdapter.updateConfig({
  primaryProvider: 'supabase',
  fallbackProvider: 'firebase',
  syncBetweenProviders: true
})

// Operations will now use Supabase first
const result = await dbAdapter.create('accounts', accountData)
```

### Real-time Subscriptions

```typescript
import SupabaseService from '@/services/supabaseService'

// Subscribe to account changes
const subscription = SupabaseService.subscribeToAccountChanges((payload) => {
  console.log('Account changed:', payload)
  // Update your UI here
})

// Unsubscribe when component unmounts
subscription.unsubscribe()
```

### Custom SQL Queries with MCP

```typescript
import { mcpSupabase } from '@/lib/supabase'

// Execute custom SQL
const result = await mcpSupabase.executeQuery(`
  SELECT 
    a.name,
    SUM(t.amount) as total_transactions
  FROM accounts a
  LEFT JOIN transactions t ON a.id = t.account_id
  WHERE t.date >= $1
  GROUP BY a.id, a.name
  ORDER BY total_transactions DESC
`, ['2024-01-01'])
```

## 🔍 Database Health Monitoring

Add the DatabaseStatus component to your dashboard:

```tsx
import DatabaseStatus from '@/components/common/DatabaseStatus'

export default function Dashboard() {
  return (
    <div>
      <DatabaseStatus />
      {/* Your other dashboard content */}
    </div>
  )
}
```

## 🔄 Migration from Firebase

To migrate existing Firebase data to Supabase:

1. **Export Firebase Data**:
```typescript
import { dbAdapter } from '@/lib/databaseAdapter'

// Configure to use Firebase
dbAdapter.updateConfig({ primaryProvider: 'firebase' })

// Export data
const accounts = await dbAdapter.read('accounts')
```

2. **Import to Supabase**:
```typescript
// Configure to use Supabase
dbAdapter.updateConfig({ primaryProvider: 'supabase' })

// Import data
for (const account of accounts.data) {
  await dbAdapter.create('accounts', account)
}
```

## 🛡️ Security Best Practices

1. **Environment Variables**: Never commit actual keys to version control
2. **Row Level Security**: Enable RLS on all tables
3. **API Keys**: Use anon key for client-side, service role for server-side
4. **Policies**: Create appropriate policies based on your auth requirements

## 🚨 Troubleshooting

### Common Issues

1. **Connection Failed**: Check your environment variables
2. **Permission Denied**: Verify RLS policies
3. **MCP Errors**: Ensure your project has MCP enabled
4. **Type Errors**: Check your TypeScript configuration

### Debug Mode

Enable debug logging:

```typescript
// In your component
import { useDatabaseStatus } from '@/components/common/DatabaseStatus'

const { health, checkHealth } = useDatabaseStatus()
console.log('Database health:', health)
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [MCP Protocol Documentation](https://mcp.supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Support

If you encounter issues:

1. Check the database status component
2. Verify environment variables
3. Check Supabase dashboard logs
4. Review console errors

---

**Note**: Remember to replace placeholder values in `.env.local` with your actual Supabase credentials before running the application.