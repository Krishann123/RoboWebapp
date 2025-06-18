# ROBOLUTION + International Integrated Application

This project combines two applications:
1. ROBOLUTION - A Node.js/Express application
2. International - An Astro.js application

## Project Structure

```
Robo-combined/
├── ROBOLUTION/          # Main Express application
│   ├── app.js           # Main application file
│   ├── routes/          # Express routes
│   │   └── dubai.js     # Integration route for the international app
│   ├── views/           # EJS templates
│   └── ...
│
└── international/       # Astro.js application
    ├── src/             # Source code
    ├── public/          # Static files
    └── ...
```

## Setup Instructions

### Development Environment

1. **Install dependencies for both applications**

   ```bash
   # Install ROBOLUTION dependencies
   cd ROBOLUTION
   npm install
   
   # Install International dependencies
   cd ../international
   npm install
   ```

2. **Start the development servers**

   ```bash
   # Terminal 1: Start the Astro development server
   cd international
   npm run dev
   
   # Terminal 2: Start the ROBOLUTION server
   cd ROBOLUTION
   npm run dev
   ```

3. **Access the applications**
   - Main ROBOLUTION application: http://localhost:3000
   - International application: http://localhost:3000/international

### Production Deployment on Render

1. **Create a new Web Service on Render**

2. **Configure the build settings**:
   - Build Command: `cd ROBOLUTION && npm install && node setup.js && cd ../international && npm install && npm run build`
   - Start Command: `cd ROBOLUTION && npm start`

3. **Environment Variables**:
   - `NODE_ENV`: `production`
   - Add all other required environment variables for your application

4. **Auto-Deploy**:
   Configure automatic deployments from your GitHub repository

## Integration Details

The applications are integrated using:

1. **Express proxy** for development:
   - In development mode, requests to `/international` are proxied to the Astro dev server
   - This uses `http-proxy-middleware` configured in `ROBOLUTION/routes/dubai.js`

2. **Direct integration** for production:
   - In production, the Astro app is built as a Server-Side Rendered (SSR) application
   - The Express server directly integrates with the Astro handler
   - The `NODE_ENV=production` environment variable controls this behavior

## Notes

- Both applications can share the same MongoDB database
- The Astro application uses the `@astrojs/node` adapter for SSR
- Static files from the Astro app are served through the Express server

## Troubleshooting

- If you encounter CORS issues in development, check the proxy configuration in `dubai.js`
- For path resolution issues in production, verify that the paths in `app.js` correctly point to the built Astro app 