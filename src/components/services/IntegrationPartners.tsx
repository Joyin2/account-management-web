'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  CreditCard, 
  Database, 
  Globe, 
  Smartphone,
  ShoppingCart,
  Mail,
  Calendar,
  FileText,
  BarChart3,
  Users,
  Cloud,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Zap,
  Shield,
  Clock,
  Star
} from 'lucide-react'

const IntegrationPartners = () => {
  const [activeCategory, setActiveCategory] = useState(0)

  const integrationCategories = [
    {
      id: 'banking',
      title: 'Banking & Finance',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      description: 'Connect with major banks and financial institutions worldwide',
      partners: [
        { name: 'Chase Bank', logo: '🏦', status: 'verified', users: '2.5M+' },
        { name: 'Bank of America', logo: '🏛️', status: 'verified', users: '1.8M+' },
        { name: 'Wells Fargo', logo: '🏪', status: 'verified', users: '1.2M+' },
        { name: 'Citibank', logo: '🏢', status: 'verified', users: '900K+' },
        { name: 'HSBC', logo: '🌐', status: 'verified', users: '750K+' },
        { name: 'Deutsche Bank', logo: '🇩🇪', status: 'verified', users: '600K+' },
        { name: 'Barclays', logo: '🇬🇧', status: 'verified', users: '550K+' },
        { name: 'Credit Suisse', logo: '🇨🇭', status: 'verified', users: '400K+' }
      ],
      features: [
        'Real-time transaction sync',
        'Multi-account management',
        'Automated reconciliation',
        'Bank-grade security'
      ]
    },
    {
      id: 'payments',
      title: 'Payment Processors',
      icon: CreditCard,
      color: 'from-green-500 to-emerald-500',
      description: 'Integrate with leading payment gateways and processors',
      partners: [
        { name: 'Stripe', logo: '💳', status: 'verified', users: '3.2M+' },
        { name: 'PayPal', logo: '💰', status: 'verified', users: '2.8M+' },
        { name: 'Square', logo: '⬜', status: 'verified', users: '1.5M+' },
        { name: 'Adyen', logo: '🔷', status: 'verified', users: '800K+' },
        { name: 'Braintree', logo: '🧠', status: 'verified', users: '650K+' },
        { name: 'Authorize.Net', logo: '🔐', status: 'verified', users: '500K+' },
        { name: 'Worldpay', logo: '🌍', status: 'verified', users: '450K+' },
        { name: 'Klarna', logo: '🛍️', status: 'verified', users: '300K+' }
      ],
      features: [
        'Multiple payment methods',
        'Fraud protection',
        'Subscription billing',
        'Global currency support'
      ]
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Platforms',
      icon: ShoppingCart,
      color: 'from-purple-500 to-violet-500',
      description: 'Seamlessly connect with popular e-commerce solutions',
      partners: [
        { name: 'Shopify', logo: '🛒', status: 'verified', users: '2.1M+' },
        { name: 'WooCommerce', logo: '🔧', status: 'verified', users: '1.9M+' },
        { name: 'Magento', logo: '🎯', status: 'verified', users: '800K+' },
        { name: 'BigCommerce', logo: '📈', status: 'verified', users: '600K+' },
        { name: 'Amazon Seller', logo: '📦', status: 'verified', users: '1.2M+' },
        { name: 'eBay', logo: '🏷️', status: 'verified', users: '700K+' },
        { name: 'Etsy', logo: '🎨', status: 'verified', users: '400K+' },
        { name: 'Prestashop', logo: '🏪', status: 'verified', users: '300K+' }
      ],
      features: [
        'Inventory synchronization',
        'Order management',
        'Sales analytics',
        'Multi-channel support'
      ]
    },
    {
      id: 'productivity',
      title: 'Productivity Tools',
      icon: Calendar,
      color: 'from-orange-500 to-red-500',
      description: 'Integrate with essential business productivity applications',
      partners: [
        { name: 'Microsoft 365', logo: '📊', status: 'verified', users: '2.5M+' },
        { name: 'Google Workspace', logo: '📧', status: 'verified', users: '2.2M+' },
        { name: 'Slack', logo: '💬', status: 'verified', users: '1.1M+' },
        { name: 'Zoom', logo: '📹', status: 'verified', users: '900K+' },
        { name: 'Trello', logo: '📋', status: 'verified', users: '650K+' },
        { name: 'Asana', logo: '✅', status: 'verified', users: '500K+' },
        { name: 'Monday.com', logo: '📅', status: 'verified', users: '400K+' },
        { name: 'Notion', logo: '📝', status: 'verified', users: '350K+' }
      ],
      features: [
        'Calendar integration',
        'Document sync',
        'Team collaboration',
        'Workflow automation'
      ]
    }
  ]

  const currentCategory = integrationCategories[activeCategory]
  const Icon = currentCategory.icon

  const stats = [
    { label: 'Total Integrations', value: '500+', icon: Globe },
    { label: 'API Calls/Month', value: '50M+', icon: Zap },
    { label: 'Uptime SLA', value: '99.9%', icon: Shield },
    { label: 'Avg Response Time', value: '<50ms', icon: Clock }
  ]

  return (
    <section className="py-20 bg-white">
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
            Integration Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect your favorite tools and services with our comprehensive integration 
            ecosystem. We support 500+ integrations to streamline your workflow.
          </p>
        </motion.div>

        {/* Stats Grid */}
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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <StatIcon size={20} className="text-white" />
                </div>
                <div className="font-bold text-2xl text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {integrationCategories.map((category, index) => {
            const CategoryIcon = category.icon
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === index
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CategoryIcon size={20} className="mr-2" />
                {category.title}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Integration Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12"
          >
            {/* Category Header */}
            <div className="flex items-center mb-8">
              <div className={`w-16 h-16 bg-gradient-to-r ${currentCategory.color} rounded-2xl flex items-center justify-center mr-6`}>
                <Icon size={28} className="text-white" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-2">
                  {currentCategory.title}
                </h3>
                <p className="text-lg text-gray-600">{currentCategory.description}</p>
              </div>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8">
              {currentCategory.partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="text-3xl mb-3">{partner.logo}</div>
                  <h4 className="font-semibold text-gray-900 mb-2">{partner.name}</h4>
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle size={14} className="text-green-500 mr-1" />
                    <span className="text-xs text-green-600 font-medium">{partner.status}</span>
                  </div>
                  <div className="text-xs text-gray-500">{partner.users} users</div>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                Key Integration Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCategory.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* API Documentation Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-4">
                Developer-Friendly APIs
              </h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                Build custom integrations with our comprehensive REST APIs and webhooks. 
                Complete documentation, SDKs, and sandbox environment included.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="font-bold text-xl mb-1">99.9%</div>
                  <div className="text-blue-100 text-sm">API Uptime</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="font-bold text-xl mb-1">&lt; 50ms</div>
                  <div className="text-blue-100 text-sm">Response Time</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <FileText size={16} className="mr-2" />
                  API Documentation
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Developer Portal
                </motion.button>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6">
              <h4 className="font-semibold text-lg mb-4">Popular API Endpoints</h4>
              <div className="space-y-3">
                {[
                  'GET /api/v1/transactions',
                  'POST /api/v1/invoices',
                  'GET /api/v1/analytics',
                  'POST /api/v1/webhooks'
                ].map((endpoint, index) => (
                  <motion.div
                    key={endpoint}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/10 rounded-lg p-3 font-mono text-sm"
                  >
                    {endpoint}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
            Need a Custom Integration?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our integration team can help you connect any tool or service. 
            Get in touch to discuss your specific requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Contact Integration Team
              <ArrowRight size={20} className="ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <Star size={16} className="mr-2" />
              Request Integration
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default IntegrationPartners