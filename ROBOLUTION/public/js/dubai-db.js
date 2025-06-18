// MongoDB database utility functions for Dubai site
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Connection URI from environment variable
const uri = process.env.MONGODB_URI;

// Create a new MongoClient
const client = new MongoClient(uri);

// Database and collections
let db;
let templatesCollection;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB for Dubai site");
    db = client.db('robolution');
    templatesCollection = db.collection('templates');
    
    // Clear existing templates if required (for debugging/reset)
    // Uncomment the next line to reset the database when needed
    // await templatesCollection.deleteMany({});
    
    // Initialize the database with default data if needed
    await initializeDatabase();
    
    return db;
  } catch (err) {
    console.error("Error connecting to MongoDB for Dubai site:", err);
    throw err;
  }
}

// Initialize database with default data if empty
async function initializeDatabase() {
  try {
    const count = await templatesCollection.countDocuments();
    
    if (count === 0) {
      console.log("No templates found, initializing with default template");
      
      // Check if default.json exists in the original Astro app
      const defaultJsonPath = path.join(__dirname, '..', 'international', 'server', 'default.json');
      let defaultData;
      
      if (fs.existsSync(defaultJsonPath)) {
        // Read the default.json file from the Astro app
        const fileContent = fs.readFileSync(defaultJsonPath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        
        // Extract the template from the file
        if (jsonData && jsonData.templates && jsonData.templates.length > 0) {
          const template = jsonData.templates[0];
          const templateName = Object.keys(template)[0];
          const templateConfig = Object.values(template)[0];
          
          // Insert the template into the database
          await templatesCollection.insertOne({
            Name: templateName,
            config: templateConfig
          });
          
          // Set this as the selected template
          await db.collection('settings').updateOne(
            { key: 'selectedTemplate' },
            { $set: { value: templateName } },
            { upsert: true }
          );
          
          console.log(`Initialized database with template "${templateName}" from default.json`);
        } else {
          console.warn("default.json does not contain valid template data");
          await createEmptyTemplate();
        }
      } else {
        console.warn("default.json not found, creating empty template");
        await createEmptyTemplate();
      }
    } else {
      console.log(`Database already has ${count} templates`);
    }
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }
}

// Create an empty template if no default template is available
async function createEmptyTemplate() {
  const emptyTemplate = {
    Name: "default",
    config: {
      Contents: {
        Home: {
          hero: {
            mainText: "ROBOLUTION DUBAI",
            subText: "Welcome to Robolution Dubai! This is a default template.",
            buttonText: "Explore Packages",
            videoDirectory: "/images/videos/hero-video.mp4"
          },
          Robolution: {
            title1: {
              intro1: "INNOVATION",
              sub1: "Embracing cutting-edge technology",
              textColor1: "#000000",
              textColor2: "#666666",
              containerColor1: "#f5f5f5",
              image1: "/images/innovation.jpg"
            },
            title2: {
              intro2: "EXCELLENCE",
              sub2: "Striving for the highest quality in robotics",
              textColor1: "#000000",
              textColor2: "#666666",
              containerColor2: "#e9e9e9",
              image2: "/images/excellence.jpg"
            }
          },
          package: [
             {
               title: "OUR PACKAGES"
             },
             {
               package: {
                 name: "COMPETITION PACKAGE",
                 description: "Join our robotics competitions and showcase your skills on an international stage.",
                 color: "#ffffff",
                 containerColor: "#5E17EB",
                 titleColor: "#6AAAFF",
                 display: "flex",
                 image: "/images/competition.jpg",
                 buttonText: "Learn More",
                 buttonLink: "/international/competition"
               }
             },
             {
               package: {
                 name: "TRAINING PACKAGE",
                 description: "Comprehensive robotics training programs for all skill levels.",
                 color: "#ffffff",
                 containerColor: "#5E17EB",
                 titleColor: "#ffffff",
                 display: "flex",
                 image: "/images/training.jpg",
                 buttonText: "Learn More",
                 buttonLink: "/international/training"
               }
             }
           ],
          Partners: {
             src: [
               {
                 image: "/images/partner1.png"
               },
               {
                 image: "/images/partner2.png"
               }
             ]
          },
          Highlights: {
            "Title": "EVENT HIGHLIGHTS",
            "Highlight1": { "Icon1": "/images/icons/icon1.png", "Highlight1": "Championships", "description1": "Annual robotics championships" },
            "Highlight2": { "Icon2": "/images/icons/icon2.png", "Highlight2": "Workshops", "description2": "Hands-on learning experiences" },
            "Highlight3": { "Icon3": "/images/icons/icon3.png", "Highlight3": "Summits", "description3": "Connect with industry leaders" },
            "Highlight4": { "Icon4": "/images/icons/icon4.png", "Highlight4": "Competitions", "description4": "Showcase your skills" },
            "Highlight5": { "Icon5": "/images/icons/icon5.png", "Highlight5": "Exhibitions", "description5": "Discover new technologies" }
          },
          joinContent: {
              "title": "JOIN ROBOLUTION",
              "body": "Be part of the robotics revolution and shape the future of technology with us. Register now to get started!",
              "button": "Register Now",
              "buttonLink": "/international/register"
          },
          newsContent: {
              "sectionTitle": "NEWS & UPDATES",
              "moreNewsLink": {
                  "text": "View all news",
                  "href": "/international/news"
              }
          },
          FrequentlyAsk: {
              "Title": "FREQUENTLY ASKED QUESTIONS",
              "description1": "Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.",
              "Question1": "How do I register for an event?",
              "Answer1": "You can register for any event by navigating to its specific page and filling out the registration form. You will receive a confirmation email upon successful registration.",
              "Question2": "What are the different competition categories?",
              "Answer2": "We offer a wide range of categories for different age groups and skill levels, including autonomous robotics, drone competitions, and more. Details can be found on the tournament page.",
              "Question3": "Are there any training programs for beginners?",
              "Answer3": "Absolutely! We provide comprehensive training programs and workshops for beginners to help them get started with robotics. Check our trainings page for more information."
          }
        },
        Navbar: {
          Content: {
            links: [
              {
                name: "Home",
                path: "/international"
              },
              {
                name: "News",
                path: "/international/news"
              },
              {
                name: "Trainings",
                path: "/international/trainings"
              },
              {
                name: "Tournament",
                path: "/international/tournament"
              }
            ],
            button: {
              buttonText: "Register Now",
              buttonLink: "/international/register",
              image: "/images/logo.png"
            }
          }
        },
        Footer: {
          logo: "/images/logo.png",
          about: "Robolution Dubai is at the forefront of robotics innovation.",
          quickLinks: [
            {
              text: "Home",
              url: "/international"
            },
            {
              text: "News",
              url: "/international/news"
            },
            {
              text: "Trainings",
              url: "/international/trainings"
            }
          ],
          address: "Dubai, United Arab Emirates",
          email: "contact@robolutiondubai.com",
          phone: "+971 123 456789",
          socialLinks: [
            {
              name: "Facebook",
              icon: "/images/icons/facebook.png",
              url: "https://facebook.com"
            },
            {
              name: "Twitter",
              icon: "/images/icons/twitter.png",
              url: "https://twitter.com"
            }
          ]
        },
        Banner: {
          message: "Welcome to Robolution Dubai!",
          bannerContent: {
            message: "Register now for upcoming events!",
            backgroundColor: "#4B0082",
            buttonText: "Register",
            buttonHref: "/international/register",
            buttonBackground: "#6441A5"
          }
        },
        News: {
            "latest-news": [
                { "NewsCard": { "link": "/international/news/1", "image": "/images/news1.jpg", "alt": "Robotics Competition 2025", "date": "June 10, 2025", "title": "Annual Robotics Competition Announced", "description": "The 2025 Annual Robotics Competition is now open for registration. Teams from all over the world are invited to participate." } },
                { "NewsCard": { "link": "/international/news/2", "image": "/images/news2.jpg", "alt": "AI Workshop", "date": "June 5, 2025", "title": "New Workshop on AI and Machine Learning", "description": "We are excited to launch a new workshop focused on Artificial Intelligence and its applications in robotics." } },
                { "NewsCard": { "link": "/international/news/3", "image": "/images/news3.jpg", "alt": "Partnership Announcement", "date": "May 28, 2025", "title": "Erovoutika Partners with Tech Corp", "description": "A new strategic partnership to foster innovation and provide more opportunities for young engineers." } }
            ]
        },
        Trainings: {},
        Tournament: {},
        Login: {},
        Admin: {}
      }
    }
  };
  
  await templatesCollection.insertOne(emptyTemplate);
  
  // Set this as the selected template
  await db.collection('settings').updateOne(
    { key: 'selectedTemplate' },
    { $set: { value: "default" } },
    { upsert: true }
  );
  
  console.log("Created empty default template");
}

// Get all templates
async function getTemplates() {
  try {
    return await templatesCollection.find().toArray();
  } catch (err) {
    console.error("Error fetching templates:", err);
    return [];
  }
}

// Get template by name
async function getTemplateByName(name) {
  try {
    return await templatesCollection.findOne({ Name: name });
  } catch (err) {
    console.error(`Error fetching template ${name}:`, err);
    return null;
  }
}

// Fetch page content
async function fetchPageContent(pageName) {
  try {
    // Get selected template from settings collection
    const settings = await db.collection('settings').findOne({ key: 'selectedTemplate' });
    const selectedTemplateName = settings?.value || 'default';
    
    // Get the template
    const template = await getTemplateByName(selectedTemplateName);
    
    if (!template || !template.config || !template.config.Contents || !template.config.Contents[pageName]) {
      console.error(`No content found for page: ${pageName}`);
      return {};
    }
    
    return template.config.Contents[pageName];
  } catch (err) {
    console.error(`Error fetching page content for ${pageName}:`, err);
    return {};
  }
}

// Update content
async function updateContent(location, description) {
  try {
    // Parse the location string to determine the path
    const properLocation = location.split("-");
    const pageName = properLocation[0];
    const sectionName = properLocation[1];
    const contentName = properLocation[2];
    const contentName2 = properLocation[3];
    const contentName3 = properLocation[4];
    
    // Get the current selected template
    const settings = await db.collection('settings').findOne({ key: 'selectedTemplate' });
    const selectedTemplateName = settings?.value || 'default';
    
    // Prepare the update object based on the path depth
    let updateQuery = {};
    
    if (contentName3) {
      updateQuery[`config.Contents.${pageName}.${sectionName}.${contentName}.${contentName2}.${contentName3}`] = description;
    } else if (contentName2) {
      updateQuery[`config.Contents.${pageName}.${sectionName}.${contentName}.${contentName2}`] = description;
    } else {
      updateQuery[`config.Contents.${pageName}.${sectionName}.${contentName}`] = description;
    }
    
    // Update the template
    await templatesCollection.updateOne(
      { Name: selectedTemplateName },
      { $set: updateQuery }
    );
    
    console.log(`Content updated at ${location}`);
  } catch (err) {
    console.error("Error updating content:", err);
    throw err;
  }
}

// Add news card
async function addNewsCard(category, newsCardObj) {
  try {
    // Get the current selected template
    const settings = await db.collection('settings').findOne({ key: 'selectedTemplate' });
    const selectedTemplateName = settings?.value || 'default';
    
    // Get the current news content
    const template = await getTemplateByName(selectedTemplateName);
    const newsContent = template?.config?.Contents?.News?.[category] || [];
    
    // Add new card to the front
    newsContent.unshift(newsCardObj);
    
    // If more than 3 cards, remove the last one
    if (newsContent.length > 3) {
      newsContent.pop();
    }
    
    // Update the news content
    await templatesCollection.updateOne(
      { Name: selectedTemplateName },
      { $set: { [`config.Contents.News.${category}`]: newsContent } }
    );
    
    console.log(`News card added to ${category}`);
  } catch (err) {
    console.error("Error adding news card:", err);
    throw err;
  }
}

// Get selected template name
async function getSelectedTemplateName() {
  try {
    const settings = await db.collection('settings').findOne({ key: 'selectedTemplate' });
    return settings?.value || 'default';
  } catch (err) {
    console.error("Error getting selected template:", err);
    return 'default';
  }
}

// Create a new template
async function createNewTemplate(name = "New Template") {
  try {
    // Get default template to copy structure
    const defaultTemplate = await getTemplateByName('default');
    
    if (!defaultTemplate) {
      throw new Error("Default template not found");
    }
    
    // Create new template with the same structure
    await templatesCollection.insertOne({
      Name: name,
      config: { ...defaultTemplate.config }
    });
    
    console.log(`New template created: ${name}`);
  } catch (err) {
    console.error("Error creating new template:", err);
    throw err;
  }
}

// Set selected template
async function setSelectedTemplate(templateName) {
  try {
    await db.collection('settings').updateOne(
      { key: 'selectedTemplate' },
      { $set: { value: templateName } },
      { upsert: true }
    );
    
    console.log(`Selected template set to: ${templateName}`);
  } catch (err) {
    console.error("Error setting selected template:", err);
    throw err;
  }
}

// Export functions
module.exports = {
  connectToDatabase,
  getTemplates,
  getTemplateByName,
  fetchPageContent,
  updateContent,
  addNewsCard,
  createNewTemplate,
  setSelectedTemplate,
  getSelectedTemplateName
}; 