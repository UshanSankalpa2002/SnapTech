import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Shield, 
  Headphones, 
  RefreshCw,
  Settings,
  Wrench,
  CreditCard,
  Users,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Package,
  Home,
  Smartphone,
  Laptop,
  Star,
  Download,
  UserCheck
} from 'lucide-react';

const Services = () => {
  const mainServices = [
    {
      icon: Truck,
      title: 'Free Fast Delivery',
      description: 'Free shipping on orders above ₹1000 with express delivery options available.',
      features: ['Same day delivery in major cities', 'Express delivery in 24-48 hours', 'Real-time order tracking'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Extended Warranty',
      description: 'Comprehensive warranty coverage beyond manufacturer guarantees.',
      features: ['Up to 3 years extended warranty', 'Instant claim processing', 'Authorized service centers'],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy for all products.',
      features: ['No questions asked returns', 'Free pickup service', 'Instant refund processing'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support through multiple channels.',
      features: ['Live chat support', 'Phone & email support', 'Technical assistance'],
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const additionalServices = [
    {
      icon: Settings,
      title: 'Product Installation',
      description: 'Professional installation service for all electronic devices'
    },
    {
      icon: Wrench,
      title: 'Repair Services',
      description: 'Authorized repair services for all major brands'
    },
    {
      icon: CreditCard,
      title: 'EMI Options',
      description: 'Flexible payment plans with 0% interest EMI'
    },
    {
      icon: Users,
      title: 'Bulk Orders',
      description: 'Special discounts for corporate and bulk purchases'
    },
    {
      icon: Download,
      title: 'Software Setup',
      description: 'Complete software installation and configuration'
    },
    {
      icon: UserCheck,
      title: 'Personal Shopper',
      description: 'Expert guidance to help you choose the right product'
    }
  ];

  const deliveryOptions = [
    {
      icon: Clock,
      title: 'Same Day Delivery',
      description: 'Order before 2 PM and get it delivered the same day',
      time: 'Within 6 hours',
      locations: 'Mumbai, Delhi, Bangalore'
    },
    {
      icon: Truck,
      title: 'Express Delivery',
      description: 'Fast delivery for urgent requirements',
      time: '24-48 hours',
      locations: 'All major cities'
    },
    {
      icon: Package,
      title: 'Standard Delivery',
      description: 'Free delivery for orders above ₹1000',
      time: '3-5 business days',
      locations: 'Pan India'
    },
    {
      icon: Home,
      title: 'Installation Service',
      description: 'Professional installation at your doorstep',
      time: 'Scheduled delivery',
      locations: 'Major cities'
    }
  ];

  const supportChannels = [
    {
      icon: Headphones,
      title: 'Live Chat',
      description: 'Instant help through our website chat',
      availability: '24/7',
      responseTime: 'Instant'
    },
    {
      icon: Smartphone,
      title: 'Phone Support',
      description: 'Direct call support for immediate assistance',
      availability: '9 AM - 9 PM',
      responseTime: 'Immediate'
    },
    {
      icon: Settings,
      title: 'Technical Support',
      description: 'Expert technical assistance for all products',
      availability: '24/7',
      responseTime: '< 30 minutes'
    },
    {
      icon: Laptop,
      title: 'Remote Assistance',
      description: 'Screen sharing for software-related issues',
      availability: '10 AM - 8 PM',
      responseTime: '< 15 minutes'
    }
  ];

  const warrantyPlans = [
    {
      title: 'Basic Protection',
      price: 'Free',
      duration: '1 Year',
      features: [
        'Manufacturer warranty coverage',
        'Defect repairs',
        'Basic customer support',
        'Online warranty registration'
      ]
    },
    {
      title: 'Extended Care',
      price: '₹499',
      duration: '2 Years',
      features: [
        'Everything in Basic',
        'Accidental damage protection',
        'Priority customer support',
        'Free pickup & delivery',
        'Express repair service'
      ],
      popular: true
    },
    {
      title: 'Premium Care',
      price: '₹999',
      duration: '3 Years',
      features: [
        'Everything in Extended Care',
        'Liquid damage protection',
        'Annual maintenance service',
        'Data recovery service',
        'Replacement guarantee',
        '24/7 priority support'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Beyond just selling products, we provide comprehensive services to ensure 
              you get the most out of your technology purchases.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive services designed to provide you with a seamless shopping experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 mb-6 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Additional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Extra services to enhance your technology experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Delivery Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the delivery option that suits your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {option.description}
                  </p>
                  <div className="space-y-1">
                    <div className="text-blue-600 font-medium text-sm">{option.time}</div>
                    <div className="text-gray-500 text-xs">{option.locations}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Customer Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to get help when you need it
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => {
              const IconComponent = channel.icon;
              return (
                <motion.div
                  key={channel.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {channel.description}
                  </p>
                  <div className="space-y-1">
                    <div className="text-green-600 font-medium text-sm">{channel.availability}</div>
                    <div className="text-gray-500 text-xs">Response: {channel.responseTime}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Warranty Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Warranty & Protection Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protect your investment with our comprehensive warranty options
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {warrantyPlans.map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`relative p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white transform scale-105' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.title}
                  </h3>
                  <div className={`text-4xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-blue-600'}`}>
                    {plan.price}
                  </div>
                  <div className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                    {plan.duration} Coverage
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-blue-200' : 'text-green-500'
                      }`} />
                      <span className={`text-sm ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-white text-blue-600 hover:bg-blue-50' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}>
                  Choose Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Need Help Choosing the Right Service?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Our experts are here to help you find the perfect service plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg"
                >
                  <span>Contact Support</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/products"
                  className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  <span>Browse Products</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;