const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const CountrySite = require('../models/CountrySite');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set path for country site images to the Astro assets folder
    const uploadDir = path.join(__dirname, '../../international/src/assets/images/NewsUpdateImages');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Set unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, req.params.slug + '-' + file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Set up multer for the tour gallery
const galleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../international/public/images/gallery');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${req.params.slug}-gallery-${uniqueSuffix}${ext}`);
    }
});

const uploadGallery = multer({ 
    storage: galleryStorage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per file
});

// Set up multer for the tournament category images
const tournamentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../international/public/images/tournaments');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${req.params.slug}-tournament-${uniqueSuffix}${ext}`);
    }
});

const uploadTournament = multer({ 
    storage: tournamentStorage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Set up multer for flag images
const flagStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../international/public/images/flags');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${req.params.slug}-flag-${uniqueSuffix}${ext}`);
    }
});

const uploadFlag = multer({ 
    storage: flagStorage, 
    fileFilter: fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 } // 1MB limit for flags
});

// Set the database and collection to use
const DB_NAME = 'test';
const TEMPLATES_COLLECTION = 'templates';

// Debug middleware to log requests
router.use((req, res, next) => {
  console.log(`[International Sites] ${req.method} ${req.originalUrl} | Session Auth: ${!!req.session?.user}`);
  next();
});

// Middleware to load country site configuration based on URL
router.use(async (req, res, next) => {
  try {
    const urlParts = req.originalUrl.split('/');
    if (urlParts.length < 3 || urlParts[1] !== 'country') {
      return next();
    }
    const slug = urlParts[2];
    
    if (!slug || ['create', 'delete', 'edit', 'update'].includes(slug) || (urlParts.length > 3 && urlParts[3] && !['edit', 'update', 'delete', 'news'].includes(urlParts[3]))) {
      return next();
    }
    
    const testDb = CountrySite.db.useDb(DB_NAME);
    const Templates = testDb.collection(TEMPLATES_COLLECTION);
    const template = await Templates.findOne({ Name: slug });
    
    if (!template) {
      return next(); // Let it 404 if not found by proxy or static handlers
    }
    
    // Adapt the template object to what the proxy and Astro app expect
    req.countrySite = {
      name: template.Name === 'default' ? 'Dubai' : template.Name,
      slug: template.Name,
      templateName: template.Name,
      templateIndex: 0, // Legacy, may not be used
      flagUrl: template.config?.Contents?.Flag?.image || template.config?.Contents?.Navbar?.Content?.button?.image || '',
      description: template.config?.Contents?.Home?.hero?.subText || ''
    };
    
    // Store the full template for edit operations
    req.template = template;
    
    if (req.session && req.session.user) {
      res.locals.user = req.session.user;
    }
    
    next();
  } catch (error) {
    console.error('Error loading country site:', error);
    req.flash('error', 'Error loading country site');
    res.redirect('/');
  }
});

// Serve static files for country sites
router.use('/:slug', express.static(path.join(__dirname, '../public/country-sites')));

// Country list page - shows all templates from the collection
router.get('/', async (req, res) => {
  try {
    const testDb = CountrySite.db.useDb(DB_NAME);
    const Templates = testDb.collection(TEMPLATES_COLLECTION);
    const templates = await Templates.find({}).sort({ Name: 1 }).toArray();
    
    const countrySites = templates.map(t => ({
      name: t.Name === 'default' ? 'Dubai' : t.Name,
      slug: t.Name,
      description: t.config?.Contents?.Home?.hero?.subText || `Explore Robolution events in ${t.Name === 'default' ? 'Dubai' : t.Name}.`,
      flagUrl: t.config?.Contents?.Flag?.image || t.config?.Contents?.Navbar?.Content?.button?.image || '/images/flags/placeholder.png',
      customStyles: { primaryColor: '#00008b' }
    }));
    
    res.render('UserViews/country-sites', { 
      countrySites,
      user: req.session.user,
      successMessage: req.flash('success'),
      errorMessage: req.flash('error'),
      dashboard: true
    });
  } catch (error) {
    console.error('Error listing country sites:', error);
    req.flash('error', 'Error loading country sites');
    res.redirect('/');
  }
});

