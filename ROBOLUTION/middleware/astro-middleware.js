/**
 * Astro middleware for Express integration
 * This file creates the necessary middleware to handle Astro SSR in Express
 */

const CountrySite = require('../models/CountrySite');

/**
 * Creates middleware for Astro integration
 * @param {Object} astroSSR - The imported Astro SSR handler
 * @returns {Array} - An array of middleware functions
 */
function createAstroMiddleware(astroSSR) {
  // Extract the handler from the imported module
  const handler = astroSSR.handler;

  // First middleware: Load country data for the request
  const countryDataMiddleware = async (req, res, next) => {
    try {
      // Get the country slug from request parameters
      const { slug } = req.params;
      
      if (!slug) {
        return next();
      }
      
      // Find the country in the database
      const countrySite = await CountrySite.findOne({ 
        slug: slug.toLowerCase(),
        active: true
      });
      
      if (!countrySite) {
        console.log(`Country site not found for slug: ${slug}`);
        return res.status(404).send('Country site not found');
      }
      
      // Store country data in res.locals for access by other middleware
      res.locals.countryData = countrySite;
      
      // Continue to next middleware
      next();
    } catch (error) {
      console.error('Error in country data middleware:', error);
      next(error);
    }
  };
  
  // Second middleware: Setup request for Astro and handle the rendering
  const astroHandlerMiddleware = (req, res, next) => {
    try {
      // Set country data in Astro's locals if available
      const locals = { 
        countryData: res.locals.countryData
      };

      // The original request 'req' and 'res' objects from Express are passed directly
      // The Astro SSR handler will internally adapt them
      // We attach our custom data to `res.locals` which Astro can access
      res.locals.astro = locals;

      // Call the Astro handler, passing the original req and res
      handler(req, res, next);

    } catch (error) {
      console.error('Error in Astro handler middleware:', error);
      next(error);
    }
  };
  
  // Return the middleware chain
  return [countryDataMiddleware, astroHandlerMiddleware];
}

module.exports = createAstroMiddleware; 