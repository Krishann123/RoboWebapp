import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), 'international', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'test';
const TEMPLATE_NAME = 'default';

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in the .env file.');
    process.exit(1);
}

function updatePaths(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            if (obj[key].startsWith('/images/')) {
                const oldPath = obj[key];
                obj[key] = `/src/assets${oldPath}`;
                console.log(`Updated path: ${oldPath} -> ${obj[key]}`);
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            updatePaths(obj[key]); // Recurse into nested objects and arrays
        }
    }
}

async function runUpdate() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB.');

        const db = client.db(DB_NAME);
        const templates = db.collection('templates');

        const templateToUpdate = await templates.findOne({ Name: TEMPLATE_NAME });

        if (!templateToUpdate) {
            console.error(`Error: Template "${TEMPLATE_NAME}" not found.`);
            return;
        }

        console.log('Found template. Starting path update...');
        
        // The content is nested inside config.Contents
        if (templateToUpdate.config && templateToUpdate.config.Contents) {
            updatePaths(templateToUpdate.config.Contents);
        } else {
            console.error('Error: "config.Contents" object not found in the template.');
            return;
        }

        const result = await templates.updateOne(
            { Name: TEMPLATE_NAME },
            { $set: { config: templateToUpdate.config } }
        );

        if (result.modifiedCount > 0) {
            console.log(`\nSuccessfully updated ${result.modifiedCount} document.`);
            console.log('All image paths have been corrected.');
        } else {
            console.log('\nNo paths needed updating or the document was not found.');
        }

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await client.close();
        console.log('MongoDB connection closed.');
    }
}

runUpdate(); 