// Edit country template - show form with current data
router.get('/:slug/edit', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    req.flash('error', 'You are not authorized to perform this action.');
    return res.redirect('/country');
  }
  
  try {
    const { slug } = req.params;
    
    if (!req.template) {
      req.flash('error', 'Country site not found.');
      return res.redirect('/country');
    }
    
    // Pass the raw template to the edit page
    res.render('UserViews/edit-country-site', {
      template: req.template, // Pass the full template object
      slug,
      user: req.session.user,
      successMessage: req.flash('success'),
      errorMessage: req.flash('error'),
      dashboard: true
    });
  } catch (error) {
    console.error('Error editing country site:', error);
    req.flash('error', 'An error occurred while loading the edit form.');
    res.redirect('/country');
  }
});

// NEW ROUTE for the public-facing "All Countries" gallery
router.get('/gallery', async (req, res) => {
  try {
    const testDb = CountrySite.db.useDb(DB_NAME);
    const Templates = testDb.collection(TEMPLATES_COLLECTION);
    const templates = await Templates.find({}).sort({ Name: 1 }).toArray();
    
    const countrySites = templates.map(t => ({
      name: t.Name === 'default' ? 'Dubai' : t.Name,
      slug: t.Name,
      description: t.config?.Contents?.Home?.hero?.subText || `Explore Robolution events in ${t.Name === 'default' ? 'Dubai' : t.Name}.`,
      flagUrl: t.config?.Contents?.Flag?.image || t.config?.Contents?.Navbar?.Content?.button?.image || '/images/flags/placeholder.png'
    }));
    
    res.render('UserViews/all-countries', { 
      countrySites,
      user: req.session.user,
      successMessage: req.flash('success'),
      errorMessage: req.flash('error')
    });
  } catch (error) {
    console.error('Error loading country gallery:', error);
    req.flash('error', 'Error loading the countries page.');
    res.redirect('/');
  }
});

// GET route for managing news for a specific country
router.get('/:slug/news', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    try {
        const { slug } = req.params;
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        const template = await Templates.findOne({ Name: slug });

        if (!template) {
            req.flash('error', 'Country site not found.');
            return res.redirect('/country');
        }

        const newsItems = template.config?.Contents?.News?.['latest-news'] || [];
        const events = template.config?.Contents?.Events?.['upcoming-events'] || [];
        const webinars = template.config?.Contents?.Webinars?.['upcoming-webinars'] || [];

        res.render('UserViews/manage-country-news', {
            slug,
            countryName: slug === 'default' ? 'Dubai' : slug,
            newsItems,
            events,
            webinars,
            user: req.session.user,
            successMessage: req.flash('success'),
            errorMessage: req.flash('error'),
        });
    } catch (error) {
        console.error('Error loading news management page:', error);
        req.flash('error', 'An error occurred while loading the news page.');
        res.redirect('/country');
    }
});

// POST route for adding a new news item
router.post('/:slug/news/add', upload.single('newsImage'), async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    try {
        const { slug } = req.params;
        const { title, date, link } = req.body;

        if (!req.file) {
            req.flash('error', 'Image is required.');
            return res.redirect(`/country/${slug}/news`);
        }

        const imagePath = `/src/assets/images/NewsUpdateImages/${req.file.filename}`;

        const newNewsItem = {
            id: uuidv4(),
            NewsCard: {
                title,
                date,
                link,
                image: imagePath,
                alt: title 
            }
        };
        
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);

        await Templates.updateOne(
            { Name: slug },
            { 
                $push: { 'config.Contents.News.latest-news': newNewsItem },
                $set: { 'config.Contents.News.Hero': { title: 'News' } } // Ensure Hero title exists
            },
            { upsert: true }
        );

        req.flash('success', 'News item added successfully.');
        res.redirect(`/country/${slug}/news`);

    } catch (error) {
        console.error('Error adding news item:', error);
        req.flash('error', 'An error occurred while adding the news item.');
        res.redirect(`/country/${req.params.slug}/news`);
    }
});

// POST route for deleting a news item
router.post('/:slug/news/delete/:id', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    try {
        const { slug, id } = req.params;
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        
        await Templates.updateOne(
            { Name: slug },
            { $pull: { 'config.Contents.News.latest-news': { id: id } } }
        );

        req.flash('success', 'News item deleted successfully.');
        res.redirect(`/country/${slug}/news`);

    } catch (error) {
        console.error('Error deleting news item:', error);
        req.flash('error', 'An error occurred while deleting the news item.');
        res.redirect(`/country/${req.params.slug}/news`);
    }
});

