'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Users, 
  Video, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Upload, 
  Calendar, 
  MessageSquare, 
  Award, 
  Target, 
  Lightbulb, 
  Coffee, 
  Handshake, 
  Mail, 
  Phone, 
  Globe, 
  Download, 
  ExternalLink, 
  Play, 
  BookOpen, 
  HelpCircle, 
  Star, 
  Timer, 
  Users2, 
  Building, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Zap, 
  Shield
} from 'lucide-react'

const ApplicationProcess = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedRole, setSelectedRole] = useState('engineering')

  const steps = [
    {
      id: 1,
      title: 'Application Submission',
      duration: '5-10 minutes',
      icon: FileText,
      description: 'Submit your application with resume and cover letter',
      details: [
        'Complete online application form',
        'Upload your resume (PDF preferred)',
        'Write a personalized cover letter',
        'Answer role-specific questions',
        'Provide portfolio/work samples if applicable'
      ],
      tips: [
        'Tailor your resume to the specific role',
        'Highlight relevant achievements with metrics',
        'Show your passion for financial technology',
        'Proofread everything carefully'
      ],
      timeline: 'Immediate confirmation'
    },
    {
      id: 2,
      title: 'Initial Screening',
      duration: '30 minutes',
      icon: Users,
      description: 'Phone/video call with our talent acquisition team',
      details: [
        'Discussion about your background and experience',
        'Overview of the role and company culture',
        'Initial assessment of technical skills',
        'Q&A about NextGen Accounts',
        'Next steps explanation'
      ],
      tips: [
        'Research our company and products thoroughly',
        'Prepare specific examples of your achievements',
        'Have questions ready about the role and team',
        'Test your video/audio setup beforehand'
      ],
      timeline: '1-2 business days after application'
    },
    {
      id: 3,
      title: 'Technical Assessment',
      duration: '1-2 hours',
      icon: Target,
      description: 'Role-specific technical evaluation and problem-solving',
      details: [
        'Coding challenge or design exercise',
        'System design discussion (for senior roles)',
        'Portfolio review and case study presentation',
        'Technical knowledge assessment',
        'Problem-solving approach evaluation'
      ],
      tips: [
        'Practice coding problems on relevant platforms',
        'Review fundamental concepts for your field',
        'Prepare to explain your thought process',
        'Ask clarifying questions when needed'
      ],
      timeline: '3-5 business days after screening'
    },
    {
      id: 4,
      title: 'Team Interviews',
      duration: '2-3 hours',
      icon: Users2,
      description: 'Meet with potential teammates and stakeholders',
      details: [
        'Technical deep-dive with engineering team',
        'Behavioral interview with hiring manager',
        'Cross-functional collaboration discussion',
        'Culture fit assessment',
        'Leadership interview (for senior roles)'
      ],
      tips: [
        'Use the STAR method for behavioral questions',
        'Demonstrate collaboration and communication skills',
        'Show genuine interest in the team and projects',
        'Be authentic and ask thoughtful questions'
      ],
      timeline: '1 week after technical assessment'
    },
    {
      id: 5,
      title: 'Final Decision',
      duration: '15 minutes',
      icon: CheckCircle,
      description: 'Reference checks and offer discussion',
      details: [
        'Reference verification with previous employers',
        'Background check completion',
        'Offer package preparation',
        'Negotiation and finalization',
        'Welcome package and onboarding preparation'
      ],
      tips: [
        'Provide responsive and relevant references',
        'Be prepared to discuss compensation expectations',
        'Review offer details carefully',
        'Ask about start date flexibility if needed'
      ],
      timeline: '2-3 business days after interviews'
    }
  ]

  const roleSpecificInfo = {
    engineering: {
      title: 'Engineering Roles',
      icon: Target,
      assessments: [
        'Coding challenge in your preferred language',
        'System design for scalable applications',
        'Code review and optimization exercise',
        'API design and database modeling'
      ],
      interviewers: [
        'Senior Engineer (Technical Lead)',
        'Engineering Manager',
        'Product Manager',
        'DevOps/Infrastructure Engineer'
      ]
    },
    design: {
      title: 'Design Roles',
      icon: Award,
      assessments: [
        'Portfolio presentation and walkthrough',
        'Design challenge with real-world scenario',
        'User research and usability discussion',
        'Design system and component creation'
      ],
      interviewers: [
        'Senior Designer',
        'Design Manager',
        'Product Manager',
        'Frontend Engineer'
      ]
    },
    product: {
      title: 'Product Roles',
      icon: Lightbulb,
      assessments: [
        'Product case study analysis',
        'Feature prioritization exercise',
        'Market research and competitive analysis',
        'Stakeholder communication simulation'
      ],
      interviewers: [
        'Senior Product Manager',
        'Head of Product',
        'Engineering Lead',
        'Data Analyst'
      ]
    },
    marketing: {
      title: 'Marketing Roles',
      icon: Zap,
      assessments: [
        'Campaign strategy development',
        'Content creation and messaging',
        'Analytics and performance measurement',
        'Brand positioning exercise'
      ],
      interviewers: [
        'Marketing Manager',
        'Head of Marketing',
        'Sales Director',
        'Content Strategist'
      ]
    }
  }

  const faqs = [
    {
      question: 'How long does the entire process take?',
      answer: 'Our typical hiring process takes 2-3 weeks from application to offer, depending on role complexity and candidate availability. We prioritize efficiency while ensuring thorough evaluation.'
    },
    {
      question: 'What should I expect in the technical assessment?',
      answer: 'Technical assessments are tailored to your role and experience level. We focus on real-world problems you\'d solve at NextGen, not obscure algorithmic puzzles. You\'ll have time to ask questions and explain your approach.'
    },
    {
      question: 'Can I interview remotely?',
      answer: 'Absolutely! All our interviews can be conducted remotely via video call. We have team members worldwide and are experienced in remote interviewing and onboarding.'
    },
    {
      question: 'What if I need accommodations during the interview process?',
      answer: 'We\'re committed to providing equal opportunities and reasonable accommodations. Please let us know about any needs when scheduling interviews, and we\'ll work together to ensure a comfortable experience.'
    },
    {
      question: 'How do you evaluate culture fit?',
      answer: 'We assess alignment with our core values: innovation, collaboration, customer focus, and continuous learning. We look for candidates who thrive in our fast-paced, supportive environment and contribute positively to team dynamics.'
    }
  ]

  const tips = [
    {
      icon: BookOpen,
      title: 'Research Thoroughly',
      description: 'Learn about our products, mission, and recent company news. Understanding our business shows genuine interest.'
    },
    {
      icon: Star,
      title: 'Prepare Examples',
      description: 'Have specific stories ready that demonstrate your skills, achievements, and problem-solving abilities using the STAR method.'
    },
    {
      icon: MessageSquare,
      title: 'Ask Great Questions',
      description: 'Prepare thoughtful questions about the role, team, challenges, and growth opportunities. This shows engagement and helps you evaluate fit.'
    },
    {
      icon: Heart,
      title: 'Be Authentic',
      description: 'We value genuine personalities and diverse perspectives. Be yourself and let your passion for technology and innovation shine through.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
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
            Our Hiring
            <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Process
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We've designed a transparent, efficient process that helps us find the right fit 
            while giving you the best experience possible.
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          {/* Step Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <motion.button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeStep === index
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  <StepIcon size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-semibold">Step {step.id}</div>
                    <div className="text-xs opacity-75">{step.title}</div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Active Step Details */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-lg"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Step Info */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mr-4">
                      {React.createElement(steps[activeStep].icon, { size: 32, className: 'text-white' })}
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900">{steps[activeStep].title}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Clock size={16} className="mr-2" />
                        <span>{steps[activeStep].duration}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600">{steps[activeStep].description}</p>
                </div>

                {/* What to Expect */}
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-4">What to Expect</h4>
                  <ul className="space-y-3">
                    {steps[activeStep].details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="flex items-center mb-2">
                    <Calendar size={20} className="text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-900">Timeline</span>
                  </div>
                  <p className="text-gray-600">{steps[activeStep].timeline}</p>
                </div>
              </div>

              {/* Tips */}
              <div className="space-y-8">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                    <Lightbulb size={20} className="text-yellow-500 mr-2" />
                    Success Tips
                  </h4>
                  <div className="space-y-4">
                    {steps[activeStep].tips.map((tip, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-l-4 border-yellow-400"
                      >
                        <p className="text-gray-700">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <motion.button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    whileHover={{ scale: activeStep === 0 ? 1 : 1.05 }}
                    whileTap={{ scale: activeStep === 0 ? 1 : 0.95 }}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous Step
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                    disabled={activeStep === steps.length - 1}
                    whileHover={{ scale: activeStep === steps.length - 1 ? 1 : 1.05 }}
                    whileTap={{ scale: activeStep === steps.length - 1 ? 1 : 0.95 }}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center ${
                      activeStep === steps.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg'
                    }`}
                  >
                    Next Step
                    <ArrowRight size={16} className="ml-2" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Role-Specific Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-bold text-2xl md:text-3xl text-gray-900 text-center mb-8">
            Role-Specific Details
          </h3>
          
          {/* Role Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(roleSpecificInfo).map(([key, role]) => {
              const RoleIcon = role.icon
              return (
                <motion.button
                  key={key}
                  onClick={() => setSelectedRole(key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedRole === key
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  <RoleIcon size={16} className="mr-2" />
                  {role.title}
                </motion.button>
              )
            })}
          </div>

          {/* Role Details */}
          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Assessments */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="font-semibold text-xl text-gray-900 mb-6 flex items-center">
                <Target size={20} className="text-blue-600 mr-2" />
                Technical Assessments
              </h4>
              <ul className="space-y-3">
                {roleSpecificInfo[selectedRole as keyof typeof roleSpecificInfo].assessments.map((assessment: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{assessment}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Panel */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="font-semibold text-xl text-gray-900 mb-6 flex items-center">
                <Users2 size={20} className="text-violet-600 mr-2" />
                You'll Meet With
              </h4>
              <ul className="space-y-3">
                {roleSpecificInfo[selectedRole as keyof typeof roleSpecificInfo].interviewers.map((interviewer: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-gray-600 mt-1">{interviewer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Success Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-bold text-2xl md:text-3xl text-gray-900 text-center mb-12">
            Interview Success Tips
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => {
              const TipIcon = tip.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mb-4">
                    <TipIcon size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">{tip.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-bold text-2xl md:text-3xl text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h3>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <HelpCircle size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900 mb-3">{faq.question}</h4>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="font-bold text-2xl md:text-3xl mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Browse our open positions and take the first step toward joining our innovative team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <Briefcase size={20} className="mr-2" />
              View Open Positions
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <Download size={20} className="mr-2" />
              Download Interview Guide
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ApplicationProcess