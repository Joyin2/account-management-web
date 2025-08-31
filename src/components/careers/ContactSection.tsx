'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  User, 
  Building, 
  Briefcase, 
  FileText, 
  Calendar, 
  Globe, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube, 
  ExternalLink, 
  Download, 
  BookOpen, 
  Users, 
  Award, 
  Target, 
  Heart, 
  Coffee, 
  Headphones, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Star, 
  TrendingUp, 
  Lightbulb, 
  Smile, 
  HelpCircle
} from 'lucide-react'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      primary: 'careers@nextgenaccounts.com',
      secondary: 'hr@nextgenaccounts.com',
      description: 'Get in touch with our talent team'
    },
    {
      icon: Phone,
      title: 'Call Us',
      primary: '+1 (555) 123-4567',
      secondary: '+1 (555) 123-4568',
      description: 'Speak directly with our recruiters'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      primary: '123 Innovation Drive',
      secondary: 'San Francisco, CA 94105',
      description: 'Our headquarters and main office'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      primary: 'Monday - Friday',
      secondary: '9:00 AM - 6:00 PM PST',
      description: 'When our team is available'
    }
  ]

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'application', label: 'Application Status', icon: FileText },
    { value: 'interview', label: 'Interview Questions', icon: Users },
    { value: 'benefits', label: 'Benefits & Compensation', icon: Award },
    { value: 'culture', label: 'Company Culture', icon: Heart },
    { value: 'technical', label: 'Technical Roles', icon: Target },
    { value: 'internship', label: 'Internship Program', icon: BookOpen },
    { value: 'referral', label: 'Employee Referral', icon: Users }
  ]

  const socialLinks = [
    { icon: Linkedin, label: 'LinkedIn', url: '#', color: 'bg-blue-600' },
    { icon: Twitter, label: 'Twitter', url: '#', color: 'bg-sky-500' },
    { icon: Instagram, label: 'Instagram', url: '#', color: 'bg-pink-500' },
    { icon: Youtube, label: 'YouTube', url: '#', color: 'bg-red-500' }
  ]

  const resources = [
    {
      icon: Download,
      title: 'Interview Preparation Guide',
      description: 'Comprehensive guide to ace your NextGen interview',
      action: 'Download PDF'
    },
    {
      icon: BookOpen,
      title: 'Employee Handbook Preview',
      description: 'Learn about our policies, benefits, and culture',
      action: 'View Online'
    },
    {
      icon: Calendar,
      title: 'Virtual Office Tour',
      description: 'Schedule a virtual tour of our workspace',
      action: 'Book Tour'
    },
    {
      icon: Users,
      title: 'Meet the Team',
      description: 'Get to know our leadership and team members',
      action: 'Learn More'
    }
  ]

  const stats = [
    { label: 'Response Time', value: '< 24 hours', icon: Clock },
    { label: 'Satisfaction Rate', value: '98%', icon: Smile },
    { label: 'Team Members', value: '500+', icon: Users },
    { label: 'Open Positions', value: '25+', icon: Briefcase }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6">
            Get in
            <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about careers at NextGen Accounts? Our talent team is here to help 
            you navigate your journey with us.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const StatIcon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <StatIcon size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-10">
              <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center">
                <MessageSquare size={24} className="text-blue-600 mr-3" />
                Send us a Message
              </h3>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone and Inquiry Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Type *
                      </label>
                      <div className="relative">
                        <Building size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                        >
                          {inquiryTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <FileText size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Brief subject of your inquiry"
                      />
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry or questions..."
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send size={20} className="mr-2" />
                        Send Message
                      </div>
                    )}
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Message Sent!</h4>
                  <p className="text-gray-600">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div>
              <h3 className="font-bold text-2xl text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const InfoIcon = info.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <InfoIcon size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                        <p className="text-gray-700 font-medium">{info.primary}</p>
                        <p className="text-gray-600 text-sm">{info.secondary}</p>
                        <p className="text-gray-500 text-xs mt-1">{info.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const SocialIcon = social.icon
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300`}
                    >
                      <SocialIcon size={20} />
                    </motion.a>
                  )
                })}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-4">Helpful Resources</h4>
              <div className="space-y-3">
                {resources.map((resource, index) => {
                  const ResourceIcon = resource.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                          <ResourceIcon size={16} className="text-white" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {resource.title}
                          </h5>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                        <span className="text-sm font-medium mr-2">{resource.action}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="font-bold text-2xl md:text-3xl mb-4">
            Still Have Questions?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Our talent team is always happy to help. Schedule a call or visit our FAQ section 
            for immediate answers to common questions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <Calendar size={20} className="mr-2" />
              Schedule a Call
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <HelpCircle size={20} className="mr-2" />
              View FAQ
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactSection