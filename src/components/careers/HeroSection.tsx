'use client'

import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Users, 
  MapPin, 
  Briefcase, 
  Heart, 
  Zap, 
  Globe, 
  Award, 
  TrendingUp, 
  Coffee, 
  Lightbulb, 
  Target,
  Star,
  Building2,
  Clock,
  Smile
} from 'lucide-react'

const HeroSection = () => {
  const stats = [
    {
      number: '200+',
      label: 'Team Members',
      description: 'Talented professionals',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '15+',
      label: 'Countries',
      description: 'Global presence',
      icon: Globe,
      color: 'from-green-500 to-emerald-500'
    },
    {
      number: '4.8/5',
      label: 'Employee Rating',
      description: 'Glassdoor score',
      icon: Star,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      number: '25+',
      label: 'Open Positions',
      description: 'Join our team',
      icon: Briefcase,
      color: 'from-purple-500 to-violet-500'
    }
  ]

  const values = [
    {
      title: 'Innovation First',
      description: 'We push boundaries and embrace new technologies',
      icon: Lightbulb,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500'
    },
    {
      title: 'Work-Life Balance',
      description: 'Flexible schedules and remote-friendly culture',
      icon: Heart,
      color: 'bg-gradient-to-r from-pink-400 to-red-500'
    },
    {
      title: 'Growth Mindset',
      description: 'Continuous learning and career development',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-green-400 to-emerald-500'
    },
    {
      title: 'Global Impact',
      description: 'Make a difference for businesses worldwide',
      icon: Target,
      color: 'bg-gradient-to-r from-blue-400 to-violet-500'
    }
  ]

  const perks = [
    { icon: Coffee, text: 'Free coffee & snacks' },
    { icon: Building2, text: 'Modern offices' },
    { icon: Clock, text: 'Flexible hours' },
    { icon: Award, text: 'Learning budget' },
    { icon: Smile, text: 'Team events' },
    { icon: Zap, text: 'Latest tech' }
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-violet-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center bg-gradient-to-r from-blue-100 to-violet-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Award size={16} className="mr-2" />
              Best Places to Work 2024
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight"
              >
                Build Your
                <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Dream Career
                </span>
                With Us
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl"
              >
                Join a team of passionate innovators who are revolutionizing financial technology. 
                We're building the future of accounting software, and we want you to be part of it.
              </motion.p>
            </div>

            {/* Key Values */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {values.map((value, index) => {
                const ValueIcon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`w-10 h-10 ${value.color} rounded-xl flex items-center justify-center mb-3`}>
                      <ValueIcon size={20} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{value.title}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{value.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
              >
                View Open Positions
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
              >
                Learn About Culture
              </motion.button>
            </motion.div>

            {/* Quick Perks */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              {perks.map((perk, index) => {
                const PerkIcon = perk.icon
                return (
                  <motion.div
                    key={perk.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                    className="flex items-center bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full text-sm text-gray-700 border border-gray-200/50"
                  >
                    <PerkIcon size={14} className="mr-2 text-blue-600" />
                    {perk.text}
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <StatIcon size={24} className="text-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-2xl text-gray-900">{stat.number}</div>
                      <div className="font-semibold text-gray-900 text-sm">{stat.label}</div>
                      <div className="text-gray-600 text-xs">{stat.description}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Team Photo Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="relative bg-gradient-to-br from-blue-100 to-violet-100 rounded-3xl p-8 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Meet Our Team</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Diverse, talented, and passionate about what we do
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm"
                >
                  View Team Gallery
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Section - Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                <Briefcase size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Apply Today</h3>
              <p className="text-gray-600 text-sm">Browse our open positions and find your perfect role</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Join Our Community</h3>
              <p className="text-gray-600 text-sm">Connect with current employees and learn more</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto">
                <MapPin size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Visit Our Offices</h3>
              <p className="text-gray-600 text-sm">Schedule a visit to see where the magic happens</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection