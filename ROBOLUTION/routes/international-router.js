const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Debug middleware to log all requests and session state
router.use((req, res, next) => {
  console.log(`[International Route] ${req.method} ${req.url} | Session Auth: ${!!req.session?.user}`);
  
  // Redirect root requests to the correct dubai path
  if (req.originalUrl === '/dubai') {
    return res.redirect('/dubai/');
  }
  
  // Add session check middleware
  if (req.session && req.session.user) {
    // Add user data to res.locals for template access if needed
    res.locals.user = req.session.user;
  }
  
  next();
});

// Serve static files from the 'public' directory of the international app
const internationalPublicPath = path.join(__dirname, '../../international/public');
router.use(express.static(internationalPublicPath));

// Serve assets from international/src/assets with highest priority
const internationalAssetsPath = path.join(__dirname, '../../international/src/assets');
router.use('/src/assets', express.static(internationalAssetsPath, {
  setHeaders: (res, path) => {
    res.setHeader('X-Asset-Path', path); // Add header to help debug
  }
}));

// Also serve assets from the direct path (without /src prefix) for client-side rendering 
router.use('/assets/images', express.static(path.join(internationalAssetsPath, 'images'), {
  setHeaders: (res, path) => {
    res.setHeader('X-Asset-Path', path);
  }
}));

// For production mode
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode with static assets');
  
  // Serve the built client assets (CSS, JS)
  const distClientDir = path.join(__dirname, '../../international/dist/client');
  if (fs.existsSync(distClientDir)) {
    console.log(`Serving client assets from ${distClientDir}`);
    router.use('/', express.static(distClientDir));
  }
  
  // Serve the built asset chunks
  const distAssetsDir = path.join(distClientDir, 'assets');
  if (fs.existsSync(distAssetsDir)) {
    console.log(`Serving assets from ${distAssetsDir}`);
    router.use('/assets', express.static(distAssetsDir));
  }
} 
// For development mode
else {
  console.log('Running in development mode with proxy');
  
  // New redirect logic
  const astroPages = ['/news', '/trainings', '/tournament', '/awards', '/nominations_tab'];
  router.use((req, res, next) => {
    const lowerPath = req.path.toLowerCase();
    if (astroPages.includes(lowerPath)) {
        // Check if it's NOT already under /dubai
        if (!req.originalUrl.startsWith('/dubai')) {
            return res.redirect(`/dubai${req.path}`);
        }
    }
    next();
  });
  
  // Alias lowercase requests to match Astro page filenames
  router.use('/', (req, res, next) => {
    const pathOnly = req.url.split('?')[0];
    console.log(`[International Route] Processing path: ${pathOnly}`);
    
    const aliases = {
      '/news': '/News',
      '/trainings': '/Trainings',
      '/tournaments': '/Tournament',
      '/tournament': '/Tournament',
      '/awards': '/Awards',
      '/nominations_tab': '/Nominations_Tab',
      '/nominations': '/Nominations_Tab',
      '/nominations_tab': '/Nominations_Tab' // Add explicit match for lowercase
    };
    
    // Make aliases case-insensitive
    const lower = pathOnly.toLowerCase();
    console.log(`[International Route] Lowercase path: ${lower}`);
    
    for (const [key, value] of Object.entries(aliases)) {
      if (lower === key || lower === key + '/') {
        const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
        req.url = value + query;
        console.log(`[International Route] Rewriting to: ${req.url}`);
        break;
      }
    }
    
    next();
  });
  
  // Use proxy middleware for everything else
  const proxyOptions = {
    target: 'http://localhost:4321', // Default Astro dev server port
    changeOrigin: true,
    ws: true, // Support WebSocket
    cookieDomainRewrite: {
      '*': process.env.COOKIE_DOMAIN || 'localhost' // Rewrite all cookie domains
    },
    onProxyReq: (proxyReq, req, res) => {
      // Ensure session cookies are properly forwarded
      if (req.session && req.session.user) {
        proxyReq.setHeader('X-User-ID', req.session.user.id || '');
        proxyReq.setHeader('X-User-Name', req.session.user.username || '');
        proxyReq.setHeader('X-User-Auth', 'true');
      }
      console.log(`[International Route] Proxying request: ${req.method} ${req.url}`);
    },
    pathRewrite: (path, req) => {
      console.log(`[International Route] Proxy rewriting path: ${path}`);
      // Prepend /dubai to the path for the Astro dev server
      return '/dubai' + path;
    },
    onProxyRes: (proxyRes, req, res) => {
      // Handle headers if needed
      console.log(`[International Route] Proxy response status: ${proxyRes.statusCode}`);
      
      // Preserve cookies
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
  
  router.use('/', createProxyMiddleware(proxyOptions));
}

// For production, the Astro app will be built and served directly
// Main handler is in app.js

module.exports = router; 