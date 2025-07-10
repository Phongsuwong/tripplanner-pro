/**
 * Environment variables handler
 * 
 * This file centralizes access to environment variables, providing defaults and 
 * ensuring type safety throughout the application.
 */

// Check if running in browser or server environment
const isBrowser = typeof window !== 'undefined';

// Get Google Maps API key from environment variable or window object (set in index.html)
export const getGoogleMapsApiKey = (): string => {
  if (isBrowser) {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
           (window as any).GOOGLE_MAPS_API_KEY || 
           '';
  }
  return '';
};

// Environment configuration object
export const env = {
  googleMapsApiKey: getGoogleMapsApiKey(),
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  baseUrl: import.meta.env.BASE_URL || '/tripplanner-pro/',
};

// Validate required environment variables
export const validateEnv = (): boolean => {
  const missingVars: string[] = [];
  
  if (!env.googleMapsApiKey) {
    missingVars.push('VITE_GOOGLE_MAPS_API_KEY');
  }
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};

export default env;