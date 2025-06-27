const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CountrySite = require('../../models/CountrySite');
const { ensureAdmin } = require('../../middleware/auth');
const cloudinary = require('cloudinary').v2;

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../public/uploads/country-sites');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Display list of all country sites
router.get('/', ensureAdmin, async (req, res) => {
  try {
    const countrySites = await CountrySite.find({}).sort({ name: 1 });
    res.render('admin/country-sites/index', { 
      title: 'Country Sites Management',
      countrySites
    });
  } catch (err) {
    console.error('Error fetching country sites:', err);
    req.flash('error', 'Failed to load country sites');
    res.redirect('/admin');
  }
});

// Display form to create new country site
router.get('/create', ensureAdmin, (req, res) => {
  res.render('admin/country-sites/create', { 
    title: 'Create New Country Site',
    countrySite: {}
  });
});

// Handle country site create
router.post('/create', ensureAdmin, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'flag', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const countrySiteData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      active: req.body.active === 'on',
      welcomeMessage: req.body.welcomeMessage,
      aboutContent: req.body.aboutContent,
      templateName: req.body.templateName || 'Default',
      templateIndex: parseInt(req.body.templateIndex) || 0,
      customCSS: req.body.customCSS || '',
      contactInfo: {
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        socialMedia: {
          facebook: req.body.facebook,
          twitter: req.body.twitter,
          instagram: req.body.instagram,
          linkedin: req.body.linkedin
        }
      },
      themeColors: {
        primary: req.body.primaryColor || '#003399',
        secondary: req.body.secondaryColor || '#ffffff',
        accent: req.body.accentColor || '#ff9900'
      }
    };
    
    // Process uploaded files (logo, flag, hero image)
    if (req.files) {
      // Upload to Cloudinary if available
      if (cloudinary.config().cloud_name) {
        if (req.files.logo && req.files.logo[0]) {
          const result = await cloudinary.uploader.upload(req.files.logo[0].path, {
            folder: `country-sites/${req.body.slug}/logo`
          });
          countrySiteData.logoUrl = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.logo[0].path);
        }
        
        if (req.files.flag && req.files.flag[0]) {
          const result = await cloudinary.uploader.upload(req.files.flag[0].path, {
            folder: `country-sites/${req.body.slug}/flag`
          });
          countrySiteData.flagUrl = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.flag[0].path);
        }
        
        if (req.files.heroImage && req.files.heroImage[0]) {
          const result = await cloudinary.uploader.upload(req.files.heroImage[0].path, {
            folder: `country-sites/${req.body.slug}/hero`
          });
          countrySiteData.heroImage = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.heroImage[0].path);
        }
      } else {
        // Store locally if Cloudinary is not configured
        if (req.files.logo && req.files.logo[0]) {
          countrySiteData.logoUrl = `/uploads/country-sites/${req.files.logo[0].filename}`;
        }
        
        if (req.files.flag && req.files.flag[0]) {
          countrySiteData.flagUrl = `/uploads/country-sites/${req.files.flag[0].filename}`;
        }
        
        if (req.files.heroImage && req.files.heroImage[0]) {
          countrySiteData.heroImage = `/uploads/country-sites/${req.files.heroImage[0].filename}`;
        }
      }
    }
    
    const countrySite = new CountrySite(countrySiteData);
    await countrySite.save();
    
    req.flash('success', `Country site "${countrySite.name}" created successfully`);
    res.redirect('/admin/country-sites');
  } catch (err) {
    console.error('Error creating country site:', err);
    req.flash('error', 'Failed to create country site: ' + err.message);
    res.redirect('/admin/country-sites/create');
  }
});

// Display country site detail for editing
router.get('/:id', ensureAdmin, async (req, res) => {
  try {
    const countrySite = await CountrySite.findById(req.params.id);
    
    if (!countrySite) {
      req.flash('error', 'Country site not found');
      return res.redirect('/admin/country-sites');
    }
    
    res.render('admin/country-sites/edit', {
      title: `Edit ${countrySite.name}`,
      countrySite
    });
  } catch (err) {
    console.error('Error fetching country site:', err);
    req.flash('error', 'Failed to load country site details');
    res.redirect('/admin/country-sites');
  }
});

