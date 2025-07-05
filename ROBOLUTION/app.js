// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || process.env.PORT || 3000;
const mongoose = require('mongoose');
const cors = require('cors');
const moment = require('moment'); // Added moment
const Post = require('./models/Post');
const multer = require('multer');  // To handle file uploads
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Category = require('./models/Category');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const Registration = require('./models/Registration');
const User = require('./models/User');
const fetch = require('node-fetch'); // For fetching files from Cloudinary
const qrcode = require('qrcode');
const { exec } = require('child_process'); // For executing system commands
const { ObjectId } = require('mongodb'); // Added for ObjectId usage
const axios = require('axios');
const Score = require('./models/Score');
const Partner = require('./models/Partner');
const otpGenerator = require('otp-generator');
const postmark = require('postmark');
const YearVideo = require('./models/YearVideo');
const TourGallery = require('./models/TourGallery');

let postmarkClient;
if (process.env.POSTMARK_API_TOKEN && process.env.POSTMARK_API_TOKEN !== 'YOUR_POSTMARK_SERVER_API_TOKEN') {
  postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);
  console.log('Postmark client initialized successfully.');
} else {
  console.warn('***********************************************************************************');
  console.warn('WARNING: POSTMARK_API_TOKEN is not set in the .env file.');
  console.warn('Email functionality (like OTP for new users) will be disabled.');
  console.warn('Please add POSTMARK_API_TOKEN and POSTMARK_FROM_EMAIL to your .env file.');
  console.warn('***********************************************************************************');
  
  // Create a mock client to prevent crashes
  postmarkClient = {
    sendEmail: async (emailDetails) => {
      console.error('POSTMARK DISABLED: Attempted to send email but no API token is configured.', emailDetails);
      // Throw an error that will be caught by the route handler
      throw new Error('Email service is not configured on the server.');
    }
  };
}

// Try to load connect-flash if available, but don't fail if it's not
let flash;
try {
  flash = require('connect-flash');
} catch (err) {
  console.log('connect-flash not available, will use simple flash messages');
  flash = null;
}

// Define Admin model placeholder
// Note: The actual Admin model is defined after database connection setup
const cloudinary = require('cloudinary').v2; // Add Cloudinary
const MongoStore = require('connect-mongo');
const speakeasy = require('speakeasy');

// Trust proxy - required for secure cookies in production
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Create necessary directories
const requiredDirs = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'public/uploads'),
  path.join(__dirname, 'public/uploads/temp'),
  path.join(__dirname, 'public/images'),
  path.join(__dirname, 'public/css'),
  path.join(__dirname, 'public/js')
];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add debug logging
console.log('Cloudinary Configuration:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  hasSecret: !!process.env.CLOUDINARY_API_SECRET
});

// MongoDB connection string - using environment variables
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("ERROR: MONGODB_URI environment variable is not set in .env file");
  process.exit(1); // Exit the application if the connection string is not available
}

// Define variables for database access
let db; // For adminDB access
let robolutionDb; // For direct robolution database access

// Define international app integration
let internationalHandler;

const isProduction = process.env.NODE_ENV === 'production';
const isLocalhost = process.env.COOKIE_DOMAIN === 'localhost';

// Configure Express to trust proxies (important for Render's forwarded headers)
app.set('trust proxy', isProduction ? 'loopback, linklocal, uniquelocal' : 1); // Trust first proxy. Important for reverse proxies (like the one in start.js)

// Configure CORS to allow cookies and credentials
// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4321',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4321'
];

if (isProduction) {
  // Add production domains
  if (process.env.RENDER_EXTERNAL_URL) {
      allowedOrigins.push(process.env.RENDER_EXTERNAL_URL); // e.g., https://robowebapp.onrender.com
  }
  allowedOrigins.push('https://robolution.erovoutika.ph'); // Custom domain
}

// Configure CORS to allow cookies and credentials
app.use(cors({
  origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests) or from whitelisted domains
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          console.error(`CORS Error: Origin ${origin} not allowed.`);
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add cookie parser middleware with special handling for Render and production environments
app.use((req, res, next) => {
  // Add helper to check for cookies by name
  req.hasCookie = (name) => {
    return req.headers.cookie && req.headers.cookie.split(';').some(c => c.trim().startsWith(`${name}=`));
  };
  
  // Add debug information to response headers
  if (isProduction) {
    res.setHeader('X-Cookie-Domain', process.env.COOKIE_DOMAIN || 'not-set');
    res.setHeader('X-Environment', process.env.NODE_ENV || 'unknown');
    res.setHeader('X-Is-Render', process.env.RENDER === 'true' ? 'true' : 'false');
  }
  
  // Continue with request
  next();
});

// Utility function to get country template data
async function getCountryTemplate(req) {
  try {
    // Log session data for debugging
    console.log(`[Template Debug] Session data:`, {
      sessionID: req.sessionID,
      hasSession: !!req.session,
      selectedCountry: req.session?.selectedCountry || 'none set'
    });
    
    // Get slug from session or query parameter, default to 'default' (Dubai)
    const slug = req.query.country || (req.session && req.session.selectedCountry) || 'default';
    
    // If a query parameter is provided, update the session
    if (req.query.country && req.session) {
      req.session.selectedCountry = req.query.country;
      console.log(`[Template] Updated session country to: ${req.query.country}`);
      
      // Save the session if needed
      if (req.session.save) {
        await new Promise((resolve, reject) => {
          req.session.save(err => {
            if (err) {
              console.error('[Template] Error saving session:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    }
    
    console.log(`[Template] Looking up template for: ${slug}`);
    
    // Get template from database
    const testDb = mongoose.connection.useDb('test');
    const Templates = testDb.collection('templates');
    const template = await Templates.findOne({ Name: slug });
    
    if (template) {
      const countryData = {
        name: template.Name === 'default' ? 'Dubai' : template.Name,
        slug: template.Name,
        templateName: template.Name,
        flagUrl: template.config?.Contents?.Navbar?.Content?.button?.image || '',
        description: template.config?.Contents?.Home?.hero?.subText || ''
      };
      console.log(`[Template] Found template data for: ${countryData.name}`);
      return countryData;
    } else {
      console.error(`[Template] Template not found for slug: ${slug}, falling back to default`);
      // Try to get the default template as fallback
      const defaultTemplate = await Templates.findOne({ Name: 'default' });
      if (defaultTemplate) {
        const defaultData = {
          name: 'Dubai',
          slug: 'default',
          templateName: 'default',
          flagUrl: defaultTemplate.config?.Contents?.Navbar?.Content?.button?.image || '',
          description: defaultTemplate.config?.Contents?.Home?.hero?.subText || ''
        };
        console.log(`[Template] Using default template as fallback`);
        return defaultData;
      }
      return null;
    }
  } catch (error) {
    console.error('[Template] Error retrieving template:', error);
    return null;
  }
}

// Add environment debug logging for production (Render)
if (process.env.NODE_ENV === 'production' || process.env.RENDER === 'true') {
  console.log('=== PRODUCTION ENVIRONMENT INFO ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('RENDER:', process.env.RENDER === 'true' ? 'true' : 'false');
  console.log('RENDER_EXTERNAL_HOSTNAME:', process.env.RENDER_EXTERNAL_HOSTNAME || 'not set');
  console.log('RENDER_EXTERNAL_URL:', process.env.RENDER_EXTERNAL_URL || 'not set');
  console.log('COOKIE_DOMAIN:', process.env.COOKIE_DOMAIN || 'not set');
  console.log('isProduction:', isProduction);
  console.log('isLocalhost:', isLocalhost);
  console.log('==================================');
}

// Set up session middleware before routes
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secure-admin-key',
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Do not create session until something is stored
  store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: 'robolution',
      collectionName: 'sessions',
      ttl: 3 * 60 * 60, // Session TTL in seconds (3 hours)
      touchAfter: 60, // Only update the session every 1 minute if no changes (reduced from 5 minutes)
      stringify: false, // Store as native MongoDB documents
      autoRemove: 'native', // Use MongoDB's TTL index
      crypto: {
          secret: process.env.SESSION_SECRET || 'your-secure-admin-key'
      }
  }),
  cookie: { 
      secure: isProduction && !isLocalhost, // Use secure cookies only in production and not on localhost
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
      sameSite: 'lax', // Use lax for better compatibility
      path: '/' // Ensure cookie is available on all paths
  },
  name: 'robolution_session',
}));

// Set up flash middleware after session if available
if (flash) {
  app.use(flash());
} else {
  // Simple flash middleware implementation if connect-flash is not available
  app.use((req, res, next) => {
    if (!req.session.messages) {
      req.session.messages = {};
    }
    
    req.flash = function(type, message) {
      if (!req.session.messages[type]) {
        req.session.messages[type] = [];
      }
      req.session.messages[type].push(message);
    };
    
    res.locals.messages = req.session.messages || {};
    req.session.messages = {};
    
    next();
  });
}

// Add better session debugging and persistence
app.use((req, res, next) => {
    // Skip session debug for static files to reduce log noise
    if (!req.url.startsWith('/js/') && !req.url.startsWith('/css/') && !req.url.startsWith('/images/')) {
        console.log('Session Debug:', {
            url: req.url,
            method: req.method,
            sessionID: req.sessionID,
            session: {
                hasSession: !!req.session,
                isAuthenticated: !!req.session?.user,
                isAdmin: req.session?.user?.isAdmin,
                username: req.session?.user?.username
            },
            store: {
                type: 'MongoStore',
                connected: !!req.session?.store
            },
            cookie: req.session?.cookie ? {
                maxAge: req.session.cookie.maxAge,
                expires: req.session.cookie.expires,
                httpOnly: req.session.cookie.httpOnly,
                path: req.session.cookie.path,
                domain: req.session.cookie.domain,
                secure: req.session.cookie.secure,
                sameSite: req.session.cookie.sameSite
            } : 'No cookie'
        });
    }
    
    // Ensure session persistence
    if (req.session && req.session.user) {
        // Touch the session on each request
        req.session.touch();
    }
    
    next();
});

// Add middleware to make user and flash messages available to all views
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    
    // Create a simple flash implementation if connect-flash isn't available
    if (!req.flash) {
        // Store flash messages in session
        if (!req.session.flashMessages) {
            req.session.flashMessages = { success: [], error: [] };
        }
        
        // Define flash function
        req.flash = function(type, message) {
            console.log(`Flash message: ${type} - ${message}`);
            if (!req.session.flashMessages[type]) {
                req.session.flashMessages[type] = [];
            }
            req.session.flashMessages[type].push(message);
            return req.session.flashMessages[type];
        };
        
        // Expose flash messages to templates
        res.locals.flashMessages = {
            success: req.session.flashMessages.success || [],
            error: req.session.flashMessages.error || []
        };
        
        // Clear flash messages after they're consumed
        req.session.flashMessages = { success: [], error: [] };
    } else {
        // Use connect-flash as normal
        res.locals.flashMessages = {
            success: req.flash('success') || [],
            error: req.flash('error') || []
        };
    }
    
    next();
});

// Add cache control middleware for authenticated routes
app.use((req, res, next) => {
  // If user is logged in, set no-cache headers to prevent browser caching
  if (req.session && req.session.user) {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
  }
  next();
});

// ==== START MOVED MIDDLEWARE ====

// Middleware to require login for regular users
const requireLogin = (req, res, next) => {
    if (!req.session.user || !req.session.user.id) {
        // Store the original URL to redirect back after login
        const redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to view this page.');
        return res.redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
    
    // Touch the session to keep it alive
    if (req.session) {
        req.session.touch();
    }
    
    next();
};

// Protected route middleware
const requireAdmin = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'superadmin')) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Require SUPERADMIN middleware - Only allow superadmin users to access
const requireSuperAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'superadmin') {
        return next();
    }
    req.flash('error', 'Access denied. Super Admins only.');
    res.redirect('/admin-dashboard'); // Or a generic access denied page
};

// Middleware to require judge role
const requireJudge = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'judge') {
        return next();
    }
    // For API endpoints, sending a JSON response is often better
    res.status(403).json({ message: 'Access denied. Judges only.'});
};

// Middleware to allow admins, superadmins, or judges (MOVED HERE)
const allowAdminsAndJudges = (req, res, next) => {
  if (req.session.user && 
      (req.session.user.role === 'admin' || 
       req.session.user.role === 'superadmin' || 
       req.session.user.role === 'judge')) {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Requires admin or judge role.' });
};

// ==== END MOVED MIDDLEWARE ==== // Or a similar comment indicating end of this block

// MongoDB Backup Functionality
const setupDatabaseBackups = () => {
  const backupsDir = path.join(__dirname, 'database_backups');
  
  // Create backups directory if it doesn't exist - we'll still use this for temporary storage
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
    console.log(`Created database backups directory: ${backupsDir}`);
  }
  
  // Function to perform database backup using MongoDB driver directly and upload to Cloudinary
  const backupDatabase = async () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupId = `backup-${timestamp}`;
      const backupPath = path.join(__dirname, 'database_backups', backupId);
      
      // Create timestamp directory for temporary storage
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
      }
      
      console.log(`Starting MongoDB backup to: ${backupPath}`);
      
      // Get a client to the MongoDB database
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const dbName = 'robolution'; // Your database name
      const db = client.db(dbName);
      
      // Get all collections in the database
      const collections = await db.listCollections().toArray();
      
      // Store information about all files uploaded
      const uploadedFiles = [];
      
      // For each collection, export all documents to a JSON file and upload to Cloudinary
      for (const collection of collections) {
        const collectionName = collection.name;
        const documents = await db.collection(collectionName).find({}).toArray();
        
        // Convert MongoDB objects to JSON-compatible format
        // This is important for handling ObjectIDs and other special MongoDB types correctly
        const jsonReadyDocuments = documents.map(doc => {
          const processedDoc = {};
          
          // Process each field in the document
          Object.keys(doc).forEach(key => {
            const value = doc[key];
            
            // Handle ObjectID specifically - preserve as string but with type information
            if (value && value.constructor && (value.constructor.name === 'ObjectID' || value.constructor.name === 'ObjectId')) {
              processedDoc[key] = value.toString();
            } 
            // Handle Date objects
            else if (value instanceof Date) {
              processedDoc[key] = { 
                $date: value.toISOString() 
              };
            }
            // Handle nested objects (could contain ObjectIDs)
            else if (value && typeof value === 'object' && !Array.isArray(value)) {
              const nestedObj = {};
              Object.keys(value).forEach(nestedKey => {
                const nestedValue = value[nestedKey];
                if (nestedValue && nestedValue.constructor && 
                    (nestedValue.constructor.name === 'ObjectID' || nestedValue.constructor.name === 'ObjectId')) {
                  nestedObj[nestedKey] = nestedValue.toString();
                } else {
                  nestedObj[nestedKey] = nestedValue;
                }
              });
              processedDoc[key] = nestedObj;
            } 
            // Handle arrays (could contain ObjectIDs or other special types)
            else if (Array.isArray(value)) {
              processedDoc[key] = value.map(item => {
                if (item && item.constructor && (item.constructor.name === 'ObjectID' || item.constructor.name === 'ObjectId')) {
                  return item.toString();
                }
                return item;
              });
            } 
            // Default case: use the value as is
            else {
              processedDoc[key] = value;
            }
          });
          
          return processedDoc;
        });
        
        // Save documents to a JSON file temporarily
        const collectionFile = path.join(backupPath, `${collectionName}.json`);
        fs.writeFileSync(collectionFile, JSON.stringify(jsonReadyDocuments, null, 2));
        console.log(`Created temporary backup file for collection: ${collectionName} with ${documents.length} documents`);
        
        // Upload the JSON file to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(collectionFile, `robolution/backups/${backupId}`);
        uploadedFiles.push({
          collection: collectionName,
          url: cloudinaryResult,
          documentCount: documents.length
        });
        console.log(`Uploaded backup for collection ${collectionName} to Cloudinary`);
      }
      
      // Write metadata about the backup
      const metadata = {
        timestamp: timestamp,
        date: new Date().toString(),
        databaseName: dbName,
        collections: collections.map(c => c.name),
        backupType: 'cloudinary_export',
        files: uploadedFiles,
        format: 'json_with_objectid_strings' // Add format information to help with restore
      };
      
      // Save metadata file
      const metadataFile = path.join(backupPath, 'backup-metadata.json');
      fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
      
      // Upload metadata file to Cloudinary
      const metadataUrl = await uploadToCloudinary(metadataFile, `robolution/backups/${backupId}`);
      
      // Save backup record to the database so we can list backups later
      await db.collection('database_backups').insertOne({
        backupId,
        timestamp: new Date(),
        metadataUrl,
        files: uploadedFiles,
        format: 'json_with_objectid_strings', // Store format information
        size: uploadedFiles.reduce((acc, file) => acc + (file.size || 0), 0)
      });
      
      console.log(`MongoDB backup successful. Metadata stored at: ${metadataUrl}`);
      
      // Clean up temporary files
      try {
        fs.rm(backupPath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(`Error cleaning up temporary backup files: ${err.message}`);
          } else {
            console.log(`Cleaned up temporary backup directory: ${backupPath}`);
          }
        });
      } catch (cleanupError) {
        console.error(`Error during backup cleanup: ${cleanupError.message}`);
      }
      
      // Close the client
      await client.close();
      
      // Rotate backups - keep only the last 48 backups
      rotateCloudinaryBackups(48);
    } catch (error) {
      console.error(`Database backup error:`, error);
    }
  };
  
  // Function to rotate backups (delete oldest backups keeping only the latest n)
  const rotateCloudinaryBackups = async (keepCount) => {
    try {
      // Connect to the database
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db('robolution');
      
      // Get all backups sorted by date (oldest first)
      const backups = await db.collection('database_backups')
        .find({})
        .sort({ timestamp: 1 })
        .toArray();
      
      // If we have more backups than keepCount, delete the oldest ones
      if (backups.length > keepCount) {
        const toDelete = backups.slice(0, backups.length - keepCount);
        
        for (const backup of toDelete) {
          console.log(`Deleting old backup: ${backup.backupId}`);
          
          // Delete each file from Cloudinary
          for (const file of backup.files) {
            if (file.url) {
              try {
                let publicId;
                // Handle both string URLs and object URLs
                if (typeof file.url === 'string') {
                  const urlParts = file.url.split('/');
                  publicId = `robolution/backups/${backup.backupId}/${urlParts[urlParts.length - 1].split('.')[0]}`;
                } else if (file.url.public_id) {
                  // If it's an object with public_id, use it directly
                  publicId = file.url.public_id;
                } else if (file.url.secure_url) {
                  // If it has secure_url, extract from that
                  const urlParts = file.url.secure_url.split('/');
                  publicId = `robolution/backups/${backup.backupId}/${urlParts[urlParts.length - 1].split('.')[0]}`;
                } else {
                  console.log(`Skipping file deletion: URL format not recognized`, file.url);
                  return; // Using return instead of continue since we're in a try block
                }
                
                // Delete from Cloudinary
                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted Cloudinary file: ${publicId}`);
              } catch (err) {
                console.error(`Error deleting Cloudinary file: ${err.message}`);
              }
            }
          }
          
          // Delete metadata from Cloudinary if it exists
          if (backup.metadataUrl) {
            try {
              let publicId;
              // Handle both string URLs and object URLs
              if (typeof backup.metadataUrl === 'string') {
                const urlParts = backup.metadataUrl.split('/');
                publicId = `robolution/backups/${backup.backupId}/${urlParts[urlParts.length - 1].split('.')[0]}`;
              } else if (backup.metadataUrl.public_id) {
                // If it's an object with public_id, use it directly
                publicId = backup.metadataUrl.public_id;
              } else if (backup.metadataUrl.secure_url) {
                // If it has secure_url, extract from that
                const urlParts = backup.metadataUrl.secure_url.split('/');
                publicId = `robolution/backups/${backup.backupId}/${urlParts[urlParts.length - 1].split('.')[0]}`;
              } else {
                console.log(`Skipping metadata deletion: URL format not recognized`, backup.metadataUrl);
                return; // Using return instead of continue since we're in a try block
              }
              
              await cloudinary.uploader.destroy(publicId);
              console.log(`Deleted Cloudinary metadata file: ${publicId}`);
            } catch (err) {
              console.error(`Error deleting Cloudinary metadata file: ${err.message}`);
            }
          }
          
          // Delete the backup record from the database
          await db.collection('database_backups').deleteOne({ _id: backup._id });
          console.log(`Deleted backup record from database: ${backup.backupId}`);
        }
      }
      
      // Close the client
      await client.close();
    } catch (error) {
      console.error('Error rotating backups:', error);
    }
  };

  // Schedule hourly backups
  console.log('Setting up scheduled database backups (hourly)');
  setInterval(() => {
    backupDatabase().catch(err => {
      console.error('Scheduled backup error:', err);
    });
  }, 60 * 60 * 1000); // Every hour
  
  // Run a backup immediately on startup
  console.log('Running initial database backup on startup');
  backupDatabase().catch(err => {
    console.error('Initial backup error:', err);
  });
};

// Connect MongoDB for both Mongoose and MongoClient
mongoose.connect(uri, { dbName: 'robolution' })
  .then(() => {
    console.log("Connected to MongoDB Atlas with Mongoose using robolution database");
    return MongoClient.connect(uri);
  })
  .then(client => {
    // Set the db variable to access the adminDB for admin operations
    db = client.db('adminDB');
    console.log('MongoDB client connected to adminDB for admin operations');
    
    // Also access the robolution database for direct operations if needed
    robolutionDb = client.db('robolution');
    console.log('MongoDB client can also access robolution database');
    
    // Ensure database_backups collection exists
    robolutionDb.listCollections({ name: 'database_backups' })
      .toArray()
      .then(collections => {
        if (collections.length === 0) {
          console.log('Creating database_backups collection for backup management');
          robolutionDb.createCollection('database_backups');
        }
      })
      .catch(err => console.error('Error checking for database_backups collection:', err));
    
    // Check admins collection exists in robolution database as well
    robolutionDb.listCollections({ name: 'admins' })
      .toArray()
      .then(collections => {
        if (collections.length === 0) {
          console.log('Warning: no admins collection in robolution database');
          // Check if we have admins in adminDB and sync them
          db.collection('admins').find({}).toArray()
            .then(admins => {
              if (admins && admins.length > 0) {
                console.log('Found admins in adminDB, copying to robolution database for redundancy');
                robolutionDb.createCollection('admins')
                  .then(() => robolutionDb.collection('admins').insertMany(admins))
                  .then(() => console.log('Admin accounts synced to robolution database'))
                  .catch(err => console.error('Error syncing admin accounts:', err));
              }
            })
            .catch(err => console.error('Error checking adminDB collection:', err));
        }
      })
      .catch(err => console.error('Error checking for admins collection:', err));
    
    // TEMPORARY: Clear sessions collection on startup to fix parsing errors
    if (robolutionDb) {
        console.log('Attempting to clear sessions collection to resolve format mismatch...');
        robolutionDb.collection('sessions').deleteMany({})
            .then(result => {
                console.log(`Sessions collection cleared successfully. Deleted ${result.deletedCount} sessions.`);
            })
            .catch(err => {
                console.error('Error clearing sessions collection:', err);
            });
    }

    // Define Admin model after successful database connection
    const Admin = robolutionDb.collection('admins');

    // Start the database backup system
    setupDatabaseBackups();
    
    console.log('==> Your service is live 🎉');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Function to calculate file hash
function calculateFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

// Function to find duplicate image
async function findDuplicateImage(filePath) {
  const uploadsDir = path.join(__dirname, 'public', 'uploads');
  const newFileHash = await calculateFileHash(filePath);
  
  const files = fs.readdirSync(uploadsDir);
  for (const file of files) {
    const existingFilePath = path.join(uploadsDir, file);
    if (existingFilePath !== filePath) { // Don't compare with self
      try {
        const existingHash = await calculateFileHash(existingFilePath);
        if (existingHash === newFileHash) {
          return '/uploads/' + file; // Return the path of duplicate file
        }
      } catch (err) {
        console.error('Error checking file:', file, err);
      }
    }
  }
  return null;
}

// Set up multer storage configuration for temporary file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'public', 'uploads', 'temp');
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Add file type validation
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image file.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Note: Poster video storage configuration has been removed as it's been replaced by the Year Videos feature

// Configure Multer for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'videos');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'year-video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const videoUpload = multer({
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    // Accept video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Not a video file! Please upload a video file.'), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  }
});

// Helper function to upload file to Cloudinary
async function uploadToCloudinary(filePath, folder = 'robolution') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto' // Auto-detect resource type (image/video)
    });
    console.log('Cloudinary upload result:', result);
    // Don't delete the temp file here, let the calling function handle it
    // to ensure we have the file if an error occurs after upload
    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));  // To serve static files
app.use(express.static(path.join(__dirname, '..', 'international', 'public')));  // Serve files from international public directory

// Redirect for Astro pages
const astroPages = ['/News', '/Trainings', '/Tournament', '/Awards', '/Nominations_Tab'];
app.get(astroPages, (req, res) => {
    // This will redirect, for example, /News to /international/News
    console.log(`Redirecting request for ${req.path} to /international${req.path}`);
    return res.redirect(`/international${req.path}`);
});

// Load express-ejs-layouts for Dubai site
const expressLayouts = require('express-ejs-layouts');

// Setup for Dubai site views
// Set up view layout options
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Load routers for international sites
const dubaiRoutes = require('./routes/dubai');
const countrySitesRoutes = require('./routes/country-sites');
const internationalSitesRoutes = require('./routes/international-sites');
const CountrySite = require('./models/CountrySite');

// Middleware to check if a country site is active
const checkCountrySiteActive = async (req, res, next) => {
  try {
    const slug = req.originalUrl.split('/')[1]; // Get the first part of the path (e.g., 'dubai')
    
    if (slug === 'dubai') {
      // Check if Dubai site is active
      const dubaiSite = await CountrySite.findOne({ slug: 'dubai' });
      
      if (!dubaiSite || !dubaiSite.active) {
        console.log(`[Dubai Route] Access denied - Dubai site is inactive or not found`);
        return res.status(404).render('error', { 
          message: 'The Dubai site is currently unavailable',
          error: { status: 404, stack: '' }
        });
      }
      
      console.log(`[Dubai Route] Access granted - Dubai site is active`);
    }
    
    next();
  } catch (error) {
    console.error('Error checking country site status:', error);
    next(); // Continue anyway to avoid breaking the application
  }
};

// Mount the Dubai routes at /dubai, but check if active first
app.use('/dubai', checkCountrySiteActive, dubaiRoutes);

// Mount the country sites admin routes
app.use('/country-sites', countrySitesRoutes);

// Mount the international sites routes 
app.use('/country', internationalSitesRoutes);

// Configure proxy to Astro SSR server for country sites
// Configure proxy to Astro SSR server for country sites
const astroServerPath = path.join(__dirname, '../international/dist/server/entry.mjs');
if (fs.existsSync(astroServerPath)) {
  console.log('Initializing Astro SSR handler for country sites');
  
  // Convert to proper file:// URL for ESM imports (fix for Windows paths)
  const astroServerUrl = `file://${astroServerPath.replace(/\\/g, '/')}`;
  console.log(`Loading Astro SSR from: ${astroServerUrl}`);
  
  // Dynamically import the Astro SSR handler
  import(astroServerUrl).then(astroSSR => {
    // Load our custom middleware that prepares the request for Astro
    const createAstroMiddleware = require('./middleware/astro-middleware');
    
    // Mount the middleware chain for country sites
    app.use('/country/:slug', ...createAstroMiddleware(astroSSR));
    
    console.log('Astro SSR handler initialized and mounted on /country/:slug');
  }).catch(err => {
    console.error('Failed to initialize Astro SSR handler:', err);
  });
} else {
  console.warn('Astro SSR entry point not found at:', astroServerPath);
}

// Add direct access to country sites by slug (e.g., /singapore/)
app.use('/:countrySlug', async (req, res, next) => {
  const slug = req.params.countrySlug;
  
  // Skip this middleware for known routes and static files
  if (slug === 'images' || 
      slug === 'public' || 
      slug === 'admin' || 
      slug === 'api' ||
      slug === 'login' ||
      slug === 'home' ||
      slug === 'videos' ||
      slug === 'dubai' ||
      slug === 'password-reset' ||
      slug === 'favicon.ico' ||
      slug === 'robots.txt' ||
      slug.startsWith('_') ||
      slug.includes('.')) {
    return next();
  }
  
  try {
    // Check if this is a valid country site
    const CountrySite = require('./models/CountrySite');
    const countrySite = await CountrySite.findOne({ slug, active: true });
    
    if (countrySite) {
      console.log(`[International Sites] GET /${slug}/ | Session Auth: ${!!req.session?.user}`);
      console.log(`[International Sites] Forwarding to Astro SSR for ${countrySite.name}`);
      
      // Store country site info in request object for the middleware to use
      req.countrySite = countrySite;
      
      // Pass request to the /country/:slug route for processing
      // Ensure we preserve pathname and query string correctly
      const originalUrl = req.url;
      const urlPath = req.path;
      const pathSuffix = urlPath.length > slug.length + 1 ? 
                        urlPath.substring(slug.length + 1) : 
                        ''; // Handle both /singapore and /singapore/
      
      console.log(`Rewriting URL from /${slug}${pathSuffix} to /country/${slug}${pathSuffix}`);
      
      // Rewrite URL keeping all query parameters intact
      req.originalUrl = req.originalUrl.replace(new RegExp(`^/${slug}`), `/country/${slug}`);
      req.url = `/country/${slug}${pathSuffix}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
      req.baseUrl = '/country';
      req.path = `/${slug}${pathSuffix}`;
      
      // Force router to handle this as a new request
      app._router.handle(req, res, next);
      return;
    }
    
    // Not a country site, continue
    next();
  } catch (error) {
    console.error(`Error checking country slug ${slug}:`, error);
    next();
  }
});

// Directly serve the international src/assets folder with highest priority - direct access
app.use('/src/assets', express.static(path.join(__dirname, '../international/src/assets'), {
  setHeaders: (res, path) => {
    res.setHeader('X-Asset-Source', 'Direct assets');
  }
}));

// Serve the same assets through the /dubai prefix for relative paths
app.use('/dubai/src/assets', express.static(path.join(__dirname, '../international/src/assets'), {
  setHeaders: (res, path) => {
    res.setHeader('X-Asset-Source', 'International assets');
  }
}));

// Serve static files for the Dubai site at /dubai
app.use('/dubai', express.static(path.join(__dirname, 'public/international')));

// Serve international public folder
app.use('/dubai/public', express.static(path.join(__dirname, '..', 'international', 'public'), {
  setHeaders: (res, path) => {
    res.setHeader('X-Asset-Source', 'International public assets');
  }
}));

// Serve international src folder directly for proper image loading
app.use('/dubai/src', express.static(path.join(__dirname, '..', 'international', 'src'), {
  setHeaders: (res, path) => {
    res.setHeader('X-Asset-Source', 'International src assets');
  }
}));

// Serve video files
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

app.use(express.json());

// Routes
const passwordResetRoutes = require('./routes/password-reset');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');
const tourGalleryAdminRoutes = require('./routes/admin/tour-gallery');

app.use('/password-reset', passwordResetRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use('/admin', tourGalleryAdminRoutes); // Mount tour gallery admin routes

// New endpoint to set the selected country in the session
app.post('/api/set-country/:slug', (req, res) => {
  const { slug } = req.params;
  if (slug) {
    // Ensure session exists
    if (!req.session) {
      console.error('[Session] No session available for setting country');
      return res.status(500).json({ success: false, message: 'No session available' });
    }
    
    // Set the selected country in the session
    req.session.selectedCountry = slug;
    console.log(`[Session] Selected country set to: ${slug}`);
    console.log(`[Session Debug] Session before save:`, {
      id: req.sessionID,
      selectedCountry: req.session.selectedCountry
    });
    
    // Force save the session
    req.session.save(err => {
      if (err) {
        console.error('[Session] Error saving session:', err);
        return res.status(500).json({ success: false, message: 'Error saving session' });
      }
      
      console.log(`[Session] Session saved successfully with country: ${slug}`);
      return res.json({ success: true, message: `Country set to ${slug}` });
    });
  } else {
    res.status(400).json({ success: false, message: 'No country slug provided' });
  }
});

// API endpoint to switch country templates
app.get('/api/switch-country/:country', async (req, res) => {
  try {
    const country = req.params.country;
      
    // Update the session with the selected country
    if (req.session) {
      req.session.selectedCountry = country;
      await new Promise((resolve, reject) => {
        req.session.save(err => {
          if (err) {
            console.error(`[API] Error saving country selection to session:`, err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
    
    // Get the template details
    const testDb = mongoose.connection.useDb('test');
    const Templates = testDb.collection('templates');
    const template = await Templates.findOne({ Name: country });

    if (template) {
      console.log(`[API] Switched country to: ${country}`);
      return res.json({ 
        success: true, 
        message: `Switched to ${country}`,
        country: {
          name: template.Name === 'default' ? 'Dubai' : template.Name,
          slug: template.Name
        }
      });
    } else {
      console.error(`[API] Country template not found: ${country}`);
      return res.status(404).json({ 
        success: false, 
        message: `Country template "${country}" not found` 
      });
    }
  } catch (error) {
    console.error(`[API] Error switching country:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while switching countries'
    });
  }
});

// API endpoint to list available country templates
app.get('/api/countries', async (req, res) => {
  try {
    const testDb = mongoose.connection.useDb('test');
    const Templates = testDb.collection('templates');
    const templates = await Templates.find({}).toArray();
    
    const countries = templates.map(template => ({
        name: template.Name === 'default' ? 'Dubai' : template.Name,
        slug: template.Name,
      flagUrl: template.config?.Contents?.Flag?.image || null
    }));
    
    return res.json({ 
      success: true,
      countries,
      current: req.session?.selectedCountry || 'default'
    });
  } catch (error) {
    console.error(`[API] Error listing countries:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while retrieving country list'
    });
  }
});

// New route for /international
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/international', async (req, res, next) => {
  try {
    // Get country template data using our utility function
    const countryData = await getCountryTemplate(req);
    
    // Log the result for debugging
    if (countryData) {
      console.log(`[International] Using template: ${countryData.name}`);
    } else {
      console.log(`[International] No template found, using defaults`);
    }

    // In production, we use the built Astro app or fallback
    if (process.env.NODE_ENV === 'production' || process.env.RENDER === 'true') {
      console.log('[International] Production mode detected, using SSR handler');
      
      if (internationalHandler) {
        // Use the internationalHandler directly with the original request
        // Preserve the country data for the template system
        if (countryData) {
          // Ensure we're using the correct country data from session
          console.log(`[International] Setting X-Country-Site header with data:`, countryData);
          req.headers['X-Country-Site'] = JSON.stringify(countryData);
        } else {
          console.warn('[International] No country data available for template');
          req.headers['X-Country-Site'] = '';
        }
        
        // Strip /international prefix from URL but keep remaining path
        const originalUrl = req.originalUrl;
        req.url = originalUrl.replace(/^\/international/, '');
        if (req.url === '') req.url = '/';
        
        console.log(`[International] Processing with SSR handler: ${req.url}`);
        
        return internationalHandler(req, res, next);
      } else {
        // If handler not available, serve static files
        console.log('[International] SSR handler not available, serving static files');
        
        // Check if we can serve from the static files
        const staticPath = path.join(__dirname, 'public/international', req.path);
        if (fs.existsSync(staticPath) && !fs.statSync(staticPath).isDirectory()) {
          return res.sendFile(staticPath);
        }
        
        // If no static file, serve the index.html with the country data
        const indexPath = path.join(__dirname, 'public/international/index.html');
        if (fs.existsSync(indexPath)) {
          return res.sendFile(indexPath);
        }
        
        // Last resort fallback
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>International Site</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; text-align: center; }
                h1 { color: #00008b; }
                .message { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                .links { margin-top: 30px; }
                .links a { display: inline-block; margin: 0 10px; color: #00008b; text-decoration: none; }
                .links a:hover { text-decoration: underline; }
              </style>
            </head>
            <body>
              <h1>International Site</h1>
              <div class="message">
                <p>This part of the site is currently being updated.</p>
                <p>${countryData ? `You selected: ${countryData.name}` : 'No country selected'}</p>
              </div>
              <div class="links">
                <a href="/">Return to Main Site</a>
              </div>
            </body>
          </html>
        `);
    }
    }
    
    // Development mode - use proxy to local Astro dev server
    const proxy = createProxyMiddleware({
      target: 'http://localhost:4321', // Astro dev server
      changeOrigin: true,
      ws: true,
      onProxyReq: (proxyReq, req, res) => {
        // This is now synchronous and safe
        if (countryData) {
          proxyReq.setHeader('X-Country-Site', JSON.stringify(countryData));
        }
      },
      pathRewrite: (path, req) => {
        const finalPath = path.replace(/^\/international/, '/');
        return finalPath || '/';
      },
      logLevel: 'debug'
    });

    // Execute the proxy with the prepared data
    proxy(req, res, next);
  } catch (error) {
    console.error('[International] Critical error in proxy middleware:', error);
    next(error); // Pass error to Express's default error handler
  }
});


// Direct routes for password reset (fallbacks)
app.get('/password-reset/reset/:token', async (req, res) => {
  const User = require('./models/User');
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.render('reset-password-error', {
        message: 'Password reset link is invalid or has expired'
      });
    }
    
    res.render('reset-password', {
      token,
      user: { email: user.email }
    });
  } catch (error) {
    console.error('Reset password page error:', error);
    res.status(500).send('An error occurred while processing your request');
  }
});

// Protected route middleware // THIS IS THE ORIGINAL LOCATION OF requireAdmin
// const requireAdmin = (req, res, next) => { ... }; // This block is now removed

app.use('/images', express.static('public/images', {
  setHeaders: (res, path) => {
    if (path.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    }
  }
}));

// Configure view engine
app.set('view engine', 'ejs');
// Set up multiple view paths - add userViews folder
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views/UserViews')
]);

