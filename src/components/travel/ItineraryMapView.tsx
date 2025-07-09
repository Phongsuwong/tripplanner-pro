import { useState } from 'react';
import { Location, TravelLeg, TravelMode } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { MapPin, CarSimple, PersonSimpleWalk, Bus, Airplane, Clock } from '@phosphor-icons/react';
import { calculateDistance, calculateTravelTime } from '../../lib/utils';

interface ItineraryMapViewProps {
  locations: Location[];
  travelModes: TravelMode[];
  selectedTravelModes: Record<string, string>;
}

export const ItineraryMapView = ({
  locations,
  travelModes,
  selectedTravelModes
}: ItineraryMapViewProps) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    locations.length > 0 ? locations[0].id : null
  );

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

  return (
    <div className="map-container h-full w-full rounded-lg overflow-hidden border border-border bg-card flex flex-col">
      <div className="bg-secondary/10 p-4 border-b border-border">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <MapPin size={24} weight="fill" className="text-accent" />
          {locations.length > 0 ? `Complete Itinerary (${locations.length} locations)` : 'No locations added yet'}
        </h2>
      </div>
      
      {locations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <MapPin size={64} weight="light" className="text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No locations added yet</h3>
          <p className="text-muted-foreground mb-4">
            Search for locations and add them to your itinerary to see them on the map.
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {locations.map((location, index) => (
              <div key={location.id}>
                <Card 
                  className={`cursor-pointer transition-all ${selectedLocationId === location.id ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'}`}
                  onClick={() => setSelectedLocationId(location.id)}
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
                      const mode = travelModes.find(m => m.id === modeId) || travelModes[0];
                      const { distance, duration } = calculateTravelInfo(location, nextLocation, modeId);
                      
                      return (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTravelIcon(modeId)}
                            <span className="text-sm font-medium">{mode.name}</span>
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
    </div>
  );
};

export default ItineraryMapView;