// Handle country site update
router.post('/:id', ensureAdmin, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'flag', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'homeImage', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
  { name: 'tournamentBanner', maxCount: 1 },
  { name: 'trainingBanner', maxCount: 1 }
]), async (req, res) => {
  try {
    const countrySite = await CountrySite.findById(req.params.id);
    
    if (!countrySite) {
      req.flash('error', 'Country site not found');
      return res.redirect('/admin/country-sites');
    }
    
    // Update basic information
    countrySite.name = req.body.name;
    countrySite.slug = req.body.slug;
    countrySite.description = req.body.description;
    countrySite.active = req.body.active === 'on';
    countrySite.welcomeMessage = req.body.welcomeMessage;
    countrySite.aboutContent = req.body.aboutContent;
    countrySite.templateName = req.body.templateName || 'Default';
    countrySite.templateIndex = parseInt(req.body.templateIndex) || 0;
    countrySite.customCSS = req.body.customCSS || '';
    
    // Update Home Page Content
    if(req.body.homeContent) {
        countrySite.homeContent.title = req.body.homeContent.title;
        countrySite.homeContent.text = req.body.homeContent.text;
    }
    
    // Update contact information
    countrySite.contactInfo = {
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      socialMedia: {
        facebook: req.body.facebook,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
        linkedin: req.body.linkedin
      }
    };
    
    // Update theme colors
    countrySite.themeColors = {
      primary: req.body.primaryColor || '#003399',
      secondary: req.body.secondaryColor || '#ffffff',
      accent: req.body.accentColor || '#ff9900'
    };
    
    // Update tournament info
    countrySite.tournamentInfo = {
      title: req.body.tournamentTitle,
      description: req.body.tournamentDescription,
      venue: req.body.tournamentVenue,
      date: req.body.tournamentDate,
      registrationLink: req.body.tournamentRegistrationLink,
      bannerImage: countrySite.tournamentInfo?.bannerImage || ''
    };
    
    // Update training info
    countrySite.trainingInfo = {
      title: req.body.trainingTitle,
      description: req.body.trainingDescription,
      schedule: countrySite.trainingInfo?.schedule || [],
      bannerImage: countrySite.trainingInfo?.bannerImage || ''
    };
    
    // Process uploaded files (logo, flag, hero image)
    if (req.files) {
      // Upload to Cloudinary if available
      if (cloudinary.config().cloud_name) {
        if (req.files.logo && req.files.logo[0]) {
          const result = await cloudinary.uploader.upload(req.files.logo[0].path, {
            folder: `country-sites/${req.body.slug}/logo`
          });
          countrySite.logoUrl = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.logo[0].path);
        }
        
        if (req.files.flag && req.files.flag[0]) {
          const result = await cloudinary.uploader.upload(req.files.flag[0].path, {
            folder: `country-sites/${req.body.slug}/flag`
          });
          countrySite.flagUrl = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.flag[0].path);
        }
        
        if (req.files.heroImage && req.files.heroImage[0]) {
          const result = await cloudinary.uploader.upload(req.files.heroImage[0].path, {
            folder: `country-sites/${req.body.slug}/hero`
          });
          countrySite.heroImage = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.heroImage[0].path);
        }
        
        if (req.files.tournamentBanner && req.files.tournamentBanner[0]) {
          const result = await cloudinary.uploader.upload(req.files.tournamentBanner[0].path, {
            folder: `country-sites/${req.body.slug}/tournament`
          });
          countrySite.tournamentInfo.bannerImage = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.tournamentBanner[0].path);
        }
        
        if (req.files.trainingBanner && req.files.trainingBanner[0]) {
          const result = await cloudinary.uploader.upload(req.files.trainingBanner[0].path, {
            folder: `country-sites/${req.body.slug}/training`
          });
          countrySite.trainingInfo.bannerImage = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.trainingBanner[0].path);
        }
        
        if (req.files.homeImage && req.files.homeImage[0]) {
          const result = await cloudinary.uploader.upload(req.files.homeImage[0].path, {
            folder: `country-sites/${req.body.slug}/home`
          });
          countrySite.homeContent.imageUrl = result.secure_url;
          fs.unlinkSync(req.files.homeImage[0].path);
        }
      } else {
        // Store locally if Cloudinary is not configured
        if (req.files.logo && req.files.logo[0]) {
          countrySite.logoUrl = `/uploads/country-sites/${req.files.logo[0].filename}`;
        }
        
        if (req.files.flag && req.files.flag[0]) {
          countrySite.flagUrl = `/uploads/country-sites/${req.files.flag[0].filename}`;
        }
        
        if (req.files.heroImage && req.files.heroImage[0]) {
          countrySite.heroImage = `/uploads/country-sites/${req.files.heroImage[0].filename}`;
        }
        
        if (req.files.tournamentBanner && req.files.tournamentBanner[0]) {
          countrySite.tournamentInfo.bannerImage = `/uploads/country-sites/${req.files.tournamentBanner[0].filename}`;
        }
        
        if (req.files.trainingBanner && req.files.trainingBanner[0]) {
          countrySite.trainingInfo.bannerImage = `/uploads/country-sites/${req.files.trainingBanner[0].filename}`;
        }
        
        if (req.files.homeImage && req.files.homeImage[0]) {
          countrySite.homeContent.imageUrl = `/uploads/country-sites/${req.files.homeImage[0].filename}`;
        }
      }
    }
    
    await countrySite.save();
    
    req.flash('success', `Country site "${countrySite.name}" updated successfully`);
    res.redirect(`/admin/country-sites/${req.params.id}`);
  } catch (err) {
    console.error('Error updating country site:', err);
    req.flash('error', 'Failed to update country site: ' + err.message);
    res.redirect(`/admin/country-sites/${req.params.id}`);
  }
});

