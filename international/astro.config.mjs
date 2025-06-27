import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

// Import the dotenv plugin to handle environment variables
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables

// Determine if we're in production mode
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  // Set base path for production mode to '/dubai'
  base: '/dubai',
  integrations: [react(), tailwind()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    define: {
      'process.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
      'process.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_ANON_KEY),
    },
  },
});
