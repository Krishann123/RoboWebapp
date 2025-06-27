const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const CountrySite = require('../models/CountrySite');

// Middleware to ensure user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    req.flash('error', 'Admin access required');
    return res.redirect('/login');
  }
  next();
};

// Configure multer for file uploads with proper naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/images/flags');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${req.body.slug || uuidv4()}${ext}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// GET - List all country sites
router.get('/', requireAdmin, async (req, res) => {
  try {
    const countrySites = await CountrySite.find().sort({ name: 1 });
    
    // Check if we're being loaded in the dashboard iframe
    const inDashboard = req.query.dashboard === 'true';
    
    res.render('admin/country-sites/index', { 
      countrySites,
      user: req.session.user,
      successMessage: req.flash('success'),
      errorMessage: req.flash('error'),
      inDashboard // Pass this flag to the view
    });
  } catch (error) {
    console.error('Error fetching country sites:', error);
    req.flash('error', 'Error loading country sites');
    res.redirect('/admin/dashboard');
  }
});

// GET - Form to create a new country site
router.get('/create', requireAdmin, async (req, res) => {
  try {
    // Read the templates from the default.json file to get template names
    const internationalDir = path.join(__dirname, '../../international');
    const defaultJsonPath = path.join(internationalDir, 'default.json');
    
    let templates = [];
    if (fs.existsSync(defaultJsonPath)) {
      const jsonData = JSON.parse(fs.readFileSync(defaultJsonPath, 'utf8'));
      templates = jsonData.templates.map((template, index) => {
        return {
          name: Object.keys(template)[0],
          index
        };
      });
    }
    
    // Check if we're being loaded in the dashboard iframe
    const inDashboard = req.query.dashboard === 'true';
    
    res.render('admin/country-sites/create', { 
      user: req.session.user,
      templates,
      errorMessage: req.flash('error'),
      inDashboard // Pass this flag to the view
    });
  } catch (error) {
    console.error('Error loading create form:', error);
    req.flash('error', 'Error loading country site creation form');
    res.redirect('/country-sites');
  }
});

