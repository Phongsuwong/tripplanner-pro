declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    namespace places {
      enum PlacesServiceStatus {
        OK,
        ZERO_RESULTS,
        OVER_QUERY_LIMIT,
        REQUEST_DENIED,
        INVALID_REQUEST,
        UNKNOWN_ERROR
      }
      
      interface PlaceSearchRequest {
        bounds?: google.maps.LatLngBounds;
        keyword?: string;
        location?: google.maps.LatLng;
        maxPriceLevel?: number;
        minPriceLevel?: number;
        name?: string;
        openNow?: boolean;
        radius?: number;
        rankBy?: any;
        type?: string;
      }
      
      interface PlaceResult {
        address_components?: {
          long_name: string;
          short_name: string;
          types: string[];
        }[];
        formatted_address?: string;
        geometry?: {
          location: google.maps.LatLng;
          viewport?: google.maps.LatLngBounds;
        };
        icon?: string;
        id?: string;
        name?: string;
        place_id?: string;
        plus_code?: {
          compound_code: string;
          global_code: string;
        };
        rating?: number;
        reference?: string;
        types?: string[];
        user_ratings_total?: number;
        vicinity?: string;
        photos?: {
          height: number;
          html_attributions: string[];
          width: number;
          getUrl(opts: { maxHeight?: number; maxWidth?: number }): string;
        }[];
        reviews?: {
          author_name: string;
          author_url?: string;
          language: string;
          profile_photo_url: string;
          rating: number;
          relative_time_description: string;
          text: string;
          time: number;
        }[];
        url?: string;
        website?: string;
      }
      
      class PlacesService {
        constructor(attrContainer: HTMLDivElement | google.maps.Map);
        findPlaceFromQuery(
          request: {
            query: string;
            fields: string[];
          },
          callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void
        ): void;
        getDetails(
          request: {
            placeId: string;
            fields?: string[];
          },
          callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
        ): void;
        textSearch(
          request: {
            query: string;
            bounds?: google.maps.LatLngBounds;
            location?: google.maps.LatLng;
            radius?: number;
          },
          callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void
        ): void;
        nearbySearch(
          request: PlaceSearchRequest,
          callback: (results: PlaceResult[] | null, status: PlacesServiceStatus, pagination?: any) => void
        ): void;
      }
      
      type PlaceType = 
        | 'accounting'
        | 'airport'
        | 'amusement_park'
        | 'aquarium'
        | 'art_gallery'
        | 'atm'
        | 'bakery'
        | 'bank'
        | 'bar'
        | 'beauty_salon'
        | 'bicycle_store'
        | 'book_store'
        | 'bowling_alley'
        | 'bus_station'
        | 'cafe'
        | 'campground'
        | 'car_dealer'
        | 'car_rental'
        | 'car_repair'
        | 'car_wash'
        | 'casino'
        | 'cemetery'
        | 'church'
        | 'city_hall'
        | 'clothing_store'
        | 'convenience_store'
        | 'courthouse'
        | 'dentist'
        | 'department_store'
        | 'doctor'
        | 'drugstore'
        | 'electrician'
        | 'electronics_store'
        | 'embassy'
        | 'fire_station'
        | 'florist'
        | 'funeral_home'
        | 'furniture_store'
        | 'gas_station'
        | 'gym'
        | 'hair_care'
        | 'hardware_store'
        | 'hindu_temple'
        | 'home_goods_store'
        | 'hospital'
        | 'insurance_agency'
        | 'jewelry_store'
        | 'laundry'
        | 'lawyer'
        | 'library'
        | 'light_rail_station'
        | 'liquor_store'
        | 'local_government_office'
        | 'locksmith'
        | 'lodging'
        | 'meal_delivery'
        | 'meal_takeaway'
        | 'mosque'
        | 'movie_rental'
        | 'movie_theater'
        | 'moving_company'
        | 'museum'
        | 'night_club'
        | 'painter'
        | 'park'
        | 'parking'
        | 'pet_store'
        | 'pharmacy'
        | 'physiotherapist'
        | 'plumber'
        | 'police'
        | 'post_office'
        | 'primary_school'
        | 'real_estate_agency'
        | 'restaurant'
        | 'roofing_contractor'
        | 'rv_park'
        | 'school'
        | 'secondary_school'
        | 'shoe_store'
        | 'shopping_mall'
        | 'spa'
        | 'stadium'
        | 'storage'
        | 'store'
        | 'subway_station'
        | 'supermarket'
        | 'synagogue'
        | 'taxi_stand'
        | 'tourist_attraction'
        | 'train_station'
        | 'transit_station'
        | 'travel_agency'
        | 'university'
        | 'veterinary_care'
        | 'zoo';
    }
  }
}

export {};