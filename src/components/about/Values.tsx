'use client'

import { motion } from 'framer-motion'
import { 
  Heart, 
  Shield, 
  Lightbulb, 
  Users, 
  Target, 
  Zap,
  CheckCircle,
  Star
} from 'lucide-react'

const Values = () => {
  const coreValues = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make starts with our customers. We listen, learn, and build solutions that truly serve their needs.',
      principles: [
        'Active listening to customer feedback',
        'Rapid response to support requests',
        'Continuous product improvement',
        'Transparent communication'
      ],
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'We understand that financial data is sacred. Security and privacy are not features—they are fundamental to everything we do.',
      principles: [
        'Bank-level encryption standards',
        'Regular security audits',
        'GDPR and SOC 2 compliance',
        'Transparent privacy policies'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace change and continuously push boundaries to create solutions that make financial management effortless.',
      principles: [
        'Cutting-edge technology adoption',
        'User-centered design thinking',
        'Agile development practices',
        'Continuous learning culture'
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Great things happen when diverse minds work together. We foster an inclusive environment where everyone can thrive.',
      principles: [
        'Diverse and inclusive hiring',
        'Cross-functional teamwork',
        'Open communication channels',
        'Shared success celebration'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We set high standards and consistently deliver quality that exceeds expectations in every aspect of our work.',
      principles: [
        'Quality-first development',
        'Rigorous testing processes',
        'Performance optimization',
        'Attention to detail'
      ],
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Zap,
      title: 'Simplicity',
      description: 'Complex problems deserve simple solutions. We make powerful tools accessible to everyone, regardless of technical expertise.',
      principles: [
        'Intuitive user interfaces',
        'Clear documentation',
        'Streamlined workflows',
        'Minimal learning curve'
      ],
      color: 'from-indigo-500 to-blue-500'
    }
  ]

  const culturalPillars = [
    {
      title: 'Work-Life Balance',
      description: 'We believe that happy, well-rested employees create the best products.',
      features: ['Flexible working hours', 'Remote work options', 'Mental health support', 'Unlimited PTO']
    },
    {
      title: 'Growth & Learning',
      description: 'We invest in our team\'s professional development and career advancement.',
      features: ['Learning stipends', 'Conference attendance', 'Internal mentorship', 'Skill development programs']
    },
    {
      title: 'Social Impact',
      description: 'We use our success to make a positive impact on communities and the environment.',
      features: ['Nonprofit partnerships', 'Volunteer time off', 'Sustainable practices', 'Community giving']
    }
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
            Our Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            These core values guide every decision we make and shape the culture 
            that drives our success. They are not just words on a wall—they are 
            the foundation of who we are.
          </p>
        </motion.div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {coreValues.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} className="text-white" />
                </div>
                
                {/* Content */}
                <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {value.description}
                </p>
                
                {/* Principles */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    How we live this value:
                  </h4>
                  <ul className="space-y-2">
                    {value.principles.map((principle, principleIndex) => (
                      <li key={principleIndex} className="flex items-start">
                        <CheckCircle size={16} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Cultural Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-4">
              Our Culture
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Beyond our core values, these cultural pillars define how we work 
              together and support each other's success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {culturalPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <Star size={20} className="text-yellow-500 mr-3" />
                  <h4 className="font-poppins font-semibold text-lg text-gray-900">
                    {pillar.title}
                  </h4>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {pillar.description}
                </p>
                
                <ul className="space-y-2">
                  {pillar.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values in Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-6">
            Values in Action
          </h3>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our values aren't just aspirational—they drive real results. Here's how 
            they translate into tangible benefits for our customers and team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <div className="font-bold text-3xl mb-2">4.9/5</div>
              <div className="text-blue-100">Customer satisfaction score</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="font-bold text-3xl mb-2">99.9%</div>
              <div className="text-blue-100">Security uptime</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="font-bold text-3xl mb-2">95%</div>
              <div className="text-blue-100">Employee satisfaction</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="font-bold text-3xl mb-2">24h</div>
              <div className="text-blue-100">Average support response</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Values