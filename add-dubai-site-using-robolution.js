// Script to add Dubai site to the country sites database
// This script must be run from the ROBOLUTION directory

const path = require('path');

// First, let's check if we're in the right directory
try {
    // Try to require the models directory from the current directory
    const CountrySite = require('./models/CountrySite');
    
    // Function to add Dubai site
    async function addDubaiSite() {
        try {
            // Check if Dubai site already exists
            const existingSite = await CountrySite.findOne({ slug: 'dubai' });
            
            if (existingSite) {
                console.log('Dubai site already exists in the database:');
                console.log(existingSite);
            } else {
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
                console.log('Dubai site successfully added to the database:');
                console.log(dubaiSite);
            }
            
        } catch (error) {
            console.error('Error adding Dubai site:', error);
            process.exit(1);
        }
    }

    // Check if database connection is established
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
        // Database is connected
        addDubaiSite();
    } else {
        console.error('Database connection not established. Make sure to run this script after the ROBOLUTION app has started.');
        process.exit(1);
    }
    
} catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('This script must be run from the ROBOLUTION directory. Please navigate to that directory first.');
    process.exit(1);
} 