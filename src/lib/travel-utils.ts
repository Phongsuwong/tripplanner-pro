import { Location, TravelMode } from '../types';

// Calculate approximate travel time between two points
// This is a simple implementation; a real app would use Google Maps API
export function calculateTravelTime(
  start: Location, 
  end: Location, 
  mode: TravelMode
): number {
  // Calculate distance between points using Haversine formula
  const distance = calculateDistance(
    start.coordinates[1], start.coordinates[0],
    end.coordinates[1], end.coordinates[0]
  );
  
  // Approximate speeds for different travel modes (km/h)
  const speeds: Record<string, number> = {
    driving: 50,    // Average urban driving
    walking: 5,     // Average walking pace
    transit: 30,    // Average public transit
    flying: 500     // Average flight speed (plus airport time)
  };
  
  // Calculate time in minutes
  const speed = speeds[mode.id] || speeds.driving;
  const timeInHours = distance / speed;
  const timeInMinutes = Math.round(timeInHours * 60);
  
  // Add minimum times based on mode
  const minimumTimes: Record<string, number> = {
    driving: 5,
    walking: 5,
    transit: 10,
    flying: 120 // Account for airport procedures
  };
  
  return Math.max(timeInMinutes, minimumTimes[mode.id] || 5);
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number, lon1: number, 
  lat2: number, lon2: number
): number {
  // Earth's radius in kilometers
  const R = 6371;
  
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Format travel time in a user-friendly way
export function formatTravelTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
}

// Format distance in a user-friendly way
export function formatDistance(kilometers: number): string {
  // Convert to miles for US audience
  const miles = kilometers * 0.621371;
  
  if (miles < 0.1) {
    return 'nearby';
  }
  
  return `${miles.toFixed(1)} mi`;
}