'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Employee, Payroll, SalaryStructure } from '@/services/employeeService';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {
  X,
  Save,
  DollarSign,
  Calculator,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Send,
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  FileText,
  FileSpreadsheet
} from 'lucide-react';

interface PayrollProcessingProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payrolls: Partial<Payroll>[]) => void;
  employees: Employee[];
  month: number;
  year: number;
}

interface EmployeePayrollData {
  employee: Employee;
  salaryStructure?: SalaryStructure;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  overtimeHours: number;
  bonuses: number;
  loanDeductions: number;
  otherDeductions: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  selected: boolean;
}

export default function PayrollProcessing({
  isOpen,
  onClose,
  onSave,
  employees,
  month,
  year
}: PayrollProcessingProps) {
  const [payrollData, setPayrollData] = useState<EmployeePayrollData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  const [processingStep, setProcessingStep] = useState<'review' | 'processing' | 'complete'>('review');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (isOpen && employees.length > 0) {
      initializePayrollData();
    }
  }, [isOpen, employees, month, year]);

  const initializePayrollData = () => {
    const workingDaysInMonth = getWorkingDaysInMonth(year, month - 1);
    
    const initialData: EmployeePayrollData[] = employees
      .filter(emp => emp.status === 'active')
      .map(employee => {
        // Mock salary structure - in real app, fetch from service
        const mockSalaryStructure: SalaryStructure = {
          employeeId: employee.id!,
          effectiveFrom: employee.dateOfJoining.toDate().toISOString(),
          basicSalary: 50000,
          hra: 20000,
          da: 5000,
          conveyanceAllowance: 2000,
          medicalAllowance: 1500,
          specialAllowance: 1500,
          pf: 6000,
          esi: 375,
          professionalTax: 200,
          incomeTax: 5000,
          grossSalary: 80000,
          totalDeductions: 11575,
          netSalary: 68425,
          userId: employee.userId,
          organizationId: employee.organizationId,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
          isActive: true
        };

        const presentDays = workingDaysInMonth; // Default to full attendance
        const absentDays = 0;
        const halfDays = 0;
        const overtimeHours = 0;
        const bonuses = 0;
        const loanDeductions = 0;
        const otherDeductions = 0;

        // Calculate pro-rated salary based on attendance
        const attendanceRatio = presentDays / workingDaysInMonth;
        const grossPay = Math.round(mockSalaryStructure.grossSalary * attendanceRatio);
        const totalDeductions = Math.round(mockSalaryStructure.totalDeductions * attendanceRatio);
        const netPay = grossPay - totalDeductions;

        return {
          employee,
          salaryStructure: mockSalaryStructure,
          workingDays: workingDaysInMonth,
          presentDays,
          absentDays,
          halfDays,
          overtimeHours,
          bonuses,
          loanDeductions,
          otherDeductions,
          grossPay,
          totalDeductions,
          netPay,
          status: 'draft' as const,
          selected: true
        };
      });

    setPayrollData(initialData);
  };

  const getWorkingDaysInMonth = (year: number, month: number): number => {
    const date = new Date(year, month, 1);
    let workingDays = 0;
    
    while (date.getMonth() === month) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        workingDays++;
      }
      date.setDate(date.getDate() + 1);
    }
    
    return workingDays;
  };

  const updateEmployeePayroll = (index: number, field: string, value: any) => {
    setPayrollData(prev => {
      const updated = [...prev];
      const employee = updated[index];
      
      // Update the field
      (employee as any)[field] = value;
      
      // Recalculate if attendance or other factors change
      if (['presentDays', 'absentDays', 'halfDays', 'overtimeHours', 'bonuses', 'loanDeductions', 'otherDeductions'].includes(field)) {
        const attendanceRatio = employee.presentDays / employee.workingDays;
        const baseGrossPay = employee.salaryStructure ? employee.salaryStructure.grossSalary * attendanceRatio : 0;
        const overtimePay = employee.overtimeHours * 200; // ₹200 per hour overtime
        
        employee.grossPay = Math.round(baseGrossPay + overtimePay + employee.bonuses);
        employee.totalDeductions = Math.round(
          (employee.salaryStructure ? employee.salaryStructure.totalDeductions * attendanceRatio : 0) +
          employee.loanDeductions +
          employee.otherDeductions
        );
        employee.netPay = employee.grossPay - employee.totalDeductions;
      }
      
      return updated;
    });
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setPayrollData(prev => prev.map(emp => ({ ...emp, selected: newSelectAll })));
  };

  const toggleEmployeeSelection = (index: number) => {
    setPayrollData(prev => {
      const updated = [...prev];
      updated[index].selected = !updated[index].selected;
      return updated;
    });
  };

  const processPayroll = async () => {
    setProcessingStep('processing');
    setLoading(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedPayrolls = payrollData
        .filter(emp => emp.selected)
        .map(emp => ({
          employeeId: emp.employee.id!,
          salaryStructureId: emp.salaryStructure?.id || '',
          month,
          year,
          payPeriodStart: new Date(year, month - 1, 1).toISOString(),
          payPeriodEnd: new Date(year, month, 0).toISOString(),
          workingDays: emp.workingDays,
          presentDays: emp.presentDays,
          absentDays: emp.absentDays,
          halfDays: emp.halfDays,
          overtimeHours: emp.overtimeHours,
          basicSalary: emp.salaryStructure?.basicSalary || 0,
          allowances: (emp.salaryStructure?.hra || 0) + (emp.salaryStructure?.da || 0) + 
                     (emp.salaryStructure?.conveyanceAllowance || 0) + (emp.salaryStructure?.medicalAllowance || 0) + 
                     (emp.salaryStructure?.specialAllowance || 0),
          overtimePay: emp.overtimeHours * 200,
          bonuses: emp.bonuses,
          grossPay: emp.grossPay,
          pf: emp.salaryStructure?.pf || 0,
          esi: emp.salaryStructure?.esi || 0,
          professionalTax: emp.salaryStructure?.professionalTax || 0,
          incomeTax: emp.salaryStructure?.incomeTax || 0,
          loanDeductions: emp.loanDeductions,
          otherDeductions: emp.otherDeductions,
          totalDeductions: emp.totalDeductions,
          netPay: emp.netPay,
          status: 'processed' as const,
          userId: emp.employee.userId,
          organizationId: emp.employee.organizationId
        }));

      onSave(selectedPayrolls);
      setProcessingStep('complete');
    } catch (error) {
      console.error('Error processing payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generatePayslipPDF = (empData: EmployeePayrollData) => {
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica');

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Your Company Name', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Salary Slip for ${monthNames[month - 1]} ${year}`, 105, 30, { align: 'center' });

    // Line under header
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Employee Information
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);

    // Left column
    doc.text('Employee Name:', 20, 50);
    doc.text(`${empData.employee.firstName} ${empData.employee.lastName}`, 60, 50);

    doc.text('Employee ID:', 20, 60);
    doc.text(empData.employee.employeeId || 'N/A', 60, 60);

    doc.text('Department:', 20, 70);
    doc.text(empData.employee.department || 'N/A', 60, 70);

    doc.text('Designation:', 20, 80);
    doc.text(empData.employee.designation || 'N/A', 60, 80);

    // Right column
    doc.text('Pay Period:', 120, 50);
    doc.text(`${monthNames[month - 1]} ${year}`, 150, 50);

    doc.text('Working Days:', 120, 60);
    doc.text(empData.workingDays.toString(), 150, 60);

    doc.text('Present Days:', 120, 70);
    doc.text(empData.presentDays.toString(), 150, 70);

    doc.text('Date of Joining:', 120, 80);
    const joiningDate = empData.employee.dateOfJoining
      ? empData.employee.dateOfJoining.toDate().toLocaleDateString()
      : 'N/A';
    doc.text(joiningDate, 150, 80);

    // Salary Table Header
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Earnings', 25, 100);
    doc.text('Amount (₹)', 70, 100);
    doc.text('Deductions', 105, 100);
    doc.text('Amount (₹)', 150, 100);

    // Line under table header
    doc.line(20, 105, 190, 105);

    // Salary Details
    doc.setFontSize(10);
    let yPos = 115;

    // Earnings and Deductions
    const earnings = [
      ['Basic Salary', empData.salaryStructure?.basicSalary || 0],
      ['HRA', empData.salaryStructure?.hra || 0],
      ['Dearness Allowance', empData.salaryStructure?.da || 0],
      ['Conveyance Allowance', empData.salaryStructure?.conveyanceAllowance || 0],
      ['Medical Allowance', empData.salaryStructure?.medicalAllowance || 0],
      ['Special Allowance', empData.salaryStructure?.specialAllowance || 0],
      ['Overtime Pay', empData.overtimeHours * 200],
      ['Bonuses', empData.bonuses]
    ];

    const deductions = [
      ['Provident Fund', empData.salaryStructure?.pf || 0],
      ['ESI', empData.salaryStructure?.esi || 0],
      ['Professional Tax', empData.salaryStructure?.professionalTax || 0],
      ['Income Tax', empData.salaryStructure?.incomeTax || 0],
      ['Loan Deductions', empData.loanDeductions],
      ['Other Deductions', empData.otherDeductions]
    ];

    const maxRows = Math.max(earnings.length, deductions.length);

    for (let i = 0; i < maxRows; i++) {
      if (i < earnings.length) {
        doc.text(earnings[i][0], 25, yPos);
        doc.text((earnings[i][1] as number).toLocaleString(), 70, yPos);
      }

      if (i < deductions.length) {
        doc.text(deductions[i][0], 105, yPos);
        doc.text((deductions[i][1] as number).toLocaleString(), 150, yPos);
      }

      yPos += 10;
    }

    // Total line
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Totals
    doc.setFontSize(11);
    doc.text('Gross Earnings', 25, yPos);
    doc.text(empData.grossPay.toLocaleString(), 70, yPos);
    doc.text('Total Deductions', 105, yPos);
    doc.text(empData.totalDeductions.toLocaleString(), 150, yPos);

    yPos += 15;

    // Net Pay
    doc.setFontSize(12);
    doc.setTextColor(0, 100, 0);
    doc.text('Net Pay', 25, yPos);
    doc.text(`₹${empData.netPay.toLocaleString()}`, 70, yPos);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated payslip and does not require a signature.', 105, 270, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 280, { align: 'center' });

    // Save the PDF
    doc.save(`Payslip_${empData.employee.firstName}_${empData.employee.lastName}_${monthNames[month - 1]}_${year}.pdf`);
  };

  const generateIndividualExcel = (empData: EmployeePayrollData) => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Prepare individual employee data for Excel
    const employeeData = [
      ['Employee Information', ''],
      ['Employee Name', `${empData.employee.firstName} ${empData.employee.lastName}`],
      ['Employee ID', empData.employee.employeeId || 'N/A'],
      ['Department', empData.employee.department || 'N/A'],
      ['Position', empData.employee.designation || 'N/A'],
      ['Pay Period', `${monthNames[month - 1]} ${year}`],
      ['Date of Joining', empData.employee.dateOfJoining ? empData.employee.dateOfJoining.toDate().toLocaleDateString() : 'N/A'],
      ['', ''],
      ['Attendance Details', ''],
      ['Working Days', empData.workingDays],
      ['Present Days', empData.presentDays],
      ['Absent Days', empData.absentDays],
      ['Half Days', empData.halfDays],
      ['Overtime Hours', empData.overtimeHours],
      ['', ''],
      ['Earnings', 'Amount (₹)'],
      ['Basic Salary', empData.salaryStructure?.basicSalary || 0],
      ['HRA', empData.salaryStructure?.hra || 0],
      ['Dearness Allowance', empData.salaryStructure?.da || 0],
      ['Conveyance Allowance', empData.salaryStructure?.conveyanceAllowance || 0],
      ['Medical Allowance', empData.salaryStructure?.medicalAllowance || 0],
      ['Special Allowance', empData.salaryStructure?.specialAllowance || 0],
      ['Overtime Pay', empData.overtimeHours * 200],
      ['Bonuses', empData.bonuses],
      ['Gross Pay', empData.grossPay],
      ['', ''],
      ['Deductions', 'Amount (₹)'],
      ['Provident Fund', empData.salaryStructure?.pf || 0],
      ['ESI', empData.salaryStructure?.esi || 0],
      ['Professional Tax', empData.salaryStructure?.professionalTax || 0],
      ['Income Tax', empData.salaryStructure?.incomeTax || 0],
      ['Loan Deductions', empData.loanDeductions],
      ['Other Deductions', empData.otherDeductions],
      ['Total Deductions', empData.totalDeductions],
      ['', ''],
      ['Net Pay', empData.netPay]
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(employeeData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Payslip');

    // Save the file
    XLSX.writeFile(wb, `Payslip_${empData.employee.firstName}_${empData.employee.lastName}_${monthNames[month - 1]}_${year}.xlsx`);
  };

  const generatePayrollExcel = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Prepare data for Excel
    const excelData = selectedEmployees.map(empData => ({
      'Employee Name': `${empData.employee.firstName} ${empData.employee.lastName}`,
      'Employee ID': empData.employee.employeeId || 'N/A',
      'Department': empData.employee.department || 'N/A',
      'Position': empData.employee.designation || 'N/A',
      'Working Days': empData.workingDays,
      'Present Days': empData.presentDays,
      'Absent Days': empData.absentDays,
      'Half Days': empData.halfDays,
      'Overtime Hours': empData.overtimeHours,
      'Basic Salary': empData.salaryStructure?.basicSalary || 0,
      'HRA': empData.salaryStructure?.hra || 0,
      'DA': empData.salaryStructure?.da || 0,
      'Conveyance Allowance': empData.salaryStructure?.conveyanceAllowance || 0,
      'Medical Allowance': empData.salaryStructure?.medicalAllowance || 0,
      'Special Allowance': empData.salaryStructure?.specialAllowance || 0,
      'Overtime Pay': empData.overtimeHours * 200,
      'Bonuses': empData.bonuses,
      'Gross Pay': empData.grossPay,
      'PF': empData.salaryStructure?.pf || 0,
      'ESI': empData.salaryStructure?.esi || 0,
      'Professional Tax': empData.salaryStructure?.professionalTax || 0,
      'Income Tax': empData.salaryStructure?.incomeTax || 0,
      'Loan Deductions': empData.loanDeductions,
      'Other Deductions': empData.otherDeductions,
      'Total Deductions': empData.totalDeductions,
      'Net Pay': empData.netPay
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Payroll Data');

    // Save the file
    XLSX.writeFile(wb, `Payroll_${monthNames[month - 1]}_${year}.xlsx`);
  };

  const downloadAllPayslips = async () => {
    try {
      // Add a small delay between downloads to prevent browser blocking
      for (let i = 0; i < selectedEmployees.length; i++) {
        const empData = selectedEmployees[i];
        generatePayslipPDF(empData);

        // Add delay between downloads
        if (i < selectedEmployees.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // No alert needed - the modal already shows completion status
      console.log(`${selectedEmployees.length} payslips downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading payslips:', error);
      // No alert needed - errors can be shown in the modal or console
    }
  };

  const selectedEmployees = payrollData.filter(emp => emp.selected);
  const totalGrossPay = selectedEmployees.reduce((sum, emp) => sum + emp.grossPay, 0);
  const totalDeductions = selectedEmployees.reduce((sum, emp) => sum + emp.totalDeductions, 0);
  const totalNetPay = selectedEmployees.reduce((sum, emp) => sum + emp.netPay, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Process Payroll - {monthNames[month - 1]} {year}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedEmployees.length} of {payrollData.length} employees selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {processingStep === 'review' && (
          <>
            {/* Summary Cards */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Employees</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{selectedEmployees.length}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Gross Pay</span>
                  </div>
                  <p className="text-lg font-bold text-green-900 mt-1">{formatCurrency(totalGrossPay)}</p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Deductions</span>
                  </div>
                  <p className="text-lg font-bold text-red-900 mt-1">{formatCurrency(totalDeductions)}</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Net Pay</span>
                  </div>
                  <p className="text-lg font-bold text-purple-900 mt-1">{formatCurrency(totalNetPay)}</p>
                </div>
              </div>
            </div>

            {/* Employee List */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Select All</label>
                </div>
                
                <button
                  onClick={processPayroll}
                  disabled={selectedEmployees.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Process Payroll</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime Hrs</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonuses</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payrollData.map((empData, index) => (
                      <tr key={empData.employee.id} className={empData.selected ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={empData.selected}
                            onChange={() => toggleEmployeeSelection(index)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {empData.employee.firstName.charAt(0)}{empData.employee.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {empData.employee.firstName} {empData.employee.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{empData.employee.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={empData.presentDays}
                            onChange={(e) => updateEmployeePayroll(index, 'presentDays', parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            max={empData.workingDays}
                          />
                          <span className="text-xs text-gray-500 ml-1">/ {empData.workingDays}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={empData.overtimeHours}
                            onChange={(e) => updateEmployeePayroll(index, 'overtimeHours', parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            step="0.5"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={empData.bonuses}
                            onChange={(e) => updateEmployeePayroll(index, 'bonuses', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatCurrency(empData.grossPay)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          {formatCurrency(empData.totalDeductions)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                          {formatCurrency(empData.netPay)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                generatePayslipPDF(empData);
                              }}
                              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              title="Download PDF Payslip"
                            >
                              <FileText className="w-4 h-4" />
                              <span className="text-xs">PDF</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                generateIndividualExcel(empData);
                              }}
                              className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                              title="Download Excel Payslip"
                            >
                              <FileSpreadsheet className="w-4 h-4" />
                              <span className="text-xs">Excel</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {processingStep === 'processing' && (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payroll...</h3>
            <p className="text-gray-600">Please wait while we process the payroll for {selectedEmployees.length} employees.</p>
          </div>
        )}

        {processingStep === 'complete' && (
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payroll Processed Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Payroll for {selectedEmployees.length} employees has been processed for {monthNames[month - 1]} {year}.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  downloadAllPayslips();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Download PDF Payslips</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  generatePayrollExcel();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Download Excel</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
