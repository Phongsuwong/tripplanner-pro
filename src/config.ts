// App configuration settings
export const config = {
  mapbox: {
    // Note: In a production app, this token would come from environment variables
    // and not be hard-coded in the source
    accessToken: 'pk.demo.placeholder',
    style: 'mapbox://styles/mapbox/streets-v12'
  },
  
  // Default map center (New York)
  defaultMapCenter: {
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 11
  },

  // Mock data settings - in a real app this would be unnecessary
  mockDataEnabled: true
};