// Middleware to make unique regions available to all templates
app.use(async (req, res, next) => {
  try {
    // Only fetch unique regions once every few minutes to avoid excessive DB queries
    const currentTime = Date.now();
    if (!app.locals.uniqueRegionsLastFetched || currentTime - app.locals.uniqueRegionsLastFetched > 5 * 60 * 1000) {
      const allPosts = await Post.find();
      app.locals.uniqueRegions = [...new Set(allPosts.map(post => post.region).filter(region => region && region !== 'All'))].sort();
      app.locals.uniqueRegionsLastFetched = currentTime;
    }
    
    // Make uniqueRegions available to all templates
    res.locals.uniqueRegions = app.locals.uniqueRegions || [];
    next();
  } catch (error) {
    console.error('Error fetching unique regions:', error);
    res.locals.uniqueRegions = [];
    next();
  }
});

// Update create post route with middleware
app.get('/create-post', requireAdmin, async (req, res) => {
    try {
        const isDashboard = req.query.dashboard === 'true';
        // Get unique regions for the dropdown
        const allPosts = await Post.find();
        const uniqueRegions = [...new Set(allPosts.map(post => post.region).filter(region => region && region !== 'All'))].sort();
        
        console.log("Create Post Route Hit - User:", req.session.user);
        res.render('create-post', { 
            uniqueRegions,
            user: req.session.user,
            dashboard: isDashboard // Pass dashboard status
        });
    } catch (error) {
        console.error('Error loading create post page:', error);
        res.status(500).send('Error loading create post page');
    }
});

app.get('/login', (req, res) => {
  console.log("login Route Hit");  // Check if route is being hit
  res.render('UserViews/login');
});

// Password reset routes
app.get('/password-reset', (req, res) => {
  console.log("Password Reset Route Hit");
  res.render('password-reset');
});

// Reset password form using token route
app.get('/reset-password/:token', (req, res) => {
  res.redirect(`/password-reset/reset/${req.params.token}`);
});

app.get('/home', async (req, res) => {
  try {
    console.log('Accessing user landing page');
    
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    
    // Fetch all posts, partners, and tour gallery items in parallel
    const [posts, partners, tourGalleryItems, yearVideos] = await Promise.all([
      Post.find().sort({ createdAt: sortDirection }).lean(),
      Partner.find().lean(),
      TourGallery.find().select('region').lean(),
      YearVideo.find({ active: true }).lean()
    ]);

    // Combine regions from both posts and tour gallery
    const postRegions = posts.map(p => p.region);
    const galleryRegions = tourGalleryItems.map(item => item.region);
    const allRegions = [...postRegions, ...galleryRegions];

    // Create a unique, sorted list of regions, filtering out 'All' and any falsy values
    const uniqueRegions = [...new Set(allRegions)]
      .filter(region => region && region !== 'All')
      .sort();
    
    console.log(`Found ${posts.length} posts for user landing`);
    console.log(`Found ${partners.length} partners for carousel`);
    console.log(`Found ${yearVideos.length} year videos`);
    console.log(`Combined unique regions for nav:`, uniqueRegions);
    
    // Get the default video (used when no specific year is selected)
    const defaultVideo = '/images/Robolution2025.mp4'; // Default fallback video
    
    res.render('UserViews/home', { 
      posts, 
      sort: req.query.sort || 'desc',
      user: req.session.user,
      partners,
      selectedYear: 'all',
      yearVideos,
      currentVideo: defaultVideo,
      uniqueRegions // Pass the new combined list to the view
    });
  } catch (error) {
    console.error('Error in home route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for year-specific news
app.get('/home/year/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    console.log(`Accessing user landing page for year: ${year}`);
    
    if (isNaN(year)) {
      return res.redirect('/home');
    }
    
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    
    // DIRECT COLLECTION ACCESS
    const postsCollection = robolutionDb.collection('posts');
    
    // Create date range for the specified year
    const startDate = new Date(year, 0, 1); // January 1st of the year
    const endDate = new Date(year + 1, 0, 1); // January 1st of the next year
    
    console.log(`Searching for posts between ${startDate.toISOString()} and ${endDate.toISOString()}`);
    
    // Fetch posts for the specified year - handle different date formats
    // MongoDB might store dates in different formats depending on how they were inserted
    const query = {
      $or: [
        // Standard Date object format
        {
          createdAt: {
            $gte: startDate,
            $lt: endDate
          }
        },
        // String format (ISO string comparison)
        {
          createdAt: {
            $gte: startDate.toISOString(),
            $lt: endDate.toISOString()
          }
        },
        // MongoDB extended JSON format
        {
          'createdAt.$date': {
            $gte: startDate.getTime(),
            $lt: endDate.getTime()
          }
        },
        // String format with year in it (fallback)
        {
          createdAt: new RegExp(`${year}-`)
        }
      ]
    };
    
    console.log('Query:', JSON.stringify(query));
    
    // Fetch posts for the specified year
    let posts = await postsCollection.find(query).sort({ createdAt: sortDirection }).toArray();
    
    console.log(`Found ${posts.length} posts for year ${year}`);
    
    // Convert MongoDB documents to JavaScript objects
    posts = JSON.parse(JSON.stringify(posts));
    
    // Fetch all posts for dropdowns, partners, and tour gallery items in parallel
    const [allPosts, partners, tourGalleryItems, yearVideos] = await Promise.all([
      postsCollection.find().toArray(),
      Partner.find().lean(),
      TourGallery.find().select('region').lean(),
      YearVideo.find({ active: true }).lean()
    ]);
    
    // Combine regions from both all posts and tour gallery
    const postRegions = allPosts.map(p => p.region);
    const galleryRegions = tourGalleryItems.map(item => item.region);
    const allCombinedRegions = [...postRegions, ...galleryRegions];

    // Create a unique, sorted list of regions
    const uniqueRegions = [...new Set(allCombinedRegions)]
      .filter(region => region && region !== 'All')
      .sort();
    
    // Convert MongoDB documents to JavaScript objects
    const allPostsParsed = JSON.parse(JSON.stringify(allPosts));
    
    // Find the video for the selected year
    const yearVideo = yearVideos.find(video => video.year === year);
    
    // Default video if no specific video for this year
    const defaultVideo = '/images/Robolution2025.mp4';
    const currentVideo = yearVideo ? yearVideo.videoUrl : defaultVideo;
    
    res.render('UserViews/home', { 
      posts, 
      allPosts: allPostsParsed, // Pass all posts to generate the years dropdown
      sort: req.query.sort || 'desc',
      user: req.session.user,
      partners,
      selectedYear: year,
      yearVideos,
      currentVideo,
      uniqueRegions // Pass the new combined list to the view
    });
  } catch (error) {
    console.error('Error in home route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to show all posts - changed to redirect to user landing
app.get('/', async (req, res) => {
  res.redirect('/home');
});

// Routes for managing year videos
app.get('/admin/year-videos', requireAdmin, async (req, res) => {
  try {
    // Get years with posts
    const postsCollection = robolutionDb.collection('posts');
    const posts = await postsCollection.find().toArray();
    
    // Extract years from post dates
    const years = posts.map(post => {
      if (post.createdAt) {
        let date;
        if (typeof post.createdAt === 'string') {
          date = new Date(post.createdAt);
        } else {
          date = post.createdAt;
        }
        
        if (isNaN(date.getTime())) {
          return null;
        }
        
        return date.getFullYear();
      }
      return null;
    }).filter(year => year !== null);
    
    // Get unique years and sort them
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    
    const yearVideos = await YearVideo.find().sort({ year: -1 });
    
    res.render('admin-year-videos', { 
      yearVideos,
      user: req.session.user,
      dashboard: req.query.dashboard === 'true',
      uniqueYears
    });
  } catch (error) {
    console.error('Error fetching year videos:', error);
    req.flash('error', 'Error fetching year videos');
    res.redirect('/admin-dashboard');
  }
});

// Add new year video
app.post('/admin/year-videos/add', requireAdmin, videoUpload.single('video'), async (req, res) => {
  try {
    const { year, title } = req.body;
    let videoUrl = '';
    
    if (req.file) {
      // Generate URL for local video file
      videoUrl = `/videos/${req.file.filename}`;
      console.log(`Video saved locally at: ${req.file.path}`);
      console.log(`Video URL set to: ${videoUrl}`);
    } else if (req.body.videoUrl) {
      // If a URL was provided directly
      videoUrl = req.body.videoUrl;
    } else {
      throw new Error('No video file or URL provided');
    }
    
    // Create the year video record
    await YearVideo.create({
      year: parseInt(year),
      title,
      videoUrl,
      active: true
    });
    
    req.flash('success', `Video for year ${year} added successfully`);
    res.redirect('/admin/year-videos');
  } catch (error) {
    console.error('Error adding year video:', error);
    req.flash('error', `Error adding year video: ${error.message}`);
    res.redirect('/admin/year-videos');
  }
});

// Update year video
app.post('/admin/year-videos/update/:id', requireAdmin, videoUpload.single('video'), async (req, res) => {
  try {
    const { id } = req.params;
    const { year, title, active } = req.body;
    
    const yearVideo = await YearVideo.findById(id);
    if (!yearVideo) {
      throw new Error('Year video not found');
    }
    
    yearVideo.year = parseInt(year);
    yearVideo.title = title;
    yearVideo.active = active === 'on';
    
    if (req.file) {
      // Save old URL to potentially delete the file
      const oldVideoUrl = yearVideo.videoUrl;
      
      // Generate URL for local video file
      yearVideo.videoUrl = `/videos/${req.file.filename}`;
      console.log(`Video saved locally at: ${req.file.path}`);
      console.log(`Video URL set to: ${yearVideo.videoUrl}`);
      
      // Delete old video file if it was a local file
      if (oldVideoUrl && oldVideoUrl.startsWith('/videos/')) {
        // Extract filename from URL (format is /videos/filename.mp4)
        const filename = oldVideoUrl.split('/').pop();
        const filePath = path.join(__dirname, 'public', 'videos', filename);
        
        console.log(`Attempting to delete old video file: ${filePath}`);
        
        // Check if file exists and delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted old video file: ${filePath}`);
        } else {
          console.log(`Old video file not found: ${filePath}`);
        }
      }
    } else if (req.body.videoUrl) {
      // If a URL was provided directly
      yearVideo.videoUrl = req.body.videoUrl;
    }
    
    await yearVideo.save();
    
    req.flash('success', `Video for year ${year} updated successfully`);
    res.redirect('/admin/year-videos');
  } catch (error) {
    console.error('Error updating year video:', error);
    req.flash('error', `Error updating year video: ${error.message}`);
    res.redirect('/admin/year-videos');
  }
});

// Delete year video
app.post('/admin/year-videos/delete/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the video before deleting to get the URL
    const yearVideo = await YearVideo.findById(id);
    if (!yearVideo) {
      throw new Error('Year video not found');
    }
    
    // Check if it's a local video file
    if (yearVideo.videoUrl && yearVideo.videoUrl.startsWith('/videos/')) {
      // Extract filename from URL (format is /videos/filename.mp4)
      const filename = yearVideo.videoUrl.split('/').pop();
      const filePath = path.join(__dirname, 'public', 'videos', filename);
      
      console.log(`Attempting to delete video file: ${filePath}`);
      
      // Check if file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted video file: ${filePath}`);
      } else {
        console.log(`Video file not found: ${filePath}`);
      }
    } else {
      console.log(`Video URL is not a local file: ${yearVideo.videoUrl}`);
    }
    
    // Delete from database
    await YearVideo.findByIdAndDelete(id);
    
    req.flash('success', 'Year video deleted successfully');
    res.redirect('/admin/year-videos');
  } catch (error) {
    console.error('Error deleting year video:', error);
    req.flash('error', `Error deleting year video: ${error.message}`);
    res.redirect('/admin/year-videos');
  }
});

// Debug route to check post dates
app.get('/debug/post-dates', async (req, res) => {
  try {
    // DIRECT COLLECTION ACCESS
    const postsCollection = robolutionDb.collection('posts');
    
    // Fetch all posts using native MongoDB
    let posts = await postsCollection.find().toArray();
    
    // Extract and format date information
    const dateInfo = posts.map(post => {
      const createdAt = post.createdAt;
      const createdAtType = typeof createdAt;
      
      let dateObj, year, month, day;
      let isValidDate = false;
      
      try {
        if (createdAt instanceof Date) {
          dateObj = createdAt;
          isValidDate = !isNaN(dateObj.getTime());
        } else if (typeof createdAt === 'string') {
          dateObj = new Date(createdAt);
          isValidDate = !isNaN(dateObj.getTime());
        } else if (createdAt && typeof createdAt === 'object' && createdAt.$date) {
          // MongoDB extended JSON format
          dateObj = new Date(createdAt.$date);
          isValidDate = !isNaN(dateObj.getTime());
        }
        
        if (isValidDate) {
          year = dateObj.getFullYear();
          month = dateObj.getMonth() + 1;
          day = dateObj.getDate();
        }
      } catch (e) {
        console.error('Error parsing date:', e);
      }
      
      return {
        id: post._id.toString(),
        title: post.title,
        createdAtRaw: createdAt,
        createdAtType,
        isValidDate,
        year,
        month,
        day,
        dateString: isValidDate ? dateObj.toISOString() : 'Invalid Date'
      };
    });
    
    // Group by year
    const postsByYear = {};
    dateInfo.forEach(post => {
      if (post.isValidDate) {
        if (!postsByYear[post.year]) {
          postsByYear[post.year] = [];
        }
        postsByYear[post.year].push(post);
      }
    });
    
    // Count posts by year
    const yearCounts = Object.keys(postsByYear).map(year => ({
      year,
      count: postsByYear[year].length
    })).sort((a, b) => b.year - a.year);
    
    res.json({
      totalPosts: posts.length,
      postsWithValidDates: dateInfo.filter(p => p.isValidDate).length,
      yearCounts,
      postsByYear,
      allPostDates: dateInfo
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin index page with direct MongoDB access
app.get('/index', requireAdmin, async (req, res) => { // Added requireAdmin here
  try {
    const isDashboard = req.query.dashboard === 'true';
    console.log('Accessing admin index page');
    
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    
    // DIRECT COLLECTION ACCESS
    const postsCollection = robolutionDb.collection('posts');
    
    // Fetch all posts using native MongoDB
    let posts = await postsCollection.find().sort({ createdAt: sortDirection }).toArray();
    console.log(`Found ${posts.length} posts for admin index`);
    
    // Convert MongoDB documents to JavaScript objects
    posts = JSON.parse(JSON.stringify(posts));
    
    res.render('index', { 
        posts, 
        sort: req.query.sort || 'desc',
        user: req.session.user, // Pass user session
        uniqueRegions: res.locals.uniqueRegions, // Pass uniqueRegions
        dashboard: isDashboard // Pass dashboard status
    });
  } catch (error) {
    console.error('Error fetching posts for admin index:', error);
    res.status(500).send('An error occurred while fetching posts');
  }
});

// Update post creation route with middleware
app.post('/posts', requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, date, useCurrentDate, region } = req.body;
        let imageUrl = '';

        if (req.file) {
            try {
                const filePath = req.file.path;
                console.log('Uploading file:', filePath);
                const uploadResult = await uploadToCloudinary(filePath, 'robolution/posts');
                imageUrl = uploadResult.secure_url;
                console.log('Cloudinary upload successful:', uploadResult);
                
                // Clean up temp file after successful upload
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (uploadError) {
                console.error('Error uploading to Cloudinary:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error uploading image' 
                });
            }
        }

        let createdAt;
        if (useCurrentDate === "on" || !date) {
            createdAt = new Date();
        } else {
            createdAt = new Date(date);
        }

        const post = await Post.create({ 
            title, 
            content, 
            imageUrl, 
            author, 
            region: region || 'All',
            createdAt 
        });

        console.log('Post created successfully:', post);
        // Check if the request is coming from the dashboard iframe
        const isDashboard = req.query.dashboard === 'true' || (req.get('Referer') && req.get('Referer').includes('dashboard=true'));
        req.flash('success', 'Post created successfully!');
        if (isDashboard) {
            res.redirect('/create-post?dashboard=true');
        } else {
            res.redirect('/index'); // Fallback for non-dashboard context
        }
    } catch (error) {
        console.error('Error creating post:', error);
        const isDashboard = req.query.dashboard === 'true' || (req.get('Referer') && req.get('Referer').includes('dashboard=true'));
        req.flash('error', 'Error creating post: ' + error.message);
        if (isDashboard) {
            res.redirect('/create-post?dashboard=true');
        } else {
            // For non-dashboard, you might want to render the page again with the error
            // or redirect to a generic error page, or back to create-post without dashboard context
            res.status(500).send('Error creating post: ' + error.message); 
        }
    }
});

// Route to show all categories with direct MongoDB access
app.get('/categories', async (req, res) => {
  try {
    console.log('Accessing categories page');
    
    // DIRECT COLLECTION ACCESS
    const categoriesCollection = robolutionDb.collection('categories');
    
    // Fetch all categories using native MongoDB
    let categories = await categoriesCollection.find().toArray();
    console.log(`Found ${categories.length} categories`);
    
    // Convert MongoDB documents to JavaScript objects
    categories = JSON.parse(JSON.stringify(categories));
    
    res.render('categories', { categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('An error occurred while fetching categories');
  }
});

app.get('/user-categories', async (req, res) => {
  try {
    console.log('Accessing user categories page');
    
    // DIRECT COLLECTION ACCESS
    const categoriesCollection = robolutionDb.collection('categories');
    
    // Fetch all categories using native MongoDB
    let categories = await categoriesCollection.find().toArray();
    console.log(`Found ${categories.length} categories`);
    
    // Convert MongoDB documents to JavaScript objects
    categories = JSON.parse(JSON.stringify(categories));
    
    // Fetch all posts to generate the years dropdown
    const postsCollection = robolutionDb.collection('posts');
    let allPosts = await postsCollection.find().toArray();
    allPosts = JSON.parse(JSON.stringify(allPosts));
    
    res.render('UserViews/user-categories', { categories, allPosts });
  } catch (error) {
    console.error('Error fetching user categories:', error);
    res.status(500).send('An error occurred while fetching categories');
  }
});


// Route to show details for a specific category
app.get('/categories/:id', async (req, res) => {
  try {
    let category;
    
    try {
      // Try standard mongoose findById
      category = await Category.findById(req.params.id);
      
      // If not found and ID seems valid
      if (!category && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Try with new ObjectId
        const ObjectId = mongoose.Types.ObjectId;
        const categoryId = new ObjectId(req.params.id);
        category = await Category.findOne({ _id: categoryId });
      }
      
      // Try as string ID if still not found
      if (!category) {
        category = await Category.findOne({ _id: req.params.id });
      }
    } catch (idError) {
      console.error('Error converting category ID:', idError);
      // Continue to check if category was found
    }
    
    if (category) {
      res.render('category-details', { event: category });
    } else {
      console.error('Event not found with ID:', req.params.id);
      res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error('Error fetching category details:', error);
    res.status(500).send('An error occurred while fetching the category details');
  }
});

// Render manage categories page
app.get('/manage-categories', requireAdmin, async (req, res) => {
  try {
    const isDashboard = req.query.dashboard === 'true';
    const [categories, posts] = await Promise.all([
      Category.find(),
      Post.find()
    ]);

    // Get unique regions from posts
    const uniqueRegions = [...new Set(posts
      .map(post => post.region)
      .filter(region => region && region !== 'All')
    )].sort();

    res.render('manage-categories', { 
      categories,
      uniqueRegions
    });
  } catch (error) {
    console.error('Error loading manage categories:', error);
    res.status(500).send('Error loading manage categories');
  }
});

// Add new category with image upload
app.post('/manage-categories/add', upload.single('image'), async (req, res) => {
  try {
    const {
      title, description,
      mechanics, generalConduct, generalRules, participantsRequirement, teamRequirement,
      showMechanics, showGeneralConduct, showGeneralRules, showParticipantsRequirement, showTeamRequirement
    } = req.body;

    let imageUrl = '';
    
    if (req.file) {
      const filePath = path.join(__dirname, 'public', 'uploads', 'temp', req.file.filename);
      imageUrl = await uploadToCloudinary(filePath, 'robolution/categories');
    }

    await Category.create({
      title,
      description,
      imageUrl,
      mechanics: showMechanics ? (mechanics ? mechanics.split('\n').map(m => m.trim()).filter(Boolean) : []) : [],
      generalConduct: showGeneralConduct ? (generalConduct ? generalConduct.split('\n').map(m => m.trim()).filter(Boolean) : []) : [],
      generalRules: showGeneralRules ? (generalRules ? generalRules.split('\n').map(m => m.trim()).filter(Boolean) : []) : [],
      participantsRequirement: showParticipantsRequirement ? (participantsRequirement ? participantsRequirement.split('\n').map(m => m.trim()).filter(Boolean) : []) : [],
      teamRequirement: showTeamRequirement ? (teamRequirement ? teamRequirement.split('\n').map(m => m.trim()).filter(Boolean) : []) : [],
      showMechanics: showMechanics === 'on',
      showGeneralConduct: showGeneralConduct === 'on',
      showGeneralRules: showGeneralRules === 'on',
      showParticipantsRequirement: showParticipantsRequirement === 'on',
      showTeamRequirement: showTeamRequirement === 'on'
    });
    res.redirect('/manage-categories');
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).send('Error adding category');
  }
});

// Edit category with image upload
app.post('/manage-categories/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const {
      title, description, currentImageUrl,
      mechanics, generalConduct, generalRules, participantsRequirement, teamRequirement,
      showMechanics, showGeneralConduct, showGeneralRules, showParticipantsRequirement, showTeamRequirement
    } = req.body;

    let imageUrl = currentImageUrl;

    if (req.file) {
      const filePath = path.join(__dirname, 'public', 'uploads', 'temp', req.file.filename);
      imageUrl = await uploadToCloudinary(filePath, 'robolution/categories');
    }

    const update = {
      title,
      description,
      imageUrl,
      mechanics: showMechanics ? (mechanics ? mechanics.split('\n').map(m => m.trim()).filter(Boolean) : []) : [],
      generalConduct: showGeneralConduct ? (generalConduct ? generalConduct.split('\n').map(m => m.trim()).filter(Boolean) : []) : [],
      generalRules: showGeneralRules ? (generalRules ? generalRules.split('\n').map(m => m.trim()).filter(Boolean) : []) : [],
      participantsRequirement: showParticipantsRequirement ? (participantsRequirement ? participantsRequirement.split('\n').map(m => m.trim()).filter(Boolean) : []) : [],
      teamRequirement: showTeamRequirement ? (teamRequirement ? teamRequirement.split('\n').map(m => m.trim()).filter(Boolean) : []) : [],
      showMechanics: showMechanics === 'on',
      showGeneralConduct: showGeneralConduct === 'on',
      showGeneralRules: showGeneralRules === 'on',
      showParticipantsRequirement: showParticipantsRequirement === 'on',
      showTeamRequirement: showTeamRequirement === 'on'
    };

    await Category.findByIdAndUpdate(req.params.id, update);
    res.redirect('/manage-categories');
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).send('Error updating category');
  }
});

// Delete category and its image
app.post('/manage-categories/delete/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category && category.imageUrl) {
      const filePath = path.join(__dirname, 'public', category.imageUrl);
      // Check if any other category is using this image
      const otherCategories = await Category.find({
        _id: { $ne: req.params.id },
        imageUrl: category.imageUrl
      });
      
      if (otherCategories.length === 0 && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/manage-categories');
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).send('Error deleting category');
  }
});

