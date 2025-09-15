'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { employeeService, Employee, Payroll, Attendance, LeaveApplication } from '@/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';

interface AdvancedReportsProps {
  employees: Employee[];
  payrolls: Payroll[];
  attendanceRecords: Attendance[];
  leaveApplications: LeaveApplication[];
}

interface AnalyticsData {
  departmentDistribution: { [key: string]: number };
  salaryDistribution: { range: string; count: number }[];
  attendanceRate: number;
  leaveUtilization: number;
  monthlyTrends: {
    month: string;
    employees: number;
    payroll: number;
    attendance: number;
  }[];
}

export default function AdvancedReports({
  employees,
  payrolls,
  attendanceRecords,
  leaveApplications
}: AdvancedReportsProps) {
  const { userProfile } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod, selectedDepartment]);

  const loadAnalytics = async () => {
    if (!userProfile) return;

    try {
      setLoading(true);
      const analyticsData = await employeeService.getEmployeeAnalytics(userProfile.organizationId);
      
      // Generate monthly trends (mock data for demo)
      const monthlyTrends = generateMonthlyTrends();
      
      setAnalytics({
        ...analyticsData,
        monthlyTrends
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      employees: employees.length + Math.floor(Math.random() * 10) - 5,
      payroll: (payrolls.length * 50000) + Math.floor(Math.random() * 100000),
      attendance: 85 + Math.floor(Math.random() * 15)
    }));
  };

  const getDepartments = () => {
    const departments = [...new Set(employees.map(emp => emp.department))];
    return departments.filter(Boolean);
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    // In a real implementation, this would generate and download the report
    console.log(`Exporting report as ${format}`);
    alert(`Report export as ${format.toUpperCase()} would be implemented here`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics</h3>
          <p className="text-sm text-gray-500">Comprehensive insights and reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {getDepartments().map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <button
            onClick={loadAnalytics}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Employees</p>
              <p className="text-2xl font-bold">{employees.length}</p>
              <p className="text-blue-100 text-xs mt-1">+5% from last month</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Monthly Payroll</p>
              <p className="text-2xl font-bold">₹{(payrolls.reduce((sum, p) => sum + p.netPay, 0) / 1000).toFixed(0)}K</p>
              <p className="text-green-100 text-xs mt-1">+8% from last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Attendance Rate</p>
              <p className="text-2xl font-bold">{analytics?.attendanceRate.toFixed(1)}%</p>
              <p className="text-purple-100 text-xs mt-1">+2% from last month</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Leave Utilization</p>
              <p className="text-2xl font-bold">{analytics?.leaveUtilization.toFixed(1)} days</p>
              <p className="text-orange-100 text-xs mt-1">Per employee avg</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Department Distribution</h4>
            <PieChart className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {analytics?.departmentDistribution && Object.entries(analytics.departmentDistribution).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{dept}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / employees.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Salary Distribution</h4>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {analytics?.salaryDistribution.map((range) => (
              <div key={range.range} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{range.range}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(range.count / employees.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{range.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Monthly Trends</h4>
          <TrendingUp className="w-5 h-5 text-gray-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-500">Month</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Employees</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Payroll (₹)</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Attendance (%)</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.monthlyTrends.map((trend, index) => (
                <tr key={trend.month} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">{trend.month}</td>
                  <td className="py-3 text-sm text-gray-900">{trend.employees}</td>
                  <td className="py-3 text-sm text-gray-900">₹{trend.payroll.toLocaleString()}</td>
                  <td className="py-3 text-sm text-gray-900">{trend.attendance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h4>
        <div className="flex space-x-4">
          <button
            onClick={() => exportReport('pdf')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
