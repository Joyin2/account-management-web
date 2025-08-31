'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Users,
  Shield,
  Zap,
  CreditCard,
  Settings,
  Database,
  Globe,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState(0)
  const [openItems, setOpenItems] = useState<number[]>([0])

  const faqCategories = [
    {
      id: 'general',
      title: 'General',
      icon: HelpCircle,
      color: 'from-blue-500 to-cyan-500',
      questions: [
        {
          question: 'What is NextGen Accounts and how does it work?',
          answer: 'NextGen Accounts is a comprehensive cloud-based accounting platform designed for modern businesses. It automates financial processes, provides real-time insights, and integrates with your existing tools. Simply sign up, connect your bank accounts and business tools, and our AI-powered system will start organizing your financial data automatically.'
        },
        {
          question: 'Who can benefit from using NextGen Accounts?',
          answer: 'Our platform is designed for businesses of all sizes - from freelancers and startups to large enterprises. Whether you\'re a small business owner managing your own books, an accounting professional serving multiple clients, or a CFO overseeing complex financial operations, NextGen Accounts scales to meet your needs.'
        },
        {
          question: 'How long does it take to set up my account?',
          answer: 'Most users can get started within 15 minutes. Our guided onboarding process walks you through connecting your bank accounts, importing existing data, and configuring your preferences. For more complex setups with multiple entities or custom integrations, our support team can assist with implementation.'
        },
        {
          question: 'Can I import data from my current accounting software?',
          answer: 'Yes! We support data import from 50+ accounting platforms including QuickBooks, Xero, Sage, FreshBooks, and more. Our migration specialists can help ensure a smooth transition with zero data loss. We also provide detailed migration guides and tools for self-service imports.'
        }
      ]
    },
    {
      id: 'pricing',
      title: 'Pricing & Plans',
      icon: CreditCard,
      color: 'from-green-500 to-emerald-500',
      questions: [
        {
          question: 'What\'s included in the free trial?',
          answer: 'Our 14-day free trial includes full access to all features in the Growth plan - unlimited transactions, advanced reporting, multi-user access, API integrations, and priority support. No credit card required to start, and you can upgrade or downgrade at any time.'
        },
        {
          question: 'Can I change my plan at any time?',
          answer: 'Absolutely! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately, and we\'ll prorate any billing adjustments. If you downgrade, you\'ll retain access to premium features until your current billing period ends.'
        },
        {
          question: 'Do you offer discounts for annual billing?',
          answer: 'Yes! Annual subscribers save 20% compared to monthly billing. We also offer special discounts for nonprofits (30% off), students (50% off), and startups in accelerator programs. Contact our sales team for volume discounts on Enterprise plans.'
        },
        {
          question: 'What happens if I exceed my plan limits?',
          answer: 'We\'ll notify you when you\'re approaching your limits and offer options to upgrade. If you temporarily exceed limits, we provide a grace period before any restrictions apply. Our system is designed to grow with your business without unexpected interruptions.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      color: 'from-purple-500 to-violet-500',
      questions: [
        {
          question: 'How secure is my financial data?',
          answer: 'Your data security is our top priority. We use bank-level encryption (AES-256), maintain SOC 2 Type II compliance, and store data in secure, geographically distributed data centers. All data transmission uses TLS 1.3 encryption, and we never store your banking credentials.'
        },
        {
          question: 'Who has access to my data?',
          answer: 'Only you and users you explicitly authorize can access your data. Our employees undergo background checks and can only access data for support purposes with your explicit permission. We never sell, share, or use your data for advertising. You maintain complete ownership and control.'
        },
        {
          question: 'How do you handle data backups and recovery?',
          answer: 'We perform automated daily backups with 30-day retention, stored across multiple geographic locations. Our disaster recovery plan ensures 99.9% uptime with automatic failover. You can also export your data at any time in standard formats for your own backup purposes.'
        },
        {
          question: 'Are you compliant with GDPR and other privacy regulations?',
          answer: 'Yes, we\'re fully compliant with GDPR, CCPA, and other major privacy regulations. We provide data portability, right to deletion, and transparent privacy controls. Our privacy policy clearly outlines how we collect, use, and protect your information.'
        }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Settings,
      color: 'from-orange-500 to-red-500',
      questions: [
        {
          question: 'Which banks and financial institutions do you support?',
          answer: 'We connect with 12,000+ banks and financial institutions worldwide through secure, read-only connections. This includes major banks like Chase, Bank of America, Wells Fargo, and international banks across 40+ countries. We use bank-approved APIs and never store your login credentials.'
        },
        {
          question: 'What business tools can I integrate with?',
          answer: 'We integrate with 200+ business applications including Shopify, WooCommerce, Stripe, PayPal, Salesforce, HubSpot, Slack, and more. Our API allows custom integrations, and we regularly add new integrations based on customer requests.'
        },
        {
          question: 'How do integrations work and are they secure?',
          answer: 'All integrations use secure, encrypted connections with OAuth 2.0 authentication where possible. We only request the minimum permissions needed and never store sensitive credentials. Data syncs happen in real-time or on scheduled intervals, and you can monitor all integration activity.'
        },
        {
          question: 'Can I build custom integrations using your API?',
          answer: 'Yes! Our RESTful API and webhooks allow you to build custom integrations and automate workflows. We provide comprehensive documentation, SDKs for popular languages, and sandbox environments for testing. Our developer support team is available to assist with implementation.'
        }
      ]
    },
    {
      id: 'support',
      title: 'Support & Training',
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      questions: [
        {
          question: 'What support options are available?',
          answer: 'We offer multiple support channels: 24/7 live chat, email support with 4-hour response time, phone support during business hours, and a comprehensive knowledge base. Enterprise customers get dedicated account managers and priority support with 1-hour response times.'
        },
        {
          question: 'Do you provide training and onboarding?',
          answer: 'Yes! We offer free onboarding sessions, video tutorials, webinar training, and detailed documentation. Enterprise customers receive personalized training sessions and ongoing education. Our customer success team ensures you get maximum value from the platform.'
        },
        {
          question: 'Is there a user community or forum?',
          answer: 'We maintain an active user community forum where you can ask questions, share best practices, and connect with other users. We also host monthly user meetups, quarterly webinars, and an annual user conference with advanced training sessions.'
        },
        {
          question: 'How do I report bugs or request new features?',
          answer: 'You can report issues or suggest features through our in-app feedback system, support portal, or community forum. We track all requests and provide regular updates on our product roadmap. Many of our best features come from user suggestions!'
        }
      ]
    }
  ]

  const currentCategory = faqCategories[activeCategory]
  const CategoryIcon = currentCategory.icon

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const supportOptions = [
    {
      title: 'Live Chat',
      description: '24/7 instant support',
      icon: MessageCircle,
      action: 'Start Chat',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Phone Support',
      description: 'Speak with an expert',
      icon: Phone,
      action: 'Call Now',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Email Support',
      description: 'Detailed assistance',
      icon: Mail,
      action: 'Send Email',
      color: 'from-purple-500 to-violet-500'
    }
  ]

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
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our platform, features, and services. 
            Can't find what you're looking for? Our support team is here to help.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {faqCategories.map((category, index) => {
            const TabIcon = category.icon
            return (
              <motion.button
                key={category.id}
                onClick={() => {
                  setActiveCategory(index)
                  setOpenItems([0]) // Open first item of new category
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === index
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <TabIcon size={20} className="mr-2" />
                {category.title}
              </motion.button>
            )
          })}
        </motion.div>

        {/* FAQ Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Items */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Category Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center mb-6"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${currentCategory.color} rounded-xl flex items-center justify-center mr-4`}>
                    <CategoryIcon size={24} className="text-white" />
                  </div>
                  <h3 className="font-poppins font-bold text-2xl text-gray-900">
                    {currentCategory.title} Questions
                  </h3>
                </motion.div>

                {/* FAQ Items */}
                {currentCategory.questions.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                    >
                      <h4 className="font-semibold text-gray-900 pr-4">
                        {item.question}
                      </h4>
                      <motion.div
                        animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown size={20} className="text-gray-500" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {openItems.includes(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Support Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-8"
            >
              <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                Need More Help?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our support team is ready to assist you.
              </p>

              <div className="space-y-4">
                {supportOptions.map((option, index) => {
                  const OptionIcon = option.icon
                  return (
                    <motion.button
                      key={option.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full bg-gradient-to-r ${option.color} text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center`}
                    >
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                        <OptionIcon size={18} />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{option.title}</div>
                        <div className="text-sm opacity-90">{option.description}</div>
                      </div>
                      <ArrowRight size={16} className="ml-auto" />
                    </motion.button>
                  )
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Support Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Response Time</span>
                    <span className="font-semibold text-gray-900">&lt; 4 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-semibold text-green-600">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Contact Resolution</span>
                    <span className="font-semibold text-blue-600">89%</span>
                  </div>
                </div>
              </div>

              {/* Knowledge Base Link */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 border-2 border-gray-200 text-gray-700 p-3 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
              >
                <ExternalLink size={16} className="mr-2" />
                Browse Knowledge Base
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-4">
            Still Have Questions?
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Our team of experts is here to help you succeed. Schedule a personalized demo 
            or speak with our specialists about your specific needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <MessageCircle size={16} className="mr-2" />
              Schedule a Demo
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
            >
              <Phone size={16} className="mr-2" />
              Contact Sales
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