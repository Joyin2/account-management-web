import { supabase } from '@/lib/supabase';
import { notificationService } from './notificationService';

// Employee Interfaces
export interface Employee {
  id?: string;
  // Personal Information
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  marital_status: 'single' | 'married' | 'divorced' | 'widowed';
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  
  // Employment Information
  employee_id: string; // Unique employee identifier
  department: string;
  designation: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'intern';
  work_location: 'office' | 'remote' | 'hybrid';
  reporting_manager?: string; // Employee ID of manager
  
  // Dates
  date_of_joining: string;
  date_of_termination?: string;
  probation_end_date?: string;
  
  // Status
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
  
  // Documents and Personal Details
  documents: {
    aadhar_number?: string;
    pan_number?: string;
    passport_number?: string;
    driving_license?: string;
    bank_account: {
      account_number: string;
      bank_name: string;
      ifsc_code: string;
      account_holder_name: string;
    };
    emergency_contact: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
  };
  
  // Metadata
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

// Salary Structure Interface
export interface SalaryStructure {
  id?: string;
  employee_id: string;
  effective_from: string;
  effective_to?: string;
  
  // Salary Components
  basic_salary: number;
  hra: number; // House Rent Allowance
  da: number; // Dearness Allowance
  conveyance_allowance: number;
  medical_allowance: number;
  special_allowance: number;
  
  // Deductions
  pf: number; // Provident Fund
  esi: number; // Employee State Insurance
  professional_tax: number;
  income_tax: number;
  
  // Calculated Fields
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  
  // Metadata
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Payroll Interface
export interface Payroll {
  id?: string;
  employee_id: string;
  salary_structure_id: string;
  
  // Pay Period
  month: number; // 1-12
  year: number;
  pay_period_start: string;
  pay_period_end: string;
  
  // Attendance Data
  working_days: number;
  present_days: number;
  absent_days: number;
  half_days: number;
  overtime_hours: number;
  
  // Earnings
  basic_salary: number;
  allowances: number;
  overtime_pay: number;
  bonuses: number;
  gross_pay: number;
  
  // Deductions
  pf: number;
  esi: number;
  professional_tax: number;
  income_tax: number;
  loan_deductions: number;
  other_deductions: number;
  total_deductions: number;
  
  // Net Pay
  net_pay: number;
  
  // Status
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  processed_date?: string;
  paid_date?: string;
  
  // Metadata
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  processed_by?: string;
}

// Leave Type Interface
export interface LeaveType {
  id?: string;
  name: string;
  code: string;
  description?: string;
  max_days_per_year: number;
  carry_forward: boolean;
  max_carry_forward_days: number;
  encashable: boolean;
  applicable_after_days: number; // Days after joining when leave becomes applicable
  
  // Metadata
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Leave Balance Interface
export interface LeaveBalance {
  id?: string;
  employee_id: string;
  leave_type_id: string;
  year: number;
  
  // Balance Details
  total_entitled: number;
  used: number;
  pending: number; // Applied but not approved
  available: number;
  carried_forward: number;
  
  // Metadata
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

// Leave Application Interface
export interface LeaveApplication {
  id?: string;
  employee_id: string;
  leave_type_id: string;
  
  // Leave Details
  start_date: string;
  end_date: string;
  total_days: number;
  half_day: boolean;
  reason: string;
  
  // Approval Details
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  applied_date: string;
  approved_by?: string;
  approved_date?: string;
  rejection_reason?: string;
  
  // Metadata
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

// Attendance Interface
export interface Attendance {
  id?: string;
  employee_id: string;
  date: string;
  
  // Time Details
  check_in_time?: string;
  check_out_time?: string;
  total_hours: number;
  overtime_hours: number;
  
  // Status
  status: 'present' | 'absent' | 'half-day' | 'late' | 'on-leave';
  is_late: boolean;
  late_minutes: number;
  
  // Location Details
  check_in_location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  check_out_location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  // Notes
  notes?: string;
  
