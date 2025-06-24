import fs from 'fs';
import path from 'path';
import { s as supabase } from './supabase-client_BrwR6F9D.mjs';

const findDefaultJsonPath = () => {
  const projectRoot = path.resolve(process.cwd(), "..");
  const internationalDir = path.resolve(projectRoot, "international");
  const jsonPath2 = path.join(internationalDir, "default.json");
  if (fs.existsSync(jsonPath2)) {
    console.log(`Using default.json from: ${jsonPath2}`);
    return jsonPath2;
  }
  const fallbackPath = path.resolve(process.cwd(), "default.json");
  if (fs.existsSync(fallbackPath)) {
    console.log(`Using default.json from fallback: ${fallbackPath}`);
    return fallbackPath;
  }
  console.error("Could not find default.json");
  throw new Error("default.json not found");
};
const jsonPath = findDefaultJsonPath();
const connectionInfo = {
  db: supabase,
  status: false
};
async function getDbData() {
  const tdata = readFile();
  try {
    const { data, error } = await connectionInfo.db.from("Templates").select("*");
    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }
    const mappedData = mapDbRowsToObjects(data);
    tdata.templates = mappedData;
    console.log(data);
    console.log("Fetched data:", mappedData);
    writeFile(jsonPath, tdata);
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
function getTemplateIndexForCurrentContext(requestHeaders) {
  try {
    if (requestHeaders && requestHeaders.get) ;
    if (typeof window !== "undefined" && window.countryInfo && typeof window.countryInfo.templateIndex === "number") {
      return window.countryInfo.templateIndex;
    }
  } catch (error) {
    console.error("Error getting template index from context:", error);
  }
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
async function fetchPageContent(pageName, requestHeaders) {
  console.log(`Fetching content for page: ${pageName}`);
  const fileData = readFile();
  const selectedIndex = getTemplateIndexForCurrentContext(requestHeaders) || fileData.selectedIndex;
  console.log(`Using template index: ${selectedIndex}`);
  try {
    if (!fileData.templates[selectedIndex]) {
      console.log(`Template index ${selectedIndex} not found, falling back to default`);
      return fetchPageContent(pageName);
    }
    const contents = Object.values(fileData.templates[selectedIndex])[0].Contents;
    console.log(`Available content keys: ${Object.keys(contents).join(", ")}`);
    if (contents[pageName]) {
      console.log(`Found exact match for ${pageName}`);
      return contents[pageName];
    }
    const keys = Object.keys(contents);
    const matchingKey = keys.find(
      (key) => key.toLowerCase() === pageName.toLowerCase() || key.toLowerCase() === pageName.toLowerCase() + "s" || key.toLowerCase() === pageName.toLowerCase().replace(/s$/, "")
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
      return Object.keys(
        Object.values(fileData.templates[selectedIndex])[0].Contents[key][element]
      );
    });
  });
  const contentValues = pages.map((key, index) => {
    return sections[index].map((element) => {
      return Object.values(
        Object.values(fileData.templates[selectedIndex])[0].Contents[key][element]
      );
    });
  });
  const all = pages.map((pageName, index) => ({
    pageName,
    sections: sections[index],
    contentKeys: contentKeys[index],
    contentValues: contentValues[index]
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
  if (contentName3) {
    Object.values(fileData.templates[selectedIndex])[0].Contents[pageName][sectionName][contentName][contentName2][contentName3] = description;
  } else if (contentName2) {
    Object.values(fileData.templates[selectedIndex])[0].Contents[pageName][sectionName][contentName][contentName2] = description;
  } else {
    Object.values(fileData.templates[selectedIndex])[0].Contents[pageName][sectionName][contentName] = description;
  }
  writeFile(jsonPath, fileData);
}
function addNewsCard(category, newsCardObj) {
  const fileData = readFile();
  const selectedIndex = fileData.selectedIndex;
  const newsContent = Object.values(fileData.templates[selectedIndex])[0].Contents.News[category];
  newsContent.unshift(newsCardObj);
  if (newsContent.length > 3) {
    newsContent.pop();
  }
  writeFile(jsonPath, fileData);
}
await getDbData();
function getData() {
  const fileData = readFile();
  return fileData.templates.map((item) => {
    return Object.keys(item)[0];
  });
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

export { getData as a, getSelectedIndex as b, addNewsCard as c, fetchPageContent as f, getPageDetails as g, setSelectedIndex as s, updateContent as u };
