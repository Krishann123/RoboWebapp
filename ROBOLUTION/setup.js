const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Post = require('./models/Post');

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

// After connecting to MongoDB, set up initial data
async function initializeData() {
  try {
    // Create admin user if it doesn't exist
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true
      });
      console.log('Admin user created');
    }

    // Create Dubai country site if it doesn't exist
    const CountrySite = require('./models/CountrySite');
    const dubaiSite = await CountrySite.findOne({ slug: 'dubai' });
    if (!dubaiSite) {
      await CountrySite.create({
        name: 'Dubai',
        slug: 'dubai',
        title: 'Erovoutika Dubai',
        description: 'Erovoutika Dubai site for ROBOLUTION 2025 featuring trainings, tournaments, and more!',
        templateName: 'test',
        templateIndex: 0,
        active: true,
        flagUrl: '/images/flags/dubai-flag.png',
        customStyles: {
          primaryColor: '#00008b',
          secondaryColor: '#FFB366',
          accentColor: '#6AAAFF',
          backgroundColor: '#FFFFFF'
        }
      });
      console.log('Dubai country site created');
    }

    // Create test post if no posts exist
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      await Post.create({
        title: 'Welcome to ROBOLUTION',
        content: 'This is your first post. Edit or delete it, then start blogging!',
        author: 'Admin',
        region: 'All'
      });
      console.log('Sample post created');
    }
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Call the initialize function
initializeData();

console.log('Setup completed!'); 