// Delete image from category
app.post('/manage-categories/:id/delete-image', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { imageUrl } = req.body;

    console.log('Attempting to delete image:', { categoryId, imageUrl });

    if (!categoryId || !imageUrl) {
      console.log('Missing required fields:', { categoryId, imageUrl });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      console.log('Category not found:', categoryId);
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }

    // Verify the image belongs to this category
    if (category.imageUrl !== imageUrl) {
      console.log('Image URL mismatch:', { 
        categoryImage: category.imageUrl, 
        requestedImage: imageUrl 
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Image does not belong to this category' 
      });
    }

    // Check if other categories are using this image
    const otherCategories = await Category.find({
      _id: { $ne: categoryId },
      imageUrl: imageUrl
    });

    // If no other category is using this image, delete from Cloudinary
    if (otherCategories.length === 0) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split('/');
        const publicId = 'robolution/categories/' + urlParts[urlParts.length - 1].split('.')[0];
        
        console.log('Attempting to delete from Cloudinary with public_id:', publicId);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary deletion result:', result);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with category update even if Cloudinary deletion fails
      }
    } else {
      console.log('Image is used by other categories, keeping file');
    }

    // Update the category to remove the image reference
    await Category.findByIdAndUpdate(categoryId, { 
      $set: { imageUrl: '' } 
    });

    console.log('Category updated successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error in delete-image route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete image: ' + error.message 
    });
  }
});

// Route to show edit post page
app.get('/edit-post/:id', requireAdmin, async (req, res) => {
  // Check if user is logged in and is an admin
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/login');
  }

  try {
    console.log('DEBUG: Accessing post for editing, ID:', req.params.id);
    
    // DIRECT COLLECTION ACCESS - bypass Mongoose completely
    const postsCollection = robolutionDb.collection('posts');
    const commentsCollection = robolutionDb.collection('comments');
    const usersCollection = robolutionDb.collection('users');
    const ObjectId = require('mongodb').ObjectId;
    
    // Get all posts for regions dropdown using native MongoDB
    const posts = await postsCollection.find().toArray();

    // Try multiple query approaches to find the specific post
    let post = null;
    
    // 1. Try direct string ID lookup
    post = await postsCollection.findOne({ _id: req.params.id });
    console.log('DEBUG: Direct string ID lookup result:', post ? 'Found' : 'Not found');
    
    // 2. Try ObjectID lookup if available
    if (!post && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        post = await postsCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log('DEBUG: ObjectId lookup result:', post ? 'Found' : 'Not found');
      } catch (err) {
        console.error('DEBUG: Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try by title if still not found
    if (!post) {
      // Search by title as a last resort
      post = await postsCollection.findOne({ title: { $regex: new RegExp(req.params.id, 'i') } });
      console.log('DEBUG: Title search result:', post ? 'Found' : 'Not found');
    }

    if (!post) {
      console.error('DEBUG: Post not found with ID:', req.params.id);
      return res.status(404).send('Post not found');
    }

    console.log('DEBUG: Post found. Checking for comments...');
    
    // Log post structure to debug
    console.log('DEBUG: Post object structure:', Object.keys(post));
    console.log('DEBUG: Post comments field exists:', post.hasOwnProperty('comments'));
    
    // Check if comments exist and log their structure
    let finalComments = [];
    if (post.comments) {
      console.log('DEBUG: Raw comments data:', post.comments);
      console.log('DEBUG: Comments type:', Array.isArray(post.comments) ? 'Array' : typeof post.comments);
      console.log('DEBUG: Comments count:', Array.isArray(post.comments) ? post.comments.length : 'Not an array');
      
      // IMPORTANT: Check if comments are already complete objects with needed fields
      if (Array.isArray(post.comments) && post.comments.length > 0) {
        // Check the first comment to see if it's already a complete object
        const firstComment = post.comments[0];
        if (typeof firstComment === 'object' && firstComment !== null && 
            (firstComment.text || firstComment.content) && firstComment._id) {
          
          console.log('DEBUG: Comments are already embedded objects with text/content fields');
          // Comments are already complete objects, use them directly
          finalComments = post.comments;
          
          // Ensure each comment has a standardized author field
          for (let i = 0; i < finalComments.length; i++) {
            let comment = finalComments[i];
            
            // If comment has a user object with username, use it
            if (comment.user && comment.user.username) {
              comment.author = { 
                username: comment.user.username,
                userId: comment.user._id ? comment.user._id.toString() : null
              };
            } 
            // If there's no user object but there's an author field
            else if (comment.author && comment.author.username) {
              // Keep existing author object
            }
            // Create a default anonymous author as fallback
            else {
              comment.author = { username: 'Anonymous' };
            }
          }
        } 
        // Comments are IDs that need to be looked up
        else {
          console.log('DEBUG: Comments appear to be IDs, will fetch from comments collection');
          
          // Convert all comment IDs to ObjectId if they're not already
          const commentIds = post.comments.map(id => {
            if (typeof id === 'string' && ObjectId.isValid(id)) {
              return new ObjectId(id);
            } else if (id instanceof ObjectId) {
              return id;
            } else if (id && id._id) {
              // Handle case where comment might already be a document with _id
              return id._id;
            }
            console.log('DEBUG: Invalid comment ID found:', id);
            return null;
          }).filter(id => id !== null);
          
          console.log('DEBUG: Processed comment IDs:', commentIds.length);

          if (commentIds.length > 0) {
            try {
              const fetchedComments = await commentsCollection.find({ _id: { $in: commentIds } }).sort({ createdAt: -1 }).toArray();
              console.log('DEBUG: Comments found from DB:', fetchedComments.length);
              
              // Populate user information for each comment
              for (let i = 0; i < fetchedComments.length; i++) {
                let comment = fetchedComments[i];
                let authorName = 'Anonymous'; // Default author name
                
                try {
                  // Try to get author from user field
                  if (comment.user) {
                    let userId = comment.user;
                    if (typeof userId === 'string' && ObjectId.isValid(userId)) {
                      userId = new ObjectId(userId);
                    }
                    
                    const userDoc = await usersCollection.findOne({ _id: userId });
                    if (userDoc && userDoc.username) {
                      authorName = userDoc.username;
                    }
                  } 
                  // Fallback to embedded author
                  else if (comment.author && comment.author.username) {
                    authorName = comment.author.username;
                  }
                } catch (err) {
                  console.error('DEBUG: Error processing comment author:', err);
                }
                
                // Standardize the author field for template rendering
                comment.author = { username: authorName };
              }
              
              finalComments = fetchedComments;
            } catch (err) {
              console.error('DEBUG: Error fetching comments:', err);
            }
          }
        }
      }
    }

    // Assign final comments to post.comments
    post.comments = finalComments;
    console.log('DEBUG: Final comments count:', post.comments.length);

    // Convert MongoDB document to a JavaScript object
    const postObject = JSON.parse(JSON.stringify(post));
    
    // Get unique regions from posts
    const uniqueRegions = [...new Set(posts
      .map(p => p.region)
      .filter(region => region && region !== 'All')
    )].sort();

    const isDashboard = req.query.dashboard === 'true'; // Capture dashboard status

    res.render('edit-post', { 
      post: postObject,
      uniqueRegions,
      user: req.session.user,
      dashboard: isDashboard // Pass dashboard status to the template
    });
  } catch (error) {
    console.error('DEBUG: Error finding post:', error);
    res.status(500).send('Server error');
  }
});

// Route to handle post update with direct MongoDB access
app.post('/edit-post/:id', requireAdmin, upload.single('image'), async (req, res) => {
  // Check if user is logged in and is an admin -- THIS CHECK WILL BE REMOVED
  // if (!req.session.user || !req.session.user.isAdmin) {
  //   return res.status(403).send('Unauthorized');
  // }
  
  try {
    console.log('Updating post with ID:', req.params.id);
    
    const { title, content, author, date, useCurrentDate, currentImageUrl, region } = req.body;
    
    let imageUrl = currentImageUrl;
    let createdAt;
    
    // Handle date
    if (useCurrentDate === "on" || !date) {
      createdAt = new Date();
    } else {
      createdAt = new Date(date);
    }
    
    // Handle image
    if (req.file) {
      const filePath = path.join(__dirname, 'public', 'uploads', 'temp', req.file.filename);
      imageUrl = await uploadToCloudinary(filePath, 'robolution/posts');
    }
    
    // Prepare the update data
    const updateData = { 
      title, 
      content, 
      author, 
      imageUrl,
      region: region || 'All',
      createdAt 
    };
    
    // DIRECT COLLECTION ACCESS
    const postsCollection = robolutionDb.collection('posts');
    
    // Find and update the post using multiple lookup approaches
    let updateResult = null;
    
    // 1. Try direct string ID update
    updateResult = await postsCollection.updateOne(
      { _id: req.params.id },
      { $set: updateData }
    );
    console.log('Direct string ID update result:', updateResult.matchedCount ? 'Found and updated' : 'Not found');
    
    // 2. Try ObjectID update if needed
    if (updateResult.matchedCount === 0 && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const ObjectId = require('mongodb').ObjectId;
        updateResult = await postsCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: updateData }
        );
        console.log('ObjectId update result:', updateResult.matchedCount ? 'Found and updated' : 'Not found');
      } catch (err) {
        console.error('Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try by title if still not found (as last resort)
    if (updateResult.matchedCount === 0) {
      updateResult = await postsCollection.updateOne(
        { title: title },
        { $set: updateData }
      );
      console.log('Title update result:', updateResult.matchedCount ? 'Found and updated' : 'Not found');
    }
    
    if (updateResult.matchedCount === 0) {
      console.error('Could not find post to update with ID:', req.params.id);
      return res.status(404).send('Post not found. Could not update.');
    }
    
    // Check if the request is coming from the dashboard iframe
    const isDashboard = req.query.dashboard === 'true' || (req.get('Referer') && req.get('Referer').includes('dashboard=true'));
    req.flash('success', 'Post updated successfully!'); // Add a success flash message

    if (isDashboard) {
        res.redirect('/index?dashboard=true');
    } else {
        res.redirect('/index'); // Fallback for non-dashboard context
    }
  } catch (error) {
    console.error('Error updating post:', error);
    const isDashboard = req.query.dashboard === 'true' || (req.get('Referer') && req.get('Referer').includes('dashboard=true'));
    req.flash('error', 'Error updating post: ' + error.message);
    if (isDashboard) {
        // It might be better to redirect back to the edit page with the error
        res.redirect(`/edit-post/${req.params.id}?dashboard=true`);
    } else {
        res.status(500).send('Error updating post');
    }
  }
});

// Delete image from post
app.post('/posts/:id/delete-image', async (req, res) => {
  // Debug logging
  console.log('Delete image request received:', {
    postId: req.params.id,
    imageUrl: req.body.imageUrl
  });

  // Check if user is logged in and is an admin
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  
  try {
    const postId = req.params.id;
    const { imageUrl } = req.body;

    if (!postId || !imageUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        error: 'Post not found' 
      });
    }

    // Verify the image belongs to this post
    if (post.imageUrl !== imageUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image does not belong to this post' 
      });
    }

    // Check if other posts are using this image
    const otherPosts = await Post.find({
      _id: { $ne: postId },
      imageUrl: imageUrl
    });

    // If no other post is using this image and it's not the default image, delete from Cloudinary
    if (otherPosts.length === 0 && !imageUrl.includes('/images/default-post.jpg')) {
      try {
        // Extract public_id from Cloudinary URL
        // Example URL: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/robolution/posts/image123
        const urlParts = imageUrl.split('/');
        const publicId = 'robolution/posts/' + urlParts[urlParts.length - 1].split('.')[0];
        
        console.log('Attempting to delete from Cloudinary with public_id:', publicId);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary deletion result:', result);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with post update even if Cloudinary deletion fails
      }
    }

    // Update the post to set default image
    await Post.findByIdAndUpdate(postId, { 
      $set: { imageUrl: '/images/default-post.jpg' } 
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error in delete-image route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete image: ' + error.message 
    });
  }
});

// Update login route to include 2FA handling and direct MongoDB access
app.post('/login', async (req, res) => {
    try {
        const { username, password, token, redirect } = req.body;
        
        console.log('Login attempt:', { 
            username, 
            hasToken: !!token,
            sessionID: req.sessionID,
            cookieDomain: process.env.COOKIE_DOMAIN,
            environment: process.env.NODE_ENV,
            secure: process.env.NODE_ENV === 'production'
        });
        
        // DIRECT DB ACCESS: First check admin collection
        const adminUser = await db.collection('admins').findOne({ username });
        
        if (adminUser) {
            const isPasswordValid = await bcrypt.compare(password, adminUser.password);
            
            if (!isPasswordValid) {
                console.log('Invalid password for admin:', username);
                return res.json({ success: false, message: 'Invalid username or password' });
            }
            
            // Check if this admin needs to set up 2FA after password reset
            if (adminUser.needs2FASetup) {
                return res.json({ 
                    success: false, 
                    requireTwoFactor: true, 
                    needs2FASetup: true,
                    message: 'Your account has been reset. Please set up two-factor authentication.',
                    username: username,
                    password: password
                });
            }
            
            // Check if 2FA is enabled
            if (adminUser.twoFactorEnabled) {
                // If no token provided but 2FA is enabled, request token
                if (!token) {
                    return res.json({ 
                        success: false, 
                        requireTwoFactor: true, 
                        needs2FASetup: false,
                        message: 'Please enter your two-factor authentication code'
                    });
                }
                
                // Verify the token
                const verified = speakeasy.totp.verify({
                    secret: adminUser.twoFactorSecret,
                    encoding: 'base32',
                    token: token,
                    window: 1 // Allow 1 step before/after for time drift
                });
                
                if (!verified) {
                    // Also check backup codes
                    const isBackupCode = adminUser.backupCodes && 
                                         adminUser.backupCodes.includes(token);
                    
                    if (!isBackupCode) {
                        return res.json({ 
                            success: false, 
                            requireTwoFactor: true,
                            needs2FASetup: false,
                            message: 'Invalid two-factor code. Please try again.'
                        });
                    } else {
                        // If using backup code, remove it from the list
                        await db.collection('admins').updateOne(
                            { username: adminUser.username },
                            { $pull: { backupCodes: token } }
                        );
                    }
                }
            }
            
            // Clear any existing session first
            console.log('Regenerating session for user:', username);
            req.session.regenerate((regError) => {
                if (regError) {
                    console.error('Session regeneration error:', regError);
                    // Try to destroy and create a new session as a fallback
                    req.session.destroy(() => {
                        req.session = null;
                        return res.json({ success: false, message: 'Session error. Please try again.' });
                    });
                    return;
                }
                
                // Set admin session with all necessary data
                req.session.user = {
                    id: adminUser._id.toString ? adminUser._id.toString() : adminUser._id,
                    username: adminUser.username,
                    isAdmin: true,
                    role: adminUser.role || 'admin'
                };
                
                // Save the session
                req.session.save((saveError) => {
                    if (saveError) {
                        console.error('Session save error:', saveError);
                        return res.json({ success: false, message: 'Session error. Please try again.' });
                    }
                    
                    console.log('Admin login successful - Session saved:', {
                        sessionID: req.sessionID,
                        user: req.session.user,
                        cookie: req.session.cookie,
                        env: {
                            NODE_ENV: process.env.NODE_ENV,
                            COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
                            RENDER: process.env.RENDER,
                            RENDER_EXTERNAL_HOSTNAME: process.env.RENDER_EXTERNAL_HOSTNAME
                        }
                    });
                    
                    // Force save the session again to ensure it's stored
                    req.session.touch();
                    
                    // Add localStorage configuration
                    const redirectUrl = redirect || '/admin-dashboard'; // Changed from /index
                    
                    // Get cookie configuration based on environment
                    const cookieConfig = {
                        domain: process.env.COOKIE_DOMAIN || undefined,
                        secure: isProduction ? true : false,
                        sameSite: 'lax'
                    };
                    
                    return res.json({ 
                        success: true,
                        redirectUrl: redirectUrl,
                        role: adminUser.role || 'admin',
                        message: 'Login successful! Welcome back, ' + adminUser.username,
                        setLocalStorage: true,  // Signal client to set localStorage
                        sessionID: req.sessionID, // Send session ID to client for debugging
                        cookieConfig: cookieConfig
                    });
                });
            });
        } else {
            // DIRECT DB ACCESS: If not an admin, check regular users collection
            const usersCollection = robolutionDb.collection('users');
            const regularUser = await usersCollection.findOne(
                { username },
                { projection: { 
                    username: 1, 
                    password: 1, 
                    role: 1,
                    email: 1,
                    fullName: 1, // Ensure fullName is fetched
                    isEmailVerified: 1,
                    twoFactorEnabled: 1, 
                    twoFactorSecret: 1,
                    backupCodes: 1
                }}
            );
            
            if (!regularUser) {
                console.log('User not found:', username);
                return res.json({ success: false, message: 'Invalid username or password' });
            }
            
            const isPasswordValid = await bcrypt.compare(password, regularUser.password);
            
            if (!isPasswordValid) {
                console.log('Invalid password for user:', username);
                return res.json({ success: false, message: 'Invalid username or password' });
            }

            // SCENARIO 1: User has app-based 2FA enabled
            if (regularUser.twoFactorEnabled) {
                console.log('User has 2FA enabled, checking code...');
                
                if (!token) {
                    return res.json({ 
                        success: false, 
                        requireTwoFactor: true, 
                        message: 'Please enter your two-factor authentication code'
                    });
                }
                
                // Log the 2FA details for debugging
                console.log('2FA check details:', {
                    hasSecret: !!regularUser.twoFactorSecret,
                    secretLength: regularUser.twoFactorSecret ? regularUser.twoFactorSecret.length : 0,
                    tokenProvided: token
                });
                
                const verified = speakeasy.totp.verify({
                    secret: regularUser.twoFactorSecret,
                    encoding: 'base32',
                    token: token,
                    window: 1
                });
                
                console.log('2FA verification result:', verified);
                
                let isBackupCode = false;
                if (!verified && regularUser.backupCodes && regularUser.backupCodes.includes(token)) {
                    isBackupCode = true;
                    console.log('Using backup code instead of TOTP');
                }

                if (!verified && !isBackupCode) {
                    return res.json({ 
                        success: false, 
                        requireTwoFactor: true,
                        message: 'Invalid two-factor code. Please try again.'
                    });
                }
                
                if (isBackupCode) {
                    // If using backup code, remove it from the list
                    const { ObjectId } = require('mongodb');
                    const userId = new ObjectId(regularUser._id);
                    
                    await usersCollection.updateOne(
                        { _id: userId },
                        { $pull: { backupCodes: token } }
                    );
                    
                    console.log('Backup code used and removed from available codes');
                }
            }
            // SCENARIO 2: New user, email not verified yet
            else if (!regularUser.isEmailVerified) {
                // Generate OTP
                const otp = otpGenerator.generate(6, { 
                    upperCaseAlphabets: false, 
                    specialChars: false,
                    lowerCaseAlphabets: false
                });

                // Hash the OTP before storing
                const hashedOtp = await bcrypt.hash(otp, 10);
                const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

                await usersCollection.updateOne(
                    { _id: regularUser._id },
                    { $set: { emailOtp: hashedOtp, emailOtpExpires: otpExpires } }
                );

                // Send email via Postmark
                try {
                    await postmarkClient.sendEmail({
                        "From": process.env.POSTMARK_FROM_EMAIL,
                        "To": regularUser.email,
                        "Subject": "Your Robolution Verification Code",
                        "HtmlBody": `
                            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                                <h2 style="color: #001f5c;">Erovoutika Robolution Site Verification</h2>
                                <p>Hello ${regularUser.fullName},</p>
                                <p>Thank you for creating an account with the Erovoutika Robolution site. To complete your login, please use the following verification code:</p>
                                <p style="font-size: 24px; font-weight: bold; color: #003399; letter-spacing: 2px; border: 1px solid #ccd7ea; padding: 10px; text-align: center; background-color: #f9fbff; border-radius: 5px;">
                                    ${otp}
                                </p>
                                <p>This code is valid for 10 minutes.</p>
                                <p><strong>If you did not create an account with Robolution, please ignore this email and change your password for your email account immediately as someone may be trying to use your email address.</strong></p>
                                <hr style="border: none; border-top: 1px solid #eee;">
                                <p style="font-size: 0.9em; color: #777;">The Erovoutika Robolution Team</p>
                            </div>
                        `,
                        "TextBody": `Hello ${regularUser.fullName},\n\nThank you for creating an account with the Erovoutika Robolution site. To complete your login, please use the following verification code:\n\n${otp}\n\nThis code is valid for 10 minutes.\nIf you did not create an account with Robolution, please ignore this email and change your password for your email account immediately as someone may be trying to use your email address.\n\nThe Erovoutika Robolution Team`
                    });
                } catch (emailError) {
                    console.error("Error sending Postmark email:", emailError);
                    return res.status(500).json({ success: false, message: 'There was an error sending the verification email. Please try again.' });
                }
                
                // Signal to the client to ask for the email OTP
                return res.json({
                    success: false,
                    requireEmailOtp: true,
                    message: `A verification code has been sent to ${regularUser.email}. Please enter it to continue.`
                });
            }

            // SCENARIO 3: Email is verified and no app-based 2FA, or 2FA was just passed.
            // All checks passed, create the session.
            
            // Set regular user session - ensure _id is properly converted to string
            const userId = regularUser._id.toString ? regularUser._id.toString() : 
                          (typeof regularUser._id === 'object' ? regularUser._id.toString() : regularUser._id);
            
            console.log('Setting regular user session with ID:', userId);
            
            // Clear any existing session first
            console.log('Regenerating session for regular user:', username);
            req.session.regenerate(async (regError) => {
                if (regError) {
                    console.error('Session regeneration error:', regError);
                    // Try to destroy and create a new session as a fallback
                    req.session.destroy(() => {
                        req.session = null;
                        return res.json({ success: false, message: 'Session error. Please try again.' });
                    });
                    return;
                }
                
                // Set new session data
                req.session.user = {
                    id: userId,
                    username: regularUser.username,
                    isAdmin: false,
                    role: regularUser.role || 'user'
                };
                
                // Save the session
                req.session.save((saveError) => {
                    if (saveError) {
                        console.error('Session save error:', saveError);
                        return res.json({ success: false, message: 'Session error. Please try again.' });
                    }
                    
                    console.log('User login successful - Session saved:', {
                        sessionID: req.sessionID,
                        user: req.session.user,
                        env: {
                            NODE_ENV: process.env.NODE_ENV,
                            COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
                            RENDER: process.env.RENDER,
                            RENDER_EXTERNAL_HOSTNAME: process.env.RENDER_EXTERNAL_HOSTNAME
                        }
                    });
                    
                    // Force save the session again to ensure it's stored
                    req.session.touch();
                    
                    // Get redirect URL from request or use default
                    const redirectUrl = redirect || '/home'; // User redirect remains the same
                    
                    // Get cookie configuration based on environment
                    const cookieConfig = {
                        domain: process.env.COOKIE_DOMAIN || undefined,
                        secure: isProduction ? true : false,
                        sameSite: 'lax'
                    };
                    
                    return res.json({ 
                        success: true,
                        redirectUrl: redirectUrl,
                        role: 'user',
                        message: 'Login successful! Welcome back, ' + regularUser.username,
                        setLocalStorage: true,  // Signal client to set localStorage
                        sessionID: req.sessionID, // Send session ID to client for debugging
                        cookieConfig: cookieConfig
                    });
                });
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: 'An error occurred during login. Please try again.' });
    }
});

app.post('/api/verify-email-otp', async (req, res) => {
    try {
        const { username, emailOtp } = req.body;

        if (!username || !emailOtp) {
            return res.status(400).json({ success: false, message: 'Username and OTP are required.' });
        }

        const usersCollection = robolutionDb.collection('users');
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (!user.emailOtp || !user.emailOtpExpires) {
            return res.status(400).json({ success: false, message: 'No OTP was requested for this user.' });
        }

        if (new Date() > new Date(user.emailOtpExpires)) {
            return res.status(400).json({ success: false, message: 'The verification code has expired. Please log in again to receive a new one.' });
        }

        const isOtpValid = await bcrypt.compare(emailOtp, user.emailOtp);

        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: 'Invalid verification code.' });
        }

        // OTP is valid, update user and log them in
        await usersCollection.updateOne(
            { _id: user._id },
            { 
                $set: { isEmailVerified: true },
                $unset: { emailOtp: "", emailOtpExpires: "" }
            }
        );

        // Clear any existing session and create a new one
        console.log('Regenerating session for email verification for user:', username);
        req.session.regenerate((regError) => {
            if (regError) {
                console.error('Session regeneration error during OTP verification:', regError);
                // Try to destroy and create a new session as a fallback
                req.session.destroy(() => {
                    req.session = null;
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Session error. Please try again.' 
                    });
                });
                return;
            }
            
            // Set session data
            req.session.user = {
                id: user._id.toString(),
                username: user.username,
                isAdmin: false,
                role: user.role || 'user'
            };
            
            // Save the session
            req.session.save((saveError) => {
                if (saveError) {
                    console.error('Session save error during OTP verification:', saveError);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Session error. Please try again.' 
                    });
                }
                
                const redirectUrl = req.body.redirect || '/home';
                
                return res.json({ 
                    success: true,
                    redirectUrl: redirectUrl,
                    message: 'Email verified successfully! Logging you in...',
                    sessionID: req.sessionID,
                    cookieConfig: {
                        domain: process.env.COOKIE_DOMAIN || undefined,
                        secure: false,
                        sameSite: 'lax'
                    }
                });
            });
        });

    } catch (error) {
        console.error('Email OTP Verification Error:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});

// Improved 2FA verification function
function verifyTwoFactorToken(user, token) {
    // For testing purposes, accept any 6-digit code
    // In production, use a proper TOTP library
    console.log('Verifying 2FA token:', token);
    
    // Simple validation - check if it's a 6-digit number
    if (/^\d{6}$/.test(token)) {
        // For testing, accept any valid 6-digit code
        // In production, replace with actual verification
        return true;
    }
    
    return false;
}

// Protected admin route
app.get('/index', (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/login');
    }
    res.render('index'); // Create an admin.ejs view
});

// Admin creation route - GET
app.get('/create-admin', (req, res) => {
    res.render('create-admin');
});

// Admin creation route - POST
app.post('/create-admin', async (req, res) => {
    try {
        const { username, password, confirmPassword, adminKey } = req.body;
        
        // For debugging - remove in production
        console.log('Received admin key:', adminKey);
        
        // Verify admin creation key - use environment variable
        const ADMIN_CREATION_KEY = process.env.ADMIN_CREATION_KEY || 'your-secure-admin-key';
        
        if (adminKey.trim() !== ADMIN_CREATION_KEY.trim()) {
            return res.render('create-admin', {
                message: 'Invalid admin creation key',
                messageType: 'error'
            });
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.render('create-admin', {
                message: 'Passwords do not match',
                messageType: 'error'
            });
        }
        
        // Check if username already exists
        const existingUser = await db.collection('admins').findOne({ username });
        
        if (existingUser) {
            return res.render('create-admin', {
                message: 'Username already exists',
                messageType: 'error'
            });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Generate 2FA secret
        const secret = speakeasy.generateSecret({
            name: `Robolution:${username}`
        });
        
        // Generate backup codes
        const backupCodes = Array(8).fill().map(() => 
            Math.random().toString(36).substring(2, 8).toUpperCase()
        );
        
        // Create admin user with 2FA enabled
        await db.collection('admins').insertOne({
            username,
            password: hashedPassword,
            role: 'admin',
            twoFactorSecret: secret.base32,
            twoFactorEnabled: true,
            backupCodes: backupCodes,
            createdAt: new Date()
        });
        
    } catch (error) {
        console.error('Error creating admin:', error);
        res.render('create-admin', {
            message: 'An error occurred while creating the admin account',
            messageType: 'error'
        });
    }
});

// Route to show details for a specific category for users
app.get('/user-categories/:id', async (req, res) => {
  try {
    let category;
    
    try {
      // Try standard mongoose findById
      category = await Category.findById(req.params.id);
      
      // If not found and ID seems valid
      if (!category && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Try with new ObjectId
        const ObjectId = mongoose.Types.ObjectId;
        const categoryId = new ObjectId(req.params.id);
        category = await Category.findOne({ _id: categoryId });
      }
      
      // Try as string ID if still not found
      if (!category) {
        category = await Category.findOne({ _id: req.params.id });
      }
    } catch (idError) {
      console.error('Error converting category ID:', idError);
      // Continue to check if category was found
    }
    
    if (category) {
      // Fetch all posts for the years dropdown
      const postsCollection = robolutionDb.collection('posts');
      let allPosts = await postsCollection.find().toArray();
      allPosts = JSON.parse(JSON.stringify(allPosts));
      
      // Get unique regions for the regional dropdown
      const uniqueRegions = [...new Set(allPosts
        .map(post => post.region)
        .filter(region => region && region !== 'All')
      )].sort();
      
      res.render('UserViews/user-category_details', { 
        event: category,
        allPosts,
        uniqueRegions
      });
    } else {
      console.error('Event not found with ID:', req.params.id);
      res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error('Error fetching category details:', error);
    res.status(500).send('An error occurred while fetching the category details');
  }
});

// Route to render the registration page
app.get('/registration', async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/login?redirect=/registration');
  }
  
  try {
    // Get categories for dynamic competition options
    const categories = await Category.find();
    
    // Render the registration page with categories
    res.render('UserViews/registration', { categories });
  } catch (error) {
    console.error('Error fetching categories for registration:', error);
    res.status(500).send('Error loading registration page');
  }
});

// Route to handle registration form submission
app.post('/register', upload.single('payment'), async (req, res) => {
  console.log('Received registration submission. req.body:', JSON.stringify(req.body, null, 2)); // Added for debugging
  console.log('Received files:', JSON.stringify(req.file, null, 2)); // Added for debugging payment file

  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/login?redirect=/registration');
  }
  
  try {
    // Extract form data
    const {
      fullname,
      teamMembers,
      category,
      school,
      address,
      email,
      competition,
      workshop,
      other_competition,
      other_workshop,
      code,
      payment_details,
      privacy_agree
    } = req.body;

    // Validate required fields
    if (!fullname || !address || !email || !privacy_agree) {
      // Get categories for the form if validation fails
      const categories = await Category.find();
      return res.render('UserViews/registration', { 
        error: 'Please fill in all required fields',
        categories
      });
    }

    // Process competition array (could be string if only one is selected)
    const competitionArray = Array.isArray(competition) ? competition : (competition ? [competition] : []);
    // Process workshop array (could be string if only one is selected)
    const workshopArray = Array.isArray(workshop) ? workshop : (workshop ? [workshop] : []);
    
    // NEW VALIDATION LOGIC: Either workshop OR competition must be selected
    if (workshopArray.length === 0 && competitionArray.length === 0) {
      const categories = await Category.find();
      return res.render('UserViews/registration', { 
        error: 'Please select at least one competition category OR workshop/seminar option',
        categories
      });
    }

    // Process payment file upload - only required if workshop is selected
    let paymentProofUrl = '';
    if (workshopArray.length > 0) {
      // Only workshops that aren't "OTHER" require payment
      const needsPayment = workshopArray.some(w => w !== 'OTHER');
      
      if (needsPayment && !req.file) {
        const categories = await Category.find();
        return res.render('UserViews/registration', { 
          error: 'Please upload your payment proof for the selected workshop/seminar',
          categories
        });
      }
      
      if (req.file) {
        const filePath = path.join(__dirname, 'public', 'uploads', 'temp', req.file.filename);
        const uploadResult = await uploadToCloudinary(filePath, 'robolution/payments');
        paymentProofUrl = uploadResult.secure_url; // Extract just the URL string, not the whole object
        
        // Clean up temp file after successful upload
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Create a new registration in the database with user ID
    await Registration.create({
      userId: req.session.user.id, // Associate registration with user account
      fullname,
      teamMembers,
      category,
      school,
      address,
      email,
      competition: competitionArray,
      workshop: workshopArray,
      other_competition,
      other_workshop,
      code,
      paymentProofUrl,
      payment_details
    });

    // Redirect to a success page
    res.render('UserViews/registration-success', { name: fullname });
  } catch (error) {
    console.error('Registration error:', error);
    // Get categories for the form if there's an error
    const categories = await Category.find();
    res.render('UserViews/registration', { 
      error: 'An error occurred during registration. Please try again.',
      categories
    });
  }
});

// Route to render the signup page
app.get('/signup', (req, res) => {
  res.render('UserViews/signup');
});

// Route to handle signup form submission
app.post('/signup', async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body;
    
    // Create an object to store form data to send back to the view
    const formData = { fullName, username, email };
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render('UserViews/signup', { 
        error: 'Please enter a valid email address',
        formData
      });
    }
    
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordRegex.test(password)) {
      return res.render('UserViews/signup', { 
        error: 'Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
        formData
      });
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.render('UserViews/signup', { 
        error: 'Passwords do not match',
        formData
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('UserViews/signup', { 
        error: 'Email already in use',
        formData
      });
    }
    
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.render('UserViews/signup', { 
        error: 'Username already taken',
        formData
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user with email verification pending
    await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      // The new defaults in the model will handle the rest:
      // isEmailVerified: false
      // twoFactorEnabled: false
    });
    
    // Set a flash message to be displayed on the login page
    req.flash('success', 'Registration successful! Please log in to verify your account.');

    // Redirect to the login page
    res.redirect('/login');
    
  } catch (error) {
    console.error('Error during registration:', error);
    res.render('UserViews/signup', {
      error: 'An error occurred during registration',
      formData: { fullName, username, email }
    });
  }
});

