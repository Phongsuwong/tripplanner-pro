import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { Location } from '../../types';

interface LocationSearchProps {
  onAddLocation: (location: Location) => void;
}

// Mock search results - in a real app this would come from an API
const MOCK_SEARCH_RESULTS: Location[] = [
  {
    id: 'times-square',
    name: 'Times Square',
    address: 'Manhattan, NY 10036',
    coordinates: [-73.9855, 40.7580],
    imageUrl: 'https://images.unsplash.com/photo-1569854985259-ddbb3c0c7671?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80',
    description: 'Bustling destination in the heart of NYC known for bright lights, Broadway theaters & commercial billboards.'
  },
  {
    id: 'central-park',
    name: 'Central Park',
    address: 'New York, NY',
    coordinates: [-73.9665, 40.7812],
    imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80',
    description: 'Urban park spanning 843 acres with paths, lakes & attractions like Bethesda Fountain & Strawberry Fields.'
  },
  {
    id: 'empire-state',
    name: 'Empire State Building',
    address: '20 W 34th St, New York, NY 10001',
    coordinates: [-73.9857, 40.7484],
    imageUrl: 'https://images.unsplash.com/photo-1546436836-07a91091f160?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80',
    description: 'Iconic 102-story skyscraper completed in 1931 with observation decks, shops & city views.'
  },
  {
    id: 'statue-of-liberty',
    name: 'Statue of Liberty',
    address: 'New York, NY 10004',
    coordinates: [-74.0445, 40.6892],
    imageUrl: 'https://images.unsplash.com/photo-1605130284583-f5c7b8800ae3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
    description: 'Iconic copper statue gifted by France, standing at Liberty Island as a symbol of freedom and democracy.'
  },
  {
    id: 'brooklyn-bridge',
    name: 'Brooklyn Bridge',
    address: 'Brooklyn Bridge, New York, NY 10038',
    coordinates: [-73.9969, 40.7061],
    imageUrl: 'https://images.unsplash.com/photo-1541336744128-c4b211d13087?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
    description: 'Historic suspension bridge connecting Manhattan and Brooklyn over the East River.'
  },
  {
    id: 'grand-central',
    name: 'Grand Central Terminal',
    address: '89 E 42nd St, New York, NY 10017',
    coordinates: [-73.9772, 40.7527],
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
    description: 'Historic train terminal known for its grand architectural details and bustling main concourse.'
  }
];

const LocationSearch = ({ onAddLocation }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // In a real app, this would be an API call to Google Places or similar
        const filteredResults = MOCK_SEARCH_RESULTS.filter(
          location => location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    location.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(filteredResults);
        setIsSearching(false);
        
        if (filteredResults.length === 0) {
          setError("No locations found. Try different search terms like 'New York', 'Times Square', 'Brooklyn', etc.");
        }
      } catch (err) {
        setError("An error occurred while searching. Please try again.");
        setIsSearching(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Find Locations</h2>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for places like 'New York' or 'Brooklyn Bridge'"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow text-base"
        />
        <Button type="submit" disabled={isSearching}>
          <MagnifyingGlass className="mr-2" size={20} />
          <span>Search</span>
        </Button>
      </form>
      
      {error && (
        <Card className="p-3 border-destructive">
          <p className="text-destructive">{error}</p>
        </Card>
      )}

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="space-y-3 mt-4">
          <h3 className="font-medium">Search Results</h3>
          {searchResults.map((location) => (
            <Card key={location.id} className="p-3">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{location.name}</h4>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => onAddLocation(location)}
                  title="Add to itinerary"
                >
                  <Plus size={16} />
                  <span className="ml-1">Add</span>
                </Button>
              </div>
              {location.imageUrl && (
                <div className="mt-2 h-32 overflow-hidden rounded-md">
                  <img 
                    src={location.imageUrl} 
                    alt={location.name} 
                    className="w-full h-full object-cover"
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
            </Card>
          ))}
        </div>
      )}
      
      {isSearching && (
        <div className="text-center py-4">
          <p>Searching...</p>
        </div>
      )}
      
      {searchResults.length === 0 && searchQuery && !isSearching && !error && (
        <Card className="p-4">
          <p className="text-center text-muted-foreground">No locations found. Try another search term.</p>
        </Card>
      )}
      
      {!searchQuery && !isSearching && (
        <Card className="p-4 bg-muted/20">
          <p className="text-center">
            Try searching for famous places like "Times Square", "Central Park", or "Brooklyn Bridge"
          </p>
        </Card>
      )}
    </div>
  );
};

export default LocationSearch;