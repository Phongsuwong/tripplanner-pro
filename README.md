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

### Development

To run the application locally:
```
npm run dev
```

## Configuration

- The app is configured to be served from the `/tripplanner-pro/` base path
- The vite.config.ts file includes the necessary configuration for GitHub Pages deployment
- The Google Maps API key is needed for location searches and mapping features

## License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.