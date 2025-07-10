import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { Location } from '../../types';
import { searchPlaces, loadGoogleMapsScript } from '../../lib/googlePlacesService';

interface LocationSearchProps {
  onAddLocation: (location: Location) => void;
}

const LocationSearch = ({ onAddLocation }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize Google Maps API on component mount
  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google?.maps) {
      return; // API already loaded
    }

    // Load the Google Maps API using our utility function
    loadGoogleMapsScript().catch(err => {
      console.error("Failed to load Google Maps API:", err);
      setError("Failed to initialize search. Please check your API key and try again later.");
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const results = await searchPlaces(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError("No locations found. Please try a different search term.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
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