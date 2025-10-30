'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen pt-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
            >
              Manage Your Business
              <span className="block text-yellow-300">with Ease</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed"
            >
              Streamline accounting, inventory, and more in one platform.
              Perfect for small and medium enterprises looking to grow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                <Play className="mr-2 w-5 h-5" />
                Book Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex items-center space-x-6 text-blue-100"
            >
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">10K+</span>
                <span className="ml-2">Active Users</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">99.9%</span>
                <span className="ml-2">Uptime</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Main Dashboard Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Dashboard Overview</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Chart Area */}
                <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-lg p-4 mb-4">
                  <div className="flex items-end space-x-2 h-32">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                        className="bg-gradient-to-t from-blue-500 to-violet-500 rounded-t flex-1 min-h-[8px]"
                      ></motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$24.5K</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-violet-600">89%</div>
                    <div className="text-sm text-gray-600">Growth</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -left-4 top-8 bg-white rounded-lg p-3 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Invoice Sent</div>
                    <div className="text-xs text-gray-500">2 min ago</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute -right-4 bottom-8 bg-white rounded-lg p-3 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">$</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Payment Received</div>
                    <div className="text-xs text-gray-500">$2,450</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          ></motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection