'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Video, 
  Download, 
  FileText,
  Users,
  MessageCircle,
  Calendar,
  Award,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Code,
  Globe,
  Search,
  Filter,
  ExternalLink,
  Play,
  Clock,
  Star,
  Eye,
  ArrowRight,
  Bookmark,
  Share2,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Headphones,
  Mail,
  Phone
} from 'lucide-react'

const PartnerResources = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeResourceType, setActiveResourceType] = useState('all')

  const resourceCategories = [
    { id: 'all', label: 'All Resources', icon: BookOpen },
    { id: 'training', label: 'Training', icon: Video },
    { id: 'marketing', label: 'Marketing', icon: Target },
    { id: 'technical', label: 'Technical', icon: Code },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'support', label: 'Support', icon: Headphones }
  ]

  const resourceTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'guide', label: 'Guides' },
    { id: 'video', label: 'Videos' },
    { id: 'template', label: 'Templates' },
    { id: 'webinar', label: 'Webinars' },
    { id: 'tool', label: 'Tools' }
  ]

  const resources = [
    {
      id: 1,
      title: 'Partner Onboarding Guide',
      description: 'Complete step-by-step guide to get started as a NextGen Accounts partner',
      category: 'training',
      type: 'guide',
      duration: '30 min read',
      difficulty: 'Beginner',
      rating: 4.9,
      views: 2500,
      downloadUrl: '#',
      previewUrl: '#',
      tags: ['onboarding', 'getting-started', 'basics'],
      featured: true,
      new: false,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Sales Presentation Templates',
      description: 'Professional PowerPoint templates for client presentations and demos',
      category: 'marketing',
      type: 'template',
      duration: 'Instant download',
      difficulty: 'Intermediate',
      rating: 4.8,
      views: 1800,
      downloadUrl: '#',
      previewUrl: '#',
      tags: ['sales', 'presentation', 'templates'],
      featured: true,
      new: false,
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 3,
      title: 'API Integration Masterclass',
      description: 'Advanced video course on integrating with NextGen Accounts API',
      category: 'technical',
      type: 'video',
      duration: '2.5 hours',
      difficulty: 'Advanced',
      rating: 4.9,
      views: 950,
      downloadUrl: '#',
      previewUrl: '#',
      tags: ['api', 'integration', 'development'],
      featured: false,
      new: true,
      icon: Video,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 4,
      title: 'Customer Success Playbook',
      description: 'Best practices for ensuring customer success and retention',
      category: 'sales',
      type: 'guide',
      duration: '45 min read',
      difficulty: 'Intermediate',
      rating: 4.7,
      views: 1200,
      downloadUrl: '#',
      previewUrl: '#',
      tags: ['customer-success', 'retention', 'best-practices'],
      featured: false,
      new: false,
      icon: Users,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      title: 'Monthly Partner Webinar',
      description: 'Live monthly sessions covering new features and partner updates',
      category: 'training',
      type: 'webinar',
      duration: '1 hour',
      difficulty: 'All levels',
      rating: 4.6,
      views: 3200,
      downloadUrl: '#',
      previewUrl: '#',
      tags: ['webinar', 'updates', 'features'],
      featured: false,
      new: false,
      icon: Calendar,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 6,
      title: 'ROI Calculator Tool',
      description: 'Interactive tool to calculate ROI for potential customers',
      category: 'sales',
      type: 'tool',
      duration: 'Interactive',
      difficulty: 'Beginner',
      rating: 4.8,
      views: 1600,
      downloadUrl: '#',
      previewUrl: '#',
      tags: ['roi', 'calculator', 'sales-tool'],
      featured: true,
      new: false,
      icon: Target,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 7,
      title: 'Security Compliance Guide',
      description: 'Comprehensive guide to security features and compliance standards',
      category: 'technical',
      type: 'guide',
      duration: '1 hour read',
      difficulty: 'Advanced',
      rating: 4.9,
      views: 800,
      downloadUrl: '#',
      previewUrl: '#',
      tags: ['security', 'compliance', 'technical'],
      featured: false,
      new: true,
      icon: Shield,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 8,
      title: 'Partner Support Portal',
      description: 'Access to dedicated support channels and ticket system',
      category: 'support',
      type: 'tool',
      duration: 'Always available',
      difficulty: 'All levels',
      rating: 4.7,
      views: 5000,
      downloadUrl: '#',
      previewUrl: '#',
      tags: ['support', 'portal', 'help'],
      featured: false,
      new: false,
      icon: Headphones,
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const quickLinks = [
    {
      title: 'Partner Portal Login',
      description: 'Access your partner dashboard',
      icon: Globe,
      url: '#',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Technical Documentation',
      description: 'API docs and integration guides',
      icon: Code,
      url: '#',
      color: 'from-purple-500 to-violet-500'
    },
    {
      title: 'Marketing Assets',
      description: 'Logos, brochures, and materials',
      icon: Target,
      url: '#',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Support Center',
      description: 'Get help when you need it',
      icon: Headphones,
      url: '#',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const supportChannels = [
    {
      title: 'Partner Success Manager',
      description: 'Dedicated support for strategic partners',
      icon: Users,
      contact: 'partners@nextgenaccounts.com',
      availability: '24/7',
      responseTime: '< 2 hours'
    },
    {
      title: 'Technical Support',
      description: 'API and integration assistance',
      icon: Code,
      contact: 'tech-support@nextgenaccounts.com',
      availability: 'Business hours',
      responseTime: '< 4 hours'
    },
    {
      title: 'Sales Support',
      description: 'Help with deals and proposals',
      icon: TrendingUp,
      contact: 'sales-support@nextgenaccounts.com',
      availability: 'Business hours',
      responseTime: '< 1 hour'
    },
    {
      title: 'Training & Certification',
      description: 'Learning and certification support',
      icon: Award,
      contact: 'training@nextgenaccounts.com',
      availability: 'Business hours',
      responseTime: '< 24 hours'
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory
    const matchesType = activeResourceType === 'all' || resource.type === activeResourceType
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesType && matchesSearch
  })

  const featuredResources = resources.filter(resource => resource.featured)

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6">
            Partner Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to succeed as a NextGen Accounts partner. From training materials 
            to marketing assets, we've got you covered.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {quickLinks.map((link, index) => {
            const LinkIcon = link.icon
            return (
              <motion.a
                key={link.title}
                href={link.url}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${link.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <LinkIcon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
                <p className="text-sm text-gray-600">{link.description}</p>
                <ExternalLink size={16} className="text-blue-600 mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            )
          })}
        </motion.div>

        {/* Featured Resources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-8 text-center">
            Featured Resources
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => {
              const ResourceIcon = resource.icon
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${resource.color} rounded-xl flex items-center justify-center`}>
                      <ResourceIcon size={20} className="text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      {resource.new && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          New
                        </span>
                      )}
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {resource.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {resource.duration}
                    </div>
                    <div className="flex items-center">
                      <Star size={12} className="mr-1 text-yellow-500" />
                      {resource.rating}
                    </div>
                    <div className="flex items-center">
                      <Eye size={12} className="mr-1" />
                      {resource.views}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                    >
                      Access
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                    >
                      <Bookmark size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {resourceCategories.map((category) => {
                const CategoryIcon = category.icon
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CategoryIcon size={16} className="mr-2" />
                    {category.label}
                  </motion.button>
                )
              })}
            </div>
            
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {resourceTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveResourceType(type.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    activeResourceType === type.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-poppins font-bold text-2xl text-gray-900">
              All Resources ({filteredResources.length})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter size={16} />
              <span>Filtered by: {activeCategory !== 'all' ? resourceCategories.find(c => c.id === activeCategory)?.label : 'All'}</span>
            </div>
          </div>
          
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => {
                const ResourceIcon = resource.icon
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${resource.color} rounded-xl flex items-center justify-center`}>
                        <ResourceIcon size={20} className="text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        {resource.new && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            New
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {resource.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {resource.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {resource.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {resource.duration}
                      </div>
                      <div className="flex items-center">
                        <Star size={12} className="mr-1 text-yellow-500" />
                        {resource.rating}
                      </div>
                      <div className="flex items-center">
                        <Eye size={12} className="mr-1" />
                        {resource.views}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                      >
                        {resource.type === 'video' ? <Play size={14} className="mr-1" /> : <Download size={14} className="mr-1" />}
                        {resource.type === 'video' ? 'Watch' : 'Access'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                      >
                        <Share2 size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
          
          {filteredResources.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </motion.div>

        {/* Support Channels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-8 text-center">
            Get Support When You Need It
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => {
              const ChannelIcon = channel.icon
              return (
                <motion.div
                  key={channel.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ChannelIcon size={24} className="text-white" />
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{channel.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{channel.description}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center justify-center">
                      <Mail size={12} className="mr-1" />
                      {channel.contact}
                    </div>
                    <div className="flex items-center justify-center">
                      <Clock size={12} className="mr-1" />
                      {channel.availability}
                    </div>
                    <div className="flex items-center justify-center">
                      <Zap size={12} className="mr-1" />
                      Response: {channel.responseTime}
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Contact
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <Lightbulb size={48} className="mx-auto mb-6 opacity-80" />
          <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-4">
            Need Something Specific?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our partner success team is here to help 
            you find the right resources or create custom materials for your needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <MessageCircle size={16} className="mr-2" />
              Request Custom Resource
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <Phone size={16} className="mr-2" />
              Schedule Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PartnerResources