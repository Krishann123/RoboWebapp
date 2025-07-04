const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Create necessary directories
const requiredDirs = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'public/uploads'),
  path.join(__dirname, 'public/uploads/temp'),
  path.join(__dirname, 'public/images'),
  path.join(__dirname, 'public/css'),
  path.join(__dirname, 'public/js'),
  path.join(__dirname, 'public/international') // Add directory for international
];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Build the Astro app in production mode
if (process.env.NODE_ENV === 'production') {
  console.log('Building international app for production...');
  exec('cd ../international && npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error building international app: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`International app build stderr: ${stderr}`);
    }
    console.log(`International app build stdout: ${stdout}`);
    console.log('International app built successfully');
  });
} else {
  console.log('Skipping international app build in development mode');
}

console.log('Setup completed!'); 