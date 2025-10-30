'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Employee, Payroll, Attendance, LeaveApplication } from '@/services/employeeService';
import AdvancedReports from './AdvancedReports';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Download,
  Filter,
  Eye,
  FileText,
  PieChart,
  Activity,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react';

interface EmployeeReportsProps {
  employees: Employee[];
  payrolls: Payroll[];
  attendanceRecords: Attendance[];
  leaveApplications: LeaveApplication[];
}

interface ReportData {
  totalEmployees: number;
  activeEmployees: number;
  totalPayroll: number;
  averageSalary: number;
  attendanceRate: number;
  leaveUtilization: number;
  overtimeHours: number;
  departmentDistribution: { [key: string]: number };
  salaryDistribution: { range: string; count: number }[];
  monthlyTrends: { month: string; employees: number; payroll: number; attendance: number }[];
}

export default function EmployeeReports({
  employees,
  payrolls,
  attendanceRecords,
  leaveApplications
}: EmployeeReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'payroll' | 'attendance' | 'leaves' | 'advanced'>('overview');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

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
    generateReportData();
  }, [employees, payrolls, attendanceRecords, leaveApplications, selectedPeriod]);

  const generateReportData = () => {
    setLoading(true);
    
    try {
      const activeEmployees = employees.filter(emp => emp.status === 'active');
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // Current month payrolls
      const currentPayrolls = payrolls.filter(payroll => 
        payroll.month === currentMonth + 1 && payroll.year === currentYear
      );
      
      // Current month attendance
      const currentAttendance = attendanceRecords.filter(record => {
        const recordDate = safeToDate(record.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
      });
      
      // Calculate metrics
      const totalPayroll = currentPayrolls.reduce((sum, payroll) => sum + payroll.netPay, 0);
      const averageSalary = currentPayrolls.length > 0 ? totalPayroll / currentPayrolls.length : 0;
      
      const totalWorkingDays = currentPayrolls.reduce((sum, payroll) => sum + payroll.workingDays, 0);
      const totalPresentDays = currentPayrolls.reduce((sum, payroll) => sum + payroll.presentDays, 0);
      const attendanceRate = totalWorkingDays > 0 ? (totalPresentDays / totalWorkingDays) * 100 : 0;
      
      const approvedLeaves = leaveApplications.filter(leave => leave.status === 'approved');
      const totalLeaveDays = approvedLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);
      const leaveUtilization = activeEmployees.length > 0 ? totalLeaveDays / activeEmployees.length : 0;
      
      const overtimeHours = currentPayrolls.reduce((sum, payroll) => sum + payroll.overtimeHours, 0);
      
      // Department distribution
      const departmentDistribution: { [key: string]: number } = {};
      activeEmployees.forEach(emp => {
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
        count: currentPayrolls.filter(payroll => 
          payroll.netPay >= range.min && payroll.netPay < range.max
        ).length
      }));
      
      // Monthly trends (last 6 months)
      const monthlyTrends = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthPayrolls = payrolls.filter(p => 
          p.month === date.getMonth() + 1 && p.year === date.getFullYear()
        );
        
        const monthAttendance = attendanceRecords.filter(record => {
          const recordDate = safeToDate(record.date);
          return recordDate.getMonth() === date.getMonth() && recordDate.getFullYear() === date.getFullYear();
        });
        
        monthlyTrends.push({
          month,
          employees: activeEmployees.length,
          payroll: monthPayrolls.reduce((sum, p) => sum + p.netPay, 0),
          attendance: monthAttendance.filter(a => a.status === 'present').length
        });
      }
      
      setReportData({
        totalEmployees: employees.length,
        activeEmployees: activeEmployees.length,
        totalPayroll,
        averageSalary,
        attendanceRate,
        leaveUtilization,
        overtimeHours,
        departmentDistribution,
        salaryDistribution,
        monthlyTrends
      });
    } catch (error) {
      console.error('Error generating report data:', error);
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportToCSV = () => {
    if (!reportData) return;

    const csvData = [
      ['Employee Reports - ' + new Date().toLocaleDateString()],
      [''],
      ['Key Metrics'],
      ['Total Employees', reportData.totalEmployees.toString()],
      ['Active Employees', reportData.activeEmployees.toString()],
      ['Total Payroll', formatCurrency(reportData.totalPayroll)],
      ['Average Salary', formatCurrency(reportData.averageSalary)],
      ['Attendance Rate', formatPercentage(reportData.attendanceRate)],
      ['Leave Utilization', reportData.leaveUtilization.toFixed(1) + ' days/employee'],
      ['Overtime Hours', reportData.overtimeHours.toString()],
      [''],
      ['Department Distribution'],
      ...Object.entries(reportData.departmentDistribution).map(([dept, count]) => [dept, count.toString()]),
      [''],
      ['Salary Distribution'],
      ...reportData.salaryDistribution.map(item => [item.range, item.count.toString()]),
      [''],
      ['Monthly Trends'],
      ['Month', 'Employees', 'Payroll', 'Attendance'],
      ...reportData.monthlyTrends.map(trend => [
        trend.month,
        trend.employees.toString(),
        formatCurrency(trend.payroll),
        trend.attendance.toString()
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employee-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (!reportData) return;

    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .metric { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Employee Management Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>Key Metrics</h2>
            <div class="metrics">
              <div class="metric">
                <h3>Total Employees</h3>
                <p>${reportData.totalEmployees}</p>
              </div>
              <div class="metric">
                <h3>Active Employees</h3>
                <p>${reportData.activeEmployees}</p>
              </div>
              <div class="metric">
                <h3>Total Payroll</h3>
                <p>${formatCurrency(reportData.totalPayroll)}</p>
              </div>
              <div class="metric">
                <h3>Average Salary</h3>
                <p>${formatCurrency(reportData.averageSalary)}</p>
              </div>
              <div class="metric">
                <h3>Attendance Rate</h3>
                <p>${formatPercentage(reportData.attendanceRate)}</p>
              </div>
              <div class="metric">
                <h3>Leave Utilization</h3>
                <p>${reportData.leaveUtilization.toFixed(1)} days/employee</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Department Distribution</h2>
            <table>
              <thead>
                <tr><th>Department</th><th>Employee Count</th></tr>
              </thead>
              <tbody>
                ${Object.entries(reportData.departmentDistribution)
                  .map(([dept, count]) => `<tr><td>${dept}</td><td>${count}</td></tr>`)
                  .join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Monthly Trends</h2>
            <table>
              <thead>
                <tr><th>Month</th><th>Employees</th><th>Payroll</th><th>Attendance</th></tr>
              </thead>
              <tbody>
                ${reportData.monthlyTrends
                  .map(trend => `<tr><td>${trend.month}</td><td>${trend.employees}</td><td>${formatCurrency(trend.payroll)}</td><td>${trend.attendance}</td></tr>`)
                  .join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading || !reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your workforce</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'month' | 'quarter' | 'year')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportToPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalEmployees}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                {reportData.activeEmployees} active
              </p>
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
              <p className="text-sm font-medium text-gray-600">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.totalPayroll)}</p>
              <p className="text-sm text-gray-500 mt-1">
                Avg: {formatCurrency(reportData.averageSalary)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(reportData.attendanceRate)}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Target className="w-4 h-4 mr-1" />
                Target: 95%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm font-medium text-gray-600">Overtime Hours</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overtimeHours.toFixed(1)}</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" />
                This month
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedReport('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedReport === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedReport('payroll')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedReport === 'payroll'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payroll Analysis
            </button>
            <button
              onClick={() => setSelectedReport('attendance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedReport === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Attendance Reports
            </button>
            <button
              onClick={() => setSelectedReport('leaves')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedReport === 'leaves'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leave Analysis
            </button>
            <button
              onClick={() => setSelectedReport('advanced')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedReport === 'advanced'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Advanced Analytics
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedReport === 'overview' && (
          <div className="p-6 space-y-6">
            {/* Department Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Department Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(reportData.departmentDistribution).map(([dept, count]) => {
                    const percentage = (count / reportData.activeEmployees) * 100;
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{dept}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Salary Distribution */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Salary Distribution
                </h3>
                <div className="space-y-3">
                  {reportData.salaryDistribution.map((range) => {
                    const maxCount = Math.max(...reportData.salaryDistribution.map(r => r.count));
                    const percentage = maxCount > 0 ? (range.count / maxCount) * 100 : 0;
                    return (
                      <div key={range.range} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{range.range}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{range.count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Monthly Trends
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-3 text-sm font-medium text-gray-500">Month</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Employees</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Total Payroll</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {reportData.monthlyTrends.map((trend, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="py-3 text-sm font-medium text-gray-900">{trend.month}</td>
                        <td className="py-3 text-sm text-gray-600">{trend.employees}</td>
                        <td className="py-3 text-sm text-gray-600">{formatCurrency(trend.payroll)}</td>
                        <td className="py-3 text-sm text-gray-600">{trend.attendance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Analytics Tab */}
        {selectedReport === 'advanced' && (
          <div className="p-6">
            <AdvancedReports
              employees={employees}
              payrolls={payrolls}
              attendanceRecords={attendanceRecords}
              leaveApplications={leaveApplications}
            />
          </div>
        )}

        {/* Other tabs content */}
        {selectedReport !== 'overview' && selectedReport !== 'advanced' && (
          <div className="p-6">
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {selectedReport === 'payroll' && 'Payroll Analysis'}
                {selectedReport === 'attendance' && 'Attendance Reports'}
                {selectedReport === 'leaves' && 'Leave Analysis'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Detailed {selectedReport} reports and analytics will be displayed here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
