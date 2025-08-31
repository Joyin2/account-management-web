'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Quote, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  MapPin, 
  Calendar, 
  Award, 
  Users, 
  Heart, 
  TrendingUp, 
  Code, 
  Palette, 
  BarChart3, 
  Headphones, 
  Shield, 
  Target, 
  Building, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Coffee, 
  Smile, 
  ArrowRight, 
  Camera, 
  Video, 
  Mic
} from 'lucide-react'

const EmployeeTestimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const departments = [
    { id: 'all', name: 'All Teams', icon: Building },
    { id: 'engineering', name: 'Engineering', icon: Code },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'product', name: 'Product', icon: Target },
    { id: 'marketing', name: 'Marketing', icon: BarChart3 },
    { id: 'sales', name: 'Sales', icon: Users },
    { id: 'support', name: 'Support', icon: Headphones }
  ]

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Senior Full Stack Engineer',
      department: 'engineering',
      location: 'San Francisco, CA',
      tenure: '3 years',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      quote: 'NextGen Accounts has been the perfect place for me to grow as an engineer. The technical challenges are exciting, the team is incredibly supportive, and the learning opportunities are endless. I\'ve been able to work on cutting-edge financial technology that impacts millions of users.',
      highlights: [
        'Led migration to microservices architecture',
        'Mentored 5 junior developers',
        'Spoke at 3 industry conferences',
        'Promoted twice in 3 years'
      ],
      tags: ['Growth', 'Innovation', 'Mentorship', 'Impact'],
      videoThumbnail: '/api/placeholder/400/300',
      hasVideo: true
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Product Design Lead',
      department: 'design',
      location: 'Remote (Austin, TX)',
      tenure: '2.5 years',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      quote: 'The design culture here is phenomenal. We\'re given the freedom to explore creative solutions while being backed by solid user research. The collaboration between design, product, and engineering is seamless, and I\'ve never felt more valued as a designer.',
      highlights: [
        'Redesigned core user experience',
        'Built design system from scratch',
        'Increased user satisfaction by 40%',
        'Led design team of 8 people'
      ],
      tags: ['Creativity', 'Collaboration', 'User-Centric', 'Leadership'],
      videoThumbnail: '/api/placeholder/400/300',
      hasVideo: false
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Product Manager',
      department: 'product',
      location: 'London, UK',
      tenure: '4 years',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      quote: 'What I love most about NextGen is how we truly put customers first. Every decision is backed by data and user feedback. The company has given me incredible opportunities to shape product strategy and work with amazing cross-functional teams.',
      highlights: [
        'Launched 3 major product features',
        'Grew user base by 200%',
        'Led international expansion',
        'Built product analytics framework'
      ],
      tags: ['Strategy', 'Data-Driven', 'Global Impact', 'Customer Focus'],
      videoThumbnail: '/api/placeholder/400/300',
      hasVideo: true
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'DevOps Engineer',
      department: 'engineering',
      location: 'Singapore',
      tenure: '1.5 years',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      quote: 'The infrastructure challenges at NextGen are exactly what I was looking for in my career. We\'re building systems that handle massive scale while maintaining 99.9% uptime. The team trusts me to make important decisions and supports my professional growth.',
      highlights: [
        'Reduced deployment time by 80%',
        'Implemented zero-downtime deployments',
        'Built monitoring and alerting systems',
        'Achieved 99.9% uptime SLA'
      ],
      tags: ['Scale', 'Reliability', 'Innovation', 'Trust'],
      videoThumbnail: '/api/placeholder/400/300',
      hasVideo: false
    },
    {
      id: 5,
      name: 'Amanda Foster',
      role: 'Marketing Director',
      department: 'marketing',
      location: 'New York, NY',
      tenure: '2 years',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      quote: 'NextGen has given me the platform to build marketing strategies that truly make a difference. The company\'s commitment to innovation extends to how we approach marketing, and I\'ve been able to experiment with cutting-edge campaigns that drive real business results.',
      highlights: [
        'Increased brand awareness by 150%',
        'Led rebranding initiative',
        'Built content marketing strategy',
        'Grew social media following by 300%'
      ],
      tags: ['Brand Building', 'Strategy', 'Innovation', 'Results'],
      videoThumbnail: '/api/placeholder/400/300',
      hasVideo: true
    },
    {
      id: 6,
      name: 'James Wilson',
      role: 'Customer Success Manager',
      department: 'support',
      location: 'Remote (Denver, CO)',
      tenure: '3 years',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      quote: 'Working in customer success at NextGen means being part of our customers\' growth stories. Every day, I help businesses transform their financial operations. The company empowers us to go above and beyond for our customers, and that makes all the difference.',
      highlights: [
        'Maintained 98% customer satisfaction',
        'Reduced churn rate by 25%',
        'Onboarded 200+ enterprise clients',
        'Built customer training program'
      ],
      tags: ['Customer Focus', 'Relationship Building', 'Problem Solving', 'Impact'],
      videoThumbnail: '/api/placeholder/400/300',
      hasVideo: false
    }
  ]

  const filteredTestimonials = selectedDepartment === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.department === selectedDepartment)

  const stats = [
    { label: 'Employee Satisfaction', value: '98%', icon: Smile },
    { label: 'Would Recommend', value: '96%', icon: Heart },
    { label: 'Career Growth Rate', value: '85%', icon: TrendingUp },
    { label: 'Average Tenure', value: '2.8 years', icon: Calendar }
  ]

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => 
        (prev + 1) % filteredTestimonials.length
      )
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, filteredTestimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % filteredTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length
    )
  }

  const currentData = filteredTestimonials[currentTestimonial]

  return (
    <section className="py-20 bg-white">
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
            Hear From
            <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Our Team
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover what it's really like to work at NextGen Accounts through the 
            experiences and stories of our team members.
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
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-6 text-center"
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

        {/* Department Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {departments.map((dept) => {
            const DeptIcon = dept.icon
            return (
              <motion.button
                key={dept.id}
                onClick={() => {
                  setSelectedDepartment(dept.id)
                  setCurrentTestimonial(0)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedDepartment === dept.id
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <DeptIcon size={16} className="mr-2" />
                {dept.name}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Main Testimonial */}
        {filteredTestimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-violet-100 rounded-full opacity-50 transform translate-x-32 -translate-y-32"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentData.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <div className="space-y-8">
                    {/* Quote */}
                    <div className="relative">
                      <Quote size={48} className="text-blue-500 opacity-20 absolute -top-4 -left-2" />
                      <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic pl-8">
                        "{currentData.quote}"
                      </p>
                    </div>
                    
                    {/* Author Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {currentData.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{currentData.name}</h3>
                        <p className="text-gray-600">{currentData.role}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {currentData.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {currentData.tenure}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(currentData.rating)].map((_, i) => (
                          <Star key={i} size={20} className="text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <span className="text-gray-600 font-medium">Employee Rating</span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {currentData.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm font-medium shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Video/Image */}
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-violet-100 rounded-2xl overflow-hidden relative">
                      {currentData.hasVideo ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Play size={24} className="text-blue-600 ml-1" />
                          </motion.button>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Camera size={48} className="text-blue-500 mx-auto mb-4" />
                            <p className="text-gray-600">Employee Spotlight</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Video Badge */}
                      {currentData.hasVideo && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                          <Video size={12} className="mr-1" />
                          Video Story
                        </div>
                      )}
                    </div>
                    
                    {/* Highlights */}
                    <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Award size={16} className="mr-2 text-yellow-500" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {currentData.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={prevTestimonial}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </motion.button>
                
                <motion.button
                  onClick={nextTestimonial}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </motion.button>
                
                <motion.button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAutoPlaying ? (
                    <Pause size={20} className="text-gray-600" />
                  ) : (
                    <Play size={20} className="text-gray-600 ml-0.5" />
                  )}
                </motion.button>
              </div>
              
              {/* Indicators */}
              <div className="flex items-center space-x-2">
                {filteredTestimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    whileHover={{ scale: 1.2 }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-blue-500 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              {/* Counter */}
              <div className="text-sm text-gray-600">
                {currentTestimonial + 1} of {filteredTestimonials.length}
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="font-bold text-2xl md:text-3xl mb-4">
            Ready to Write Your Own Success Story?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join our team and become part of a community that values growth, innovation, 
            and making a real impact in the world of financial technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Explore Careers
              <ArrowRight size={20} className="ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <Mic size={20} className="mr-2" />
              Share Your Story
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default EmployeeTestimonials