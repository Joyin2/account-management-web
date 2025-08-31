'use client'

import { motion } from 'framer-motion'
import { 
  Calculator, 
  BarChart3, 
  FileText, 
  CreditCard, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'

const HeroSection = () => {
  const keyFeatures = [
    'Smart Accounting Automation',
    'Real-time Financial Analytics',
    'Seamless Banking Integration',
    'Advanced Security & Compliance'
  ]

  const serviceIcons = [
    { icon: Calculator, label: 'Accounting', color: 'from-blue-500 to-cyan-500' },
    { icon: BarChart3, label: 'Analytics', color: 'from-purple-500 to-violet-500' },
    { icon: FileText, label: 'Invoicing', color: 'from-green-500 to-emerald-500' },
    { icon: CreditCard, label: 'Payments', color: 'from-orange-500 to-red-500' },
    { icon: Shield, label: 'Security', color: 'from-indigo-500 to-blue-500' },
    { icon: Zap, label: 'Automation', color: 'from-yellow-500 to-orange-500' }
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold"
            >
              <Star size={16} className="mr-2" />
              Complete Financial Management Suite
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight"
              >
                Powerful Services for
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"> Modern Businesses</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed max-w-2xl"
              >
                From automated bookkeeping to advanced analytics, our comprehensive suite 
                of financial services helps businesses of all sizes streamline operations, 
                reduce costs, and accelerate growth.
              </motion.p>
            </div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-3"
            >
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-center"
                >
                  <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
              >
                Explore All Services
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                Schedule Demo
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center space-x-6 pt-6 border-t border-gray-200"
            >
              <div className="text-center">
                <div className="font-bold text-2xl text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Service Icons Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Service Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
              {serviceIcons.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={service.label}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <h3 className="font-poppins font-semibold text-lg text-gray-900 mb-2">
                      {service.label}
                    </h3>
                    <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                  </motion.div>
                )
              })}
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Zap size={24} className="text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Shield size={20} className="text-white" />
            </motion.div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-violet-100 rounded-3xl -z-10 transform rotate-3 scale-105 opacity-50" />
          </motion.div>
        </div>

        {/* Bottom Section - Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-bold text-3xl text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Core Services</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-green-600 mb-2">100+</div>
              <div className="text-gray-600">Integrations</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-orange-600 mb-2">SOC 2</div>
              <div className="text-gray-600">Certified</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection