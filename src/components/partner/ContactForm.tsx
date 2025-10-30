'use client'

import { useState } from 'react'

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  country: string;
  partnerType: string;
  companySize: string;
  currentRevenue: string;
  expectedClients: string;
  timeline: string;
  experience: string;
  message: string;
  interests: string[];
  hearAbout: string;
  newsletter: boolean;
  terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  Building2,
  MapPin,
  Globe,
  Users,
  DollarSign,
  Calendar,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Zap,
  Shield,
  Award,
  TrendingUp,
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
  Star,
  Heart,
  Lightbulb
} from 'lucide-react'

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    country: '',
    partnerType: '',
    companySize: '',
    currentRevenue: '',
    expectedClients: '',
    timeline: '',
    experience: '',
    message: '',
    interests: [],
    hearAbout: '',
    newsletter: false,
    terms: false
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const totalSteps = 4

  const partnerTypes = [
    { id: 'reseller', label: 'Reseller Partner', description: 'Sell NextGen Accounts to your clients' },
    { id: 'technology', label: 'Technology Partner', description: 'Integrate with our platform' },
    { id: 'consultant', label: 'Consultant Partner', description: 'Implement solutions for clients' },
    { id: 'channel', label: 'Channel Partner', description: 'Distribute through your network' },
    { id: 'global', label: 'Global Partner', description: 'Expand to international markets' },
    { id: 'enterprise', label: 'Enterprise Partner', description: 'Large-scale implementations' }
  ]

  const companySizes = [
    { id: 'startup', label: '1-10 employees', description: 'Startup/Small business' },
    { id: 'small', label: '11-50 employees', description: 'Small company' },
    { id: 'medium', label: '51-200 employees', description: 'Medium company' },
    { id: 'large', label: '201-1000 employees', description: 'Large company' },
    { id: 'enterprise', label: '1000+ employees', description: 'Enterprise' }
  ]

  const revenueRanges = [
    { id: 'under100k', label: 'Under $100K', description: 'Annual revenue' },
    { id: '100k-500k', label: '$100K - $500K', description: 'Annual revenue' },
    { id: '500k-1m', label: '$500K - $1M', description: 'Annual revenue' },
    { id: '1m-5m', label: '$1M - $5M', description: 'Annual revenue' },
    { id: '5m-10m', label: '$5M - $10M', description: 'Annual revenue' },
    { id: 'over10m', label: 'Over $10M', description: 'Annual revenue' }
  ]

  const timelines = [
    { id: 'immediate', label: 'Immediately', description: 'Ready to start now' },
    { id: '1month', label: 'Within 1 month', description: 'Planning to start soon' },
    { id: '3months', label: 'Within 3 months', description: 'In evaluation phase' },
    { id: '6months', label: 'Within 6 months', description: 'Long-term planning' },
    { id: 'exploring', label: 'Just exploring', description: 'Gathering information' }
  ]

  const interests = [
    { id: 'training', label: 'Training & Certification', icon: Award },
    { id: 'marketing', label: 'Marketing Support', icon: Target },
    { id: 'technical', label: 'Technical Integration', icon: Zap },
    { id: 'sales', label: 'Sales Support', icon: TrendingUp },
    { id: 'global', label: 'Global Expansion', icon: Globe },
    { id: 'enterprise', label: 'Enterprise Deals', icon: Building2 }
  ]

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia',
    'Japan', 'Singapore', 'India', 'Brazil', 'Mexico', 'Netherlands', 'Other'
  ]

  const hearAboutOptions = [
    'Google Search', 'Social Media', 'Partner Referral', 'Industry Event',
    'Email Campaign', 'Website', 'Word of Mouth', 'Other'
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    }

    if (step === 2) {
      if (!formData.company.trim()) newErrors.company = 'Company name is required'
      if (!formData.country) newErrors.country = 'Country is required'
      if (!formData.partnerType) newErrors.partnerType = 'Partner type is required'
    }

    if (step === 3) {
      if (!formData.companySize) newErrors.companySize = 'Company size is required'
      if (!formData.timeline) newErrors.timeline = 'Timeline is required'
    }

    if (step === 4) {
      if (!formData.terms) newErrors.terms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  const benefits = [
    {
      title: 'Fast Response',
      description: 'Get a response within 24 hours',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Dedicated Support',
      description: 'Personal partner success manager',
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Proven Success',
      description: '95% partner satisfaction rate',
      icon: Star,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Secure Process',
      description: 'Enterprise-grade security',
      icon: Shield,
      color: 'from-purple-500 to-violet-500'
    }
  ]

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={40} className="text-white" />
            </div>
            
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-900 mb-6">
              Thank You for Your Interest!
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We've received your partnership application and our team will review it carefully. 
              You can expect to hear from us within 24 hours.
            </p>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <span className="text-gray-700">Our team reviews your application (within 24 hours)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <span className="text-gray-700">We schedule a discovery call to discuss your goals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <span className="text-gray-700">We create a customized partnership plan for you</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Download size={16} className="mr-2" />
                Download Partner Guide
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsSubmitted(false)
                  setCurrentStep(1)
                  setFormData({
                    firstName: '', lastName: '', email: '', phone: '', company: '',
                    website: '', country: '', partnerType: '', companySize: '',
                    currentRevenue: '', expectedClients: '', timeline: '', experience: '',
                    message: '', interests: [], hearAbout: '', newsletter: false, terms: false
                  })
                }}
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
              >
                Submit Another Application
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
            >
              {/* Header */}
              <div className="mb-8">
                <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                  Become a Partner
                </h2>
                <p className="text-lg text-gray-600">
                  Join our growing network of successful partners and start your journey today.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
                  <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-600 to-violet-600 h-2 rounded-full"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <h3 className="font-semibold text-xl text-gray-900 mb-6">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <div className="relative">
                            <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter your first name"
                            />
                          </div>
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle size={14} className="mr-1" />
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <div className="relative">
                            <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                errors.lastName ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter your last name"
                            />
                          </div>
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle size={14} className="mr-1" />
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your email address"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Company Information */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <h3 className="font-semibold text-xl text-gray-900 mb-6">Company Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <div className="relative">
                          <Building2 size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                              errors.company ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your company name"
                          />
                        </div>
                        {errors.company && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.company}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Website
                        </label>
                        <div className="relative">
                          <Globe size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="https://www.yourcompany.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <div className="relative">
                          <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                              errors.country ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select your country</option>
                            {countries.map(country => (
                              <option key={country} value={country}>{country}</option>
                            ))}
                          </select>
                        </div>
                        {errors.country && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.country}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Partner Type *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {partnerTypes.map(type => (
                            <motion.div
                              key={type.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleInputChange('partnerType', type.id)}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                formData.partnerType === type.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <h4 className="font-semibold text-gray-900 mb-1">{type.label}</h4>
                              <p className="text-sm text-gray-600">{type.description}</p>
                            </motion.div>
                          ))}
                        </div>
                        {errors.partnerType && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.partnerType}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Business Details */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <h3 className="font-semibold text-xl text-gray-900 mb-6">Business Details</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Company Size *
                        </label>
                        <div className="space-y-3">
                          {companySizes.map(size => (
                            <motion.div
                              key={size.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleInputChange('companySize', size.id)}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 flex items-center ${
                                formData.companySize === size.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                formData.companySize === size.id
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`} />
                              <div>
                                <h4 className="font-semibold text-gray-900">{size.label}</h4>
                                <p className="text-sm text-gray-600">{size.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        {errors.companySize && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.companySize}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Current Annual Revenue
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {revenueRanges.map(range => (
                            <motion.div
                              key={range.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleInputChange('currentRevenue', range.id)}
                              className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 text-center ${
                                formData.currentRevenue === range.id
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <h4 className="font-semibold text-gray-900">{range.label}</h4>
                              <p className="text-xs text-gray-600">{range.description}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          When do you want to start? *
                        </label>
                        <div className="space-y-3">
                          {timelines.map(timeline => (
                            <motion.div
                              key={timeline.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleInputChange('timeline', timeline.id)}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 flex items-center ${
                                formData.timeline === timeline.id
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                formData.timeline === timeline.id
                                  ? 'border-purple-500 bg-purple-500'
                                  : 'border-gray-300'
                              }`} />
                              <div>
                                <h4 className="font-semibold text-gray-900">{timeline.label}</h4>
                                <p className="text-sm text-gray-600">{timeline.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        {errors.timeline && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.timeline}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Areas of Interest
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {interests.map(interest => {
                            const InterestIcon = interest.icon
                            return (
                              <motion.div
                                key={interest.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleInterestToggle(interest.id)}
                                className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 text-center ${
                                  formData.interests.includes(interest.id)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <InterestIcon size={20} className={`mx-auto mb-2 ${
                                  formData.interests.includes(interest.id) ? 'text-blue-600' : 'text-gray-600'
                                }`} />
                                <p className="text-sm font-medium text-gray-900">{interest.label}</p>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Final Details */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <h3 className="font-semibold text-xl text-gray-900 mb-6">Additional Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Number of Clients (First Year)
                        </label>
                        <input
                          type="number"
                          value={formData.expectedClients}
                          onChange={(e) => handleInputChange('expectedClients', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="e.g., 25"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Previous Experience with Similar Partnerships
                        </label>
                        <textarea
                          value={formData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Tell us about your relevant experience..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          How did you hear about us?
                        </label>
                        <select
                          value={formData.hearAbout}
                          onChange={(e) => handleInputChange('hearAbout', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="">Select an option</option>
                          {hearAboutOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Message
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Tell us more about your goals and how we can help..."
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={formData.newsletter}
                            onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                            className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            I would like to receive updates about new features, partner resources, and industry insights.
                          </span>
                        </label>
                        
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={formData.terms}
                            onChange={(e) => handleInputChange('terms', e.target.checked)}
                            className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *
                          </span>
                        </label>
                        {errors.terms && (
                          <p className="text-red-500 text-sm flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.terms}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
                    whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </motion.button>
                  
                  {currentStep < totalSteps ? (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
                    >
                      Next Step
                      <ArrowRight size={16} className="ml-2" />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                        isSubmitting
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" />
                          Submit Application
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Benefits Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="sticky top-8 space-y-6"
            >
              {/* Benefits */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-6">Why Partner With Us?</h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const BenefitIcon = benefit.icon
                    return (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mr-3 flex-shrink-0`}>
                          <BenefitIcon size={16} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{benefit.title}</h4>
                          <p className="text-gray-600 text-xs">{benefit.description}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Our partner team is here to help you through the application process.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2" />
                    partners@nextgenaccounts.com
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2" />
                    +1 (555) 123-4567
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    Mon-Fri, 9AM-6PM EST
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Helpful Resources</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors duration-300">
                    <FileText size={16} className="mr-2" />
                    Partner Program Guide
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                  <a href="#" className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors duration-300">
                    <Download size={16} className="mr-2" />
                    Partnership Benefits PDF
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                  <a href="#" className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors duration-300">
                    <MessageCircle size={16} className="mr-2" />
                    FAQ & Support
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm