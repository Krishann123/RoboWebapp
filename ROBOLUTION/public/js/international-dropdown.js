/**
 * International dropdown enhancement script
 * This script enhances the international dropdown with country flags and styling
 * and dynamically loads available country sites
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get all international dropdown content elements
  const internationalDropdowns = document.querySelectorAll('.dropdown-content');
  
  // Find the international dropdown (parent has button with "International" text)
  let internationalDropdown = null;
  
  internationalDropdowns.forEach(dropdown => {
    const dropdownParent = dropdown.parentElement;
    const dropdownButton = dropdownParent.querySelector('button');
    
    if (dropdownButton && dropdownButton.textContent.includes('International')) {
      internationalDropdown = dropdown;
      
      // Add styling to existing links
      const links = dropdown.querySelectorAll('a');
      links.forEach(link => {
        if (link.textContent.trim() !== 'View All Countries' && 
            !link.classList.contains('dropdown-empty') &&
            !link.parentElement.classList.contains('dropdown-divider')) {
          decorateCountryLink(link);
        }
      });
      
      // Fetch available country sites
      fetchCountrySites(dropdown);
    }
  });
  
  /**
   * Fetch available country sites from the API
   * @param {HTMLElement} dropdown - The dropdown element to populate
   */
  function fetchCountrySites(dropdown) {
    // Skip if we don't have a dropdown
    if (!dropdown) return;
    
    fetch('/api/country-sites')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch country sites');
        }
        return response.json();
      })
      .then(data => {
        if (data.success && data.countrySites && data.countrySites.length > 0) {
          // Get existing links to avoid duplicates
          const existingLinks = Array.from(dropdown.querySelectorAll('a'))
            .map(link => link.getAttribute('href'));
          
          // Add new country sites that aren't already in the dropdown
          data.countrySites.forEach(site => {
            const href = `/country/${site.slug}`;
            if (!existingLinks.includes(href) && site.slug !== 'dubai') {
              // Find the Dubai link or the last link before adding
              const lastLink = dropdown.lastElementChild;
              
              // Create new link element
              const link = document.createElement('a');
              link.href = href;
              link.textContent = site.name;
              
              // Add after Dubai or at the end
              dropdown.insertBefore(link, lastLink.nextSibling);
              
              // Apply styling
              decorateCountryLink(link, site);
            }
          });
        }
      })
      .catch(error => {
        console.error('Error fetching country sites:', error);
      });
  }
  
  /**
   * Decorate a country link with flag and styling
   * @param {HTMLElement} link - The link element to decorate
   * @param {Object} site - Optional site data with flagUrl
   */
  function decorateCountryLink(link, site = null) {
    // Skip if already processed or special link
    if (link.classList.contains('country-link-decorated')) return;
    
    // Get country name from link text
    const countryName = link.textContent.trim();
    
    // Create country item container
    const countryItem = document.createElement('div');
    countryItem.className = 'country-item';
    
    // Add flag image
    const flagImg = document.createElement('img');
    flagImg.className = 'country-flag';
    flagImg.alt = `${countryName} Flag`;
    
    // Use site flagUrl if provided, otherwise generate from link href
    if (site && site.flagUrl) {
      flagImg.src = site.flagUrl;
    } else {
      // Extract country slug from link href
      const href = link.getAttribute('href');
      const slug = href.split('/').filter(Boolean).pop();
      flagImg.src = `/images/flags/${slug}-flag.png`;
    }
    
    // Add fallback for missing images
    flagImg.onerror = function() {
      this.src = '/images/flags/placeholder.png';
    };
    
    // Add flag and name to the item
    countryItem.appendChild(flagImg);
    countryItem.appendChild(document.createTextNode(countryName));
    
    // Replace link text with the structured item
    link.innerHTML = '';
    link.appendChild(countryItem);
    link.classList.add('country-link-decorated');
  }
}); 