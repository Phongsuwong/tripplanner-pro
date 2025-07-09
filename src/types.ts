export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  description?: string;
  imageUrl?: string;
  placeId?: string;
}

export interface TravelMode {
  id: string;
  name: string;
  icon: string;
  estimatedTime?: number; // in minutes
  distance?: number; // in kilometers or miles
}

export interface TravelLeg {
  startLocationId: string;
  endLocationId: string;
  travelMode: string; // id of the travel mode
  duration: number; // in minutes
  distance: number; // in kilometers or miles
}

export interface Itinerary {
  id: string;
  name: string;
  locations: Location[];
  travelLegs: TravelLeg[];
  createdAt: Date;
  updatedAt: Date;
}

export type SuggestionType = 'restaurant' | 'attraction' | 'hotel' | 'shopping';

export interface Suggestion {
  id: string;
  name: string;
  type: SuggestionType;
  address: string;
  coordinates: [number, number];
  imageUrl?: string;
  rating?: number;
  distance?: number; // from the current location
}