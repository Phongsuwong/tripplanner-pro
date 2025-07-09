import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Location, Suggestion, SuggestionType } from '../../types';
import { 
  Coffee, 
  BuildingStorefront, 
  BedDouble,
  Mountains, 
  Plus 
} from '@phosphor-icons/react';
import { searchNearbyPlaces } from '../../lib/googlePlacesService';

interface SuggestionsProps {
  currentLocation: Location | null;
  onAddLocation: (location: Location) => void;
}

export const Suggestions = ({ currentLocation, onAddLocation }: SuggestionsProps) => {
  const [activeTab, setActiveTab] = useState<SuggestionType>('attraction');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch suggestions when the location or tab changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!currentLocation) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await searchNearbyPlaces(currentLocation, activeTab);
        setSuggestions(results);
        
        if (results.length === 0) {
          setError(`No ${activeTab}s found near this location.`);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setError(`Failed to load suggestions. Please try again.`);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [currentLocation, activeTab]);
  
  // Filter suggestions by the active tab
  const filteredSuggestions = suggestions.filter(suggestion => 
    suggestion.type === activeTab
  );
  
  // Convert suggestion to a location object
  const handleAddSuggestion = (suggestion: Suggestion) => {
    const location: Location = {
      id: suggestion.id,
      name: suggestion.name,
      address: suggestion.address,
      coordinates: suggestion.coordinates,
      imageUrl: suggestion.imageUrl
    };
    
    onAddLocation(location);
  };
  
  if (!currentLocation) {
    return (
      <Card className="p-4">
        <p className="text-center text-muted-foreground">Please select a location to see nearby suggestions.</p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Nearby Places</h2>
      <p className="text-muted-foreground">
        Showing suggestions near <strong>{currentLocation.name}</strong>
        <span className="text-sm ml-2">(tap suggestions to add to your itinerary)</span>
      </p>
      
      <Tabs defaultValue="attraction" value={activeTab} onValueChange={(v) => setActiveTab(v as SuggestionType)}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="attraction" className="flex flex-col items-center py-2">
            <Mountains size={20} />
            <span className="text-xs mt-1">Sights</span>
          </TabsTrigger>
          <TabsTrigger value="restaurant" className="flex flex-col items-center py-2">
            <Coffee size={20} />
            <span className="text-xs mt-1">Food</span>
          </TabsTrigger>
          <TabsTrigger value="hotel" className="flex flex-col items-center py-2">
            <BedDouble size={20} />
            <span className="text-xs mt-1">Hotels</span>
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex flex-col items-center py-2">
            <BuildingStorefront size={20} />
            <span className="text-xs mt-1">Shops</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Loading suggestions...</p>
            </Card>
          ) : error ? (
            <Card className="p-4">
              <p className="text-center text-muted-foreground">{error}</p>
            </Card>
          ) : filteredSuggestions.length > 0 ? (
            <div className="space-y-3">
              {filteredSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{suggestion.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.address} · {suggestion.distance} miles away
                      </p>
                      {suggestion.rating > 0 && (
                        <p className="text-sm mt-1">
                          ★ {suggestion.rating.toFixed(1)}
                        </p>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddSuggestion(suggestion)}
                      title="Add to itinerary"
                    >
                      <Plus size={16} />
                      <span className="ml-1">Add</span>
                    </Button>
                  </div>
                  {suggestion.imageUrl && (
                    <div className="mt-2 h-24 overflow-hidden rounded-md">
                      <img 
                        src={suggestion.imageUrl} 
                        alt={suggestion.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1581373449483-37449f962b6c?auto=format&fit=crop&w=1050&q=80';
                        }}
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-4">
              <p className="text-center text-muted-foreground">No {activeTab}s found near this location.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Suggestions;