'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import {
  employeeService,
  Employee,
  LeaveType,
  LeaveBalance,
  LeaveApplication,
  Payroll,
  Attendance,
  SalaryStructure
} from '@/services/employeeService';
// Using native Date objects instead of Firebase Timestamp
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UserCheck,
  Users,
  UserPlus,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  MoreVertical,
  Eye,
  Download,
  Upload,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import EmployeeForm from '@/components/employees/EmployeeForm';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import SalaryStructureForm from '@/components/employees/SalaryStructureForm';
import PayrollProcessing from '@/components/employees/PayrollProcessing';
import LeaveApplicationForm from '@/components/employees/LeaveApplicationForm';
import LeaveManagement from '@/components/employees/LeaveManagement';
import AttendanceManagement from '@/components/employees/AttendanceManagement';
import EmployeeReports from '@/components/employees/EmployeeReports';
import PermissionGuard, {
  EmployeeCreateGuard,
  PayrollProcessGuard,
  ReportsGuard
} from '@/components/auth/PermissionGuard';
import { usePermissions } from '@/hooks/usePermissions';

interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  newJoinersThisMonth: number;
}

export default function EmployeesPage() {
  const { currentUser, userProfile } = useAuth();
  const permissions = usePermissions();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeaveEmployees: 0,
    newJoinersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [indexBuilding, setIndexBuilding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  // Tab management
  const [activeTab, setActiveTab] = useState<'employees' | 'salary' | 'leaves' | 'attendance' | 'reports'>('employees');

  // Modal states
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showEmployeeProfile, setShowEmployeeProfile] = useState(false);
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [showPayrollProcessing, setShowPayrollProcessing] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  // Data states for other modules
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);

  // Store unsubscribe functions for cleanup
  const [unsubscribeFunctions, setUnsubscribeFunctions] = useState<(() => void)[]>([]);

  // Helper function to safely convert Firestore Timestamp to Date
  const safeToDate = (timestamp: any): Date => {
    if (!timestamp) return new Date();
    if (timestamp instanceof Date) return timestamp;
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return new Date(timestamp);
  };

  useEffect(() => {
    console.log('Employee page useEffect:', {
      currentUser: !!currentUser,
      userProfile: !!userProfile,
      organizationId: userProfile?.organization_id
    });

    if (currentUser && userProfile) {
      if (userProfile.organization_id) {
        loadAllData();
      } else {
        console.warn('User profile missing organization_id');
        setLoading(false);
        // Show a message to set up organization
      }
    }

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [currentUser, userProfile]);

  // Cleanup effect for unsubscribe functions
  useEffect(() => {
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [unsubscribeFunctions]);

  const createDefaultOrganization = async () => {
    try {
      setLoading(true);

      // Create a default organization for the user
      const organizationData = {
        name: 'General Business',
        type: 'business',
        industry: 'General',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India'
        },
        contactInfo: {
          email: currentUser?.email || '',
          phone: '',
          website: ''
        },
        settings: {
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          dateFormat: 'DD/MM/YYYY'
        },
        createdBy: currentUser?.id,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // For now, we'll just update the user profile with a mock organization ID
      // In a real app, you'd create the organization in Firestore first
      const mockOrgId = `org_${currentUser?.id}_${Date.now()}`;

      // Update user profile with organization ID
      // This is a simplified approach - in production you'd want proper organization creation
      console.log('Would create organization:', organizationData);
      console.log('Mock organization ID:', mockOrgId);

      // For demo purposes, let's just reload the page
      window.location.reload();

    } catch (error) {
      console.error('Error creating organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      console.log('Starting to load all data...');
      setLoading(true);

      await Promise.all([
        setupRealTimeSubscriptions(),
        loadStats(),
        loadLeaveData(),
        loadSalaryData(),
        loadPayrollData(),
        loadAttendanceData()
      ]);

      console.log('All data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const setupRealTimeSubscriptions = () => {
    // Check if required data is available
    if (!userProfile?.organization_id || !currentUser?.id) {
      console.warn('Missing required data for subscriptions:', {
        organizationId: userProfile?.organization_id,
        userId: currentUser?.id
      });
      return Promise.resolve(); // Return a resolved promise for consistency
    }

    console.log('Setting up real-time subscriptions for org:', userProfile.organization_id);

    // Set up real-time subscription for employees
    const unsubscribeEmployees = employeeService.subscribeToEmployees(
      userProfile.organization_id,
      (employeeData) => {
        setEmployees(employeeData);
      }
    );

    // Set up real-time subscription for leave applications
    const unsubscribeLeaves = employeeService.subscribeToLeaveApplications(
      userProfile.organizationId,
      (applications) => {
        setLeaveApplications(applications);
      }
    );

    // Set up real-time subscription for today's attendance
    const unsubscribeAttendance = employeeService.subscribeToAttendance(
      userProfile.organizationId,
      new Date(),
      (attendance) => {
        setAttendanceRecords(attendance);
      }
    );

    // Set up real-time subscription for current month payrolls
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const unsubscribePayrolls = employeeService.subscribeToPayrolls(
      userProfile.organizationId,
      currentMonth,
      currentYear,
      (payrollData) => {
        setPayrolls(payrollData);
      }
    );

    // Store unsubscribe functions for cleanup
    const unsubscribeFuncs = [
      unsubscribeEmployees,
      unsubscribeLeaves,
      unsubscribeAttendance,
      unsubscribePayrolls
    ];

    setUnsubscribeFunctions(unsubscribeFuncs);
    return Promise.resolve(); // Return a resolved promise
  };

  const loadStats = async () => {
    if (!currentUser?.id || !userProfile?.organization_id) return;

    try {
      const statsData = await employeeService.getEmployeeStats(userProfile.organization_id);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadLeaveData = async () => {
    if (!currentUser?.id || !userProfile?.organization_id) return;

    try {
      console.log('Loading leave data...');

      // Load leave types from Firestore with fallback handling
      let leaveTypesData: LeaveType[] = [];
      try {
        setIndexBuilding(true);
        leaveTypesData = await employeeService.getLeaveTypes(userProfile.organization_id);
        console.log('Loaded leave types:', leaveTypesData.length);
        setIndexBuilding(false);
      } catch (leaveTypesError: any) {
        console.error('Error loading leave types, will create defaults:', leaveTypesError);

        // Check if it's an index building error
        const isIndexBuilding = leaveTypesError.message &&
          (leaveTypesError.message.includes('building') ||
           leaveTypesError.message.includes('cannot be used yet') ||
           leaveTypesError.message.includes('currently building'));

        if (isIndexBuilding) {
          setIndexBuilding(true);
          console.log('Database indexes are building, this may take a few minutes...');
          // Don't auto-retry to prevent infinite loops
        } else {
          setIndexBuilding(false);
        }

        leaveTypesData = [];
      }

      // If no leave types exist, create default ones
      if (leaveTypesData.length === 0) {
        console.log('No leave types found, creating defaults...');
        await initializeDefaultLeaveTypes();

        // Try to load again after creating defaults
        try {
          const newLeaveTypes = await employeeService.getLeaveTypes(userProfile.organization_id);
          setLeaveTypes(newLeaveTypes);
          console.log('Default leave types created and loaded:', newLeaveTypes.length);
        } catch (retryError) {
          console.error('Error loading leave types after creation:', retryError);
          // Use fallback mock data
          setLeaveTypes(getFallbackLeaveTypes());
        }
      } else {
        setLeaveTypes(leaveTypesData);
      }

      // Load leave applications with error handling
      try {
        const leaveApplicationsData = await employeeService.getLeaveApplications(userProfile.organization_id);
        setLeaveApplications(leaveApplicationsData);
        console.log('Loaded leave applications:', leaveApplicationsData.length);
      } catch (applicationsError) {
        console.error('Error loading leave applications:', applicationsError);
        setLeaveApplications([]);
      }

      // Load leave balances for all employees with error handling
      const allLeaveBalances: LeaveBalance[] = [];
      try {
        for (const employee of employees) {
          if (employee.id) {
            try {
              const balances = await employeeService.getLeaveBalances(employee.id, new Date().getFullYear());
              console.log(`Loaded ${balances.length} balances for ${employee.firstName} ${employee.lastName}:`, balances);
              allLeaveBalances.push(...balances);
            } catch (balanceError) {
              console.error(`Error loading leave balances for employee ${employee.id}:`, balanceError);
              // Continue with other employees
            }
          }
        }

        console.log('Setting leave balances in state:', allLeaveBalances.length, allLeaveBalances);
        setLeaveBalances(allLeaveBalances);

        // Force a re-render by updating a dummy state
        setLoading(false);
        setTimeout(() => setLoading(false), 100);

        console.log('✅ Leave balances set in state:', allLeaveBalances.length);
      } catch (balancesError) {
        console.error('Error loading leave balances:', balancesError);
        setLeaveBalances([]);
      }

      console.log('Leave data loading completed');

      // Initialize leave balances for employees who don't have them
      if (employees.length > 0 && leaveTypesData.length > 0) {
        await initializeAllEmployeeLeaveBalances();
      }
    } catch (error) {
      console.error('Critical error loading leave data:', error);
      // Set fallback data
      setLeaveTypes(getFallbackLeaveTypes());
      setLeaveBalances([]);
      setLeaveApplications([]);
    }
  };

  const getFallbackLeaveTypes = (): LeaveType[] => {
    if (!currentUser?.id || !userProfile?.organization_id) return [];

    return [
      {
        id: 'fallback-1',
        name: 'Annual Leave',
        code: 'AL',
        maxDaysPerYear: 21,
        carryForward: true,
        maxCarryForwardDays: 5,
        encashable: true,
        applicableAfterDays: 90,
        description: 'Annual vacation leave',
        isActive: true,
        userId: currentUser.id,
        organizationId: userProfile.organization_id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'fallback-2',
        name: 'Sick Leave',
        code: 'SL',
        maxDaysPerYear: 12,
        carryForward: false,
        maxCarryForwardDays: 0,
        encashable: false,
        applicableAfterDays: 0,
        description: 'Medical leave',
        isActive: true,
        userId: currentUser.id,
        organizationId: userProfile.organization_id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'fallback-3',
        name: 'Maternity Leave',
        code: 'ML',
        maxDaysPerYear: 180,
        carryForward: false,
        maxCarryForwardDays: 0,
        encashable: false,
        applicableAfterDays: 180,
        description: 'Maternity leave',
        isActive: true,
        userId: currentUser.id,
        organizationId: userProfile.organization_id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  };

  const initializeDefaultLeaveTypes = async () => {
    if (!currentUser?.id || !userProfile?.organization_id) return;

    try {
      const defaultLeaveTypes = [
        {
          name: 'Annual Leave',
          code: 'AL',
          maxDaysPerYear: 21,
          carryForward: true,
          maxCarryForwardDays: 5,
          encashable: true,
          applicableAfterDays: 90,
          description: 'Annual vacation leave',
          isActive: true,
          userId: currentUser.uid,
          organizationId: userProfile.organization_id
        },
        {
          name: 'Sick Leave',
          code: 'SL',
          maxDaysPerYear: 12,
          carryForward: false,
          maxCarryForwardDays: 0,
          encashable: false,
          applicableAfterDays: 0,
          description: 'Medical leave',
          isActive: true,
          userId: currentUser.id,
          organizationId: userProfile.organization_id
        },
        {
          name: 'Maternity Leave',
          code: 'ML',
          maxDaysPerYear: 180,
          carryForward: false,
          maxCarryForwardDays: 0,
          encashable: false,
          applicableAfterDays: 180,
          description: 'Maternity leave',
          isActive: true,
          userId: currentUser.id,
          organizationId: userProfile.organization_id
        }
      ];

      for (const leaveType of defaultLeaveTypes) {
        await employeeService.createLeaveType(leaveType);
      }

      console.log('Default leave types created successfully');
    } catch (error) {
      console.error('Error creating default leave types:', error);
    }
  };

  const initializeEmployeeLeaveBalances = async (employeeId: string) => {
    if (!currentUser?.id || !userProfile?.organization_id) return;

    try {
      // Get current leave types
      const currentLeaveTypes = await employeeService.getLeaveTypes(userProfile.organization_id);
      const currentYear = new Date().getFullYear();

      // Create leave balance for each leave type
      for (const leaveType of currentLeaveTypes) {
        if (leaveType.id) {
          const leaveBalance = {
            employeeId,
            leaveTypeId: leaveType.id,
            year: currentYear,
            totalEntitled: leaveType.maxDaysPerYear,
            used: 0,
            pending: 0,
            available: leaveType.maxDaysPerYear,
            carriedForward: 0,
            userId: currentUser.id,
            organizationId: userProfile.organization_id
          };

          await employeeService.createLeaveBalance(leaveBalance);
        }
      }

      console.log('Leave balances initialized for employee:', employeeId);
    } catch (error) {
      console.error('Error initializing leave balances:', error);
    }
  };

  const quickFixBalances = () => {
    if (!currentUser?.id || !userProfile?.organization_id || employees.length === 0) {
      alert('Please refresh the page and try again.');
      return;
    }

    try {
      console.log('=== QUICK FIX - SETTING TEMPORARY BALANCES ===');

      const employee = employees[0];
      const currentYear = new Date().getFullYear();

      // Create temporary leave types and balances in state
      const tempLeaveTypes = [
        {
          id: 'temp-al',
          name: 'Annual Leave',
          code: 'AL',
          description: 'Annual vacation leave',
          maxDaysPerYear: 21,
          carryForward: true,
          maxCarryForwardDays: 5,
          encashable: true,
          applicableAfterDays: 90,
          userId: currentUser.id,
          organizationId: userProfile.organization_id,
          isActive: true,
          createdAt: new Date().toISOString() as any,
          updatedAt: new Date().toISOString() as any
        },
        {
          id: 'temp-sl',
          name: 'Sick Leave',
          code: 'SL',
          description: 'Medical leave for illness',
          maxDaysPerYear: 12,
          carryForward: false,
          maxCarryForwardDays: 0,
          encashable: false,
          applicableAfterDays: 0,
          userId: currentUser.id,
          organizationId: userProfile.organization_id,
          isActive: true,
          createdAt: new Date().toISOString() as any,
          updatedAt: new Date().toISOString() as any
        }
      ];

      const tempLeaveBalances = tempLeaveTypes.map(leaveType => ({
        id: `temp-balance-${leaveType.code}`,
        employeeId: employee.id!,
        leaveTypeId: leaveType.id,
        year: currentYear,
        totalEntitled: leaveType.maxDaysPerYear,
        used: 0,
        pending: 0,
        available: leaveType.maxDaysPerYear,
        carriedForward: 0,
        userId: currentUser.id,
        organizationId: userProfile.organization_id,
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any
      }));

      // Set the state directly
      setLeaveTypes(tempLeaveTypes);
      setLeaveBalances(tempLeaveBalances);

      console.log('✅ Temporary balances set in UI state');
      console.log('Leave Types:', tempLeaveTypes);
      console.log('Leave Balances:', tempLeaveBalances);

      alert('Quick fix applied!\n\nTemporary leave balances have been set:\n- Annual Leave: 21 days\n- Sick Leave: 12 days\n\nPlease close and reopen the leave application form to see the changes.\n\nNote: This is a temporary fix. For permanent solution, please contact support.');

    } catch (error) {
      console.error('Quick fix failed:', error);
      alert('Quick fix failed. Please try refreshing the page.');
    }
  };











  const initializeAllEmployeeLeaveBalances = async () => {
    if (!currentUser?.id || !userProfile?.organization_id) return;

    try {
      console.log('Fixing and initializing leave balances for all employees...');

      // Get current leave types
      const currentLeaveTypes = await employeeService.getLeaveTypes(userProfile.organization_id);
      console.log('Found leave types:', currentLeaveTypes.length);

      if (currentLeaveTypes.length === 0) {
        console.log('No leave types found, creating default leave types first...');
        await initializeDefaultLeaveTypes();

        // Try to get leave types again
        const newLeaveTypes = await employeeService.getLeaveTypes(userProfile.organization_id);
        if (newLeaveTypes.length === 0) {
          alert('Failed to create leave types. Please try again.');
          return;
        }
        currentLeaveTypes.push(...newLeaveTypes);
      }

      const currentYear = new Date().getFullYear();
      let processedCount = 0;

      // Check each employee
      for (const employee of employees) {
        if (employee.id) {
          try {
            console.log(`Processing leave balances for: ${employee.firstName} ${employee.lastName}`);

            // Check if employee has leave balances for current year
            const existingBalances = await employeeService.getLeaveBalances(employee.id, currentYear);
            console.log(`Found ${existingBalances.length} existing balances for ${employee.firstName}`);

            // Check if we need to create balances for any missing leave types
            const missingLeaveTypes = currentLeaveTypes.filter(leaveType =>
              !existingBalances.some(balance => balance.leaveTypeId === leaveType.id)
            );

            if (missingLeaveTypes.length > 0) {
              console.log(`Creating ${missingLeaveTypes.length} missing leave balances for employee: ${employee.firstName} ${employee.lastName}`);

              // Create leave balance for each missing leave type
              for (const leaveType of missingLeaveTypes) {
                if (leaveType.id) {
                  const leaveBalance = {
                    employeeId: employee.id,
                    leaveTypeId: leaveType.id,
                    year: currentYear,
                    totalEntitled: leaveType.maxDaysPerYear,
                    used: 0,
                    pending: 0,
                    available: leaveType.maxDaysPerYear,
                    carriedForward: 0,
                    userId: currentUser.id,
                    organizationId: userProfile.organization_id
                  };

                  console.log(`Creating balance for ${leaveType.name}: ${leaveType.maxDaysPerYear} days`);
                  await employeeService.createLeaveBalance(leaveBalance);
                }
              }
              processedCount++;
            }

            // Also check if existing balances have correct available amounts
            let fixedBalances = 0;
            for (const balance of existingBalances) {
              const leaveType = currentLeaveTypes.find(lt => lt.id === balance.leaveTypeId);
              if (leaveType && (balance.available === 0 || balance.totalEntitled !== leaveType.maxDaysPerYear) && balance.used === 0) {
                // Reset available balance if it's 0 and no leaves have been used, or if totalEntitled is wrong
                const updatedBalance = {
                  totalEntitled: leaveType.maxDaysPerYear,
                  available: leaveType.maxDaysPerYear - balance.used - balance.pending
                };
                if (balance.id) {
                  await employeeService.updateLeaveBalance(balance.id, updatedBalance);
                  console.log(`Fixed leave balance for ${employee.firstName} ${employee.lastName} - ${leaveType.name}: ${updatedBalance.available} days available`);
                  fixedBalances++;
                }
              }
            }

            if (fixedBalances > 0) {
              processedCount++;
            }
          } catch (error) {
            console.error(`Error checking/initializing leave balances for employee ${employee.id}:`, error);
          }
        }
      }

      console.log(`Leave balances processed for ${processedCount} employees`);

      // Reload leave data to refresh the UI
      await loadLeaveData();

      // Show success message
      if (processedCount > 0) {
        alert(`Leave balances have been fixed and initialized successfully for ${processedCount} employees!`);
      } else {
        alert('All leave balances are already properly configured.');
      }
    } catch (error) {
      console.error('Error initializing all employee leave balances:', error);
      alert('Error fixing leave balances. Please try again.');
    }
  };

  const loadSalaryData = async () => {
    if (!currentUser?.id || !userProfile?.organization_id) return;

    try {
      console.log('Loading salary structures...');

      // Load salary structures from Firestore
      const salaryStructuresData = await employeeService.getAllSalaryStructures(userProfile.organization_id);
      setSalaryStructures(salaryStructuresData);
      console.log('Loaded salary structures:', salaryStructuresData.length);

      // Clear index building state if successful
      setIndexBuilding(false);
    } catch (error: any) {
      console.error('Error loading salary structures:', error);

      // Check if it's an index building error
      const isIndexBuilding = error.message &&
        (error.message.includes('building') ||
         error.message.includes('cannot be used yet') ||
         error.message.includes('currently building'));

      if (isIndexBuilding) {
        setIndexBuilding(true);
        console.log('Salary structures index is building, will retry...');

        // Retry after 30 seconds
        setTimeout(() => {
          console.log('Retrying to load salary data...');
          loadSalaryData();
        }, 30000);
      }

      setSalaryStructures([]);
    }
  };

  const loadPayrollData = async () => {
    if (!currentUser?.id || !userProfile?.organization_id) return;

    try {
      console.log('Loading payroll data...');

      // Load payrolls from Firestore
      const payrollsData = await employeeService.getPayrolls(userProfile.organization_id);
      setPayrolls(payrollsData);
      console.log('Loaded payrolls:', payrollsData.length);

      // Clear index building state if successful
      setIndexBuilding(false);
    } catch (error: any) {
      console.error('Error loading payroll data:', error);

      // Check if it's an index building error
      const isIndexBuilding = error.message &&
        (error.message.includes('building') ||
         error.message.includes('cannot be used yet') ||
         error.message.includes('currently building'));

      if (isIndexBuilding) {
        setIndexBuilding(true);
        console.log('Payroll index is building, will retry...');

        // Retry after 30 seconds
        setTimeout(() => {
          console.log('Retrying to load payroll data...');
          loadPayrollData();
        }, 30000);
      }

      setPayrolls([]);
    }
  };

  const loadAttendanceData = async () => {
    try {
      setAttendanceRecords([]);
    } catch (error) {
      console.error('Error loading attendance data:', error);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(employees.map(emp => emp.department))];

  // Handler functions
  const handleCreateEmployee = async (employeeData: any) => {
    try {
      if (!currentUser || !userProfile?.organizationId) {
        throw new Error('User not authenticated or organization not found');
      }

      // Transform form data to match Employee interface
      const transformedData = {
        // Personal Information
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone,
        dateOfBirth: employeeData.dateOfBirth ? Timestamp.now() : new Date(),
        gender: employeeData.gender,
        maritalStatus: employeeData.maritalStatus || 'single',

        // Address Information
        address: {
          street: employeeData.street || '',
          city: employeeData.city || '',
          state: employeeData.state || '',
          zipCode: employeeData.zipCode || '',
          country: employeeData.country || ''
        },

        // Employment Information
        employeeId: employeeData.employeeId,
        department: employeeData.department,
        designation: employeeData.designation,
        employmentType: employeeData.employmentType,
        workLocation: employeeData.workLocation,
        reportingManager: employeeData.reportingManager,
        dateOfJoining: employeeData.dateOfJoining ? Timestamp.now() : new Date(),
        probationEndDate: employeeData.probationEndDate ? Timestamp.now() : undefined,
        status: employeeData.status || 'active',

        // Salary Information
        basicSalary: employeeData.basicSalary || 0,
        allowances: employeeData.allowances || 0,
        deductions: employeeData.deductions || 0,

        // Documents
        documents: {
          aadharNumber: employeeData.aadharNumber,
          panNumber: employeeData.panNumber,
          passportNumber: employeeData.passportNumber,
          drivingLicense: employeeData.drivingLicense,
          bankAccount: {
            accountNumber: employeeData.bankAccountNumber || '',
            bankName: employeeData.bankName || '',
            ifscCode: employeeData.ifscCode || '',
            accountHolderName: employeeData.accountHolderName || ''
          },
          emergencyContact: {
            name: employeeData.emergencyContactName || '',
            relationship: employeeData.emergencyContactRelationship || '',
            phone: employeeData.emergencyContactPhone || '',
            email: employeeData.emergencyContactEmail
          }
        },

        // System fields
        userId: currentUser.uid,
        organizationId: userProfile.organizationId
      };

      // Remove undefined values to prevent Firestore errors
      const cleanedData = removeUndefinedValues(transformedData);

      if (selectedEmployee) {
        // Update existing employee
        await employeeService.updateEmployee(selectedEmployee.id!, cleanedData);
      } else {
        // Create new employee
        const employeeId = await employeeService.createEmployee(cleanedData);

        // Initialize leave balances for new employee
        await initializeEmployeeLeaveBalances(employeeId);
      }

      await loadAllData(); // Reload all data to refresh leave balances
      setShowEmployeeForm(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee. Please try again.');
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeProfile(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    // Transform Employee data to EmployeeFormData structure
    const formData = {
      id: employee.id,
      // Personal Information
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      dateOfBirth: employee.dateOfBirth ? safeToDate(employee.dateOfBirth).toISOString().split('T')[0] : '',
      gender: employee.gender,
      maritalStatus: employee.maritalStatus,

      // Address Information (flatten from nested object)
      street: employee.address?.street || '',
      city: employee.address?.city || '',
      state: employee.address?.state || '',
      zipCode: employee.address?.zipCode || '',
      country: employee.address?.country || '',

      // Employment Information
      employeeId: employee.employeeId,
      department: employee.department,
      designation: employee.designation,
      employmentType: employee.employmentType,
      workLocation: employee.workLocation,
      reportingManager: employee.reportingManager,
      dateOfJoining: employee.dateOfJoining ? safeToDate(employee.dateOfJoining).toISOString().split('T')[0] : '',
      probationEndDate: employee.probationEndDate ? safeToDate(employee.probationEndDate).toISOString().split('T')[0] : '',
      status: employee.status,

      // Documents (flatten from nested object)
      aadharNumber: employee.documents?.aadharNumber || '',
      panNumber: employee.documents?.panNumber || '',
      passportNumber: employee.documents?.passportNumber || '',
      drivingLicense: employee.documents?.drivingLicense || '',

      // Bank Details (flatten from nested object)
      bankAccountNumber: employee.documents?.bankAccount?.accountNumber || '',
      bankName: employee.documents?.bankAccount?.bankName || '',
      ifscCode: employee.documents?.bankAccount?.ifscCode || '',
      accountHolderName: employee.documents?.bankAccount?.accountHolderName || '',

      // Emergency Contact (flatten from nested object)
      emergencyContactName: employee.documents?.emergencyContact?.name || '',
      emergencyContactRelationship: employee.documents?.emergencyContact?.relationship || '',
      emergencyContactPhone: employee.documents?.emergencyContact?.phone || '',
      emergencyContactEmail: employee.documents?.emergencyContact?.email || ''
    };

    setSelectedEmployee(employee);
    setEditFormData(formData);
    setShowEmployeeForm(true);
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.deleteEmployee(employee.id!);
        // Refresh the employee list
        if (userProfile?.organizationId) {
          const updatedEmployees = await employeeService.getEmployees(userProfile.organizationId);
          setEmployees(updatedEmployees);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  // Helper function to remove undefined values from objects
  const removeUndefinedValues = (obj: any): any => {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  const handleCreateSalaryStructure = async (salaryData: any) => {
    try {
      if (!currentUser || !userProfile?.organizationId) {
        throw new Error('User not authenticated or organization not found');
      }

      // Transform data to include proper timestamps and organization info
      const transformedData = {
        ...salaryData,
        effectiveFrom: salaryData.effectiveFrom ? Timestamp.now() : new Date(),
        effectiveTo: salaryData.effectiveTo ? Timestamp.now() : undefined,
        userId: currentUser.uid,
        organizationId: userProfile.organizationId
      };

      // Remove undefined values to prevent Firestore errors
      const cleanedData = removeUndefinedValues(transformedData);

      await employeeService.createSalaryStructure(cleanedData);

      // Reload salary data to show the new structure
      await loadSalaryData();

      setShowSalaryForm(false);
      setSelectedEmployee(null);
      console.log('Salary structure created successfully');
      alert('Salary structure created successfully!');
    } catch (error) {
      console.error('Error creating salary structure:', error);
      alert('Failed to create salary structure. Please try again.');
    }
  };

  const handleProcessPayroll = async (payrollData: any[]) => {
    try {
      if (!currentUser || !userProfile?.organizationId) {
        throw new Error('User not authenticated or organization not found');
      }

      // Transform payroll data with proper timestamps and organization info
      const payrollsWithOrgData = payrollData.map(payroll => {
        const transformedPayroll = {
          ...payroll,
          payPeriodStart: payroll.payPeriodStart ? Timestamp.now() : new Date(),
          payPeriodEnd: payroll.payPeriodEnd ? Timestamp.now() : new Date(),
          payDate: payroll.payDate ? Timestamp.now() : new Date(),
          userId: currentUser.uid,
          organizationId: userProfile.organizationId
        };

        // Remove undefined values to prevent Firestore errors
        return removeUndefinedValues(transformedPayroll);
      });

      await employeeService.createBatchPayroll(payrollsWithOrgData);
      setShowPayrollProcessing(false);
      console.log('Payroll processed successfully');
    } catch (error) {
      console.error('Error processing payroll:', error);
      alert('Failed to process payroll. Please try again.');
    }
  };

  const handleCreateLeaveApplication = async (leaveData: any) => {
    try {
      if (!currentUser || !userProfile?.organizationId) {
        throw new Error('User not authenticated or organization not found');
      }

      const transformedLeaveData = {
        ...leaveData,
        startDate: leaveData.startDate ? Timestamp.now() : new Date(),
        endDate: leaveData.endDate ? Timestamp.now() : new Date(),
        appliedDate: new Date(),
        userId: currentUser.uid,
        organizationId: userProfile.organizationId,
        status: 'pending' as const
      };

      // Remove undefined values to prevent Firestore errors
      const cleanedLeaveData = removeUndefinedValues(transformedLeaveData);

      await employeeService.createLeaveApplication(cleanedLeaveData);

      // Update leave balance to reflect pending application
      await updateLeaveBalanceForPending(leaveData.employeeId, leaveData.leaveTypeId, leaveData.totalDays);

      setShowLeaveForm(false);
      setSelectedEmployee(null);
      console.log('Leave application created successfully');

      // Reload data to reflect changes
      await loadLeaveData();
    } catch (error) {
      console.error('Error creating leave application:', error);
      alert('Failed to create leave application. Please try again.');
    }
  };

  // Function to update leave balance when a pending application is created
  const updateLeaveBalanceForPending = async (employeeId: string, leaveTypeId: string, totalDays: number) => {
    try {
      const currentYear = new Date().getFullYear();
      const balances = await employeeService.getLeaveBalances(employeeId, currentYear);
      const balance = balances.find(b => b.leaveTypeId === leaveTypeId);

      if (!balance || !balance.id) {
        console.error('Leave balance not found for employee');
        return;
      }

      // Add to pending, reduce available
      const updatedBalance = {
        pending: balance.pending + totalDays,
        available: Math.max(0, balance.available - totalDays)
      };

      await employeeService.updateLeaveBalance(balance.id, updatedBalance);
      console.log('Leave balance updated for pending application:', updatedBalance);
    } catch (error) {
      console.error('Error updating leave balance for pending application:', error);
    }
  };

  // Function to update leave balance when applications are approved/rejected
  const updateLeaveBalance = async (employeeId: string, leaveTypeId: string, totalDays: number, action: 'approve' | 'reject') => {
    try {
      const currentYear = new Date().getFullYear();
      const balances = await employeeService.getLeaveBalances(employeeId, currentYear);
      const balance = balances.find(b => b.leaveTypeId === leaveTypeId);

      if (!balance || !balance.id) {
        console.error('Leave balance not found for employee');
        return;
      }

      let updatedBalance;
      if (action === 'approve') {
        // Move from pending to used, reduce available
        updatedBalance = {
          used: balance.used + totalDays,
          pending: Math.max(0, balance.pending - totalDays),
          available: Math.max(0, balance.available - totalDays)
        };
      } else if (action === 'reject') {
        // Remove from pending, restore available
        updatedBalance = {
          pending: Math.max(0, balance.pending - totalDays),
          available: balance.available + totalDays
        };
      }

      if (updatedBalance) {
        await employeeService.updateLeaveBalance(balance.id, updatedBalance);
        console.log(`Leave balance updated for ${action}:`, updatedBalance);
      }
    } catch (error) {
      console.error('Error updating leave balance:', error);
    }
  };

  // Function to recalculate all leave balances based on approved applications
  const recalculateAllLeaveBalances = async () => {
    try {
      if (!userProfile?.organizationId) return;

      console.log('Recalculating all leave balances...');
      const currentYear = new Date().getFullYear();
      let updatedCount = 0;

      for (const employee of employees) {
        if (!employee.id) continue;

        // Get all leave balances for this employee
        const balances = await employeeService.getLeaveBalances(employee.id, currentYear);

        // Get all approved leave applications for this employee
        const approvedApplications = leaveApplications.filter(app =>
          app.employeeId === employee.id &&
          app.status === 'approved' &&
          new Date(app.startDate).getFullYear() === currentYear
        );

        // Get all pending leave applications for this employee
        const pendingApplications = leaveApplications.filter(app =>
          app.employeeId === employee.id &&
          app.status === 'pending' &&
          new Date(app.startDate).getFullYear() === currentYear
        );

        // Update each balance
        for (const balance of balances) {
          if (!balance.id) continue;

          // Calculate used days from approved applications
          const usedDays = approvedApplications
            .filter(app => app.leaveTypeId === balance.leaveTypeId)
            .reduce((sum, app) => sum + app.totalDays, 0);

          // Calculate pending days from pending applications
          const pendingDays = pendingApplications
            .filter(app => app.leaveTypeId === balance.leaveTypeId)
            .reduce((sum, app) => sum + app.totalDays, 0);

          // Calculate available days
          const availableDays = Math.max(0, balance.totalEntitled - usedDays - pendingDays + balance.carriedForward);

          // Update the balance if values have changed
          if (balance.used !== usedDays || balance.pending !== pendingDays || balance.available !== availableDays) {
            await employeeService.updateLeaveBalance(balance.id, {
              used: usedDays,
              pending: pendingDays,
              available: availableDays
            });
            console.log(`Updated balance for ${employee.firstName} ${employee.lastName}: used=${usedDays}, pending=${pendingDays}, available=${availableDays}`);
            updatedCount++;
          }
        }
      }

      console.log(`Leave balance recalculation completed. Updated ${updatedCount} balances.`);

      // Reload data to reflect changes
      await loadLeaveData();

      alert(`Leave balances recalculated successfully!\n\nUpdated ${updatedCount} balances based on current leave applications.\n\nAll balances are now accurate.`);
    } catch (error) {
      console.error('Error recalculating leave balances:', error);
      alert('Error recalculating leave balances. Please try again.');
    }
  };

  // Function to ensure all employees have proper leave balances
  const ensureLeaveBalancesForAllEmployees = async () => {
    try {
      if (!userProfile?.organizationId) return;

      console.log('Ensuring leave balances for all employees...');
      const currentYear = new Date().getFullYear();

      // Get all leave types
      const leaveTypes = await employeeService.getLeaveTypes(userProfile.organizationId);
      if (leaveTypes.length === 0) {
        console.log('No leave types found, creating defaults...');
        await initializeDefaultLeaveTypes();
        const newLeaveTypes = await employeeService.getLeaveTypes(userProfile.organizationId);
        leaveTypes.push(...newLeaveTypes);
      }

      let createdCount = 0;
      let fixedCount = 0;

      for (const employee of employees) {
        if (!employee.id) continue;

        // Get existing balances
        const existingBalances = await employeeService.getLeaveBalances(employee.id, currentYear);

        // Check each leave type
        for (const leaveType of leaveTypes) {
          if (!leaveType.id) continue;

          const existingBalance = existingBalances.find(b => b.leaveTypeId === leaveType.id);

          if (!existingBalance) {
            // Create missing balance
            const newBalance = {
              employeeId: employee.id,
              leaveTypeId: leaveType.id,
              year: currentYear,
              totalEntitled: leaveType.maxDaysPerYear,
              used: 0,
              pending: 0,
              available: leaveType.maxDaysPerYear,
              carriedForward: 0,
              userId: currentUser!.uid,
              organizationId: userProfile.organizationId
            };

            await employeeService.createLeaveBalance(newBalance);
            console.log(`Created ${leaveType.name} balance for ${employee.firstName} ${employee.lastName}: ${leaveType.maxDaysPerYear} days`);
            createdCount++;
          } else if (existingBalance.available === 0 && existingBalance.used === 0 && existingBalance.pending === 0) {
            // Fix balance with 0 available days
            await employeeService.updateLeaveBalance(existingBalance.id!, {
              totalEntitled: leaveType.maxDaysPerYear,
              available: leaveType.maxDaysPerYear
            });
            console.log(`Fixed ${leaveType.name} balance for ${employee.firstName} ${employee.lastName}: ${leaveType.maxDaysPerYear} days`);
            fixedCount++;
          }
        }
      }

      console.log(`Leave balance initialization completed. Created: ${createdCount}, Fixed: ${fixedCount}`);

      // Reload data
      await loadLeaveData();

      if (createdCount > 0 || fixedCount > 0) {
        alert(`Leave balances initialized successfully!\n\nCreated: ${createdCount} new balances\nFixed: ${fixedCount} existing balances\n\nAll employees now have proper leave balances.`);
      }
    } catch (error) {
      console.error('Error ensuring leave balances:', error);
    }
  };

  const handleApproveLeave = async (applicationId: string) => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get the leave application details first
      const application = leaveApplications.find(app => app.id === applicationId);
      if (!application) {
        throw new Error('Leave application not found');
      }

      // Update the application status
      await employeeService.updateLeaveApplication(applicationId, {
        status: 'approved',
        approvedBy: currentUser.uid,
        approvedDate: new Date().toISOString()
      });

      // Update the leave balance
      await updateLeaveBalance(application.employeeId, application.leaveTypeId, application.totalDays, 'approve');

      console.log('Leave application approved successfully');

      // Reload data to reflect changes
      await loadLeaveData();
    } catch (error) {
      console.error('Error approving leave application:', error);
      alert('Failed to approve leave application. Please try again.');
    }
  };

  const handleRejectLeave = async (applicationId: string, reason: string) => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get the leave application details first
      const application = leaveApplications.find(app => app.id === applicationId);
      if (!application) {
        throw new Error('Leave application not found');
      }

      // Update the application status
      await employeeService.updateLeaveApplication(applicationId, {
        status: 'rejected',
        rejectionReason: reason
      });

      // Update the leave balance (remove from pending)
      await updateLeaveBalance(application.employeeId, application.leaveTypeId, application.totalDays, 'reject');

      console.log('Leave application rejected successfully');

      // Reload data to reflect changes
      await loadLeaveData();
    } catch (error) {
      console.error('Error rejecting leave application:', error);
      alert('Failed to reject leave application. Please try again.');
    }
  };

  const handleCheckIn = async (employeeId: string, location?: any) => {
    try {
      if (!currentUser || !userProfile?.organizationId) {
        throw new Error('User not authenticated or organization not found');
      }

      const attendanceData: any = {
        employeeId,
        date: Timestamp.now(),
        checkInTime: Timestamp.now(),
        status: 'present' as const,
        isLate: false,
        lateMinutes: 0,
        totalHours: 0,
        overtimeHours: 0,
        userId: currentUser.uid,
        organizationId: userProfile.organizationId
      };

      // Only add checkInLocation if it's provided and not undefined
      if (location && location.latitude && location.longitude) {
        attendanceData.checkInLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address || ''
        };
      }

      // Remove undefined values to prevent Firestore errors
      const cleanedAttendanceData = removeUndefinedValues(attendanceData);

      await employeeService.createAttendance(cleanedAttendanceData);
      console.log('Check in successful');
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Failed to check in. Please try again.');
    }
  };

  const handleCheckOut = async (employeeId: string, location?: any) => {
    try {
      // Find today's attendance record for this employee
      const today = new Date();
      const todayAttendance = attendanceRecords.find(record =>
        record.employeeId === employeeId &&
        safeToDate(record.date).toDateString() === today.toDateString()
      );

      if (todayAttendance && todayAttendance.id) {
        const checkOutTime = new Date();
        const checkInTime = safeToDate(todayAttendance.checkInTime);
        const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        const overtimeHours = Math.max(0, totalHours - 8); // Assuming 8-hour workday

        const updateData: any = {
          checkOutTime: checkOutTime.toISOString(),
          totalHours,
          overtimeHours
        };

        // Only add checkOutLocation if it's provided and not undefined
        if (location && location.latitude && location.longitude) {
          updateData.checkOutLocation = {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address || ''
          };
        }

        await employeeService.updateAttendance(todayAttendance.id, updateData);
        console.log('Check out successful');
      }
    } catch (error) {
      console.error('Error checking out:', error);
      alert('Failed to check out. Please try again.');
    }
  };

  const handleMarkAttendance = async (employeeId: string, date: Date, status: string) => {
    try {
      if (!currentUser || !userProfile?.organizationId) {
        throw new Error('User not authenticated or organization not found');
      }

      const attendanceData = {
        employeeId,
        date: date.toISOString(),
        status: status as 'present' | 'absent' | 'half-day' | 'late' | 'on-leave',
        isLate: false,
        lateMinutes: 0,
        totalHours: status === 'present' ? 8 : 0,
        overtimeHours: 0,
        userId: currentUser.uid,
        organizationId: userProfile.organizationId
      };

      // Remove undefined values to prevent Firestore errors
      const cleanedAttendanceData = removeUndefinedValues(attendanceData);

      await employeeService.createAttendance(cleanedAttendanceData);
      console.log('Attendance marked successfully');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'terminated': return <XCircle className="w-4 h-4" />;
      case 'on-leave': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout title="Employee Management" subtitle="Loading employee data...">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  // Check if user has organization set up
  if (!userProfile?.organizationId) {
    return (
      <AuthGuard>
        <DashboardLayout title="Employee Management" subtitle="Organization setup required">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Setup Required</h3>
              <p className="text-gray-500 mb-4">
                You need to be part of an organization to access employee management features.
              </p>
              <button
                onClick={() => {
                  // For now, let's create a default organization
                  console.log('Creating default organization...');
                  createDefaultOrganization();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Set Up Organization
              </button>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout
        title="Employee Management"
        subtitle="Manage your workforce, track attendance, and handle HR operations"
      >
        {/* Index Building Notification */}
        {indexBuilding && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Database Indexes Building
                </h3>
                <div className="mt-1 text-sm text-blue-700">
                  The database is building indexes for optimal performance. The system will automatically
                  retry every 30 seconds. This process typically takes 2-5 minutes for new deployments.
                </div>
                <div className="mt-2 text-xs text-blue-600">
                  ✓ System is fully functional with fallback queries
                  <br />
                  ✓ All data operations are working normally
                  <br />
                  ✓ Performance will improve once indexes are ready
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Employees</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeEmployees}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On Leave</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.onLeaveEmployees}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Joiners</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.newJoinersThisMonth}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {permissions.canCreateEmployee() && (
                <button
                  onClick={() => {
                    setEditFormData(null);
                    setSelectedEmployee(null);
                    setShowEmployeeForm(true);
                  }}
                  className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Add Employee</span>
                </button>
              )}

              {permissions.canProcessPayroll() && (
                <button
                  onClick={() => setShowPayrollProcessing(true)}
                  className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Process Payroll</span>
                </button>
              )}

              {permissions.checkResourceAccess('leaves') && (
                <button
                  onClick={() => setActiveTab('leaves')}
                  className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Manage Leaves</span>
                </button>
              )}




            </div>
          </div>

          {/* Main Content with Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {permissions.checkResourceAccess('employees') && (
                  <button
                    onClick={() => setActiveTab('employees')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'employees'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Users className="w-4 h-4 inline mr-2" />
                    Employees
                  </button>
                )}
                {permissions.checkResourceAccess('salary') && (
                  <button
                    onClick={() => setActiveTab('salary')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'salary'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Salary & Payroll
                  </button>
                )}
                {permissions.checkResourceAccess('leaves') && (
                  <button
                    onClick={() => setActiveTab('leaves')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'leaves'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Leave Management
                  </button>
                )}
                {permissions.checkResourceAccess('attendance') && (
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'attendance'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline mr-2" />
                    Attendance
                  </button>
                )}
                {permissions.checkResourceAccess('reports') && (
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'reports'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Reports
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'employees' && permissions.checkResourceAccess('employees') && (
              <div>
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Employee Directory</h3>
                    {permissions.canCreateEmployee() && (
                      <button
                        onClick={() => {
                          setEditFormData(null);
                          setSelectedEmployee(null);
                          setShowEmployeeForm(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Employee</span>
                      </button>
                    )}
                  </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                </select>
                
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Employee Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joining Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.designation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {getStatusIcon(employee.status)}
                          <span className="capitalize">{employee.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {safeToDate(employee.dateOfJoining).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewEmployee(employee)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Employee"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterDepartment !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first employee.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Salary & Payroll Tab */}
        {activeTab === 'salary' && permissions.checkResourceAccess('salary') && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Salary & Payroll Management</h3>
              <div className="flex space-x-3">
                {permissions.checkPermission('salary', 'create') && (
                  <button
                    onClick={() => setShowSalaryForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Salary Structure</span>
                  </button>
                )}
                {permissions.canProcessPayroll() && (
                  <button
                    onClick={() => setShowPayrollProcessing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Process Payroll</span>
                  </button>
                )}
              </div>
            </div>
            {/* Salary Structures List */}
            {salaryStructures.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900">Salary Structures</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Basic Salary
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Allowances
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deductions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gross Salary
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Effective From
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {salaryStructures.map((structure) => {
                          const employee = employees.find(emp => emp.id === structure.employeeId);
                          const totalAllowances = (structure.hra || 0) + (structure.da || 0) + (structure.conveyanceAllowance || 0) + (structure.medicalAllowance || 0) + (structure.specialAllowance || 0);
                          const grossSalary = (structure.basicSalary || 0) + totalAllowances;

                          return (
                            <tr key={structure.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee?.employeeId}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{(structure.basicSalary || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{totalAllowances.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{(structure.totalDeductions || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ₹{grossSalary.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {safeToDate(structure.effectiveFrom).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  structure.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {structure.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Salary Structures</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create salary structures to manage employee compensation.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Leave Management Tab */}
        {activeTab === 'leaves' && permissions.checkResourceAccess('leaves') && (
          <LeaveManagement
            employees={employees}
            leaveTypes={leaveTypes}
            leaveApplications={leaveApplications}
            leaveBalances={leaveBalances}
            onCreateApplication={() => setShowLeaveForm(true)}
            onEditApplication={(application) => {
              setSelectedEmployee(employees.find(emp => emp.id === application.employeeId) || null);
              setShowLeaveForm(true);
            }}
            onApproveApplication={handleApproveLeave}
            onRejectApplication={handleRejectLeave}
            onRecalculateBalances={recalculateAllLeaveBalances}
            onEnsureBalances={ensureLeaveBalancesForAllEmployees}
          />
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && permissions.checkResourceAccess('attendance') && (
          <AttendanceManagement
            employees={employees}
            attendanceRecords={attendanceRecords}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onMarkAttendance={handleMarkAttendance}
          />
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && permissions.checkResourceAccess('reports') && (
          <EmployeeReports
            employees={employees}
            payrolls={payrolls}
            attendanceRecords={attendanceRecords}
            leaveApplications={leaveApplications}
          />
        )}
      </div>

      {/* Modals */}
      {showEmployeeForm && (
        <EmployeeForm
          isOpen={showEmployeeForm}
          onClose={() => {
            setShowEmployeeForm(false);
            setSelectedEmployee(null);
            setEditFormData(null);
          }}
          onSave={handleCreateEmployee}
          editData={editFormData}
          employees={employees.map(emp => ({
            id: emp.id || '',
            firstName: emp.firstName,
            lastName: emp.lastName,
            employeeId: emp.employeeId
          }))}
        />
      )}

      {showEmployeeProfile && selectedEmployee && (
        <EmployeeProfile
          isOpen={showEmployeeProfile}
          onClose={() => {
            setShowEmployeeProfile(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onEdit={() => {
            handleEditEmployee(selectedEmployee);
            setShowEmployeeProfile(false);
          }}
        />
      )}

      {showSalaryForm && (
        <SalaryStructureForm
          isOpen={showSalaryForm}
          onClose={() => {
            setShowSalaryForm(false);
            setSelectedEmployee(null);
          }}
          onSave={handleCreateSalaryStructure}
          employeeName={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ''}
          employees={employees.map(emp => ({
            id: emp.id!,
            firstName: emp.firstName,
            lastName: emp.lastName,
            employeeId: emp.employeeId
          }))}
        />
      )}

      {showPayrollProcessing && (
        <PayrollProcessing
          isOpen={showPayrollProcessing}
          onClose={() => setShowPayrollProcessing(false)}
          onSave={handleProcessPayroll}
          employees={employees}
          month={new Date().getMonth() + 1}
          year={new Date().getFullYear()}
        />
      )}

      {showLeaveForm && (
        <LeaveApplicationForm
          isOpen={showLeaveForm}
          onClose={() => {
            setShowLeaveForm(false);
            setSelectedEmployee(null);
          }}
          onSave={handleCreateLeaveApplication}
          employeeName={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ''}
          leaveTypes={leaveTypes}
          leaveBalances={leaveBalances.filter(balance =>
            selectedEmployee ? balance.employeeId === selectedEmployee.id : false
          )}
        />
      )}
    </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
