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
  Plus
} from '@phosphor-icons/react';

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

  const getEstimatedTime = (startId: string, endId: string) => {
    const key = `${startId}-${endId}`;
    const modeId = selectedTravelModes[key] || travelModes[0]?.id;
    const mode = travelModes.find(m => m.id === modeId);
    
    // This would be calculated based on actual distance in a real app
    return mode?.estimatedTime || 30;
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
                    <div className="ml-6 my-2 pl-4 border-l-2 border-dashed border-muted py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getTravelModeIcon(getSelectedTravelMode(location.id, locations[index + 1].id))}
                          <span className="ml-2 text-muted-foreground">
                            {getEstimatedTime(location.id, locations[index + 1].id)} min
                          </span>
                        </div>
                        
                        <div className="flex space-x-1">
                          {travelModes.map(mode => (
                            <Button
                              key={mode.id}
                              variant={getSelectedTravelMode(location.id, locations[index + 1].id) === mode.id ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => onChangeTravelMode(location.id, locations[index + 1].id, mode.id)}
                              title={mode.name}
                              className="px-2"
                            >
                              {mode.id === 'driving' && <Car size={20} />}
                              {mode.id === 'walking' && <Person size={20} />}
                              {mode.id === 'transit' && <Bus size={20} />}
                              {mode.id === 'flying' && <Airplane size={20} />}
                            </Button>
                          ))}
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