// POST route for adding a new event
router.post('/:slug/events/add', upload.single('eventImage'), async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    try {
        const { slug } = req.params;
        const { title, description, date, location, registrationLink } = req.body;

        if (!req.file) {
            req.flash('error', 'Banner image is required.');
            return res.redirect(`/country/${slug}/news`);
        }

        const imagePath = `/src/assets/images/NewsUpdateImages/${req.file.filename}`;

        const newEvent = {
            id: uuidv4(),
            title,
            description,
            date,
            location,
            registrationLink,
            bannerImage: imagePath
        };
        
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);

        await Templates.updateOne(
            { Name: slug },
            { 
                $push: { 'config.Contents.Events.upcoming-events': newEvent },
                $set: { 'config.Contents.Events.Hero': { title: 'Events' } } // Ensure Hero title exists
            },
            { upsert: true }
        );

        req.flash('success', 'Event added successfully.');
        res.redirect(`/country/${slug}/news`);

    } catch (error) {
        console.error('Error adding event:', error);
        req.flash('error', 'An error occurred while adding the event.');
        res.redirect(`/country/${req.params.slug}/news`);
    }
});

// POST route for deleting an event
router.post('/:slug/events/delete/:id', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    try {
        const { slug, id } = req.params;
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        
        await Templates.updateOne(
            { Name: slug },
            { $pull: { 'config.Contents.Events.upcoming-events': { id: id } } }
        );

        req.flash('success', 'Event deleted successfully.');
        res.redirect(`/country/${slug}/news`);

    } catch (error) {
        console.error('Error deleting event:', error);
        req.flash('error', 'An error occurred while deleting the event.');
        res.redirect(`/country/${req.params.slug}/news`);
    }
});

// POST route for adding a new webinar
router.post('/:slug/webinars/add', upload.single('webinarImage'), async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    try {
        const { slug } = req.params;
        const { title, description, date, registrationLink } = req.body;

        if (!req.file) {
            req.flash('error', 'Banner image is required.');
            return res.redirect(`/country/${slug}/news`);
        }

        const imagePath = `/src/assets/images/NewsUpdateImages/${req.file.filename}`;

        const newWebinar = {
            id: uuidv4(),
            title,
            description,
            date,
            registrationLink,
            bannerImage: imagePath
        };
        
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);

        await Templates.updateOne(
            { Name: slug },
            { 
                $push: { 'config.Contents.Webinars.upcoming-webinars': newWebinar },
                $set: { 'config.Contents.Webinars.Hero': { title: 'Webinars' } } // Ensure Hero title exists
            },
            { upsert: true }
        );

        req.flash('success', 'Webinar added successfully.');
        res.redirect(`/country/${slug}/news`);

    } catch (error) {
        console.error('Error adding webinar:', error);
        req.flash('error', 'An error occurred while adding the webinar.');
        res.redirect(`/country/${req.params.slug}/news`);
    }
});

// POST route for deleting a webinar
router.post('/:slug/webinars/delete/:id', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    try {
        const { slug, id } = req.params;
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        
        await Templates.updateOne(
            { Name: slug },
            { $pull: { 'config.Contents.Webinars.upcoming-webinars': { id: id } } }
        );

        req.flash('success', 'Webinar deleted successfully.');
        res.redirect(`/country/${slug}/news`);

    } catch (error) {
        console.error('Error deleting webinar:', error);
        req.flash('error', 'An error occurred while deleting the webinar.');
        res.redirect(`/country/${req.params.slug}/news`);
    }
});

