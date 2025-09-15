import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch,
  limit,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notificationService } from './notificationService';

// Employee Interfaces
export interface Employee {
  id?: string;
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Timestamp;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Employment Information
  employeeId: string; // Unique employee identifier
  department: string;
  designation: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  workLocation: 'office' | 'remote' | 'hybrid';
  reportingManager?: string; // Employee ID of manager
  
  // Dates
  dateOfJoining: Timestamp;
  dateOfTermination?: Timestamp;
  probationEndDate?: Timestamp;
  
  // Status
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
  
  // Documents
  documents: {
    aadharNumber?: string;
    panNumber?: string;
    passportNumber?: string;
    drivingLicense?: string;
    bankAccount: {
      accountNumber: string;
      bankName: string;
      ifscCode: string;
      accountHolderName: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
  };
  
  // System fields
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
}

// Salary Structure Interface
export interface SalaryStructure {
  id?: string;
  employeeId: string;
  effectiveFrom: Timestamp;
  effectiveTo?: Timestamp;
  
  // Basic Components
  basicSalary: number;
  hra: number; // House Rent Allowance
  da: number; // Dearness Allowance
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  
  // Deductions
  pf: number; // Provident Fund
  esi: number; // Employee State Insurance
  professionalTax: number;
  incomeTax: number;
  
  // Calculated fields
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  
  // System fields
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

// Payroll Interface
export interface Payroll {
  id?: string;
  employeeId: string;
  salaryStructureId: string;
  
  // Period
  month: number; // 1-12
  year: number;
  payPeriodStart: Timestamp;
  payPeriodEnd: Timestamp;
  
  // Attendance data
  workingDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  overtimeHours: number;
  
  // Salary calculations
  basicSalary: number;
  allowances: number;
  overtimePay: number;
  bonuses: number;
  grossPay: number;
  
  // Deductions
  pf: number;
  esi: number;
  professionalTax: number;
  incomeTax: number;
  loanDeductions: number;
  otherDeductions: number;
  totalDeductions: number;
  
  // Final amount
  netPay: number;
  
  // Status
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  processedDate?: Timestamp;
  paidDate?: Timestamp;
  
  // System fields
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  processedBy?: string;
}

// Leave Type Interface
export interface LeaveType {
  id?: string;
  name: string;
  code: string;
  description?: string;
  maxDaysPerYear: number;
  carryForward: boolean;
  maxCarryForwardDays: number;
  encashable: boolean;
  applicableAfterDays: number; // Days after joining when leave becomes applicable
  
  // System fields
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

// Leave Balance Interface
export interface LeaveBalance {
  id?: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  
  // Balance details
  totalEntitled: number;
  used: number;
  pending: number; // Applied but not approved
  available: number;
  carriedForward: number;
  
  // System fields
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Leave Application Interface
export interface LeaveApplication {
  id?: string;
  employeeId: string;
  leaveTypeId: string;
  
  // Leave details
  startDate: Timestamp;
  endDate: Timestamp;
  totalDays: number;
  halfDay: boolean;
  reason: string;
  
  // Approval workflow
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: Timestamp;
  approvedBy?: string;
  approvedDate?: Timestamp;
  rejectionReason?: string;
  
  // System fields
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Attendance Interface
export interface Attendance {
  id?: string;
  employeeId: string;
  date: Timestamp;
  
  // Time tracking
  checkInTime?: Timestamp;
  checkOutTime?: Timestamp;
  totalHours: number;
  overtimeHours: number;
  
  // Status
  status: 'present' | 'absent' | 'half-day' | 'late' | 'on-leave';
  isLate: boolean;
  lateMinutes: number;
  
  // Location (if applicable)
  checkInLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  // Notes
  notes?: string;
  
