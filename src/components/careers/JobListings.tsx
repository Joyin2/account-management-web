'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Filter, 
  ChevronDown, 
  ArrowRight,
  Briefcase,
  Code,
  Palette,
  BarChart3,
  Shield,
  Headphones,
  Globe,
  Star,
  Calendar,
  Building,
  GraduationCap,
  Heart,
  Zap,
  Target,
  Award
} from 'lucide-react'

const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const departments = [
    { id: 'all', name: 'All Departments', icon: Building, count: 24 },
    { id: 'engineering', name: 'Engineering', icon: Code, count: 8 },
    { id: 'design', name: 'Design', icon: Palette, count: 3 },
    { id: 'product', name: 'Product', icon: Target, count: 4 },
    { id: 'marketing', name: 'Marketing', icon: BarChart3, count: 3 },
    { id: 'sales', name: 'Sales', icon: Users, count: 4 },
    { id: 'support', name: 'Customer Success', icon: Headphones, count: 2 }
  ]

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'remote', name: 'Remote' },
    { id: 'san-francisco', name: 'San Francisco, CA' },
    { id: 'new-york', name: 'New York, NY' },
    { id: 'london', name: 'London, UK' },
    { id: 'singapore', name: 'Singapore' }
  ]

  const jobTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'full-time', name: 'Full-time' },
    { id: 'part-time', name: 'Part-time' },
    { id: 'contract', name: 'Contract' },
    { id: 'internship', name: 'Internship' }
  ]

  const jobs = [
    {
      id: 1,
      title: 'Senior Full Stack Engineer',
      department: 'engineering',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: '$140k - $180k',
      experience: 'Senior Level',
      posted: '2 days ago',
      description: 'Join our core platform team to build scalable financial solutions that serve millions of users worldwide.',
      requirements: ['5+ years experience', 'React/Node.js', 'AWS/Docker', 'Financial systems experience'],
      benefits: ['Equity package', 'Health insurance', 'Flexible PTO', 'Learning budget'],
      tags: ['React', 'Node.js', 'AWS', 'TypeScript'],
      urgent: true
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'design',
      location: 'Remote',
      type: 'full-time',
      salary: '$120k - $150k',
      experience: 'Mid Level',
      posted: '1 week ago',
      description: 'Design intuitive user experiences for our next-generation accounting platform.',
      requirements: ['3+ years UX/UI design', 'Figma expertise', 'Design systems', 'B2B SaaS experience'],
      benefits: ['Remote work', 'Design tools budget', 'Conference attendance', 'Flexible hours'],
      tags: ['Figma', 'Design Systems', 'UX Research', 'Prototyping'],
      urgent: false
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'engineering',
      location: 'New York, NY',
      type: 'full-time',
      salary: '$130k - $170k',
      experience: 'Senior Level',
      posted: '3 days ago',
      description: 'Build and maintain our cloud infrastructure to ensure 99.9% uptime for our global platform.',
      requirements: ['4+ years DevOps', 'Kubernetes', 'CI/CD pipelines', 'Monitoring tools'],
      benefits: ['Stock options', 'Health & dental', 'Gym membership', 'Commuter benefits'],
      tags: ['Kubernetes', 'AWS', 'Docker', 'Terraform'],
      urgent: true
    },
    {
      id: 4,
      title: 'Product Manager',
      department: 'product',
      location: 'London, UK',
      type: 'full-time',
      salary: '£80k - £110k',
      experience: 'Mid Level',
      posted: '5 days ago',
      description: 'Drive product strategy and roadmap for our enterprise accounting solutions.',
      requirements: ['3+ years product management', 'B2B SaaS experience', 'Data-driven approach', 'Stakeholder management'],
      benefits: ['Pension scheme', 'Private healthcare', 'Flexible working', 'Learning budget'],
      tags: ['Product Strategy', 'Analytics', 'Roadmapping', 'Agile'],
      urgent: false
    },
    {
      id: 5,
      title: 'Marketing Manager',
      department: 'marketing',
      location: 'Remote',
      type: 'full-time',
      salary: '$90k - $120k',
      experience: 'Mid Level',
      posted: '1 week ago',
      description: 'Lead digital marketing campaigns to drive growth and brand awareness.',
      requirements: ['3+ years marketing', 'Digital campaigns', 'Analytics tools', 'Content strategy'],
      benefits: ['Remote work', 'Marketing tools budget', 'Performance bonus', 'Professional development'],
      tags: ['Digital Marketing', 'SEO/SEM', 'Analytics', 'Content'],
      urgent: false
    },
    {
      id: 6,
      title: 'Customer Success Manager',
      department: 'support',
      location: 'Singapore',
      type: 'full-time',
      salary: 'S$80k - S$110k',
      experience: 'Mid Level',
      posted: '4 days ago',
      description: 'Help our enterprise customers achieve success with our platform.',
      requirements: ['2+ years customer success', 'B2B SaaS experience', 'Excellent communication', 'Problem-solving skills'],
      benefits: ['Health insurance', 'Annual bonus', 'Training budget', 'Flexible hours'],
      tags: ['Customer Success', 'Account Management', 'SaaS', 'Communication'],
      urgent: false
    },
    {
      id: 7,
      title: 'Frontend Engineer Intern',
      department: 'engineering',
      location: 'San Francisco, CA',
      type: 'internship',
      salary: '$6k - $8k/month',
      experience: 'Entry Level',
      posted: '1 week ago',
      description: 'Join our engineering team as an intern and work on real projects that impact millions of users.',
      requirements: ['Computer Science student', 'React knowledge', 'JavaScript proficiency', 'Portfolio projects'],
      benefits: ['Mentorship program', 'Learning opportunities', 'Networking events', 'Potential full-time offer'],
      tags: ['React', 'JavaScript', 'Internship', 'Mentorship'],
      urgent: false
    },
    {
      id: 8,
      title: 'Sales Development Representative',
      department: 'sales',
      location: 'New York, NY',
      type: 'full-time',
      salary: '$60k - $80k + commission',
      experience: 'Entry Level',
      posted: '2 days ago',
      description: 'Generate qualified leads and build relationships with potential enterprise customers.',
      requirements: ['1+ years sales experience', 'B2B sales background', 'CRM proficiency', 'Strong communication'],
      benefits: ['Commission structure', 'Sales training', 'Career progression', 'Team events'],
      tags: ['B2B Sales', 'Lead Generation', 'CRM', 'Communication'],
      urgent: true
    }
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment
    const matchesLocation = selectedLocation === 'all' || 
                           job.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                           (selectedLocation === 'remote' && job.location === 'Remote')
    const matchesType = selectedType === 'all' || job.type === selectedType
    
    return matchesSearch && matchesDepartment && matchesLocation && matchesType
  })

  const getDepartmentIcon = (department: string) => {
    const dept = departments.find(d => d.id === department)
    return dept ? dept.icon : Briefcase
  }

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
            Open
            <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Positions
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our team and help build the future of financial technology. We're looking for 
            passionate individuals who want to make a real impact.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, skills, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">
                {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} found
              </span>
              {(selectedDepartment !== 'all' || selectedLocation !== 'all' || selectedType !== 'all') && (
                <motion.button
                  onClick={() => {
                    setSelectedDepartment('all')
                    setSelectedLocation('all')
                    setSelectedType('all')
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear filters
                </motion.button>
              )}
            </div>
            
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-300"
            >
              <Filter size={16} className="mr-2" />
              Filters
              <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-2xl p-6 mb-6 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Department Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Department</label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Job Type Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Job Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {jobTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Department Quick Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {departments.map((dept) => {
            const DeptIcon = dept.icon
            return (
              <motion.button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedDepartment === dept.id
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <DeptIcon size={16} className="mr-2" />
                {dept.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedDepartment === dept.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {dept.count}
                </span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Job Listings */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredJobs.map((job, index) => {
              const DeptIcon = getDepartmentIcon(job.department)
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  {job.urgent && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1 text-xs font-semibold rounded-bl-xl">
                      Urgent Hiring
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job Info */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center">
                            <DeptIcon size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-1">{job.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Building size={14} className="mr-1" />
                                {departments.find(d => d.id === job.department)?.name}
                              </div>
                              <div className="flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-lg text-green-600 mb-1">{job.salary}</div>
                          <div className="text-sm text-gray-600">{job.experience}</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed">{job.description}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Job Details */}
                    <div className="space-y-6">
                      {/* Requirements */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <GraduationCap size={16} className="mr-2" />
                          Requirements
                        </h4>
                        <ul className="space-y-2">
                          {job.requirements.slice(0, 3).map((req, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Benefits */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Heart size={16} className="mr-2" />
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {job.benefits.slice(0, 3).map((benefit, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <Star size={12} className="text-yellow-500 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Apply Button */}
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                        >
                          Apply Now
                          <ArrowRight size={16} className="ml-2" />
                        </motion.button>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            Posted {job.posted}
                          </div>
                          <div className="flex items-center">
                            <Users size={12} className="mr-1" />
                            12 applicants
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-3">No positions found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any positions matching your criteria. Try adjusting your filters or search terms.
            </p>
            <motion.button
              onClick={() => {
                setSearchTerm('')
                setSelectedDepartment('all')
                setSelectedLocation('all')
                setSelectedType('all')
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Clear All Filters
            </motion.button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="font-bold text-2xl md:text-3xl mb-4">
            Don't See the Perfect Role?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Submit General Application
              <ArrowRight size={20} className="ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center"
            >
              <Award size={20} className="mr-2" />
              Join Talent Pool
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default JobListings