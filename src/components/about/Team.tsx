'use client'

import { motion } from 'framer-motion'
import { 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin, 
  Users, 
  Award, 
  Globe, 
  Heart,
  Coffee,
  Code,
  Briefcase,
  GraduationCap
} from 'lucide-react'

const Team = () => {
  const leadership = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former VP of Product at TechCorp with 15+ years in fintech. Passionate about democratizing financial tools for small businesses.',
      image: '/api/placeholder/300/300',
      location: 'San Francisco, CA',
      expertise: ['Strategic Leadership', 'Product Vision', 'Fintech Innovation'],
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'sarah@nextgenaccounts.com'
      },
      quote: 'Every small business deserves enterprise-level financial tools.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google engineer with expertise in scalable systems and AI. Led engineering teams at three successful startups.',
      image: '/api/placeholder/300/300',
      location: 'Austin, TX',
      expertise: ['System Architecture', 'AI/ML', 'Team Leadership'],
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'michael@nextgenaccounts.com'
      },
      quote: 'Technology should simplify complexity, not create it.'
    },
    {
      name: 'Emily Watson',
      role: 'VP of Customer Success',
      bio: 'Customer success expert with a track record of building world-class support teams. Previously at Salesforce and HubSpot.',
      image: '/api/placeholder/300/300',
      location: 'Boston, MA',
      expertise: ['Customer Success', 'Team Building', 'Process Optimization'],
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'emily@nextgenaccounts.com'
      },
      quote: 'Our customers\' success is our success. It\'s that simple.'
    },
    {
      name: 'David Kim',
      role: 'VP of Engineering',
      bio: 'Full-stack engineer turned engineering leader. Specializes in building secure, scalable financial platforms.',
      image: '/api/placeholder/300/300',
      location: 'Seattle, WA',
      expertise: ['Software Engineering', 'Security', 'Scalability'],
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'david@nextgenaccounts.com'
      },
      quote: 'Great software is built by great teams, not great individuals.'
    },
    {
      name: 'Lisa Thompson',
      role: 'VP of Marketing',
      bio: 'Growth marketing specialist with experience scaling B2B SaaS companies from startup to IPO.',
      image: '/api/placeholder/300/300',
      location: 'New York, NY',
      expertise: ['Growth Marketing', 'Brand Strategy', 'Content Marketing'],
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'lisa@nextgenaccounts.com'
      },
      quote: 'Authentic storytelling builds lasting customer relationships.'
    },
    {
      name: 'James Park',
      role: 'VP of Finance',
      bio: 'Former investment banker and CFO with deep expertise in financial planning and business strategy.',
      image: '/api/placeholder/300/300',
      location: 'Chicago, IL',
      expertise: ['Financial Planning', 'Business Strategy', 'Risk Management'],
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'james@nextgenaccounts.com'
      },
      quote: 'Financial clarity empowers better business decisions.'
    }
  ]

  const teamStats = [
    {
      icon: Users,
      number: '150+',
      label: 'Team Members',
      description: 'Talented professionals across 6 countries'
    },
    {
      icon: Globe,
      number: '6',
      label: 'Countries',
      description: 'Global team working around the clock'
    },
    {
      icon: Award,
      number: '25+',
      label: 'Years Combined',
      description: 'Leadership experience in fintech'
    },
    {
      icon: GraduationCap,
      number: '85%',
      label: 'Advanced Degrees',
      description: 'Masters, PhDs, and professional certifications'
    }
  ]

  const departments = [
    {
      name: 'Engineering',
      icon: Code,
      count: 45,
      description: 'Building the future of financial software',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Product',
      icon: Briefcase,
      count: 18,
      description: 'Designing user-centered experiences',
      color: 'from-purple-500 to-violet-500'
    },
    {
      name: 'Customer Success',
      icon: Heart,
      count: 25,
      description: 'Ensuring customer happiness and growth',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Sales & Marketing',
      icon: Users,
      count: 32,
      description: 'Connecting with businesses worldwide',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Operations',
      icon: Coffee,
      count: 30,
      description: 'Keeping everything running smoothly',
      color: 'from-yellow-500 to-orange-500'
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
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're a diverse group of passionate individuals united by a common mission: 
            making financial management accessible and powerful for every business.
          </p>
        </motion.div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {teamStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-gray-50 rounded-xl p-6"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <div className="font-bold text-2xl text-gray-900 mb-2">{stat.number}</div>
                <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Leadership Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-4">
              Leadership Team
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the experienced leaders driving our vision and guiding our growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex items-center justify-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-1" />
                    {member.location}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                  <h4 className="font-poppins font-bold text-xl text-gray-900 mb-1">
                    {member.name}
                  </h4>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  
                  {/* Quote */}
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-blue-800 text-sm italic">
                      "{member.quote}"
                    </p>
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 text-sm mb-2">Expertise:</h5>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.social.linkedin}
                    className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white hover:bg-sky-600 transition-colors"
                  >
                    <Twitter size={16} />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Departments */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-4">
              Our Departments
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each department brings unique expertise and passion to our shared mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {departments.map((dept, index) => {
              const Icon = dept.icon
              return (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${dept.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h4 className="font-poppins font-semibold text-lg text-gray-900 mb-2">
                    {dept.name}
                  </h4>
                  <div className="font-bold text-2xl text-gray-900 mb-2">{dept.count}</div>
                  <p className="text-sm text-gray-600">{dept.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Join Our Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-6">
            Join Our Growing Team
          </h3>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            We're always looking for talented individuals who share our passion for 
            innovation and customer success. Come help us build the future of financial management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              View Open Positions
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Learn About Our Culture
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Team