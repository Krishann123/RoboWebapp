import fs, { write } from "fs";
import path from "path";
import { supabase } from "@/lib/supabase-client";

// More robust path resolution
const findDefaultJsonPath = () => {
  // Construct the path relative to the current module's directory
  // This is more reliable than using process.cwd() in some environments.
  const projectRoot = path.resolve(process.cwd(), '..');
  const internationalDir = path.resolve(projectRoot, 'international');
  const jsonPath = path.join(internationalDir, "default.json");

  if (fs.existsSync(jsonPath)) {
    console.log(`Using default.json from: ${jsonPath}`);
    return jsonPath;
  }
  
  // Fallback for different project structures
  const fallbackPath = path.resolve(process.cwd(), "default.json");
   if (fs.existsSync(fallbackPath)) {
    console.log(`Using default.json from fallback: ${fallbackPath}`);
    return fallbackPath;
  }

  console.error("Could not find default.json");
  throw new Error("default.json not found");
};

const jsonPath = findDefaultJsonPath();

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const connectionInfo = {
    db: supabase,
    status: false,
};

/**
 * Get country-specific content based on the country slug
 * @param {string} countrySlug - The URL slug for the country (e.g., "singapore")
 * @returns {Promise<Object|null>} - The country data or null if not found
 */
async function getCountryContent(countrySlug) {
  try {
    // For SSR mode, use Astro.locals if available
    if (import.meta.env.SSR) {
      // Pull the countryData from Astro.locals if it was passed by Express middleware
      const response = await fetch(`/api/country/${countrySlug}`);
      if (!response.ok) {
        console.error(`Failed to fetch country data: ${response.status}`);
        return null;
      }
      
      return await response.json();
    } else {
      // Client-side, make API call to fetch country data
      const response = await fetch(`/api/country/${countrySlug}`);
      if (!response.ok) {
        console.error(`Failed to fetch country data: ${response.status}`);
        return null;
      }
      
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
    return null;
  }
}

async function getDbData() {
    const tdata = readFile();

    try {
        // Fetch data from the "Templates" table
        const { data, error } = await connectionInfo.db
            .from("Templates")
            .select("*"); // Select all columns

        if (error) {
            console.error("Error fetching data:", error);
            return [];
        }

        // Map the rows to objects if needed
        const mappedData = mapDbRowsToObjects(data);
        tdata.templates = mappedData; // Update the JSON data with fetched data
        console.log(data);

        console.log("Fetched data:", mappedData);
        writeFile(jsonPath, tdata); // Write the updated data back to the JSON file
        return mappedData;
    } catch (err) {
        console.error("Unexpected error:", err);
        return [];
    }
}

function mapDbRowsToObjects(rows) {
    return rows.map(({ Name, config }) => {
        return { [Name]: config };
    });
}

function readFile(dbName = jsonPath) {
    console.log(`Reading from: ${dbName}`);
    try {
        return JSON.parse(
            fs.readFileSync(dbName, "utf8")
        );
    } catch (err) {
        console.error(`Error reading file at ${dbName}:`, err);
        throw err;
    }
}

// Get the template index for the current country context
function getTemplateIndexForCurrentContext(requestHeaders) {
    try {
        // Check if request headers are available (server-side)
        if (requestHeaders && requestHeaders.get) {
            const countryHeader = requestHeaders.get('x-country-site');
            if (countryHeader) {
                const countryInfo = JSON.parse(countryHeader);
                if (countryInfo && typeof countryInfo.templateIndex === 'number') {
                    console.log(`Using template index ${countryInfo.templateIndex} for ${countryInfo.name}`);
                    return countryInfo.templateIndex;
                }
            }
        }
        
        // Client-side: use window.countryInfo if available
        if (typeof window !== 'undefined' && window.countryInfo && typeof window.countryInfo.templateIndex === 'number') {
            return window.countryInfo.templateIndex;
        }
    } catch (error) {
        console.error('Error getting template index from context:', error);
    }
    
    // If no country context is available, use the default selected index
    const fileData = readFile();
    return fileData.selectedIndex || 0;
}

function writeFile(dbName = jsonPath, newData) {
    console.log(`Writing to: ${dbName}`);
    try {
        fs.writeFileSync(dbName, JSON.stringify(newData, null, 4));
        console.log("Writing Completed.");
    } catch (err) {
        console.error(`Error writing to file at ${dbName}:`, err);
        throw err;
    }
}

function deleteFileContents(dbName = jsonPath) {
    writeFile(dbName, []);
    console.log("deleted");
}

async function fetchPageContent(pageName, requestHeaders) {
    console.log(`Fetching content for page: ${pageName}`);
    const fileData = readFile();
    
    // Use country-specific template index if available
    const selectedIndex = getTemplateIndexForCurrentContext(requestHeaders) || fileData.selectedIndex;
    console.log(`Using template index: ${selectedIndex}`);

    try {
        // Make sure the template exists
        if (!fileData.templates[selectedIndex]) {
            console.log(`Template index ${selectedIndex} not found, falling back to default`);
            return fetchPageContent(pageName); // Recursive call without requestHeaders to use default
        }
        
        const contents = Object.values(fileData.templates[selectedIndex])[0].Contents;
        console.log(`Available content keys: ${Object.keys(contents).join(', ')}`);
        
        // Try exact match first
        if (contents[pageName]) {
            console.log(`Found exact match for ${pageName}`);
            return contents[pageName];
        }
        
        // If not found, try case-insensitive matching and singular/plural variants
        const keys = Object.keys(contents);
        const matchingKey = keys.find(key => 
            key.toLowerCase() === pageName.toLowerCase() || 
            key.toLowerCase() === pageName.toLowerCase() + 's' || 
            key.toLowerCase() === pageName.toLowerCase().replace(/s$/, '')
        );
        
        if (matchingKey) {
            console.log(`Using content from "${matchingKey}" for page "${pageName}"`);
            return contents[matchingKey];
        }
        
        console.log(`No content found for page: ${pageName}`);
        return {};
    } catch (error) {
        console.log(`Error fetching page content for ${pageName}:`, error);
        return {};
    }
}

function getPageDetails() {
    const fileData = readFile();
    const selectedIndex = fileData.selectedIndex;
    const pages = Object.keys(
        Object.values(fileData.templates[selectedIndex])[0].Contents
    );

    const sections = pages.map((item) => {
        return Object.keys(
            Object.values(fileData.templates[selectedIndex])[0].Contents[item]
        );
    });

    const contentKeys = pages.map((key, index) => {
        return sections[index].map((element) => {
            // console.log(element);
            return Object.keys(
                Object.values(fileData.templates[selectedIndex])[0].Contents[
                    key
                ][element]
            );
        });
    });

    const contentValues = pages.map((key, index) => {
        return sections[index].map((element) => {
            // console.log(element);
            return Object.values(
                Object.values(fileData.templates[selectedIndex])[0].Contents[
                    key
                ][element]
            );
        });
    });

    const all = pages.map((pageName, index) => ({
        pageName,
        sections: sections[index],
        contentKeys: contentKeys[index],
        contentValues: contentValues[index],
    }));

    return all;
}

function updateContent(location, description) {
    const properLocation = location.split("-");
    const fileData = readFile();
    const selectedIndex = fileData.selectedIndex;
    const pageName = properLocation[0];
    const sectionName = properLocation[1];
    const contentName = properLocation[2];
    const contentName2 = properLocation[3];
    const contentName3 = properLocation[4];

    // Directly modify the nested object in fileData
    if (contentName3) {
        Object.values(fileData.templates[selectedIndex])[0].Contents[pageName][
            sectionName
        ][contentName][contentName2][contentName3] = description;
    } else if (contentName2) {
        Object.values(fileData.templates[selectedIndex])[0].Contents[pageName][
            sectionName
        ][contentName][contentName2] = description;
    } else {
        Object.values(fileData.templates[selectedIndex])[0].Contents[pageName][
            sectionName
        ][contentName] = description;
    }

    writeFile(jsonPath, fileData);
}

function addNewsCard(category, newsCardObj) {
    const fileData = readFile();
    const selectedIndex = fileData.selectedIndex;

    const newsContent = Object.values(fileData.templates[selectedIndex])[0]
        .Contents.News[category];

    // Add new NewsCard to the front
    newsContent.unshift(newsCardObj);

    // If more than 4, remove the last
    if (newsContent.length > 3) {
        newsContent.pop();
    }

    writeFile(jsonPath, fileData);
}

await getDbData(); // Call the function to fetch data from the database

//for creating a new template not yet in use
function createNewData(name = "New Template") {
    const fileData = readFile();
    const defaultData = Object.values(fileData.templates[0])[0];

    fileData.templates.push({
        [name]: {
            ...defaultData,
        },
    });
    writeFile(jsonPath, fileData);
}

function getData() {
    const fileData = readFile();
    return fileData.templates.map((item) => {
        return Object.keys(item)[0];
    });
}

function getSelectedTemplate() {
    const fileData = readFile();
    const selectedIndex = fileData.selectedIndex;
    return Object.values(fileData.templates[selectedIndex])[0];
}

function getSelectedIndex() {
    const fileData = readFile();
    return fileData.selectedIndex;
}

function setSelectedIndex(index) {
    const fileData = readFile();
    fileData.selectedIndex = index;
    writeFile(jsonPath, fileData);
}

/**
 * Get all country sites
 * @returns {Promise<Array>} - An array of country sites
 */
export async function getAllCountrySites() {
  try {
    const response = await fetch('/api/countries');
    if (!response.ok) {
      console.error(`Failed to fetch countries: ${response.status}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

/**
 * Get country-specific tournament information
 * @param {string} countrySlug - The URL slug for the country
 * @returns {Promise<Object|null>} - Tournament information or null if not found
 */
export async function getCountryTournament(countrySlug) {
  try {
    const response = await fetch(`/api/country/${countrySlug}/tournament`);
    if (!response.ok) {
      console.error(`Failed to fetch tournament data: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    return null;
  }
}

/**
 * Get country-specific training information
 * @param {string} countrySlug - The URL slug for the country
 * @returns {Promise<Object|null>} - Training information or null if not found
 */
export async function getCountryTraining(countrySlug) {
  try {
    const response = await fetch(`/api/country/${countrySlug}/training`);
    if (!response.ok) {
      console.error(`Failed to fetch training data: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching training data:', error);
    return null;
  }
}

/**
 * Get country-specific gallery images
 * @param {string} countrySlug - The URL slug for the country
 * @returns {Promise<Array>} - An array of gallery images
 */
export async function getCountryGallery(countrySlug) {
  try {
    const response = await fetch(`/api/country/${countrySlug}/gallery`);
    if (!response.ok) {
      console.error(`Failed to fetch gallery data: ${response.status}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return [];
  }
}

// Export all functions
export {
    getCountryContent,
    getDbData,
    readFile,
    writeFile,
    deleteFileContents,
    fetchPageContent,
    getPageDetails,
    updateContent,
    addNewsCard,
    createNewData,
    getData,
    getSelectedTemplate,
    getSelectedIndex,
    setSelectedIndex
};
