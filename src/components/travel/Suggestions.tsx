import { useState } from 'react';
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

interface SuggestionsProps {
  currentLocation: Location | null;
  onAddLocation: (location: Location) => void;
}

// Mock data - in a real app this would come from a places API
const MOCK_SUGGESTIONS: Record<string, Suggestion[]> = {
  'times-square': [
    {
      id: 'suggestion-1',
      name: 'Hard Rock Cafe',
      type: 'restaurant',
      address: '1501 Broadway, New York, NY 10036',
      coordinates: [-73.9861, 40.7574],
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      rating: 4.1,
      distance: 0.2
    },
    {
      id: 'suggestion-2',
      name: 'Madame Tussauds',
      type: 'attraction',
      address: '234 W 42nd St, New York, NY 10036',
      coordinates: [-73.9880, 40.7564],
      imageUrl: 'https://images.unsplash.com/photo-1550431241-a2b960657a5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      rating: 4.3,
      distance: 0.3
    },
    {
      id: 'suggestion-3',
      name: 'Marriott Marquis',
      type: 'hotel',
      address: '1535 Broadway, New York, NY 10036',
      coordinates: [-73.9865, 40.7585],
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: 4.4,
      distance: 0.1
    },
  ],
  'central-park': [
    {
      id: 'suggestion-4',
      name: 'The Metropolitan Museum of Art',
      type: 'attraction',
      address: '1000 5th Ave, New York, NY 10028',
      coordinates: [-73.9632, 40.7794],
      imageUrl: 'https://images.unsplash.com/photo-1565498546237-caee7c985004?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      rating: 4.8,
      distance: 0.5
    },
    {
      id: 'suggestion-5',
      name: 'Le Pain Quotidien',
      type: 'restaurant',
      address: 'Central Park, New York, NY 10024',
      coordinates: [-73.9667, 40.7812],
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: 4.0,
      distance: 0.1
    }
  ],
  'empire-state': [
    {
      id: 'suggestion-6',
      name: 'Koreatown',
      type: 'attraction',
      address: 'W 32nd St, New York, NY 10001',
      coordinates: [-73.9874, 40.7484],
      imageUrl: 'https://images.unsplash.com/photo-1566837497312-7be4912a0c54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: 4.5,
      distance: 0.3
    },
    {
      id: 'suggestion-7',
      name: 'Macy\'s Herald Square',
      type: 'shopping',
      address: '151 W 34th St, New York, NY 10001',
      coordinates: [-73.9892, 40.7508],
      imageUrl: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: 4.3,
      distance: 0.4
    }
  ]
};

export const Suggestions = ({ currentLocation, onAddLocation }: SuggestionsProps) => {
  const [activeTab, setActiveTab] = useState<SuggestionType>('attraction');
  
  // Get suggestions based on the current location
  const suggestions = currentLocation ? MOCK_SUGGESTIONS[currentLocation.id] || [] : [];
  const filteredSuggestions = suggestions.filter(suggestion => suggestion.type === activeTab);
  
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
        <p className="text-center text-muted-foreground">Select a location to see nearby suggestions.</p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Nearby Places</h2>
      <p className="text-muted-foreground">Suggestions near {currentLocation.name}</p>
      
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
          {filteredSuggestions.length > 0 ? (
            <div className="space-y-3">
              {filteredSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{suggestion.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.address} · {suggestion.distance} miles away
                      </p>
                      {suggestion.rating && (
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