'use client'

import { motion } from 'framer-motion'
import { 
  Calculator, 
  BarChart3, 
  FileText, 
  CreditCard, 
  Shield, 
  Zap,
  Users,
  TrendingUp,
  Database,
  Globe,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'

const ServiceOverview = () => {
  const services = [
    {
      icon: Calculator,
      title: 'Smart Accounting',
      description: 'Automated bookkeeping with AI-powered categorization and real-time financial tracking.',
      features: [
        'Automated transaction categorization',
        'Real-time financial reporting',
        'Multi-currency support',
        'Tax preparation assistance'
      ],
      benefits: [
        'Save 15+ hours per week',
        '99.9% accuracy guarantee',
        'Reduce accounting costs by 60%'
      ],
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Powerful insights and forecasting tools to drive data-driven business decisions.',
      features: [
        'Interactive dashboards',
        'Predictive analytics',
        'Custom report builder',
        'Performance benchmarking'
      ],
      benefits: [
        'Increase revenue by 25%',
        'Identify trends early',
        'Make informed decisions'
      ],
      color: 'from-purple-500 to-violet-500',
      popular: true
    },
    {
      icon: FileText,
      title: 'E-Invoicing & Billing',
      description: 'Professional invoicing with automated follow-ups and integrated payment processing.',
      features: [
        'Customizable invoice templates',
        'Automated payment reminders',
        'Recurring billing setup',
        'Multi-language support'
      ],
      benefits: [
        'Get paid 40% faster',
        'Reduce manual work',
        'Improve cash flow'
      ],
      color: 'from-green-500 to-emerald-500',
      popular: false
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Secure payment gateway with support for multiple payment methods and currencies.',
      features: [
        'Multiple payment gateways',
        'Fraud detection & prevention',
        'Subscription management',
        'Mobile payment support'
      ],
      benefits: [
        'Accept payments globally',
        'Reduce transaction fees',
        'Enhance security'
      ],
      color: 'from-orange-500 to-red-500',
      popular: false
    },
    {
      icon: Database,
      title: 'Inventory Management',
      description: 'Complete inventory tracking with automated reordering and supplier management.',
      features: [
        'Real-time stock tracking',
        'Automated reorder points',
        'Supplier management',
        'Barcode scanning'
      ],
      benefits: [
        'Reduce stockouts by 80%',
        'Optimize inventory costs',
        'Streamline operations'
      ],
      color: 'from-indigo-500 to-blue-500',
      popular: false
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with comprehensive compliance management.',
      features: [
        'Bank-level encryption',
        'SOC 2 Type II certified',
        'GDPR compliance',
        'Regular security audits'
      ],
      benefits: [
        'Protect sensitive data',
        'Meet regulatory requirements',
        'Build customer trust'
      ],
      color: 'from-red-500 to-pink-500',
      popular: false
    }
  ]

  const additionalServices = [
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Multi-user access with role-based permissions and real-time collaboration tools.'
    },
    {
      icon: TrendingUp,
      title: 'Financial Forecasting',
      description: 'AI-powered predictions and scenario planning for better financial planning.'
    },
    {
      icon: Globe,
      title: 'Multi-Location Support',
      description: 'Manage multiple business locations with centralized reporting and control.'
    },
    {
      icon: Zap,
      title: 'Workflow Automation',
      description: 'Custom automation rules to streamline repetitive tasks and processes.'
    }
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
            Complete Service Portfolio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to manage your business finances efficiently. 
            Our integrated suite of services works together seamlessly to provide 
            a comprehensive solution for businesses of all sizes.
          </p>
        </motion.div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} className="text-white" />
                </div>
                
                {/* Content */}
                <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle size={16} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Benefits */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                  <div className="space-y-2">
                    {service.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center">
                        <TrendingUp size={14} className="text-blue-500 mr-2" />
                        <span className="text-sm text-gray-700 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-violet-500 hover:text-white transition-all duration-300 flex items-center justify-center group"
                >
                  Learn More
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-4">
              Additional Capabilities
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Extend your financial management with these powerful add-on services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h4 className="font-poppins font-semibold text-lg text-gray-900 mb-2">
                    {service.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {service.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Service Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-8">
            <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-4">
              Why Choose Our Services?
            </h3>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Compare our comprehensive solution with traditional alternatives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Save Time</h4>
              <p className="text-blue-100">Reduce manual work by 80% with our automation tools</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign size={24} className="text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Cut Costs</h4>
              <p className="text-blue-100">Lower operational costs compared to traditional solutions</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Grow Faster</h4>
              <p className="text-blue-100">Scale your business with insights and automation</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ServiceOverview