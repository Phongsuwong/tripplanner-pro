import { Button } from '../ui/button';
import { MapTrifold, Download, FloppyDisk } from '@phosphor-icons/react';

interface HeaderProps {
  onSaveItinerary: () => void;
  onToggleMapView: () => void;
  isMapVisible: boolean;
}

export const Header = ({ onSaveItinerary, onToggleMapView, isMapVisible }: HeaderProps) => {
  return (
    <header className="border-b border-border p-4 bg-background/95 backdrop-blur sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <MapTrifold size={32} className="text-primary mr-2" weight="duotone" />
          <h1 className="text-2xl font-bold">TravelEase</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="md:hidden"
            onClick={onToggleMapView}
          >
            <MapTrifold size={20} className="mr-2" />
            {isMapVisible ? 'Hide Map' : 'Show Map'}
          </Button>
          
          <Button variant="secondary" onClick={onSaveItinerary}>
            <FloppyDisk size={20} className="mr-2" />
            Save Plan
          </Button>
          
          <Button variant="outline" className="hidden md:flex">
            <Download size={20} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;