// Update country template
router.post('/:slug/update', upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'navbarImage', maxCount: 1 }
]), async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    req.flash('error', 'You are not authorized to perform this action.');
    return res.redirect('/country');
  }

  try {
    const { slug } = req.params;
    const testDb = CountrySite.db.useDb(DB_NAME);
    const Templates = testDb.collection(TEMPLATES_COLLECTION);
    
    // Get the existing template first
    const existingTemplate = await Templates.findOne({ Name: slug });
    if (!existingTemplate) {
      req.flash('error', 'Country site not found.');
      return res.redirect('/country');
    }
    
    // Create an updated template object based on form data
    const updatedTemplate = JSON.parse(JSON.stringify(existingTemplate));
    delete updatedTemplate._id;
    
    // Handle file uploads - get file paths if files were uploaded
    const uploadedFiles = req.files;
    const heroImagePath = uploadedFiles?.heroImage ? 
      `/src/assets/images/NewsUpdateImages/${uploadedFiles.heroImage[0].filename}` : 
      existingTemplate.config.Contents.Home.hero.videoDirectory;
      
    const navbarImagePath = uploadedFiles?.navbarImage ? 
      `/src/assets/images/NewsUpdateImages/${uploadedFiles.navbarImage[0].filename}` : 
      existingTemplate.config.Contents.Navbar.Content.button.image;
    
    // Update the fields based on form data
    updatedTemplate.config.Contents.Home.hero.mainText = req.body.heroMainText || existingTemplate.config.Contents.Home.hero.mainText;
    updatedTemplate.config.Contents.Home.hero.subText = req.body.heroSubText || existingTemplate.config.Contents.Home.hero.subText;
    updatedTemplate.config.Contents.Home.hero.buttonText = req.body.heroButtonText || existingTemplate.config.Contents.Home.hero.buttonText;
    updatedTemplate.config.Contents.Home.hero.videoDirectory = heroImagePath;
    
    // Update Navbar and Footer
    if (updatedTemplate.config.Contents.Navbar?.Content?.button) {
      updatedTemplate.config.Contents.Navbar.Content.button.image = navbarImagePath;
      updatedTemplate.config.Contents.Navbar.Content.button.buttonText = req.body.navbarButtonText || existingTemplate.config.Contents.Navbar.Content.button.buttonText;
    }
    
    if (updatedTemplate.config.Contents.Footer) {
      updatedTemplate.config.Contents.Footer.about = req.body.footerAbout || existingTemplate.config.Contents.Footer.about;
    }
    
    // Update the document in the database
    await Templates.updateOne(
      { Name: slug },
      { $set: updatedTemplate }
    );
    
    req.flash('success', `Country site '${slug === 'default' ? 'Dubai' : slug}' updated successfully.`);
    res.redirect('/country');
  } catch (error) {
    console.error('Error updating country site:', error);
    req.flash('error', 'An error occurred while updating the country site.');
    res.redirect(`/country/${req.params.slug}/edit`);
  }
});

// Route to CREATE a new country site by cloning 'default'
router.post('/create', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    req.flash('error', 'You are not authorized to perform this action.');
    return res.redirect('/country');
  }

  try {
    const { countryName } = req.body;
    if (!countryName || countryName.trim() === '') {
      req.flash('error', 'Country name is required.');
      return res.redirect('/country');
    }

    const slug = countryName.trim().toLowerCase().replace(/\s+/g, '-');
    const testDb = CountrySite.db.useDb(DB_NAME);
    const Templates = testDb.collection(TEMPLATES_COLLECTION);

    const existing = await Templates.findOne({ Name: slug });
    if (existing) {
      req.flash('error', `A country site with the name '${slug}' already exists.`);
      return res.redirect('/country');
    }

    const defaultTemplate = await Templates.findOne({ Name: 'default' });
    if (!defaultTemplate) {
      req.flash('error', 'The Dubai template is missing and required for creating new sites.');
      return res.redirect('/country');
    }

    const newTemplate = JSON.parse(JSON.stringify(defaultTemplate));

    // Clear content that should not be duplicated from the default template
    if (newTemplate.config?.Contents) {
      newTemplate.config.Contents.News = {};
      newTemplate.config.Contents.Trainings = {};
      newTemplate.config.Contents.Tournament = {};
    }

    newTemplate.Name = slug;
    
    // Update content for the new country
    if (newTemplate.config?.Contents?.Home?.hero) {
      newTemplate.config.Contents.Home.hero.mainText = `Welcome to Erovoutika ${countryName}`;
    }
    
    if (newTemplate.config?.Contents?.Navbar?.Content?.button) {
      newTemplate.config.Contents.Navbar.Content.button.buttonText = `Register for ${countryName}`;
    }
    
    if (newTemplate.config?.Contents?.Footer) {
      newTemplate.config.Contents.Footer.about = `Robolution ${countryName} is at the forefront of robotics innovation.`;
    }
    
    delete newTemplate._id;

    await Templates.insertOne(newTemplate);

    req.flash('success', `Country site '${countryName}' created successfully.`);
    res.redirect('/country');

  } catch (error) {
    console.error('Error creating country site:', error);
    req.flash('error', 'An error occurred while creating the country site.');
    res.redirect('/country');
  }
});

