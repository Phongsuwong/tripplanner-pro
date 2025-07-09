import { useState } from 'react';
import { Location } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { MapPin, CarSimple, PersonSimpleWalk, Bus, Airplane } from '@phosphor-icons/react';

interface MapViewProps {
  locations: Location[];
  selectedLocationId: string | null;
  onSelectLocation: (locationId: string | null) => void;
  travelPath?: GeoJSON.FeatureCollection;
}

export const MapView = ({
  locations,
  selectedLocationId,
  onSelectLocation
}: MapViewProps) => {
  const selectedLocation = locations.find(loc => loc.id === selectedLocationId) || null;

  // Get travel icon based on mode
  const getTravelIcon = (mode: string) => {
    switch (mode) {
      case 'driving': return <CarSimple size={24} weight="regular" className="text-primary" />;
      case 'walking': return <PersonSimpleWalk size={24} weight="regular" className="text-primary" />;
      case 'transit': return <Bus size={24} weight="regular" className="text-primary" />;
      case 'flying': return <Airplane size={24} weight="regular" className="text-primary" />;
      default: return <CarSimple size={24} weight="regular" className="text-primary" />;
    }
  };

  // Simplified Map View that doesn't require external libraries
  return (
    <div className="map-container h-full w-full rounded-lg overflow-hidden border border-border bg-card flex flex-col">
      <div className="bg-secondary/10 p-4 border-b border-border">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <MapPin size={24} weight="fill" className="text-accent" />
          {locations.length > 0 ? `Your Journey (${locations.length} locations)` : 'No locations added yet'}
        </h2>
      </div>
      
      {locations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <MapPin size={64} weight="light" className="text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No locations added yet</h3>
          <p className="text-muted-foreground mb-4">
            Search for locations and add them to your itinerary to see them on the map.
          </p>
          <Button 
            variant="outline"
            onClick={() => onSelectLocation(null)}
          >
            Search Locations
          </Button>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {locations.map((location, index) => (
              <Card 
                key={location.id} 
                className={`cursor-pointer transition-all ${selectedLocationId === location.id ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'}`}
                onClick={() => onSelectLocation(location.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    {location.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-2">{location.address}</p>
                  
                  {location.imageUrl && (
                    <div className="rounded-md overflow-hidden mb-3">
                      <img 
                        src={location.imageUrl} 
                        alt={location.name} 
                        className="w-full h-32 object-cover" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1581373449483-37449f962b6c?auto=format&fit=crop&w=1050&q=80';
                        }}
                      />
                    </div>
                  )}
                  
                  {location.description && (
                    <p className="text-sm mt-2">{location.description}</p>
                  )}
                  
                  {index < locations.length - 1 && (
                    <div className="mt-3 border-t border-border pt-2 flex items-center justify-center">
                      {getTravelIcon('driving')}
                      <div className="mx-2 text-sm text-muted-foreground">
                        Travel to next location
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {selectedLocation && (
        <div className="p-3 border-t border-border bg-card">
          <p className="text-sm text-center text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{selectedLocation.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;