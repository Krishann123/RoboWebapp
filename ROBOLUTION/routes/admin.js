const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Import country sites admin routes
const countrySitesRouter = require('./admin/country-sites');

// Admin dashboard
router.get('/', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.render('admin-dashboard', {
        user: req.user
    });
});

/* This route is deprecated and has been removed.
// International news management
router.get('/international/news', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.render('admin/international-news-management', {
        user: req.user,
        activeTab: 'international-news'
    });
});
*/

// Mount country sites routes
router.use('/country-sites', countrySitesRouter);

module.exports = router; 