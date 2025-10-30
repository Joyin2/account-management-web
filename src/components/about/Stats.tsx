'use client'

import { motion } from 'framer-motion'
import { Users, Building, Globe, TrendingUp, Award, Clock } from 'lucide-react'

const Stats = () => {
  const stats = [
    {
      icon: Users,
      value: '50,000+',
      label: 'Active Users',
      description: 'Businesses trust us worldwide'
    },
    {
      icon: Building,
      value: '15,000+',
      label: 'Companies',
      description: 'From startups to enterprises'
    },
    {
      icon: Globe,
      value: '45+',
      label: 'Countries',
      description: 'Global reach and impact'
    },
    {
      icon: TrendingUp,
      value: '$2.5B+',
      label: 'Transactions',
      description: 'Processed annually'
    },
    {
      icon: Award,
      value: '15+',
      label: 'Awards',
      description: 'Industry recognition'
    },
    {
      icon: Clock,
      value: '99.9%',
      label: 'Uptime',
      description: 'Reliable service guarantee'
    }
  ]

  const achievements = [
    {
      year: '2024',
      title: 'Best Accounting Software',
      organization: 'TechCrunch Awards'
    },
    {
      year: '2023',
      title: 'Innovation in FinTech',
      organization: 'Financial Technology Awards'
    },
    {
      year: '2023',
      title: 'Customer Choice Award',
      organization: 'Software Reviews'
    },
    {
      year: '2022',
      title: 'Fastest Growing SaaS',
      organization: 'SaaS Awards'
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
            By the Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our growth and success are measured not just in numbers, but in the 
            success stories of the businesses we serve every day.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="font-poppins font-bold text-3xl text-gray-900">
                      {stat.value}
                    </div>
                    <div className="font-semibold text-gray-700">
                      {stat.label}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  {stat.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
        >
          <div className="text-center mb-12">
            <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-4">
              Awards & Recognition
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're honored to be recognized by industry leaders for our innovation, 
              customer service, and impact on the business community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={20} className="text-white" />
                </div>
                <div className="font-bold text-lg text-blue-600 mb-2">
                  {achievement.year}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {achievement.organization}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Growth Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-6">
              Our Growth Journey
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="font-bold text-4xl mb-2">300%</div>
                <div className="text-blue-100">Year-over-year growth</div>
              </div>
              <div>
                <div className="font-bold text-4xl mb-2">4.9/5</div>
                <div className="text-blue-100">Customer satisfaction</div>
              </div>
              <div>
                <div className="font-bold text-4xl mb-2">24/7</div>
                <div className="text-blue-100">Customer support</div>
              </div>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              From a small startup to a global platform, our journey has been driven by 
              one simple principle: putting our customers first in everything we do.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Stats