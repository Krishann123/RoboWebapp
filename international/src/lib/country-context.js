// Country context for international sites
// Simple state management without external dependencies

// Default configuration - will be overridden by server data
const defaultCountryConfig = {
  name: 'Dubai',
  slug: 'dubai',
  templateName: 'test',
  templateIndex: 0,
  customStyles: {
    primaryColor: '#00008b',
    secondaryColor: '#FFB366',
    accentColor: '#6AAAFF',
    backgroundColor: '#FFFFFF'
  }
};

// Current country state - initialized with default values
let currentCountryState = { ...defaultCountryConfig };

// Helper to get country info from request headers or URL
// This function works on both server and client side
function getCountryInfo() {
  // Server-side: Return default config
  if (typeof document === 'undefined') return defaultCountryConfig;
  
  // Client-side: Try to get from meta tag or URL
  try {
    // First, try to get from headers (set by proxy middleware)
    const countryHeader = document.head.querySelector('meta[name="x-country-site"]');
    if (countryHeader) {
      return JSON.parse(countryHeader.getAttribute('content'));
    }
    
    // Otherwise extract from URL path
    // URL format: /country/{slug}/*
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] === 'country' && pathParts[2]) {
      return {
        ...defaultCountryConfig,
        slug: pathParts[2]
      };
    }
    
    return defaultCountryConfig;
  } catch (error) {
    console.error('Error parsing country info:', error);
    return defaultCountryConfig;
  }
}

// Initialize state with values from headers or URL
export function initCountryState() {
  currentCountryState = { ...defaultCountryConfig, ...getCountryInfo() };
  return currentCountryState;
}

// Helper function to get country-specific template index
export function getCountryTemplateIndex() {
  return currentCountryState.templateIndex || 0;
}

// Helper function to get country name
export function getCountryName() {
  return currentCountryState.name || 'Dubai';
}

// Helper function to get country slug
export function getCountrySlug() {
  return currentCountryState.slug || 'dubai';
}

// Helper function to get template name
export function getTemplateName() {
  return currentCountryState.templateName || 'test';
}

// Helper function to get country-specific CSS variables
export function getCountryCssVariables() {
  const styles = currentCountryState.customStyles || defaultCountryConfig.customStyles;
  
  return `
    --primary-color: ${styles.primaryColor};
    --secondary-color: ${styles.secondaryColor};
    --accent-color: ${styles.accentColor};
    --background-color: ${styles.backgroundColor};
  `;
}

// Inject CSS variables in client context
export function injectCountryStyles() {
  if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      :root {
        ${getCountryCssVariables()}
      }
    `;
    document.head.appendChild(styleElement);
  }
}

// Call this in the Layout component
export function initializeCountry() {
  initCountryState();
  injectCountryStyles();
} 