const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get the main MongoDB connection string from env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/robolution';

// Create a separate connection to the test database
let testConnection;
try {
  // Replace 'robolution' with 'test' in the connection string
  let testDbUri = MONGODB_URI;
  if (testDbUri.includes('/robolution')) {
    testDbUri = testDbUri.replace('/robolution', '/test');
  } else if (testDbUri.includes('/robolution?')) {
    testDbUri = testDbUri.replace('/robolution?', '/test?');
  }
  
  // Create a separate connection
  testConnection = mongoose.createConnection(testDbUri);
  console.log('Connected to test database for CountrySite model');
} catch (err) {
  console.error('Error connecting to test database:', err);
}

const countrySiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: false
  },
  flagUrl: {
    type: String,
    default: ''
  },
  logoUrl: {
    type: String,
    default: ''
  },
  templateIndex: {
    type: Number,
    default: 0
  },
  templateName: {
    type: String,
    default: 'Default'
  },
  
  // Country-specific assets and content
  heroImage: {
    type: String,
    default: ''
  },
  homeContent: {
    title: { type: String, default: 'Welcome' },
    text: { type: String, default: '' },
    imageUrl: { type: String, default: '' }
  },
  bannerImages: [{
    url: String,
    title: String,
    description: String
  }],
  galleryImages: [{
    url: String,
    title: String,
    description: String
  }],
  
  // Country-specific content sections
  welcomeMessage: {
    type: String,
    default: ''
  },
  aboutContent: {
    type: String,
    default: ''
  },
  
  // Country-specific tournament info
  tournaments: [{
    title: { type: String, default: '' },
    slug: { type: String, default: '' },
    description: { type: String, default: '' },
    venue: { type: String, default: '' },
    date: { type: Date },
    bannerImage: { type: String, default: '' },
    registrationLink: { type: String, default: '' }
  }],
  
  // Country-specific training info
  trainingInfo: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    schedule: [{
      title: String,
      date: Date,
      description: String
    }],
    bannerImage: {
      type: String,
      default: ''
    }
  },
  
  // More country-specific content sections
  news: [{
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now }
  }],
  events: [{
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    registrationLink: { type: String, default: '' }
  }],
  webinars: [{
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    registrationLink: { type: String, default: '' },
    bannerImage: { type: String, default: '' }
  }],
  
  // Contact information specific to this country
  contactInfo: {
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    socialMedia: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' }
    }
  },
  
  // Custom CSS for country-specific styling
  customCSS: {
    type: String,
    default: ''
  },
  
  // Theme colors
  themeColors: {
    primary: { type: String, default: '#003399' },
    secondary: { type: String, default: '#ffffff' },
    accent: { type: String, default: '#ff9900' }
  }
}, { 
  timestamps: true,
  // Enable virtuals to be included in JSON output
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to automatically generate slug if not provided
countrySiteSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

// Create the model on the test database connection
// Use the 'countrysites' collection in the 'test' database
const CountrySite = testConnection.model('CountrySite', countrySiteSchema, 'countrysites');

module.exports = CountrySite; 