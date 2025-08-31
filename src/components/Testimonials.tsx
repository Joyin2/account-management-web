'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO',
      company: 'TechStart Solutions',
      businessType: 'Technology',
      image: '/api/placeholder/64/64',
      rating: 5,
      content: 'Next-Gen Accounts has completely transformed how we manage our finances. The automated invoicing alone has saved us 15 hours per week. The real-time analytics help us make better business decisions every day.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Owner',
      company: 'Chen Manufacturing',
      businessType: 'Manufacturing',
      image: '/api/placeholder/64/64',
      rating: 5,
      content: 'The inventory management features are incredible. We can track our stock levels in real-time and get alerts before we run out. Our efficiency has improved by 40% since switching to this platform.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Founder',
      company: 'Green Valley Farms',
      businessType: 'Agriculture',
      image: '/api/placeholder/64/64',
      rating: 5,
      content: 'As a farm owner, I needed something that understood my unique business needs. The specialized features for agriculture businesses are exactly what I was looking for. Highly recommended!'
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Managing Director',
      company: 'Thompson Retail Group',
      businessType: 'Retail',
      image: '/api/placeholder/64/64',
      rating: 5,
      content: 'The multi-location support and comprehensive reporting have been game-changers for our retail chain. We can now manage all our stores from one central dashboard with complete visibility.'
    },
    {
      id: 5,
      name: 'Lisa Park',
      role: 'CFO',
      company: 'Park Consulting',
      businessType: 'Consulting',
      image: '/api/placeholder/64/64',
      rating: 5,
      content: 'The financial reporting and compliance features are outstanding. Tax season used to be a nightmare, but now everything is organized and ready. The customer support team is also incredibly helpful.'
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const getBusinessTypeColor = (type: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-600',
      'Manufacturing': 'bg-green-100 text-green-600',
      'Agriculture': 'bg-yellow-100 text-yellow-600',
      'Retail': 'bg-purple-100 text-purple-600',
      'Consulting': 'bg-indigo-100 text-indigo-600'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600'
  }

  return (
    <section className="py-20 bg-gray-50">
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
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what business owners across different industries 
            have to say about their experience with our platform.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div 
            className="overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="testimonial-card p-8 md:p-12"
              >
                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                    <Quote size={24} className="text-white" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-lg md:text-xl text-gray-700 text-center leading-relaxed mb-8 italic">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="text-center md:text-left">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                      getBusinessTypeColor(testimonials[currentIndex].businessType)
                    }`}>
                      {testimonials[currentIndex].businessType}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors focus-ring"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors focus-ring"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-blue-500 to-violet-500 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-violet-600 mb-2">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials