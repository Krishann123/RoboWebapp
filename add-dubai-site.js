// Script to add Dubai site to the country sites database
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, 'ROBOLUTION', '.env') });

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/robolution';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Define the CountrySite schema
const countrySiteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    flagUrl: { type: String },
    active: { type: Boolean, default: true },
    templateName: { type: String, default: 'default' },
    templateIndex: { type: Number, default: 0 },
    customStyles: {
        primaryColor: { type: String, default: '#00008b' },
        secondaryColor: { type: String, default: '#FFB366' },
        accentColor: { type: String, default: '#6AAAFF' }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create the model
const CountrySite = mongoose.model('CountrySite', countrySiteSchema);

// Function to add Dubai site
async function addDubaiSite() {
    try {
        // Check if Dubai site already exists
        const existingSite = await CountrySite.findOne({ slug: 'dubai' });
        
        if (existingSite) {
            console.log('Dubai site already exists in the database');
            console.log(existingSite);
            process.exit(0);
        }

        // Create the Dubai site
        const dubaiSite = new CountrySite({
            name: 'Dubai',
            slug: 'dubai',
            title: 'Robolution Dubai',
            description: 'The official Robolution site for Dubai',
            flagUrl: '/images/flags/dubai-flag.png', // Using the existing flag file
            active: true,
            templateName: 'modern',
            templateIndex: 0,
            customStyles: {
                primaryColor: '#00008b',
                secondaryColor: '#FFB366',
                accentColor: '#6AAAFF'
            }
        });

        // Save to database
        await dubaiSite.save();
        console.log('Dubai site successfully added to the database');
        console.log(dubaiSite);
        
    } catch (error) {
        console.error('Error adding Dubai site:', error);
    } finally {
        // Disconnect from MongoDB
        setTimeout(() => {
            mongoose.disconnect();
            console.log('MongoDB disconnected');
        }, 1000);
    }
}

// Run the function
addDubaiSite(); 