// Route to DELETE a country site
router.post('/:slug/delete', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    req.flash('error', 'You are not authorized to perform this action.');
    return res.redirect('/country');
  }

  try {
    const { slug } = req.params;

    if (slug === 'default') {
      req.flash('error', 'The default template cannot be deleted.');
      return res.redirect('/country');
    }

    const testDb = CountrySite.db.useDb(DB_NAME);
    const Templates = testDb.collection(TEMPLATES_COLLECTION);
    const result = await Templates.deleteOne({ Name: slug });

    if (result.deletedCount === 0) {
      req.flash('error', 'Could not find the specified country site to delete.');
    } else {
      req.flash('success', `Country site '${slug}' was deleted successfully.`);
    }
    res.redirect('/country');

  } catch (error) {
    console.error('Error deleting country site:', error);
    req.flash('error', 'An error occurred while deleting the country site.');
    res.redirect('/country');
  }
});

// Route to add gallery images
router.post('/:slug/gallery/add', uploadGallery.array('galleryImages', 50), async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect(`/country/${req.params.slug}/edit`);
    }

    try {
        const { slug } = req.params;
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);

        if (!req.files || req.files.length === 0) {
            req.flash('error', 'No images were uploaded.');
            return res.redirect(`/country/${slug}/edit`);
        }

        const newImages = req.files.map(file => ({
            image: `/images/gallery/${file.filename}`
        }));

        await Templates.updateOne(
            { Name: slug },
            { $push: { 'config.Contents.Package.TourGallery': { $each: newImages } } }
        );

        req.flash('success', 'Gallery images added successfully.');
        res.redirect(`/country/${slug}/edit`);

    } catch (error) {
        console.error('Error adding gallery images:', error);
        req.flash('error', 'An error occurred while adding gallery images.');
        res.redirect(`/country/${req.params.slug}/edit`);
    }
});

// Route to delete a gallery image
router.post('/:slug/gallery/delete', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect(`/country/${req.params.slug}/edit`);
    }
    
    try {
        const { slug } = req.params;
        const { imageUrl } = req.body;
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);

        // Remove from database
        await Templates.updateOne(
            { Name: slug },
            { $pull: { 'config.Contents.Package.TourGallery': { image: imageUrl } } }
        );

        // Remove from filesystem
        const imagePath = path.join(__dirname, '../../international/public', imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        req.flash('success', 'Gallery image deleted successfully.');
        res.redirect(`/country/${slug}/edit`);

    } catch (error) {
        console.error('Error deleting gallery image:', error);
        req.flash('error', 'An error occurred while deleting the gallery image.');
        res.redirect(`/country/${req.params.slug}/edit`);
    }
});

// Route to add an FAQ item
router.post('/:slug/faq/add', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect(`/country/${req.params.slug}/edit`);
    }

    try {
        const { slug } = req.params;
        const { question, answer } = req.body;
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);

        const newFaq = {
            id: uuidv4(),
            question,
            answer
        };

        await Templates.updateOne(
            { Name: slug },
            { $push: { 'config.Contents.FrequentlyAsk.items': newFaq } }
        );

        req.flash('success', 'FAQ item added successfully.');
        res.redirect(`/country/${slug}/edit`);

    } catch (error) {
        console.error('Error adding FAQ item:', error);
        req.flash('error', 'An error occurred while adding the FAQ item.');
        res.redirect(`/country/${req.params.slug}/edit`);
    }
});

// Route to delete an FAQ item
router.post('/:slug/faq/delete', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect(`/country/${req.params.slug}/edit`);
    }

    try {
        const { slug } = req.params;
        const { faqId, faqQuestion } = req.body;
        
        if (!faqId && !faqQuestion) {
            req.flash('error', 'Could not delete FAQ: No identifier provided.');
            return res.redirect(`/country/${slug}/edit`);
        }

        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        
        let pullQuery;
        if (faqId) {
            console.log(`Attempting to delete FAQ by ID: ${faqId}`);
            pullQuery = { id: faqId };
        } else {
            console.log(`Attempting to delete FAQ by question: "${faqQuestion}"`);
            // To be safe, only delete items that match the question AND do not have an ID field.
            pullQuery = { question: faqQuestion, id: { $exists: false } };
        }

        const result = await Templates.updateOne(
            { Name: slug },
            { $pull: { 'config.Contents.FrequentlyAsk.items': pullQuery } }
        );

        if (result.modifiedCount > 0) {
            req.flash('success', 'FAQ item deleted successfully.');
        } else {
            req.flash('error', 'Could not find the FAQ item to delete. It may have already been removed.');
        }
        
        res.redirect(`/country/${slug}/edit`);

    } catch (error) {
        console.error('Error deleting FAQ item:', error);
        req.flash('error', 'An error occurred while deleting the FAQ item.');
        res.redirect(`/country/${req.params.slug}/edit`);
    }
});

