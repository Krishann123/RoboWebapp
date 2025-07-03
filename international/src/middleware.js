import { defineMiddleware } from 'astro:middleware';
import { getCountryContent } from './components/db';

export const onRequest = defineMiddleware(async ({ request, locals, redirect }, next) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip middleware for API routes and static assets
  if (pathname.startsWith('/api/') || pathname.startsWith('/_astro/')) {
    return next();
  }
  
  // Match dynamic country routes, e.g., /indonesia, /dubai/news, etc.
  const countryMatch = pathname.match(/^\/([a-zA-Z0-9_-]+)(\/.*)?$/);

  if (countryMatch) {
    const countrySlug = countryMatch[1];
    
    // Check if the slug is a real page like 'news' or 'admin' before treating it as a country
    // This is a simple check; a more robust solution might involve a predefined list of page routes.
    const knownPages = ['news', 'admin', 'login', 'registration', 'tournament', 'trainings', 'awards', 'nominations_tab', 'country'];
    if (knownPages.includes(countrySlug.toLowerCase())) {
        return next(); // It's a regular page, not a country slug
    }

    console.log(`[Middleware] Detected potential country slug: "${countrySlug}"`);
    const countryData = await getCountryContent(countrySlug);
    
    if (countryData) {
      console.log(`[Middleware] Found data for "${countrySlug}". Storing in locals.`);
      // Store the fetched data in Astro.locals to make it available to all pages
      locals.countryData = countryData;
      // Also store the slug for easy access
      locals.countrySlug = countrySlug;
    } else {
      console.log(`[Middleware] No data found for slug "${countrySlug}". Proceeding without country data.`);
    }
  }
  
  return next();
}); 