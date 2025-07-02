const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const TourGallery = require('../../models/TourGallery');
const Post = require('../../models/Post');
const { ensureAuthenticated, ensureAdmin } = require('../../middleware/auth');

// Static list of Philippine regions, matching create-post.ejs
const philippineRegions = [
    { value: "Region I", name: "Region I (Ilocos Region)" },
    { value: "Region II", name: "Region II (Cagayan Valley)" },
    { value: "Region III", name: "Region III (Central Luzon)" },
    { value: "Region IV-A", name: "Region IV-A (CALABARZON)" },
    { value: "Region IV-B", name: "Region IV-B (MIMAROPA)" },
    { value: "Region V", name: "Region V (Bicol Region)" },
    { value: "Region VI", name: "Region VI (Western Visayas)" },
    { value: "Region VII", name: "Region VII (Central Visayas)" },
    { value: "Region VIII", name: "Region VIII (Eastern Visayas)" },
    { value: "Region IX", name: "Region IX (Zamboanga Peninsula)" },
    { value: "Region X", name: "Region X (Northern Mindanao)" },
    { value: "Region XI", name: "Region XI (Davao Region)" },
    { value: "Region XII", name: "Region XII (SOCCSKSARGEN)" },
    { value: "Region XIII", name: "Region XIII (Caraga)" },
    { value: "NCR", name: "National Capital Region (NCR)" },
    { value: "CAR", name: "Cordillera Administrative Region (CAR)" },
    { value: "BARMM", name: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)" }
];

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup for image uploads
const storage = multer.diskStorage({});
// Allow uploading up to 20 images at once
const upload = multer({ storage });

// GET route to display the tour gallery management page
router.get('/tour-gallery', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const selectedRegion = req.query.region || 'All';
    let query = {};
    if (selectedRegion !== 'All') {
      query = { region: selectedRegion };
    }

    const galleryItems = await TourGallery.find(query).sort({ region: 1, createdAt: 'desc' });
    
    res.render('admin/manage-tour-gallery', {
      page: 'manage-tour-gallery',
      galleryItems,
      regions: philippineRegions,
      selectedRegion,
      user: req.session.user,
      dashboard: true // This page is always within the dashboard
    });
  } catch (error) {
    console.error('Error fetching tour gallery page:', error);
    req.flash('error', 'Error loading page.');
    res.redirect('/admin-dashboard');
  }
});

// POST route to add multiple new gallery images
router.post('/tour-gallery/add', ensureAuthenticated, ensureAdmin, upload.array('images', 20), async (req, res) => {
  try {
    const { region } = req.body;
    if (!req.files || req.files.length === 0) {
      req.flash('error', 'Please select at least one image to upload.');
      return res.redirect('/admin/tour-gallery');
    }

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'tour_gallery'
      });
      
      const newImage = new TourGallery({
        region: region,
        image: result.secure_url,
        cloudinary_id: result.public_id
      });
      await newImage.save();
    }
    
    req.flash('success', `${req.files.length} image(s) added successfully to ${region}.`);
    res.redirect(`/admin/tour-gallery?region=${encodeURIComponent(region)}`);
  } catch (error) {
    console.error('Error adding gallery images:', error);
    req.flash('error', 'An error occurred while adding images.');
    res.redirect('/admin/tour-gallery');
  }
});

// DELETE route for single or multiple images
router.post('/tour-gallery/delete', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { imageIds } = req.body;
    if (!imageIds || imageIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No image IDs provided.' });
    }

    const idsToDelete = Array.isArray(imageIds) ? imageIds : [imageIds];
    const items = await TourGallery.find({ '_id': { $in: idsToDelete } });

    for (const item of items) {
      await cloudinary.uploader.destroy(item.cloudinary_id);
    }

    await TourGallery.deleteMany({ '_id': { $in: idsToDelete } });
    
    res.json({ success: true, message: `${idsToDelete.length} image(s) deleted successfully.` });
  } catch (error) {
    console.error('Error deleting gallery images:', error);
    res.status(500).json({ success: false, message: 'An error occurred during deletion.' });
  }
});

module.exports = router; 