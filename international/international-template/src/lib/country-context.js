/**
 * Country Context Library
 * This library provides utilities for managing country-specific data and settings.
 */

// Default country configuration
const DEFAULT_COUNTRY = {
  name: 'Default',
  slug: 'default',
  flagUrl: '/images/flags/default-flag.png',
  active: true,
  customStyles: {
    primaryColor: '#00008b',    // Primary brand color
    secondaryColor: '#FFB366',  // Secondary accent color
    accentColor: '#6AAAFF',     // Additional accent color
    textColor: '#333333',       // Main text color
    backgroundColor: '#FFFFFF', // Background color
  },
  description: 'Robolution International Site',
};

/**
 * Get country information from different sources
 * Priority: Headers > Meta tag > URL path > Default
 */
export function getCountryInfo() {
  // When running on the server
  if (typeof window === 'undefined') {
    try {
      // This will be populated by the country-sites middleware
      const countryInfo = import.meta.env.COUNTRY_INFO;
      if (countryInfo) {
        return typeof countryInfo === 'string' 
          ? JSON.parse(countryInfo) 
          : countryInfo;
      }
    } catch (error) {
      console.error('Error parsing country info on server:', error);
    }
    
    return DEFAULT_COUNTRY;
  }
  
  // Client-side: Check for inline data
  try {
    // Check if window.countryInfo was set by the Layout
    if (window.countryInfo) {
      return window.countryInfo;
    }
    
    // Check for meta tag
    const metaTag = document.querySelector('meta[name="country-site"]');
    if (metaTag) {
      const content = metaTag.getAttribute('content');
      if (content) {
        return JSON.parse(content);
      }
    }
    
    // Try to extract from URL path
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1) {
      const countrySlug = pathParts[1]; // Assuming format is /:countrySlug/...
      if (countrySlug && countrySlug !== 'home' && countrySlug !== 'country') {
        return {
          ...DEFAULT_COUNTRY,
          slug: countrySlug,
          name: countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1),
        };
      }
    }
  } catch (error) {
    console.error('Error getting country info:', error);
  }
  
  // Default fallback
  return DEFAULT_COUNTRY;
}

/**
 * Get just the country name
 */
export function getCountryName() {
  return getCountryInfo().name || DEFAULT_COUNTRY.name;
}

/**
 * Get just the country slug
 */
export function getCountrySlug() {
  return getCountryInfo().slug || DEFAULT_COUNTRY.slug;
}

/**
 * Generate CSS variables string from country styles
 */
export function getCountryCssVariables() {
  const { customStyles } = getCountryInfo();
  
  return Object.entries(customStyles || DEFAULT_COUNTRY.customStyles)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case for CSS variables
      const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      return `--${kebabKey}: ${value};`;
    })
    .join('\n');
}

/**
 * Initialize country context in a component
 * This is useful for components that need country-specific data
 */
export function initializeCountry() {
  return getCountryInfo();
}

/**
 * Check if a country site is active
 */
export function isCountryActive() {
  return getCountryInfo().active !== false; // Default to true if not specified
}

/**
 * Get asset path for country-specific assets
 */
export function getAssetPath(path) {
  if (typeof window !== 'undefined' && window.sitePath) {
    return window.sitePath.asset(path);
  }
  
  const countrySlug = getCountrySlug();
  const basePath = `/${countrySlug}`;
  return basePath + (path.startsWith('/') ? path : `/${path}`);
}

/**
 * Get page path for country-specific pages
 */
export function getPagePath(path) {
  if (typeof window !== 'undefined' && window.sitePath) {
    return window.sitePath.page(path);
  }
  
  const countrySlug = getCountrySlug();
  const basePath = `/${countrySlug}`;
  return basePath + (path.startsWith('/') ? path : `/${path}`);
} 