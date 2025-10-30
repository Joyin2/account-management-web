-- Supabase Schema Setup for Account Management System
-- This file creates the necessary tables and RLS policies

-- Create users table for user profiles (separate from auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'employee',
  organization_id TEXT REFERENCES organizations(organization_id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organizations table (if not exists - table already exists with different structure)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  owner_id UUID REFERENCES auth.users(id),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create other necessary tables if they don't exist
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  employee_id VARCHAR(50) UNIQUE,
  department VARCHAR(100),
  designation VARCHAR(100),
  employment_type VARCHAR(50),
  work_location VARCHAR(100),
  reporting_manager VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(20),
  marital_status VARCHAR(20),
  address JSONB DEFAULT '{}',
  date_of_joining DATE,
  probation_end_date DATE,
  salary DECIMAL(12,2),
  user_id UUID REFERENCES auth.users(id),
  organization_id TEXT REFERENCES organizations(organization_id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create leave_balances table
CREATE TABLE IF NOT EXISTS public.leave_balances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL,
  total_days INTEGER DEFAULT 0,
  used_days INTEGER DEFAULT 0,
  remaining_days INTEGER DEFAULT 0,
  year INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  organization_id TEXT REFERENCES organizations(organization_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave_applications table
CREATE TABLE IF NOT EXISTS public.leave_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id),
  organization_id TEXT REFERENCES organizations(organization_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

DROP POLICY IF EXISTS "Users can insert organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can view their organization" ON public.organizations;
DROP POLICY IF EXISTS "Users can update their organization" ON public.organizations;

DROP POLICY IF EXISTS "Users can view employees in their organization" ON public.employees;
DROP POLICY IF EXISTS "Users can insert employees in their organization" ON public.employees;
DROP POLICY IF EXISTS "Users can update employees in their organization" ON public.employees;

DROP POLICY IF EXISTS "Users can view leave balances in their organization" ON public.leave_balances;
DROP POLICY IF EXISTS "Users can insert leave balances in their organization" ON public.leave_balances;
DROP POLICY IF EXISTS "Users can update leave balances in their organization" ON public.leave_balances;

DROP POLICY IF EXISTS "Users can view leave applications in their organization" ON public.leave_applications;
DROP POLICY IF EXISTS "Users can insert leave applications in their organization" ON public.leave_applications;
DROP POLICY IF EXISTS "Users can update leave applications in their organization" ON public.leave_applications;

-- Create RLS policies for users table (UUID = UUID comparisons)
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for organizations table (UUID = UUID comparisons)
CREATE POLICY "Users can insert organizations" ON public.organizations
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can view their organization" ON public.organizations
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    auth.uid() IN (
      SELECT id FROM public.users WHERE organization_id = organizations.organization_id
    )
  );

CREATE POLICY "Users can update their organization" ON public.organizations
  FOR UPDATE USING (auth.uid() = owner_id);

-- Create RLS policies for employees table (TEXT = TEXT comparisons in subqueries)
CREATE POLICY "Users can view employees in their organization" ON public.employees
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert employees in their organization" ON public.employees
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update employees in their organization" ON public.employees
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Create RLS policies for leave_balances table (TEXT = TEXT comparisons in subqueries)
CREATE POLICY "Users can view leave balances in their organization" ON public.leave_balances
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert leave balances in their organization" ON public.leave_balances
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update leave balances in their organization" ON public.leave_balances
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Create RLS policies for leave_applications table (TEXT = TEXT comparisons in subqueries)
CREATE POLICY "Users can view leave applications in their organization" ON public.leave_applications
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert leave applications in their organization" ON public.leave_applications
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update leave applications in their organization" ON public.leave_applications
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON public.users(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_organization_id ON public.employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_balances_employee_id ON public.leave_balances(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_employee_id ON public.leave_applications(employee_id);

-- Add foreign key constraint for users.organization_id (already defined in table creation)
-- ALTER TABLE public.users 
-- ADD CONSTRAINT fk_users_organization_id 
-- FOREIGN KEY (organization_id) REFERENCES public.organizations(organization_id);