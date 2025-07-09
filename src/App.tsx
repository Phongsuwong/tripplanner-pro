import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster, toast } from 'sonner';
import { Location, TravelMode, Itinerary, TravelLeg } from './types';
import { MapView } from './components/travel/MapView';
import ItineraryList from './components/travel/ItineraryList';
import LocationSearch from './components/travel/LocationSearch';
import Suggestions from './components/travel/Suggestions';
import Header from './components/travel/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

// Sample travel modes with more realistic times/speeds
const TRAVEL_MODES: TravelMode[] = [
  {
    id: 'driving',
    name: 'Driving',
    icon: 'car',
    estimatedTime: 0, // Will be calculated based on locations
    distance: 0
  },
  {
    id: 'walking',
    name: 'Walking',
    icon: 'walk',
    estimatedTime: 0,
    distance: 0
  },
  {
    id: 'transit',
    name: 'Transit',
    icon: 'bus',
    estimatedTime: 0,
    distance: 0
  },
  {
    id: 'flying',
    name: 'Flying',
    icon: 'plane',
    estimatedTime: 0,
    distance: 0
  }
];

function App() {
  // Persistent state with useKV
  const [savedItinerary, setSavedItinerary] = useKV<Itinerary | null>("current-itinerary", null);
  
  // UI state with useState
  const [locations, setLocations] = useState<Location[]>([
    {
      id: 'times-square',
      name: 'Times Square',
      address: 'Manhattan, NY 10036',
      coordinates: [-73.9855, 40.7580],
      imageUrl: 'https://images.unsplash.com/photo-1569854985259-ddbb3c0c7671?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80',
      description: 'Bustling destination in the heart of NYC known for bright lights, Broadway theaters & commercial billboards.'
    }
  ]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>('times-square');
  const [travelModes, setTravelModes] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isMapVisible, setIsMapVisible] = useState(true);

  // Load saved itinerary on mount
  useEffect(() => {
    if (savedItinerary) {
      setLocations(savedItinerary.locations);
      
      // Recreate travel modes mapping
      const modesMap: Record<string, string> = {};
      savedItinerary.travelLegs.forEach(leg => {
        modesMap[`${leg.startLocationId}-${leg.endLocationId}`] = leg.travelMode;
      });
      setTravelModes(modesMap);
    }
  }, [savedItinerary]);

  // Handle adding a location to the itinerary
  const handleAddLocation = (location: Location) => {
    setLocations(prev => {
      const exists = prev.some(loc => loc.id === location.id);
      if (exists) {
        toast.error("This location is already in your itinerary");
        return prev;
      }
      
      toast.success(`Added ${location.name} to your itinerary`);
      return [...prev, location];
    });
    
    setSelectedLocationId(location.id);
  };

  // Handle reordering locations
  const handleReorderLocations = (newLocations: Location[]) => {
    setLocations(newLocations);
  };

  // Handle removing a location
  const handleRemoveLocation = (locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
    if (selectedLocationId === locationId) {
      setSelectedLocationId(null);
    }
  };

  // Handle changing travel mode between locations
  const handleChangeTravelMode = (startLocationId: string, endLocationId: string, travelModeId: string) => {
    setTravelModes(prev => ({
      ...prev,
      [`${startLocationId}-${endLocationId}`]: travelModeId
    }));
  };

  // Handle saving the current itinerary
  const handleSaveItinerary = async () => {
    if (locations.length === 0) {
      toast.error("Cannot save empty itinerary");
      return;
    }
    
    // Create travel legs from the current state
    const travelLegs: TravelLeg[] = [];
    for (let i = 0; i < locations.length - 1; i++) {
      const startLocation = locations[i];
      const endLocation = locations[i + 1];
      const startId = startLocation.id;
      const endId = endLocation.id;
      const modeId = travelModes[`${startId}-${endId}`] || TRAVEL_MODES[0].id;
      
      // Calculate travel time and distance using our utility functions
      const [startLon, startLat] = startLocation.coordinates;
      const [endLon, endLat] = endLocation.coordinates;
      
      // Import these functions from utils.ts
      const { calculateTravelTime, calculateDistance } = await import('./lib/utils');
      const distance = calculateDistance(startLat, startLon, endLat, endLon);
      const duration = calculateTravelTime(startLocation, endLocation, modeId);
      
      travelLegs.push({
        startLocationId: startId,
        endLocationId: endId,
        travelMode: modeId,
        duration, 
        distance
      });
    }
    
    const itinerary: Itinerary = {
      id: savedItinerary?.id || `itinerary-${Date.now()}`,
      name: "My Travel Plan",
      locations,
      travelLegs,
      createdAt: savedItinerary?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    setSavedItinerary(itinerary);
    toast.success("Itinerary saved successfully");
  };

  // Get the currently selected location
  const selectedLocation = locations.find(loc => loc.id === selectedLocationId) || null;

  return (
    <div className="flex flex-col h-full bg-background">
      <Header 
        onSaveItinerary={handleSaveItinerary}
        onToggleMapView={() => setIsMapVisible(!isMapVisible)}
        isMapVisible={isMapVisible}
      />
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Map section - hidden on mobile when isMapVisible is false */}
        {isMapVisible && (
          <div className="flex-1 md:w-1/2 md:flex-none h-64 md:h-auto">
            <div className="h-full p-4">
              <MapView 
                locations={locations}
                selectedLocationId={selectedLocationId}
                onSelectLocation={setSelectedLocationId}
                selectedTravelModes={travelModes}
              />
            </div>
          </div>
        )}
        
        {/* Content section */}
        <div className="flex-1 md:w-1/2 md:flex-none overflow-auto">
          <div className="container mx-auto p-4 max-w-2xl">
            <Tabs 
              defaultValue="itinerary" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search" className="space-y-6">
                <LocationSearch onAddLocation={handleAddLocation} />
              </TabsContent>
              
              <TabsContent value="itinerary" className="space-y-6">
                <ItineraryList 
                  locations={locations}
                  onReorder={handleReorderLocations}
                  onRemoveLocation={handleRemoveLocation}
                  onSelectLocation={setSelectedLocationId}
                  selectedLocationId={selectedLocationId}
                  travelModes={TRAVEL_MODES}
                  onChangeTravelMode={handleChangeTravelMode}
                  selectedTravelModes={travelModes}
                />
              </TabsContent>
              
              <TabsContent value="suggestions" className="space-y-6">
                <Suggestions 
                  currentLocation={selectedLocation}
                  onAddLocation={handleAddLocation}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Toaster position="top-center" />
    </div>
  );
}

export default App;