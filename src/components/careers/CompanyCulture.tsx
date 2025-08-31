'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Users, 
  Lightbulb, 
  Target, 
  Globe, 
  Award, 
  Coffee, 
  Gamepad2, 
  BookOpen, 
  Zap, 
  Shield, 
  TrendingUp,
  Clock,
  Home,
  Plane,
  Gift,
  Music,
  Camera,
  Smile,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  MapPin,
  Calendar,
  ArrowRight
} from 'lucide-react'

const CompanyCulture = () => {
  const [activeTab, setActiveTab] = useState('values')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const tabs = [
    { id: 'values', label: 'Our Values', icon: Heart },
    { id: 'environment', label: 'Work Environment', icon: Home },
    { id: 'benefits', label: 'Life at NextGen', icon: Smile },
    { id: 'diversity', label: 'Diversity & Inclusion', icon: Users }
  ]

  const coreValues = [
    {
      title: 'Innovation First',
      description: 'We embrace cutting-edge technology and encourage creative problem-solving. Every team member is empowered to propose new ideas and drive innovation.',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      stats: '95% of ideas get reviewed',
      examples: ['Monthly innovation challenges', 'Hackathons every quarter', '20% time for personal projects']
    },
    {
      title: 'Customer Obsession',
      description: 'Our customers are at the heart of everything we do. We listen, learn, and continuously improve to exceed their expectations.',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      stats: '4.9/5 customer satisfaction',
      examples: ['Direct customer feedback loops', 'Customer advisory board', 'Regular user research sessions']
    },
    {
      title: 'Team Collaboration',
      description: 'We believe in the power of diverse perspectives and collaborative teamwork. Together, we achieve more than we ever could alone.',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      stats: '98% team satisfaction',
      examples: ['Cross-functional projects', 'Peer mentoring programs', 'Team building activities']
    },
    {
      title: 'Continuous Growth',
      description: 'We invest in our people and encourage lifelong learning. Every challenge is an opportunity to grow and develop new skills.',
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-500',
      stats: '$5K annual learning budget',
      examples: ['Conference attendance', 'Online course subscriptions', 'Internal training programs']
    },
    {
      title: 'Global Impact',
      description: 'We are building solutions that make a difference for businesses worldwide, creating positive change in the financial technology landscape.',
      icon: Globe,
      color: 'from-indigo-500 to-blue-500',
      stats: '50+ countries served',
      examples: ['International expansion', 'Local community support', 'Sustainable practices']
    },
    {
      title: 'Quality Excellence',
      description: 'We take pride in delivering exceptional quality in everything we do, from code to customer service to company culture.',
      icon: Award,
      color: 'from-pink-500 to-red-500',
      stats: '99.9% uptime achieved',
      examples: ['Rigorous testing standards', 'Code review processes', 'Quality assurance teams']
    }
  ]

  const workEnvironment = [
    {
      title: 'Flexible Work Options',
      description: 'Choose how and where you work best',
      features: ['Remote-first culture', 'Flexible hours', 'Hybrid office options', 'Global team collaboration'],
      icon: Clock,
      color: 'bg-gradient-to-r from-blue-400 to-cyan-400'
    },
    {
      title: 'Modern Workspaces',
      description: 'State-of-the-art offices designed for productivity',
      features: ['Open collaboration spaces', 'Quiet focus areas', 'Latest technology', 'Ergonomic furniture'],
      icon: Home,
      color: 'bg-gradient-to-r from-green-400 to-emerald-400'
    },
    {
      title: 'Wellness Programs',
      description: 'Supporting your physical and mental well-being',
      features: ['On-site gym access', 'Mental health support', 'Wellness stipends', 'Healthy snacks'],
      icon: Heart,
      color: 'bg-gradient-to-r from-pink-400 to-red-400'
    },
    {
      title: 'Learning & Development',
      description: 'Continuous growth and skill development',
      features: ['Learning budget', 'Conference attendance', 'Internal workshops', 'Mentorship programs'],
      icon: BookOpen,
      color: 'bg-gradient-to-r from-purple-400 to-violet-400'
    }
  ]

  const lifeAtNextGen = [
    {
      title: 'Team Events & Activities',
      description: 'Regular social events that bring our team together',
      image: '/api/placeholder/400/300',
      activities: ['Monthly team lunches', 'Quarterly offsites', 'Holiday parties', 'Game tournaments']
    },
    {
      title: 'Professional Development',
      description: 'Investing in your career growth and skills',
      image: '/api/placeholder/400/300',
      activities: ['Tech talks', 'Leadership training', 'Industry conferences', 'Certification programs']
    },
    {
      title: 'Innovation Time',
      description: 'Dedicated time for creative projects and exploration',
      image: '/api/placeholder/400/300',
      activities: ['Hackathons', 'Innovation days', 'Side projects', 'Research time']
    },
    {
      title: 'Community Impact',
      description: 'Making a difference in our local and global communities',
      image: '/api/placeholder/400/300',
      activities: ['Volunteer programs', 'Charity drives', 'Environmental initiatives', 'Education support']
    }
  ]

  const diversityStats = [
    { label: 'Gender Diversity', value: '45%', description: 'Women in leadership' },
    { label: 'Global Team', value: '15+', description: 'Countries represented' },
    { label: 'Age Range', value: '22-65', description: 'Diverse generations' },
    { label: 'Languages', value: '25+', description: 'Spoken by our team' }
  ]

  const diversityInitiatives = [
    {
      title: 'Inclusive Hiring',
      description: 'Bias-free recruitment processes and diverse interview panels',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Employee Resource Groups',
      description: 'Communities for underrepresented groups and allies',
      icon: Heart,
      color: 'from-pink-500 to-red-500'
    },
    {
      title: 'Mentorship Programs',
      description: 'Pairing junior employees with senior mentors',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Cultural Celebrations',
      description: 'Celebrating diverse backgrounds and traditions',
      icon: Globe,
      color: 'from-purple-500 to-violet-500'
    }
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lifeAtNextGen.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lifeAtNextGen.length) % lifeAtNextGen.length)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6">
            Our Company
            <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Culture & Values
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover what makes NextGen Accounts a great place to work. Our culture is built on 
            innovation, collaboration, and a shared commitment to excellence.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <TabIcon size={20} className="mr-2" />
                {tab.label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Our Values */}
          {activeTab === 'values' && (
            <motion.div
              key="values"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coreValues.map((value, index) => {
                  const ValueIcon = value.icon
                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
                        <ValueIcon size={32} className="text-white" />
                      </div>
                      
                      <h3 className="font-bold text-xl text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{value.description}</p>
                      
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{value.stats}</div>
                        <div className="text-sm text-gray-600">Key metric</div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm">How we live this:</h4>
                        <ul className="space-y-1">
                          {value.examples.map((example, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Work Environment */}
          {activeTab === 'environment' && (
            <motion.div
              key="environment"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {workEnvironment.map((env, index) => {
                  const EnvIcon = env.icon
                  return (
                    <motion.div
                      key={env.title}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`w-16 h-16 ${env.color} rounded-2xl flex items-center justify-center mb-6`}>
                        <EnvIcon size={32} className="text-white" />
                      </div>
                      
                      <h3 className="font-bold text-xl text-gray-900 mb-3">{env.title}</h3>
                      <p className="text-gray-600 mb-6">{env.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {env.features.map((feature, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-700">
                            <Star size={14} className="text-yellow-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Life at NextGen */}
          {activeTab === 'benefits' && (
            <motion.div
              key="benefits"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Image Carousel */}
              <div className="relative bg-white rounded-3xl p-8 shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="font-bold text-2xl text-gray-900">
                      {lifeAtNextGen[currentImageIndex].title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {lifeAtNextGen[currentImageIndex].description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {lifeAtNextGen[currentImageIndex].activities.map((activity, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-700">
                          <ArrowRight size={14} className="text-blue-500 mr-2 flex-shrink-0" />
                          {activity}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <motion.button
                        onClick={prevImage}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300"
                      >
                        <ChevronLeft size={20} className="text-gray-600" />
                      </motion.button>
                      
                      <div className="flex space-x-2">
                        {lifeAtNextGen.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                              i === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <motion.button
                        onClick={nextImage}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300"
                      >
                        <ChevronRight size={20} className="text-gray-600" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-violet-100 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <Camera size={48} className="text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-600">Team Photo Gallery</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-300 flex items-center mx-auto"
                        >
                          <Play size={14} className="mr-2" />
                          View Gallery
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Diversity & Inclusion */}
          {activeTab === 'diversity' && (
            <motion.div
              key="diversity"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {diversityStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 text-center shadow-lg"
                  >
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                    <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-600">{stat.description}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Initiatives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {diversityInitiatives.map((initiative, index) => {
                  const InitiativeIcon = initiative.icon
                  return (
                    <motion.div
                      key={initiative.title}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-r ${initiative.color} rounded-2xl flex items-center justify-center mb-6`}>
                        <InitiativeIcon size={32} className="text-white" />
                      </div>
                      
                      <h3 className="font-bold text-xl text-gray-900 mb-3">{initiative.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{initiative.description}</p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="font-bold text-2xl md:text-3xl mb-4">
            Ready to Join Our Team?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Experience our culture firsthand and become part of a team that's shaping the future of financial technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              View Open Positions
              <ArrowRight size={20} className="ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <MapPin size={20} className="mr-2" />
              Visit Our Office
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CompanyCulture