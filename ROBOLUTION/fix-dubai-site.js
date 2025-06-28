// Fix Dubai site database location
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Get MongoDB connection string from environment or .env file
let MONGODB_URI = process.env.MONGODB_URI;

// If not available in process.env, try to load from .env file directly
if (!MONGODB_URI) {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const envVars = dotenv.parse(envContent);
      MONGODB_URI = envVars.MONGODB_URI;
    }
  } catch (error) {
    console.error('Error reading .env file:', error);
  }
}

// If still no connection string, use a default fallback (not recommended for production)
if (!MONGODB_URI) {
  console.error('No MongoDB URI found in environment or .env file!');
  console.log('Please provide the correct MongoDB Atlas connection string:');
  process.exit(1);
}

console.log('Connecting to MongoDB...');
console.log(`Connection string: ${MONGODB_URI.substring(0, 20)}...`);

// Define the CountrySite schema as in the original model
const CountrySiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  },
  logoUrl: {
    type: String,
    default: ''
  },
  flagUrl: {
    type: String,
    default: ''
  },
  templateName: {
    type: String,
    required: true
  },
  templateIndex: {
    type: Number,
    default: 0
  },
  customStyles: {
    type: Object,
    default: {
      primaryColor: '#00008b',
      secondaryColor: '#FFB366',
      accentColor: '#6AAAFF',
      backgroundColor: '#FFFFFF'
    }
  },
  metaTags: {
    type: Object,
    default: {
      title: '',
      description: '',
      keywords: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Create model using the original collection name (based on your existing app)
    // This should match what's in the ROBOLUTION/models/CountrySite.js file
    const CountrySite = mongoose.model('CountrySite', CountrySiteSchema);
    
    try {
      // Check if Dubai site already exists in the correct collection
      const existingDubai = await CountrySite.findOne({ slug: 'dubai' });
      
      if (existingDubai) {
        console.log('Dubai site already exists in the correct database:');
        console.log(existingDubai);
        
        // Update the site with the flag URL if needed
        if (!existingDubai.flagUrl || existingDubai.flagUrl === '') {
          const updatedSite = await CountrySite.findOneAndUpdate(
            { slug: 'dubai' },
            { 
              flagUrl: '/images/flags/dubai-flag.png',
              description: 'The official Robolution site for Dubai'
            },
            { new: true }
          );
          
          console.log('Updated Dubai site with flag URL:');
          console.log(updatedSite);
        }
      } else {
        // Create the Dubai site
        const dubaiSite = new CountrySite({
          name: 'Dubai',
          slug: 'dubai',
          title: 'Robolution Dubai',
          active: true,
          description: 'The official Robolution site for Dubai',
          flagUrl: '/images/flags/dubai-flag.png',
          templateName: 'default', // Use your required template name
          templateIndex: 0,
          customStyles: {
            primaryColor: '#00008b',
            secondaryColor: '#FFB366',
            accentColor: '#6AAAFF'
          }
        });
        
        // Save to database
        await dubaiSite.save();
        console.log('Dubai site successfully added to the correct database:');
        console.log(dubaiSite);
      }
      
      // Verify the Dubai site is in the correct collection
      const allSites = await CountrySite.find({});
      console.log(`Total country sites in the correct collection: ${allSites.length}`);
      
    } catch (err) {
      console.error('Error:', err);
    } finally {
      // Disconnect from MongoDB
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 