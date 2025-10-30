'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  TrendingUp, 
  Users, 
  Star,
  Crown,
  Diamond,
  Shield,
  ArrowRight,
  CheckCircle,
  Gift,
  Target,
  Zap,
  BookOpen,
  Headphones,
  DollarSign,
  BarChart3,
  Globe,
  Calendar,
  Trophy,
  Rocket,
  Heart,
  Settings
} from 'lucide-react'

const PartnerProgram = () => {
  const [activeTab, setActiveTab] = useState('tiers')

  const programTiers = [
    {
      id: 'bronze',
      name: 'Bronze Partner',
      icon: Award,
      color: 'from-amber-600 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      requirements: {
        revenue: '$10K+',
        customers: '5+',
        certification: 'Basic'
      },
      benefits: [
        'Up to 25% commission',
        'Basic training materials',
        'Email support',
        'Partner portal access',
        'Marketing collateral'
      ],
      features: [
        'Lead registration',
        'Deal registration',
        'Basic reporting',
        'Product updates'
      ],
      support: 'Email support during business hours',
      training: 'Self-paced online courses',
      marketing: 'Standard marketing materials'
    },
    {
      id: 'silver',
      name: 'Silver Partner',
      icon: Star,
      color: 'from-gray-500 to-slate-600',
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-300',
      requirements: {
        revenue: '$50K+',
        customers: '25+',
        certification: 'Advanced'
      },
      benefits: [
        'Up to 30% commission',
        'Advanced training programs',
        'Phone & email support',
        'Priority lead sharing',
        'Co-marketing opportunities',
        'Quarterly business reviews'
      ],
      features: [
        'Protected territory',
        'Advanced reporting',
        'Beta access',
        'Partner events access'
      ],
      support: 'Phone and email support with faster response',
      training: 'Live webinars and certification programs',
      marketing: 'Co-branded materials and MDF access'
    },
    {
      id: 'gold',
      name: 'Gold Partner',
      icon: Crown,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      requirements: {
        revenue: '$200K+',
        customers: '100+',
        certification: 'Expert'
      },
      benefits: [
        'Up to 35% commission',
        'Dedicated partner manager',
        'Priority support',
        'Exclusive territory rights',
        'Joint marketing campaigns',
        'Executive briefings',
        'Early product access'
      ],
      features: [
        'Custom integrations',
        'White-label options',
        'API priority access',
        'Partner advisory board'
      ],
      support: 'Dedicated partner success manager',
      training: 'Personalized training and certification',
      marketing: 'Joint marketing campaigns and events'
    },
    {
      id: 'platinum',
      name: 'Platinum Partner',
      icon: Diamond,
      color: 'from-purple-600 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-300',
      requirements: {
        revenue: '$500K+',
        customers: '250+',
        certification: 'Master'
      },
      benefits: [
        'Up to 40% commission',
        'Executive relationship program',
        '24/7 priority support',
        'Global territory rights',
        'Strategic partnership status',
        'Product roadmap influence',
        'Revenue guarantees',
        'Custom SLAs'
      ],
      features: [
        'Strategic account access',
        'Custom development',
        'Dedicated resources',
        'Board-level relationships'
      ],
      support: 'Executive-level support with custom SLAs',
      training: 'Executive training and strategic planning',
      marketing: 'Strategic co-marketing and thought leadership'
    }
  ]

  const programBenefits = [
    {
      category: 'Financial',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      items: [
        'Competitive commission structure',
        'Performance-based bonuses',
        'Revenue sharing opportunities',
        'Marketing development funds',
        'Volume discount incentives'
      ]
    },
    {
      category: 'Training & Certification',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      items: [
        'Comprehensive product training',
        'Sales methodology certification',
        'Technical implementation courses',
        'Ongoing education programs',
        'Industry best practices'
      ]
    },
    {
      category: 'Support & Resources',
      icon: Headphones,
      color: 'from-purple-500 to-violet-500',
      items: [
        'Dedicated partner success manager',
        'Technical support team',
        'Implementation assistance',
        'Customer success resources',
        'Partner portal and tools'
      ]
    },
    {
      category: 'Marketing & Sales',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      items: [
        'Lead generation programs',
        'Co-marketing opportunities',
        'Sales collateral and tools',
        'Event participation',
        'Digital marketing support'
      ]
    }
  ]

  const tabs = [
    { id: 'tiers', label: 'Partner Tiers', icon: Trophy },
    { id: 'benefits', label: 'Program Benefits', icon: Gift },
    { id: 'requirements', label: 'Requirements', icon: CheckCircle },
    { id: 'support', label: 'Support & Training', icon: Headphones }
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
            Partner Program Structure
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our tiered partner program is designed to grow with your business. 
            The more you achieve, the greater the rewards and benefits.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center mb-12"
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 mx-2 mb-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TabIcon size={16} className="mr-2" />
                {tab.label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'tiers' && (
            <motion.div
              key="tiers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {programTiers.map((tier, index) => {
                const TierIcon = tier.icon
                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`bg-gradient-to-br ${tier.bgColor} border-2 ${tier.borderColor} rounded-3xl p-6 hover:shadow-xl transition-all duration-300`}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                      <TierIcon size={24} className="text-white" />
                    </div>
                    
                    <h3 className="font-poppins font-bold text-xl text-gray-900 text-center mb-4">
                      {tier.name}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Revenue:</span>
                        <span className="font-semibold text-gray-900">{tier.requirements.revenue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Customers:</span>
                        <span className="font-semibold text-gray-900">{tier.requirements.customers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Certification:</span>
                        <span className="font-semibold text-gray-900">{tier.requirements.certification}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {tier.benefits.slice(0, 4).map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full bg-gradient-to-r ${tier.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center`}
                    >
                      Learn More
                      <ArrowRight size={16} className="ml-2" />
                    </motion.button>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'benefits' && (
            <motion.div
              key="benefits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {programBenefits.map((category, index) => {
                const CategoryIcon = category.icon
                return (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <CategoryIcon size={24} className="text-white" />
                    </div>
                    
                    <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                      {category.category}
                    </h3>
                    
                    <ul className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: (index * 0.1) + (itemIndex * 0.05) }}
                          className="flex items-center text-gray-700"
                        >
                          <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'requirements' && (
            <motion.div
              key="requirements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8"
            >
              <div className="text-center mb-8">
                <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
                  Partner Requirements by Tier
                </h3>
                <p className="text-lg text-gray-600">
                  Each tier has specific requirements to ensure mutual success
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Tier</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Annual Revenue</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Active Customers</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Certification Level</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Commission Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programTiers.map((tier, index) => {
                      const TierIcon = tier.icon
                      return (
                        <motion.tr
                          key={tier.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-white/50 transition-colors duration-200"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center mr-3`}>
                                <TierIcon size={16} className="text-white" />
                              </div>
                              <span className="font-semibold text-gray-900">{tier.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center font-semibold text-gray-900">
                            {tier.requirements.revenue}
                          </td>
                          <td className="py-4 px-4 text-center font-semibold text-gray-900">
                            {tier.requirements.customers}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {tier.requirements.certification}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              {tier.benefits[0].split(' ')[2]}
                            </span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {programTiers.map((tier, index) => {
                const TierIcon = tier.icon
                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${tier.bgColor} border-2 ${tier.borderColor} rounded-3xl p-6`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${tier.color} rounded-xl flex items-center justify-center mr-4`}>
                        <TierIcon size={20} className="text-white" />
                      </div>
                      <h3 className="font-poppins font-bold text-lg text-gray-900">
                        {tier.name}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Headphones size={16} className="mr-2 text-blue-500" />
                          Support
                        </h4>
                        <p className="text-sm text-gray-700">{tier.support}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <BookOpen size={16} className="mr-2 text-green-500" />
                          Training
                        </h4>
                        <p className="text-sm text-gray-700">{tier.training}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Target size={16} className="mr-2 text-purple-500" />
                          Marketing
                        </h4>
                        <p className="text-sm text-gray-700">{tier.marketing}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
            Ready to Join Our Partner Program?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your journey with our Bronze tier and grow your way up. 
            The sooner you start, the sooner you can begin earning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <Rocket size={16} className="mr-2" />
              Apply Now
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <Calendar size={16} className="mr-2" />
              Schedule Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PartnerProgram