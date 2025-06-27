const express = require('express');
const router = express.Router();
const CountrySite = require('../../models/CountrySite');

/**
 * @route GET /api/countries
 * @description Get all active country sites
 * @access Public
 */
router.get('/', async (req, res) => {
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
router.get('/:slug', async (req, res) => {
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
router.get('/:slug/tournament', async (req, res) => {
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
router.get('/:slug/training', async (req, res) => {
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
router.get('/:slug/gallery', async (req, res) => {
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

module.exports = router; 