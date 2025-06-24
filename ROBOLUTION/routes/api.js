require('dotenv').config();
const express = require('express');
const router = express.Router();
const CountrySite = require('../models/CountrySite');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

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
    const countrySites = await CountrySite.find({ active: true }).select('name slug flagUrl').sort({ name: 1 });
    
    res.json({
      success: true,
      countrySites
    });
  } catch (error) {
    console.error('Error fetching country sites:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching country sites',
      error: error.message
    });
  }
});

module.exports = router; 