const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const CountrySite = require('../models/CountrySite');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Use memory storage for multer
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper to upload a buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, slug, originalName) => {
  return new Promise((resolve, reject) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const baseName = path.basename(originalName, path.extname(originalName));
    const public_id = `${slug}-${baseName}-${uniqueSuffix}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `robolution/international-sites/${folder}`,
        public_id: public_id,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Helper function to delete from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('cloudinary')) {
        console.log('Skipping deletion for non-Cloudinary URL:', imageUrl);
        return;
    }
    try {
        const publicIdWithFolder = imageUrl.split('/').slice(-4).join('/').split('.')[0];
        console.log(`Attempting to delete Cloudinary image with public_id: ${publicIdWithFolder}`);
        await cloudinary.uploader.destroy(publicIdWithFolder);
    } catch (error) {
        console.error(`Failed to delete image from Cloudinary: ${imageUrl}`, error);
    }
};

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

// Update country site content
router.post('/:slug/update', upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'navbarImage', maxCount: 1 }
]), async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    const { slug } = req.params;
    const { heroMainText, heroSubText, heroButtonText, footerAbout, footerAddress, footerEmail, footerPhone } = req.body;

    try {
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        const existingTemplate = await Templates.findOne({ Name: slug });

        if (!existingTemplate) {
            req.flash('error', 'Country site not found.');
            return res.redirect('/country');
        }

        const updateFields = {
            'config.Contents.Home.hero.mainText': heroMainText,
            'config.Contents.Home.hero.subText': heroSubText,
            'config.Contents.Home.hero.buttonText': heroButtonText,
            'config.Contents.Footer.about': footerAbout,
            'config.Contents.Footer.address': footerAddress,
            'config.Contents.Footer.email': footerEmail,
            'config.Contents.Footer.phone': footerPhone,
        };

        // Handle Hero Image Upload
        if (req.files && req.files.heroImage) {
            const oldHeroImage = existingTemplate.config.Contents.Home.hero.videoDirectory;
            await deleteFromCloudinary(oldHeroImage);
            
            const heroFile = req.files.heroImage[0];
            const result = await uploadToCloudinary(heroFile.buffer, 'general', slug, heroFile.originalname);
            updateFields['config.Contents.Home.hero.videoDirectory'] = result.secure_url;
        }

        // Handle Navbar Logo Upload
        if (req.files && req.files.navbarImage) {
            const oldLogoImage = existingTemplate.config.Contents.Navbar.Content.button.image;
            await deleteFromCloudinary(oldLogoImage);

            const navbarFile = req.files.navbarImage[0];
            const result = await uploadToCloudinary(navbarFile.buffer, 'general', slug, navbarFile.originalname);
            updateFields['config.Contents.Navbar.Content.button.image'] = result.secure_url;
        }

        await Templates.updateOne({ Name: slug }, { $set: updateFields });

        req.flash('success', `${slug} site updated successfully.`);
        res.redirect(`/country/${slug}/edit`);

    } catch (error) {
        console.error(`Error updating ${slug} site:`, error);
        req.flash('error', 'An error occurred while updating the site.');
        res.redirect(`/country/${slug}/edit`);
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
      
      // Initialize FrequentlyAsk with empty items array
      if (newTemplate.config.Contents.FrequentlyAsk) {
        newTemplate.config.Contents.FrequentlyAsk.items = [];
      }
      
      // Initialize Package.TourGallery with empty array
      if (newTemplate.config.Contents.Package) {
        newTemplate.config.Contents.Package.TourGallery = [];
      }
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

// Add images to the tour gallery
router.post('/:slug/gallery/add', upload.array('galleryImages', 10), async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    const { slug } = req.params;
    if (!req.files || req.files.length === 0) {
        req.flash('error', 'No images were uploaded.');
        return res.redirect(`/country/${slug}/edit`);
    }

    try {
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        
        const uploadPromises = req.files.map(file => 
            uploadToCloudinary(file.buffer, 'gallery', slug, file.originalname)
        );
        const results = await Promise.all(uploadPromises);

        const newImages = results.map(result => ({
            id: uuidv4(),
            image: result.secure_url,
        }));

        await Templates.updateOne(
            { Name: slug },
            { $push: { 'config.Contents.Package.TourGallery': { $each: newImages } } }
        );

        req.flash('success', 'Gallery images added successfully.');
        res.redirect(`/country/${slug}/edit`);

    } catch (error) {
        console.error('Error adding gallery images:', error);
        req.flash('error', 'An error occurred while adding images.');
        res.redirect(`/country/${slug}/edit`);
    }
});


// Delete a gallery image
router.post('/:slug/gallery/delete', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send('Unauthorized');
    }

    const { slug } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).send('Image URL is required.');
    }

    try {
        // Delete image from Cloudinary first
        await deleteFromCloudinary(imageUrl);

        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        
        await Templates.updateOne(
            { Name: slug },
            { $pull: { 'config.Contents.Package.TourGallery': { image: imageUrl } } }
        );

        // Check if called from AJAX or form submission
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(200).send('Image deleted successfully.');
        } else {
            req.flash('success', 'Gallery image deleted successfully.');
            res.redirect(`/country/${slug}/edit`);
        }

    } catch (error) {
        console.error('Error deleting gallery image:', error);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(500).send('Error deleting image.');
        } else {
            req.flash('error', 'An error occurred while deleting the image.');
            res.redirect(`/country/${slug}/edit`);
        }
    }
});

// Add a new FAQ
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

// Delete an FAQ
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

// Add a new tournament category
router.post('/:slug/tournament/add', upload.single('tournamentImage'), async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }

    const { slug } = req.params;
    const { tournamentTitle, tournamentMechanics } = req.body;

    if (!req.file) {
        req.flash('error', 'An image is required for the tournament category.');
        return res.redirect(`/country/${slug}/edit`);
    }

    try {
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        
        const result = await uploadToCloudinary(req.file.buffer, 'tournaments', slug, req.file.originalname);

        const newCategory = {
            id: uuidv4(),
            title: tournamentTitle,
            image: result.secure_url,
            mechanics: tournamentMechanics.split('\n').map(line => line.trim()).filter(line => line)
        };

        await Templates.updateOne(
            { Name: slug },
            { $push: { 'config.Contents.Tournament.categories': newCategory } }
        );

        req.flash('success', 'Tournament category added successfully.');
        res.redirect(`/country/${slug}/edit`);

    } catch (error) {
        console.error('Error adding tournament category:', error);
        req.flash('error', 'An error occurred while adding the category.');
        res.redirect(`/country/${slug}/edit`);
    }
});


// Delete a tournament category
router.post('/:slug/tournament/delete', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }
    
    const { slug } = req.params;
    const { tournamentId, imageUrl } = req.body;
    
    try {
        // Delete the image from Cloudinary
        await deleteFromCloudinary(imageUrl);
        
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        
        await Templates.updateOne(
            { Name: slug },
            { $pull: { 'config.Contents.Tournament.categories': { id: tournamentId } } }
        );
        
        req.flash('success', 'Tournament category deleted successfully.');
        res.redirect(`/country/${slug}/edit`);
        
    } catch (error) {
        console.error('Error deleting tournament category:', error);
        req.flash('error', 'An error occurred while deleting the category.');
        res.redirect(`/country/${slug}/edit`);
    }
});

// Update country flag
router.post('/:name/update-flag', upload.single('flagImage'), async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/country');
    }
    const { name: slug } = req.params;

    if (!req.file) {
        req.flash('error', 'No flag image was uploaded.');
        return res.redirect(`/country/${slug}/edit`);
    }

    try {
        const testDb = CountrySite.db.useDb(DB_NAME);
        const Templates = testDb.collection(TEMPLATES_COLLECTION);
        const existingTemplate = await Templates.findOne({ Name: slug });
        
        if (existingTemplate && existingTemplate.config?.Contents?.Flag?.image) {
            await deleteFromCloudinary(existingTemplate.config.Contents.Flag.image);
        }

        const result = await uploadToCloudinary(req.file.buffer, 'flags', slug, req.file.originalname);
        
        await Templates.updateOne(
            { Name: slug },
            { $set: { 'config.Contents.Flag.image': result.secure_url } }
        );

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