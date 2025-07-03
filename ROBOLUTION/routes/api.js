require('dotenv').config();
const express = require('express');
const router = express.Router();
const CountrySite = require('../models/CountrySite');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const mongoose = require('mongoose');

// --- Supabase Client Setup ---
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("FATAL ERROR: Supabase URL or Key not provided. Please check your .env file in the ROBOLUTION directory.");
    process.exit(1); // Exit if DB credentials are not set
}
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Multer Configuration for Image Uploads ---
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Save directly to the international/public directory
        const uploadDir = path.join(__dirname, '..', '..', 'international', 'public');
        
        // Ensure the directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// --- API Helper Functions ---
// Fetches the entire 'Default' template from Supabase
async function getDefaultTemplate() {
    const { data, error } = await supabase
        .from('Templates')
        .select('config')
        .eq('Name', 'Default')
        .single();
        
    if (error) throw new Error(`Could not fetch template from Supabase: ${error.message}`);
    return data;
}

// Updates the 'Default' template in Supabase
async function updateDefaultTemplate(newConfig) {
    const { error } = await supabase
        .from('Templates')
        .update({ config: newConfig })
        .eq('Name', 'Default');

    if (error) throw new Error(`Could not update template in Supabase: ${error.message}`);
}


// --- API Endpoints ---

// Upload news image
router.post('/international/upload-image', ensureAuthenticated, ensureAdmin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the simple filename - it will be accessible directly from the root path
    // since we're now serving the international/public directory as a static asset source
    const filePath = `/${req.file.filename}`;
    res.json({ success: true, filePath: filePath });
});

// GET all news data
router.get('/international/news', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const template = await getDefaultTemplate();
        const newsContent = template.config.Contents.News;
        
        res.json({ 
            latestNews: newsContent["latest-news"] || [],
            latestEvents: newsContent["latest-events"] || [],
            latestWebinar: newsContent["latest-webinar"] || [],
            latestCards: newsContent["latest-cards"] || []
        });
    } catch (error) {
        console.error('Error fetching news data:', error.message);
        res.status(500).json({ error: 'Error fetching news data' });
    }
});

// POST a new news item
router.post('/international/news/:category', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const { category } = req.params;
        const newsItem = req.body;
        
        if (!['latest-news', 'latest-events', 'latest-webinar', 'latest-cards'].includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }
        
        const template = await getDefaultTemplate();
        const newsContent = template.config.Contents.News[category];

        if (category === 'latest-cards') {
            newsContent.unshift(newsItem);
        } else {
            newsContent.unshift({ NewsCard: newsItem });
        }
        
        await updateDefaultTemplate(template.config);
        
        res.json({ success: true, message: 'News item added successfully' });
    } catch (error) {
        console.error('Error adding news item:', error.message);
        res.status(500).json({ error: 'Error adding news item' });
    }
});

// DELETE a news item
router.delete('/international/news/:category/:index', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const { category, index } = req.params;
        
        if (!['latest-news', 'latest-events', 'latest-webinar', 'latest-cards'].includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }
        
        const template = await getDefaultTemplate();
        const categoryContent = template.config.Contents.News[category];

        if (index >= 0 && index < categoryContent.length) {
            const itemToDelete = categoryContent[index];
            
            // --- File Deletion Logic ---
            const imagePath = (category === 'latest-cards') ? itemToDelete.image : itemToDelete.NewsCard?.image;
            
            if (imagePath && !imagePath.startsWith('http')) {
                // Handle paths for images directly in the public directory
                let fileToDelete;
                if (imagePath.startsWith('/image-')) {
                    // These are the new uploads directly to public directory
                    const filename = path.basename(imagePath);
                    fileToDelete = path.join(__dirname, '..', '..', 'international', 'public', filename);
                } else if (imagePath.startsWith('/images/')) {
                    // Handle older uploads that went to images subdirectory
                    const filename = path.basename(imagePath);
                    fileToDelete = path.join(__dirname, '..', '..', 'international', 'public', 'images', filename);
                } else {
                    // Default case for other paths
                    const filename = path.basename(imagePath);
                    fileToDelete = path.join(__dirname, '..', '..', 'international', 'public', filename);
                }

                // Check if file exists and delete it
                if (fs.existsSync(fileToDelete)) {
                    try {
                        fs.unlinkSync(fileToDelete);
                        console.log(`Successfully deleted image: ${fileToDelete}`);
                    } catch (fileErr) {
                        // Log the error but don't block the database operation
                        console.error(`Failed to delete image file: ${fileErr.message}`);
                    }
                }
            }

            // --- Database Deletion Logic ---
            categoryContent.splice(index, 1);
            await updateDefaultTemplate(template.config);
            
            res.json({ success: true, message: 'News item and associated image deleted successfully' });
        } else {
            res.status(400).json({ error: 'Invalid index' });
        }
    } catch (error) {
        console.error('Error deleting news item:', error.message);
        res.status(500).json({ error: 'Error deleting news item' });
    }
});

