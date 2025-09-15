'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LeaveApplication, LeaveType, LeaveBalance, Employee } from '@/services/employeeService';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface LeaveManagementProps {
  employees: Employee[];
  leaveTypes: LeaveType[];
  leaveApplications: LeaveApplication[];
  leaveBalances: LeaveBalance[];
  onCreateApplication: () => void;
  onEditApplication: (application: LeaveApplication) => void;
  onApproveApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string, reason: string) => void;
  onRecalculateBalances?: () => void;
  onEnsureBalances?: () => void;
}

export default function LeaveManagement({
  employees,
  leaveTypes,
  leaveApplications,
  leaveBalances,
  onCreateApplication,
  onEditApplication,
  onApproveApplication,
  onRejectApplication,
  onRecalculateBalances,
  onEnsureBalances
}: LeaveManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLeaveType, setFilterLeaveType] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<'applications' | 'balances' | 'calendar'>('applications');

  const filteredApplications = leaveApplications.filter(application => {
    const employee = employees.find(emp => emp.id === application.employeeId);
    const leaveType = leaveTypes.find(lt => lt.id === application.leaveTypeId);
    
    const matchesSearch = employee ? 
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    
    const matchesStatus = filterStatus === 'all' || application.status === filterStatus;
    const matchesLeaveType = filterLeaveType === 'all' || application.leaveTypeId === filterLeaveType;
    
    return matchesSearch && matchesStatus && matchesLeaveType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate ? timestamp.toDate().toLocaleDateString() : new Date(timestamp).toLocaleDateString();
  };

  const getLeaveStats = () => {
    const totalApplications = leaveApplications.length;
    const pendingApplications = leaveApplications.filter(app => app.status === 'pending').length;
    const approvedApplications = leaveApplications.filter(app => app.status === 'approved').length;
    const rejectedApplications = leaveApplications.filter(app => app.status === 'rejected').length;

    return {
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications
    };
  };

  const stats = getLeaveStats();

  return (
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
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
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
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedApplications}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejectedApplications}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leave Applications
            </button>
            <button
              onClick={() => setSelectedTab('balances')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'balances'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leave Balances
            </button>
            <button
              onClick={() => setSelectedTab('calendar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'calendar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leave Calendar
            </button>
          </nav>
        </div>

        {/* Applications Tab */}
        {selectedTab === 'applications' && (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Leave Applications</h3>
              <div className="flex space-x-3">
                {onEnsureBalances && (
                  <button
                    onClick={onEnsureBalances}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    title="Ensure all employees have proper leave balances"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Initialize Balances</span>
                  </button>
                )}
                {onRecalculateBalances && (
                  <button
                    onClick={onRecalculateBalances}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    title="Recalculate all leave balances based on current applications"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Recalculate Balances</span>
                  </button>
                )}
                <button
                  onClick={onCreateApplication}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Application</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={filterLeaveType}
                onChange={(e) => setFilterLeaveType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Leave Types</option>
                {leaveTypes.map(leaveType => (
                  <option key={leaveType.id} value={leaveType.id}>
                    {leaveType.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => {
                    const employee = employees.find(emp => emp.id === application.employeeId);
                    const leaveType = leaveTypes.find(lt => lt.id === application.leaveTypeId);
                    
                    return (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {employee ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}` : 'N/A'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {employee ? employee.employeeId : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {leaveType ? leaveType.name : 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>{formatDate(application.startDate)} - {formatDate(application.endDate)}</div>
                            <div className="text-xs text-gray-500">
                              {application.totalDays} day{application.totalDays !== 1 ? 's' : ''}
                              {application.halfDay && ' (Half Day)'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(application.appliedDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="capitalize">{application.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            {application.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => onApproveApplication(application.id!)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onRejectApplication(application.id!, 'Rejected by manager')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => onEditApplication(application)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No leave applications found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterLeaveType !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating a new leave application.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Balances Tab */}
        {selectedTab === 'balances' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Leave Balances</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.filter(emp => emp.status === 'active').map(employee => {
                const employeeBalances = leaveBalances.filter(balance => balance.employeeId === employee.id);
                
                return (
                  <div key={employee.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</h4>
                        <p className="text-sm text-gray-500">{employee.employeeId}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {employeeBalances.map(balance => {
                        const leaveType = leaveTypes.find(lt => lt.id === balance.leaveTypeId);
                        const usagePercentage = balance.totalEntitled > 0 ? (balance.used / balance.totalEntitled) * 100 : 0;
                        
                        return (
                          <div key={balance.id} className="bg-white rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                {leaveType ? leaveType.name : 'Unknown'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {balance.available} / {balance.totalEntitled}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Used: {balance.used}</span>
                              <span>Pending: {balance.pending}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {selectedTab === 'calendar' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Leave Calendar</h3>
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Leave Calendar</h3>
              <p className="mt-1 text-sm text-gray-500">
                Calendar view will be implemented here to show all leave schedules.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
