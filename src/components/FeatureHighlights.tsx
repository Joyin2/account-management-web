'use client'

import { motion } from 'framer-motion'
import { Calculator, Warehouse, FileText, Building2, BarChart3, Settings } from 'lucide-react'

const FeatureHighlights = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Smart Accounting',
      description: 'Automate bookkeeping and compliance with intelligent financial management tools.',
      color: 'blue'
    },
    {
      icon: Warehouse,
      title: 'Inventory Management',
      description: 'Track stock in real-time with automated alerts and comprehensive reporting.',
      color: 'green'
    },
    {
      icon: FileText,
      title: 'E-Invoicing',
      description: 'Create and send professional e-invoices effortlessly with automated workflows.',
      color: 'violet'
    },
    {
      icon: Building2,
      title: 'Banking Integration',
      description: 'Seamless bank reconciliation with secure connections to major financial institutions.',
      color: 'indigo'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Gain insightful analytics with customizable dashboards and detailed reports.',
      color: 'orange'
    },
    {
      icon: Settings,
      title: 'Custom Solutions',
      description: 'Tailored features for your specific business type and industry requirements.',
      color: 'teal'
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white',
      green: 'bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white',
      violet: 'bg-violet-100 text-violet-600 group-hover:bg-violet-500 group-hover:text-white',
      indigo: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white',
      orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white',
      teal: 'bg-teal-100 text-teal-600 group-hover:bg-teal-500 group-hover:text-white'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <section className="py-20 bg-gray-50">
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
            Everything You Need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Grow Your Business
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive suite of business management tools helps you streamline operations, 
            increase efficiency, and focus on what matters most - growing your business.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="card h-full">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      getColorClasses(feature.color)
                    }`}>
                      <Icon size={32} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-poppins font-semibold text-xl text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="mt-auto">
                    <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 group-hover:underline">
                      Learn More →
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="font-poppins font-semibold text-2xl text-gray-900 mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses already using our platform to streamline their operations and accelerate growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Start Free Trial
              </button>
              <button className="btn-secondary">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeatureHighlights