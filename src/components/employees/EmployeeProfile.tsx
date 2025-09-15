'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Employee } from '@/services/employeeService';
import DocumentManagement from './DocumentManagement';
import {
  X,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  FileText,
  CreditCard,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Download,
  Upload
} from 'lucide-react';

interface EmployeeProfileProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function EmployeeProfile({
  employee,
  isOpen,
  onClose,
  onEdit
}: EmployeeProfileProps) {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'documents'>('profile');

  if (!isOpen) return null;

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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate ? timestamp.toDate().toLocaleDateString() : new Date(timestamp).toLocaleDateString();
  };

  const calculateAge = (dateOfBirth: any) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = dateOfBirth.toDate ? dateOfBirth.toDate() : new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const calculateTenure = (joiningDate: any) => {
    if (!joiningDate) return 'N/A';
    const joinDate = joiningDate.toDate ? joiningDate.toDate() : new Date(joiningDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''} ${remainingMonths > 0 ? `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-sm text-gray-600">{employee.designation} • {employee.department}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                  {getStatusIcon(employee.status)}
                  <span className="capitalize">{employee.status}</span>
                </span>
                <span className="text-xs text-gray-500">ID: {employee.employeeId}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Documents
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Age</span>
              </div>
              <p className="text-lg font-bold text-blue-900 mt-1">{calculateAge(employee.dateOfBirth)} years</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Tenure</span>
              </div>
              <p className="text-lg font-bold text-green-900 mt-1">{calculateTenure(employee.dateOfJoining)}</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Employment</span>
              </div>
              <p className="text-lg font-bold text-purple-900 mt-1 capitalize">{employee.employmentType}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{employee.firstName} {employee.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(employee.dateOfBirth)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{employee.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{employee.maritalStatus}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <p className="mt-1 text-sm text-gray-900">{employee.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900">{employee.phone}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.address ?
                    `${employee.address.street || ''}, ${employee.address.city || ''}, ${employee.address.state || ''} ${employee.address.zipCode || ''}, ${employee.address.country || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '')
                    : 'No address provided'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <p className="mt-1 text-sm text-gray-900">{employee.employeeId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="mt-1 text-sm text-gray-900">{employee.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <p className="mt-1 text-sm text-gray-900">{employee.designation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{employee.employmentType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Location</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{employee.workLocation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(employee.dateOfJoining)}</p>
              </div>
              {employee.probationEndDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Probation End Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(employee.probationEndDate)}</p>
                </div>
              )}
              {employee.dateOfTermination && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Termination</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(employee.dateOfTermination)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employee.documents?.aadharNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {showSensitiveData ? employee.documents.aadharNumber : '••••••••••••'}
                  </p>
                </div>
              )}
              {employee.documents?.panNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {showSensitiveData ? employee.documents.panNumber : '••••••••••'}
                  </p>
                </div>
              )}
              {employee.documents?.passportNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {showSensitiveData ? employee.documents.passportNumber : '••••••••••'}
                  </p>
                </div>
              )}
              {employee.documents?.drivingLicense && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Driving License</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {showSensitiveData ? employee.documents.drivingLicense : '••••••••••'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
              <button
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
              >
                {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showSensitiveData ? 'Hide' : 'Show'} Sensitive Data</span>
              </button>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Bank Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employee.documents?.bankAccount && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {showSensitiveData ? employee.documents.bankAccount.accountNumber : '••••••••••••'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.documents.bankAccount.bankName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.documents.bankAccount.ifscCode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.documents.bankAccount.accountHolderName}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employee.documents?.emergencyContact && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.documents.emergencyContact.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Relationship</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{employee.documents.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.documents.emergencyContact.phone}</p>
                  </div>
                  {employee.documents.emergencyContact.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.documents.emergencyContact.email}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
            </>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <DocumentManagement
              employee={employee}
              onDocumentUpdate={() => {
                // Optionally refresh employee data or show notification
                console.log('Documents updated for employee:', employee.id);
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