// Manage gallery images for a country site
router.get('/:id/gallery', ensureAdmin, async (req, res) => {
  try {
    const countrySite = await CountrySite.findById(req.params.id);
    
    if (!countrySite) {
      req.flash('error', 'Country site not found');
      return res.redirect('/admin/country-sites');
    }
    
    res.render('admin/country-sites/gallery', {
      title: `Gallery - ${countrySite.name}`,
      countrySite
    });
  } catch (err) {
    console.error('Error fetching country site gallery:', err);
    req.flash('error', 'Failed to load gallery');
    res.redirect('/admin/country-sites');
  }
});

// Add image to country site gallery
router.post('/:id/gallery', ensureAdmin, upload.single('galleryImage'), async (req, res) => {
  try {
    const countrySite = await CountrySite.findById(req.params.id);
    
    if (!countrySite) {
      req.flash('error', 'Country site not found');
      return res.redirect('/admin/country-sites');
    }
    
    if (!req.file) {
      req.flash('error', 'No image uploaded');
      return res.redirect(`/admin/country-sites/${req.params.id}/gallery`);
    }
    
    let imageUrl = '';
    
    // Upload to Cloudinary if available
    if (cloudinary.config().cloud_name) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `country-sites/${countrySite.slug}/gallery`
      });
      imageUrl = result.secure_url;
      
      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    } else {
      // Store locally if Cloudinary is not configured
      imageUrl = `/uploads/country-sites/${req.file.filename}`;
    }
    
    // Add image to gallery
    countrySite.galleryImages.push({
      url: imageUrl,
      title: req.body.title || '',
      description: req.body.description || ''
    });
    
    await countrySite.save();
    
    req.flash('success', 'Image added to gallery');
    res.redirect(`/admin/country-sites/${req.params.id}/gallery`);
  } catch (err) {
    console.error('Error adding gallery image:', err);
    req.flash('error', 'Failed to add gallery image: ' + err.message);
    res.redirect(`/admin/country-sites/${req.params.id}/gallery`);
  }
});

// Delete image from country site gallery
router.post('/:id/gallery/:imageIndex/delete', ensureAdmin, async (req, res) => {
  try {
    const countrySite = await CountrySite.findById(req.params.id);
    
    if (!countrySite) {
      req.flash('error', 'Country site not found');
      return res.redirect('/admin/country-sites');
    }
    
    const imageIndex = parseInt(req.params.imageIndex);
    
    if (imageIndex < 0 || imageIndex >= countrySite.galleryImages.length) {
      req.flash('error', 'Invalid image index');
      return res.redirect(`/admin/country-sites/${req.params.id}/gallery`);
    }
    
    // Remove image from gallery
    countrySite.galleryImages.splice(imageIndex, 1);
    await countrySite.save();
    
    req.flash('success', 'Image removed from gallery');
    res.redirect(`/admin/country-sites/${req.params.id}/gallery`);
  } catch (err) {
    console.error('Error removing gallery image:', err);
    req.flash('error', 'Failed to remove gallery image: ' + err.message);
    res.redirect(`/admin/country-sites/${req.params.id}/gallery`);
  }
});

