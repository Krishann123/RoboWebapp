# Robolution International Site Template

A scalable, customizable template for creating Robolution country-specific websites using Astro.

## Features

- **Country-specific customization**: Each site can have its own branding, colors, and content
- **Responsive design**: Works on all devices from mobile to desktop
- **Fast performance**: Built with Astro for optimal loading speed
- **Easy to maintain**: Clean component architecture for simple updates
- **SEO friendly**: Proper metadata, semantic markup, and static generation
- **Themeable**: Customize colors, fonts, and styling through CSS variables

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the template:

```bash
git clone https://github.com/robolution/international-template.git robolution-[country]
cd robolution-[country]
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:4321` to see the site.

## Customizing for a Specific Country

1. Edit the country information in `src/lib/country-context.js` to update the default country settings:

```js
const DEFAULT_COUNTRY = {
  name: 'Your Country Name',
  slug: 'your-country-slug',
  flagUrl: '/images/flags/your-country-flag.png',
  active: true,
  customStyles: {
    primaryColor: '#00008b',    // Primary brand color
    secondaryColor: '#FFB366',  // Secondary accent color
    accentColor: '#6AAAFF',     // Additional accent color
    textColor: '#333333',       // Main text color
    backgroundColor: '#FFFFFF', // Background color
  },
  description: 'Robolution International Site for Your Country',
};
```

2. Add the country flag image to `public/images/flags/`.

3. Customize the content in the pages as needed.

## Folder Structure

```
robolution-international-template/
├── public/              # Static assets
│   ├── images/          # Images and media
│   ├── favicon.svg      # Site favicon
│   └── robots.txt       # Robots file for SEO
├── src/
│   ├── assets/          # Source assets that need processing
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utility functions and helpers
│   ├── pages/           # Page components
│   └── styles/          # Global styles
├── astro.config.mjs     # Astro configuration
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## Pages

The template includes the following pages:

- **Home**: Landing page with hero section, features, stats, and news
- **News**: Listing of news and updates with category filtering
- **Tournament**: Details about the robotics tournament
- **Trainings**: Information about training programs
- **Awards**: Details about awards and recognition
- **Registration**: Registration form for events and competitions

## Integration with Main Robolution Site

This template is designed to integrate with the main Robolution website. Each country site can be accessed through the `/country/[country-slug]` path on the main domain.

For example:
- `https://robolution.org/country/dubai` for Dubai
- `https://robolution.org/country/singapore` for Singapore

## Deployment

To build the site for production:

```bash
npm run build
```

This will generate a static site in the `dist/` directory that can be deployed to any static hosting service.

## Adding to the Country-Sites Management System

To add a new country site to the Robolution country-sites management system:

1. Create a new country entry in the admin dashboard
2. Configure the country details (name, slug, flag, colors)
3. Clone this template and customize for the specific country
4. Deploy the customized site to the appropriate subdirectory

## License

This project is proprietary and confidential. Unauthorized copying, modification, distribution, or use is strictly prohibited.

© Robolution - All Rights Reserved 