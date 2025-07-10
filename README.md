# TravelEase - Itinerary Planner

A travel itinerary planning application that helps users create and organize their trip plans, with a focus on ease of use for people over 60.

## Features

- Search for locations around the world using Google Maps API
- View information and pictures about points of interest
- Create a customized travel plan by adding locations to your itinerary
- Visualize travel routes on a map with different transportation options
- Calculate travel time and distance between locations
- Reorder destinations by dragging and dropping
- Get suggestions for nearby places to visit

## Deployment

This application is deployed on GitHub Pages at: https://phongsuwong.github.io/tripplanner-pro/

### How to Deploy

#### Manual Deployment
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build and deploy the application:
   ```
   npm run deploy
   ```

This will:
- Build the production version of the app
- Deploy it to the gh-pages branch of your repository
- Make it available at https://phongsuwong.github.io/tripplanner-pro/

#### Automatic Deployment via GitHub Actions
This repository is set up with a GitHub Actions workflow that automatically deploys the app when changes are pushed to the main branch:

1. Set up repository secrets:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Add `VITE_GOOGLE_MAPS_API_KEY` with your Google Maps API key value

2. Push your changes to the main branch:
   ```
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. The GitHub Actions workflow will automatically:
   - Build the app (using the API key from repository secrets)
   - Deploy it to the gh-pages branch
   - Make it available at https://phongsuwong.github.io/tripplanner-pro/

4. Check the Actions tab in your GitHub repository to monitor the deployment status.

### Development

To run the application locally:
1. Set up environment variables:
   ```
   npm run setup-env
   ```
   Or manually create a `.env` file based on `.env.example`

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Configuration

- The app is configured to be served from the `/tripplanner-pro/` base path
- The vite.config.ts file includes the necessary configuration for GitHub Pages deployment
- Environment variables are used for sensitive API keys

### Environment Variables

The application uses environment variables to securely manage API keys. Create a `.env` file in the root directory with the following variables:

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

For production deployments:
1. Add the environment variables to your GitHub repository secrets
2. The GitHub Actions workflow will use these secrets during deployment
3. For local development, use the `.env` file (which should not be committed to the repository)

A `.env.example` file is included in the repository as a template.

For detailed instructions on environment variables, see [Environment Variables Guide](./docs/environment-variables.md).

## License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.