// Delete country site
router.post('/:id/delete', ensureAdmin, async (req, res) => {
  try {
    const countrySite = await CountrySite.findById(req.params.id);
    
    if (!countrySite) {
      req.flash('error', 'Country site not found');
      return res.redirect('/admin/country-sites');
    }
    
    await CountrySite.deleteOne({ _id: req.params.id });
    
    req.flash('success', `Country site "${countrySite.name}" deleted successfully`);
    res.redirect('/admin/country-sites');
  } catch (err) {
    console.error('Error deleting country site:', err);
    req.flash('error', 'Failed to delete country site: ' + err.message);
    res.redirect('/admin/country-sites');
  }
});

// -- TOURNAMENT ROUTES --

// GET new tournament form
router.get('/:id/tournaments/new', ensureAdmin, async (req, res) => {
    try {
        const countrySite = await CountrySite.findById(req.params.id);
        res.render('admin/country-sites/tournaments/new', { countrySite });
    } catch (err) {
        res.redirect('/admin/country-sites');
    }
});

// POST new tournament
router.post('/:id/tournaments', ensureAdmin, upload.single('bannerImage'), async (req, res) => {
    try {
        const countrySite = await CountrySite.findById(req.params.id);
        const newTournament = {
            title: req.body.title,
            description: req.body.description,
            venue: req.body.venue,
            date: req.body.date,
            registrationLink: req.body.registrationLink,
            slug: req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: `country-sites/${countrySite.slug}/tournaments`
            });
            newTournament.bannerImage = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        countrySite.tournaments.push(newTournament);
        await countrySite.save();
        req.flash('success', 'Tournament added successfully.');
        res.redirect(`/admin/country-sites/${req.params.id}`);
    } catch (err) {
        req.flash('error', 'Error adding tournament: ' + err.message);
        res.redirect(`/admin/country-sites/${req.params.id}`);
    }
});

// GET edit tournament form
router.get('/:id/tournaments/:tournamentId/edit', ensureAdmin, async (req, res) => {
    try {
        const countrySite = await CountrySite.findById(req.params.id);
        const tournament = countrySite.tournaments.id(req.params.tournamentId);
        res.render('admin/country-sites/tournaments/edit', { countrySite, tournament });
    } catch (err) {
        res.redirect(`/admin/country-sites/${req.params.id}`);
    }
});

// POST update tournament
router.post('/:id/tournaments/:tournamentId', ensureAdmin, upload.single('bannerImage'), async (req, res) => {
    try {
        const countrySite = await CountrySite.findById(req.params.id);
        const tournament = countrySite.tournaments.id(req.params.tournamentId);

        tournament.title = req.body.title;
        tournament.description = req.body.description;
        tournament.venue = req.body.venue;
        tournament.date = req.body.date;
        tournament.registrationLink = req.body.registrationLink;
        tournament.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-');

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: `country-sites/${countrySite.slug}/tournaments`
            });
            tournament.bannerImage = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        await countrySite.save();
        req.flash('success', 'Tournament updated successfully.');
        res.redirect(`/admin/country-sites/${req.params.id}`);
    } catch (err) {
        req.flash('error', 'Error updating tournament: ' + err.message);
        res.redirect(`/admin/country-sites/${req.params.id}`);
    }
});

// POST delete tournament
router.post('/:id/tournaments/:tournamentId/delete', ensureAdmin, async (req, res) => {
    try {
        const countrySite = await CountrySite.findById(req.params.id);
        countrySite.tournaments.id(req.params.tournamentId).remove();
        await countrySite.save();
        req.flash('success', 'Tournament deleted successfully.');
        res.redirect(`/admin/country-sites/${req.params.id}`);
    } catch (err) {
        req.flash('error', 'Error deleting tournament: ' + err.message);
        res.redirect(`/admin/country-sites/${req.params.id}`);
    }
});