  // System fields
  userId: string;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collections
const EMPLOYEES_COLLECTION = 'employees';
const SALARY_STRUCTURES_COLLECTION = 'salaryStructures';
const PAYROLLS_COLLECTION = 'payrolls';
const LEAVE_TYPES_COLLECTION = 'leaveTypes';
const LEAVE_BALANCES_COLLECTION = 'leaveBalances';
const LEAVE_APPLICATIONS_COLLECTION = 'leaveApplications';
const ATTENDANCE_COLLECTION = 'attendance';

// Employee Service Functions
export const employeeService = {
  // Employee CRUD Operations
  async createEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const employee: Omit<Employee, 'id'> = {
        ...employeeData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, EMPLOYEES_COLLECTION), employee);
      return docRef.id;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Failed to create employee');
    }
  },

  async getEmployees(organizationId: string): Promise<Employee[]> {
    try {
      // Try the optimized query first
      const q = query(
        collection(db, EMPLOYEES_COLLECTION),
        where('organizationId', '==', organizationId),
        orderBy('firstName', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Employee));
    } catch (error) {
      console.error('Error fetching employees with orderBy:', error);

      // Fallback to simple query without orderBy if index not ready
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.log('Index not ready, using fallback query for employees...');
        try {
          const fallbackQuery = query(
            collection(db, EMPLOYEES_COLLECTION),
            where('organizationId', '==', organizationId)
          );

          const querySnapshot = await getDocs(fallbackQuery);
          const employees = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Employee));

          // Sort manually since we can't use orderBy
          employees.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));
          return employees;
        } catch (fallbackError) {
          console.error('Error with fallback employee query:', fallbackError);
          throw new Error('Failed to fetch employees');
        }
      } else {
        throw new Error('Failed to fetch employees');
      }
    }
  },

  // Real-time subscription for employees
  subscribeToEmployees(organizationId: string, callback: (employees: Employee[]) => void): () => void {
    if (!organizationId) {
      console.error('Organization ID is required for employees subscription');
      return () => {}; // Return empty unsubscribe function
    }

    const q = query(
      collection(db, EMPLOYEES_COLLECTION),
      where('organizationId', '==', organizationId),
      orderBy('firstName', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const employees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Employee));
      callback(employees);
    }, (error) => {
      console.error('Error in employees subscription:', error);
    });
  },

  async getEmployee(employeeId: string): Promise<Employee | null> {
    try {
      const docRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Employee;
      }
      return null;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw new Error('Failed to fetch employee');
    }
  },

  async updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<void> {
    try {
      const docRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('Failed to update employee');
    }
  },

  async deleteEmployee(employeeId: string): Promise<void> {
    try {
      const docRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('Failed to delete employee');
    }
  },

  // Salary Structure Operations
  async createSalaryStructure(salaryData: Omit<SalaryStructure, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const salaryStructure: Omit<SalaryStructure, 'id'> = {
        ...salaryData,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, SALARY_STRUCTURES_COLLECTION), salaryStructure);
      return docRef.id;
    } catch (error) {
      console.error('Error creating salary structure:', error);
      throw new Error('Failed to create salary structure');
    }
  },

  async getSalaryStructures(employeeId: string): Promise<SalaryStructure[]> {
    try {
      const q = query(
        collection(db, SALARY_STRUCTURES_COLLECTION),
        where('employeeId', '==', employeeId),
        orderBy('effectiveFrom', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SalaryStructure));
    } catch (error) {
      console.error('Error fetching salary structures:', error);
      throw new Error('Failed to fetch salary structures');
    }
  },

  async getAllSalaryStructures(organizationId: string): Promise<SalaryStructure[]> {
    try {
      // Try the optimized query first
      const q = query(
        collection(db, SALARY_STRUCTURES_COLLECTION),
        where('organizationId', '==', organizationId),
        orderBy('effectiveFrom', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SalaryStructure));
    } catch (error: any) {
      console.error('Error fetching all salary structures:', error);

      // If it's an index error, try fallback query
      const isIndexError = error.code === 'failed-precondition' &&
        (error.message.includes('index') ||
         error.message.includes('building') ||
         error.message.includes('cannot be used yet'));

      if (isIndexError) {
        console.log('Index not ready (building or missing), trying fallback query for salary structures...');
        try {
          const fallbackQuery = query(
            collection(db, SALARY_STRUCTURES_COLLECTION),
            where('organizationId', '==', organizationId)
          );

          const fallbackSnapshot = await getDocs(fallbackQuery);
          const salaryStructures = fallbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as SalaryStructure));

          // Sort manually by effectiveFrom date
          return salaryStructures.sort((a, b) => {
            const dateA = a.effectiveFrom instanceof Date ? a.effectiveFrom : new Date(a.effectiveFrom.seconds * 1000);
            const dateB = b.effectiveFrom instanceof Date ? b.effectiveFrom : new Date(b.effectiveFrom.seconds * 1000);
            return dateB.getTime() - dateA.getTime();
          });
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          return [];
        }
      }

      return [];
    }
  },

  async getActiveSalaryStructure(employeeId: string): Promise<SalaryStructure | null> {
    try {
      const q = query(
        collection(db, SALARY_STRUCTURES_COLLECTION),
        where('employeeId', '==', employeeId),
        where('isActive', '==', true)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as SalaryStructure;
      }
      return null;
    } catch (error) {
      console.error('Error fetching active salary structure:', error);
      throw new Error('Failed to fetch active salary structure');
    }
  },

  // Payroll Operations
  async createPayroll(payrollData: Omit<Payroll, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const payroll: Omit<Payroll, 'id'> = {
        ...payrollData,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, PAYROLLS_COLLECTION), payroll);
      return docRef.id;
    } catch (error) {
      console.error('Error creating payroll:', error);
      throw new Error('Failed to create payroll');
    }
  },

  // Batch payroll processing
  async createBatchPayroll(payrollsData: Omit<Payroll, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const now = Timestamp.now();
      const docIds: string[] = [];
      const payrollsWithIds: Payroll[] = [];

      payrollsData.forEach((payrollData) => {
        const docRef = doc(collection(db, PAYROLLS_COLLECTION));
        const payroll: Omit<Payroll, 'id'> = {
          ...payrollData,
          createdAt: now,
          updatedAt: now
        };
        batch.set(docRef, payroll);
        docIds.push(docRef.id);
        payrollsWithIds.push({ ...payroll, id: docRef.id });
      });

      await batch.commit();

      // Send notifications to employees about payroll processing
      const notificationPromises = payrollsWithIds.map(payroll =>
        notificationService.notifyPayrollProcessed(
          payroll.employeeId,
          payroll.organizationId,
          payroll
        )
      );

      await Promise.all(notificationPromises);

      return docIds;
    } catch (error) {
      console.error('Error creating batch payroll:', error);
      throw new Error('Failed to create batch payroll');
    }
  },

  async getPayrolls(organizationId: string, month?: number, year?: number): Promise<Payroll[]> {
    try {
      let q = query(
        collection(db, PAYROLLS_COLLECTION),
        where('organizationId', '==', organizationId)
      );

      if (month && year) {
        q = query(q, where('month', '==', month), where('year', '==', year));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Payroll));
    } catch (error: any) {
      console.error('Error fetching payrolls:', error);

      // Check for index-related errors (building, missing, etc.)
      const isIndexError = error.code === 'failed-precondition' &&
        (error.message.includes('index') ||
         error.message.includes('building') ||
         error.message.includes('cannot be used yet') ||
         error.message.includes('currently building'));

      if (isIndexError) {
        console.log('Index not ready for payrolls, trying fallback queries...');

        // Try fallback 1: Remove orderBy
        try {
          let fallbackQuery1 = query(
            collection(db, PAYROLLS_COLLECTION),
            where('organizationId', '==', organizationId)
          );

          if (month && year) {
            fallbackQuery1 = query(fallbackQuery1, where('month', '==', month), where('year', '==', year));
          }

          const fallbackSnapshot1 = await getDocs(fallbackQuery1);
          const payrolls1 = fallbackSnapshot1.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Payroll));

          console.log('Fallback query 1 successful for payrolls, sorting manually');
          return payrolls1.sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt.seconds * 1000);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt.seconds * 1000);
            return dateB.getTime() - dateA.getTime();
          });
        } catch (fallbackError1) {
          console.error('Fallback query 1 failed for payrolls:', fallbackError1);

          // Try fallback 2: Only organizationId filter
          try {
            const fallbackQuery2 = query(
              collection(db, PAYROLLS_COLLECTION),
              where('organizationId', '==', organizationId)
            );

            const fallbackSnapshot2 = await getDocs(fallbackQuery2);
            const allPayrolls = fallbackSnapshot2.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Payroll));

            console.log('Fallback query 2 successful for payrolls, filtering and sorting manually');
            let filteredPayrolls = allPayrolls;

            // Filter by month and year if specified
            if (month && year) {
              filteredPayrolls = allPayrolls.filter(p => p.month === month && p.year === year);
            }

            // Sort manually by createdAt
            return filteredPayrolls.sort((a, b) => {
              const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt.seconds * 1000);
              const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt.seconds * 1000);
              return dateB.getTime() - dateA.getTime();
            });
          } catch (fallbackError2) {
            console.error('All fallback queries failed for payrolls:', fallbackError2);
            return [];
          }
        }
      }

      // For other errors, return empty array
      console.error('Non-index error for payrolls, returning empty array');
      return [];
    }
  },

  async getEmployeePayrolls(employeeId: string): Promise<Payroll[]> {
    try {
      const q = query(
        collection(db, PAYROLLS_COLLECTION),
        where('employeeId', '==', employeeId),
        orderBy('year', 'desc'),
        orderBy('month', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Payroll));
    } catch (error) {
      console.error('Error fetching employee payrolls:', error);
      throw new Error('Failed to fetch employee payrolls');
    }
  },

  // Leave Type Operations
  async createLeaveType(leaveTypeData: Omit<LeaveType, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const leaveType: Omit<LeaveType, 'id'> = {
        ...leaveTypeData,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, LEAVE_TYPES_COLLECTION), leaveType);
      return docRef.id;
    } catch (error) {
      console.error('Error creating leave type:', error);
      throw new Error('Failed to create leave type');
    }
  },

  async getLeaveTypes(organizationId: string): Promise<LeaveType[]> {
    try {
      // Try the optimized query first
      const q = query(
        collection(db, LEAVE_TYPES_COLLECTION),
        where('organizationId', '==', organizationId),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LeaveType));
    } catch (error: any) {
      console.error('Error fetching leave types:', error);

      // Check for index-related errors (building, missing, etc.)
      const isIndexError = error.code === 'failed-precondition' &&
        (error.message.includes('index') ||
         error.message.includes('building') ||
         error.message.includes('cannot be used yet'));

      if (isIndexError) {
        console.log('Index not ready (building or missing), trying fallback queries...');

        // Try fallback 1: Remove orderBy
        try {
          const fallbackQuery1 = query(
            collection(db, LEAVE_TYPES_COLLECTION),
            where('organizationId', '==', organizationId),
            where('isActive', '==', true)
          );

          const fallbackSnapshot1 = await getDocs(fallbackQuery1);
          const leaveTypes1 = fallbackSnapshot1.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as LeaveType));

          console.log('Fallback query 1 successful, sorting manually');
          return leaveTypes1.sort((a, b) => a.name.localeCompare(b.name));
        } catch (fallbackError1) {
          console.error('Fallback query 1 failed:', fallbackError1);

          // Try fallback 2: Only organizationId filter
          try {
            const fallbackQuery2 = query(
              collection(db, LEAVE_TYPES_COLLECTION),
              where('organizationId', '==', organizationId)
            );

            const fallbackSnapshot2 = await getDocs(fallbackQuery2);
            const allLeaveTypes = fallbackSnapshot2.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as LeaveType));

            console.log('Fallback query 2 successful, filtering and sorting manually');
            return allLeaveTypes
              .filter(lt => lt.isActive)
              .sort((a, b) => a.name.localeCompare(b.name));
          } catch (fallbackError2) {
            console.error('Fallback query 2 failed:', fallbackError2);

            // Try fallback 3: Get all documents and filter manually
            try {
              const allDocsSnapshot = await getDocs(collection(db, LEAVE_TYPES_COLLECTION));
              const allDocs = allDocsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              } as LeaveType));

              console.log('Fallback query 3 successful, filtering by organization and active status');
              return allDocs
                .filter(lt => lt.organizationId === organizationId && lt.isActive)
                .sort((a, b) => a.name.localeCompare(b.name));
            } catch (fallbackError3) {
              console.error('All fallback queries failed:', fallbackError3);
              return [];
            }
          }
        }
      }

      // For other errors, return empty array
      console.error('Non-index error, returning empty array');
      return [];
    }
  },

  // Leave Balance Operations
  async getLeaveBalances(employeeId: string, year: number): Promise<LeaveBalance[]> {
    try {
      const q = query(
        collection(db, LEAVE_BALANCES_COLLECTION),
        where('employeeId', '==', employeeId),
        where('year', '==', year)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LeaveBalance));
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      throw new Error('Failed to fetch leave balances');
    }
  },

  async createLeaveBalance(balanceData: Omit<LeaveBalance, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const leaveBalance: Omit<LeaveBalance, 'id'> = {
        ...balanceData,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, LEAVE_BALANCES_COLLECTION), leaveBalance);
      return docRef.id;
    } catch (error) {
      console.error('Error creating leave balance:', error);
      throw new Error('Failed to create leave balance');
    }
  },

  async updateLeaveBalance(balanceId: string, updates: Partial<LeaveBalance>): Promise<void> {
    try {
      const docRef = doc(db, LEAVE_BALANCES_COLLECTION, balanceId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating leave balance:', error);
      throw new Error('Failed to update leave balance');
    }
  },

  // Leave Application Operations
  async createLeaveApplication(leaveData: Omit<LeaveApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const leaveApplication: Omit<LeaveApplication, 'id'> = {
        ...leaveData,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, LEAVE_APPLICATIONS_COLLECTION), leaveApplication);
      return docRef.id;
    } catch (error) {
      console.error('Error creating leave application:', error);
      throw new Error('Failed to create leave application');
    }
  },

  async getLeaveApplications(organizationId: string, status?: string): Promise<LeaveApplication[]> {
    try {
      let q = query(
        collection(db, LEAVE_APPLICATIONS_COLLECTION),
        where('organizationId', '==', organizationId)
      );

      if (status) {
        q = query(q, where('status', '==', status));
      }

      q = query(q, orderBy('appliedDate', 'desc'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LeaveApplication));
    } catch (error) {
      console.error('Error fetching leave applications with orderBy:', error);

      // Fallback to simple query without orderBy if index not ready
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.log('Index not ready, using fallback query for leave applications...');
        try {
          let fallbackQuery = query(
            collection(db, LEAVE_APPLICATIONS_COLLECTION),
            where('organizationId', '==', organizationId)
          );

          if (status) {
            fallbackQuery = query(fallbackQuery, where('status', '==', status));
          }

          const querySnapshot = await getDocs(fallbackQuery);
          const applications = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as LeaveApplication));

          // Sort manually since we can't use orderBy
          applications.sort((a, b) => {
            const dateA = a.appliedDate instanceof Date
              ? a.appliedDate
              : a.appliedDate.toDate ? a.appliedDate.toDate()
              : new Date(a.appliedDate);
            const dateB = b.appliedDate instanceof Date
              ? b.appliedDate
              : b.appliedDate.toDate ? b.appliedDate.toDate()
              : new Date(b.appliedDate);
            return dateB.getTime() - dateA.getTime();
          });

          return applications;
        } catch (fallbackError) {
          console.error('Error with fallback leave applications query:', fallbackError);
          throw new Error('Failed to fetch leave applications');
        }
      } else {
        throw new Error('Failed to fetch leave applications');
      }
    }
  },

  async updateLeaveApplication(applicationId: string, updates: Partial<LeaveApplication>): Promise<void> {
    try {
      // Get the current leave application first
      const docRef = doc(db, LEAVE_APPLICATIONS_COLLECTION, applicationId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Leave application not found');
      }

      const leaveApplication = { id: docSnap.id, ...docSnap.data() } as LeaveApplication;

      // Update the leave application
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });

      // Send notifications based on status change
      if (updates.status === 'approved') {
        await notificationService.notifyLeaveApproval(
          leaveApplication.employeeId,
          leaveApplication.organizationId,
          leaveApplication
        );
      } else if (updates.status === 'rejected') {
        await notificationService.notifyLeaveRejection(
          leaveApplication.employeeId,
          leaveApplication.organizationId,
          leaveApplication,
          updates.rejectionReason
        );
      }
    } catch (error) {
      console.error('Error updating leave application:', error);
      throw new Error('Failed to update leave application');
    }
  },

  // Attendance Operations
  async createAttendance(attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const attendance: Omit<Attendance, 'id'> = {
        ...attendanceData,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, ATTENDANCE_COLLECTION), attendance);
      return docRef.id;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw new Error('Failed to create attendance');
    }
  },

  async getAttendance(employeeId: string, startDate: Timestamp, endDate: Timestamp): Promise<Attendance[]> {
    try {
      const q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where('employeeId', '==', employeeId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Attendance));
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw new Error('Failed to fetch attendance');
    }
  },

  async updateAttendance(attendanceId: string, updates: Partial<Attendance>): Promise<void> {
    try {
      const docRef = doc(db, ATTENDANCE_COLLECTION, attendanceId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw new Error('Failed to update attendance');
    }
  },

  // Utility Functions
  async getEmployeeStats(organizationId: string): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    onLeaveEmployees: number;
    newJoinersThisMonth: number;
  }> {
    try {
      const employees = await this.getEmployees(organizationId);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      return {
        totalEmployees: employees.length,
        activeEmployees: employees.filter(emp => emp.status === 'active').length,
        onLeaveEmployees: employees.filter(emp => emp.status === 'on-leave').length,
        newJoinersThisMonth: employees.filter(emp => {
          if (!emp.dateOfJoining) return false;
          const joiningDate = emp.dateOfJoining instanceof Date
            ? emp.dateOfJoining
            : emp.dateOfJoining.toDate ? emp.dateOfJoining.toDate()
            : new Date(emp.dateOfJoining);
          return joiningDate >= startOfMonth;
        }).length
      };
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      throw new Error('Failed to fetch employee stats');
    }
  },

  // Real-time subscriptions for other entities
  subscribeToLeaveApplications(organizationId: string, callback: (applications: LeaveApplication[]) => void): () => void {
    const q = query(
      collection(db, LEAVE_APPLICATIONS_COLLECTION),
      where('organizationId', '==', organizationId),
      orderBy('appliedDate', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const applications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LeaveApplication));
      callback(applications);
    }, (error) => {
      console.error('Error in leave applications subscription:', error);

      // Fallback to simple query without orderBy if index not ready
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.log('Index not ready, using fallback query for leave applications subscription...');
        const fallbackQuery = query(
          collection(db, LEAVE_APPLICATIONS_COLLECTION),
          where('organizationId', '==', organizationId)
        );

        return onSnapshot(fallbackQuery, (querySnapshot) => {
          const applications = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as LeaveApplication));

          // Sort manually since we can't use orderBy
          applications.sort((a, b) => {
            const dateA = a.appliedDate instanceof Date
              ? a.appliedDate
              : a.appliedDate.toDate ? a.appliedDate.toDate()
              : new Date(a.appliedDate);
            const dateB = b.appliedDate instanceof Date
              ? b.appliedDate
              : b.appliedDate.toDate ? b.appliedDate.toDate()
              : new Date(b.appliedDate);
            return dateB.getTime() - dateA.getTime();
          });

          callback(applications);
        }, (fallbackError) => {
          console.error('Error in fallback leave applications subscription:', fallbackError);
        });
      }
    });
  },

  subscribeToAttendance(organizationId: string, date: Date, callback: (attendance: Attendance[]) => void): () => void {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('organizationId', '==', organizationId),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay))
    );

    return onSnapshot(q, (querySnapshot) => {
      const attendance = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Attendance));
      callback(attendance);
    }, (error) => {
      console.error('Error in attendance subscription:', error);
    });
  },

  subscribeToPayrolls(organizationId: string, month: number, year: number, callback: (payrolls: Payroll[]) => void): () => void {
    const q = query(
      collection(db, PAYROLLS_COLLECTION),
      where('organizationId', '==', organizationId),
      where('month', '==', month),
      where('year', '==', year)
    );

    return onSnapshot(q, (querySnapshot) => {
      const payrolls = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Payroll));
      callback(payrolls);
    }, (error) => {
      console.error('Error in payrolls subscription:', error);
    });
  },

  // Advanced analytics functions
  async getEmployeeAnalytics(organizationId: string): Promise<{
    departmentDistribution: { [key: string]: number };
    salaryDistribution: { range: string; count: number }[];
    attendanceRate: number;
    leaveUtilization: number;
  }> {
    try {
      const employees = await this.getEmployees(organizationId);
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      // Get current month payrolls for salary analysis
      const payrollsQuery = query(
        collection(db, PAYROLLS_COLLECTION),
        where('organizationId', '==', organizationId),
        where('month', '==', currentMonth),
        where('year', '==', currentYear)
      );
      const payrollsSnapshot = await getDocs(payrollsQuery);
      const payrolls = payrollsSnapshot.docs.map(doc => doc.data() as Payroll);

      // Department distribution
      const departmentDistribution: { [key: string]: number } = {};
      employees.forEach(emp => {
        departmentDistribution[emp.department] = (departmentDistribution[emp.department] || 0) + 1;
      });

      // Salary distribution
      const salaryRanges = [
        { range: '0-25k', min: 0, max: 25000 },
        { range: '25k-50k', min: 25000, max: 50000 },
        { range: '50k-75k', min: 50000, max: 75000 },
        { range: '75k-100k', min: 75000, max: 100000 },
        { range: '100k+', min: 100000, max: Infinity }
      ];

      const salaryDistribution = salaryRanges.map(range => ({
        range: range.range,
        count: payrolls.filter(payroll =>
          payroll.netPay >= range.min && payroll.netPay < range.max
        ).length
      }));

      // Calculate attendance rate
      const totalWorkingDays = payrolls.reduce((sum, payroll) => sum + payroll.workingDays, 0);
      const totalPresentDays = payrolls.reduce((sum, payroll) => sum + payroll.presentDays, 0);
      const attendanceRate = totalWorkingDays > 0 ? (totalPresentDays / totalWorkingDays) * 100 : 0;

      // Calculate leave utilization
      const leaveApplicationsQuery = query(
        collection(db, LEAVE_APPLICATIONS_COLLECTION),
        where('organizationId', '==', organizationId),
        where('status', '==', 'approved')
      );
      const leaveSnapshot = await getDocs(leaveApplicationsQuery);
      const approvedLeaves = leaveSnapshot.docs.map(doc => doc.data() as LeaveApplication);
      const totalLeaveDays = approvedLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);
      const leaveUtilization = employees.length > 0 ? totalLeaveDays / employees.length : 0;

      return {
        departmentDistribution,
        salaryDistribution,
        attendanceRate,
        leaveUtilization
      };
    } catch (error) {
      console.error('Error fetching employee analytics:', error);
      throw new Error('Failed to fetch employee analytics');
    }
  }
};
