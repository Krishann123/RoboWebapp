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

// Log the environment mode
console.log(`Running in ${IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'} mode (NODE_ENV: ${process.env.NODE_ENV})`);

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
    shell: true
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
    // Production mode: build Astro app then start main app
    log('Running in PRODUCTION mode');
    
    // Build Astro app
    log('Building international app...');
    runCommand('npm', ['run', 'build'], { 
      cwd: INTERNATIONAL_APP_DIR,
      name: 'International build'
    }).on('exit', (code) => {
      if (code === 0) {
        // Copy default.json to ROBOLUTION directory
        log('Copying default.json for direct access...');
        const defaultJsonSrc = path.join(INTERNATIONAL_APP_DIR, 'default.json');
        const defaultJsonDest = path.join(MAIN_APP_DIR, 'default.json');
        
        if (fs.existsSync(defaultJsonSrc)) {
          fs.copyFileSync(defaultJsonSrc, defaultJsonDest);
          log('Successfully copied default.json file');
        } else {
          log('Warning: default.json file not found');
        }
        
        // Copy public directory contents
        log('Copying public directory contents...');
        const publicSrcDir = path.join(INTERNATIONAL_APP_DIR, 'public');
        const publicDestDir = path.join(MAIN_APP_DIR, 'public/international');
        
        if (fs.existsSync(publicSrcDir)) {
          ensureDirExists(publicDestDir);
          copyDirSync(publicSrcDir, publicDestDir);
          log('Successfully copied public directory contents');
        } else {
          log('Warning: public directory not found');
        }
        
        // Copy assets from src/assets to be accessible
        log('Copying src/assets for direct access...');
        const srcAssetsDir = path.join(INTERNATIONAL_APP_DIR, 'src/assets');
        const publicAssetsDir = path.join(MAIN_APP_DIR, 'public/international/src/assets');
        
        // Ensure the public/international directory exists
        ensureDirExists(path.join(MAIN_APP_DIR, 'public/international'));
        
        // Copy the assets directory
        if (fs.existsSync(srcAssetsDir)) {
          copyDirSync(srcAssetsDir, publicAssetsDir);
          log('Successfully copied src/assets directory');
        } else {
          log('Warning: src/assets directory not found');
        }
        
        // Start main app after successful build
        log('Starting main application...');
        runCommand('npm', ['start'], { 
          cwd: MAIN_APP_DIR,
          name: 'Main app'
        });
      } else {
        log('International app build failed. Exiting.');
        process.exit(1);
      }
    });
  } else {
    // Development mode: start both apps in parallel
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