// POST - Create a new country site
router.post('/create', requireAdmin, upload.single('flag'), async (req, res) => {
  try {
    const { name, slug, title, description, templateName, templateIndex } = req.body;
    
    // Check if site with this slug already exists
    const existing = await CountrySite.findOne({ $or: [{ slug }, { name }] });
    if (existing) {
      req.flash('error', 'A country site with this name or slug already exists');
      return res.redirect('/country-sites/create' + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
    }
    
    // Create new site
    const countrySite = new CountrySite({
      name,
      slug,
      title,
      description,
      templateName,
      templateIndex: parseInt(templateIndex, 10),
      active: true
    });
    
    // If flag was uploaded, set the path
    if (req.file) {
      countrySite.flagUrl = `/images/flags/${req.file.filename}`;
    }
    
    await countrySite.save();
    
    // Create symbolic link for the new country site
    const publicCountryDir = path.join(__dirname, '../public/country-sites', slug);
    if (!fs.existsSync(publicCountryDir)) {
      fs.mkdirSync(publicCountryDir, { recursive: true });
    }
    
    req.flash('success', `Country site for ${name} created successfully`);
    res.redirect('/country-sites' + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
  } catch (error) {
    console.error('Error creating country site:', error);
    req.flash('error', 'Error creating country site: ' + error.message);
    res.redirect('/country-sites/create' + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
  }
});

// GET - Form to edit a country site
router.get('/edit/:id', requireAdmin, async (req, res) => {
  try {
    const countrySite = await CountrySite.findById(req.params.id);
    if (!countrySite) {
      req.flash('error', 'Country site not found');
      return res.redirect('/country-sites');
    }
    
    // REDIRECT to new template-based edit interface
    if (req.query.useNewInterface === 'true' || process.env.USE_TEMPLATE_SYSTEM === 'true') {
      return res.redirect(`/country/${countrySite.slug}/edit`);
    }
    
    // Read the templates from the default.json file
    const internationalDir = path.join(__dirname, '../../international');
    const defaultJsonPath = path.join(internationalDir, 'default.json');
    
    let templates = [];
    if (fs.existsSync(defaultJsonPath)) {
      const jsonData = JSON.parse(fs.readFileSync(defaultJsonPath, 'utf8'));
      templates = jsonData.templates.map((template, index) => {
        return {
          name: Object.keys(template)[0],
          index
        };
      });
    }
    
    // Check if we're being loaded in the dashboard iframe
    const inDashboard = req.query.dashboard === 'true';
    
    res.render('admin/country-sites/edit', { 
      countrySite,
      templates,
      user: req.session.user,
      errorMessage: req.flash('error'),
      inDashboard // Pass this flag to the view
    });
  } catch (error) {
    console.error('Error loading edit form:', error);
    req.flash('error', 'Error loading country site edit form');
    res.redirect('/country-sites');
  }
});

// POST - Update a country site
router.post('/edit/:id', requireAdmin, upload.single('flag'), async (req, res) => {
  try {
    const countrySite = await CountrySite.findById(req.params.id);
    if (!countrySite) {
      req.flash('error', 'Country site not found');
      return res.redirect('/country-sites' + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
    }
    
    // Check if slug changed and there's no conflict
    if (req.body.slug !== countrySite.slug) {
      const existing = await CountrySite.findOne({ slug: req.body.slug });
      if (existing && existing._id.toString() !== req.params.id) {
        req.flash('error', 'A country site with this slug already exists');
        return res.redirect(`/country-sites/edit/${req.params.id}` + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
      }
    }
    
    // Update fields
    countrySite.name = req.body.name;
    countrySite.slug = req.body.slug;
    countrySite.title = req.body.title;
    countrySite.description = req.body.description;
    
    // For checkboxes, we need to explicitly check if the field exists in the request
    // When a checkbox is unchecked, it's not included in the form data at all
    countrySite.active = req.body.active === 'on';
    
    // Log the active state for debugging
    console.log(`[Country Sites] Setting '${countrySite.name}' active status to: ${countrySite.active} (raw value: '${req.body.active}')`);
    
    countrySite.templateName = req.body.templateName;
    countrySite.templateIndex = parseInt(req.body.templateIndex, 10);
    
    // Update flag if provided
    if (req.file) {
      // Delete old flag if it exists
      if (countrySite.flagUrl) {
        const oldFlagPath = path.join(__dirname, '../public', countrySite.flagUrl);
        if (fs.existsSync(oldFlagPath)) {
          fs.unlinkSync(oldFlagPath);
        }
      }
      countrySite.flagUrl = `/images/flags/${req.file.filename}`;
    }
    
    // Update custom styles if provided
    if (req.body.primaryColor) {
      countrySite.customStyles.primaryColor = req.body.primaryColor;
    }
    if (req.body.secondaryColor) {
      countrySite.customStyles.secondaryColor = req.body.secondaryColor;
    }
    if (req.body.accentColor) {
      countrySite.customStyles.accentColor = req.body.accentColor;
    }
    
    await countrySite.save();
    req.flash('success', `Country site for ${countrySite.name} updated successfully`);
    res.redirect('/country-sites' + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
  } catch (error) {
    console.error('Error updating country site:', error);
    req.flash('error', 'Error updating country site: ' + error.message);
    res.redirect(`/country-sites/edit/${req.params.id}` + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
  }
});

// POST - Delete a country site
router.post('/delete', requireAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    
    const countrySite = await CountrySite.findById(id);
    if (!countrySite) {
      req.flash('error', 'Country site not found');
      return res.redirect('/country-sites' + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
    }
    
    // Delete country site
    await CountrySite.findByIdAndDelete(id);
    
    req.flash('success', `Country site for ${countrySite.name} has been deleted`);
    res.redirect('/country-sites' + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
  } catch (error) {
    console.error('Error deleting country site:', error);
    req.flash('error', 'Error deleting country site: ' + error.message);
    res.redirect('/country-sites' + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
  }
});

// Content management routes removed as requested

// Export the router
module.exports = router; 