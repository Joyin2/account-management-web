'use client'

import { motion } from 'framer-motion'
import { Calendar, Rocket, Users, Globe, Award, Zap } from 'lucide-react'

const Timeline = () => {
  const milestones = [
    {
      year: '2018',
      quarter: 'Q1',
      title: 'Company Founded',
      description: 'NextGen Accounts was founded by a team of financial experts and software engineers with a vision to revolutionize business accounting.',
      icon: Rocket,
      achievements: [
        'Initial funding secured',
        'Core team assembled',
        'Product concept validated'
      ]
    },
    {
      year: '2018',
      quarter: 'Q4',
      title: 'Beta Launch',
      description: 'Launched our beta version with 100 early adopters, gathering crucial feedback to refine our platform.',
      icon: Users,
      achievements: [
        '100 beta users onboarded',
        'Core features developed',
        'User feedback integration'
      ]
    },
    {
      year: '2019',
      quarter: 'Q2',
      title: 'Public Launch',
      description: 'Official public launch with comprehensive accounting features, marking our entry into the competitive market.',
      icon: Globe,
      achievements: [
        '1,000+ users in first month',
        'Full feature suite released',
        'Customer support established'
      ]
    },
    {
      year: '2020',
      quarter: 'Q1',
      title: 'Series A Funding',
      description: 'Raised $10M in Series A funding to accelerate growth and expand our development team.',
      icon: Award,
      achievements: [
        '$10M Series A raised',
        'Team expanded to 50+',
        'International expansion began'
      ]
    },
    {
      year: '2021',
      quarter: 'Q3',
      title: 'AI Integration',
      description: 'Introduced AI-powered features for automated bookkeeping and intelligent financial insights.',
      icon: Zap,
      achievements: [
        'AI features launched',
        '10,000+ active users',
        'Industry recognition received'
      ]
    },
    {
      year: '2022',
      quarter: 'Q4',
      title: 'Global Expansion',
      description: 'Expanded to 25+ countries with localized features and multi-currency support.',
      icon: Globe,
      achievements: [
        '25+ countries served',
        'Multi-currency support',
        'Local compliance features'
      ]
    },
    {
      year: '2023',
      quarter: 'Q2',
      title: 'Enterprise Solutions',
      description: 'Launched enterprise-grade solutions with advanced security and custom integrations.',
      icon: Award,
      achievements: [
        'Enterprise tier launched',
        '25,000+ users milestone',
        'SOC 2 compliance achieved'
      ]
    },
    {
      year: '2024',
      quarter: 'Q1',
      title: 'Market Leadership',
      description: 'Achieved market leadership position with 50,000+ users and industry-leading customer satisfaction.',
      icon: Users,
      achievements: [
        '50,000+ active users',
        'Market leader position',
        '4.9/5 customer rating'
      ]
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
            Our Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From a small startup to a global platform, here are the key milestones 
            that have shaped our company and defined our success.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-violet-500 h-full hidden lg:block" />
          
          {/* Timeline Items */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              const isEven = index % 2 === 0
              
              return (
                <motion.div
                  key={`${milestone.year}-${milestone.quarter}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center z-10 hidden lg:flex">
                    <Icon size={24} className="text-blue-600" />
                  </div>
                  
                  {/* Content */}
                  <div className={`w-full lg:w-5/12 ${isEven ? 'lg:pr-16' : 'lg:pl-16'}`}>
                    <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                      {/* Mobile Icon */}
                      <div className="flex items-center mb-4 lg:hidden">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center mr-4">
                          <Icon size={20} className="text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-blue-600">{milestone.year}</div>
                          <div className="text-sm text-gray-500">{milestone.quarter}</div>
                        </div>
                      </div>
                      
                      {/* Desktop Year */}
                      <div className="hidden lg:block mb-4">
                        <div className="font-bold text-2xl text-blue-600">{milestone.year}</div>
                        <div className="text-gray-500">{milestone.quarter}</div>
                      </div>
                      
                      <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                        {milestone.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {milestone.description}
                      </p>
                      
                      {/* Achievements */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                          Key Achievements
                        </h4>
                        <ul className="space-y-1">
                          {milestone.achievements.map((achievement, achievementIndex) => (
                            <li key={achievementIndex} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Spacer for opposite side */}
                  <div className="hidden lg:block w-5/12" />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Future Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="flex items-center justify-center mb-6">
              <Calendar size={32} className="mr-4" />
              <h3 className="font-poppins font-bold text-2xl md:text-3xl">
                Looking Ahead
              </h3>
            </div>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our journey is far from over. We're committed to continuous innovation, 
              expanding our global reach, and helping even more businesses achieve 
              financial success.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold text-lg mb-2">2024 Goals</h4>
                <p className="text-blue-100">100,000+ users, advanced AI features, mobile app launch</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold text-lg mb-2">2025 Vision</h4>
                <p className="text-blue-100">Global market expansion, blockchain integration, API ecosystem</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold text-lg mb-2">Long-term</h4>
                <p className="text-blue-100">Industry standard platform, sustainable growth, social impact</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Timeline