// Route to handle user logout
app.get('/logout', (req, res) => {
  // Get original session ID to clear cache for
  const sessionID = req.sessionID;
  
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
    }
    
    // Set headers to prevent browser caching
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    
    // Redirect to the landing page with a script to clear localStorage and prevent back navigation
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Logging out...</title>
        <meta http-equiv="refresh" content="2;url=/home">
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .logout-container {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #4a5568;
          }
          .message {
            margin: 1rem 0;
            color: #718096;
          }
        </style>
      </head>
      <body>
        <div class="logout-container">
          <h1>Logging Out</h1>
          <p class="message">You have been successfully logged out.</p>
          <p>Redirecting you to the home page...</p>
        </div>
        
        <script>
          // Clear all localStorage data
          try {
            localStorage.removeItem('isLoggedIn');
            sessionStorage.clear();
            console.log('Login status cleared from storage');
          } catch (e) {
            console.error('Error clearing storage:', e);
          }
          
          // Clear all cookies
          document.cookie.split(';').forEach(function(c) {
            document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
          });
          
          // Clear browser history state to prevent back button navigation to cached pages
          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', window.location.href);
            window.onpopstate = function() {
              window.history.pushState(null, '', window.location.href);
            };
          }
          
          // Add timestamp to redirect URL to prevent cache
          setTimeout(function() {
            window.location.href = '/home?nocache=' + new Date().getTime();
          }, 2000);
        </script>
      </body>
      </html>
    `);
  });
});

// Update routes for 2FA setup and verification
app.get('/setup-2fa', async (req, res) => {
    // Check if user is logged in and is an admin
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/login');
    }
    
    try {
        // Check if 2FA is already enabled
        const admin = await db.collection('admins').findOne({ username: req.session.user.username });
        
        if (admin.twoFactorEnabled) {
            return res.redirect('/2fa-already-setup');
        }
        
        // Generate new secret
        const secret = speakeasy.generateSecret({
            name: `Robolution:${admin.username}`
        });
        
        // Store the secret temporarily in session
        req.session.twoFactorSecret = secret.base32;
        
        // Generate QR code
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        
        res.render('UserViews/setup-2fa', { 
            qrCode: qrCodeUrl, 
            secret: secret.base32,
            formAction: '/verify-2fa-setup'
        });
    } catch (error) {
        console.error('Error setting up 2FA:', error);
        res.status(500).send('Error setting up two-factor authentication');
    }
});

app.post('/verify-2fa-setup', async (req, res) => {
    // Check if user is logged in and is an admin
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/login');
    }
    
    try {
        const { token } = req.body;
        const secret = req.session.twoFactorSecret;
        
        if (!secret) {
            return res.redirect('/setup-2fa');
        }
        
        // Verify the token
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 1 // Allow 1 step before/after for time drift
        });
        
        if (!verified) {
            return res.render('UserViews/setup-2fa', {
                error: 'Invalid verification code, please try again',
                qrCode: await qrcode.toDataURL(`otpauth://totp/Robolution:${req.session.user.username}?secret=${secret}&issuer=Robolution`),
                secret: secret,
                formAction: '/verify-2fa-setup'
            });
        }
        
        // Token is valid, enable 2FA
        await db.collection('admins').updateOne(
            { username: req.session.user.username },
            { 
                $set: { 
                    twoFactorSecret: secret,
                    twoFactorEnabled: true
                } 
            }
        );
        
        // Generate some backup codes (optional)
        const backupCodes = Array(8).fill().map(() => 
            Math.random().toString(36).substring(2, 8).toUpperCase()
        );
        
        await db.collection('admins').updateOne(
            { username: req.session.user.username },
            { $set: { backupCodes: backupCodes } }
        );
        
        // Clear the temporary secret from session
        delete req.session.twoFactorSecret;
        
        res.render('UserViews/2fa-success', { 
            message: 'Two-factor authentication has been successfully set up!',
            backupCodes: backupCodes // Display these to the user once
        });
    } catch (error) {
        console.error('Error verifying 2FA setup:', error);
        res.status(500).send('Error setting up two-factor authentication');
    }
});

app.get('/2fa-already-setup', (req, res) => {
    res.render('UserViews/2fa-already-setup', { message: 'You have already set up two-factor authentication on your account.' });
});

// Route to handle regional page requests with direct MongoDB access
app.get('/regional', async (req, res) => {
  try {
    console.log('Accessing regional page with region:', req.query.region);
    
    const region = req.query.region || 'All';
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    
    // DIRECT COLLECTION ACCESS
    const postsCollection = robolutionDb.collection('posts');
    
    // Query to filter posts by region if a specific region is selected
    const query = region !== 'All' ? { region: region } : {};
    
    console.log('Regional query:', JSON.stringify(query));
    
    // Fetch posts based on the query and sort direction using native MongoDB
    let posts = await postsCollection.find(query).sort({ createdAt: sortDirection }).toArray();
    console.log(`Found ${posts.length} posts for region ${region}`);
    
    // Convert MongoDB documents to JavaScript objects
    posts = JSON.parse(JSON.stringify(posts));
    
    // Get unique regions for the dropdown directly from MongoDB
    const allPosts = await postsCollection.find().toArray();
    const uniqueRegions = [...new Set(allPosts.map(post => post.region).filter(region => region && region !== 'All'))].sort();
    
    // Fetch tour gallery images if a specific region is selected
    let tourGallery = [];
    if (region !== 'All') {
        tourGallery = await TourGallery.find({ region: region }).sort({ createdAt: -1 });
    }
    
    res.render('UserViews/regional', { 
      posts, 
      region,
      uniqueRegions,
      allPosts, // Pass all posts for the years dropdown
      sort: req.query.sort || 'desc',
      tourGallery // Pass tour gallery to the template
    });
  } catch (error) {
    console.error('Error fetching regional posts:', error);
    res.status(500).send('An error occurred while fetching regional posts');
  }
});

// Admin regional page - similar to regional but with admin controls
app.get('/admin-regional', async (req, res) => {
  // Check if user is logged in and is an admin
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/login');
  }
  
  try {
    const region = req.query.region || 'All';
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    
    // Query to filter posts by region if a specific region is selected
    const query = region !== 'All' ? { region: region } : {};
    
    // Fetch posts based on the query and sort direction
    const posts = await Post.find(query).sort({ createdAt: sortDirection });
    
    // Get unique regions for the dropdown
    const allPosts = await Post.find();
    const uniqueRegions = [...new Set(allPosts.map(post => post.region).filter(region => region && region !== 'All'))].sort();
    
    res.render('admin-regional', { 
      posts, 
      region,
      uniqueRegions,
      sort: req.query.sort || 'desc'
    });
  } catch (error) {
    console.error('Error fetching admin regional posts:', error);
    res.status(500).send('An error occurred while fetching regional posts');
  }
});

// Route to show individual post details
app.get('/post/:id', async (req, res) => {
  try {
    let post;
    
    try {
      // First try standard mongoose findById
      post = await Post.findById(req.params.id);
      
      // If not found and ID seems valid
      if (!post && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Try creating an ObjectId
        const ObjectId = mongoose.Types.ObjectId;
        const postId = new ObjectId(req.params.id);
        post = await Post.findOne({ _id: postId });
      }
      
      // Try as string ID if still not found
      if (!post) {
        post = await Post.findOne({ _id: req.params.id });
      }
    } catch (idError) {
      console.error('Error converting post ID:', idError);
      // Continue to check if post was found
    }
    
    if (!post) {
      console.error('Post not found with ID:', req.params.id);
      return res.status(404).send('Post not found');
    }
    
    res.render('UserViews/post-detail', { 
      post,
      req: req
    });
  } catch (error) {
    console.error('Error fetching post details:', error);
    res.status(500).send('An error occurred while fetching the post details');
  }
});

// Health check route for Render
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// API endpoint to check username availability for users
app.get('/api/check-username', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const existingUser = await User.findOne({ username: username });
        res.json({ available: !existingUser });
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// API endpoint to check username availability for admins
app.get('/api/check-admin-username', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const existingAdmin = await db.collection('admins').findOne({ username: username });
        res.json({ available: !existingAdmin });
    } catch (error) {
        console.error('Error checking admin username:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// API route to check if session is valid
app.get('/api/check-session', (req, res) => {
  console.log('Session check request from:', req.headers.referer || 'unknown', 'session:', {
    id: req.sessionID,
    hasUser: !!req.session?.user,
    userId: req.session?.user?.id,
    username: req.session?.user?.username,
    cookieDomain: process.env.COOKIE_DOMAIN,
    isProduction: isProduction,
    isLocalhost: isLocalhost,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
      RENDER: process.env.RENDER,
      RENDER_EXTERNAL_HOSTNAME: process.env.RENDER_EXTERNAL_HOSTNAME
    }
  });
  
  // Touch the session to keep it alive
  if (req.session) {
    req.session.touch();
  }
  
  // Get cookie configuration based on environment
  const cookieConfig = {
    domain: process.env.COOKIE_DOMAIN || undefined,
    secure: isProduction ? true : false,
    sameSite: 'lax'
  };
  
  // Simple check to see if user is in session
  if (req.session && req.session.user && req.session.user.id) {
    // Force save the session to ensure it persists
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session during check:', err);
      }
    });
    
    return res.json({ 
      authenticated: true,
      user: {
        id: req.session.user.id,
        username: req.session.user.username,
        role: req.session.user.role,
        isAdmin: req.session.user.isAdmin
      },
      sessionID: req.sessionID,
      cookieConfig: cookieConfig
    });
  } else {
    return res.json({ 
      authenticated: false,
      sessionID: req.sessionID,
      cookieConfig: cookieConfig
    });
  }
});

// Function to setup the international Astro app
async function setupInternationalApp() {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.RENDER === 'true') {
      console.log('Setting up international app in production mode');
      
      // Check if the built files exist
      const entryPath = path.join(__dirname, '../international/dist/server/entry.mjs');
      if (!fs.existsSync(entryPath)) {
        console.error('International app build not found at:', entryPath);
        console.log('Will attempt to use fallback mechanism for international pages');
        return;
      }
      
      // In production, import the built Astro app server
      try {
        // Convert to proper file:// URL for ESM imports (fix for Windows paths)
        const entryUrl = `file://${entryPath.replace(/\\/g, '/')}`;
        console.log('Loading international app from:', entryUrl);
        
        const astroModule = await import(entryUrl);
        internationalHandler = astroModule.handler;
        console.log('Successfully loaded international app handler');
      } catch (importError) {
        console.error('Failed to import international app:', importError);
      }
    } else {
      console.log('Setting up international app in development mode');
      // In development, we will use the proxy in dubai.js
    }
    console.log('International app setup complete');
  } catch (error) {
    console.error('Error setting up international app:', error);
  }
}

// Only start the server if this file is run directly (not required as a module)
if (require.main === module) {
    // Set up the international app before starting the server
    setupInternationalApp().then(() => {
        // Import Dubai routes
        const dubaiRoutes = require('./routes/dubai');
        
        // Special middleware for production mode to use the built Astro app
        if ((process.env.NODE_ENV === 'production' || process.env.RENDER === 'true') && internationalHandler) {
            console.log('Setting up production handler for /dubai routes');
            
            app.use('/dubai', async (req, res, next) => {
                try {
                    // Log the request for debugging
                    console.log(`[Dubai Production] Processing: ${req.method} ${req.originalUrl}`);
                    
                    // Get country template data using our utility function
                    const countryData = await getCountryTemplate(req);
                    
                    // Log the result
                    if (countryData) {
                      console.log(`[Dubai Route] Using template: ${countryData.name}`);
                    } else {
                      console.log(`[Dubai Route] No template found, using defaults`);
                    }
                    
                    // Strip /dubai prefix
                    const originalUrl = req.originalUrl;
                    req.url = originalUrl.replace(/^\/dubai/, '');
                    if (req.url === '') req.url = '/';
                    
                    console.log(`[Dubai Production] Modified URL: ${req.url}`);
                    
                    // Add user authentication headers
                    if (req.session && req.session.user) {
                        req.headers['x-user-id'] = req.session.user.id || '';
                        req.headers['x-user-name'] = req.session.user.username || '';
                        req.headers['x-user-auth'] = 'true';
                    }
                    
                    // Add country data header for the template system
                    if (countryData) {
                        req.headers['X-Country-Site'] = JSON.stringify(countryData);
                        console.log(`[Dubai Production] Using template: ${countryData.name}`);
                    }
                    
                    return internationalHandler(req, res, next);
                } catch (error) {
                    console.error('[Dubai Production] Error handling request:', error);
                    next(error);
                }
            });
        } else {
            // Set up routes for Dubai app in development mode
            console.log('Setting up development proxy for /dubai routes');
        app.use('/dubai', dubaiRoutes);
        }
        
        // Add redirect from old path to new path
        app.get('/international', (req, res) => {
            console.log('Redirecting /international to /dubai');
            res.redirect('/dubai');
        });
        
        app.get('/international/*', (req, res) => {
            const newPath = req.originalUrl.replace('/international', '/dubai');
            console.log(`Redirecting ${req.originalUrl} to ${newPath}`);
            res.redirect(newPath);
        });
        
        // Add a fallback handler for Dubai routes in production if Astro fails to load
            app.use('/dubai', (req, res, next) => {
          // Only act as fallback in production when the handler is not available
          if ((process.env.NODE_ENV === 'production' || process.env.RENDER === 'true') && !internationalHandler) {
            console.log('[Dubai Fallback] No handler available, serving fallback page');
            
            // Show a friendly message
            return res.send(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>International Site Maintenance</title>
                  <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; text-align: center; }
                    h1 { color: #00008b; }
                    .message { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .links { margin-top: 30px; }
                    .links a { display: inline-block; margin: 0 10px; color: #00008b; text-decoration: none; }
                    .links a:hover { text-decoration: underline; }
                  </style>
                </head>
                <body>
                  <h1>International Site Under Maintenance</h1>
                  <div class="message">
                    <p>Our international site is currently being updated. Please check back soon or visit our main site.</p>
                    <p>We apologize for any inconvenience.</p>
                  </div>
                  <div class="links">
                    <a href="/">Return to Main Site</a>
                  </div>
                </body>
              </html>
            `);
          }
          
          // Continue to the next handler if not in production or if handler is available
          next();
            });
        
        app.listen(port, () => {
            console.log(`Robolution site running at http://localhost:${port}`);
        });
    }).catch(err => {
        console.error('Error setting up the server:', err);
        // Start server even if international app setup fails
        app.listen(port, () => {
            console.log(`Robolution site running at http://localhost:${port} (international app setup failed)`);
        });
    });
}

// Export the app for production testing
module.exports = app;

// Delete post route
app.post('/delete-post/:id', requireAdmin, async (req, res) => {
  // Admin check is now handled by requireAdmin middleware
  // if (!req.session.user || !req.session.user.isAdmin) {
  //   return res.status(403).send('Unauthorized');
  // }
  
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      console.log(`[Delete Post] Post not found with ID: ${postId}`);
      return res.status(404).send('Post not found.');
    }

    // If the post has an image URL and it's a Cloudinary URL, try to delete it from Cloudinary
    if (post.imageUrl && post.imageUrl.includes('res.cloudinary.com')) {
      try {
        const parts = post.imageUrl.split('/');
        // Assumes Cloudinary folder structure like robolution/posts/filename
        const publicIdInFolder = parts.slice(parts.indexOf('robolution')).join('/'); 
        const publicId = publicIdInFolder.substring(0, publicIdInFolder.lastIndexOf('.'));
        
        console.log(`[Delete Post] Attempting to delete image from Cloudinary with public_id: ${publicId}`);
        await cloudinary.uploader.destroy(publicId);
        console.log(`[Delete Post] Successfully deleted image from Cloudinary: ${publicId}`);
      } catch (cloudinaryError) {
        console.error(`[Delete Post] Error deleting image from Cloudinary (post ID: ${postId}, image: ${post.imageUrl}):`, cloudinaryError);
        // Log the error but proceed with deleting the post from DB
      }
    } else if (post.imageUrl) {
      // Optional: Handle deletion of local images if they might still exist and are not Cloudinary URLs
      // This part depends on whether you expect any valid non-Cloudinary images.
      // For now, we'll just log if it's not a Cloudinary URL.
      console.log(`[Delete Post] Post image is not a Cloudinary URL, not attempting Cloudinary delete: ${post.imageUrl}`);
      // If you are sure these are old local files you want to attempt to delete:
      // const localFilePath = path.join(__dirname, 'public', post.imageUrl);
      // if (fs.existsSync(localFilePath)) {
      //   fs.unlink(localFilePath, (err) => {
      //     if (err) console.log('[Delete Post] Failed to delete local image:', err);
      //     else console.log('[Delete Post] Local image deleted:', localFilePath);
      //   });
      // }
    }

    await Post.findByIdAndDelete(postId);
    console.log(`[Delete Post] Successfully deleted post with ID: ${postId}`);
    
    const isDashboard = req.query.dashboard === 'true' || (req.get('Referer') && req.get('Referer').includes('dashboard=true'));
    req.flash('success', 'Post deleted successfully!');

    if (isDashboard) {
        res.redirect('/index?dashboard=true');
    } else {
        res.redirect('/index'); // Fallback for non-dashboard context
    }
  } catch (error) {
    console.error(`[Delete Post] Error deleting post with ID ${req.params.id}:`, error);
    const isDashboard = req.query.dashboard === 'true' || (req.get('Referer') && req.get('Referer').includes('dashboard=true'));
    req.flash('error', 'Error deleting post: ' + error.message);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        // Specific error for invalid ID format
        req.flash('error', 'Invalid Post ID format for deletion.');
    }

    if (isDashboard) {
        res.redirect('/index?dashboard=true'); // Redirect back to dashboard's post list even on error
    } else {
        res.status(500).send('Error deleting post.');
    }
  }
});

// Add routes for user 2FA setup
app.get('/user/setup-2fa', requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        
        if (user && user.twoFactorEnabled) {
            return res.redirect('/2fa-already-setup');
        }
        
        const secret = speakeasy.generateSecret({ length: 20, name: `Robolution:${req.session.user.username}` });
        req.session.twoFactorSecret = secret.base32;
        
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        
        res.render('UserViews/setup-2fa', { 
            qrCode: qrCodeUrl, 
            secret: secret.base32,
            formAction: '/user/verify-2fa-setup' // User-specific action
        });
    } catch (error) {
        console.error('Error in user 2FA setup page:', error);
        res.status(500).send('Error loading 2FA setup page');
    }
});

app.post('/user/verify-2fa-setup', requireLogin, async (req, res) => {
    try {
        const { token } = req.body;
        const secret = req.session.twoFactorSecret;
        
        if (!secret) {
            return res.redirect('/user/setup-2fa');
        }
        
        // Verify the token
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 1 // Allow 1 step before/after for time drift
        });
        
        if (!verified) {
            return res.render('UserViews/setup-2fa', {
                error: 'Invalid verification code, please try again',
                qrCode: await qrcode.toDataURL(`otpauth://totp/Robolution:${req.session.user.username}?secret=${secret}&issuer=Robolution`),
                secret: secret,
                formAction: '/user/verify-2fa-setup' // User-specific action
            });
        }
        
        // Token is valid, enable 2FA for the user
        const user = await User.findById(req.session.user.id);
        
        if (!user) {
            req.flash('error', 'Your user account could not be found. Please log in again.');
            return res.redirect('/login');
        }
        
        // Generate backup codes
        const backupCodes = Array(8).fill().map(() => 
            Math.random().toString(36).substring(2, 8).toUpperCase()
        );
        
        // Use a direct updateOne command for reliability
        const usersCollection = robolutionDb.collection('users');
        // Ensure we use a native MongoDB ObjectId for the query
        const userId = new ObjectId(user._id);

        const updateResult = await usersCollection.updateOne(
            { _id: userId },
            {
                $set: {
                    twoFactorSecret: secret,
                    twoFactorEnabled: true,
                    backupCodes: backupCodes
                }
            }
        );

        // Log the result for debugging
        console.log('Database update result for 2FA setup:', updateResult);
        
        // Clear the temporary secret from session
        delete req.session.twoFactorSecret;
        
        res.render('UserViews/2fa-success', { 
            message: 'Two-factor authentication has been successfully set up!',
            backupCodes: backupCodes, // Display these to the user once
            redirectUrl: '/home'  // Add the missing redirectUrl parameter
        });
    } catch (error) {
        console.error('Error verifying user 2FA setup:', error);
        res.status(500).send('Error setting up two-factor authentication');
    }
});

// Route to disable 2FA for a user account
app.post('/user/disable-2fa', requireLogin, async (req, res) => {
    try {
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }
        
        // Get the user
        const user = await User.findById(req.session.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Verify that 2FA is enabled
        if (!user.twoFactorEnabled) {
            return res.status(400).json({ success: false, message: 'Two-factor authentication is not enabled on this account' });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
        
        // Use direct MongoDB update for reliability
        try {
            const { ObjectId } = require('mongodb');
            const userId = new ObjectId(user._id);
            
            console.log('Disabling 2FA for user with ID:', userId);
            
            // Update using native MongoDB driver with robolutionDb
            const updateResult = await robolutionDb.collection('users').updateOne(
                { _id: userId },
                { 
                    $set: {
                        twoFactorEnabled: false
                    },
                    $unset: {
                        twoFactorSecret: "",
                        backupCodes: ""
                    }
                }
            );
            
            console.log('Database update result for disabling 2FA:', updateResult);
            
            // Verify the update was successful
            const updatedUser = await robolutionDb.collection('users').findOne({ _id: userId });
            
            if (updatedUser && updatedUser.twoFactorEnabled === false) {
                return res.json({ 
                    success: true, 
                    message: 'Two-factor authentication has been disabled successfully'
                });
            } else {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Failed to disable two-factor authentication. Please try again.'
                });
            }
        } catch (updateError) {
            console.error('Error disabling 2FA:', updateError);
            
            // Fallback to Mongoose method if direct update fails
            user.twoFactorEnabled = false;
            user.twoFactorSecret = undefined;
            user.backupCodes = undefined;
            await user.save();
            
            return res.json({ 
                success: true, 
                message: 'Two-factor authentication has been disabled successfully (fallback method)'
            });
        }
    } catch (error) {
        console.error('Error disabling 2FA:', error);
        res.status(500).json({ success: false, message: 'An error occurred while disabling two-factor authentication' });
    }
});

// Route to manage registrations
app.get('/manage-registrations', async (req, res) => {
  try {
    // Get filter parameters
    const category = req.query.category || 'all';
    const workshop = req.query.workshop || 'all';
    const search = req.query.search || '';
    const payment = req.query.payment || 'all';
    const verified = req.query.verified || 'all';
    
    // Build the query
    let query = {};
    
    // Apply category filter
    if (category !== 'all') {
      query.category = category;
    }
    
    // Apply workshop filter
    if (workshop !== 'all') {
      query.workshop = workshop;
    }
    
    // Apply search filter
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { school: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Apply payment filter
    if (payment === 'paid') {
      query.paymentProofUrl = { $ne: null, $ne: '' };
    } else if (payment === 'unpaid') {
      query.$or = [
        { paymentProofUrl: null },
        { paymentProofUrl: '' }
      ];
    }
    
    // Apply verification filter
    if (verified === 'verified') {
      query.verified = true;
      query.denied = { $ne: true }; // Ensure not denied
    } else if (verified === 'unverified') {
      query.verified = { $ne: true };
      query.denied = { $ne: true }; // Ensure not denied
    } else if (verified === 'denied') {
      query.denied = true;
    }
    
    // Fetch registrations based on filters
    const registrations = await Registration.find(query).sort({ registeredAt: -1 });
    
    // Get all posts for the regional dropdown
    const posts = await Post.find();
    
    // Render the page with data
    res.render('manage-registrations', {
      registrations,
      posts,
      category,
      workshop,
      search,
      payment,
      verified
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).send('An error occurred while fetching registrations');
  }
});

// Route to verify a registration
app.get('/registration/verify/:id', async (req, res) => {
  try {
    await Registration.findByIdAndUpdate(req.params.id, {
      verified: true,
      verifiedBy: req.session.user.username,
      verifiedAt: new Date()
    });
    
    res.redirect('/manage-registrations?verified=true');
  } catch (error) {
    console.error('Error verifying registration:', error);
    res.status(500).send('An error occurred while verifying the registration');
  }
});

// Route to show edit registration form with direct MongoDB access
app.get('/registration/edit/:id', async (req, res) => {
  try {
    console.log('Accessing registration for edit with ID:', req.params.id);
    
    // DIRECT COLLECTION ACCESS
    const registrationsCollection = robolutionDb.collection('registrations');
    
    // Try multiple query approaches
    let registration = null;
    
    // 1. Try direct string ID lookup
    registration = await registrationsCollection.findOne({ _id: req.params.id });
    console.log('Direct string ID lookup result:', registration ? 'Found' : 'Not found');
    
    // 2. Try ObjectID lookup if available
    if (!registration && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const ObjectId = require('mongodb').ObjectId;
        registration = await registrationsCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log('ObjectId lookup result:', registration ? 'Found' : 'Not found');
      } catch (err) {
        console.error('Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try by email or fullname if still not found
    if (!registration) {
      registration = await registrationsCollection.findOne({ 
        $or: [
          { email: { $regex: new RegExp(req.params.id, 'i') } },
          { fullname: { $regex: new RegExp(req.params.id, 'i') } }
        ] 
      });
      console.log('Email/Name search result:', registration ? 'Found' : 'Not found');
    }
    
    if (!registration) {
      // Log the full database structure if still not found
      console.log('Registration still not found, checking database structure...');
      
      // Get collection structure
      const registrationSample = await registrationsCollection.find().limit(1).toArray();
      console.log('Sample registration structure:', JSON.stringify(registrationSample, null, 2));
      
      console.error('Registration not found with ID:', req.params.id);
      return res.status(404).send('Registration not found');
    }
    
    // Convert MongoDB document to a JavaScript object
    const registrationObject = JSON.parse(JSON.stringify(registration));
    
    res.render('edit-registration', { 
      registration: registrationObject, 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error fetching registration for edit:', error);
    res.status(500).send('An error occurred while fetching registration details');
  }
});

// Route to handle registration update
app.post('/registration/edit/:id', requireAdmin, async (req, res) => {
  try {
    const {
      fullname, teamMembers, category, school, address, email,
      workshop, other_workshop, competition, other_competition,
      code, payment_details, verified
    } = req.body;
    
    // Prepare update data
    const updateData = {
      fullname,
      teamMembers,
      category,
      school,
      address,
      email,
      workshop,
      other_workshop,
      code,
      payment_details,
      // Convert competition to array if it's a single value or keep as is if already an array
      competition: Array.isArray(competition) ? competition : (competition ? [competition] : []),
      other_competition,
      // Handle verified status
      verified: verified === 'on'
    };
    
    // Update the registration
    await Registration.findByIdAndUpdate(req.params.id, updateData);
    
    res.redirect('/registration/' + req.params.id);
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).send('An error occurred while updating the registration');
  }
});

// Route to delete a registration
app.get('/registration/delete/:id', async (req, res) => {
  try {
    // Check if user is logged in and is an admin
    if (!req.session.user || !req.session.user.isAdmin) {
      return res.redirect('/login');
    }
    
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).send('Registration not found');
    }
    
    // Delete payment proof from Cloudinary if exists
    if (registration.paymentProofUrl && registration.paymentProofUrl.includes('cloudinary')) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = registration.paymentProofUrl.split('/');
        const publicId = 'robolution/payments/' + urlParts[urlParts.length - 1].split('.')[0];
        
        console.log('Attempting to delete payment proof from Cloudinary:', publicId);
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting payment proof from Cloudinary:', cloudinaryError);
        // Continue with registration deletion even if Cloudinary deletion fails
      }
    }
    
    // Delete the registration
    await Registration.findByIdAndDelete(req.params.id);
    
    res.redirect('/manage-registrations?deleted=true');
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).send('An error occurred while deleting the registration');
  }
});

// Route to view individual registration details
app.get('/registration/:id', async (req, res) => {
  try {
    let registration = null;
    
    // Try multiple methods to find the registration
    try {
      // First try standard mongoose findById
      registration = await Registration.findById(req.params.id);
      
      // If not found and ID seems to be a valid MongoDB ObjectId string
      if (!registration && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Try with new ObjectId
        const ObjectId = mongoose.Types.ObjectId;
        const regId = new ObjectId(req.params.id);
        registration = await Registration.findOne({ _id: regId });
      }
      
      // Try as string ID if still not found
      if (!registration) {
        registration = await Registration.findOne({ _id: req.params.id });
      }
    } catch (idError) {
      console.error('Error looking up registration:', idError);
    }
    
    if (!registration) {
      console.error('Registration not found with ID:', req.params.id);
      return res.status(404).send('Registration not found');
    }
    
    res.render('registration-detail', { 
      registration, 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error fetching registration details:', error);
    res.status(500).send('An error occurred while fetching registration details');
  }
});

// ====== User Account Management Routes ======

// Route to view all user accounts
app.get('/manage-accounts', requireSuperAdmin, async (req, res) => {
  try {
    const isDashboard = req.query.dashboard === 'true';
    // Get query parameters for filtering
    const search = req.query.search || '';
    const filter2FA = req.query.filter2FA || '';
    const adminRole = req.query.adminRole || '';
    
    // Build queries for admins
    let adminQuery = {};
    if (search) {
      adminQuery.username = { $regex: search, $options: 'i' };
    }
    if (filter2FA === 'enabled') {
      adminQuery.twoFactorEnabled = true;
    } else if (filter2FA === 'disabled') {
      adminQuery.twoFactorEnabled = { $ne: true };
    }
    if (adminRole && adminRole !== 'user') {
      adminQuery.role = adminRole;
    }
    
    // Get admin accounts from adminDB with filters
    let adminAccounts = adminRole === 'user' ? [] : await db.collection('admins').find(adminQuery).toArray();
    adminAccounts = adminAccounts.map(admin => ({ ...admin, _id: admin._id.toString() }));
    
    // Build queries for users
    let userQuery = {};
    if (search) {
      userQuery.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ];
    }
    if (filter2FA === 'enabled') {
      userQuery.twoFactorEnabled = true;
    } else if (filter2FA === 'disabled') {
      userQuery.twoFactorEnabled = { $ne: true };
    }
    
    // Get regular user accounts with filters
    let regularUsers = adminRole !== '' && adminRole !== 'user' ? [] : await User.find(userQuery).sort({ createdAt: -1 });
    regularUsers = regularUsers.map(user => ({ ...user.toObject(), _id: user._id.toString() }));
    
    res.render('manage-accounts', {
      admins: adminAccounts,
      users: regularUsers,
      user: req.session.user,
      search: search,
      filter2FA: filter2FA,
      adminRole: adminRole,
      dashboard: isDashboard // Pass dashboard status to template
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).send('An error occurred while fetching account information');
  }
});

// Route to edit admin account
app.get('/account/admin/edit/:id', requireSuperAdmin, async (req, res) => {
  try {
    const isDashboard = req.query.dashboard === 'true';
    console.log('Accessing admin account with ID:', req.params.id);
    
    let admin = null;
    
    // Try multiple methods to find the admin
    try {
      // First try direct lookup with MongoDB driver
      const ObjectId = require('mongodb').ObjectId;
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        const adminId = new ObjectId(req.params.id);
        admin = await db.collection('admins').findOne({ _id: adminId });
      }
      
      // If not found, try as string ID
      if (!admin) {
        admin = await db.collection('admins').findOne({ _id: req.params.id });
      }
      
      // Try by username if still not found
      if (!admin) {
        admin = await db.collection('admins').findOne({ username: req.params.id });
      }
    } catch (idError) {
      console.error('Error looking up admin:', idError);
    }
    
    if (!admin) {
      console.error('Admin account not found with ID:', req.params.id);
      return res.status(404).send('Admin account not found');
    }
    
    // Get unique regions for the dropdown menu
    const uniqueRegions = await Post.distinct('region');
    
    res.render('edit-admin', {
      admin,
      user: req.session.user,
      uniqueRegions,
      dashboard: isDashboard // Pass dashboard status
    });
  } catch (error) {
    console.error('Error fetching admin account:', error);
    res.status(500).send('An error occurred while fetching account information');
  }
});

// Route to handle admin account updates
app.post('/account/admin/edit/:id', requireSuperAdmin, async (req, res) => {
  try {
    const ObjectId = require('mongodb').ObjectId;
    let adminIdToEdit;
    try {
      adminIdToEdit = new ObjectId(req.params.id);
    } catch (e) {
      req.flash('error', 'Invalid admin ID format for editing.');
      return res.redirect('/manage-accounts');
    }

    const { username, role, resetPassword } = req.body;

    const adminBeingEdited = await db.collection('admins').findOne({ _id: adminIdToEdit });
    if (!adminBeingEdited) {
        req.flash('error', 'Admin account to edit not found.');
        return res.redirect('/manage-accounts');
    }

    if (role === 'user') {
      // === DEMOTION LOGIC ===
      console.log(`Attempting to demote admin: ${adminBeingEdited.username} (ID: ${adminIdToEdit}) to user.`);

      const adminCount = await db.collection('admins').countDocuments();
      if (adminCount <= 1) {
        req.flash('error', 'Cannot demote the last admin account. Create another admin first.');
        return res.redirect('/manage-accounts');
      }
      
      const defaultUserPassword = 'Robolution@2023'; // Consistent default password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(defaultUserPassword, saltRounds);

      const newUserDetails = {
        username: adminBeingEdited.username,
        email: adminBeingEdited.email && adminBeingEdited.email !== `${adminBeingEdited.username}@robolution.default` 
        ? adminBeingEdited.email 
        : `${adminBeingEdited.username.replace(/\s+/g, '').toLowerCase()}@robolution.default`,
        fullName: adminBeingEdited.fullName || adminBeingEdited.username,
        password: hashedPassword,
        role: 'user',
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: [],
        needs2FASetup: true, 
        createdAt: adminBeingEdited.createdAt || new Date(),
        school: adminBeingEdited.school || '',
        address: adminBeingEdited.address || '',
        profilePicture: adminBeingEdited.profilePicture || null
      };

      const existingUser = await User.findOne({ username: newUserDetails.username });
      if (existingUser) {
          req.flash('error', `Cannot demote: A user account with username '${newUserDetails.username}' already exists.`);
          return res.redirect('/manage-accounts');
      }
      
      const createdUser = await User.create(newUserDetails);
      console.log(`User account created for demoted admin: ${createdUser.username} (ID: ${createdUser._id})`);

      await db.collection('admins').deleteOne({ _id: adminIdToEdit });
      if (robolutionDb) { // Check if robolutionDb is initialized
        await robolutionDb.collection('admins').deleteOne({ _id: adminIdToEdit });
      }
      console.log(`Old admin account deleted: ${adminBeingEdited.username}`);

      req.flash('success', `Admin '${adminBeingEdited.username}' has been successfully demoted to a user. Password reset, 2FA setup required on login.`);
      return res.redirect('/manage-accounts');

    } else {
      // === REGULAR ADMIN UPDATE LOGIC ===
      const updateData = {
        username: username,
        role: role || 'admin' 
      };

      if (resetPassword === 'on') {
        const defaultAdminPassword = 'Robolution@2023';
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(defaultAdminPassword, saltRounds);
        updateData.password = hashedPassword;
        updateData.twoFactorEnabled = false;
        updateData.twoFactorSecret = null;
        updateData.backupCodes = [];
        // For admins, needs2FASetup might not be in their schema, or handled differently.
        // If it exists in admin schema, set it. Otherwise, this might be ignored or cause an error if schema is strict.
        // It's primarily for users. For now, let's assume admin schema is flexible or this field is specific to User model.
        // We can add it if the Admin model is being updated to have this field.
        // updateData.needs2FASetup = true; 
      }

      const adminDbUpdateResult = await db.collection('admins').updateOne(
        { _id: adminIdToEdit },
        { $set: updateData }
      );
      let robolutionDbAdminUpdateResult = { modifiedCount: 0, matchedCount: 0 };
      if (robolutionDb) { // Check if robolutionDb is initialized
        robolutionDbAdminUpdateResult = await robolutionDb.collection('admins').updateOne(
            { _id: adminIdToEdit },
            { $set: updateData }
        );
      }

      if (adminDbUpdateResult.modifiedCount > 0 || robolutionDbAdminUpdateResult.modifiedCount > 0) {
         req.flash('success', `Admin account '${updateData.username}' updated successfully.`);
      } else if (adminDbUpdateResult.matchedCount > 0 || robolutionDbAdminUpdateResult.matchedCount > 0) {
         req.flash('info', 'No changes were made to the admin account.');
      } else {
         req.flash('error', 'Failed to find the admin account to update.');
      }
      res.redirect('/manage-accounts');
    }
  } catch (error) {
    console.error('Error updating/demoting admin account:', error);
    req.flash('error', 'An error occurred while updating/demoting the account.');
    res.redirect('/manage-accounts');
  }
});

// Route to edit regular user account
app.get('/account/user/edit/:id', requireSuperAdmin, async (req, res) => {
  try {
    let user = null;
    
    // Try multiple methods to find the user
    try {
      // First try standard mongoose findById
      user = await User.findById(req.params.id);
      
      // If not found and ID seems to be a valid MongoDB ObjectId string
      if (!user && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Try with new ObjectId
        const ObjectId = mongoose.Types.ObjectId;
        const userId = new ObjectId(req.params.id);
        user = await User.findOne({ _id: userId });
      }
      
      // Try as string ID if still not found
      if (!user) {
        user = await User.findOne({ _id: req.params.id });
      }
      
      // Try by username if still not found
      if (!user) {
        user = await User.findOne({ username: req.params.id });
      }
    } catch (idError) {
      console.error('Error looking up user account:', idError);
    }
    
    if (!user) {
      console.error('User account not found with ID:', req.params.id);
      return res.status(404).send('User account not found');
    }
    
    // Get unique regions for the dropdown menu
    const uniqueRegions = await Post.distinct('region');
    
    res.render('edit-user', {
      userAccount: user,
      currentUser: req.session.user,
      uniqueRegions
    });
  } catch (error) {
    console.error('Error fetching user account:', error);
    res.status(500).send('An error occurred while fetching account information');
  }
});

// Route to handle user account updates
app.post('/account/user/edit/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { username, fullName, email, resetPassword, twoFactorEnabled } = req.body;
    
    // Convert string ID to ObjectId safely
    let userId;
    try {
      const ObjectId = mongoose.Types.ObjectId;
      userId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error('Failed to convert user ID to ObjectId:', idError);
      userId = req.params.id; // Fallback to string ID
    }
    
    // Prepare update data
    const updateData = {
      username,
      fullName,
      email,
      twoFactorEnabled: twoFactorEnabled === 'on'
    };
    
    // If reset password flag is set, hash a new default password
    if (resetPassword === 'on') {
      const defaultPassword = 'Robolution@2023'; // Default password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
      updateData.password = hashedPassword;
    }
    
    // Find user first to ensure it exists
    const user = await User.findById(userId);
    
    if (!user) {
      console.error(`User not found with ID ${req.params.id}`);
      req.flash('error', 'User account not found');
      return res.redirect('/manage-accounts');
    }
    
    // Update the user account
    await User.findByIdAndUpdate(userId, updateData);
    
    req.flash('success', `User account ${username} updated successfully`);
    res.redirect('/manage-accounts');
  } catch (error) {
    console.error('Error updating user account:', error);
    req.flash('error', 'An error occurred while updating the account');
    res.redirect('/manage-accounts');
  }
});

// Admin User Profile Management Routes
// Route to view all user profiles with search capability
app.get('/admin/user-profiles', requireAdmin, async (req, res) => {
  try {
    const isDashboard = req.query.dashboard === 'true';
    const search = req.query.search || '';
    let query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { school: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(query).sort({ createdAt: -1 });
    const posts = await Post.find({}); // For uniqueRegions in header/sidebar if needed
    const uniqueRegions = [...new Set(posts.filter(post => post.region && post.region !== 'All').map(post => post.region))].sort();

    res.render('admin-user-profiles', {
      users,
      search,
      user: req.session.user,
      uniqueRegions,
      dashboard: isDashboard
    });
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    res.status(500).send('Error fetching user profiles');
  }
});

// Route to view specific user profile as admin
app.get('/admin/user-profiles/:id', requireAdmin, async (req, res) => {
  try {
    const isDashboard = req.query.dashboard === 'true';
    let userProfile = null;
    // Using a more robust findById approach
    const usersCollection = robolutionDb.collection('users');
    const userId = req.params.id;

    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
        userProfile = await usersCollection.findOne({ _id: new ObjectId(userId) });
    } else {
        userProfile = await usersCollection.findOne({ _id: userId });
    }
    if (!userProfile) {
        userProfile = await usersCollection.findOne({ username: userId });
    }

    if (!userProfile) {
      req.flash('error', 'User not found.');
      return res.redirect('/admin/user-profiles' + (isDashboard ? '?dashboard=true' : ''));
    }

    let age = null;
    if (userProfile.birthDate && userProfile.birthDate.month && userProfile.birthDate.year) {
      const birthDate = new Date(userProfile.birthDate.year, userProfile.birthDate.month - 1);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }
    const posts = await Post.find({}); // For uniqueRegions in header/sidebar if needed
    const uniqueRegions = [...new Set(posts.filter(post => post.region && post.region !== 'All').map(post => post.region))].sort();

    res.render('admin-view-user-profile', {
      userProfile,
      age,
      profilePicture: userProfile.profilePicture || '/images/default-profile.jpg',
      user: req.session.user,
      uniqueRegions,
      dashboard: isDashboard
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Error fetching user profile');
  }
});

// Route to edit user profile as admin
app.get('/admin/user-profiles/:id/edit', requireAdmin, async (req, res) => {
  try {
    let userProfile = null;
    
    // Try multiple methods to find the user
    try {
      // First try standard mongoose findById
      userProfile = await User.findById(req.params.id);
      
      // If not found and ID seems to be a valid MongoDB ObjectId string
      if (!userProfile && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Try with new ObjectId
        const ObjectId = mongoose.Types.ObjectId;
        const userId = new ObjectId(req.params.id);
        userProfile = await User.findOne({ _id: userId });
      }
      
      // Try as string ID if still not found
      if (!userProfile) {
        userProfile = await User.findOne({ _id: req.params.id });
      }
      
      // Try by username if still not found
      if (!userProfile) {
        userProfile = await User.findOne({ username: req.params.id });
      }
    } catch (idError) {
      console.error('Error looking up user profile:', idError);
    }
    
    if (!userProfile) {
      console.error('User not found with ID:', req.params.id);
      return res.status(404).send('User not found');
    }
    
    // Get unique regions for the dropdown menu
    const uniqueRegions = await Post.distinct('region');
    
    res.render('admin-edit-user-profile', {
      userProfile,
      user: req.session.user,
      uniqueRegions
    });
  } catch (error) {
    console.error('Error fetching user profile for edit:', error);
    res.status(500).send('Error fetching user profile');
  }
});

// API to update user profile as admin
app.post('/admin/user-profiles/:id/update', requireAdmin, upload.single('profilePicture'), async (req, res) => {
  try {
    const { fullName, email, birthMonth, birthYear, school, address } = req.body;
    
    // Convert string ID to ObjectId safely
    let userId;
    try {
      const ObjectId = mongoose.Types.ObjectId;
      userId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error('Failed to convert user ID to ObjectId:', idError);
      userId = req.params.id; // Fallback to string ID
    }
    
    // Try to find user with multiple methods
    let userProfile = await User.findById(userId);
    
    // If not found and ID seems to be a valid MongoDB ObjectId string
    if (!userProfile && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('User not found by ID, trying alternative lookup methods');
      
      // Try to find by string ID directly
      userProfile = await User.findOne({ _id: req.params.id });
    }
    
    if (!userProfile) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update fields
    if (fullName) userProfile.fullName = fullName;
    if (email) userProfile.email = email;
    
    // Update birth date
    if (birthMonth && birthYear) {
      userProfile.birthDate = {
        month: parseInt(birthMonth),
        year: parseInt(birthYear)
      };
    }
    
    if (school !== undefined) userProfile.school = school;
    if (address !== undefined) userProfile.address = address;
    
    // Handle profile picture upload
    if (req.file) {
      try {
        const filePath = req.file.path; // Path from multer
        console.log('[PROFILE UPDATE] Uploading file from path:', filePath);
        const result = await uploadToCloudinary(filePath, 'robolution/profiles');
        console.log('[PROFILE UPDATE] Cloudinary upload result:', result);
        
        if (result && result.secure_url) {
          userProfile.profilePicture = result.secure_url;
          console.log('[PROFILE UPDATE] Attempting to set user.profilePicture to:', userProfile.profilePicture);
        } else {
          console.error('[PROFILE UPDATE] Cloudinary did not return a secure_url. Result:', result);
        }
        
        // Clean up temp file if it exists
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log('[PROFILE UPDATE] Deleted temp file:', filePath);
          } catch (unlinkErr) {
            console.error('[PROFILE UPDATE] Error deleting temp file:', unlinkErr);
          }
        }
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return res.status(500).json({ 
          success: false, 
          message: 'Error uploading profile picture' 
        });
      }
    }
    
    console.log('[PROFILE UPDATE] User object before save:', JSON.stringify(userProfile.toObject ? userProfile.toObject() : userProfile, null, 2));
    await userProfile.save();
    console.log('[PROFILE UPDATE] User object after save, profilePicture should be:', userProfile.profilePicture);
    
    // If it's an AJAX request, send JSON response
    if (req.xhr || req.headers.accept.includes('json')) {
      res.json({ success: true, message: 'Profile updated successfully', profilePicture: userProfile.profilePicture });
    } else {
      // Otherwise redirect to view profile page
      res.redirect('/admin/user-profiles/' + req.params.id);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // If it's an AJAX request, send JSON response
    if (req.xhr || req.headers.accept.includes('json')) {
      res.status(500).json({ success: false, message: 'Error updating profile' });
    } else {
      res.status(500).send('An error occurred while updating the profile');
    }
  }
});

// Route to delete admin account
app.get('/account/admin/delete/:id', requireSuperAdmin, async (req, res) => {
  try {
    const ObjectId = require('mongodb').ObjectId;
    let adminId;
    try {
      adminId = new ObjectId(req.params.id);
    } catch (e) {
      req.flash('error', 'Invalid admin ID format.');
      return res.redirect('/manage-accounts');
    }

    // Check if this is the last admin account (checking both DBs for safety, though one should suffice if synced)
    const adminDbCount = await db.collection('admins').countDocuments();
    // const robolutionDbAdminCount = await robolutionDb.collection('admins').countDocuments(); 
    // It's safer to rely on the primary admin DB count for this rule.
    if (adminDbCount <= 1) {
      req.flash('error', 'Cannot delete the last admin account.');
      return res.redirect('/manage-accounts');
    }

    // Check if the admin is trying to delete their own account
    if (req.session.user.id === req.params.id) {
      req.flash('error', 'You cannot delete your own admin account directly. Another superadmin must do this.');
      return res.redirect('/manage-accounts');
    }

    // Delete the admin account from adminDB
    const adminDbResult = await db.collection('admins').deleteOne({ _id: adminId });
    
    // Also delete from robolutionDb admins collection for consistency
    const robolutionDbResult = await robolutionDb.collection('admins').deleteOne({ _id: adminId });

    if (adminDbResult.deletedCount > 0 || robolutionDbResult.deletedCount > 0) {
      req.flash('success', 'Admin account deleted successfully from all records.');
    } else {
      req.flash('error', 'Admin account not found or could not be deleted.');
    }
    
    res.redirect('/manage-accounts');
  } catch (error) {
    console.error('Error deleting admin account:', error);
    req.flash('error', 'An error occurred while deleting the admin account.');
    res.redirect('/manage-accounts');
  }
});

// Route to delete regular user account
app.get('/account/user/delete/:id', requireSuperAdmin, async (req, res) => {
  try {
    // Convert string ID to ObjectId safely
    let userId;
    try {
      const ObjectId = mongoose.Types.ObjectId;
      userId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error('Failed to convert user ID to ObjectId:', idError);
      userId = req.params.id; // Fallback to string ID
    }
    
    // Don't allow deleting your own account through this route
    if (req.session.user.id === req.params.id) {
      req.flash('error', 'You cannot delete your own account through this route.');
      return res.redirect('/manage-accounts');
    }
    
    // First find the user to ensure it exists
    let user = await User.findById(userId);
    
    // If not found, try alternative lookup methods
    if (!user && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('User not found by ID, trying alternative lookup methods');
      
      // Try to find by string ID directly
      user = await User.findOne({ _id: req.params.id });
    }
    
    if (!user) {
      req.flash('error', 'User account not found.');
      return res.redirect('/manage-accounts');
    }
    
    // Use the Mongoose method directly with the found user
    await User.deleteOne({ _id: user._id });
    
    req.flash('success', 'User account deleted successfully.');
    res.redirect('/manage-accounts');
  } catch (error) {
    console.error('Error deleting user account:', error);
    req.flash('error', 'An error occurred while deleting the user account.');
    res.redirect('/manage-accounts');
  }
});

// Route for 2FA confirmation page
app.get('/2fa-confirmation', async (req, res) => {
    try {
        const { username, password } = req.query;
        
        console.log('Starting 2FA setup for user:', username);
        
        if (!username || !password) {
            console.error('Missing username or password in 2FA setup');
            return res.redirect('/login');
        }
        
        // Check if username exists and password is correct
        let user = await User.findOne({ username });
        let isAdmin = false;
        
        if (!user) {
            // Check admin collection
            user = await db.collection('admins').findOne({ username });
            if (user) {
                isAdmin = true;
            }
        }
        
        if (!user) {
            return res.redirect('/login');
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.redirect('/login');
        }
        
        // Generate a new secret for 2FA
        const secret = speakeasy.generateSecret({
            length: 20,
            name: `Robolution:${username}`
        });
        
        // Generate QR code
        const otpauthUrl = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `Robolution:${username}`,
            issuer: 'Robolution',
            encoding: 'base32'
        });
        
        const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
        
        // Generate backup codes
        const backupCodes = Array(8).fill().map(() => 
            Math.random().toString(36).substring(2, 8).toUpperCase()
        );
        
        // Render the confirmation page
        res.render('UserViews/2fa-confirmation', {
            username,
            password,
            qrCodeUrl,
            secret: secret.base32,
            backupCodes
        });
    } catch (error) {
        console.error('Error in 2FA confirmation page:', error);
        res.redirect('/login');
    }
});

// Route to verify and enable 2FA during login
app.post('/verify-login-2fa', async (req, res) => {
    try {
        const { username, password, token, secret } = req.body;
        
        if (!username || !password || !token || !secret) {
            return res.redirect('/login');
        }
        
        // Verify the token against the secret
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 1
        });
        
        console.log('2FA verification during setup:', {
            token: token,
            secret: secret,
            verified: verified
        });
        
        if (!verified) {
            return res.render('UserViews/2fa-confirmation', {
                username,
                password,
                qrCodeUrl: await qrcode.toDataURL(speakeasy.otpauthURL({
                    secret: secret,
                    label: `Robolution:${username}`,
                    issuer: 'Robolution',
                    encoding: 'base32'
                })),
                secret,
                error: 'Invalid verification code. Please try again.'
            });
        }
        
        // Generate backup codes
        const backupCodes = Array(8).fill().map(() => 
            Math.random().toString(36).substring(2, 8).toUpperCase()
        );
        
        // Save the 2FA secret and enable 2FA
        let user = await User.findOne({ username });
        let isAdmin = false;
        
        if (user) {
            // Instead of using Mongoose save() which might have issues with _id types,
            // use direct MongoDB update which is more reliable
            try {
                const { ObjectId } = require('mongodb');
                const userId = new ObjectId(user._id);
                
                console.log('Updating user 2FA settings with ID:', userId);
                
                // Update using native MongoDB driver
                const updateResult = await db.collection('users').updateOne(
                    { _id: userId },
                    { 
                        $set: {
                            twoFactorSecret: secret,
                            twoFactorEnabled: true,
                            backupCodes,
                            needs2FASetup: false
                        }
                    }
                );
                
                // Log the result for debugging
                console.log('Database update result for 2FA setup:', updateResult);
                
                // Verify the update was applied
                const updatedUser = await db.collection('users').findOne({ _id: userId });
                
                if (updatedUser) {
                    console.log('User 2FA after update:', {
                        userId: userId.toString(),
                        username: updatedUser.username,
                        twoFactorEnabled: updatedUser.twoFactorEnabled,
                        hasSecret: !!updatedUser.twoFactorSecret,
                        secretLength: updatedUser.twoFactorSecret ? updatedUser.twoFactorSecret.length : 0
                    });
                } else {
                    console.error('Failed to retrieve updated user record! Database update may have failed.');
                }
                
                // Update the user object for session
                user.twoFactorSecret = secret;
                user.twoFactorEnabled = true;
                user.backupCodes = backupCodes;
            } catch (updateError) {
                console.error('Error updating user 2FA settings:', updateError);
                // Fallback to traditional Mongoose save if direct update fails
                user.twoFactorSecret = secret;
                user.twoFactorEnabled = true;
                user.backupCodes = backupCodes;
                user.needs2FASetup = false;
                await user.save();
            }
        } else {
            // Check admin collection
            const adminUser = await db.collection('admins').findOne({ username });
            if (adminUser) {
                // Update admin - use _id for more reliable update
                const { ObjectId } = require('mongodb');
                const adminId = new ObjectId(adminUser._id);
                
                console.log('Updating admin 2FA settings with ID:', adminId);
                
                // Update admin with _id field instead of username
                const updateResult = await db.collection('admins').updateOne(
                    { _id: adminId },
                    { 
                        $set: {
                            twoFactorSecret: secret,
                            twoFactorEnabled: true,
                            backupCodes,
                            needs2FASetup: false // Clear the flag
                        }
                    }
                );
                
                // Log the result for debugging
                console.log('Database update result for admin 2FA setup:', updateResult);
                
                // Verify the update was applied
                const updatedAdmin = await db.collection('admins').findOne({ _id: adminId });
                
                if (updatedAdmin) {
                    console.log('Admin 2FA after update:', {
                        adminId: adminId.toString(),
                        username: updatedAdmin.username,
                        twoFactorEnabled: updatedAdmin.twoFactorEnabled,
                        hasSecret: !!updatedAdmin.twoFactorSecret,
                        secretLength: updatedAdmin.twoFactorSecret ? updatedAdmin.twoFactorSecret.length : 0
                    });
                } else {
                    console.error('Failed to retrieve updated admin record! Database update may have failed.');
                }
                
                isAdmin = true;
            } else {
                return res.redirect('/login');
            }
        }
        
        // Log the user in automatically
        if (isAdmin) {
            const adminUser = await db.collection('admins').findOne({ username });
            req.session.user = {
                id: adminUser._id.toString(),
                username: adminUser.username,
                isAdmin: true,
                role: adminUser.role || 'admin'
            };
        } else {
            req.session.user = {
                id: user._id.toString(),
                username: user.username,
                isAdmin: false,
                role: 'user'
            };
        }
        
        // Save session
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        
        // Render success page
        res.render('UserViews/2fa-success', {
            message: 'Two-factor authentication has been successfully set up!',
            backupCodes,
            redirectUrl: isAdmin ? '/index' : '/home'
        });
    } catch (error) {
        console.error('Error verifying 2FA during login:', error);
        res.redirect('/login');
    }
});

// User profile routes

// Route to update user profile
app.post('/profile/update', requireLogin, upload.single('profilePicture'), async (req, res) => {
  try {
    const { email, birthMonth, birthYear, school, address } = req.body;
    const user = await User.findById(req.session.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Handle email update
    if (email && email !== user.email) {
      // Check if the new email is already in use
      const existingUserWithNewEmail = await User.findOne({ email: email });
      if (existingUserWithNewEmail && existingUserWithNewEmail._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Email already in use by another account.' });
      }
      // Basic email format validation (you might want a more robust one)
      if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
      }
      user.email = email;
    }

    if (birthMonth && birthYear) {
      user.birthDate = { month: parseInt(birthMonth), year: parseInt(birthYear) };
    }
    
    if (school) user.school = school;
    if (address) user.address = address;
    
    // Handle profile picture upload
    if (req.file) {
      try {
        const filePath = req.file.path; // Path from multer
        console.log('[PROFILE UPDATE] Uploading file from path:', filePath);
        const result = await uploadToCloudinary(filePath, 'robolution/profiles');
        console.log('[PROFILE UPDATE] Cloudinary upload result:', result);
        
        if (result && result.secure_url) {
          user.profilePicture = result.secure_url;
          console.log('[PROFILE UPDATE] Attempting to set user.profilePicture to:', user.profilePicture);
        } else {
          console.error('[PROFILE UPDATE] Cloudinary did not return a secure_url. Result:', result);
        }
        
        // Clean up temp file if it exists
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log('[PROFILE UPDATE] Deleted temp file:', filePath);
          } catch (unlinkErr) {
            console.error('[PROFILE UPDATE] Error deleting temp file:', unlinkErr);
          }
        }
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return res.status(500).json({ 
          success: false, 
          message: 'Error uploading profile picture' 
        });
      }
    }
    
    console.log('[PROFILE UPDATE] User object before save:', JSON.stringify(user.toObject ? user.toObject() : user, null, 2));
    await user.save();
    console.log('[PROFILE UPDATE] User object after save, profilePicture should be:', user.profilePicture);
    res.json({ success: true, message: 'Profile updated successfully', profilePicture: user.profilePicture });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

// Route to check username availability for users
app.get('/api/check-username', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const existingUser = await User.findOne({ username: username });
        res.json({ available: !existingUser });
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to deny a registration
app.post('/registration/deny', async (req, res) => {
  try {
    const { registrationId, deniedReason, deniedMessage } = req.body;
    
    // Validate the required fields
    if (!registrationId || !deniedReason) {
      return res.status(400).send('Missing required fields');
    }
    
    // Update the registration
    await Registration.findByIdAndUpdate(registrationId, {
      denied: true,
      deniedReason,
      deniedMessage,
      deniedBy: req.session.user.username,
      deniedAt: new Date(),
      verified: false // Reset verified status
    });
    
    res.redirect('/manage-registrations?verified=denied');
  } catch (error) {
    console.error('Error denying registration:', error);
    res.status(500).send('An error occurred while denying the registration');
  }
});

// API route to update registration status
app.post('/registration/update-status/:id', async (req, res) => {
  try {
    const { denied } = req.body;
    const registrationId = req.params.id;
    
    // Validate registration ID
    if (!registrationId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Registration ID is required' 
      });
    }
    
    // Find the registration
    const registration = await Registration.findById(registrationId);
    
    if (!registration) {
      return res.status(404).json({ 
        success: false, 
        error: 'Registration not found' 
      });
    }
    
    // Update the registration based on the denied flag
    if (denied) {
      // This branch is for setting a registration to denied again
      await Registration.findByIdAndUpdate(registrationId, {
        denied: true
      });
    } else {
      // This branch is for changing from denied to unverified
      await Registration.findByIdAndUpdate(registrationId, {
        denied: false,
        deniedReason: null,
        deniedMessage: null,
        deniedBy: null,
        deniedAt: null
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating registration status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'An error occurred while updating the registration status' 
    });
  }
});

// Admin password reset route
app.get('/account/admin/reset-password/:id', requireSuperAdmin, async (req, res) => {
  try {
    const adminId = req.params.id;
    
    // Find the admin account
    const admin = await Admin.findById(adminId);
    if (!admin) {
      req.flash('error', 'Admin account not found.');
      return res.redirect('/manage-accounts');
    }
    
    // Generate a temporary password (alphanumeric, 10 characters)
    const tempPassword = Math.random().toString(36).substring(2, 12);
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    // Update the admin's password and require 2FA setup on next login
    admin.password = hashedPassword;
    admin.twoFactorEnabled = false; // Disable 2FA
    admin.needs2FASetup = true; // Flag that user needs to set up 2FA on next login
    await admin.save();
    
    req.flash('success', `Password for ${admin.username} has been reset. Temporary password: ${tempPassword}`);
    res.redirect('/manage-accounts');
  } catch (error) {
    console.error('Error resetting admin password:', error);
    req.flash('error', 'An error occurred while resetting the admin password.');
    res.redirect('/manage-accounts');
  }
});

// User password reset route
app.get('/account/user/reset-password/:id', requireSuperAdmin, async (req, res) => {
  try {
    // Convert string ID to ObjectId safely
    let userId;
    try {
      const ObjectId = mongoose.Types.ObjectId;
      userId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error('Failed to convert user ID to ObjectId:', idError);
      userId = req.params.id; // Fallback to string ID
    }
    
    // Find the user account - try multiple methods
    let user = await User.findById(userId);
    
    // If not found and ID seems to be a valid MongoDB ObjectId string
    if (!user && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('User not found by ID, trying alternative lookup methods');
      
      // Try to find by string ID directly
      user = await User.findOne({ _id: req.params.id });
    }
    
    if (!user) {
      req.flash('error', 'User account not found.');
      return res.redirect('/manage-accounts');
    }
    
    // Generate a temporary password (alphanumeric, 10 characters)
    const tempPassword = Math.random().toString(36).substring(2, 12);
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    // Update the user's password and require 2FA setup on next login
    user.password = hashedPassword;
    user.twoFactorEnabled = false; // Disable 2FA
    user.needs2FASetup = true; // Flag that user needs to set up 2FA on next login
    await user.save();
    
    req.flash('success', `Password for ${user.username} has been reset. Temporary password: ${tempPassword}`);
    res.redirect('/manage-accounts');
  } catch (error) {
    console.error('Error resetting user password:', error);
    req.flash('error', 'An error occurred while resetting the user password.');
    res.redirect('/manage-accounts');
  }
});

// User password change route
app.post('/account/user/change-password/:id', requireSuperAdmin, async (req, res) => {
  try {
    // Convert string ID to ObjectId safely
    let userId;
    try {
      const ObjectId = mongoose.Types.ObjectId;
      userId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error('Failed to convert user ID to ObjectId:', idError);
      userId = req.params.id; // Fallback to string ID
    }
    
    const { password, confirmPassword } = req.body;
    
    // Validate passwords
    if (!password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Both password fields are required.' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }
    
    // Find the user account - try multiple methods
    let user = await User.findById(userId);
    
    // If not found and ID seems to be a valid MongoDB ObjectId string
    if (!user && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('User not found by ID, trying alternative lookup methods');
      
      // Try to find by string ID directly
      user = await User.findOne({ _id: req.params.id });
    }
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the user's password but maintain 2FA status
    user.password = hashedPassword;

    // Check if 2FA needs to be enforced
    let force2FASetup = false;
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      user.needs2FASetup = true;
      force2FASetup = true;
    }
    
    await user.save();

    if (force2FASetup) {
      // Destroy session and force re-login to go through 2FA setup
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session after password change for 2FA setup:', err);
          // Still send a success message, but log the session error
          return res.json({ 
            success: true, 
            message: 'Password changed successfully. Please log in again to set up Two-Factor Authentication.', 
            needsReLogin: true 
          });
        }
        res.clearCookie('robolution_session'); // Ensure cookie is cleared
        return res.json({ 
          success: true, 
          message: 'Password changed successfully. Please log in again to set up Two-Factor Authentication.', 
          needsReLogin: true 
        });
      });
    } else {
      res.json({ success: true, message: 'Password changed successfully' });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'An error occurred while changing the password.' });
  }
});

// Database backup management route
app.get('/manage-backups', requireSuperAdmin, async (req, res) => {
  try {
    const isDashboard = req.query.dashboard === 'true';
    // Optional: Add superadmin check if only superadmins can manage backups
    if (req.session.user.role !== 'superadmin') {
        req.flash('error', 'You are not authorized to manage backups.');
        // Redirect to dashboard or another appropriate page if loaded in iframe
        if (isDashboard) {
             return res.status(403).send('Unauthorized. This content would normally redirect.'); // Or render a simple error view
        }
        return res.redirect('/admin-dashboard'); 
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('robolution');
    const rawBackups = await db.collection('database_backups')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    const backups = rawBackups.map(backup => ({
      name: backup.backupId,
      timestamp: backup.timestamp,
      size: backup.size ? (backup.size / (1024 * 1024)).toFixed(2) + ' MB' : '0.05 MB',
      files: backup.files || [],
      metadataUrl: backup.metadataUrl,
      _id: backup._id
    }));
    
    const posts = await Post.find({}); // For uniqueRegions in header/sidebar if needed
    const uniqueRegions = [...new Set(posts.filter(post => post.region && post.region !== 'All').map(post => post.region))].sort();

    res.render('manage-backups', {
      title: 'Manage Database Backups | Robolution Admin',
      user: req.session.user,
      backups: backups,
      moment: moment, // Pass moment for date formatting
      uniqueRegions,
      dashboard: isDashboard,
      success: req.flash ? req.flash('success') : [],
      error: req.flash ? req.flash('error') : []
    });
    await client.close();
  } catch (error) {
    console.error('Error accessing backups page:', error);
    req.flash('error', 'An error occurred while accessing database backups.');
    if (isDashboard) {
        return res.status(500).send('Error loading backup information.');
    }
    res.redirect('/admin-dashboard'); // Or appropriate error page
  }
});

// Trigger a manual backup
app.post('/trigger-backup', requireSuperAdmin, async (req, res) => {
  try {
    const backupsDir = path.join(__dirname, 'database_backups');
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `backup-${timestamp}`;
    const backupPath = path.join(backupsDir, backupId);
    
    // Create timestamp directory
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }
    
    // Get a client to the MongoDB database
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const dbName = 'robolution'; // Your database name
    const db = client.db(dbName);
    
    // Get all collections in the database
    const collections = await db.listCollections().toArray();
    
    // Store information about all files uploaded
    const uploadedFiles = [];
    
    // For each collection, export all documents to a JSON file and upload to Cloudinary
    for (const collection of collections) {
      const collectionName = collection.name;
      const documents = await db.collection(collectionName).find({}).toArray();
      
      // Save documents to a JSON file temporarily
      const collectionFile = path.join(backupPath, `${collectionName}.json`);
      fs.writeFileSync(collectionFile, JSON.stringify(documents, null, 2));
      
      // Upload the JSON file to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(collectionFile, `robolution/backups/${backupId}`);
      uploadedFiles.push({
        collection: collectionName,
        url: cloudinaryResult,
        documentCount: documents.length
      });
    }
    
    // Write metadata about the backup
    const metadata = {
      timestamp: timestamp,
      date: new Date().toString(),
      databaseName: dbName,
      collections: collections.map(c => c.name),
      backupType: 'cloudinary_export',
      files: uploadedFiles,
      triggeredBy: req.session.user.username
    };
    
    // Save metadata file
    const metadataFile = path.join(backupPath, 'backup-metadata.json');
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
    
    // Upload metadata file to Cloudinary
    const metadataUrl = await uploadToCloudinary(metadataFile, `robolution/backups/${backupId}`);
    
    // Save backup record to the database
    await db.collection('database_backups').insertOne({
      backupId,
      timestamp: new Date(),
      metadataUrl,
      files: uploadedFiles,
      size: uploadedFiles.reduce((acc, file) => acc + (file.size || 0), 0)
    });
    
    // Clean up temporary files
    try {
      fs.rm(backupPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(`Error cleaning up temporary backup files: ${err.message}`);
        } else {
          console.log(`Cleaned up temporary backup directory: ${backupPath}`);
        }
      });
    } catch (cleanupError) {
      console.error(`Error during backup cleanup: ${cleanupError.message}`);
    }
    
    // Close the client
    await client.close();
    
    req.flash('success', 'Database backup created successfully.');
    res.redirect('/manage-backups');
  } catch (error) {
    console.error('Error triggering backup:', error);
    req.flash('error', 'An error occurred while triggering the backup.');
    res.redirect('/manage-backups');
  }
});

// Delete a backup
app.get('/delete-backup/:name', requireSuperAdmin, async (req, res) => {
  try {
    const backupId = req.params.name;
    if (!backupId || !backupId.startsWith('backup-')) {
      req.flash('error', 'Invalid backup name.');
      return res.redirect('/manage-backups');
    }
    
    // Connect to the database
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('robolution');
    
    // Find the backup record
    const backup = await db.collection('database_backups').findOne({ backupId });
    
    if (!backup) {
      req.flash('error', 'Backup not found.');
      await client.close();
      return res.redirect('/manage-backups');
    }
    
    // Delete each file from Cloudinary
    if (backup.files && backup.files.length > 0) {
      for (const file of backup.files) {
        if (file.url) {
          try {
            let publicId;
            // Handle both string URLs and object URLs
            if (typeof file.url === 'string') {
              const urlParts = file.url.split('/');
              publicId = `robolution/backups/${backupId}/${urlParts[urlParts.length - 1].split('.')[0]}`;
            } else if (file.url.public_id) {
              // If it's an object with public_id, use it directly
              publicId = file.url.public_id;
            } else if (file.url.secure_url) {
              // If it has secure_url, extract from that
              const urlParts = file.url.secure_url.split('/');
              publicId = `robolution/backups/${backupId}/${urlParts[urlParts.length - 1].split('.')[0]}`;
            } else {
              console.log(`Skipping file deletion: URL format not recognized`, file.url);
              return; // Using return instead of continue since we're in a try block
            }
            
            // Delete from Cloudinary
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted Cloudinary file: ${publicId}`);
          } catch (err) {
            console.error(`Error deleting Cloudinary file: ${err.message}`);
          }
        }
      }
    }
    
    // Delete metadata from Cloudinary if it exists
    if (backup.metadataUrl) {
      try {
        let publicId;
        // Handle both string URLs and object URLs
        if (typeof backup.metadataUrl === 'string') {
          const urlParts = backup.metadataUrl.split('/');
          publicId = `robolution/backups/${backupId}/${urlParts[urlParts.length - 1].split('.')[0]}`;
        } else if (backup.metadataUrl.public_id) {
          // If it's an object with public_id, use it directly
          publicId = backup.metadataUrl.public_id;
        } else if (backup.metadataUrl.secure_url) {
          // If it has secure_url, extract from that
          const urlParts = backup.metadataUrl.secure_url.split('/');
          publicId = `robolution/backups/${backupId}/${urlParts[urlParts.length - 1].split('.')[0]}`;
        } else {
          console.log(`Skipping metadata deletion: URL format not recognized`, backup.metadataUrl);
          return; // Using return instead of continue since we're in a try block
        }
        
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted Cloudinary metadata file: ${publicId}`);
      } catch (err) {
        console.error(`Error deleting Cloudinary metadata file: ${err.message}`);
      }
    }
    
    // Delete the backup record from the database
    await db.collection('database_backups').deleteOne({ _id: backup._id });
    
    await client.close();
    req.flash('success', 'Backup deleted successfully.');
    res.redirect('/manage-backups');
  } catch (error) {
    console.error('Error deleting backup:', error);
    req.flash('error', 'An error occurred while deleting the backup.');
    res.redirect('/manage-backups');
  }
});

// Restore from a backup
app.get('/restore-backup/:name', requireSuperAdmin, async (req, res) => {
  console.log(`[Restore Route] Entered /restore-backup/:name for backup: ${req.params.name}`);
  try {
    const backupId = req.params.name;
    if (!backupId || !backupId.startsWith('backup-')) {
      console.log('[Restore Route] Invalid backup name.');
      req.flash('error', 'Invalid backup name.');
      return res.redirect('/manage-backups');
    }
    
    console.log('[Restore Route] Creating temp directory...');
    // Create temp directory for restoration
    const restorePath = path.join(__dirname, 'database_backups', 'restore_temp');
    if (!fs.existsSync(restorePath)) {
      fs.mkdirSync(restorePath, { recursive: true });
    }
    
    // Connect to the database to find the backup record
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const localRobolutionDb = client.db('robolution'); // Use this for all robolution db operations in restore
    const adminDbForRestore = client.db('adminDB'); // Can use a specific client for adminDB too if preferred, or global db
    
    // Find the backup record in robolutionDb using local client
    const backup = await localRobolutionDb.collection('database_backups').findOne({ backupId });
    
    if (!backup) {
      console.log('[Restore Route] Backup not found in database.');
      req.flash('error', 'Backup not found.');
      await client.close();
      return res.redirect('/manage-backups');
    }
    
    console.log(`[Restore Route] Starting database restoration from backup: ${backupId}`);
    
    // Download all backup files from Cloudinary to temp directory
    if (!backup.files || backup.files.length === 0) {
      console.log('[Restore Route] Backup files information is missing.');
      req.flash('error', 'Backup files information is missing.');
      await client.close();
      return res.redirect('/manage-backups');
    }

    // First, backup current users collection to preserve active user accounts
    console.log('[Restore Route] Backing up current user accounts before restoration...');
    const currentUsers = await localRobolutionDb.collection('users').find({}).toArray();
    const currentAdmins = await localRobolutionDb.collection('admins').find({}).toArray();
    
    // Store current session user for special handling
    const currentAdminUser = req.session.user;
    
    // Create maps of existing users and admins by username for quick lookup
    const existingUsersMap = {};
    currentUsers.forEach(user => {
      if (user.username) {
        existingUsersMap[user.username] = user;
      }
    });
    
    const existingAdminsMap = {};
    currentAdmins.forEach(admin => {
      if (admin.username) {
        existingAdminsMap[admin.username] = admin;
      }
    });
    
    console.log(`Preserved ${Object.keys(existingUsersMap).length} existing user accounts and ${Object.keys(existingAdminsMap).length} admin accounts`);
    
    // Helper function to convert string IDs to ObjectIds consistently
    const processDocument = (doc) => {
      if (doc === null || typeof doc !== 'object' || doc instanceof ObjectId || doc instanceof Date) {
        return doc; // Return BSON types, null, or non-objects as is
      }
    
      const newDoc = Array.isArray(doc) ? [] : {};
    
      for (const key in doc) {
        if (Object.prototype.hasOwnProperty.call(doc, key)) {
          const value = doc[key];
    
          if (value instanceof ObjectId || value instanceof Date) {
            newDoc[key] = value; // Preserve existing ObjectId or Date instances
          } else if (typeof value === 'string' && key === '_id' && /^[0-9a-fA-F]{24}$/.test(value)) {
            // If it's a string _id that looks like an ObjectId, try to convert it
            try {
              newDoc[key] = new ObjectId(value);
            } catch (e) {
              console.warn(`Could not convert string _id "${value}" to ObjectId: ${e.message}. Keeping as string.`);
              newDoc[key] = value; // Keep as string if conversion fails
            }
          } else if (value && typeof value === 'object' && value.$date && typeof value.$date === 'string') {
            // Handle BSON $date representation from JSON
            try {
              newDoc[key] = new Date(value.$date);
            } catch (e) {
              console.warn(`Could not convert $date "${value.$date}" to Date: ${e.message}. Keeping original structure.`);
              newDoc[key] = value;
            }
          } else if (value && typeof value === 'object') {
            // Recurse for nested plain objects/arrays
            newDoc[key] = processDocument(value);
          } else {
            // Primitives and other types
            newDoc[key] = value;
          }
        }
      }
      return newDoc;
    };
    
    // Download and process each collection file
    for (const file of backup.files) {
      if (!file.url || !file.collection) {
        console.log(`[Restore Route] Skipping file with missing information: ${JSON.stringify(file)}`);
        continue;
      }
      
      console.log(`[Restore Route] Processing file: ${file.collection} from ${file.url}`);

      try {
        // Download file from Cloudinary
        // MODIFIED: Access the .secure_url property of the file.url object
        const actualUrl = file.url && typeof file.url === 'object' ? file.url.secure_url : file.url;
        if (!actualUrl) {
          console.error(`[Restore Route] No valid URL found for file: ${file.collection}. File URL data:`, file.url);
          throw new Error(`No valid URL in backup data for ${file.collection}`);
        }
        console.log(`[Restore Route] Attempting to download from Cloudinary: ${actualUrl}`); 
        const response = await axios.get(actualUrl, { responseType: 'text' });
        console.log(`[Restore Route] Successfully downloaded from Cloudinary: ${actualUrl}`);
        const data = await response.data;
        const collectionData = JSON.parse(data);
        const collectionName = file.collection;
        
        console.log(`[Restore Route] Restoring collection: ${collectionName} with ${collectionData.length} documents`);
        
        // Special handling for users and admins collections to preserve current users
        if (collectionName === 'users') {
          console.log('[Restore Route] Merging users with preserved accounts...');
          
          const processedBackupUsers = collectionData.map(doc => processDocument(doc));
          
          try {
            await localRobolutionDb.collection(collectionName).drop();
            console.log(`[Restore Route] Dropped existing users collection from localRobolutionDb: ${collectionName}`);
          } catch (dropError) {
            console.log(`[Restore Route] localRobolutionDb users collection ${collectionName} might not exist, continuing: ${dropError.message}`);
          }
          
          const finalUsersMap = new Map();

          // Step 1: Add all live users (from localRobolutionDb users) to the map.
          Object.values(existingUsersMap).forEach(liveUser => {
              const processedLiveUser = processDocument(liveUser);
              if (processedLiveUser._id) { 
                  finalUsersMap.set(processedLiveUser._id.toString(), processedLiveUser);
              }
          });

          // Step 2: Add users from backup ONLY if their username isn't already taken by a live user.
          processedBackupUsers.forEach(backupUser => {
              let liveUserWithSameUsernameExists = false;
              for (const liveUserInMap of finalUsersMap.values()) {
                  if (liveUserInMap.username === backupUser.username) {
                      liveUserWithSameUsernameExists = true;
                      break;
                  }
              }
              if (!liveUserWithSameUsernameExists && backupUser._id) { 
                  finalUsersMap.set(backupUser._id.toString(), backupUser);
              }
          });

          const finalMergedUsers = Array.from(finalUsersMap.values());
                    
          if (finalMergedUsers.length > 0) {
            console.log(`[Restore Route] Attempting to insert ${finalMergedUsers.length} merged users to localRobolutionDb.users.`);
            await localRobolutionDb.collection(collectionName).insertMany(finalMergedUsers);
            console.log(`[Restore Route] Restored ${finalMergedUsers.length} users to localRobolutionDb.users.`);
          }
        } 
        // Special handling for admins collection
        else if (collectionName === 'admins') {
          console.log('[Restore Route] Merging admins with preserved accounts (from adminDB)...');
          
          const processedBackupAdmins = collectionData.map(doc => processDocument(doc));
          const finalAdminsMap = new Map();

          // Step 1: Add all live admins (from global adminDB) to the map.
          Object.values(existingAdminsMap).forEach(liveAdmin => {
              const processedLiveAdmin = processDocument(liveAdmin);
              if (processedLiveAdmin._id) { 
                  finalAdminsMap.set(processedLiveAdmin._id.toString(), processedLiveAdmin);
              }
          });

          // Step 2: Add admins from backup ONLY if their username isn't already taken by a live admin.
          processedBackupAdmins.forEach(backupAdmin => {
              let liveAdminWithSameUsernameExists = false;
              for (const liveAdminInMap of finalAdminsMap.values()) {
                  if (liveAdminInMap.username === backupAdmin.username) {
                      liveAdminWithSameUsernameExists = true;
                      break;
                  }
              }
              if (!liveAdminWithSameUsernameExists && backupAdmin._id) { 
                  finalAdminsMap.set(backupAdmin._id.toString(), backupAdmin);
              }
          });

          const finalMergedAdmins = Array.from(finalAdminsMap.values());
          
          // Restore to primary adminDB (global db instance)
          try {
            console.log(`[Restore Route] Attempting to drop existing admins collection from adminDB: ${collectionName}`);
            await adminDbForRestore.collection(collectionName).drop(); // Changed adminDb to adminDbForRestore
            console.log(`[Restore Route] Dropped existing admins collection from adminDB: ${collectionName}`);
          } catch (dropError) {
            console.log(`[Restore Route] adminDB admins collection ${collectionName} might not exist or drop failed, continuing: ${dropError.message}`);
          }
          
          if (finalMergedAdmins.length > 0) {
            console.log(`[Restore Route] Attempting to insert ${finalMergedAdmins.length} merged admins to adminDB.admins.`);
            await adminDbForRestore.collection(collectionName).insertMany(finalMergedAdmins); // Changed adminDb to adminDbForRestore
            console.log(`[Restore Route] Restored ${finalMergedAdmins.length} admins to adminDB.admins`);
          }

        } else {
          // Handle other collections
          console.log(`[Restore Route] Attempting to drop collection from localRobolutionDb: ${collectionName}`);
          try {
            await localRobolutionDb.collection(collectionName).drop();
            console.log(`[Restore Route] Successfully dropped collection from localRobolutionDb: ${collectionName}`);
          } catch (dropError) {
            // If collection doesn't exist, it's fine, we can proceed to insert
            console.log(`[Restore Route] Collection ${collectionName} might not exist in localRobolutionDb, continuing: ${dropError.message}`);
          }
          
          if (collectionData.length > 0) {
            // Ensure ObjectIds and dates are correctly formatted before insertion
            const processedCollectionData = collectionData.map(doc => processDocument(doc));
            console.log(`[Restore Route] Attempting to insert ${processedCollectionData.length} documents into localRobolutionDb.${collectionName}.`);
            await localRobolutionDb.collection(collectionName).insertMany(processedCollectionData);
            console.log(`[Restore Route] Successfully restored ${processedCollectionData.length} documents to localRobolutionDb.${collectionName}`);
          } else {
            console.log(`[Restore Route] No data to restore for collection ${collectionName}.`);
          }
        }
      } catch (error) {
        console.error(`[Restore Route] Error processing file ${file.collection}: ${error.message}`, error.stack);
        // Decide if you want to continue with other files or stop the whole process
        // For now, let's log and continue, but you might want to stop and alert the user.
        // req.flash('error', `Error restoring collection ${file.collection}. Some data may not be restored.`);
      }
    }
    
    console.log('[Restore Route] Cleaning up restore_temp directory...');
    // Clean up temp directory
    try {
      fs.rmSync(restorePath, { recursive: true, force: true });
      console.log('[Restore Route] Successfully cleaned up restore_temp directory.');
    } catch (cleanupError) {
      console.error('[Restore Route] Error cleaning up restore_temp directory:', cleanupError);
    }
    
    await client.close();
    console.log('[Restore Route] Database restoration process completed. Redirecting...');
    req.flash('success', `Database successfully restored from backup ${backupId}.`);
    res.redirect('/manage-backups');
    
  } catch (error) {
    console.error(`[Restore Route] Critical error during restore process for backup ${req.params.name}: ${error.message}`, error.stack);
    // Ensure client is closed if it was opened
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
    // Clean up temp directory if it exists
    const restorePath = path.join(__dirname, 'database_backups', 'restore_temp');
    if (fs.existsSync(restorePath)) {
      try {
        fs.rmSync(restorePath, { recursive: true, force: true });
        console.log('[Restore Route] Cleaned up restore_temp directory after error.');
      } catch (cleanupError) {
        console.error('[Restore Route] Error cleaning up restore_temp directory after main error:', cleanupError);
      }
    }
    req.flash('error', 'A critical error occurred during the restore process. Please check server logs.');
    res.redirect('/manage-backups');
  }
});

// Helper function to get directory size
function getDirSize(dirPath) {
  let size = 0;
  
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        size += getDirSize(filePath);
      } else {
        size += stats.size;
      }
    }
  } catch (error) {
    console.error(`Error calculating directory size: ${error.message}`);
  }
  
  // Convert to MB with 2 decimal places
  return (size / (1024 * 1024)).toFixed(2) + ' MB';
}

