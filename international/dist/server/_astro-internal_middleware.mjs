import { d as defineMiddleware, s as sequence } from './chunks/index_kari2xUG.mjs';
import { g as getCountryContent } from './chunks/db_BgTuE01l.mjs';
import './chunks/astro-designed-error-pages_4-jZJ4fL.mjs';
import 'kleur/colors';
import './chunks/astro/server_BGP9d7Zh.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async ({ request, locals, redirect }, next) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip middleware for API routes, assets, etc.
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_astro') || 
      pathname.startsWith('/src/assets') ||
      pathname.startsWith('/public')) {
    return next();
  }
  
  // For /home route - proceed to normal routing
  if (pathname === '/home' || pathname.startsWith('/home/')) {
    return next();
  }
  
  // Extract the first path segment as potential country slug
  const segments = pathname.split('/').filter(Boolean);
  const potentialCountrySlug = segments[0];
  
  if (!potentialCountrySlug) {
    // Root path, continue normally
    return next();
  }
  
  // Check if this is a country site
  const countryData = await getCountryContent(potentialCountrySlug);
  
  if (countryData) {
    // This is a country site
    if (segments.length === 1) {
      // Root of country site, redirect to dynamic country page
      return redirect(`/country/${potentialCountrySlug}`);
    } else {
      // Store country data in locals for later use
      locals.countryData = countryData;
      
      // Let the request proceed to the appropriate page
      return next();
    }
  }
  
  // Not a country site, let the request proceed normally
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
