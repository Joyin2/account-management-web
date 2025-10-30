'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import {
  X,
  Save,
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
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

interface EmployeeFormData {
  id?: string;
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  
  // Address Information
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Employment Information
  employeeId: string;
  department: string;
  designation: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  workLocation: 'office' | 'remote' | 'hybrid';
  reportingManager?: string;
  dateOfJoining: string;
  probationEndDate?: string;
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
  
  // Documents
  aadharNumber?: string;
  panNumber?: string;
  passportNumber?: string;
  drivingLicense?: string;
  
  // Bank Details
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  accountHolderName: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactEmail?: string;
}

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: EmployeeFormData) => void;
  editData?: EmployeeFormData;
  employees?: Array<{ id: string; firstName: string; lastName: string; employeeId: string }>;
}

const departments = [
  'Human Resources',
  'Information Technology',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'Customer Service',
  'Research & Development',
  'Quality Assurance',
  'Administration'
];

const designations = [
  'Manager',
  'Senior Manager',
  'Team Lead',
  'Senior Developer',
  'Developer',
  'Junior Developer',
  'Analyst',
  'Senior Analyst',
  'Executive',
  'Senior Executive',
  'Associate',
  'Intern'
];

export default function EmployeeForm({
  isOpen,
  onClose,
  onSave,
  editData,
  employees = []
}: EmployeeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    maritalStatus: 'single',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    employeeId: '',
    department: '',
    designation: '',
    employmentType: 'full-time',
    workLocation: 'office',
    dateOfJoining: new Date().toISOString().split('T')[0],
    status: 'active',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
    accountHolderName: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    ...editData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        break;

      case 2: // Address Information
        if (!formData.street.trim()) newErrors.street = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        break;

      case 3: // Employment Information
        if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.designation) newErrors.designation = 'Designation is required';
        if (!formData.dateOfJoining) newErrors.dateOfJoining = 'Joining date is required';
        
        // Check for duplicate employee ID
        const existingEmployee = employees.find(emp => 
          emp.employeeId === formData.employeeId && emp.id !== formData.id
        );
        if (existingEmployee) {
          newErrors.employeeId = 'Employee ID already exists';
        }
        break;

      case 4: // Documents & Bank Details
        if (!formData.bankAccountNumber.trim()) newErrors.bankAccountNumber = 'Bank account number is required';
        if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
        if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
        if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
        if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
        if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Address', icon: MapPin },
    { number: 3, title: 'Employment', icon: Building2 },
    { number: 4, title: 'Documents', icon: FileText }
  ];

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
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editData ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                  ${currentStep >= step.number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                  }
                `}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.street ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter street address"
                  />
                  {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter city"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter state"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.zipCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter ZIP code"
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Employment Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.employeeId ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter employee ID"
                  />
                  {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.department ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                  <select
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.designation ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select designation</option>
                    {designations.map(designation => (
                      <option key={designation} value={designation}>{designation}</option>
                    ))}
                  </select>
                  {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Location</label>
                  <select
                    value={formData.workLocation}
                    onChange={(e) => handleInputChange('workLocation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="office">Office</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Joining *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dateOfJoining ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfJoining && <p className="text-red-500 text-sm mt-1">{errors.dateOfJoining}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Probation End Date</label>
                  <input
                    type="date"
                    value={formData.probationEndDate || ''}
                    onChange={(e) => handleInputChange('probationEndDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Reporting Manager
                  </label>
                  <select
                    value={formData.reportingManager || ''}
                    onChange={(e) => handleInputChange('reportingManager', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select manager</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents & Bank Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents & Bank Details</h3>

              {/* Document Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Document Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      value={formData.aadharNumber || ''}
                      onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Aadhar number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input
                      type="text"
                      value={formData.panNumber || ''}
                      onChange={(e) => handleInputChange('panNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter PAN number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                    <input
                      type="text"
                      value={formData.passportNumber || ''}
                      onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter passport number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Driving License</label>
                    <input
                      type="text"
                      value={formData.drivingLicense || ''}
                      onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter driving license number"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Bank Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="w-4 h-4 inline mr-2" />
                      Account Number *
                    </label>
                    <div className="relative">
                      <input
                        type={showSensitiveData ? "text" : "password"}
                        value={formData.bankAccountNumber}
                        onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.bankAccountNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter account number"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSensitiveData(!showSensitiveData)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.bankAccountNumber && <p className="text-red-500 text-sm mt-1">{errors.bankAccountNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.bankName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter bank name"
                    />
                    {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                    <input
                      type="text"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.ifscCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter IFSC code"
                    />
                    {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                    <input
                      type="text"
                      value={formData.accountHolderName}
                      onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.accountHolderName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter account holder name"
                    />
                    {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.emergencyContactName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter contact name"
                    />
                    {errors.emergencyContactName && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                    <select
                      value={formData.emergencyContactRelationship}
                      onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="child">Child</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {errors.emergencyContactPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.emergencyContactEmail || ''}
                      onChange={(e) => handleInputChange('emergencyContactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              {currentStep === 4 ? (
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editData ? 'Update Employee' : 'Create Employee'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
