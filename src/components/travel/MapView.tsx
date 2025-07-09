import { useRef, useState, useEffect } from 'react';
// Import individual components directly from their modules
import Map from 'react-map-gl/dist/esm/components/map';
import Marker from 'react-map-gl/dist/esm/components/marker';
import Popup from 'react-map-gl/dist/esm/components/popup';
import NavigationControl from 'react-map-gl/dist/esm/components/navigation-control';
import Source from 'react-map-gl/dist/esm/components/source';
import Layer from 'react-map-gl/dist/esm/components/layer';
import { MapRef } from 'react-map-gl';
import type { LineLayer } from 'mapbox-gl';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '../../types';
import { Button } from '../ui/button';
import { MapPin } from '@phosphor-icons/react';

// Placeholder token for demo purposes - in a real app, you'd secure this
const MAPBOX_TOKEN = 'pk.demo.placeholder';

interface MapViewProps {
  locations: Location[];
  selectedLocationId: string | null;
  onSelectLocation: (locationId: string | null) => void;
  travelPath?: GeoJSON.FeatureCollection;
}

// Create route line style
const routeLayer: LineLayer = {
  id: 'route',
  type: 'line',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#0077CC',
    'line-width': 4,
    'line-opacity': 0.8
  }
};

export const MapView = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  travelPath
}: MapViewProps) => {
  const [popupInfo, setPopupInfo] = useState<Location | null>(null);
  const mapRef = useRef<MapRef>(null);

  // Calculate the viewport to fit all markers
  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    if (locations.length === 1) {
      mapRef.current.flyTo({
        center: locations[0].coordinates,
        zoom: 14
      });
      return;
    }

    // Calculate bounds to include all locations
    try {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach(location => {
        bounds.extend(location.coordinates as [number, number]);
      });

      mapRef.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 15,
        duration: 1000
      });
    } catch (e) {
      console.error("Error fitting bounds:", e);
    }
  }, [locations]);

  // Effect to handle selected location
  useEffect(() => {
    if (selectedLocationId && locations.length) {
      const location = locations.find(loc => loc.id === selectedLocationId);
      if (location) {
        setPopupInfo(location);
        mapRef.current?.flyTo({
          center: location.coordinates,
          zoom: 15,
          duration: 1000
        });
      }
    }
  }, [selectedLocationId, locations]);

  return (
    <div className="map-container h-full w-full relative rounded-lg overflow-hidden border border-border">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -74.006,
          latitude: 40.7128,
          zoom: 12
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {travelPath && (
          <Source id="route" type="geojson" data={travelPath}>
            <Layer {...routeLayer} />
          </Source>
        )}

        {locations.map((location) => (
          <Marker 
            key={location.id}
            longitude={location.coordinates[0]} 
            latitude={location.coordinates[1]}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(location);
              onSelectLocation(location.id);
            }}
          >
            <div 
              className={`transition-all duration-300 ${selectedLocationId === location.id ? 'scale-125' : 'scale-100'}`}
            >
              <MapPin 
                size={36} 
                weight={selectedLocationId === location.id ? "fill" : "regular"} 
                className={selectedLocationId === location.id ? "text-accent" : "text-primary"}
              />
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.coordinates[0]}
            latitude={popupInfo.coordinates[1]}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="rounded-md"
            maxWidth="300px"
          >
            <div className="p-2">
              <h3 className="text-lg font-medium mb-1">{popupInfo.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{popupInfo.address}</p>
              {popupInfo.imageUrl && (
                <img 
                  src={popupInfo.imageUrl} 
                  alt={popupInfo.name} 
                  className="w-full h-32 object-cover rounded-md mb-2" 
                />
              )}
              {popupInfo.description && (
                <p className="text-sm mb-2">{popupInfo.description}</p>
              )}
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPopupInfo(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapView;