import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Location } from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate distance between two points using the Haversine formula
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

/**
 * Calculate estimated travel time between two locations based on mode
 */
export function calculateTravelTime(
  startLocation: Location,
  endLocation: Location,
  travelMode: string
): number {
  // Calculate distance
  const [startLon, startLat] = startLocation.coordinates;
  const [endLon, endLat] = endLocation.coordinates;
  const distance = calculateDistance(startLat, startLon, endLat, endLon);

  // Calculate time based on mode and distance
  // These are simplified averages for estimation
  switch(travelMode) {
    case 'walking':
      // Average walking speed of 5 km/h
      return Math.round(distance / 5 * 60);
    case 'driving':
      // Average driving speed of 60 km/h
      return Math.round(distance / 60 * 60);
    case 'transit':
      // Average transit speed of 30 km/h
      return Math.round(distance / 30 * 60);
    case 'flying':
      // Flying includes airport time + flight time at 500 km/h
      // Minimum time is 120 minutes including airport procedures
      return Math.max(120, Math.round(distance / 500 * 60) + 90);
    default:
      return Math.round(distance / 40 * 60); // Default average speed
  }
}