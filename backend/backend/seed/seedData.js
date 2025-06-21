const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const connectDB = require('../config/db');

dotenv.config();

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@snaptech.com',
  password: 'admin123',
  phone: '0763466817',
  role: 'admin',
  address: {
    street: 'Mawanella',
    city: 'Mawanella',
    state: 'Mawanella',
    zipCode: '400001',
    country: 'Sri Lanka',
  },
};

// Sample categories with subcategories
const categories = [
  {
    name: 'Mobiles',
    description: 'Latest smartphones and mobile devices',
    subcategories: [
      { name: 'Apple', description: 'iPhone series and accessories' },
      { name: 'Samsung', description: 'Galaxy series smartphones' },
      { name: 'Redmi', description: 'Xiaomi Redmi phones' },
      { name: 'OnePlus', description: 'OnePlus flagship devices' },
      { name: 'Google Pixel', description: 'Google Pixel smartphones' },
      { name: 'Oppo', description: 'Oppo smartphones' },
      { name: 'Vivo', description: 'Vivo mobile phones' },
    ],
  },
  {
    name: 'Laptops',
    description: 'High-performance laptops and notebooks',
    subcategories: [
      { name: 'Apple', description: 'MacBook series' },
      { name: 'Dell', description: 'Dell laptops and workstations' },
      { name: 'HP', description: 'HP laptops and notebooks' },
      { name: 'Lenovo', description: 'ThinkPad and IdeaPad series' },
      { name: 'Asus', description: 'Asus laptops and gaming devices' },
      { name: 'Acer', description: 'Acer laptops and Chromebooks' },
      { name: 'MSI', description: 'MSI gaming laptops' },
    ],
  },
  {
    name: 'Headphones',
    description: 'Premium headphones and audio devices',
    subcategories: [
      { name: 'Sony', description: 'Sony headphones and earphones' },
      { name: 'Bose', description: 'Bose noise-canceling headphones' },
      { name: 'Apple', description: 'AirPods and Beats headphones' },
      { name: 'JBL', description: 'JBL audio devices' },
      { name: 'Sennheiser', description: 'Professional audio equipment' },
      { name: 'Audio-Technica', description: 'Studio-grade headphones' },
    ],
  },
  {
    name: 'Speakers',
    description: 'Bluetooth speakers and sound systems',
    subcategories: [
      { name: 'JBL', description: 'Portable Bluetooth speakers' },
      { name: 'Sony', description: 'Wireless speakers and soundbars' },
      { name: 'Bose', description: 'Premium sound systems' },
      { name: 'Marshall', description: 'Vintage-style speakers' },
      { name: 'Ultimate Ears', description: 'Waterproof portable speakers' },
    ],
  },
  {
    name: 'Smartwatches',
    description: 'Smart wearables and fitness trackers',
    subcategories: [
      { name: 'Apple', description: 'Apple Watch series' },
      { name: 'Samsung', description: 'Galaxy Watch series' },
      { name: 'Fitbit', description: 'Fitness trackers and smartwatches' },
      { name: 'Garmin', description: 'GPS and fitness watches' },
      { name: 'Amazfit', description: 'Affordable smartwatches' },
      { name: 'OnePlus', description: 'OnePlus Watch series' },
    ],
  },
];

