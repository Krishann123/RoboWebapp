const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const CountrySite = require('../models/CountrySite');

// Debug middleware to log requests
router.use((req, res, next) => {
  console.log(`[International Sites] ${req.method} ${req.url} | Session Auth: ${!!req.session?.user}`);
  next();
});

// Middleware to load country site configuration based on URL
router.use(async (req, res, next) => {
  try {
    // Extract country slug from URL
    // The URL format is expected to be /country/{slug}/*
    const urlParts = req.originalUrl.split('/');
    // The slug is the first part after /country/
    const slug = urlParts[2];
    
    if (!slug) {
      return next(); // No slug, let it pass to the country list page
    }
    
    // Find the country site
    const countrySite = await CountrySite.findOne({ slug, active: true });
    
    if (!countrySite) {
      req.flash('error', 'Country site not found or inactive');
      return res.redirect('/country');
    }
    
    // Store country site info in request for later use
    req.countrySite = countrySite;
    
    // Add user data to res.locals if available
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

// Country list page - shows all active country sites
router.get('/', async (req, res) => {
  try {
    const countrySites = await CountrySite.find({ active: true }).sort({ name: 1 });
    res.render('UserViews/country-sites', { 
      countrySites,
      user: req.session.user,
      successMessage: req.flash('success'),
      errorMessage: req.flash('error')
    });
  } catch (error) {
    console.error('Error listing country sites:', error);
    req.flash('error', 'Error loading country sites');
    res.redirect('/');
  }
});

// For production mode
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode with static country site assets');
  
  // Serve the built country site assets
  router.use('/:slug', (req, res, next) => {
    // Get the country site info from the request
    const countrySite = req.countrySite;
    if (!countrySite) return next();
    
    // Serve static files from the Astro dist directory
    const distClientDir = path.join(__dirname, '../../international/dist/client');
    if (fs.existsSync(distClientDir)) {
      // We're inside the /:slug route, so strip the country slug from the URL
      // to match the paths in the Astro build
      req.url = req.url.replace(`/${countrySite.slug}`, '');
      if (req.url === '') req.url = '/';
      
      // Create custom middleware that serves the Astro files
      // but injects the country site info into the templates
      return express.static(distClientDir)(req, res, next);
    }
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
        const stripped = path.replace(new RegExp(`^/country/${countrySite.slug}`), '');
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

// Add a fallback route handler to serve the index.html for any route inside a country site
router.get('/:slug/*', (req, res) => {
  const countrySite = req.countrySite;
  if (!countrySite) return res.status(404).send('Country site not found');
  
  // Create a simple HTML page with country site data since we can't find the built index.html
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${countrySite.name} - Robolution International</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      header {
        background-color: ${countrySite.customStyles?.primaryColor || '#00008b'};
        color: white;
        padding: 1rem;
        text-align: center;
      }
      .content {
        background: white;
        padding: 2rem;
        margin: 2rem 0;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .flag {
        display: block;
        width: 120px;
        height: auto;
        margin: 1rem auto;
        border: 1px solid #ddd;
      }
      .center {
        text-align: center;
      }
      .btn {
        display: inline-block;
        background-color: ${countrySite.customStyles?.secondaryColor || '#FFB366'};
        color: #333;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 1rem;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Robolution ${countrySite.name}</h1>
    </header>
    <div class="container">
      <div class="content">
        <div class="center">
          <img src="${countrySite.flagUrl || '/images/flags/placeholder.png'}" alt="${countrySite.name} Flag" class="flag">
          <h2>Welcome to Robolution ${countrySite.name}</h2>
          <p>${countrySite.description || 'Explore Robotics Innovation and Education'}</p>
          <a href="/country" class="btn">Back to International Sites</a>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  
  res.send(html);
});

// Also add a fallback for the root path of a country site
router.get('/:slug', (req, res) => {
  const countrySite = req.countrySite;
  if (!countrySite) return res.status(404).send('Country site not found');
  
  // Create a simple HTML page with country site data since we can't find the built index.html
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${countrySite.name} - Robolution International</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      header {
        background-color: ${countrySite.customStyles?.primaryColor || '#00008b'};
        color: white;
        padding: 1rem;
        text-align: center;
      }
      .content {
        background: white;
        padding: 2rem;
        margin: 2rem 0;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .flag {
        display: block;
        width: 120px;
        height: auto;
        margin: 1rem auto;
        border: 1px solid #ddd;
      }
      .center {
        text-align: center;
      }
      .btn {
        display: inline-block;
        background-color: ${countrySite.customStyles?.secondaryColor || '#FFB366'};
        color: #333;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 1rem;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Robolution ${countrySite.name}</h1>
    </header>
    <div class="container">
      <div class="content">
        <div class="center">
          <img src="${countrySite.flagUrl || '/images/flags/placeholder.png'}" alt="${countrySite.name} Flag" class="flag">
          <h2>Welcome to Robolution ${countrySite.name}</h2>
          <p>${countrySite.description || 'Explore Robotics Innovation and Education'}</p>
          <a href="/country" class="btn">Back to International Sites</a>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  
  res.send(html);
});

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

module.exports = router; 