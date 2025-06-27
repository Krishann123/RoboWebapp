/**
 * International dropdown enhancement script.
 * This script powers the session-based international page.
 */
document.addEventListener('DOMContentLoaded', function() {
  // This variable should be globally available from the EJS template
  const currentUser = window.CUR_USER; 
  
  // Find all dropdowns and enhance the international one
  const internationalDropdowns = document.querySelectorAll('.dropdown-content');
  
  internationalDropdowns.forEach(dropdown => {
    const dropdownButton = dropdown.parentElement.querySelector('button');
    
    if (dropdownButton && dropdownButton.textContent.includes('International')) {
      // Fetch dynamic countries
      setupInternationalDropdown(dropdown, currentUser);
    }
  });
});

/**
 * Sets up the international dropdown menu.
 * - Fetches country sites and populates them.
 * - Adds event listeners to handle country selection via API.
 * @param {HTMLElement} dropdown - The dropdown content element.
 * @param {Object} currentUser - The current user object (or null).
 */
function setupInternationalDropdown(dropdown, currentUser) {
  // Fetch and populate dynamic country links
  fetchAndPopulateCountries(dropdown);

  // Add a single event listener to the dropdown for handling clicks
  dropdown.addEventListener('click', function(event) {
    const link = event.target.closest('a.country-link');
    
    // If the click was not on a country link, allow default behavior
    if (!link) return;

    event.preventDefault(); // Stop the browser from navigating for country-specific links
    
    const slug = link.dataset.slug;
    if (!slug) {
      console.error('[International] Link is missing data-slug attribute.');
      return;
    }
    
    console.log(`[International] Country selected: ${slug}`);

    // Set the selected country via API and then reload
    fetch(`/api/set-country/${slug}`, { method: 'POST' })
      .then(response => {
        if (!response.ok) throw new Error('API request failed');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          console.log(`[International] Successfully set country to ${slug}. Reloading page.`);
          
          // If already on the /international page, just reload. Otherwise, navigate.
          if (window.location.pathname.startsWith('/international')) {
            window.location.reload();
          } else {
            window.location.href = '/international';
          }
        } else {
          console.error('[International] Failed to set country:', data.message);
        }
      })
      .catch(error => {
        console.error('[International] Error setting country:', error);
      });
  });
}

/**
 * Fetches country sites from the API and populates the dropdown.
 * @param {HTMLElement} dropdown - The dropdown content element.
 */
function fetchAndPopulateCountries(dropdown) {
  fetch('/country/api/sites')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch country sites');
      return response.json();
    })
    .then(data => {
      if (data.success && data.countrySites && data.countrySites.length > 0) {
        
        // Remove any existing dynamically added links to prevent duplication
        dropdown.querySelectorAll('.country-link, .dropdown-divider').forEach(el => el.remove());

        // Add a divider
        const divider = document.createElement('div');
        divider.className = 'dropdown-divider';
        dropdown.appendChild(divider);

        // Add each country site to the dropdown
        data.countrySites.forEach(site => {
          const link = document.createElement('a');
          link.href = '/international'; // All links point to the main page
          link.className = 'country-link';
          link.dataset.slug = site.slug; // Store slug in data attribute

          const countryItem = document.createElement('div');
          countryItem.className = 'country-item';
          
          const flagImg = document.createElement('img');
          flagImg.className = 'country-flag';
          flagImg.src = site.flagUrl;
          flagImg.alt = `${site.name} Flag`;
          flagImg.onerror = function() { this.src = '/images/flags/placeholder.png'; };
          
          countryItem.appendChild(flagImg);
          countryItem.appendChild(document.createTextNode(site.name));
          
          link.appendChild(countryItem);
          dropdown.appendChild(link);
        });
      }
    })
    .catch(error => {
      console.error('[International] Error fetching country sites:', error);
    });
}