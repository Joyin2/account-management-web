'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Rocket, Globe, Heart } from 'lucide-react'
import Image from 'next/image'

const CompanyStory = () => {
  const storyPoints = [
    {
      icon: Lightbulb,
      title: 'The Vision',
      description: 'Born from the frustration of complex accounting software, we envisioned a world where financial management is intuitive, powerful, and accessible to everyone.'
    },
    {
      icon: Rocket,
      title: 'The Mission',
      description: 'To democratize financial technology by providing businesses with enterprise-grade accounting tools that are simple enough for anyone to use.'
    },
    {
      icon: Globe,
      title: 'The Impact',
      description: 'Today, we serve over 50,000 businesses worldwide, helping them save time, reduce costs, and make better financial decisions.'
    },
    {
      icon: Heart,
      title: 'The Commitment',
      description: 'We are committed to continuous innovation, exceptional customer service, and building lasting partnerships with our clients.'
    }
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
            Our Story
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Founded in 2018 by a team of financial experts and technology innovators, 
            NextGen Accounts was created to solve the real challenges businesses face 
            in managing their finances.
          </p>
        </motion.div>

        {/* Main Story Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Story Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-100 to-violet-100 p-6 rounded-2xl">
              <h3 className="font-poppins font-semibold text-2xl text-gray-900 mb-4">
                The Beginning
              </h3>
              <p className="text-gray-700 leading-relaxed">
                It all started when our founders, experienced accountants and software engineers, 
                witnessed countless businesses struggling with outdated, complex financial software. 
                They saw small business owners spending more time fighting with their accounting 
                tools than focusing on growing their businesses.
              </p>
            </div>

            <div className="bg-gradient-to-r from-violet-100 to-blue-100 p-6 rounded-2xl">
              <h3 className="font-poppins font-semibold text-2xl text-gray-900 mb-4">
                The Solution
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We set out to build something different – an accounting platform that combines 
                the power of enterprise software with the simplicity of consumer apps. Our goal 
                was to make financial management so intuitive that anyone could master it, 
                regardless of their accounting background.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-violet-100 p-6 rounded-2xl">
              <h3 className="font-poppins font-semibold text-2xl text-gray-900 mb-4">
                The Future
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Today, we continue to innovate and expand our platform, always keeping our 
                customers at the center of everything we do. We're not just building software; 
                we're building the future of business financial management.
              </p>
            </div>
          </motion.div>

          {/* Story Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-50 to-violet-50 rounded-3xl p-8 shadow-2xl">
              {/* Placeholder for company image */}
              <div className="aspect-square bg-gradient-to-br from-blue-200 to-violet-200 rounded-2xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket size={40} className="text-blue-600" />
                  </div>
                  <p className="text-gray-700 font-medium">Company Journey</p>
                </div>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="font-bold text-2xl text-blue-600">2018</div>
                  <div className="text-sm text-gray-600">Founded</div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="font-bold text-2xl text-violet-600">50K+</div>
                  <div className="text-sm text-gray-600">Customers</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Story Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {storyPoints.map((point, index) => {
            const Icon = point.icon
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-xl text-gray-900 mb-4">
                  {point.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-3xl p-8 md:p-12">
            <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-4">
              Join Our Journey
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Be part of the financial revolution. Experience the difference that 
              thoughtful design and powerful technology can make for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Your Free Trial
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Schedule a Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CompanyStory