// -- NEWS ROUTES --
const newsUpload = upload.single('imageUrl');
// GET new news form
router.get('/:id/news/new', ensureAdmin, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    res.render('admin/country-sites/news/new', { countrySite });
});
// POST new news
router.post('/:id/news', ensureAdmin, newsUpload, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    const article = { title: req.body.title, content: req.body.content, slug: req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-') };
    if(req.file) article.imageUrl = (await cloudinary.uploader.upload(req.file.path)).secure_url;
    countrySite.news.push(article);
    await countrySite.save();
    res.redirect(`/admin/country-sites/${req.params.id}`);
});
// GET edit news form
router.get('/:id/news/:articleId/edit', ensureAdmin, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    const article = countrySite.news.id(req.params.articleId);
    res.render('admin/country-sites/news/edit', { countrySite, article });
});
// POST update news
router.post('/:id/news/:articleId', ensureAdmin, newsUpload, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    const article = countrySite.news.id(req.params.articleId);
    article.title = req.body.title;
    article.content = req.body.content;
    article.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if(req.file) article.imageUrl = (await cloudinary.uploader.upload(req.file.path)).secure_url;
    await countrySite.save();
    res.redirect(`/admin/country-sites/${req.params.id}`);
});
// POST delete news
router.post('/:id/news/:articleId/delete', ensureAdmin, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    countrySite.news.id(req.params.articleId).remove();
    await countrySite.save();
    res.redirect(`/admin/country-sites/${req.params.id}`);
});

// -- EVENTS ROUTES --
const eventUpload = upload.single('bannerImage');
// GET new event form
router.get('/:id/events/new', ensureAdmin, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    res.render('admin/country-sites/events/new', { countrySite });
});
// POST new event
router.post('/:id/events', ensureAdmin, eventUpload, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    const event = { ...req.body, slug: req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-') };
    if(req.file) event.bannerImage = (await cloudinary.uploader.upload(req.file.path)).secure_url;
    countrySite.events.push(event);
    await countrySite.save();
    res.redirect(`/admin/country-sites/${req.params.id}`);
});
// GET edit event form
router.get('/:id/events/:eventId/edit', ensureAdmin, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    const event = countrySite.events.id(req.params.eventId);
    res.render('admin/country-sites/events/edit', { countrySite, event });
});
// POST update event
router.post('/:id/events/:eventId', ensureAdmin, eventUpload, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    const event = countrySite.events.id(req.params.eventId);
    Object.assign(event, req.body);
    event.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if(req.file) event.bannerImage = (await cloudinary.uploader.upload(req.file.path)).secure_url;
    await countrySite.save();
    res.redirect(`/admin/country-sites/${req.params.id}`);
});
// POST delete event
router.post('/:id/events/:eventId/delete', ensureAdmin, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    countrySite.events.id(req.params.eventId).remove();
    await countrySite.save();
    res.redirect(`/admin/country-sites/${req.params.id}`);
});

// -- WEBINARS ROUTES --
const webinarUpload = upload.single('bannerImage');
// GET new webinar form
router.get('/:id/webinars/new', ensureAdmin, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    res.render('admin/country-sites/webinars/new', { countrySite });
});
// POST new webinar
router.post('/:id/webinars', ensureAdmin, webinarUpload, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    const webinar = { ...req.body, slug: req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-') };
    if(req.file) webinar.bannerImage = (await cloudinary.uploader.upload(req.file.path)).secure_url;
    countrySite.webinars.push(webinar);
    await countrySite.save();
    res.redirect(`/admin/country-sites/${req.params.id}`);
});
// GET edit webinar form
router.get('/:id/webinars/:webinarId/edit', ensureAdmin, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    const webinar = countrySite.webinars.id(req.params.webinarId);
    res.render('admin/country-sites/webinars/edit', { countrySite, webinar });
});
// POST update webinar
router.post('/:id/webinars/:webinarId', ensureAdmin, webinarUpload, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    const webinar = countrySite.webinars.id(req.params.webinarId);
    Object.assign(webinar, req.body);
    webinar.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if(req.file) webinar.bannerImage = (await cloudinary.uploader.upload(req.file.path)).secure_url;
    await countrySite.save();
    res.redirect(`/admin/country-sites/${req.params.id}`);
});
// POST delete webinar
router.post('/:id/webinars/:webinarId/delete', ensureAdmin, async (req, res) => {
    const countrySite = await CountrySite.findById(req.params.id);
    countrySite.webinars.id(req.params.webinarId).remove();
    await countrySite.save();
    res.redirect(`/admin/country-sites/${req.params.id}`);
});

module.exports = router; 