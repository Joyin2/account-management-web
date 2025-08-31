'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, 
  BarChart3, 
  FileText, 
  CreditCard, 
  Database, 
  Shield,
  ChevronRight,
  CheckCircle,
  Play,
  Download,
  ExternalLink,
  Zap,
  Clock,
  Users
} from 'lucide-react'

const FeatureDetails = () => {
  const [activeTab, setActiveTab] = useState(0)

  const featureCategories = [
    {
      id: 'accounting',
      title: 'Smart Accounting',
      icon: Calculator,
      color: 'from-blue-500 to-cyan-500',
      description: 'Automated bookkeeping with AI-powered insights',
      features: [
        {
          title: 'Automated Transaction Categorization',
          description: 'AI automatically categorizes transactions with 99.9% accuracy, learning from your business patterns.',
          benefits: ['Save 15+ hours per week', 'Reduce human error', 'Consistent categorization'],
          demo: 'Watch Demo',
          technical: 'Machine learning algorithms trained on millions of transactions'
        },
        {
          title: 'Real-time Financial Reporting',
          description: 'Generate comprehensive financial reports instantly with live data synchronization.',
          benefits: ['Always up-to-date reports', 'Multiple report formats', 'Custom report builder'],
          demo: 'View Sample Report',
          technical: 'Real-time data processing with sub-second latency'
        },
        {
          title: 'Multi-Currency Support',
          description: 'Handle international transactions with automatic currency conversion and rate tracking.',
          benefits: ['Support 150+ currencies', 'Real-time exchange rates', 'Automatic conversion'],
          demo: 'Currency Demo',
          technical: 'Integration with major currency exchange APIs'
        },
        {
          title: 'Tax Preparation Assistant',
          description: 'Streamline tax preparation with automated tax calculations and compliance checks.',
          benefits: ['Reduce tax prep time by 70%', 'Ensure compliance', 'Audit trail maintenance'],
          demo: 'Tax Features',
          technical: 'Updated tax rules for 50+ jurisdictions'
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      icon: BarChart3,
      color: 'from-purple-500 to-violet-500',
      description: 'Powerful insights and predictive analytics',
      features: [
        {
          title: 'Interactive Dashboards',
          description: 'Customizable dashboards with drag-and-drop widgets and real-time data visualization.',
          benefits: ['Personalized views', 'Real-time updates', 'Mobile responsive'],
          demo: 'Dashboard Demo',
          technical: 'Built with D3.js and WebGL for smooth performance'
        },
        {
          title: 'Predictive Analytics',
          description: 'AI-powered forecasting to predict cash flow, revenue trends, and business growth.',
          benefits: ['Forecast accuracy 95%+', 'Early trend detection', 'Scenario planning'],
          demo: 'Prediction Demo',
          technical: 'Advanced ML models with continuous learning'
        },
        {
          title: 'Custom Report Builder',
          description: 'Create custom reports with advanced filtering, grouping, and visualization options.',
          benefits: ['Unlimited customization', 'Scheduled reports', 'Export to multiple formats'],
          demo: 'Report Builder',
          technical: 'SQL-based query engine with visual interface'
        },
        {
          title: 'Performance Benchmarking',
          description: 'Compare your business performance against industry standards and competitors.',
          benefits: ['Industry insights', 'Competitive analysis', 'Growth opportunities'],
          demo: 'Benchmark Demo',
          technical: 'Anonymized data from 10,000+ businesses'
        }
      ]
    },
    {
      id: 'invoicing',
      title: 'E-Invoicing',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      description: 'Professional invoicing and billing automation',
      features: [
        {
          title: 'Smart Invoice Templates',
          description: 'Professional, customizable invoice templates that adapt to your brand and business needs.',
          benefits: ['Brand consistency', 'Professional appearance', 'Mobile-optimized'],
          demo: 'Template Gallery',
          technical: 'HTML/CSS templates with dynamic data binding'
        },
        {
          title: 'Automated Payment Reminders',
          description: 'Intelligent reminder system that follows up on overdue invoices automatically.',
          benefits: ['Get paid 40% faster', 'Reduce manual follow-up', 'Customizable sequences'],
          demo: 'Reminder System',
          technical: 'Rule-based automation with personalization'
        },
        {
          title: 'Recurring Billing',
          description: 'Set up subscription billing and recurring invoices with flexible scheduling options.',
          benefits: ['Predictable revenue', 'Automated billing', 'Flexible schedules'],
          demo: 'Recurring Demo',
          technical: 'Cron-based scheduling with failure handling'
        },
        {
          title: 'Multi-language Support',
          description: 'Generate invoices in multiple languages with localized formatting and currency.',
          benefits: ['Global reach', 'Localized experience', 'Cultural adaptation'],
          demo: 'Language Demo',
          technical: 'i18n framework with 25+ language packs'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payment Processing',
      icon: CreditCard,
      color: 'from-orange-500 to-red-500',
      description: 'Secure and flexible payment solutions',
      features: [
        {
          title: 'Multiple Payment Gateways',
          description: 'Integrate with 50+ payment processors for maximum flexibility and redundancy.',
          benefits: ['Higher success rates', 'Lower fees', 'Global coverage'],
          demo: 'Gateway Demo',
          technical: 'Unified API with automatic failover'
        },
        {
          title: 'Advanced Fraud Detection',
          description: 'AI-powered fraud prevention with real-time risk assessment and blocking.',
          benefits: ['Reduce chargebacks by 90%', 'Real-time protection', 'Machine learning'],
          demo: 'Security Demo',
          technical: 'ML models trained on billions of transactions'
        },
        {
          title: 'Subscription Management',
          description: 'Complete subscription lifecycle management with dunning, upgrades, and analytics.',
          benefits: ['Reduce churn', 'Automated dunning', 'Revenue optimization'],
          demo: 'Subscription Demo',
          technical: 'Event-driven architecture with webhooks'
        },
        {
          title: 'Mobile Payment Support',
          description: 'Accept payments through mobile apps, QR codes, and contactless methods.',
          benefits: ['Modern payment methods', 'Better UX', 'Higher conversion'],
          demo: 'Mobile Demo',
          technical: 'Native SDKs for iOS and Android'
        }
      ]
    }
  ]

  const currentCategory = featureCategories[activeTab]
  const Icon = currentCategory.icon

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
            Feature Deep Dive
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore the powerful capabilities that make our platform the preferred 
            choice for businesses worldwide. Each feature is designed with precision 
            and built for scale.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {featureCategories.map((category, index) => {
            const TabIcon = category.icon
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveTab(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <TabIcon size={20} className="mr-2" />
                {category.title}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Feature Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
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

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {currentCategory.features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <h4 className="font-poppins font-bold text-xl text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  {/* Benefits */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Key Benefits:</h5>
                    <ul className="space-y-1">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Technical Info */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Zap size={14} className="text-blue-600 mr-2" />
                      <span className="text-sm font-semibold text-blue-900">Technical:</span>
                    </div>
                    <p className="text-sm text-blue-800">{feature.technical}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300"
                    >
                      <Play size={14} className="mr-2" />
                      {feature.demo}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                    >
                      <Download size={14} className="mr-2" />
                      Documentation
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Category Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="text-center bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={20} className="text-white" />
                </div>
                <div className="font-bold text-2xl text-gray-900 mb-1">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              
              <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock size={20} className="text-white" />
                </div>
                <div className="font-bold text-2xl text-gray-900 mb-1">99.9%</div>
                <div className="text-sm text-gray-600">Uptime SLA</div>
              </div>
              
              <div className="text-center bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap size={20} className="text-white" />
                </div>
                <div className="font-bold text-2xl text-gray-900 mb-1">&lt; 100ms</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
            Ready to Experience These Features?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see how our advanced features can transform your business operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Start Free Trial
              <ChevronRight size={20} className="ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <ExternalLink size={16} className="mr-2" />
              View All Features
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeatureDetails