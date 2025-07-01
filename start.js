const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Force production mode
process.env.NODE_ENV = 'production';

// Configuration
const INTERNATIONAL_APP_DIR = path.join(__dirname, 'international');
const MAIN_APP_DIR = path.join(__dirname, 'ROBOLUTION');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ASTRO_DEV_PORT = 4321; // Default Astro dev port

// Set a consistent domain for cookie sharing
// Make sure cookie domain is set correctly for localhost
process.env.COOKIE_DOMAIN = 'localhost'; // Always use localhost for local development
// Add SESSION_SECRET for consistent session management
process.env.SESSION_SECRET = fs.existsSync('./.jwt_secret') 
  ? fs.readFileSync('./.jwt_secret', 'utf8').trim()
  : 'your-secure-admin-key';

// Added redirect from /home/profile to /profile in the ROBOLUTION app
// This ensures the profile button in the international app works correctly

// Log the environment mode
console.log(`Running in ${IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'} mode (NODE_ENV: ${process.env.NODE_ENV})`);
console.log(`Using cookie domain: ${process.env.COOKIE_DOMAIN}`);

// Helper function to log with timestamps
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Function to ensure directory exists
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`);
  }
}

// Copy directory recursively
function copyDirSync(src, dest) {
  // Clean the destination directory if it exists
  if (fs.existsSync(dest)) {
    log(`Cleaning existing directory: ${dest}`);
    fs.rmSync(dest, { recursive: true, force: true });
  }
  
  // Create fresh directory
  ensureDirExists(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  log(`Copied directory from ${src} to ${dest}`);
}

// Function to check if port is available
async function isPortAvailable(port, attempts = 30, interval = 1000) {
  const http = require('http');
  
  return new Promise((resolve) => {
    let attemptCount = 0;
    const checkPort = () => {
      attemptCount++;
      const req = http.get(`http://localhost:${port}/`, (res) => {
        // Port is in use, service is available
        log(`✅ Service on port ${port} is available (status: ${res.statusCode})`);
        resolve(true);
      });
      
      req.on('error', (err) => {
        if (attemptCount >= attempts) {
          log(`❌ Service on port ${port} is not available after ${attempts} attempts`);
          resolve(false);
          return;
        }
        
        log(`⏳ Waiting for service on port ${port}... (attempt ${attemptCount}/${attempts})`);
        setTimeout(checkPort, interval);
      });
      
      req.end();
    };
    
    checkPort();
  });
}

// Function to run a command
function runCommand(command, args, options = {}) {
  const { cwd, onExit, name } = options;
  const displayName = name || command;
  
  log(`Starting ${displayName}...`);
  const proc = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      // Pass environment variables needed for session management
      COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
      SESSION_SECRET: process.env.SESSION_SECRET,
      SESSION_COOKIE_PATH: '/',
      RUN_ENV: IS_PRODUCTION ? 'production' : 'development'
    }
  });
  
  proc.on('exit', (code) => {
    log(`${displayName} exited with code ${code}`);
    if (onExit) onExit(code);
  });
  
  return proc;
}

// Main function to start all services
async function start() {
    log('Starting combined application...');

    if (IS_PRODUCTION) {
        log('Running in PRODUCTION mode');

        // Removed: Building international app...
        // Removed: runCommand('npm', ['run', 'build'], { cwd: INTERNATIONAL_APP_DIR, name: 'International build' })

        // *** Directly proceed to copying built files and starting main app ***
        log('International app assumed built by Render. Copying necessary files...');

        // Copy default.json to ROBOLUTION directory (if it's part of the built output or needed)
        log('Copying default.json for direct access...');
        const defaultJsonSrc = path.join(INTERNATIONAL_APP_DIR, 'default.json'); // This should likely be INTERNATIONAL_APP_DIR/dist/default.json or similar
        const defaultJsonDest = path.join(MAIN_APP_DIR, 'default.json');

        if (fs.existsSync(defaultJsonSrc)) {
            fs.copyFileSync(defaultJsonSrc, defaultJsonDest);
            log('Successfully copied default.json file');
        } else {
            log('Warning: default.json file not found in Astro source. Verify path if it should exist in build.');
        }

        // Copy public directory contents from Astro's build output
        // Astro's build output is typically in 'dist' (or configured `outDir`)
        const astroBuiltOutputDir = path.join(INTERNATIONAL_APP_DIR, 'dist'); // Assuming Astro builds to 'dist'
        log(`Copying built Astro content from ${astroBuiltOutputDir} to ROBOLUTION/public/international...`);
        const publicDestDir = path.join(MAIN_APP_DIR, 'public/international');

        if (fs.existsSync(astroBuiltOutputDir)) {
            ensureDirExists(publicDestDir);
            copyDirSync(astroBuiltOutputDir, publicDestDir); // Copy the *built* output
            log('Successfully copied built Astro content to ROBOLUTION/public/international');
        } else {
            log(`ERROR: Astro built output directory not found at ${astroBuiltOutputDir}. Build might have failed or path is wrong.`);
            process.exit(1); // Exit if the built directory isn't there
        }

        // Start main app after ensuring files are copied
        log('Starting main application...');
        runCommand('npm', ['start'], {
            cwd: MAIN_APP_DIR,
            name: 'Main app'
        });

    } else {
        // ... (your existing DEVELOPMENT mode logic) ...
        log('Running in DEVELOPMENT mode');

        // Start Astro dev server
        const astroProcess = runCommand('npm', ['run', 'dev'], {
            cwd: INTERNATIONAL_APP_DIR,
            name: 'International app'
        });

        // Wait for Astro dev server to be ready
        log(`Waiting for Astro dev server on port ${ASTRO_DEV_PORT}...`);
        const isAstroReady = await isPortAvailable(ASTRO_DEV_PORT);

        if (isAstroReady) {
            log('Astro dev server is ready. Starting main application...');
            runCommand('npm', ['run', 'dev'], {
                cwd: MAIN_APP_DIR,
                name: 'Main app'
            });
        } else {
            log('Timed out waiting for Astro dev server. Starting main app anyway...');
            runCommand('npm', ['run', 'dev'], {
                cwd: MAIN_APP_DIR,
                name: 'Main app'
            });
        }
    }
}

// Start the application
start().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
}); 