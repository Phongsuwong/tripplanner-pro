import { useEffect, useRef, useState } from 'react';
import { Location } from '../../types';
import { loadGoogleMapsScript } from '../../lib/googlePlacesService';

interface GoogleMapViewProps {
  locations: Location[];
  selectedLocationId?: string | null;
  selectedTravelModes?: Record<string, string>;
  onSelectLocation?: (locationId: string) => void;
}

export const GoogleMapView = ({
  locations,
  selectedLocationId,
  selectedTravelModes = {},
  onSelectLocation
}: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsRenderers, setDirectionsRenderers] = useState<google.maps.DirectionsRenderer[]>([]);

  // Initialize the map
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMapsScript();
        
        if (mapRef.current && !map) {
          // Default center is Times Square
          const defaultCenter = { lat: 40.7580, lng: -73.9855 };
          
          const newMap = new google.maps.Map(mapRef.current, {
            zoom: 12,
            center: defaultCenter,
            mapTypeControl: false,
            fullscreenControl: true,
            streetViewControl: false,
            zoomControl: true
          });
          
          setMap(newMap);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    // Cleanup
    return () => {
      markers.forEach(marker => marker.setMap(null));
      directionsRenderers.forEach(renderer => renderer.setMap(null));
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map || locations.length === 0) return;

    // Clear previous markers
    markers.forEach(marker => marker.setMap(null));
    
    // Create new markers for each location
    const newMarkers = locations.map((location, index) => {
      const [lng, lat] = location.coordinates;
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: location.name,
        label: `${index + 1}`,
        animation: google.maps.Animation.DROP
      });

      // Add info window with location details
      const infoContent = `
        <div style="max-width: 200px">
          <strong>${location.name}</strong>
          <p style="margin-top: 4px; font-size: 12px">${location.address}</p>
          ${location.imageUrl ? `<img src="${location.imageUrl}" style="width: 100%; height: 100px; object-fit: cover; margin-top: 8px; border-radius: 4px">` : ''}
        </div>
      `;
      
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });
      
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        if (onSelectLocation) {
          onSelectLocation(location.id);
        }
      });
      
      // Highlight selected marker
      if (location.id === selectedLocationId) {
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4338ca', // Indigo color similar to primary
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        });
      }
      
      return marker;
    });
    
    setMarkers(newMarkers);
    
    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        if (marker.getPosition()) {
          bounds.extend(marker.getPosition()!);
        }
      });
      map.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() && map.getZoom()! > 16) {
          map.setZoom(16);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [map, locations, selectedLocationId]);

  // Draw directions between locations
  useEffect(() => {
    if (!map || locations.length < 2) return;
    
    // Clear previous directions
    directionsRenderers.forEach(renderer => renderer.setMap(null));
    
    const renderDirections = async () => {
      const newRenderers: google.maps.DirectionsRenderer[] = [];
      const directionsService = new google.maps.DirectionsService();
      
      // Process each segment of the journey
      for (let i = 0; i < locations.length - 1; i++) {
        const startLocation = locations[i];
        const endLocation = locations[i + 1];
        const [startLng, startLat] = startLocation.coordinates;
        const [endLng, endLat] = endLocation.coordinates;
        
        // Get the selected travel mode
        const modeKey = `${startLocation.id}-${endLocation.id}`;
        let travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING;
        
        switch (selectedTravelModes[modeKey]) {
          case 'walking':
            travelMode = google.maps.TravelMode.WALKING;
            break;
          case 'transit':
            travelMode = google.maps.TravelMode.TRANSIT;
            break;
          case 'flying':
            // For flying, we'll draw a straight line since DirectionsService doesn't support flying
            const flightPath = new google.maps.Polyline({
              path: [
                { lat: startLat, lng: startLng },
                { lat: endLat, lng: endLng }
              ],
              geodesic: true,
              strokeColor: '#FF8C00', // Orange for flights
              strokeOpacity: 0.8,
              strokeWeight: 3,
              map
            });
            
            // Use a custom renderer for flying
            const directionsRenderer = new google.maps.DirectionsRenderer({
              map: null, // Don't actually render standard directions
              suppressMarkers: true,
              preserveViewport: true
            });
            
            newRenderers.push(directionsRenderer);
            continue;
          default:
            travelMode = google.maps.TravelMode.DRIVING;
        }
        
        try {
          const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
            directionsService.route(
              {
                origin: { lat: startLat, lng: startLng },
                destination: { lat: endLat, lng: endLng },
                travelMode: travelMode
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                  resolve(result);
                } else {
                  reject(status);
                }
              }
            );
          });
          
          // Create a custom color for each travel mode
          let pathColor = '#4338ca'; // Default blue for driving
          
          switch (selectedTravelModes[modeKey]) {
            case 'walking':
              pathColor = '#10b981'; // Green for walking
              break;
            case 'transit':
              pathColor = '#6366f1'; // Purple for transit
              break;
          }
          
          const directionsRenderer = new google.maps.DirectionsRenderer({
            directions: result,
            map: map,
            suppressMarkers: true, // We already have markers
            preserveViewport: true, // Don't change the map view
            polylineOptions: {
              strokeColor: pathColor,
              strokeOpacity: 0.7,
              strokeWeight: 5
            }
          });
          
          newRenderers.push(directionsRenderer);
        } catch (error) {
          console.error(`Error fetching directions for segment ${i}:`, error);
        }
      }
      
      setDirectionsRenderers(newRenderers);
    };
    
    renderDirections();
    
  }, [map, locations, selectedTravelModes]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border flex flex-col">
      <div className="bg-secondary/10 p-3 border-b border-border">
        <h2 className="text-lg font-medium">Trip Map View</h2>
      </div>
      <div className="flex-1">
        <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      </div>
    </div>
  );
};

export default GoogleMapView;