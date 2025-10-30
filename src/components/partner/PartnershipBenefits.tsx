'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  BookOpen, 
  Headphones, 
  Award,
  Target,
  Zap,
  Shield,
  Globe,
  Briefcase,
  Star,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Lightbulb,
  Heart,
  Rocket
} from 'lucide-react'

const PartnershipBenefits = () => {
  const mainBenefits = [
    {
      icon: TrendingUp,
      title: 'Revenue Growth',
      description: 'Unlock new revenue streams with our comprehensive partner program',
      features: [
        'Competitive margins up to 40%',
        'Recurring revenue opportunities',
        'Performance-based incentives',
        'Volume discount tiers'
      ],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      icon: BookOpen,
      title: 'Training & Certification',
      description: 'Comprehensive training programs to ensure your success',
      features: [
        'Product certification courses',
        'Sales methodology training',
        'Technical implementation workshops',
        'Ongoing education programs'
      ],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description: 'Get the support you need to deliver exceptional customer experiences',
      features: [
        'Dedicated partner success manager',
        'Technical support team',
        '24/7 customer support',
        'Implementation assistance'
      ],
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50'
    },
    {
      icon: Target,
      title: 'Marketing Support',
      description: 'Comprehensive marketing resources to help you succeed',
      features: [
        'Marketing development funds',
        'Co-marketing opportunities',
        'Sales collateral and tools',
        'Lead generation programs'
      ],
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Expand your business to new markets and geographies',
      features: [
        'Access to 40+ countries',
        'Multi-language support',
        'Local compliance expertise',
        'Regional partner networks'
      ],
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50'
    },
    {
      icon: Award,
      title: 'Recognition Program',
      description: 'Get recognized for your achievements and success',
      features: [
        'Partner of the Year awards',
        'Performance recognition',
        'Case study opportunities',
        'Speaking opportunities'
      ],
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50'
    }
  ]

  const additionalBenefits = [
    {
      icon: Zap,
      title: 'Fast Implementation',
      description: 'Quick setup and deployment',
      stat: '< 30 days'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security standards',
      stat: 'SOC 2 Certified'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting tools',
      stat: '50+ Reports'
    },
    {
      icon: Users,
      title: 'Customer Success',
      description: 'High customer satisfaction',
      stat: '98.5% CSAT'
    }
  ]

  const partnerJourney = [
    {
      step: '01',
      title: 'Apply & Qualify',
      description: 'Submit your application and meet our partner criteria',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: '02',
      title: 'Training & Certification',
      description: 'Complete our comprehensive training program',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500'
    },
    {
      step: '03',
      title: 'Launch & Support',
      description: 'Start selling with full marketing and technical support',
      icon: Rocket,
      color: 'from-purple-500 to-violet-500'
    },
    {
      step: '04',
      title: 'Grow & Succeed',
      description: 'Scale your business with ongoing support and resources',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
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
            Why Partner With Us?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our thriving partner ecosystem and unlock unprecedented growth opportunities. 
            We provide everything you need to succeed in the accounting software market.
          </p>
        </motion.div>

        {/* Main Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {mainBenefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br ${benefit.bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                
                <h3 className="font-poppins font-bold text-xl text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {benefit.description}
                </p>
                
                <ul className="space-y-2">
                  {benefit.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: (index * 0.1) + (featureIndex * 0.05) }}
                      viewport={{ once: true }}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {additionalBenefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-white" />
                </div>
                <div className="font-bold text-2xl text-gray-900 mb-1">{benefit.stat}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Partner Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-4">
              Your Partner Journey
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From application to success, we'll guide you every step of the way
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnerJourney.map((step, index) => {
              const StepIcon = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {index < partnerJourney.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-violet-200 z-0"></div>
                  )}
                  
                  <div className="relative bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <StepIcon size={24} className="text-white" />
                    </div>
                    
                    <div className="text-sm font-bold text-gray-400 mb-2">STEP {step.step}</div>
                    <h4 className="font-poppins font-bold text-lg text-gray-900 mb-3">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
            Ready to Start Your Partnership Journey?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful partners who are growing their business with NextGen Accounts. 
            Apply today and start your journey to success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Apply Now
              <ArrowRight size={16} className="ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <Heart size={16} className="mr-2" />
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PartnershipBenefits