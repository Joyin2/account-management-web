'use client'

import { motion } from 'framer-motion'
import { UserPlus, Settings, TrendingUp, ArrowRight } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Create your account in minutes with our simple registration process. No credit card required for the free trial.',
      color: 'blue'
    },
    {
      step: 2,
      icon: Settings,
      title: 'Customize Dashboard',
      description: 'Set up your personalized dashboard with the tools and features that matter most to your business.',
      color: 'violet'
    },
    {
      step: 3,
      icon: TrendingUp,
      title: 'Manage & Grow',
      description: 'Start managing your business operations efficiently and watch your productivity soar with real-time insights.',
      color: 'green'
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-500',
        light: 'bg-blue-100',
        text: 'text-blue-600',
        gradient: 'from-blue-500 to-blue-600'
      },
      violet: {
        bg: 'bg-violet-500',
        light: 'bg-violet-100',
        text: 'text-violet-600',
        gradient: 'from-violet-500 to-violet-600'
      },
      green: {
        bg: 'bg-green-500',
        light: 'bg-green-100',
        text: 'text-green-600',
        gradient: 'from-green-500 to-green-600'
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

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
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get started with our platform in three simple steps. 
            From setup to success, we'll guide you every step of the way.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const colors = getColorClasses(step.color)
              
              return (
                <div key={step.step} className="flex items-center">
                  {/* Step Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center max-w-sm"
                  >
                    {/* Step Number & Icon */}
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                        <span className="font-bold text-gray-700 text-sm">{step.step}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-poppins font-semibold text-xl text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Arrow Connector */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                      viewport={{ once: true }}
                      className="mx-8 flex-shrink-0"
                    >
                      <div className="relative">
                        <ArrowRight size={32} className="text-gray-300" />
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          transition={{ duration: 1, delay: index * 0.2 + 0.6 }}
                          viewport={{ once: true }}
                          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 transform -translate-y-1/2"
                        ></motion.div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              const colors = getColorClasses(step.color)
              
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-6"
                >
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                        <span className="font-bold text-gray-700 text-xs">{step.step}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-poppins font-semibold text-lg text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="font-poppins font-semibold text-2xl text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses that have already transformed their operations with our platform.
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              Start Your Free Trial Today
            </button>
            <p className="text-sm text-gray-500 mt-3">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks