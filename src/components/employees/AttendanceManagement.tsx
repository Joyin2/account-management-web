'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Attendance, Employee } from '@/services/employeeService';
import {
  Clock,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  Edit,
  BarChart3
} from 'lucide-react';

interface AttendanceManagementProps {
  employees: Employee[];
  attendanceRecords: Attendance[];
  onCheckIn: (employeeId: string, location?: { latitude: number; longitude: number; address: string }) => void;
  onCheckOut: (employeeId: string, location?: { latitude: number; longitude: number; address: string }) => void;
  onMarkAttendance: (employeeId: string, date: Date, status: string) => void;
}

export default function AttendanceManagement({
  employees,
  attendanceRecords,
  onCheckIn,
  onCheckOut,
  onMarkAttendance
}: AttendanceManagementProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<'today' | 'records' | 'reports'>('today');
  const [currentTime, setCurrentTime] = useState(new Date());

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
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTodayAttendance = () => {
    const today = new Date().toDateString();
    return attendanceRecords.filter(record => {
      const recordDate = safeToDate(record.date);
      return recordDate.toDateString() === today;
    });
  };

  const getAttendanceForDate = (date: string) => {
    const targetDate = new Date(date).toDateString();
    return attendanceRecords.filter(record => {
      const recordDate = safeToDate(record.date);
      return recordDate.toDateString() === targetDate;
    });
  };

  const getEmployeeAttendanceForDate = (employeeId: string, date: string) => {
    const attendanceForDate = getAttendanceForDate(date);
    return attendanceForDate.find(record => record.employeeId === employeeId);
  };

  const getAttendanceStats = () => {
    const todayAttendance = getTodayAttendance();
    const totalEmployees = employees.filter(emp => emp.status === 'active').length;
    const presentToday = todayAttendance.filter(record => record.status === 'present').length;
    const absentToday = totalEmployees - presentToday;
    const lateToday = todayAttendance.filter(record => record.isLate).length;
    const overtimeToday = todayAttendance.reduce((sum, record) => sum + record.overtimeHours, 0);

    return {
      totalEmployees,
      presentToday,
      absentToday,
      lateToday,
      overtimeToday
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'half-day': return 'bg-yellow-100 text-yellow-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      case 'on-leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'absent': return <XCircle className="w-4 h-4" />;
      case 'half-day': return <Clock className="w-4 h-4" />;
      case 'late': return <AlertTriangle className="w-4 h-4" />;
      case 'on-leave': return <Calendar className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = safeToDate(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateHours = (checkIn: any, checkOut: any) => {
    if (!checkIn || !checkOut) return 0;
    const inTime = checkIn.toDate ? checkIn.toDate() : new Date(checkIn);
    const outTime = checkOut.toDate ? checkOut.toDate() : new Date(checkOut);
    const diffMs = outTime.getTime() - inTime.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const attendance = getEmployeeAttendanceForDate(employee.id!, selectedDate);
    const matchesStatus = attendance ? attendance.status === filterStatus : filterStatus === 'absent';
    
    return matchesSearch && matchesStatus;
  });

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
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
              <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
              <p className="text-2xl font-bold text-orange-600">{stats.lateToday}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overtime Hours</p>
              <p className="text-2xl font-bold text-purple-600">{stats.overtimeToday.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Current Time Display */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Current Time</h3>
            <p className="text-3xl font-bold">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
              })}
            </p>
            <p className="text-blue-100">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Attendance for</p>
            <p className="text-xl font-semibold">Today</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('today')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'today'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Today's Attendance
            </button>
            <button
              onClick={() => setSelectedTab('records')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Attendance Records
            </button>
            <button
              onClick={() => setSelectedTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reports & Analytics
            </button>
          </nav>
        </div>

        {/* Today's Attendance Tab */}
        {selectedTab === 'today' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Today's Attendance</h3>
              <div className="flex space-x-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Bulk Check-in</span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Search and Filter */}
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
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>

            {/* Employee Attendance List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map(employee => {
                const attendance = getEmployeeAttendanceForDate(employee.id!, new Date().toISOString().split('T')[0]);
                const isCheckedIn = attendance && attendance.checkInTime && !attendance.checkOutTime;
                const isCheckedOut = attendance && attendance.checkInTime && attendance.checkOutTime;
                
                return (
                  <div key={employee.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</h4>
                        <p className="text-sm text-gray-500">{employee.employeeId} • {employee.department}</p>
                      </div>
                      {attendance && (
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(attendance.status)}`}>
                          {getStatusIcon(attendance.status)}
                          <span className="capitalize">{attendance.status}</span>
                        </span>
                      )}
                    </div>
                    
                    {attendance ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Check In</p>
                            <p className="font-medium">{formatTime(attendance.checkInTime)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Check Out</p>
                            <p className="font-medium">{formatTime(attendance.checkOutTime)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Hours</p>
                            <p className="font-medium">{attendance.totalHours.toFixed(1)}h</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Overtime</p>
                            <p className="font-medium">{attendance.overtimeHours.toFixed(1)}h</p>
                          </div>
                        </div>
                        
                        {attendance.isLate && (
                          <div className="flex items-center space-x-2 text-orange-600 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Late by {attendance.lateMinutes} minutes</span>
                          </div>
                        )}
                        
                        {attendance.checkInLocation && (
                          <div className="flex items-center space-x-2 text-gray-500 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{attendance.checkInLocation.address}</span>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          {!isCheckedOut && (
                            <button
                              onClick={() => isCheckedIn ? onCheckOut(employee.id!) : onCheckIn(employee.id!)}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isCheckedIn 
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {isCheckedIn ? 'Check Out' : 'Check In'}
                            </button>
                          )}
                          <button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500 text-center py-4">No attendance record for today</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onCheckIn(employee.id!)}
                            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Check In
                          </button>
                          <button
                            onClick={() => onMarkAttendance(employee.id!, new Date(), 'absent')}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Mark Absent
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Records Tab */}
        {selectedTab === 'records' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Attendance Records</h3>
              <p className="mt-1 text-sm text-gray-500">
                Detailed attendance records and history will be displayed here.
              </p>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {selectedTab === 'reports' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Reports & Analytics</h3>
            
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Attendance Analytics</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comprehensive attendance reports and analytics will be displayed here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
