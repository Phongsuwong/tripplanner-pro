import { useState } from 'react';
import { Location, TravelMode } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { MapPin, CarSimple, PersonSimpleWalk, Bus, Airplane, Clock } from '@phosphor-icons/react';
import { calculateDistance, calculateTravelTime } from '../../lib/utils';

interface MapViewProps {
  locations: Location[];
  selectedLocationId: string | null;
  onSelectLocation: (locationId: string | null) => void;
  travelPath?: GeoJSON.FeatureCollection;
  selectedTravelModes?: Record<string, string>;
}

export const MapView = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  selectedTravelModes = {}
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

  // Calculate travel information between locations
  const calculateTravelInfo = (startLocation: Location, endLocation: Location, modeId: string) => {
    const [startLon, startLat] = startLocation.coordinates;
    const [endLon, endLat] = endLocation.coordinates;
    
    const distance = calculateDistance(startLat, startLon, endLat, endLon);
    const duration = calculateTravelTime(startLocation, endLocation, modeId);
    
    return { distance, duration };
  };

  // Format time duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (mins === 0) {
      return `${hours} hr`;
    }
    
    return `${hours} hr ${mins} min`;
  };

  // Calculate total travel time for the itinerary
  const getTotalTravelStats = () => {
    let totalDistance = 0;
    let totalDuration = 0;

    for (let i = 0; i < locations.length - 1; i++) {
      const startLocation = locations[i];
      const endLocation = locations[i + 1];
      const modeId = selectedTravelModes[`${startLocation.id}-${endLocation.id}`] || 'driving';
      
      const { distance, duration } = calculateTravelInfo(startLocation, endLocation, modeId);
      totalDistance += distance;
      totalDuration += duration;
    }

    return { totalDistance: Math.round(totalDistance), totalDuration };
  };

  // Calculate stats only when we have multiple locations
  const travelStats = locations.length > 1 ? getTotalTravelStats() : null;

  // Simplified Map View that doesn't require external libraries
  return (
    <div className="map-container h-full w-full rounded-lg overflow-hidden border border-border bg-card flex flex-col">
      <div className="bg-secondary/10 p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <MapPin size={24} weight="fill" className="text-accent" />
          {locations.length > 0 ? `Complete Journey (${locations.length} locations)` : 'No locations added yet'}
        </h2>
        {travelStats && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock size={14} />
              {formatDuration(travelStats.totalDuration)}
            </Badge>
            <Badge variant="secondary">{travelStats.totalDistance} km</Badge>
          </div>
        )}
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
              <div key={location.id}>
                <Card 
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
                  </CardContent>
                </Card>
                
                {index < locations.length - 1 && (
                  <div className="my-3 flex items-center justify-center">
                    <div className="border-l-2 border-dashed border-primary/60 h-12"></div>
                  </div>
                )}
                
                {index < locations.length - 1 && (
                  <div className="bg-muted/50 rounded-md p-3 my-3">
                    {(() => {
                      const nextLocation = locations[index + 1];
                      const modeId = selectedTravelModes[`${location.id}-${nextLocation.id}`] || 'driving';
                      const { distance, duration } = calculateTravelInfo(location, nextLocation, modeId);
                      
                      return (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTravelIcon(modeId)}
                            <span className="text-sm font-medium">
                              {modeId.charAt(0).toUpperCase() + modeId.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock size={14} />
                              {formatDuration(duration)}
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {distance} km
                            </Badge>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
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