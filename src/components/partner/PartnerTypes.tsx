'use client'

import { motion } from 'framer-motion'
import { 
  Store, 
  Code, 
  Users, 
  Building2, 
  Handshake, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Award,
  Briefcase,
  Settings,
  BookOpen,
  Headphones
} from 'lucide-react'

const PartnerTypes = () => {
  const partnerTypes = [
    {
      id: 'reseller',
      icon: Store,
      title: 'Reseller Partners',
      subtitle: 'Sell our solutions directly to your customers',
      description: 'Perfect for businesses looking to expand their product portfolio with proven accounting solutions.',
      features: [
        'Competitive margins up to 40%',
        'Full sales and marketing support',
        'Dedicated partner portal',
        'Lead sharing program',
        'Co-marketing opportunities'
      ],
      benefits: [
        { label: 'Commission', value: 'Up to 40%' },
        { label: 'Training', value: 'Comprehensive' },
        { label: 'Support', value: '24/7' },
        { label: 'Territory', value: 'Protected' }
      ],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      requirements: [
        'Established business with 2+ years experience',
        'Proven sales track record',
        'Dedicated sales team',
        'Customer support capabilities'
      ]
    },
    {
      id: 'technology',
      icon: Code,
      title: 'Technology Partners',
      subtitle: 'Integrate and extend our platform capabilities',
      description: 'Build innovative integrations and applications that enhance our ecosystem.',
      features: [
        'API access and documentation',
        'Technical support team',
        'App marketplace listing',
        'Revenue sharing model',
        'Joint go-to-market strategy'
      ],
      benefits: [
        { label: 'Revenue Share', value: 'Up to 30%' },
        { label: 'API Access', value: 'Full' },
        { label: 'Marketplace', value: 'Featured' },
        { label: 'Support', value: 'Technical' }
      ],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      requirements: [
        'Software development expertise',
        'API integration experience',
        'Quality assurance processes',
        'Ongoing maintenance commitment'
      ]
    },
    {
      id: 'consultant',
      icon: Users,
      title: 'Consultant Partners',
      subtitle: 'Provide implementation and advisory services',
      description: 'Help clients maximize value through expert implementation and ongoing advisory services.',
      features: [
        'Certification programs',
        'Implementation methodology',
        'Client referral program',
        'Professional services support',
        'Ongoing training resources'
      ],
      benefits: [
        { label: 'Referral Fee', value: 'Up to 25%' },
        { label: 'Certification', value: 'Official' },
        { label: 'Methodology', value: 'Proven' },
        { label: 'Resources', value: 'Extensive' }
      ],
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      requirements: [
        'Accounting/finance expertise',
        'Implementation experience',
        'Client management skills',
        'Professional certifications'
      ]
    },
    {
      id: 'enterprise',
      icon: Building2,
      title: 'Enterprise Partners',
      subtitle: 'Strategic partnerships for large-scale deployments',
      description: 'Collaborate on enterprise-level solutions and strategic initiatives.',
      features: [
        'Strategic account management',
        'Custom solution development',
        'Executive relationship program',
        'Joint business planning',
        'Priority support escalation'
      ],
      benefits: [
        { label: 'Deal Size', value: '$100K+' },
        { label: 'Support', value: 'Dedicated' },
        { label: 'Customization', value: 'Available' },
        { label: 'SLA', value: 'Premium' }
      ],
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      requirements: [
        'Enterprise sales experience',
        'Large client portfolio',
        'Strategic planning capabilities',
        'Executive relationships'
      ]
    },
    {
      id: 'channel',
      icon: Handshake,
      title: 'Channel Partners',
      subtitle: 'Distribute through your existing channels',
      description: 'Leverage your distribution network to reach new markets and customer segments.',
      features: [
        'Multi-tier distribution model',
        'Channel enablement tools',
        'Partner portal access',
        'Marketing development funds',
        'Performance incentives'
      ],
      benefits: [
        { label: 'Margin', value: 'Tiered' },
        { label: 'Territory', value: 'Exclusive' },
        { label: 'MDF', value: 'Available' },
        { label: 'Incentives', value: 'Performance' }
      ],
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50',
      requirements: [
        'Established distribution network',
        'Channel management experience',
        'Marketing capabilities',
        'Partner recruitment skills'
      ]
    },
    {
      id: 'global',
      icon: Globe,
      title: 'Global Partners',
      subtitle: 'Expand our reach to international markets',
      description: 'Help us enter new geographic markets with local expertise and presence.',
      features: [
        'Regional exclusivity rights',
        'Localization support',
        'Cultural adaptation guidance',
        'Local compliance assistance',
        'Market entry strategy'
      ],
      benefits: [
        { label: 'Territory', value: 'Regional' },
        { label: 'Exclusivity', value: 'Available' },
        { label: 'Localization', value: 'Supported' },
        { label: 'Compliance', value: 'Assisted' }
      ],
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      requirements: [
        'Local market presence',
        'Regulatory knowledge',
        'Cultural understanding',
        'Government relationships'
      ]
    }
  ]

  const comparisonFeatures = [
    'Revenue Opportunity',
    'Training & Certification',
    'Marketing Support',
    'Technical Support',
    'Territory Protection',
    'Co-marketing Opportunities'
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
            Partnership Types
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the partnership model that best fits your business goals and capabilities. 
            Each type offers unique benefits and opportunities for growth.
          </p>
        </motion.div>

        {/* Partner Types Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {partnerTypes.map((partner, index) => {
            const Icon = partner.icon
            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br ${partner.bgColor} rounded-3xl p-8 hover:shadow-xl transition-all duration-300`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${partner.color} rounded-2xl flex items-center justify-center mr-4`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-poppins font-bold text-xl text-gray-900 mb-1">
                        {partner.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{partner.subtitle}</p>
                    </div>
                  </div>
                  <Star size={20} className="text-yellow-500 fill-current" />
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {partner.description}
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {partner.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="bg-white/50 rounded-xl p-3">
                      <div className="text-sm text-gray-600">{benefit.label}</div>
                      <div className="font-bold text-gray-900">{benefit.value}</div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {partner.features.slice(0, 3).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {partner.requirements.slice(0, 2).map((requirement, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-sm text-gray-700">
                        <Target size={14} className="text-blue-500 mr-2 flex-shrink-0" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r ${partner.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center`}
                >
                  Learn More
                  <ArrowRight size={16} className="ml-2" />
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-4">
              Partnership Comparison
            </h3>
            <p className="text-lg text-gray-600">
              Compare different partnership types to find the best fit for your business
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Partnership Type</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Revenue Model</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Support Level</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Best For</th>
                </tr>
              </thead>
              <tbody>
                {partnerTypes.slice(0, 4).map((partner, index) => {
                  const Icon = partner.icon
                  return (
                    <motion.tr
                      key={partner.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 bg-gradient-to-r ${partner.color} rounded-lg flex items-center justify-center mr-3`}>
                            <Icon size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{partner.title}</div>
                            <div className="text-sm text-gray-600">{partner.subtitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {partner.benefits[0].value}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {partner.benefits[2].value}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">
                        {partner.requirements[0]}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
            Not Sure Which Partnership is Right for You?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our partnership team will help you identify the best opportunity based on your 
            business model, capabilities, and growth objectives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <Headphones size={16} className="mr-2" />
              Schedule Consultation
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <BookOpen size={16} className="mr-2" />
              Download Guide
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PartnerTypes