// Get active country sites
router.get('/country-sites', async (req, res) => {
  try {
    // Use the MongoDB test.templates collection
    const testDb = mongoose.connection.useDb('test');
    const Templates = testDb.collection('templates');
    
    const templates = await Templates.find({}).sort({ Name: 1 }).toArray();
    
    const countrySites = templates.map(t => ({
      name: t.Name === 'default' ? 'Dubai' : t.Name.charAt(0).toUpperCase() + t.Name.slice(1),
      slug: t.Name,
      flagUrl: t.config?.Contents?.Navbar?.Content?.button?.image || '/images/flags/placeholder.png'
    }));
    
    console.log(`[API] Returning ${countrySites.length} country sites from templates collection`);
    
    res.json({
      success: true,
      countrySites
    });
  } catch (error) {
    console.error('Error fetching country sites from templates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching country sites',
      error: error.message
    });
  }
});

// --- Country Site API Endpoints ---

/**
 * @route GET /api/countries
 * @description Get all active country sites
 * @access Public
 */
router.get('/countries', async (req, res) => {
  try {
    const countries = await CountrySite.find({ active: true })
      .select('name slug flagUrl logoUrl')
      .sort({ name: 1 });
    
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

/**
 * @route GET /api/country/:slug
 * @description Get country site by slug
 * @access Public
 */
router.get('/country/:slug', async (req, res) => {
  try {
    const country = await CountrySite.findOne({ 
      slug: req.params.slug.toLowerCase(),
      active: true
    });
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json(country);
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({ error: 'Failed to fetch country' });
  }
});

/**
 * @route GET /api/country/:slug/tournament
 * @description Get country-specific tournament information
 * @access Public
 */
router.get('/country/:slug/tournament', async (req, res) => {
  try {
    const country = await CountrySite.findOne({ 
      slug: req.params.slug.toLowerCase(),
      active: true
    }).select('tournamentInfo name slug');
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json({
      countryName: country.name,
      countrySlug: country.slug,
      ...country.tournamentInfo
    });
  } catch (error) {
    console.error('Error fetching tournament info:', error);
    res.status(500).json({ error: 'Failed to fetch tournament information' });
  }
});

/**
 * @route GET /api/country/:slug/training
 * @description Get country-specific training information
 * @access Public
 */
router.get('/country/:slug/training', async (req, res) => {
  try {
    const country = await CountrySite.findOne({ 
      slug: req.params.slug.toLowerCase(),
      active: true
    }).select('trainingInfo name slug');
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json({
      countryName: country.name,
      countrySlug: country.slug,
      ...country.trainingInfo
    });
  } catch (error) {
    console.error('Error fetching training info:', error);
    res.status(500).json({ error: 'Failed to fetch training information' });
  }
});

/**
 * @route GET /api/country/:slug/gallery
 * @description Get country-specific gallery
 * @access Public
 */
router.get('/country/:slug/gallery', async (req, res) => {
  try {
    const country = await CountrySite.findOne({ 
      slug: req.params.slug.toLowerCase(),
      active: true
    }).select('galleryImages name slug');
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json({
      countryName: country.name,
      countrySlug: country.slug,
      images: country.galleryImages || []
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// New endpoint to get all available template slugs
router.get('/templates', async (req, res) => {
    try {
        const testDb = req.app.locals.testDb; // Access the 'test' database connection
        if (!testDb) {
            return res.status(500).json({ error: 'Database connection for templates not found.' });
        }
        
        const templatesCollection = testDb.collection('templates');
        const templates = await templatesCollection.find({}, { projection: { Name: 1, _id: 0 } }).toArray();
        
        const slugs = templates.map(t => t.Name).filter(Boolean); // Extract 'Name' field and filter out any null/empty values
        
        res.json(slugs);
    } catch (error) {
        console.error('Error fetching template slugs:', error);
        res.status(500).json({ error: 'Failed to fetch template slugs' });
    }
});

module.exports = router; 