// Route to handle user password changes from profile page
app.post('/profile/change-password', async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }
    
    // Find user
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'An error occurred while changing password' });
  }
});

// Add this helper function near the top of the file, after the imports but before the routes
// Flexible ID lookup helper function for MongoDB
async function findDocumentById(collection, id, options = {}) {
  try {
    const { alternativeFields = [] } = options;
    const ObjectId = require('mongodb').ObjectId;
    
    // Array to store query conditions
    const queryConditions = [];
    
    // Try as ObjectId
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const objId = new ObjectId(id);
        queryConditions.push({ _id: objId });
      } catch (err) {
        console.log(`Could not convert ${id} to ObjectId:`, err.message);
      }
    }
    
    // Try as plain string ID
    if (typeof id === 'string') {
      queryConditions.push({ _id: id });
    }
    
    // Add any alternative field lookups
    for (const field of alternativeFields) {
      if (field && id) {
        queryConditions.push({ [field]: id });
      }
    }
    
    // If we have any query conditions, search for the document
    if (queryConditions.length > 0) {
      const query = queryConditions.length === 1 
        ? queryConditions[0] 
        : { $or: queryConditions };
      
      console.log('Searching with query:', JSON.stringify(query));
      return await collection.findOne(query);
    }
    
    return null;
  } catch (error) {
    console.error('Error in findDocumentById:', error);
    return null;
  }
}

// Add this right after the mongoose connection setup but before setting up routes
// -------- Add database connection monitoring and recovery --------

// Track connection state
let isMongooseConnected = false;
let connectionCheckInterval;

// Monitor mongoose connection
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection established');
  isMongooseConnected = true;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
  isMongooseConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
  isMongooseConnected = false;
});

// Function to check and reconnect Mongoose if needed
const checkAndReconnectMongoose = async () => {
  if (!isMongooseConnected) {
    try {
      console.log('Attempting to reconnect Mongoose...');
      await mongoose.disconnect(); // Ensure clean disconnect first
      await mongoose.connect(uri, { dbName: 'robolution' });
      console.log('Mongoose reconnection successful');
    } catch (error) {
      console.error('Mongoose reconnection failed:', error);
    }
  }
};

// Start connection monitoring
connectionCheckInterval = setInterval(checkAndReconnectMongoose, 30000); // Check every 30 seconds

// Enhance the findDocumentById function for more robust lookups
async function findDocumentById(collection, id, options = {}) {
  try {
    const { alternativeFields = [], modelType = null } = options;
    const ObjectId = require('mongodb').ObjectId;
    
    console.log(`Attempting to find document in ${collection.collectionName || 'collection'} with ID: ${id}`);
    
    // If we were passed a mongoose model instead of a collection
    if (modelType) {
      // Try direct mongoose findById first (most reliable if ID format matches)
      try {
        const doc = await modelType.findById(id);
        if (doc) {
          console.log(`Found document using mongoose findById`);
          return doc;
        }
      } catch (err) {
        console.log(`Mongoose findById failed:`, err.message);
      }
    }
    
    // Array to store query conditions
    const queryConditions = [];
    
    // Try as ObjectId
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const objId = new ObjectId(id);
        queryConditions.push({ _id: objId });
      } catch (err) {
        console.log(`Could not convert ${id} to ObjectId:`, err.message);
      }
    }
    
    // Try as plain string ID
    if (typeof id === 'string') {
      queryConditions.push({ _id: id });
    }
    
    // Add any alternative field lookups
    for (const field of alternativeFields) {
      if (field && id) {
        queryConditions.push({ [field]: id });
      }
    }
    
    // If we have any query conditions, search for the document
    if (queryConditions.length > 0) {
      const query = queryConditions.length === 1 
        ? queryConditions[0] 
        : { $or: queryConditions };
      
      console.log('Searching with query:', JSON.stringify(query));
      
      // If we have a mongoose model, use it
      if (modelType) {
        const doc = await modelType.findOne(query);
        if (doc) {
          console.log(`Found document using mongoose findOne with query`);
          return doc;
        }
      }
      
      // Otherwise use the MongoDB native driver collection
      const doc = await collection.findOne(query);
      if (doc) {
        console.log(`Found document using MongoDB native findOne`);
        return doc;
      } else {
        console.log(`No document found with any method for ID: ${id}`);
      }
    }
    
    // Document truly not found
    console.log(`Document not found in ${collection.collectionName || 'collection'} with ID: ${id}`);
    return null;
  } catch (error) {
    console.error('Error in findDocumentById:', error);
    return null;
  }
}

// Update Admin model to use both model and collection approaches
const Admin = {
  findById: async function(id) {
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }
      // First try to find in adminDB
      const adminUser = await findDocumentById(db.collection('admins'), id, { 
        alternativeFields: ['username'] 
      });
      
      if (adminUser) return adminUser;
      
      // If not found and robolutionDb is available, try there too
      if (robolutionDb) {
        return await findDocumentById(robolutionDb.collection('admins'), id, {
          alternativeFields: ['username']
        });
      }
      
      return null;
    } catch (error) {
      console.error('Error in Admin.findById:', error);
      throw error;
    }
  }
};

