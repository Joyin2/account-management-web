'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Youtube,
  ArrowRight,
  Shield,
  Award,
  Users
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Integrations', href: '/integrations' },
      { name: 'API Documentation', href: '/api-docs' },
      { name: 'Mobile App', href: '/mobile' },
      { name: 'Desktop App', href: '/desktop' }
    ],
    solutions: [
      { name: 'Small Business', href: '/solutions/small-business' },
      { name: 'Enterprise', href: '/solutions/enterprise' },
      { name: 'Accountants', href: '/solutions/accountants' },
      { name: 'E-commerce', href: '/solutions/ecommerce' },
      { name: 'Non-profit', href: '/solutions/nonprofit' },
      { name: 'Freelancers', href: '/solutions/freelancers' }
    ],
    resources: [
      { name: 'Help Center', href: '/help' },
      { name: 'Blog', href: '/blog' },
      { name: 'Webinars', href: '/webinars' },
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'Templates', href: '/templates' },
      { name: 'Training', href: '/training' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Partners', href: '/partners' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' },
      { name: 'Investors', href: '/investors' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
      { name: 'Security', href: '/security' },
      { name: 'Compliance', href: '/compliance' }
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/nextgenaccounts' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/nextgenaccounts' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/nextgenaccounts' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/nextgenaccounts' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/nextgenaccounts' }
  ]

  const certifications = [
    { name: 'SOC 2 Certified', icon: Shield },
    { name: 'ISO 27001', icon: Award },
    { name: '50,000+ Users', icon: Users }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-4">
              Stay Updated with NextGen Accounts
            </h3>
            <p className="text-gray-300 text-lg mb-8">
              Get the latest updates, tips, and insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="btn-primary flex items-center justify-center space-x-2 whitespace-nowrap">
                <span>Subscribe</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              No spam, unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Link href="/" className="inline-block mb-6">
              <div className="font-poppins font-bold text-2xl bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                NextGen Accounts
              </div>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering businesses with intelligent accounting solutions. 
              Streamline your finances, boost productivity, and grow with confidence.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400" />
                <a href="mailto:hello@nextgenaccounts.com" className="text-gray-300 hover:text-white transition-colors">
                  hello@nextgenaccounts.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-400" />
                <a href="tel:+1-800-123-4567" className="text-gray-300 hover:text-white transition-colors">
                  +1 (800) 123-4567
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-blue-400 mt-1" />
                <span className="text-gray-300">
                  123 Business Ave, Suite 100<br />
                  San Francisco, CA 94105
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </motion.div>

          {/* Links Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Product */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-white mb-4">Solutions</h4>
              <ul className="space-y-3">
                {footerLinks.solutions.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          >
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} NextGen Accounts. All rights reserved.
            </div>

            {/* Certifications */}
            <div className="flex items-center space-x-6">
              {certifications.map((cert) => {
                const Icon = cert.icon
                return (
                  <div key={cert.name} className="flex items-center space-x-2 text-gray-400">
                    <Icon size={16} />
                    <span className="text-sm">{cert.name}</span>
                  </div>
                )
              })}
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                Accessibility
              </Link>
              <Link href="/status" className="text-gray-400 hover:text-white transition-colors">
                Status
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer