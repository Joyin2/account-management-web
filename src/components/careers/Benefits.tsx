'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Shield, 
  GraduationCap, 
  Plane, 
  Coffee, 
  Home, 
  Zap, 
  Gift, 
  Clock, 
  DollarSign, 
  Users, 
  Globe, 
  Gamepad2, 
  Music, 
  Car, 
  Baby, 
  Laptop, 
  Wifi, 
  MapPin, 
  Calendar, 
  Star, 
  Award, 
  Target, 
  TrendingUp, 
  Smile, 
  Sun, 
  Moon, 
  ChevronRight, 
  Check, 
  Plus, 
  ArrowRight
} from 'lucide-react'

const Benefits = () => {
  const [activeCategory, setActiveCategory] = useState('health')
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null)

  const categories = [
    { id: 'health', label: 'Health & Wellness', icon: Heart, color: 'from-red-500 to-pink-500' },
    { id: 'financial', label: 'Financial Benefits', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { id: 'learning', label: 'Learning & Growth', icon: GraduationCap, color: 'from-blue-500 to-cyan-500' },
    { id: 'lifestyle', label: 'Work-Life Balance', icon: Clock, color: 'from-purple-500 to-violet-500' },
    { id: 'perks', label: 'Office & Perks', icon: Coffee, color: 'from-yellow-500 to-orange-500' }
  ]

  const benefits = {
    health: [
      {
        title: 'Premium Health Insurance',
        description: 'Comprehensive medical, dental, and vision coverage for you and your family',
        icon: Shield,
        value: '$15,000/year',
        details: ['100% premium coverage', 'Low deductibles', 'Global coverage', 'Preventive care included']
      },
      {
        title: 'Mental Health Support',
        description: 'Access to counseling services, therapy sessions, and wellness apps',
        icon: Heart,
        value: 'Unlimited',
        details: ['24/7 counseling hotline', 'Therapy sessions', 'Meditation apps', 'Stress management workshops']
      },
      {
        title: 'Wellness Stipend',
        description: 'Monthly allowance for gym memberships, fitness classes, and wellness activities',
        icon: Zap,
        value: '$200/month',
        details: ['Gym memberships', 'Fitness classes', 'Wellness apps', 'Sports equipment']
      },
      {
        title: 'Health Screenings',
        description: 'Annual health check-ups and preventive screenings at no cost',
        icon: Target,
        value: 'Free',
        details: ['Annual physicals', 'Blood work', 'Vision screening', 'Dental cleanings']
      }
    ],
    financial: [
      {
        title: 'Competitive Salary',
        description: 'Market-leading compensation packages reviewed annually',
        icon: DollarSign,
        value: 'Top 10%',
        details: ['Annual reviews', 'Performance bonuses', 'Market adjustments', 'Transparent bands']
      },
      {
        title: 'Equity Package',
        description: 'Stock options that give you ownership in our growing company',
        icon: TrendingUp,
        value: 'Significant',
        details: ['Stock options', 'Vesting schedule', 'Growth potential', 'Employee ownership']
      },
      {
        title: 'Retirement Planning',
        description: '401(k) with company matching and financial planning assistance',
        icon: Award,
        value: '6% match',
        details: ['401(k) matching', 'Investment options', 'Financial advisor access', 'Retirement planning']
      },
      {
        title: 'Life Insurance',
        description: 'Comprehensive life and disability insurance coverage',
        icon: Shield,
        value: '2x salary',
        details: ['Life insurance', 'Disability coverage', 'Accidental death', 'Family protection']
      }
    ],
    learning: [
      {
        title: 'Learning Budget',
        description: 'Annual budget for courses, conferences, and professional development',
        icon: GraduationCap,
        value: '$5,000/year',
        details: ['Online courses', 'Conference tickets', 'Certification exams', 'Books and materials']
      },
      {
        title: 'Conference Attendance',
        description: 'Attend industry conferences and networking events worldwide',
        icon: Globe,
        value: '2-3/year',
        details: ['Industry conferences', 'Travel expenses', 'Networking events', 'Knowledge sharing']
      },
      {
        title: 'Internal Training',
        description: 'Regular workshops, tech talks, and skill-building sessions',
        icon: Users,
        value: 'Weekly',
        details: ['Tech talks', 'Skill workshops', 'Leadership training', 'Mentorship programs']
      },
      {
        title: 'Tuition Reimbursement',
        description: 'Support for advanced degrees and professional certifications',
        icon: Star,
        value: 'Up to $10k',
        details: ['Degree programs', 'Professional certs', 'Skill development', 'Career advancement']
      }
    ],
    lifestyle: [
      {
        title: 'Flexible Work Hours',
        description: 'Choose your schedule and work when you\'re most productive',
        icon: Clock,
        value: 'Full flexibility',
        details: ['Flexible start times', 'Core hours', 'Time zone friendly', 'Work-life balance']
      },
      {
        title: 'Remote Work Options',
        description: 'Work from anywhere with full remote work support',
        icon: Home,
        value: 'Fully remote',
        details: ['Work from anywhere', 'Home office setup', 'Co-working spaces', 'Global team']
      },
      {
        title: 'Unlimited PTO',
        description: 'Take the time you need to recharge and spend with family',
        icon: Sun,
        value: 'Unlimited',
        details: ['No accrual limits', 'Encouraged usage', 'Minimum 3 weeks', 'Sabbatical options']
      },
      {
        title: 'Parental Leave',
        description: 'Extended paid leave for new parents to bond with their children',
        icon: Baby,
        value: '16 weeks',
        details: ['Maternity leave', 'Paternity leave', 'Adoption support', 'Gradual return']
      }
    ],
    perks: [
      {
        title: 'Home Office Setup',
        description: 'Complete workstation setup including laptop, monitor, and ergonomic furniture',
        icon: Laptop,
        value: '$3,000',
        details: ['MacBook Pro/PC', '4K monitor', 'Ergonomic chair', 'Standing desk']
      },
      {
        title: 'Internet Stipend',
        description: 'Monthly allowance for high-speed internet and phone bills',
        icon: Wifi,
        value: '$100/month',
        details: ['Internet reimbursement', 'Phone allowance', 'Co-working spaces', 'Connectivity support']
      },
      {
        title: 'Team Events',
        description: 'Regular team building activities, offsites, and social events',
        icon: Users,
        value: 'Monthly',
        details: ['Team lunches', 'Quarterly offsites', 'Holiday parties', 'Game tournaments']
      },
      {
        title: 'Commuter Benefits',
        description: 'Transportation allowances and parking for office-based employees',
        icon: Car,
        value: '$250/month',
        details: ['Transit passes', 'Parking fees', 'Bike allowance', 'Rideshare credits']
      }
    ]
  }

  const stats = [
    { label: 'Employee Satisfaction', value: '98%', icon: Smile },
    { label: 'Benefits Rating', value: '4.9/5', icon: Star },
    { label: 'Work-Life Balance', value: '9.2/10', icon: Clock },
    { label: 'Career Growth', value: '95%', icon: TrendingUp }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Engineer',
      quote: 'The learning budget has been incredible for my career growth. I\'ve attended 3 conferences this year and completed several certifications.',
      avatar: '/api/placeholder/60/60'
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Manager',
      quote: 'The flexible work policy allows me to be present for my family while still delivering great work. It\'s truly life-changing.',
      avatar: '/api/placeholder/60/60'
    },
    {
      name: 'Elena Rodriguez',
      role: 'UX Designer',
      quote: 'The wellness benefits have helped me maintain a healthy work-life balance. The mental health support is especially valuable.',
      avatar: '/api/placeholder/60/60'
    }
  ]

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
            Comprehensive
            <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Benefits Package
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We believe in taking care of our team members with industry-leading benefits 
            that support your health, growth, and well-being.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const StatIcon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <StatIcon size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => {
            const CategoryIcon = category.icon
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <CategoryIcon size={20} className="mr-2" />
                {category.label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Benefits Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            {benefits[activeCategory as keyof typeof benefits].map((benefit, index) => {
              const BenefitIcon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredBenefit(index)}
                  onHoverEnd={() => setHoveredBenefit(null)}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center">
                      <BenefitIcon size={32} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{benefit.value}</div>
                      <div className="text-sm text-gray-600">Value</div>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{benefit.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm flex items-center">
                      <Check size={16} className="text-green-500 mr-2" />
                      What's Included:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {benefit.details.map((detail, i) => (
                        <div key={i} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: hoveredBenefit === index ? 1 : 0,
                      scale: hoveredBenefit === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <Plus size={16} className="text-white" />
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-bold text-2xl md:text-3xl text-center text-gray-900 mb-12">
            What Our Team Says
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-16"
        >
          <h3 className="font-bold text-2xl md:text-3xl text-center text-gray-900 mb-8">
            And Much More...
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Gift, label: 'Birthday Gifts' },
              { icon: Music, label: 'Spotify Premium' },
              { icon: Gamepad2, label: 'Game Room' },
              { icon: Coffee, label: 'Free Snacks' },
              { icon: MapPin, label: 'Relocation Support' },
              { icon: Calendar, label: 'Volunteer Days' },
              { icon: Moon, label: 'Sabbatical Leave' },
              { icon: Globe, label: 'Global Mobility' }
            ].map((perk, index) => {
              const PerkIcon = perk.icon
              return (
                <motion.div
                  key={perk.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <PerkIcon size={24} className="text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-700">{perk.label}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="font-bold text-2xl md:text-3xl mb-4">
            Ready to Enjoy These Benefits?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join our team and experience a workplace that truly cares about your well-being, 
            growth, and success.
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
              <Gift size={20} className="mr-2" />
              Download Benefits Guide
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Benefits