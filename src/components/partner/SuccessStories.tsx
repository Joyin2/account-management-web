'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Quote, 
  Star, 
  TrendingUp, 
  Users, 
  DollarSign,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink,
  Building2,
  MapPin,
  Calendar,
  BarChart3,
  Target,
  Zap,
  Globe,
  Heart,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const SuccessStories = () => {
  const [activeStory, setActiveStory] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')

  const successStories = [
    {
      id: 1,
      category: 'reseller',
      partnerName: 'TechSolutions Pro',
      partnerType: 'Reseller Partner',
      location: 'San Francisco, CA',
      industry: 'Technology Consulting',
      partnerSince: '2022',
      logo: '/api/placeholder/120/60',
      testimonial: "Partnering with NextGen Accounts has transformed our business. We've seen a 300% increase in revenue and our clients love the comprehensive accounting solutions we can now offer.",
      contactName: 'Sarah Chen',
      contactTitle: 'CEO & Founder',
      contactImage: '/api/placeholder/80/80',
      metrics: [
        { label: 'Revenue Growth', value: '300%', icon: TrendingUp },
        { label: 'New Customers', value: '150+', icon: Users },
        { label: 'Annual Revenue', value: '$2.5M', icon: DollarSign }
      ],
      achievements: [
        'Partner of the Year 2023',
        'Fastest Growing Partner',
        'Customer Satisfaction Leader'
      ],
      story: "TechSolutions Pro started as a small IT consulting firm struggling to offer comprehensive business solutions. After joining our partner program, they quickly became one of our top performers, expanding their service offerings and growing their team from 5 to 25 employees.",
      videoUrl: '#',
      caseStudyUrl: '#'
    },
    {
      id: 2,
      category: 'technology',
      partnerName: 'CloudSync Innovations',
      partnerType: 'Technology Partner',
      location: 'Austin, TX',
      industry: 'Software Development',
      partnerSince: '2021',
      logo: '/api/placeholder/120/60',
      testimonial: "The API integration capabilities and technical support from NextGen Accounts enabled us to build innovative solutions that our customers absolutely love. Our integration is now used by over 10,000 businesses.",
      contactName: 'Michael Rodriguez',
      contactTitle: 'CTO',
      contactImage: '/api/placeholder/80/80',
      metrics: [
        { label: 'API Calls/Month', value: '2.5M+', icon: Zap },
        { label: 'Active Integrations', value: '10K+', icon: Target },
        { label: 'Revenue Share', value: '$500K', icon: DollarSign }
      ],
      achievements: [
        'Best Integration Award 2023',
        'Most Innovative Solution',
        'Developer Choice Award'
      ],
      story: "CloudSync Innovations leveraged our robust API to create a seamless integration between NextGen Accounts and major e-commerce platforms. Their solution has become one of the most popular integrations in our marketplace.",
      videoUrl: '#',
      caseStudyUrl: '#'
    },
    {
      id: 3,
      category: 'consultant',
      partnerName: 'Financial Advisory Group',
      partnerType: 'Consultant Partner',
      location: 'New York, NY',
      industry: 'Financial Services',
      partnerSince: '2020',
      logo: '/api/placeholder/120/60',
      testimonial: "Our clients trust us to recommend the best solutions, and NextGen Accounts consistently delivers. The implementation support and ongoing training have been exceptional.",
      contactName: 'David Thompson',
      contactTitle: 'Managing Partner',
      contactImage: '/api/placeholder/80/80',
      metrics: [
        { label: 'Implementations', value: '200+', icon: CheckCircle },
        { label: 'Client Retention', value: '98%', icon: Heart },
        { label: 'Referral Revenue', value: '$1.2M', icon: DollarSign }
      ],
      achievements: [
        'Top Implementation Partner',
        'Excellence in Service Award',
        'Client Success Champion'
      ],
      story: "Financial Advisory Group has successfully implemented NextGen Accounts for over 200 clients, ranging from startups to mid-market companies. Their expertise and our platform have created lasting partnerships.",
      videoUrl: '#',
      caseStudyUrl: '#'
    },
    {
      id: 4,
      category: 'global',
      partnerName: 'EuroTech Solutions',
      partnerType: 'Global Partner',
      location: 'London, UK',
      industry: 'International Business',
      partnerSince: '2021',
      logo: '/api/placeholder/120/60',
      testimonial: "Expanding NextGen Accounts across European markets has been incredibly rewarding. The localization support and cultural adaptation guidance were crucial to our success.",
      contactName: 'Emma Williams',
      contactTitle: 'Regional Director',
      contactImage: '/api/placeholder/80/80',
      metrics: [
        { label: 'Countries Covered', value: '12', icon: Globe },
        { label: 'Local Customers', value: '500+', icon: Users },
        { label: 'Market Growth', value: '250%', icon: TrendingUp }
      ],
      achievements: [
        'International Expansion Award',
        'Market Leader - Europe',
        'Cultural Excellence Award'
      ],
      story: "EuroTech Solutions successfully launched NextGen Accounts in 12 European countries, adapting the platform for local regulations and cultural preferences. They've become our gateway to European markets.",
      videoUrl: '#',
      caseStudyUrl: '#'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Stories', count: successStories.length },
    { id: 'reseller', label: 'Reseller', count: successStories.filter(s => s.category === 'reseller').length },
    { id: 'technology', label: 'Technology', count: successStories.filter(s => s.category === 'technology').length },
    { id: 'consultant', label: 'Consultant', count: successStories.filter(s => s.category === 'consultant').length },
    { id: 'global', label: 'Global', count: successStories.filter(s => s.category === 'global').length }
  ]

  const filteredStories = activeCategory === 'all' 
    ? successStories 
    : successStories.filter(story => story.category === activeCategory)

  const currentStory = filteredStories[activeStory] || filteredStories[0]

  const nextStory = () => {
    setActiveStory((prev) => (prev + 1) % filteredStories.length)
  }

  const prevStory = () => {
    setActiveStory((prev) => (prev - 1 + filteredStories.length) % filteredStories.length)
  }

  const overallStats = [
    {
      label: 'Partner Revenue Growth',
      value: '285%',
      description: 'Average revenue increase',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Customer Satisfaction',
      value: '97.8%',
      description: 'Partner customer CSAT',
      icon: Heart,
      color: 'from-pink-500 to-rose-500'
    },
    {
      label: 'Active Partners',
      value: '2,500+',
      description: 'Worldwide partners',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Success Rate',
      value: '94%',
      description: 'Partner program success',
      icon: Target,
      color: 'from-purple-500 to-violet-500'
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
            Partner Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how our partners are transforming their businesses and achieving 
            remarkable growth with NextGen Accounts.
          </p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {overallStats.map((stat, index) => {
            const StatIcon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <StatIcon size={24} className="text-white" />
                </div>
                <div className="font-bold text-3xl text-gray-900 mb-2">{stat.value}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{stat.label}</h4>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCategory(category.id)
                setActiveStory(0)
              }}
              className={`flex items-center px-6 py-3 mx-2 mb-4 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              {category.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Main Story Display */}
        <AnimatePresence mode="wait">
          {currentStory && (
            <motion.div
              key={`${activeCategory}-${activeStory}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Story Content */}
                <div>
                  {/* Partner Info */}
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mr-4">
                      <Building2 size={24} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-poppins font-bold text-2xl text-gray-900">
                        {currentStory.partnerName}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-3">
                          {currentStory.partnerType}
                        </span>
                        <MapPin size={14} className="mr-1" />
                        {currentStory.location}
                      </div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="relative mb-6">
                    <Quote size={32} className="text-blue-500 mb-4" />
                    <p className="text-lg text-gray-700 leading-relaxed italic mb-4">
                      "{currentStory.testimonial}"
                    </p>
                    
                    {/* Contact Info */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                      <div>
                        <div className="font-semibold text-gray-900">{currentStory.contactName}</div>
                        <div className="text-sm text-gray-600">{currentStory.contactTitle}</div>
                      </div>
                    </div>
                  </div>

                  {/* Story Details */}
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {currentStory.story}
                  </p>

                  {/* Achievements */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Achievements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentStory.achievements.map((achievement, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                        >
                          <Award size={14} className="mr-1" />
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Play size={16} className="mr-2" />
                      Watch Video
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Read Case Study
                    </motion.button>
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <h4 className="font-poppins font-bold text-xl text-gray-900 mb-6">
                    Success Metrics
                  </h4>
                  
                  <div className="space-y-6">
                    {currentStory.metrics.map((metric, index) => {
                      const MetricIcon = metric.icon
                      return (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 flex items-center"
                        >
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mr-4">
                            <MetricIcon size={20} className="text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-2xl text-gray-900">{metric.value}</div>
                            <div className="text-gray-600">{metric.label}</div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Partner Since */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center justify-center">
                      <Calendar size={20} className="text-green-600 mr-2" />
                      <span className="text-green-800 font-semibold">
                        Partner Since {currentStory.partnerSince}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStory}
            className="flex items-center px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous Story
          </motion.button>

          <div className="flex space-x-2">
            {filteredStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStory(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeStory
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStory}
            className="flex items-center px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
          >
            Next Story
            <ChevronRight size={20} className="ml-2" />
          </motion.button>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
            Ready to Write Your Success Story?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful partners who are growing their business with NextGen Accounts. 
            Your success story could be next.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
          >
            Start Your Journey
            <ArrowRight size={16} className="ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default SuccessStories