// Route to add a new tournament category
router.post('/:slug/tournament/add', uploadTournament.single('tournamentImage'), async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect(`/country/${req.params.slug}/edit`);
    }

    try {
        const { slug } = req.params;
        const { tournamentTitle, tournamentMechanics } = req.body;
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);

        if (!req.file) {
            req.flash('error', 'Tournament image is required.');
            return res.redirect(`/country/${slug}/edit`);
        }

        const newTournament = {
            id: uuidv4(),
            title: tournamentTitle,
            image: `/images/tournaments/${req.file.filename}`,
            mechanics: tournamentMechanics.split('\n').map(line => line.trim()).filter(line => line)
        };

        // Use $push to add the new tournament to the 'categories' array
        await Templates.updateOne(
            { Name: slug },
            { $push: { 'config.Contents.Tournament.categories': newTournament } }
        );

        req.flash('success', 'Tournament category added successfully.');
        res.redirect(`/country/${slug}/edit`);

    } catch (error) {
        console.error('Error adding tournament category:', error);
        req.flash('error', 'An error occurred while adding the tournament category.');
        res.redirect(`/country/${req.params.slug}/edit`);
    }
});

// Route to delete a tournament category
router.post('/:slug/tournament/delete', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect(`/country/${req.params.slug}/edit`);
    }
    
    try {
        const { slug } = req.params;
        const { tournamentId, imageUrl } = req.body;
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);

        // Remove from database
        await Templates.updateOne(
            { Name: slug },
            { $pull: { 'config.Contents.Tournament.categories': { id: tournamentId } } }
        );

        // Remove image from filesystem
        if (imageUrl) {
            const imagePath = path.join(__dirname, '../../international/public', imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        req.flash('success', 'Tournament category deleted successfully.');
        res.redirect(`/country/${slug}/edit`);

    } catch (error) {
        console.error('Error deleting tournament category:', error);
        req.flash('error', 'An error occurred while deleting the tournament category.');
        res.redirect(`/country/${req.params.slug}/edit`);
  }
});

