import { defineConfig } from 'astro/config';

// Astro configuration for the international site template
export default defineConfig({
  // Site settings
  site: 'https://robolution.org',
  base: '/country', // Base path for country sites

  // Output settings
  output: 'static', // Can be changed to 'server' for SSR later
  
  // Build settings
  build: {
    // Set to true for production builds
    inlineStylesheets: 'auto'
  },

  // Content processing
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [],
    rehypePlugins: []
  },

  // Server settings
  server: {
    port: 4321,
    host: true
  },

  // Integrations - can be added as needed
  integrations: [
    // Example: '@astrojs/tailwind', 
    // '@astrojs/react'
  ],

  // Configure country detection middleware
  vite: {
    plugins: [
      {
        name: 'country-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Extract country slug from URL if present
            const url = new URL(req.url, 'http://localhost');
            const pathParts = url.pathname.split('/');
            
            if (pathParts.length > 1 && pathParts[1] === 'country' && pathParts[2]) {
              const countrySlug = pathParts[2];
              
              // Add country info to the request for server-side usage
              req.headers['x-country-slug'] = countrySlug;
              
              // In a real implementation, you would fetch country data from a database
              // For now, just use the slug as the country name
              req.headers['x-country-name'] = countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1);
            }
            
            next();
          });
        }
      }
    ],
    
    // Resolve paths and aliases
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    
    // Environment variables
    define: {
      'import.meta.env.COUNTRY_INFO': '{}',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }
}); 