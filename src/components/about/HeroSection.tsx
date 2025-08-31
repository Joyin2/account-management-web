'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Users, Target, Award } from 'lucide-react'

const HeroSection = () => {
  const highlights = [
    {
      icon: Users,
      value: '50,000+',
      label: 'Happy Customers'
    },
    {
      icon: Target,
      value: '99.9%',
      label: 'Uptime Guarantee'
    },
    {
      icon: Award,
      value: '15+',
      label: 'Industry Awards'
    }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-violet-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-200/30 to-blue-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block bg-gradient-to-r from-blue-100 to-violet-100 px-6 py-3 rounded-full mb-6"
            >
              <span className="text-blue-600 font-semibold">About NextGen Accounts</span>
            </motion.div>
            
            <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
              Revolutionizing Business
              <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Financial Management
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              We're on a mission to empower businesses of all sizes with intelligent, 
              intuitive accounting solutions that drive growth and success.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button className="btn-primary text-lg px-8 py-4">
                Our Story
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Meet the Team
              </button>
            </motion.div>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <motion.div
                  key={highlight.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center mb-4">
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="font-poppins font-bold text-3xl text-gray-900 mb-2">
                      {highlight.value}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {highlight.label}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col items-center"
          >
            <span className="text-gray-500 text-sm mb-4">Discover Our Journey</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <ArrowDown size={16} className="text-gray-400" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-violet-400/20 rounded-2xl backdrop-blur-sm hidden lg:block"
      />
      
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 right-10 w-16 h-16 bg-gradient-to-r from-violet-400/20 to-blue-400/20 rounded-full backdrop-blur-sm hidden lg:block"
      />
    </section>
  )
}

export default HeroSection