// For production mode
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode with static country site assets');
  
  // Serve the built Astro client assets for all country sites
  router.use('/:slug', express.static(path.join(__dirname, '../../international/dist/client')));
  
  // Dynamic path handler for country sites - needs to be after static files
  router.get('/:slug', async (req, res, next) => {
    try {
    const countrySite = req.countrySite;
    if (!countrySite) return next();
    
      // Forward to the Astro SSR entry point to render the page
      const astroServerDir = path.join(__dirname, '../../international/dist/server');
      
      // Check if the Astro entry point exists
      if (fs.existsSync(path.join(astroServerDir, 'entry.mjs'))) {
        // Use a proxy to the running Astro SSR server
        console.log(`[International Sites] Forwarding to Astro SSR for ${countrySite.name}`);
        
        // Set header for the Astro middleware to know which country site to render
        res.set('X-Country-Site', JSON.stringify({
          name: countrySite.name,
          slug: countrySite.slug,
          templateIndex: countrySite.templateIndex || 0,
          templateName: countrySite.templateName || 'Default',
          flagUrl: countrySite.flagUrl || '',
          description: countrySite.description || ''
        }));
      
        // Pass to the next middleware which will route to the Astro SSR server
        next();
      } else {
        console.error(`[International Sites] Astro SSR entry point not found at ${astroServerDir}/entry.mjs`);
        // If we can't find the Astro entry point, send a helpful error
        res.status(500).send('Astro SSR entry point not found. Please check that the international app is built correctly.');
      }
    } catch (error) {
      console.error(`Error in country site route handler:`, error);
      res.status(500).send('Error loading country site: ' + error.message);
    }
  });
  
  // Handle deep paths for country sites
  router.get('/:slug/*', (req, res, next) => {
    // Forward to the Astro SSR entry point for all paths
    next();
  });
} 
// For development mode
else {
  console.log('Running in development mode with country site proxy');
  
  router.use('/:slug', (req, res, next) => {
    // Get the country site info from the request
    const countrySite = req.countrySite;
    if (!countrySite) return next();
    
    // Use proxy middleware to forward requests to the Astro dev server
    const proxyOptions = {
      target: 'http://localhost:4321', // Default Astro dev server port
      changeOrigin: true,
      ws: true, // Support WebSocket
      cookieDomainRewrite: {
        '*': process.env.COOKIE_DOMAIN || 'localhost'
      },
      onProxyReq: (proxyReq, req, res) => {
        // Forward session data if available
        if (req.session && req.session.user) {
          proxyReq.setHeader('X-User-ID', req.session.user.id || '');
          proxyReq.setHeader('X-User-Name', req.session.user.username || '');
          proxyReq.setHeader('X-User-Auth', 'true');
        }
        
        // Forward country site data
        proxyReq.setHeader('X-Country-Site', JSON.stringify({
          name: countrySite.name,
          slug: countrySite.slug,
          templateIndex: countrySite.templateIndex,
          templateName: countrySite.templateName
        }));
        
        console.log(`[International Sites] Proxying country site request: ${req.method} ${req.url}`);
      },
      pathRewrite: (path, req) => {
        // Strip the country slug from the URL to match the Astro routes
        const stripped = path.replace(new RegExp(`^/country/${countrySite.slug}/?`), '/');
        const finalPath = stripped || '/';
        console.log(`[International Sites] Proxy rewriting path: ${path} -> ${finalPath}`);
        return finalPath;
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`[International Sites] Proxy response for ${req.countrySite?.name || 'unknown'}: ${proxyRes.statusCode}`);
        
        // Handle cookies
        const cookies = proxyRes.headers['set-cookie'];
        if (cookies) {
          const rewrittenCookies = cookies.map(cookie => {
            return cookie
              .replace(/Path=\/;/g, 'Path=/;')
              .replace(/Domain=[^;]+;/g, `Domain=${process.env.COOKIE_DOMAIN || 'localhost'};`);
          });
          proxyRes.headers['set-cookie'] = rewrittenCookies;
        }
      },
      logLevel: 'debug'
    };
    
    createProxyMiddleware(proxyOptions)(req, res, next);
  });
}

// Route for handling template selection
router.post('/:slug/template', async (req, res) => {
  try {
    // This route can be used to change the template for a country site
    // It would require admin authentication
    if (!req.session.user || !req.session.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const { templateIndex } = req.body;
    const countrySite = req.countrySite;
    
    if (!countrySite) {
      return res.status(404).json({ success: false, message: 'Country site not found' });
    }
    
    countrySite.templateIndex = parseInt(templateIndex, 10);
    await countrySite.save();
    
    res.json({ success: true, message: 'Template updated successfully' });
  } catch (error) {
    console.error('Error updating country template:', error);
    res.status(500).json({ success: false, message: 'Error updating template' });
  }
});

// Handle flag update
router.post('/:slug/update-flag', uploadFlag.single('flagImage'), async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    const { slug } = req.params;
    
    try {
        if (!req.file) {
            req.flash('error', 'No image file was uploaded.');
            return res.redirect(`/country/${slug}/edit`);
        }

        const imagePath = `/images/flags/${req.file.filename}`;

        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        
        const result = await Templates.updateOne(
            { Name: slug },
            { $set: { "config.Contents.Flag.image": imagePath } }
        );

        if (result.matchedCount === 0) {
            req.flash('error', 'Country site not found.');
            return res.redirect('/country');
        }

        req.flash('success', 'Flag updated successfully.');
        res.redirect(`/country/${slug}/edit`);
    } catch (error) {
        console.error('Error updating flag:', error);
        req.flash('error', 'An error occurred while updating the flag.');
        res.redirect(`/country/${slug}/edit`);
    }
});

// API endpoint to get all international sites for the dropdown
router.get('/api/sites', async (req, res) => {
    try {
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        const templates = await Templates.find({}).sort({ Name: 1 }).toArray();

        const sites = templates.map(t => ({
            name: t.Name === 'default' ? 'Dubai' : t.Name,
            slug: t.Name,
            flagUrl: t.config?.Contents?.Flag?.image || '/images/flags/placeholder.png'
        }));

        res.json({ success: true, countrySites: sites });
    } catch (error) {
        console.error('API Error fetching country sites:', error);
        res.status(500).json({ success: false, error: 'Failed to load country sites' });
    }
});

module.exports = router; 