// Sample products
const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
    price: 134900,
    originalPrice: 139900,
    brand: 'Apple',
    subcategory: 'Apple',
    images: [
      { url: '/uploads/iphone15pro.jpg', alt: 'iPhone 15 Pro' },
    ],
    specifications: {
      'Display': '6.1-inch Super Retina XDR',
      'Chip': 'A17 Pro',
      'Storage': '256GB',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      'Battery': 'Up to 23 hours video playback',
      'OS': 'iOS 17',
    },
    features: [
      'Titanium Design',
      'Action Button',
      'USB-C Connector',
      'Face ID',
      '5G Capable',
      'Water Resistant',
    ],
    quantity: 50,
    inStock: true,
    tags: ['smartphone', 'flagship', 'premium', 'apple'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android flagship with S Pen, advanced AI features, and exceptional camera',
    price: 129999,
    originalPrice: 134999,
    brand: 'Samsung',
    subcategory: 'Samsung',
    images: [
      { url: '/uploads/galaxys24ultra.jpg', alt: 'Galaxy S24 Ultra' },
    ],
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Storage': '256GB',
      'Camera': '200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto',
      'Battery': '5000mAh',
      'OS': 'Android 14 with One UI 6.1',
    },
    features: [
      'S Pen Included',
      'AI Photo Editing',
      '120Hz Display',
      '45W Fast Charging',
      'IP68 Water Resistance',
      'Satellite Communication',
    ],
    quantity: 35,
    inStock: true,
    tags: ['smartphone', 'android', 'flagship', 'samsung'],
  },
  {
    name: 'MacBook Pro 14-inch M3',
    description: 'Powerful laptop with M3 chip, Liquid Retina XDR display, and all-day battery life',
    price: 199900,
    originalPrice: 209900,
    brand: 'Apple',
    subcategory: 'Apple',
    images: [
      { url: '/uploads/macbookpro14.jpg', alt: 'MacBook Pro 14-inch' },
    ],
    specifications: {
      'Display': '14.2-inch Liquid Retina XDR',
      'Chip': 'Apple M3',
      'Memory': '16GB Unified Memory',
      'Storage': '512GB SSD',
      'Battery': 'Up to 18 hours',
      'Ports': '3x Thunderbolt 4, HDMI, SD card',
    },
    features: [
      'M3 Chip Performance',
      'ProRes Video Playback',
      'Studio-Quality Mics',
      'MagSafe 3 Charging',
      'Touch ID',
      'Backlit Magic Keyboard',
    ],
    quantity: 25,
    inStock: true,
    tags: ['laptop', 'professional', 'apple', 'premium'],
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality',
    price: 29990,
    originalPrice: 34990,
    brand: 'Sony',
    subcategory: 'Sony',
    images: [
      { url: '/uploads/sonyxm5.jpg', alt: 'Sony WH-1000XM5' },
    ],
    specifications: {
      'Driver': '30mm',
      'Frequency Response': '4Hz-40kHz',
      'Battery Life': 'Up to 30 hours',
      'Charging': 'USB-C Quick Charge',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.2, NFC',
    },
    features: [
      'Industry-Leading Noise Canceling',
      'Speak-to-Chat Technology',
      'Touch Sensor Controls',
      'Quick Attention Mode',
      'Multipoint Connection',
      'LDAC Audio Codec',
    ],
    quantity: 40,
    inStock: true,
    tags: ['headphones', 'wireless', 'noise-canceling', 'premium'],
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with health monitoring, fitness tracking, and cellular connectivity',
    price: 45900,
    originalPrice: 48900,
    brand: 'Apple',
    subcategory: 'Apple',
    images: [
      { url: '/uploads/applewatch9.jpg', alt: 'Apple Watch Series 9' },
    ],
    specifications: {
      'Display': '1.9-inch Always-On Retina',
      'Chip': 'S9 SiP',
      'Storage': '64GB',
      'Battery': 'Up to 18 hours',
      'Connectivity': 'GPS + Cellular',
      'Water Resistance': '50 meters',
    },
    features: [
      'Double Tap Gesture',
      'Blood Oxygen Monitoring',
      'ECG App',
      'Fall Detection',
      'Emergency SOS',
      'Always-On Display',
    ],
    quantity: 60,
    inStock: true,
    tags: ['smartwatch', 'health', 'fitness', 'apple'],
  },
  {
    name: 'Dell XPS 13',
    description: 'Ultra-portable laptop with stunning InfinityEdge display and premium build quality',
    price: 89990,
    originalPrice: 94990,
    brand: 'Dell',
    subcategory: 'Dell',
    images: [
      { url: '/uploads/dellxps13.jpg', alt: 'Dell XPS 13' },
    ],
    specifications: {
      'Display': '13.4-inch FHD+ InfinityEdge',
      'Processor': 'Intel Core i7-1360P',
      'Memory': '16GB LPDDR5',
      'Storage': '512GB SSD',
      'Battery': 'Up to 12 hours',
      'Weight': '1.24kg',
    },
    features: [
      'InfinityEdge Display',
      'Premium Carbon Fiber',
      'Thunderbolt 4 Ports',
      'Killer Wi-Fi 6E',
      'Windows Hello',
      'ENERGY STAR Certified',
    ],
    quantity: 30,
    inStock: true,
    tags: ['laptop', 'ultrabook', 'portable', 'dell'],
  },
  {
    name: 'JBL Charge 5',
    description: 'Portable Bluetooth speaker with powerful sound and built-in powerbank',
    price: 12999,
    originalPrice: 14999,
    brand: 'JBL',
    subcategory: 'JBL',
    images: [
      { url: '/uploads/jblcharge5.jpg', alt: 'JBL Charge 5' },
    ],
    specifications: {
      'Output Power': '40W RMS',
      'Battery Life': 'Up to 20 hours',
      'Charging Time': '4 hours',
      'Frequency Response': '65Hz – 20kHz',
      'Dimensions': '220 x 96 x 93mm',
      'Weight': '960g',
    },
    features: [
      'IP67 Waterproof',
      'Built-in Powerbank',
      'JBL PartyBoost',
      '20-hour Playtime',
      'Dual JBL Bass Radiators',
      'Eco-friendly Packaging',
    ],
    quantity: 75,
    inStock: true,
    tags: ['speaker', 'bluetooth', 'waterproof', 'portable'],
  },
  {
    name: 'Samsung Galaxy Watch 6',
    description: 'Advanced smartwatch with health monitoring and seamless Android integration',
    price: 32999,
    originalPrice: 36999,
    brand: 'Samsung',
    subcategory: 'Samsung',
    images: [
      { url: '/uploads/galaxywatch6.jpg', alt: 'Galaxy Watch 6' },
    ],
    specifications: {
      'Display': '1.3-inch Super AMOLED',
      'Processor': 'Exynos W930',
      'Memory': '2GB RAM + 16GB Storage',
      'Battery': '300mAh',
      'Connectivity': 'Bluetooth 5.3, Wi-Fi, GPS',
      'Water Resistance': '5ATM + IP68',
    },
    features: [
      'Body Composition Analysis',
      'Sleep Coaching',
      'Advanced Workout Detection',
      'Google Assistant & Bixby',
      'Samsung Pay',
      'Always-on Display',
    ],
    quantity: 45,
    inStock: true,
    tags: ['smartwatch', 'health', 'android', 'samsung'],
  },
];

// Seeding function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create(adminUser);
    console.log('👤 Admin user created:', admin.email);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('📱 Categories created:', createdCategories.length);

    // Add category IDs to sample products and admin ID
    const productsWithCategories = sampleProducts.map(product => {
      const category = createdCategories.find(cat => 
        cat.subcategories.some(sub => sub.name === product.subcategory)
      );
      
      return {
        ...product,
        category: category._id,
        addedBy: admin._id,
      };
    });

    // Create sample products
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log('🛍️  Sample products created:', createdProducts.length);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('Email: admin@snaptech.com');
    console.log('Password: admin123');
    console.log('\n🚀 You can now start the server and login as admin!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Reset database function
const resetDatabase = async () => {
  try {
    await connectDB();
    
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    console.log('🗑️  Database reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'reset') {
    resetDatabase();
  } else {
    seedDatabase();
  }
}

module.exports = { seedDatabase, resetDatabase };