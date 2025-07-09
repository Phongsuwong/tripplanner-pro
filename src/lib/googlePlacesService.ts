import { Location, Suggestion, SuggestionType } from '../types';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA3W7rlB4NBw5ZMwV-sGoE3p_TnQGOAItg';

// Helper function to load Google Maps script
export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(new Error(`Failed to load Google Maps API: ${error}`));
    document.head.appendChild(script);
  });
};

// Convert Google Place to our Location type
const convertPlaceToLocation = (place: google.maps.places.PlaceResult): Location => {
  const placeId = place.place_id || `place-${Date.now()}`;
  const name = place.name || '';
  const address = place.formatted_address || '';
  const lat = place.geometry?.location?.lat() || 0;
  const lng = place.geometry?.location?.lng() || 0;
  
  // Determine the image URL
  let imageUrl = '';
  if (place.photos && place.photos.length > 0) {
    imageUrl = place.photos[0].getUrl({ maxWidth: 500, maxHeight: 300 });
  }
  
  return {
    id: placeId,
    name,
    address,
    coordinates: [lng, lat], // Note: our app uses [lng, lat] order
    imageUrl,
    description: place.types?.join(', ') || ''
  };
};

// Map place types to our suggestion types
const mapPlaceTypeToSuggestionType = (types: string[] = []): SuggestionType => {
  if (!types || types.length === 0) return 'attraction';
  
  if (types.some(type => 
    ['restaurant', 'cafe', 'bar', 'bakery', 'food'].includes(type))) {
    return 'restaurant';
  }
  
  if (types.some(type => 
    ['lodging', 'hotel', 'motel'].includes(type))) {
    return 'hotel';
  }
  
  if (types.some(type => 
    ['store', 'shopping_mall', 'department_store', 'supermarket'].includes(type))) {
    return 'shopping';
  }
  
  return 'attraction';
};

// Calculate distance between two coordinates in miles
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return parseFloat(distance.toFixed(1));
};

// Convert Google Place to our Suggestion type
const convertPlaceToSuggestion = (place: google.maps.places.PlaceResult, referenceLocation: Location): Suggestion => {
  const placeId = place.place_id || `suggestion-${Date.now()}`;
  const name = place.name || '';
  const address = place.formatted_address || place.vicinity || '';
  const lat = place.geometry?.location?.lat() || 0;
  const lng = place.geometry?.location?.lng() || 0;
  const rating = place.rating || 0;
  
  // Calculate distance from reference location
  const [refLng, refLat] = referenceLocation.coordinates;
  const distance = calculateDistance(refLat, refLng, lat, lng);
  
  // Determine the image URL
  let imageUrl = '';
  if (place.photos && place.photos.length > 0) {
    imageUrl = place.photos[0].getUrl({ maxWidth: 500, maxHeight: 300 });
  }
  
  return {
    id: placeId,
    name,
    address,
    type: mapPlaceTypeToSuggestionType(place.types),
    coordinates: [lng, lat],
    imageUrl,
    rating,
    distance
  };
};

// Search for places
export const searchPlaces = async (query: string): Promise<Location[]> => {
  try {
    // Make sure Google Maps API is loaded
    await loadGoogleMapsScript();
    
    return new Promise((resolve, reject) => {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      
      service.textSearch(
        { query },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            // Convert Google Places results to our Location format
            const locations = results.map(convertPlaceToLocation);
            resolve(locations);
          } else {
            reject(new Error(`Places search failed with status: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error searching places:', error);
    throw error;
  }
};

// Get place details (more information about a specific place)
export const getPlaceDetails = async (placeId: string): Promise<Location> => {
  try {
    await loadGoogleMapsScript();
    
    return new Promise((resolve, reject) => {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      
      service.getDetails(
        { 
          placeId,
          fields: ['name', 'place_id', 'formatted_address', 'geometry', 'photos', 'types', 'rating', 'reviews', 'url']
        },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            resolve(convertPlaceToLocation(result));
          } else {
            reject(new Error(`Place details fetch failed with status: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

// Search for nearby places based on a reference location
export const searchNearbyPlaces = async (
  referenceLocation: Location, 
  type?: SuggestionType
): Promise<Suggestion[]> => {
  try {
    await loadGoogleMapsScript();
    
    return new Promise((resolve, reject) => {
      const [lng, lat] = referenceLocation.coordinates;
      const location = new google.maps.LatLng(lat, lng);
      
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      
      // Map our suggestion types to Google Places types
      let googlePlaceTypes: string | undefined;
      if (type) {
        switch(type) {
          case 'restaurant':
            googlePlaceTypes = 'restaurant';
            break;
          case 'hotel':
            googlePlaceTypes = 'lodging';
            break;
          case 'shopping':
            googlePlaceTypes = 'shopping_mall';
            break;
          case 'attraction':
            googlePlaceTypes = 'tourist_attraction';
            break;
        }
      }
      
      const request: google.maps.places.PlaceSearchRequest = {
        location,
        radius: 5000, // 5km radius
        type: googlePlaceTypes as google.maps.places.PlaceType
      };
      
      service.nearbySearch(
        request,
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            // Convert Google Places results to our Suggestion format
            const suggestions = results
              .slice(0, 10) // Limit to 10 results
              .map(place => convertPlaceToSuggestion(place, referenceLocation));
            
            resolve(suggestions);
          } else {
            reject(new Error(`Nearby search failed with status: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error searching nearby places:', error);
    throw error;
  }
};