// Update the route to show individual post details with direct MongoDB collection access
app.get('/post/:id', async (req, res) => {
  try {
    console.log('Accessing post with ID:', req.params.id);
    
    // DIRECT COLLECTION ACCESS - bypass Mongoose completely
    // This is the most direct and reliable way to access the data
    const postsCollection = robolutionDb.collection('posts');
    
    // Try multiple query approaches
    let post = null;
    
    // 1. Try direct string ID lookup
    post = await postsCollection.findOne({ _id: req.params.id });
    console.log('Direct string ID lookup result:', post ? 'Found' : 'Not found');
    
    // 2. Try ObjectID lookup if available
    if (!post && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const ObjectId = require('mongodb').ObjectId;
        post = await postsCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log('ObjectId lookup result:', post ? 'Found' : 'Not found');
      } catch (err) {
        console.error('Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try by title if still not found
    if (!post) {
      // Search by title as a last resort
      post = await postsCollection.findOne({ title: { $regex: new RegExp(req.params.id, 'i') } });
      console.log('Title search result:', post ? 'Found' : 'Not found');
    }
    
    // Log the full database structure if still not found
    if (!post) {
      console.log('Post still not found, checking database structure...');
      
      // Get collection structure
      const postsSample = await postsCollection.find().limit(1).toArray();
      console.log('Sample post structure:', JSON.stringify(postsSample, null, 2));
      
      console.error('Post not found with ID:', req.params.id);
      return res.status(404).send('Post not found');
    }
    
    // Convert MongoDB document to a JavaScript object 
    // This ensures compatibility with templates and avoids MongoDB document restrictions
    const postObject = JSON.parse(JSON.stringify(post));
    
    res.render('UserViews/post-detail', { 
      post: postObject,
      req: req
    });
  } catch (error) {
    console.error('Error fetching post details:', error);
    res.status(500).send('An error occurred while fetching the post details');
  }
});

// Update route to show edit post page with direct MongoDB access
app.get('/edit-post/:id', requireAdmin, async (req, res) => {
  // Check if user is logged in and is an admin
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/login');
  }

  try {
    console.log('Accessing post for editing, ID:', req.params.id);
    
    // DIRECT COLLECTION ACCESS - bypass Mongoose completely
    const postsCollection = robolutionDb.collection('posts');
    
    // Get all posts for regions dropdown using native MongoDB
    const posts = await postsCollection.find().toArray();

    // Try multiple query approaches to find the specific post
    let post = null;
    
    // 1. Try direct string ID lookup
    post = await postsCollection.findOne({ _id: req.params.id });
    console.log('Direct string ID lookup result:', post ? 'Found' : 'Not found');
    
    // 2. Try ObjectID lookup if available
    if (!post && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const ObjectId = require('mongodb').ObjectId;
        post = await postsCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log('ObjectId lookup result:', post ? 'Found' : 'Not found');
      } catch (err) {
        console.error('Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try by title if still not found
    if (!post) {
      // Search by title as a last resort
      post = await postsCollection.findOne({ title: { $regex: new RegExp(req.params.id, 'i') } });
      console.log('Title search result:', post ? 'Found' : 'Not found');
    }

    if (!post) {
      // Log the full database structure if still not found
      console.log('Post still not found, checking database structure...');
      
      // Get collection structure
      const postsSample = await postsCollection.find().limit(1).toArray();
      console.log('Sample post structure:', JSON.stringify(postsSample, null, 2));
      
      console.error('Post not found with ID:', req.params.id);
      return res.status(404).send('Post not found');
    }

    // Convert MongoDB document to a JavaScript object
    const postObject = JSON.parse(JSON.stringify(post));
    
    // Get unique regions from posts
    const uniqueRegions = [...new Set(posts
      .map(p => p.region)
      .filter(region => region && region !== 'All')
    )].sort();

    const isDashboard = req.query.dashboard === 'true'; // Capture dashboard status

    res.render('edit-post', { 
      post: postObject,
      uniqueRegions,
      dashboard: isDashboard // Pass dashboard status to the template
    });
  } catch (error) {
    console.error('Error finding post:', error);
    res.status(500).send('Server error');
  }
});

// Update both category detail routes with direct MongoDB access
app.get('/categories/:id', async (req, res) => {
  try {
    console.log('Accessing category with ID:', req.params.id);
    
    // DIRECT COLLECTION ACCESS
    const categoriesCollection = robolutionDb.collection('categories');
    
    // Try multiple query approaches
    let category = null;
    
    // 1. Try direct string ID lookup
    category = await categoriesCollection.findOne({ _id: req.params.id });
    console.log('Direct string ID lookup result:', category ? 'Found' : 'Not found');
    
    // 2. Try ObjectID lookup if available
    if (!category && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const ObjectId = require('mongodb').ObjectId;
        category = await categoriesCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log('ObjectId lookup result:', category ? 'Found' : 'Not found');
      } catch (err) {
        console.error('Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try by title if still not found
    if (!category) {
      category = await categoriesCollection.findOne({ title: { $regex: new RegExp(req.params.id, 'i') } });
      console.log('Title search result:', category ? 'Found' : 'Not found');
    }
    
    if (category) {
      // Convert MongoDB document to a JavaScript object
      const categoryObject = JSON.parse(JSON.stringify(category));
      res.render('category-details', { event: categoryObject });
    } else {
      // Log the full database structure if still not found
      console.log('Category still not found, checking database structure...');
      
      // Get collection structure
      const categorySample = await categoriesCollection.find().limit(1).toArray();
      console.log('Sample category structure:', JSON.stringify(categorySample, null, 2));
      
      console.error('Event not found with ID:', req.params.id);
      res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error('Error fetching category details:', error);
    res.status(500).send('An error occurred while fetching the category details');
  }
});

app.get('/user-categories/:id', async (req, res) => {
  try {
    console.log('Accessing user category with ID:', req.params.id);
    
    // DIRECT COLLECTION ACCESS
    const categoriesCollection = robolutionDb.collection('categories');
    
    // Try multiple query approaches
    let category = null;
    
    // 1. Try direct string ID lookup
    category = await categoriesCollection.findOne({ _id: req.params.id });
    console.log('Direct string ID lookup result:', category ? 'Found' : 'Not found');
    
    // 2. Try ObjectID lookup if available
    if (!category && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const ObjectId = require('mongodb').ObjectId;
        category = await categoriesCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log('ObjectId lookup result:', category ? 'Found' : 'Not found');
      } catch (err) {
        console.error('Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try by title if still not found
    if (!category) {
      category = await categoriesCollection.findOne({ title: { $regex: new RegExp(req.params.id, 'i') } });
      console.log('Title search result:', category ? 'Found' : 'Not found');
    }
    
    if (category) {
      // Convert MongoDB document to a JavaScript object
      const categoryObject = JSON.parse(JSON.stringify(category));
      res.render('UserViews/user-category_details', { event: categoryObject });
    } else {
      // Log the full database structure if still not found
      console.log('Category still not found, checking database structure...');
      
      // Get collection structure
      const categorySample = await categoriesCollection.find().limit(1).toArray();
      console.log('Sample category structure:', JSON.stringify(categorySample, null, 2));
      
      console.error('Event not found with ID:', req.params.id);
      res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error('Error fetching category details:', error);
    res.status(500).send('An error occurred while fetching the category details');
  }
});

// Update route to view individual registration details with direct MongoDB access
app.get('/registration/:id', async (req, res) => {
  try {
    console.log('Accessing registration with ID:', req.params.id);
    
    // DIRECT COLLECTION ACCESS
    const registrationsCollection = robolutionDb.collection('registrations');
    
    // Try multiple query approaches
    let registration = null;
    
    // 1. Try direct string ID lookup
    registration = await registrationsCollection.findOne({ _id: req.params.id });
    console.log('Direct string ID lookup result:', registration ? 'Found' : 'Not found');
    
    // 2. Try ObjectID lookup if available
    if (!registration && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const ObjectId = require('mongodb').ObjectId;
        registration = await registrationsCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log('ObjectId lookup result:', registration ? 'Found' : 'Not found');
      } catch (err) {
        console.error('Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try by email or fullname if still not found
    if (!registration) {
      registration = await registrationsCollection.findOne({ 
        $or: [
          { email: { $regex: new RegExp(req.params.id, 'i') } },
          { fullname: { $regex: new RegExp(req.params.id, 'i') } }
        ] 
      });
      console.log('Email/Name search result:', registration ? 'Found' : 'Not found');
    }
    
    if (!registration) {
      // Log the full database structure if still not found
      console.log('Registration still not found, checking database structure...');
      
      // Get collection structure
      const registrationSample = await registrationsCollection.find().limit(1).toArray();
      console.log('Sample registration structure:', JSON.stringify(registrationSample, null, 2));
      
      console.error('Registration not found with ID:', req.params.id);
      return res.status(404).send('Registration not found');
    }
    
    // Convert MongoDB document to a JavaScript object
    const registrationObject = JSON.parse(JSON.stringify(registration));
    
    res.render('edit-registration', { 
      registration: registrationObject, 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error fetching registration details:', error);
    res.status(500).send('An error occurred while fetching registration details');
  }
});

// Update account/admin/edit route with direct DB access
app.get('/account/admin/edit/:id', requireSuperAdmin, async (req, res) => {
  try {
    console.log('Accessing admin account with ID:', req.params.id);
    
    // Try to access the admin account from both databases
    let admin = null;
    
    // 1. Try adminDB first with direct string ID
    if (db) {
      admin = await db.collection('admins').findOne({ _id: req.params.id });
      console.log('adminDB direct string ID lookup result:', admin ? 'Found' : 'Not found');
    }
    
    // 2. Try adminDB with ObjectID
    if (!admin && db && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const ObjectId = require('mongodb').ObjectId;
        admin = await db.collection('admins').findOne({ _id: new ObjectId(req.params.id) });
        console.log('adminDB ObjectId lookup result:', admin ? 'Found' : 'Not found');
      } catch (err) {
        console.error('Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try adminDB by username
    if (!admin && db) {
      admin = await db.collection('admins').findOne({ username: req.params.id });
      console.log('adminDB username lookup result:', admin ? 'Found' : 'Not found');
    }
    
    // 4. Try robolution admins collection as fallback
    if (!admin && robolutionDb) {
      // Try string ID first
      admin = await robolutionDb.collection('admins').findOne({ _id: req.params.id });
      console.log('robolutionDb admins direct string ID lookup result:', admin ? 'Found' : 'Not found');
      
      // Try ObjectID if needed
      if (!admin && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        try {
          const ObjectId = require('mongodb').ObjectId;
          admin = await robolutionDb.collection('admins').findOne({ _id: new ObjectId(req.params.id) });
          console.log('robolutionDb admins ObjectId lookup result:', admin ? 'Found' : 'Not found');
        } catch (err) {
          console.error('Error with ObjectId conversion for robolutionDb:', err.message);
        }
      }
      
      // Try username in robolution admins
      if (!admin) {
        admin = await robolutionDb.collection('admins').findOne({ username: req.params.id });
        console.log('robolutionDb admins username lookup result:', admin ? 'Found' : 'Not found');
      }
    }
    
    if (!admin) {
      // Log the full database structure if still not found
      console.log('Admin still not found, checking database structure...');
      
      // Get collection structure from both DBs
      if (db) {
        const adminSample = await db.collection('admins').find().limit(1).toArray();
        console.log('Sample adminDB admin structure:', JSON.stringify(adminSample, null, 2));
      }
      
      if (robolutionDb) {
        const robolutionAdminSample = await robolutionDb.collection('admins').find().limit(1).toArray();
        console.log('Sample robolutionDb admin structure:', JSON.stringify(robolutionAdminSample, null, 2));
      }
      
      console.error('Admin account not found with ID:', req.params.id);
      return res.status(404).send('Admin account not found');
    }
    
    // Convert MongoDB document to a JavaScript object
    const adminObject = JSON.parse(JSON.stringify(admin));
    
    // Get unique regions for the dropdown menu using direct collection access
    const postsCollection = robolutionDb.collection('posts');
    const posts = await postsCollection.find().toArray();
    const uniqueRegions = [...new Set(posts
      .map(p => p.region)
      .filter(region => region && region !== 'All')
    )].sort();
    
    res.render('edit-admin', {
      admin: adminObject,
      user: req.session.user,
      uniqueRegions,
      dashboard: isDashboard // Pass dashboard status
    });
  } catch (error) {
    console.error('Error fetching admin account:', error);
    res.status(500).send('An error occurred while fetching account information');
  }
});

// Update account/user/edit route with direct MongoDB access
app.get('/account/user/edit/:id', requireSuperAdmin, async (req, res) => {
  try {
    console.log('Accessing user account for editing with ID:', req.params.id);
    
    // DIRECT COLLECTION ACCESS
    const usersCollection = robolutionDb.collection('users');
    
    // Try multiple query approaches
    let userAccount = null;
    
    // 1. Try direct string ID lookup
    userAccount = await usersCollection.findOne({ _id: req.params.id });
    console.log('Direct string ID lookup result:', userAccount ? 'Found' : 'Not found');
    
    // 2. Try ObjectID lookup if available
    if (!userAccount && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const ObjectId = require('mongodb').ObjectId;
        userAccount = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log('ObjectId lookup result:', userAccount ? 'Found' : 'Not found');
      } catch (err) {
        console.error('Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try by username or email if still not found
    if (!userAccount) {
      userAccount = await usersCollection.findOne({ 
        $or: [
          { username: req.params.id },
          { email: req.params.id }
        ]
      });
      console.log('Username/Email search result:', userAccount ? 'Found' : 'Not found');
    }
    
    if (!userAccount) {
      // Log the full database structure if still not found
      console.log('User account still not found, checking database structure...');
      
      // Get collection structure
      const userSample = await usersCollection.find().limit(1).toArray();
      console.log('Sample user account structure:', JSON.stringify(userSample, null, 2));
      
      console.error('User account not found with ID:', req.params.id);
      return res.status(404).send('User account not found');
    }
    
    // Convert MongoDB document to a JavaScript object
    const userAccountObject = JSON.parse(JSON.stringify(userAccount));
    
    // Get unique regions using direct collection access
    const postsCollection = robolutionDb.collection('posts');
    const posts = await postsCollection.find().toArray();
    const uniqueRegions = [...new Set(posts
      .map(p => p.region)
      .filter(region => region && region !== 'All')
    )].sort();
    
    res.render('edit-user', {
      userAccount: userAccountObject,
      currentUser: req.session.user,
      uniqueRegions
    });
  } catch (error) {
    console.error('Error fetching user account:', error);
    res.status(500).send('An error occurred while fetching account information');
  }
});

// Update admin/user-profiles/:id route with direct MongoDB access
app.get('/admin/user-profiles/:id', requireAdmin, async (req, res) => {
  try {
    console.log('Accessing user profile with ID:', req.params.id);
    
    // DIRECT COLLECTION ACCESS
    const usersCollection = robolutionDb.collection('users');
    
    // Try multiple query approaches
    let userProfile = null;
    
    // 1. Try direct string ID lookup
    userProfile = await usersCollection.findOne({ _id: req.params.id });
    console.log('Direct string ID lookup result:', userProfile ? 'Found' : 'Not found');
    
    // 2. Try ObjectID lookup if available
    if (!userProfile && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const ObjectId = require('mongodb').ObjectId;
        userProfile = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log('ObjectId lookup result:', userProfile ? 'Found' : 'Not found');
      } catch (err) {
        console.error('Error with ObjectId conversion:', err.message);
      }
    }
    
    // 3. Try by username or email if still not found
    if (!userProfile) {
      userProfile = await usersCollection.findOne({ 
        $or: [
          { username: req.params.id },
          { email: req.params.id }
        ]
      });
      console.log('Username/Email search result:', userProfile ? 'Found' : 'Not found');
    }
    
    if (!userProfile) {
      // Log the full database structure if still not found
      console.log('User profile still not found, checking database structure...');
      
      // Get collection structure
      const userSample = await usersCollection.find().limit(1).toArray();
      console.log('Sample user profile structure:', JSON.stringify(userSample, null, 2));
      
      console.error('User not found with ID:', req.params.id);
      return res.status(404).send('User not found');
    }
    
    // Convert MongoDB document to a JavaScript object
    const userProfileObject = JSON.parse(JSON.stringify(userProfile));
    
    // Calculate age from birth date if available
    let age = null;
    if (userProfileObject.birthDate && userProfileObject.birthDate.month && userProfileObject.birthDate.year) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      age = currentYear - userProfileObject.birthDate.year;
      
      if (userProfileObject.birthDate.month > currentMonth) {
        age--;
      }
    }
    
    res.render('admin-view-user-profile', {
      userProfile: userProfileObject,
      age,
      profilePicture: userProfileObject.profilePicture || '/images/default-profile.jpg',
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Error fetching user profile');
  }
});

// Route to make a user an admin
app.get('/account/user/make-admin/:id', requireSuperAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Attempting to make user with ID: ${userId} an admin.`);

    // Find the user in the User collection
    let userToPromote = null;
    const usersCollection = robolutionDb.collection('users');
    const ObjectId = require('mongodb').ObjectId;

    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            const userObjectId = new ObjectId(userId);
            userToPromote = await usersCollection.findOne({ _id: userObjectId });
            if (userToPromote) console.log('Found user by ObjectId in users collection.');
        } catch (err) {
            console.error('Error converting userId to ObjectId or finding user:', err.message);
            // If ID format is bad or conversion fails, it's an invalid request for this operation
            req.flash('error', 'Invalid user ID format.');
            return res.redirect('/manage-accounts');
        }
    } else {
        // If ID is not a valid ObjectId hex string format
        req.flash('error', 'Invalid user ID format.');
        return res.redirect('/manage-accounts');
    }

    if (!userToPromote) {
      req.flash('error', 'User not found with the provided ID.');
      return res.redirect('/manage-accounts');
    }

    console.log(`User found: ${userToPromote.username}. Preparing to promote.`);

    // Check if admin with the same username already exists in adminDB
    const adminDbAdminsCollection = db.collection('admins');
    const existingAdmin = await adminDbAdminsCollection.findOne({ username: userToPromote.username });

    if (existingAdmin) {
      console.log(`Admin with username ${userToPromote.username} already exists.`);
      req.flash('error', `An admin with username '${userToPromote.username}' already exists.`);
      return res.redirect('/manage-accounts');
    }

    // Prepare admin data
    const adminData = {
      username: userToPromote.username,
      password: userToPromote.password, // Copy hashed password
      role: 'admin', // Assign admin role
      twoFactorSecret: userToPromote.twoFactorSecret,
      twoFactorEnabled: userToPromote.twoFactorEnabled,
      backupCodes: userToPromote.backupCodes,
      needs2FASetup: userToPromote.needs2FASetup || false,
      createdAt: userToPromote.createdAt || new Date(),
      // Preserve original _id if possible, or let MongoDB generate a new one
      // _id: userToPromote._id 
    };
    
    // If the original user ID is an ObjectId, try to use it for the new admin record
    // Otherwise, let MongoDB generate a new _id for the admin record.
    if (userToPromote._id && (userToPromote._id.constructor.name === 'ObjectID' || userToPromote._id.constructor.name === 'ObjectId')) {
        adminData._id = userToPromote._id;
    } else if (typeof userToPromote._id === 'string' && userToPromote._id.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            const ObjectId = require('mongodb').ObjectId;
            adminData._id = new ObjectId(userToPromote._id);
        } catch (e) {
            console.log('Could not convert user _id to ObjectId for admin record, will let MongoDB generate new _id');
        }
    }

    console.log('Admin data prepared:', adminData);

    // Insert into adminDB admins collection
    await adminDbAdminsCollection.insertOne(adminData);
    console.log(`User ${userToPromote.username} added to adminDB admins collection.`);

    // Also add/update in robolutionDb admins collection for redundancy and direct query consistency
    const robolutionDbAdminsCollection = robolutionDb.collection('admins');
    // Use upsert to add if not exists, or update if exists (e.g., if ID was preserved)
    await robolutionDbAdminsCollection.updateOne(
        { _id: adminData._id || new require('mongodb').ObjectId() }, // Match by ID if it was set
        { $set: adminData },
        { upsert: true }
    );
    console.log(`User ${userToPromote.username} upserted into robolutionDb admins collection.`);

    // Delete from the original User collection
    // Use the original _id from userToPromote for deletion
    let deleteResultUser;
    if (userToPromote._id.constructor.name === 'ObjectID' || userToPromote._id.constructor.name === 'ObjectId') {
        deleteResultUser = await usersCollection.deleteOne({ _id: userToPromote._id });
    } else if (typeof userToPromote._id === 'string' && userToPromote._id.match(/^[0-9a-fA-F]{24}$/)){
        deleteResultUser = await usersCollection.deleteOne({ _id: new require('mongodb').ObjectId(userToPromote._id) });
    } else {
        // Fallback to deleting by string id if it's not an ObjectId and doesn't look like one
        deleteResultUser = await usersCollection.deleteOne({ _id: userToPromote._id.toString() });
    }

    if (deleteResultUser.deletedCount === 1) {
      console.log(`User ${userToPromote.username} deleted from users collection.`);
      req.flash('success', `User '${userToPromote.username}' has been successfully promoted to admin.`);
    } else {
      console.log(`Failed to delete user ${userToPromote.username} from users collection. User might have already been deleted or ID mismatch.`);
      // Even if deletion fails, the admin record was created, so it's a partial success.
      // Log this as an inconsistency.
      req.flash('warning', `User '${userToPromote.username}' promoted to admin, but there was an issue removing the original user record. Please check manually.`);
    }

    res.redirect('/manage-accounts');

  } catch (error) {
    console.error('Error promoting user to admin:', error);
    req.flash('error', 'An error occurred while promoting the user to admin.');
    res.redirect('/manage-accounts');
  }
});

// Route for admin dashboard
app.get('/admin-dashboard', requireAdmin, async (req, res) => {
    try {
        const posts = await Post.find({}); // For uniqueRegions
        const uniqueRegions = [...new Set(posts.filter(post => post.region && post.region !== 'All').map(post => post.region))].sort();

        // Fetch counts for dashboard cards
        const totalPosts = await robolutionDb.collection('posts').countDocuments();
        const totalRegistrations = await robolutionDb.collection('registrations').countDocuments();
        const totalCategories = await robolutionDb.collection('categories').countDocuments();
        
        // For accounts, we need to sum users from the 'users' collection 
        // and admins from the 'admins' collection in adminDB
        const totalRegularUsers = await robolutionDb.collection('users').countDocuments();
        const totalAdmins = await db.collection('admins').countDocuments(); // 'db' is the adminDB connection
        const totalUserAccounts = totalRegularUsers + totalAdmins;
        
        // Get all registrations for detailed statistics
        const registrations = await Registration.find().lean();
        
        // Calculate today's registrations
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayRegistrations = registrations.filter(reg => 
            new Date(reg.registeredAt).setHours(0, 0, 0, 0) >= today.getTime()
        ).length;
        
        // Get verification status counts
        const verifiedRegistrations = registrations.filter(reg => reg.verified).length;
        const unverifiedRegistrations = registrations.filter(reg => !reg.verified && !reg.denied).length;
        const deniedRegistrations = registrations.filter(reg => reg.denied).length;
        
        // Get unique schools count
        const schools = new Set();
        registrations.forEach(reg => {
            if (reg.school && reg.school.trim() !== '') {
                schools.add(reg.school.trim().toLowerCase());
            }
        });
        const uniqueSchools = schools.size;
        
        // Calculate seminar vs competition participation
        const seminarOnly = registrations.filter(reg => {
            // Has workshop (not empty)
            const hasWorkshop = (reg.workshop && typeof reg.workshop === 'string' && reg.workshop !== 'NONE' && reg.workshop !== '') || 
                               (Array.isArray(reg.workshop) && reg.workshop.length > 0);
            // No competition
            const noCompetition = !reg.competition || 
                                (Array.isArray(reg.competition) && reg.competition.length === 0);
            return hasWorkshop && noCompetition;
        }).length;
        
        const competitionOnly = registrations.filter(reg => {
            // No workshop (empty or none)
            const noWorkshop = !reg.workshop || 
                              reg.workshop === 'NONE' || 
                              reg.workshop === '' || 
                              (Array.isArray(reg.workshop) && reg.workshop.length === 0);
            // Has competition
            const hasCompetition = reg.competition && 
                                  Array.isArray(reg.competition) && 
                                  reg.competition.length > 0;
            return noWorkshop && hasCompetition;
        }).length;
        
        const seminarAndCompetition = registrations.filter(reg => {
            // Has workshop (not empty)
            const hasWorkshop = (reg.workshop && typeof reg.workshop === 'string' && reg.workshop !== 'NONE' && reg.workshop !== '') || 
                               (Array.isArray(reg.workshop) && reg.workshop.length > 0);
            // Has competition
            const hasCompetition = reg.competition && 
                                  Array.isArray(reg.competition) && 
                                  reg.competition.length > 0;
            return hasWorkshop && hasCompetition;
        }).length;
        
        // Get category counts
        const studentRegistrations = registrations.filter(reg => reg.category === 'Student').length;
        const professionalRegistrations = registrations.filter(reg => reg.category === 'Professional').length;
        const teamRegistrations = registrations.filter(reg => reg.category === 'Team').length;
        const collegeRegistrations = registrations.filter(reg => 
            reg.category === 'College/Post-Graduate/Industry'
        ).length;
        
        res.render('admin-dashboard', { 
            user: req.session.user,
            uniqueRegions: uniqueRegions,
            pageTitle: 'Admin Dashboard',
            dashboard: true,
            stats: {
                totalPosts,
                totalRegistrations,
                totalCategories,
                totalUserAccounts,
                todayRegistrations,
                verifiedRegistrations,
                unverifiedRegistrations,
                deniedRegistrations,
                uniqueSchools,
                seminarOnly,
                competitionOnly,
                seminarAndCompetition,
                studentRegistrations,
                professionalRegistrations,
                teamRegistrations,
                collegeRegistrations
            }
        });
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        req.flash('error', 'Error loading dashboard.');
        res.redirect('/login'); // Or an error page
    }
});

// ==== USER PROFILE ROUTES ==== 

// Add a redirect from /home/profile to /profile
app.get('/home/profile', requireLogin, (req, res) => {
  // Debug session info
  console.log('Session Debug:', {
    url: req.originalUrl,
    method: req.method,
    sessionID: req.sessionID,
    session: {
      hasSession: !!req.session,
      isAuthenticated: !!req.session?.user,
      isAdmin: req.session?.user?.isAdmin,
      username: req.session?.user?.username
    },
    store: { 
      type: req.sessionStore?.constructor?.name || 'Unknown', 
      connected: !!req.sessionStore?.client?.isConnected
    },
    cookie: req.session?.cookie
  });
  
  // Redirect to the actual profile page
  res.redirect('/profile');
});

app.get('/profile', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).lean();
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/login');
    }

    // --- Start of Merged Logic ---

    // 1. Fetch data for the profile page view (registrations, posts, gallery items)
    const [registrations, allPosts, tourGalleryItems] = await Promise.all([
      Registration.find({ userId: user._id }).sort({ registeredAt: -1 }).lean(),
      Post.find().lean(),
      TourGallery.find().select('region').lean()
    ]);

    // 2. Calculate user's age
    let age = null;
    if (user.birthDate && user.birthDate.month && user.birthDate.year) {
      const birthDate = new Date(user.birthDate.year, user.birthDate.month - 1);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    // 3. Check if the user is coming from an international site
    const referrer = req.get('Referrer') || '';
    const isFromInternational = referrer.includes('international');

    // 4. Create the complete 'uniqueRegions' list for the header
    const postRegions = allPosts.map(p => p.region);
    const galleryRegions = tourGalleryItems.map(item => item.region);
    const combinedRegions = [...new Set([...postRegions, ...galleryRegions])];
    const uniqueRegions = combinedRegions.filter(region => region && region !== 'All').sort();
    
    // --- End of Merged Logic ---

    res.render('UserViews/profile', {
      user,
      age,
      registrations,
      profilePicture: user.profilePicture || '/images/default-profile.jpg',
      isFromInternational,
      allPosts, // For year dropdowns if needed elsewhere on the page
      uniqueRegions, // For the header dropdown
      req: req
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    req.flash('error', 'Error fetching profile.');
    res.redirect('/home');
  }
});

// POST route to update user profile
app.post('/profile/update', requireLogin, upload.single('profilePicture'), async (req, res) => {
    try {
        const { email, birthMonth, birthYear, school, address } = req.body;
        const user = await User.findById(req.session.user.id);

        if (!user) {
            // This should ideally not happen if requireLogin works
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Handle email update
        if (email && email !== user.email) {
            // Check if the new email is already in use
            const existingUserWithNewEmail = await User.findOne({ email: email });
            if (existingUserWithNewEmail && existingUserWithNewEmail._id.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, message: 'Email already in use by another account.' });
            }
            // Basic email format validation (you might want a more robust one)
            if (!/\S+@\S+\.\S+/.test(email)) {
                return res.status(400).json({ success: false, message: 'Invalid email format.' });
            }
            user.email = email;
        }

        if (birthMonth && birthYear) {
            user.birthDate = { month: parseInt(birthMonth), year: parseInt(birthYear) };
        }
        // Allow clearing fields by providing empty strings
        user.school = school !== undefined ? school : user.school;
        user.address = address !== undefined ? address : user.address;

        if (req.file) {
            const filePath = req.file.path; // Path from multer
            console.log('[PROFILE UPDATE] Uploading file from path:', filePath);
            const result = await uploadToCloudinary(filePath, 'robolution/profiles');
            console.log('[PROFILE UPDATE] Cloudinary upload result:', result);
            if (result && result.secure_url) {
                user.profilePicture = result.secure_url;
                console.log('[PROFILE UPDATE] Attempting to set user.profilePicture to:', user.profilePicture);
            } else {
                console.error('[PROFILE UPDATE] Cloudinary did not return a secure_url. Result:', result);
                // Decide if you want to throw an error here or just skip updating the picture
            }
            // Optional: Clean up temp file if it exists (do this carefully, perhaps after user.save())
            // if (fs.existsSync(filePath)) {
            //     try {
            //         fs.unlinkSync(filePath);
            //         console.log('[PROFILE UPDATE] Deleted temp file:', filePath);
            //     } catch (unlinkErr) {
            //         console.error('[PROFILE UPDATE] Error deleting temp file:', unlinkErr);
            //     }
            // }
        }

        console.log('[PROFILE UPDATE] User object before save:', JSON.stringify(user.toObject ? user.toObject() : user, null, 2));
        await user.save();
        console.log('[PROFILE UPDATE] User object after save, profilePicture should be:', user.profilePicture);
        res.json({ success: true, message: 'Profile updated successfully', profilePicture: user.profilePicture });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Error updating profile' });
    }
});

// POST route to change user password from profile
app.post('/profile/change-password', requireLogin, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'New passwords do not match.' });
        }
         // Password complexity check (consistent with frontend)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.' 
            });
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
            // Should not happen due to requireLogin
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ success: true, message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Error changing password.' });
    }
});

// Update routes for 2FA setup and verification
// ... existing code ...

// Note: Edit Poster Video functionality has been replaced by the Year Videos feature



// Force a user to set up 2FA on next login
app.get('/admin/user/:id/force-2fa-setup', requireSuperAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/manage-accounts');
    }
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null; // Clear any existing secret
    user.backupCodes = [];       // Clear backup codes
    user.needs2FASetup = true;
    await user.save();
    req.flash('success', `User ${user.username} will be required to set up 2FA on their next login.`)
  } catch (error) {
    console.error('Error forcing 2FA setup:', error);
    req.flash('error', 'Error forcing 2FA setup.');
  }
  res.redirect('/manage-accounts');
});

// Disable 2FA for a user
app.get('/admin/user/:id/disable-2fa', requireSuperAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/manage-accounts');
    }
    user.twoFactorEnabled = false;
    await user.save();
    req.flash('success', `2FA has been disabled for ${user.username}.`);
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    req.flash('error', 'Error disabling 2FA.');
  }
  res.redirect('/manage-accounts');
});

// Reset/Clear 2FA Secret for a user (forces re-setup)
app.get('/admin/user/:id/reset-2fa-secret', requireSuperAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/manage-accounts');
    }
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.backupCodes = [];
    user.needs2FASetup = true;
    await user.save();
    req.flash('success', `2FA secret has been reset for ${user.username}. They will need to set it up again on next login.`);
  } catch (error) {
    console.error('Error resetting 2FA secret:', error);
    req.flash('error', 'Error resetting 2FA secret.');
  }
  res.redirect('/manage-accounts');
});

// API route for upvoting a post
app.post('/api/posts/:id/upvote', async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ success: false, error: 'You must be logged in to upvote' });
    }

    const postId = req.params.id;
    const userId = req.session.user.id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Initialize upvotes array if it doesn't exist
    if (!post.upvotes) {
      post.upvotes = [];
    }

    // Check if user has already upvoted
    const userIndex = post.upvotes.indexOf(userId);
    
    if (userIndex === -1) {
      // User hasn't upvoted yet, add upvote
      post.upvotes.push(userId);
    } else {
      // User has already upvoted, remove upvote (toggle behavior)
      post.upvotes.splice(userIndex, 1);
    }

    await post.save();

    res.json({ 
      success: true, 
      upvotes: post.upvotes.length,
      hasUpvoted: post.upvotes.includes(userId)
    });
  } catch (error) {
    console.error('Error upvoting post:', error);
    res.status(500).json({ success: false, error: 'Server error occurred' });
  }
});

// API route for adding a comment to a post
app.post('/api/posts/:id/comment', async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ success: false, error: 'You must be logged in to comment' });
    }

    const postId = req.params.id;
    const userId = req.session.user.id;
    const { text } = req.body;

    // Validate comment text
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'Comment text is required' });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Find the user to get their profile info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Initialize comments array if it doesn't exist
    if (!post.comments) {
      post.comments = [];
    }

    // Create a new comment - embed essential user data directly
    const newComment = {
      user: {
        _id: user._id,
        username: user.username,
        profilePicture: user.profilePicture || null  // Don't set default image URL here
      },
      text: text.trim(),
      createdAt: new Date()
    };

    // Add comment to post
    post.comments.unshift(newComment); // Add to the beginning of the array
    await post.save();

    // Return the comment with the same structure as saved
    res.json({ 
      success: true, 
      comment: newComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, error: 'Server error occurred', details: error.message });
  }
});

// API route to check if session is valid
app.get('/api/check-session', (req, res) => {
  if (req.session.user && req.session.user.id) {
    return res.json({ authenticated: true });
  }
  res.json({ authenticated: false });
});

// Update the post detail route to handle comments with embedded user data
app.get('/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Find the post - no need to populate since user data is embedded
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).send('Post not found');
    }
    
    // Define default image path
    const defaultProfilePicture = '/images/default-user.png';
    
    // Process comments to ensure profilePicture has a value
    if (post.comments && post.comments.length > 0) {
      post.comments.forEach(comment => {
        // If user is missing entirely, set to Anonymous
        if (!comment.user) {
          comment.user = {
            username: 'Anonymous User',
            profilePicture: null
          };
        }
        // If username is missing, set to Anonymous
        else if (!comment.user.username) {
          comment.user.username = 'Anonymous User';
        }
        // Don't set default profile picture path here
      });
    }
    
    // Get unique regions with posts for the dropdown menu
    const allPosts = await Post.find().select('title region createdAt');
    const uniqueRegions = [...new Set(allPosts.map(p => p.region).filter(r => r && r !== 'All'))];
    
    res.render('UserViews/post-detail', { 
      post,
      uniqueRegions,
      allPosts, // Pass all posts for the years dropdown
      user: req.session.user || null,
      defaultProfilePicture: defaultProfilePicture  // Pass default image path to the template
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send('Server error occurred');
  }
});

// User landing page with posts
app.get('/home', async (req, res) => {
  try {
    // Get all posts
    let sort = req.query.sort || 'desc';
    
    // Validate sort parameter
    if (sort !== 'asc' && sort !== 'desc') {
      sort = 'desc';
    }
    
    // Get all posts with upvotes field included
    let posts = await Post.find()
      .select('title content author imageUrl region createdAt upvotes comments')
      .sort({ createdAt: sort === 'desc' ? -1 : 1 });
    
    // Normalize posts to ensure consistent upvotes structure
    posts = posts.map(post => {
      const postObj = post.toObject();
      
      // Make sure upvotes is an array
      if (!postObj.upvotes || !Array.isArray(postObj.upvotes)) {
        postObj.upvotes = [];
      }
      
      return postObj;
    });
    
    console.log('First post upvotes:', posts.length > 0 ? 
      (posts[0].upvotes ? `${posts[0].upvotes.length} upvotes` : 'no upvotes field') : 
      'no posts');
    
    // Fetch partners for the carousel sections
    const partners = await Partner.find().lean();
    console.log('Fetched partners in /home route:', JSON.stringify(partners, null, 2)); // Log fetched partners
    
    res.render('UserViews/home', { 
      posts,
      partners,
      sort,
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Server error occurred');
  }
});

// Route to delete a comment (API endpoint)
app.delete('/api/comments/:commentId', requireAdmin, async (req, res) => {
  try {
    const { commentId } = req.params;
    console.log('DEBUG: Attempting to delete comment:', commentId);
    
    const ObjectId = require('mongodb').ObjectId;
    let commentObjectId;

    // Validate the commentId format
    if (!ObjectId.isValid(commentId)) {
      console.error('DEBUG: Invalid comment ID format:', commentId);
      return res.status(400).json({ success: false, message: 'Invalid comment ID format.' });
    } else {
      commentObjectId = new ObjectId(commentId);
    }

    const commentsCollection = robolutionDb.collection('comments');
    const postsCollection = robolutionDb.collection('posts');

    // Check if this is an embedded comment by looking for posts containing it
    console.log('DEBUG: Checking for embedded comment in posts collection');
    const postWithEmbeddedComment = await postsCollection.findOne({
      'comments._id': commentObjectId
    });

    if (postWithEmbeddedComment) {
      console.log('DEBUG: Found post with embedded comment:', postWithEmbeddedComment._id);
      
      // Remove the embedded comment from the post's comments array
      const updateResult = await postsCollection.updateOne(
        { _id: postWithEmbeddedComment._id },
        { $pull: { comments: { _id: commentObjectId } } }
      );
      
      console.log('DEBUG: Update result for embedded comment removal:', 
        updateResult.matchedCount ? 'Post matched' : 'Post not matched', 
        updateResult.modifiedCount ? 'and updated' : 'but NOT updated');
      
      return res.json({ success: true, message: 'Embedded comment deleted successfully.' });
    }

    // If not an embedded comment, look in the separate comments collection
    console.log('DEBUG: Not an embedded comment, checking dedicated comments collection');
    const commentToDelete = await commentsCollection.findOne({ _id: commentObjectId });

    if (!commentToDelete) {
      console.error('DEBUG: Comment not found in either collection:', commentId);
      return res.status(404).json({ success: false, message: 'Comment not found.' });
    }

    console.log('DEBUG: Comment found in separate collection:', commentToDelete._id);
    console.log('DEBUG: Post reference:', commentToDelete.post || commentToDelete.postId);

    // Delete the comment document
    const deleteResult = await commentsCollection.deleteOne({ _id: commentObjectId });
    console.log('DEBUG: Delete result:', deleteResult);

    if (deleteResult.deletedCount === 0) {
      console.error('DEBUG: Failed to delete comment from collection:', commentId);
      return res.status(404).json({ success: false, message: 'Failed to delete comment.' });
    }

    // Get the post ID from either the post or postId field
    let postId = commentToDelete.post || commentToDelete.postId;
    
    if (postId) {
      console.log('DEBUG: Post reference found. Type:', typeof postId);
      let postIdToUpdate;
      
      if (typeof postId === 'object' && postId instanceof ObjectId) {
        postIdToUpdate = postId;
      } else if (typeof postId === 'string' && ObjectId.isValid(postId)) {
        postIdToUpdate = new ObjectId(postId);
      } else {
        console.error('DEBUG: Invalid post ID format in comment:', typeof postId, postId);
      }

      if (postIdToUpdate) {
        // Update using $pull to remove the comment ID from the post's comments array
        console.log('DEBUG: Updating post to remove comment reference');
        const updateResult = await postsCollection.updateOne(
          { _id: postIdToUpdate },
          { $pull: { comments: { $in: [commentObjectId, commentId] } } }
        );

        console.log('DEBUG: Post update result:', updateResult.matchedCount ? 'Post found' : 'Post not found', 
          updateResult.modifiedCount ? 'and updated' : 'but NOT updated');
      }
    }

    res.json({ success: true, message: 'Comment deleted successfully.' });

  } catch (error) {
    console.error('DEBUG: Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting comment.' });
  }
});

// Middleware to serve static files from the 'public' directory
// Route to make a user a judge
app.get('/account/user/make-judge/:id', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const ObjectId = require('mongodb').ObjectId;
    let userObjectId;

    // Validate and convert the userId to ObjectId
    if (!ObjectId.isValid(userId)) {
      req.flash('error', 'Invalid user ID format.');
      return res.redirect('/manage-accounts');
    }
    userObjectId = new ObjectId(userId);

    // Update the user's role in the users collection of robolutionDb
    const updateResult = await robolutionDb.collection('users').updateOne(
      { _id: userObjectId },
      { 
        $set: { 
          role: 'judge',
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      req.flash('error', 'User not found.');
      return res.redirect('/manage-accounts');
    }

    if (updateResult.modifiedCount === 0) {
      req.flash('warning', 'User is already a judge.');
      return res.redirect('/manage-accounts');
    }

    // Log the successful update
    console.log(`User ${userId} has been made a judge. Update result:`, updateResult);

    req.flash('success', 'User has been successfully made a judge.');
    res.redirect('/manage-accounts');
  } catch (error) {
    console.error('Error making user a judge:', error);
    req.flash('error', 'An error occurred while making the user a judge.');
    res.redirect('/manage-accounts');
  }
});

app.get('/scoresheet', requireJudge, (req, res) => {
  res.render('UserViews/scoresheet', { user: req.session.user });
});

// Partner Management Routes
app.get('/admin/manage-partners', requireAdmin, async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.render('admin/manage-partners', { 
      partners,
      user: req.session.user,
      dashboard: req.query.dashboard === 'true'
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).send('Server error');
  }
});

app.post('/admin/add-partner', requireAdmin, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.render('admin/manage-partners', {
        message: { type: 'danger', text: 'Please upload a logo image' },
        partners: await Partner.find().sort({ createdAt: -1 }),
        user: req.session.user,
        dashboard: req.query.dashboard === 'true'
      });
    }

    console.log('Uploaded file:', req.file);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, 'partners');
    console.log('Partner upload result:', result);
    
    // Create new partner
    const partner = new Partner({
      name: req.body.name,
      type: req.body.type || 'regular',
      url: req.body.url || '',
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id
    });

    console.log('Saving partner:', partner);
    await partner.save();
    
    // Clean up temp file after successful database save
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.render('admin/manage-partners', {
      message: { type: 'success', text: 'Partner added successfully!' },
      partners: await Partner.find().sort({ createdAt: -1 }),
      user: req.session.user,
      dashboard: req.query.dashboard === 'true'
    });
  } catch (error) {
    console.error('Error adding partner:', error);
    res.render('admin/manage-partners', {
      message: { type: 'danger', text: 'Error adding partner: ' + error.message },
      partners: await Partner.find().sort({ createdAt: -1 }),
      user: req.session.user,
      dashboard: req.query.dashboard === 'true'
    });
  }
});

app.post('/admin/delete-partner/:id', requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).send('Partner not found');
    }

    // Delete image from Cloudinary if we have the ID
    if (partner.cloudinaryId) {
      await cloudinary.uploader.destroy(partner.cloudinaryId);
    }

    // Delete partner from database
    await Partner.findByIdAndDelete(req.params.id);

    res.redirect('/admin/manage-partners' + (req.query.dashboard === 'true' ? '?dashboard=true' : ''));
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).send('Server error');
  }
});

// GET a specific score by ID (for pre-filling edit form)
app.get('/api/scores/id/:id', requireJudge, async (req, res) => {
    try {
        const scoreId = req.params.id;
        console.log(`[API GET SCORE BY ID] Attempting to fetch score with ID: ${scoreId}`);
        const score = await Score.findById(scoreId).lean();
        if (!score) {
            console.warn(`[API GET SCORE BY ID] Score not found with ID: ${scoreId}`);
            return res.status(404).json({ message: 'Score not found' });
        }
        console.log(`[API GET SCORE BY ID] Successfully fetched score:`, score);
        res.json({ score });
    } catch (error) {
        console.error(`[API GET SCORE BY ID] Error fetching score with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error fetching score details: ' + error.message });
    }
});


// POST (Submit) a new score
app.post('/api/scores', requireJudge, async (req, res) => {
    try {
        const judgeInfo = req.session.user.username; // Use authenticated judge's username
        const { eventInfo, scores, totalScore, comments, contestantType, contestantName } = req.body;

        // Basic validation
        if (!eventInfo || !contestantName || !contestantType) {
            return res.status(400).json({ message: 'Missing required fields: event, contestant name, or contestant type.' });
        }

        console.log('[API POST SCORE] Attempting to save new score. Judge:', judgeInfo, 'Data:', req.body);

        const newScore = new Score({
            eventInfo,
            judgeInfo, // Authenticated judge
            scores,
            totalScore,
            comments,
            contestantType,
            contestantName,
            submittedAt: new Date(),
            updatedAt: new Date()
        });

        const savedScore = await newScore.save();
        console.log('[API POST SCORE] Score successfully saved with ID:', savedScore._id);
        res.status(201).json({ 
            message: 'Score submitted successfully!', 
            score: savedScore 
        });
    } catch (error) {
        console.error('[API POST SCORE] Error submitting score:', error);
        res.status(500).json({ message: 'Error submitting score: ' + error.message });
    }
});

// PUT (Update) an existing score by ID
app.put('/api/scores/:id', requireJudge, async (req, res) => {
    try {
        const scoreId = req.params.id;
        const judgeInfo = req.session.user.username; // Authenticated judge
        const { eventInfo, scores, totalScore, comments, contestantType, contestantName } = req.body;

        console.log(`[API PUT SCORE] Attempting to update score ID: ${scoreId}. Judge: ${judgeInfo}. Data:`, req.body);

        const score = await Score.findById(scoreId);

        if (!score) {
            console.warn(`[API PUT SCORE] Score not found for update. ID: ${scoreId}`);
            return res.status(404).json({ message: 'Score not found' });
        }
        score.eventInfo = eventInfo || score.eventInfo;
        score.scores = scores || score.scores;
        score.totalScore = totalScore || score.totalScore; // Ensure totalScore is updated
        score.comments = comments !== undefined ? comments : score.comments;
        score.contestantType = contestantType || score.contestantType;
        score.contestantName = contestantName || score.contestantName;
        score.updatedAt = new Date();
        // judgeInfo should not change

        const updatedScore = await score.save();
        console.log('[API PUT SCORE] Score successfully updated. ID:', updatedScore._id);
        res.json({ message: 'Score updated successfully!', score: updatedScore });
    } catch (error) {
        console.error(`[API PUT SCORE] Error updating score ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error updating score: ' + error.message });
    }
});

// DELETE a score by ID
app.delete('/api/scores/:id', requireAdmin, async (req, res) => {
    try {
        const scoreId = req.params.id;
        const judgeInfo = req.session.user.username; // For logging/audit if needed

        console.log(`[API DELETE SCORE] Attempting to delete score ID: ${scoreId}. Judge: ${judgeInfo}`);

        const result = await Score.findByIdAndDelete(scoreId);

        if (!result) {
            console.warn(`[API DELETE SCORE] Score not found for deletion. ID: ${scoreId}`);
            return res.status(404).json({ message: 'Score not found for deletion' });
        }

        console.log('[API DELETE SCORE] Score successfully deleted. ID:', scoreId);
        res.json({ message: 'Score deleted successfully' });
    } catch (error) {
        console.error(`[API DELETE SCORE] Error deleting score ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error deleting score: ' + error.message });
    }
});
app.get('/api/scores/filter', allowAdminsAndJudges, async (req, res) => { // Changed requireJudge to allowAdminsAndJudges
    try {
        const { type, event } = req.query;
        console.log(`[API FILTER SCORES] Filtering scores - Type: "${type}", Event: "${event}" for user: ${req.session.user.username}, role: ${req.session.user.role}`);
        
        let filter = {};
        
        // Only add contestantType to filter if type is provided and not 'all'
        if (type && type.toLowerCase() !== 'all') {
            filter.contestantType = type;
        }
        
        // Only add eventInfo to filter if event is provided and not 'all'
        if (event && event.toLowerCase() !== 'all' && event.trim() !== '') {
            filter.eventInfo = event;
        }
        
        console.log('[API FILTER SCORES] Using filter:', filter);
        // Added sorting by totalScore (descending) then by submission date (descending)
        const scores = await Score.find(filter).lean().sort({ totalScore: -1, submittedAt: -1 }).exec(); 
        console.log(`[API FILTER SCORES] Found ${scores.length} scores matching filter.`);
        
        res.json({ scores });
    } catch (error) {
        console.error('[API FILTER SCORES] Error filtering scores:', error);
        res.status(500).json({ message: 'Error filtering scores: ' + error.message });
    }
});

// Scoresheet route
app.get('/scoresheet', requireJudge, async (req, res) => {
    try {
        // Ensure judgeInfo is available for the scoresheet template
        const userForScoresheet = { 
                ...req.session.user,
            judgeInfo: req.session.user.username 
        };
        console.log('[PAGE LOAD] Loading scoresheet page for user:', userForScoresheet.username);
        res.render('UserViews/scoresheet', { 
            user: userForScoresheet,
            scoreToEdit: null // Explicitly pass null if not editing, or score data if editing
        });
    } catch (error) {
        console.error('[PAGE LOAD ERROR] Error loading /scoresheet:', error);
        res.status(500).send('Error loading scoresheet page.');
    }
});

// Tally/Leaderboard page route
app.get('/scoresheet/tally', requireJudge, async (req, res) => {
    try {
        console.log('[PAGE LOAD] Loading tally/leaderboard page for user:', req.session.user.username);
        res.render('UserViews/tally', {
            user: req.session.user
        });
    } catch (error) {
        console.error('[PAGE LOAD ERROR] Error loading /scoresheet/tally:', error);
        res.status(500).send('Error loading leaderboard page.');
    }
});

// Edit score page route - pre-fills scoresheet for editing
app.get('/scoresheet/edit/:id', requireJudge, async (req, res) => {
    try {
        const scoreId = req.params.id;
        console.log(`Loading score ${scoreId} for editing`);
        
        const score = await Score.findById(scoreId);
        if (!score) {
            req.flash('error', 'Score not found');
            return res.redirect('/scoresheet/tally');
        }
        
        // Send to scoresheet with score data embedded
        res.render('UserViews/scoresheet', { 
            user: req.session.user,
            score: score // Pass the actual score document, not lean()
        });
    } catch (error) {
        console.error('Error loading score for edit:', error);
        res.status(500).send('Error loading score for editing');
    }
});

// Admin-only Leaderboard/Tally page
app.get('/admin/leaderboard', requireAdmin, async (req, res) => {
    try {
        console.log('[PAGE LOAD] Loading admin leaderboard page for admin:', req.session.user.username);
        // Assuming the view is now at 'views/leaderboard.ejs'
        res.render('leaderboard', { 
            user: req.session.user,
            layout: false // Assuming this page will be loaded into the admin dashboard iframe
        }); 
    } catch (error) {
        console.error('[PAGE LOAD ERROR] Error loading /admin/leaderboard:', error);
        res.status(500).send(`Error loading admin leaderboard page: <pre>${error.stack}</pre>`);
    }
});

app.get('/api/scores/all', allowAdminsAndJudges, async (req, res) => {
    try {
        console.log(`[API GET ALL SCORES] Fetching all scores from database for user: ${req.session.user.username}, role: ${req.session.user.role}`);
        
        const scores = await Score.find().lean().sort({ totalScore: -1, submittedAt: -1 }).exec(); // Added sorting and .exec()
        
        console.log(`[API GET ALL SCORES] Found ${scores.length} scores.`);
        
        if (scores.length > 0) {
            const firstScoreSummary = {
                _id: scores[0]._id,
                contestantName: scores[0].contestantName,
                eventInfo: scores[0].eventInfo,
                totalScore: scores[0].totalScore,
                judgeInfo: scores[0].judgeInfo
            };
            console.log('[API GET ALL SCORES] First score example (summary):', JSON.stringify(firstScoreSummary));
        }
        
        res.json({ scores });
    } catch (error) {
        console.error('[API GET ALL SCORES] Error fetching all scores:', error);
        res.status(500).json({ message: 'Error fetching all scores: ' + error.message });
    }
});

// Route to make a judge a regular user
app.get('/account/judge/make-user/:id', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const ObjectId = require('mongodb').ObjectId;
    let userObjectId;

    // Validate and convert the userId to ObjectId
    if (!ObjectId.isValid(userId)) {
      req.flash('error', 'Invalid user ID format.');
      return res.redirect('/manage-accounts');
    }
    userObjectId = new ObjectId(userId);

    // Find the user first to make sure they exist and are a judge
    const user = await robolutionDb.collection('users').findOne({ _id: userObjectId });
    
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/manage-accounts');
    }

    if (user.role !== 'judge') {
      req.flash('warning', 'This user is not a judge.');
      return res.redirect('/manage-accounts');
    }

    // Update the user's role in the users collection of robolutionDb
    const updateResult = await robolutionDb.collection('users').updateOne(
      { _id: userObjectId },
      { 
        $set: { 
          role: 'user',
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      req.flash('warning', 'User is already a regular user.');
      return res.redirect('/manage-accounts');
    }

    // Log the successful update
    console.log(`Judge ${userId} has been converted to a regular user. Update result:`, updateResult);

    req.flash('success', 'Judge has been successfully converted to a regular user.');
    res.redirect('/manage-accounts');
  } catch (error) {
    console.error('Error converting judge to user:', error);
    req.flash('error', 'An error occurred while converting the judge to a regular user.');
    res.redirect('/manage-accounts');
  }
}); 