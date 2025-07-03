import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
// node adapter is not needed for static builds
// import node from '@astrojs/node';

// Import the dotenv plugin to handle environment variables
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables

// Determine if we're in production mode
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  // Set the base path to '/international' so all asset links are generated correctly
  // when served from the '/international' subfolder.
  base: '/international',

  // Generate a static site (HTML, CSS, JS) instead of a server.
  output: 'static',

  integrations: [react(), tailwind()],
  
  vite: {
    define: {
      'process.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
      'process.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_ANON_KEY),
    },
  },
});
