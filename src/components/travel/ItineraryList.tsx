import { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Location, TravelMode } from '../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Car, 
  Person, 
  Bus, 
  Airplane,
  Plus,
  Clock,
  Info
} from '@phosphor-icons/react';
import { calculateTravelTime, calculateDistance } from '../../lib/utils';
import TravelModeInfo from './TravelModeInfo';

interface ItineraryListProps {
  locations: Location[];
  onReorder: (newLocations: Location[]) => void;
  onRemoveLocation: (locationId: string) => void;
  onSelectLocation: (locationId: string) => void;
  selectedLocationId: string | null;
  travelModes: TravelMode[];
  onChangeTravelMode: (startLocationId: string, endLocationId: string, travelModeId: string) => void;
  selectedTravelModes: Record<string, string>; // key: "startId-endId", value: travelModeId
}

export const ItineraryList = ({
  locations,
  onReorder,
  onRemoveLocation,
  onSelectLocation,
  selectedLocationId,
  travelModes,
  onChangeTravelMode,
  selectedTravelModes
}: ItineraryListProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTravelLegIndex, setSelectedTravelLegIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    
    if (over && active.id !== over.id) {
      const oldIndex = locations.findIndex(loc => loc.id === active.id);
      const newIndex = locations.findIndex(loc => loc.id === over.id);
      
      const newLocations = arrayMove(locations, oldIndex, newIndex);
      onReorder(newLocations);
    }
  };

  const getTravelModeIcon = (modeId: string) => {
    const mode = travelModes.find(m => m.id === modeId);
    switch (mode?.name.toLowerCase()) {
      case 'driving':
        return <Car size={24} />;
      case 'walking':
        return <Person size={24} />;
      case 'transit':
        return <Bus size={24} />;
      case 'flying':
        return <Airplane size={24} />;
      default:
        return <Car size={24} />;
    }
  };

  const getSelectedTravelMode = (startId: string, endId: string) => {
    const key = `${startId}-${endId}`;
    return selectedTravelModes[key] || travelModes[0]?.id;
  };

  const getEstimatedTime = (startIndex: number, endIndex: number) => {
    if (startIndex >= locations.length || endIndex >= locations.length) return 0;
    
    const startLocation = locations[startIndex];
    const endLocation = locations[endIndex];
    const modeId = getSelectedTravelMode(startLocation.id, endLocation.id);
    
    return calculateTravelTime(startLocation, endLocation, modeId);
  };
  
  const getEstimatedDistance = (startIndex: number, endIndex: number) => {
    if (startIndex >= locations.length || endIndex >= locations.length) return 0;
    
    const [startLon, startLat] = locations[startIndex].coordinates;
    const [endLon, endLat] = locations[endIndex].coordinates;
    
    return calculateDistance(startLat, startLon, endLat, endLon);
  };
  
  // Format time for display
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    
    return `${hours} hr ${remainingMinutes} min`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Itinerary</h2>
      
      {locations.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">Your itinerary is empty. Search for locations to add to your trip.</p>
          <Button variant="outline">
            <Plus className="mr-2" size={20} />
            Add Your First Location
          </Button>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={locations.map(loc => loc.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {/* Help text for older users */}
              <Card className="bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground flex items-start">
                  <Info size={20} className="mr-2 mt-0.5 text-primary" />
                  You can rearrange your itinerary by dragging the locations. Click on a travel option button to change how you'll travel between locations.
                </p>
              </Card>
              
              {locations.map((location, index) => (
                <div key={location.id}>
                  <SortableItem
                    id={location.id}
                    location={location}
                    isDragging={isDragging}
                    isSelected={selectedLocationId === location.id}
                    onRemove={() => onRemoveLocation(location.id)}
                    onSelect={() => onSelectLocation(location.id)}
                  />
                  
                  {/* Travel leg information (show between locations) */}
                  {index < locations.length - 1 && (
                    <div className="ml-6 my-2 pl-4 border-l-2 border-dashed border-muted py-3">
                      <div className="flex flex-col space-y-3">
                        {/* Travel details */}
                        <div className="flex items-center">
                          <div className="bg-muted p-2 rounded-full mr-3">
                            {getTravelModeIcon(getSelectedTravelMode(location.id, locations[index + 1].id))}
                          </div>
                          <div>
                            <div className="font-medium">
                              {travelModes.find(m => m.id === getSelectedTravelMode(location.id, locations[index + 1].id))?.name || 'Travel'}
                            </div>
                            <div className="text-muted-foreground text-sm flex items-center">
                              <Clock size={16} className="mr-1" />
                              <span className="mr-3">{formatTime(getEstimatedTime(index, index + 1))}</span>
                              <span>{getEstimatedDistance(index, index + 1)} km</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Travel mode selection */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Travel options:</span>
                          <div className="flex gap-1">
                            {travelModes.map(mode => {
                              const isSelected = getSelectedTravelMode(location.id, locations[index + 1].id) === mode.id;
                              
                              return (
                                <Button
                                  key={mode.id}
                                  variant={isSelected ? "secondary" : "outline"}
                                  size="sm"
                                  onClick={() => onChangeTravelMode(location.id, locations[index + 1].id, mode.id)}
                                  title={`${mode.name} - ${formatTime(calculateTravelTime(location, locations[index + 1], mode.id))}`}
                                  className={`px-2 ${isSelected ? 'ring-2 ring-primary' : ''}`}
                                  aria-label={`Select ${mode.name} mode`}
                                >
                                  {mode.id === 'driving' && <Car size={20} weight={isSelected ? "fill" : "regular"} />}
                                  {mode.id === 'walking' && <Person size={20} weight={isSelected ? "fill" : "regular"} />}
                                  {mode.id === 'transit' && <Bus size={20} weight={isSelected ? "fill" : "regular"} />}
                                  {mode.id === 'flying' && <Airplane size={20} weight={isSelected ? "fill" : "regular"} />}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Travel mode info component */}
                        <div className="mt-1">
                          <TravelModeInfo 
                            startLocation={location}
                            endLocation={locations[index + 1]}
                            travelModes={travelModes}
                            selectedMode={getSelectedTravelMode(location.id, locations[index + 1].id)}
                            onChangeTravelMode={onChangeTravelMode}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ItineraryList;