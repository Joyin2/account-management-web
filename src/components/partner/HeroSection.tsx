'use client'

import { motion } from 'framer-motion'
import { 
  Handshake, 
  TrendingUp, 
  Users, 
  Globe, 
  Award, 
  ArrowRight,
  CheckCircle,
  Star,
  DollarSign,
  Target,
  Zap,
  Shield
} from 'lucide-react'

const HeroSection = () => {
  const partnershipHighlights = [
    {
      icon: TrendingUp,
      title: 'Revenue Growth',
      description: 'Average 40% increase in partner revenue',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Customer Success',
      description: '95% customer satisfaction rate',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Market Leadership',
      description: 'Industry-leading solutions',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Expand to 40+ countries',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const trustIndicators = [
    { label: 'Active Partners', value: '2,500+' },
    { label: 'Countries', value: '40+' },
    { label: 'Partner Revenue', value: '$50M+' },
    { label: 'Success Rate', value: '95%' }
  ]

  const partnerBenefits = [
    'Comprehensive training and certification programs',
    'Dedicated partner success manager',
    'Marketing development funds and co-marketing opportunities',
    'Technical support and implementation assistance',
    'Competitive margins and incentive programs',
    'Access to exclusive partner portal and resources'
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative container-custom pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-violet-100 rounded-full text-blue-700 font-semibold text-sm"
            >
              <Handshake size={16} className="mr-2" />
              Partner Program 2024
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight">
                Partner With
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"> NextGen</span>
                <br />& Grow Together
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed max-w-xl"
            >
              Join our global partner ecosystem and unlock new revenue opportunities. 
              We provide the tools, training, and support you need to deliver exceptional 
              accounting solutions to your clients.
            </motion.p>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-3"
            >
              {partnerBenefits.slice(0, 3).map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  className="flex items-center text-gray-700"
                >
                  <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                Become a Partner
                <ArrowRight size={18} className="ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
              >
                Download Partner Kit
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200"
            >
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={indicator.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.1 + (index * 0.1) }}
                  className="text-center"
                >
                  <div className="font-bold text-2xl text-gray-900">{indicator.value}</div>
                  <div className="text-sm text-gray-600">{indicator.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Partnership Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Handshake size={28} className="text-white" />
                </div>
                <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-2">
                  Partnership Success
                </h3>
                <p className="text-gray-600">
                  Join thousands of successful partners worldwide
                </p>
              </div>

              {/* Partnership Highlights Grid */}
              <div className="grid grid-cols-2 gap-4">
                {partnershipHighlights.map((highlight, index) => {
                  const Icon = highlight.icon
                  return (
                    <motion.div
                      key={highlight.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-4 text-center hover:shadow-md transition-all duration-300"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${highlight.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {highlight.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {highlight.description}
                      </p>
                    </motion.div>
                  )
                })}
              </div>

              {/* Bottom Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span className="text-sm font-semibold text-gray-900">4.9/5</span>
                    <span className="text-sm text-gray-600 ml-1">Partner Rating</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-green-500 mr-1" />
                    <span className="text-sm font-semibold text-gray-900">$50M+</span>
                    <span className="text-sm text-gray-600 ml-1">Partner Revenue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-2xl shadow-lg"
            >
              <Target size={20} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white p-3 rounded-2xl shadow-lg"
            >
              <Zap size={20} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="absolute top-1/2 -left-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-2xl shadow-lg"
            >
              <Shield size={20} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection