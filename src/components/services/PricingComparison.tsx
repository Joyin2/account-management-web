'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Zap,
  Shield,
  Users,
  Database,
  BarChart3,
  Headphones,
  Globe,
  ArrowRight,
  ChevronDown,
  Info,
  Calculator,
  CreditCard,
  FileText,
  Building2
} from 'lucide-react'

const PricingComparison = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small businesses and freelancers',
      icon: Star,
      color: 'from-blue-500 to-cyan-500',
      popular: false,
      pricing: {
        monthly: 29,
        yearly: 290
      },
      features: {
        'Basic Accounting': true,
        'Invoice Management': true,
        'Expense Tracking': true,
        'Basic Reports': true,
        'Bank Integration': '1 account',
        'Users': '1 user',
        'Storage': '5GB',
        'Email Support': true,
        'Mobile App': true,
        'API Access': false,
        'Advanced Analytics': false,
        'Multi-Currency': false,
        'Custom Branding': false,
        'Priority Support': false,
        'Dedicated Manager': false,
        'Custom Integrations': false,
        'Advanced Security': false,
        'Audit Trail': false
      },
      limits: {
        transactions: '500/month',
        invoices: '50/month',
        clients: '25'
      }
    },
    {
      id: 'growth',
      name: 'Growth',
      description: 'Ideal for growing businesses with advanced needs',
      icon: BarChart3,
      color: 'from-violet-500 to-purple-500',
      popular: true,
      pricing: {
        monthly: 79,
        yearly: 790
      },
      features: {
        'Basic Accounting': true,
        'Invoice Management': true,
        'Expense Tracking': true,
        'Basic Reports': true,
        'Bank Integration': '5 accounts',
        'Users': '5 users',
        'Storage': '50GB',
        'Email Support': true,
        'Mobile App': true,
        'API Access': true,
        'Advanced Analytics': true,
        'Multi-Currency': true,
        'Custom Branding': true,
        'Priority Support': true,
        'Dedicated Manager': false,
        'Custom Integrations': false,
        'Advanced Security': true,
        'Audit Trail': true
      },
      limits: {
        transactions: '5,000/month',
        invoices: '500/month',
        clients: 'Unlimited'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large organizations',
      icon: Crown,
      color: 'from-orange-500 to-red-500',
      popular: false,
      pricing: {
        monthly: 199,
        yearly: 1990
      },
      features: {
        'Basic Accounting': true,
        'Invoice Management': true,
        'Expense Tracking': true,
        'Basic Reports': true,
        'Bank Integration': 'Unlimited',
        'Users': 'Unlimited',
        'Storage': '500GB',
        'Email Support': true,
        'Mobile App': true,
        'API Access': true,
        'Advanced Analytics': true,
        'Multi-Currency': true,
        'Custom Branding': true,
        'Priority Support': true,
        'Dedicated Manager': true,
        'Custom Integrations': true,
        'Advanced Security': true,
        'Audit Trail': true
      },
      limits: {
        transactions: 'Unlimited',
        invoices: 'Unlimited',
        clients: 'Unlimited'
      }
    }
  ]

  const featureCategories = [
    {
      name: 'Core Features',
      features: ['Basic Accounting', 'Invoice Management', 'Expense Tracking', 'Basic Reports']
    },
    {
      name: 'Integration & Access',
      features: ['Bank Integration', 'Users', 'Storage', 'API Access']
    },
    {
      name: 'Advanced Features',
      features: ['Advanced Analytics', 'Multi-Currency', 'Custom Branding', 'Advanced Security']
    },
    {
      name: 'Support & Services',
      features: ['Email Support', 'Priority Support', 'Dedicated Manager', 'Custom Integrations']
    }
  ]

  const featureDescriptions: { [key: string]: string } = {
    'Basic Accounting': 'Complete double-entry bookkeeping with automated categorization',
    'Invoice Management': 'Professional invoicing with templates and automated reminders',
    'Expense Tracking': 'Track and categorize business expenses with receipt scanning',
    'Basic Reports': 'Essential financial reports including P&L and balance sheet',
    'Bank Integration': 'Connect bank accounts for automatic transaction import',
    'Users': 'Number of team members who can access the platform',
    'Storage': 'Cloud storage for documents, receipts, and financial data',
    'API Access': 'RESTful API for custom integrations and data export',
    'Advanced Analytics': 'Predictive insights, forecasting, and custom dashboards',
    'Multi-Currency': 'Handle international transactions and multiple currencies',
    'Custom Branding': 'White-label invoices and reports with your company branding',
    'Advanced Security': 'Enhanced security features including 2FA and encryption',
    'Email Support': 'Standard email support during business hours',
    'Priority Support': '24/7 priority support with faster response times',
    'Dedicated Manager': 'Personal account manager for enterprise customers',
    'Custom Integrations': 'Bespoke integrations built specifically for your needs',
    'Audit Trail': 'Complete audit trail for compliance and security',
    'Mobile App': 'Full-featured mobile applications for iOS and Android'
  }

  const savings = {
    growth: Math.round(((79 * 12) - 790) / (79 * 12) * 100),
    enterprise: Math.round(((199 * 12) - 1990) / (199 * 12) * 100)
  }

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
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Select the perfect plan for your business needs. All plans include our core 
            features with varying levels of advanced functionality and support.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center bg-white rounded-2xl p-2 max-w-xs mx-auto shadow-lg">
            <motion.button
              onClick={() => setBillingCycle('monthly')}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </motion.button>
            <motion.button
              onClick={() => setBillingCycle('yearly')}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {plans.map((plan, index) => {
            const PlanIcon = plan.icon
            const monthlyPrice = plan.pricing[billingCycle as keyof typeof plan.pricing]
            const yearlyPrice = plan.pricing.yearly
            const isYearly = billingCycle === 'yearly'
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-violet-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <PlanIcon size={28} className="text-white" />
                  </div>
                  
                  <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ${isYearly ? Math.round(yearlyPrice / 12) : monthlyPrice}
                      </span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                    
                    {isYearly && plan.id !== 'starter' && (
                      <div className="text-green-600 text-sm font-semibold mt-2">
                        Save {plan.id === 'growth' ? savings.growth : savings.enterprise}% annually
                      </div>
                    )}
                    
                    {isYearly && (
                      <div className="text-gray-500 text-sm mt-1">
                        Billed annually (${yearlyPrice})
                      </div>
                    )}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg'
                    }`}
                  >
                    Start Free Trial
                  </motion.button>
                </div>
                
                {/* Plan Limits */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Usage Limits</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transactions</span>
                      <span className="font-semibold">{plan.limits.transactions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Invoices</span>
                      <span className="font-semibold">{plan.limits.invoices}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Clients</span>
                      <span className="font-semibold">{plan.limits.clients}</span>
                    </div>
                  </div>
                </div>
                
                {/* Key Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                  <div className="space-y-2">
                    {Object.entries(plan.features).slice(0, 6).map(([feature, included]) => (
                      <div key={feature} className="flex items-center text-sm">
                        {included === true ? (
                          <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                        ) : included === false ? (
                          <X size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        ) : (
                          <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                        )}
                        <span className={included === false ? 'text-gray-400' : 'text-gray-700'}>
                          {feature}
                          {typeof included === 'string' && (
                            <span className="text-blue-600 font-semibold ml-1">({included})</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Detailed Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
        >
          <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-8 text-center">
            Complete Feature Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-4">
                      <div className="font-semibold text-gray-900">{plan.name}</div>
                      <div className="text-sm text-gray-600">
                        ${billingCycle === 'yearly' ? Math.round(plan.pricing.yearly / 12) : plan.pricing.monthly}/mo
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureCategories.map((category) => (
                  <React.Fragment key={category.name}>
                    <tr>
                      <td colSpan={4} className="py-4 px-4">
                        <div className="font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                          {category.name}
                        </div>
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-gray-700">{feature}</span>
                            <motion.button
                              onClick={() => setExpandedFeature(expandedFeature === feature ? null : feature)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              <Info size={14} />
                            </motion.button>
                          </div>
                          <AnimatePresence>
                            {expandedFeature === feature && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-sm text-gray-600 mt-2 bg-blue-50 p-3 rounded-lg"
                              >
                                {featureDescriptions[feature]}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                        {plans.map((plan) => {
                          const featureValue = plan.features[feature as keyof typeof plan.features]
                          return (
                            <td key={plan.id} className="py-3 px-4 text-center">
                              {featureValue === true ? (
                                <Check size={20} className="text-green-500 mx-auto" />
                              ) : featureValue === false ? (
                                <X size={20} className="text-gray-400 mx-auto" />
                              ) : (
                                <span className="text-blue-600 font-semibold text-sm">
                                  {featureValue}
                                </span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
            Questions About Pricing?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan for your business. 
            Get personalized recommendations and answers to your questions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <Headphones size={16} className="mr-2" />
              Talk to Sales
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <Calculator size={16} className="mr-2" />
              ROI Calculator
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingComparison