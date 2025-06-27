// Script to ensure Dubai site exists in test.countrysites
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Get MongoDB connection string
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/robolution';

// Replace 'robolution' with 'test' in the connection string to connect to test database
let testDbUri = MONGODB_URI;
if (testDbUri.includes('/robolution')) {
  testDbUri = testDbUri.replace('/robolution', '/test');
} else if (testDbUri.includes('/robolution?')) {
  testDbUri = testDbUri.replace('/robolution?', '/test?');
}

console.log('Connecting to MongoDB test database...');
console.log(`Connection string: ${testDbUri.substring(0, 20)}...`);

mongoose.connect(testDbUri)
  .then(async () => {
    console.log('Connected to MongoDB test database');
    
    // Create a model for the 'countrysites' collection
    const CountrySite = mongoose.model('CountrySite', new mongoose.Schema({}, { strict: false }), 'countrysites');
    
    try {
      // Check if Dubai site already exists
      const existingDubai = await CountrySite.findOne({ slug: 'dubai' });
      
      if (existingDubai) {
        console.log('Dubai site already exists in test.countrysites:');
        console.log(existingDubai);
        
        // Update the Dubai site with the flag URL and make sure it's active
        const updatedSite = await CountrySite.findByIdAndUpdate(
          existingDubai._id,
          { 
            flagUrl: '/images/flags/dubai-flag.png',
            active: true,
            description: 'The official Robolution site for Dubai'
          },
          { new: true }
        );
        
        console.log('Updated Dubai site:');
        console.log(updatedSite);
      } else {
        console.log('Dubai site not found. Creating it now...');
        
        // Create the Dubai site
        const dubaiSite = new CountrySite({
          name: 'Dubai',
          slug: 'dubai',
          title: 'Robolution Dubai',
          active: true,
          description: 'The official Robolution site for Dubai',
          logoUrl: '',
          flagUrl: '/images/flags/dubai-flag.png',
          templateName: 'Default',
          templateIndex: 0,
          customStyles: {
            primaryColor: '#00008b',
            secondaryColor: '#FFB366',
            accentColor: '#6AAAFF',
            backgroundColor: '#FFFFFF'
          },
          metaTags: {
            title: '',
            description: '',
            keywords: ''
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Save to database
        await dubaiSite.save();
        console.log('Dubai site successfully created in test.countrysites:');
        console.log(dubaiSite);
      }
      
      // List all sites in the collection
      const allSites = await CountrySite.find({});
      console.log(`Total country sites in test.countrysites: ${allSites.length}`);
      allSites.forEach(site => {
        console.log(`- ${site.name} (${site.slug})`);
      });
      
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