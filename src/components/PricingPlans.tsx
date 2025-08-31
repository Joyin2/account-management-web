'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap } from 'lucide-react'

const PricingPlans = () => {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses just getting started',
      monthlyPrice: 9,
      yearlyPrice: 7,
      popular: false,
      features: [
        'Up to 5 users',
        'Basic accounting features',
        'Invoice generation',
        'Expense tracking',
        'Basic reporting',
        'Email support',
        '5GB storage'
      ],
      limitations: [
        'Limited integrations',
        'Basic customization'
      ]
    },
    {
      name: 'Growth',
      description: 'Ideal for growing businesses with advanced needs',
      monthlyPrice: 29,
      yearlyPrice: 24,
      popular: true,
      features: [
        'Up to 25 users',
        'Advanced accounting & compliance',
        'Inventory management',
        'E-invoicing & automation',
        'Advanced reporting & analytics',
        'Priority support',
        '50GB storage',
        'Bank reconciliation',
        'Multi-currency support',
        'Custom workflows'
      ],
      limitations: []
    },
    {
      name: 'Enterprise',
      description: 'Comprehensive solution for large organizations',
      monthlyPrice: 79,
      yearlyPrice: 65,
      popular: false,
      features: [
        'Unlimited users',
        'Full feature access',
        'Advanced inventory & supply chain',
        'Custom integrations',
        'White-label options',
        'Dedicated account manager',
        'Unlimited storage',
        'Advanced security features',
        'Custom reporting',
        'API access',
        'Training & onboarding'
      ],
      limitations: []
    }
  ]

  const getPrice = (plan: typeof plans[0]) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice
  }

  const getSavings = (plan: typeof plans[0]) => {
    if (!isYearly) return 0
    const monthlyCost = plan.monthlyPrice * 12
    const yearlyCost = plan.yearlyPrice * 12
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100)
  }

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
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Choose the perfect plan for your business. All plans include our core features 
            with no hidden fees or surprise charges.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus-ring ${
                isYearly ? 'bg-gradient-to-r from-blue-500 to-violet-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                isYearly ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
            <span className={`font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                Save up to 20%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const price = getPrice(plan)
            const savings = getSavings(plan)
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'pricing-highlight border-violet-500 shadow-violet-300 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star size={16} className="fill-current" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">${price}</span>
                      <span className="text-gray-600 ml-2">
                        /{isYearly ? 'month' : 'month'}
                      </span>
                    </div>
                    {isYearly && savings > 0 && (
                      <div className="text-green-600 text-sm font-medium mt-1">
                        Save {savings}% annually
                      </div>
                    )}
                    {isYearly && (
                      <div className="text-gray-500 text-sm mt-1">
                        Billed annually (${price * 12})
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary hover:bg-blue-50'
                  }`}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </button>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Zap size={16} className="text-blue-500 mr-2" />
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check size={16} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="font-poppins font-semibold text-2xl text-gray-900 mb-4">
              Not sure which plan is right for you?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our team is here to help you choose the perfect plan for your business needs. 
              Schedule a free consultation to discuss your requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">
                Schedule Consultation
              </button>
              <button className="btn-primary">
                Start 14-Day Free Trial
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="font-poppins font-semibold text-2xl text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h4>
              <p className="text-gray-600">No setup fees, no hidden charges. You only pay for your chosen plan.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingPlans