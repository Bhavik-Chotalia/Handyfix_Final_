const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Service = require('../models/Service');
const Vendor = require('../models/Vendor');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/handyfix');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.log('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Service.deleteMany({});
    await Vendor.deleteMany({});

    // Create services
    const services = await Service.insertMany([
      {
        name: 'Plumbing',
        description: 'Professional plumbing services for all your needs',
        icon: '🔧',
      },
      {
        name: 'Electrical',
        description: 'Expert electrical repairs and installations',
        icon: '⚡',
      },
      {
        name: 'Carpentry',
        description: 'Quality carpentry and woodwork services',
        icon: '🪵',
      },
      {
        name: 'Cleaning',
        description: 'Professional home and office cleaning services',
        icon: '🧹',
      },
      {
        name: 'Painting',
        description: 'Expert interior and exterior painting services',
        icon: '🎨',
      },
    ]);

    console.log('Services created:', services.length);

    // Create vendors
    const vendors = await Vendor.insertMany([
      // Plumbing vendors
      {
        name: 'John Plumber',
        email: 'john@plumber.com',
        phone: '555-0101',
        serviceId: services[0]._id,
        description: 'Experienced plumber with 10+ years in the industry',
        rating: 4.8,
        pricePerHour: 75,
        address: '123 Main St',
        city: 'New York',
        zipCode: '10001',
        availability: 'available',
      },
      {
        name: 'Mike\'s Plumbing',
        email: 'mike@plumbing.com',
        phone: '555-0102',
        serviceId: services[0]._id,
        description: 'Fast and reliable plumbing solutions',
        rating: 4.6,
        pricePerHour: 65,
        address: '456 Oak Ave',
        city: 'New York',
        zipCode: '10002',
        availability: 'available',
      },
      // Electrical vendors
      {
        name: 'Spark Electric',
        email: 'spark@electric.com',
        phone: '555-0201',
        serviceId: services[1]._id,
        description: 'Licensed electrician for residential and commercial work',
        rating: 4.9,
        pricePerHour: 85,
        address: '789 Elm St',
        city: 'New York',
        zipCode: '10003',
        availability: 'available',
      },
      {
        name: 'Power Solutions',
        email: 'power@solutions.com',
        phone: '555-0202',
        serviceId: services[1]._id,
        description: 'Expert electrical repairs and installations',
        rating: 4.5,
        pricePerHour: 70,
        address: '321 Pine Rd',
        city: 'New York',
        zipCode: '10004',
        availability: 'busy',
      },
      // Carpentry vendors
      {
        name: 'Wood Works',
        email: 'woodworks@carpenter.com',
        phone: '555-0301',
        serviceId: services[2]._id,
        description: 'Custom carpentry and furniture making',
        rating: 4.7,
        pricePerHour: 80,
        address: '654 Birch Ln',
        city: 'New York',
        zipCode: '10005',
        availability: 'available',
      },
      // Cleaning vendors
      {
        name: 'Sparkle Clean',
        email: 'sparkle@clean.com',
        phone: '555-0401',
        serviceId: services[3]._id,
        description: 'Professional cleaning for homes and offices',
        rating: 4.8,
        pricePerHour: 50,
        address: '987 Cedar Dr',
        city: 'New York',
        zipCode: '10006',
        availability: 'available',
      },
      {
        name: 'Fresh Start Cleaning',
        email: 'fresh@cleaning.com',
        phone: '555-0402',
        serviceId: services[3]._id,
        description: 'Eco-friendly cleaning solutions',
        rating: 4.6,
        pricePerHour: 45,
        address: '147 Maple Ave',
        city: 'New York',
        zipCode: '10007',
        availability: 'available',
      },
      // Painting vendors
      {
        name: 'Color Masters',
        email: 'color@masters.com',
        phone: '555-0501',
        serviceId: services[4]._id,
        description: 'Professional painting with attention to detail',
        rating: 4.9,
        pricePerHour: 60,
        address: '258 Willow St',
        city: 'New York',
        zipCode: '10008',
        availability: 'available',
      },
    ]);

    console.log('Vendors created:', vendors.length);
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedDatabase());
