'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Server, 
  Shield, 
  Zap, 
  Globe, 
  Database,
  Cloud,
  Lock,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Download,
  Code,
  Smartphone,
  Chrome,
  Award,
  Clock,
  Users,
  BarChart3,
  FileText
} from 'lucide-react'

const TechnicalSpecs = () => {
  const [activeTab, setActiveTab] = useState(0)

  const techCategories = [
    {
      id: 'infrastructure',
      title: 'Infrastructure',
      icon: Server,
      color: 'from-blue-500 to-cyan-500',
      description: 'Enterprise-grade cloud infrastructure built for scale',
      specs: [
        {
          category: 'Cloud Platform',
          items: [
            { label: 'Primary Provider', value: 'AWS (Multi-Region)' },
            { label: 'Secondary Provider', value: 'Google Cloud Platform' },
            { label: 'CDN', value: 'CloudFlare Global Network' },
            { label: 'Load Balancing', value: 'Auto-scaling with health checks' }
          ]
        },
        {
          category: 'Performance',
          items: [
            { label: 'Uptime SLA', value: '99.9% guaranteed' },
            { label: 'Response Time', value: '< 100ms average' },
            { label: 'Throughput', value: '10,000+ requests/second' },
            { label: 'Scalability', value: 'Auto-scaling to 1M+ users' }
          ]
        },
        {
          category: 'Monitoring',
          items: [
            { label: 'Real-time Monitoring', value: 'DataDog + Custom dashboards' },
            { label: 'Error Tracking', value: 'Sentry with alerting' },
            { label: 'Performance APM', value: 'New Relic integration' },
            { label: 'Log Management', value: 'ELK Stack (Elasticsearch)' }
          ]
        }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      description: 'Bank-level security with multiple layers of protection',
      specs: [
        {
          category: 'Data Protection',
          items: [
            { label: 'Encryption at Rest', value: 'AES-256 encryption' },
            { label: 'Encryption in Transit', value: 'TLS 1.3 + Perfect Forward Secrecy' },
            { label: 'Key Management', value: 'AWS KMS + Hardware Security Modules' },
            { label: 'Data Backup', value: 'Automated daily backups with 30-day retention' }
          ]
        },
        {
          category: 'Access Control',
          items: [
            { label: 'Authentication', value: 'Multi-factor authentication (MFA)' },
            { label: 'Authorization', value: 'Role-based access control (RBAC)' },
            { label: 'Session Management', value: 'JWT with refresh tokens' },
            { label: 'API Security', value: 'OAuth 2.0 + Rate limiting' }
          ]
        },
        {
          category: 'Compliance',
          items: [
            { label: 'Certifications', value: 'SOC 2 Type II, ISO 27001' },
            { label: 'GDPR Compliance', value: 'Full compliance with data portability' },
            { label: 'PCI DSS', value: 'Level 1 Service Provider' },
            { label: 'Audit Trail', value: 'Immutable audit logs' }
          ]
        }
      ]
    },
    {
      id: 'database',
      title: 'Database',
      icon: Database,
      color: 'from-purple-500 to-violet-500',
      description: 'High-performance database architecture with redundancy',
      specs: [
        {
          category: 'Primary Database',
          items: [
            { label: 'Engine', value: 'PostgreSQL 15 (Multi-Master)' },
            { label: 'Replication', value: 'Synchronous replication across 3 AZs' },
            { label: 'Backup Strategy', value: 'Point-in-time recovery (PITR)' },
            { label: 'Connection Pooling', value: 'PgBouncer with auto-scaling' }
          ]
        },
        {
          category: 'Caching Layer',
          items: [
            { label: 'In-Memory Cache', value: 'Redis Cluster (6 nodes)' },
            { label: 'Application Cache', value: 'Memcached for session data' },
            { label: 'CDN Cache', value: 'CloudFlare with smart routing' },
            { label: 'Cache Strategy', value: 'Write-through with TTL optimization' }
          ]
        },
        {
          category: 'Analytics',
          items: [
            { label: 'Data Warehouse', value: 'Amazon Redshift' },
            { label: 'Real-time Analytics', value: 'Apache Kafka + ClickHouse' },
            { label: 'ETL Pipeline', value: 'Apache Airflow' },
            { label: 'Business Intelligence', value: 'Tableau + Custom dashboards' }
          ]
        }
      ]
    },
    {
      id: 'api',
      title: 'API & Integration',
      icon: Code,
      color: 'from-orange-500 to-red-500',
      description: 'RESTful APIs and webhooks for seamless integration',
      specs: [
        {
          category: 'API Architecture',
          items: [
            { label: 'API Standard', value: 'REST + GraphQL endpoints' },
            { label: 'Rate Limiting', value: '1000 requests/minute (configurable)' },
            { label: 'Versioning', value: 'Semantic versioning with backward compatibility' },
            { label: 'Documentation', value: 'OpenAPI 3.0 with interactive docs' }
          ]
        },
        {
          category: 'Webhooks',
          items: [
            { label: 'Event Types', value: '50+ webhook events' },
            { label: 'Delivery', value: 'Guaranteed delivery with retries' },
            { label: 'Security', value: 'HMAC signature verification' },
            { label: 'Monitoring', value: 'Real-time delivery status' }
          ]
        },
        {
          category: 'SDKs & Libraries',
          items: [
            { label: 'Official SDKs', value: 'Node.js, Python, PHP, Ruby, .NET' },
            { label: 'Mobile SDKs', value: 'iOS (Swift), Android (Kotlin)' },
            { label: 'Code Examples', value: 'Comprehensive examples in 10+ languages' },
            { label: 'Postman Collection', value: 'Ready-to-use API collection' }
          ]
        }
      ]
    }
  ]

  const currentCategory = techCategories[activeTab]
  const Icon = currentCategory.icon

  const certifications = [
    { name: 'SOC 2 Type II', icon: Award, description: 'Security and availability controls' },
    { name: 'ISO 27001', icon: Shield, description: 'Information security management' },
    { name: 'PCI DSS Level 1', icon: Lock, description: 'Payment card industry compliance' },
    { name: 'GDPR Compliant', icon: Globe, description: 'European data protection regulation' }
  ]

  const performanceMetrics = [
    { label: 'API Response Time', value: '< 100ms', icon: Zap, color: 'text-yellow-600' },
    { label: 'System Uptime', value: '99.99%', icon: Clock, color: 'text-green-600' },
    { label: 'Data Processing', value: '1M+ transactions/day', icon: BarChart3, color: 'text-blue-600' },
    { label: 'Global Users', value: '500K+ active', icon: Users, color: 'text-purple-600' }
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
            Technical Specifications
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Built on enterprise-grade infrastructure with bank-level security. 
            Our platform is designed for scale, performance, and reliability.
          </p>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {performanceMetrics.map((metric, index) => {
            const MetricIcon = metric.icon
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6"
              >
                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  <MetricIcon size={20} className={metric.color} />
                </div>
                <div className="font-bold text-2xl text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {techCategories.map((category, index) => {
            const TabIcon = category.icon
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveTab(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TabIcon size={20} className="mr-2" />
                {category.title}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Technical Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12"
          >
            {/* Category Header */}
            <div className="flex items-center mb-8">
              <div className={`w-16 h-16 bg-gradient-to-r ${currentCategory.color} rounded-2xl flex items-center justify-center mr-6`}>
                <Icon size={28} className="text-white" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-2">
                  {currentCategory.title}
                </h3>
                <p className="text-lg text-gray-600">{currentCategory.description}</p>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {currentCategory.specs.map((spec, index) => (
                <motion.div
                  key={spec.category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <h4 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                    {spec.category}
                  </h4>
                  
                  <div className="space-y-3">
                    {spec.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: (index * 0.1) + (itemIndex * 0.05) }}
                        className="flex justify-between items-start"
                      >
                        <span className="text-gray-600 text-sm font-medium">{item.label}:</span>
                        <span className="text-gray-900 text-sm font-semibold text-right ml-2">
                          {item.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="font-poppins font-bold text-2xl md:text-3xl text-gray-900 mb-8 text-center">
            Security Certifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const CertIcon = cert.icon
              return (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CertIcon size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{cert.name}</h4>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* System Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-4">
                System Requirements
              </h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                Our platform is designed to work seamlessly across all modern devices 
                and browsers. No special software installation required.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Chrome size={20} className="mr-3 text-blue-200" />
                  <span>Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)</span>
                </div>
                <div className="flex items-center">
                  <Smartphone size={20} className="mr-3 text-blue-200" />
                  <span>Mobile apps for iOS 13+ and Android 8+</span>
                </div>
                <div className="flex items-center">
                  <Wifi size={20} className="mr-3 text-blue-200" />
                  <span>Stable internet connection (minimum 1 Mbps)</span>
                </div>
                <div className="flex items-center">
                  <Monitor size={20} className="mr-3 text-blue-200" />
                  <span>Screen resolution 1024x768 or higher</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6">
              <h4 className="font-semibold text-lg mb-4">Browser Compatibility</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Chrome', version: '90+', support: '100%' },
                  { name: 'Firefox', version: '88+', support: '100%' },
                  { name: 'Safari', version: '14+', support: '100%' },
                  { name: 'Edge', version: '90+', support: '100%' }
                ].map((browser, index) => (
                  <motion.div
                    key={browser.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/10 rounded-lg p-3"
                  >
                    <div className="font-semibold">{browser.name}</div>
                    <div className="text-blue-200 text-sm">{browser.version}</div>
                    <div className="text-green-300 text-sm">{browser.support}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
            Need Technical Documentation?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Access our comprehensive technical documentation, API references, 
            and integration guides to get started quickly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <FileText size={16} className="mr-2" />
              View Documentation
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <Download size={16} className="mr-2" />
              Download SDKs
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TechnicalSpecs