  // Metadata
  user_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export const employeeService = {
  // Employee Management
  async createEmployee(employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const employee = {
        ...employeeData,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('employees')
        .insert(employee)
        .select('id')
        .single();

      if (error) throw error;

      // Send notification
      await notificationService.sendNotification({
        type: 'employee_created',
        title: 'New Employee Added',
        message: `Employee ${employeeData.first_name} ${employeeData.last_name} has been added to the system.`,
        user_id: employeeData.user_id,
        organization_id: employeeData.organization_id
      });

      return data.id;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async getEmployees(organizationId: string): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id', organizationId)
        .order('first_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  subscribeToEmployees(organizationId: string, callback: (employees: Employee[]) => void): () => void {
    const subscription = supabase
      .channel('employees')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'employees',
          filter: `organization_id=eq.${organizationId}`
        }, 
        () => {
          // Refetch employees when changes occur
          this.getEmployees(organizationId).then(callback);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  async getEmployee(employeeId: string): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      return null;
    }
  },

  async updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<void> {
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  async deleteEmployee(employeeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ status: 'terminated' })
        .eq('id', employeeId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  // Salary Structure Management
  async createSalaryStructure(salaryData: Omit<SalaryStructure, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const salaryStructure = {
        ...salaryData,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('salary_structures')
        .insert(salaryStructure)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating salary structure:', error);
      throw error;
    }
  },

  async getSalaryStructures(employeeId: string): Promise<SalaryStructure[]> {
    try {
      const { data, error } = await supabase
        .from('salary_structures')
        .select('*')
        .eq('employee_id', employeeId)
        .order('effective_from', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching salary structures:', error);
      throw error;
    }
  },

  async getAllSalaryStructures(organizationId: string): Promise<SalaryStructure[]> {
    try {
      const { data, error } = await supabase
        .from('salary_structures')
        .select('*')
        .eq('organization_id', organizationId)
        .order('effective_from', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all salary structures:', error);
      throw error;
    }
  },

  async getActiveSalaryStructure(employeeId: string): Promise<SalaryStructure | null> {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('salary_structures')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('is_active', true)
        .lte('effective_from', currentDate)
        .or(`effective_to.is.null,effective_to.gte.${currentDate}`)
        .order('effective_from', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching active salary structure:', error);
      return null;
    }
  },

  // Payroll Management
  async createPayroll(payrollData: Omit<Payroll, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const payroll = {
        ...payrollData,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('payrolls')
        .insert(payroll)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating payroll:', error);
      throw error;
    }
  },

  async createBatchPayroll(payrollsData: Omit<Payroll, 'id' | 'created_at' | 'updated_at'>[]): Promise<string[]> {
    try {
      const now = new Date().toISOString();
      const payrolls = payrollsData.map(payroll => ({
        ...payroll,
        created_at: now,
        updated_at: now
      }));

      const { data, error } = await supabase
        .from('payrolls')
        .insert(payrolls)
        .select('id');

      if (error) throw error;
      return data.map(item => item.id);
    } catch (error) {
      console.error('Error creating batch payroll:', error);
      throw error;
    }
  },

  async getPayrolls(organizationId: string, month?: number, year?: number): Promise<Payroll[]> {
    try {
      let query = supabase
        .from('payrolls')
        .select('*')
        .eq('organization_id', organizationId);

      if (month !== undefined) {
        query = query.eq('month', month);
      }
      if (year !== undefined) {
        query = query.eq('year', year);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      throw error;
    }
  },

  async getEmployeePayrolls(employeeId: string): Promise<Payroll[]> {
    try {
      const { data, error } = await supabase
        .from('payrolls')
        .select('*')
        .eq('employee_id', employeeId)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching employee payrolls:', error);
      throw error;
    }
  },

  // Leave Type Management
  async createLeaveType(leaveTypeData: Omit<LeaveType, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const leaveType = {
        ...leaveTypeData,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('leave_types')
        .insert(leaveType)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating leave type:', error);
      throw error;
    }
  },

  async getLeaveTypes(organizationId: string): Promise<LeaveType[]> {
    try {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leave types:', error);
      throw error;
    }
  },

  // Leave Balance Management
  async getLeaveBalances(employeeId: string, year: number): Promise<LeaveBalance[]> {
    try {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('year', year);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      throw error;
    }
  },

  async createLeaveBalance(balanceData: Omit<LeaveBalance, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const leaveBalance = {
        ...balanceData,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('leave_balances')
        .insert(leaveBalance)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating leave balance:', error);
      throw error;
    }
  },

  async updateLeaveBalance(balanceId: string, updates: Partial<LeaveBalance>): Promise<void> {
    try {
      const { error } = await supabase
        .from('leave_balances')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', balanceId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating leave balance:', error);
      throw error;
    }
  },

  // Leave Application Management
  async createLeaveApplication(leaveData: Omit<LeaveApplication, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const leaveApplication = {
        ...leaveData,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('leave_applications')
        .insert(leaveApplication)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating leave application:', error);
      throw error;
    }
  },

  async getLeaveApplications(organizationId: string, status?: string): Promise<LeaveApplication[]> {
    try {
      let query = supabase
        .from('leave_applications')
        .select('*')
        .eq('organization_id', organizationId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leave applications:', error);
      throw error;
    }
  },

  async updateLeaveApplication(applicationId: string, updates: Partial<LeaveApplication>): Promise<void> {
    try {
      const { error } = await supabase
        .from('leave_applications')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      // Send notification for status changes
      if (updates.status) {
        const { data: application } = await supabase
          .from('leave_applications')
          .select('employee_id, organization_id')
          .eq('id', applicationId)
          .single();

        if (application) {
          await notificationService.sendNotification({
            type: 'leave_status_updated',
            title: 'Leave Application Updated',
            message: `Your leave application status has been updated to ${updates.status}.`,
            user_id: application.employee_id,
            organization_id: application.organization_id
          });
        }
      }
    } catch (error) {
      console.error('Error updating leave application:', error);
      throw error;
    }
  },

  // Attendance Management
  async createAttendance(attendanceData: Omit<Attendance, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const attendance = {
        ...attendanceData,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('attendance')
        .insert(attendance)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  },

  async getAttendance(employeeId: string, startDate: string, endDate: string): Promise<Attendance[]> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employeeId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  async updateAttendance(attendanceId: string, updates: Partial<Attendance>): Promise<void> {
    try {
      const { error } = await supabase
        .from('attendance')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', attendanceId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  },

  // Analytics and Statistics
  async getEmployeeStats(organizationId: string): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    onLeaveEmployees: number;
    newJoinersThisMonth: number;
  }> {
    try {
      const { data: employees, error } = await supabase
        .from('employees')
        .select('status, date_of_joining')
        .eq('organization_id', organizationId);

      if (error) throw error;

      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.status === 'active').length;
      const onLeaveEmployees = employees.filter(emp => emp.status === 'on-leave').length;
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const newJoinersThisMonth = employees.filter(emp => {
        const joinDate = new Date(emp.date_of_joining);
        return joinDate.getMonth() + 1 === currentMonth && joinDate.getFullYear() === currentYear;
      }).length;

      return {
        totalEmployees,
        activeEmployees,
        onLeaveEmployees,
        newJoinersThisMonth
      };
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        onLeaveEmployees: 0,
        newJoinersThisMonth: 0
      };
    }
  },

  // Real-time Subscriptions
  subscribeToLeaveApplications(organizationId: string, callback: (applications: LeaveApplication[]) => void): () => void {
    const subscription = supabase
      .channel('leave_applications')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'leave_applications',
          filter: `organization_id=eq.${organizationId}`
        }, 
        () => {
          this.getLeaveApplications(organizationId).then(callback);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  subscribeToAttendance(organizationId: string, date: Date, callback: (attendance: Attendance[]) => void): () => void {
    const dateStr = date.toISOString().split('T')[0];
    
    const subscription = supabase
      .channel('attendance')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'attendance',
          filter: `organization_id=eq.${organizationId}`
        }, 
        () => {
          supabase
            .from('attendance')
            .select('*')
            .eq('organization_id', organizationId)
            .eq('date', dateStr)
            .then(({ data }) => callback(data || []));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  subscribeToPayrolls(organizationId: string, month: number, year: number, callback: (payrolls: Payroll[]) => void): () => void {
    const subscription = supabase
      .channel('payrolls')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'payrolls',
          filter: `organization_id=eq.${organizationId}`
        }, 
        () => {
          this.getPayrolls(organizationId, month, year).then(callback);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  // Advanced Analytics
  async getEmployeeAnalytics(organizationId: string): Promise<{
    departmentDistribution: { [key: string]: number };
    salaryDistribution: { range: string; count: number }[];
    attendanceRate: number;
    leaveUtilization: number;
  }> {
    try {
      // Get department distribution
      const { data: employees } = await supabase
        .from('employees')
        .select('department')
        .eq('organization_id', organizationId)
        .eq('status', 'active');

      const departmentDistribution: { [key: string]: number } = {};
      employees?.forEach(emp => {
        departmentDistribution[emp.department] = (departmentDistribution[emp.department] || 0) + 1;
      });

      // Get salary distribution
      const { data: salaries } = await supabase
        .from('salary_structures')
        .select('net_salary')
        .eq('organization_id', organizationId)
        .eq('is_active', true);

      const salaryRanges = [
        { range: '0-25k', min: 0, max: 25000, count: 0 },
        { range: '25k-50k', min: 25000, max: 50000, count: 0 },
        { range: '50k-75k', min: 50000, max: 75000, count: 0 },
        { range: '75k-100k', min: 75000, max: 100000, count: 0 },
        { range: '100k+', min: 100000, max: Infinity, count: 0 }
      ];

      salaries?.forEach(salary => {
        const range = salaryRanges.find(r => salary.net_salary >= r.min && salary.net_salary < r.max);
        if (range) range.count++;
      });

      // Calculate attendance rate (simplified)
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const { data: attendance } = await supabase
        .from('attendance')
        .select('status')
        .eq('organization_id', organizationId)
        .gte('date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`);

      const totalAttendanceRecords = attendance?.length || 0;
      const presentRecords = attendance?.filter(att => att.status === 'present').length || 0;
      const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

      // Calculate leave utilization (simplified)
      const { data: leaveBalances } = await supabase
        .from('leave_balances')
        .select('total_entitled, used')
        .eq('organization_id', organizationId)
        .eq('year', currentYear);

      const totalEntitled = leaveBalances?.reduce((sum, balance) => sum + balance.total_entitled, 0) || 0;
      const totalUsed = leaveBalances?.reduce((sum, balance) => sum + balance.used, 0) || 0;
      const leaveUtilization = totalEntitled > 0 ? (totalUsed / totalEntitled) * 100 : 0;

      return {
        departmentDistribution,
        salaryDistribution: salaryRanges,
        attendanceRate,
        leaveUtilization
      };
    } catch (error) {
      console.error('Error fetching employee analytics:', error);
      return {
        departmentDistribution: {},
        salaryDistribution: [],
        attendanceRate: 0,
        leaveUtilization: 0
      };
    }
  }
};
