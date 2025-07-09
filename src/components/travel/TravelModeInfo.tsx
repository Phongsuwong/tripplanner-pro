import { 
  Car, 
  Person, 
  Bus, 
  Airplane,
  Clock,
  MapPin,
  NavigationArrow
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Location, TravelMode } from '../../types';
import { calculateTravelTime, calculateDistance } from '../../lib/utils';

interface TravelModeInfoProps {
  startLocation: Location;
  endLocation: Location;
  travelModes: TravelMode[];
  selectedMode: string;
  onChangeTravelMode: (startLocationId: string, endLocationId: string, travelModeId: string) => void;
}

export function TravelModeInfo({
  startLocation,
  endLocation,
  travelModes,
  selectedMode,
  onChangeTravelMode
}: TravelModeInfoProps) {
  const getModeIcon = (modeId: string) => {
    switch (modeId) {
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

  const [startLon, startLat] = startLocation.coordinates;
  const [endLon, endLat] = endLocation.coordinates;
  const distance = calculateDistance(startLat, startLon, endLat, endLon);

  const getModeDetails = (modeId: string) => {
    const travelTime = calculateTravelTime(startLocation, endLocation, modeId);
    const modeName = travelModes.find(m => m.id === modeId)?.name || 'Travel';
    
    const details = {
      driving: {
        info: "Door-to-door convenience with your own vehicle",
        pros: ["No waiting for transport", "Carry luggage easily", "Flexibility to stop anywhere"],
        cons: ["May encounter traffic", "Parking can be difficult", "Need to pay attention to directions"]
      },
      walking: {
        info: "Enjoy the scenery and get some exercise",
        pros: ["Free and healthy", "See more of the local area", "No parking worries"],
        cons: ["Limited to shorter distances", "Weather dependent", "Can be tiring with luggage"]
      },
      transit: {
        info: "Public transportation options available",
        pros: ["Often cheaper than driving", "No parking needed", "Can relax during journey"],
        cons: ["Fixed schedules", "May need to make transfers", "Less direct than driving"]
      },
      flying: {
        info: "Fastest option for long distances",
        pros: ["Quickest for long trips", "Often comfortable", "Good for crossing water"],
        cons: ["Airport procedures add time", "Less flexible scheduling", "More expensive"]
      }
    };
    
    return {
      name: modeName,
      time: travelTime,
      distance,
      ...details[modeId as keyof typeof details]
    };
  };

  const selectedModeDetails = getModeDetails(selectedMode);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-4">
          <NavigationArrow className="mr-2" size={20} />
          View Travel Options
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Travel Options</DialogTitle>
          <DialogDescription>
            Compare different ways to travel from {startLocation.name} to {endLocation.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between px-2 py-3 bg-muted/50 rounded-lg mb-4 text-sm">
          <div className="flex items-center">
            <MapPin size={18} className="mr-2 text-primary" />
            <span className="font-medium">{startLocation.name}</span>
          </div>
          <span className="text-muted-foreground">to</span>
          <div className="flex items-center">
            <span className="font-medium">{endLocation.name}</span>
            <MapPin size={18} className="ml-2 text-accent" />
          </div>
        </div>
        
        <div className="space-y-3">
          {travelModes.map(mode => {
            const modeDetails = getModeDetails(mode.id);
            const isSelected = mode.id === selectedMode;
            
            return (
              <Card 
                key={mode.id}
                className={`${isSelected ? 'border-primary' : ''} cursor-pointer transition-all`}
                onClick={() => onChangeTravelMode(startLocation.id, endLocation.id, mode.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {getModeIcon(mode.id)}
                      </div>
                      <div>
                        <div className="font-medium">{modeDetails.name}</div>
                        <div className="text-sm text-muted-foreground">{modeDetails.info}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{formatTime(modeDetails.time)}</div>
                      <div className="text-sm text-muted-foreground">{modeDetails.distance} km</div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t text-sm">
                      <div className="font-medium mb-1">Advantages</div>
                      <ul className="list-disc pl-5 mb-2 text-muted-foreground">
                        {modeDetails.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                      </ul>
                      <div className="font-medium mb-1">Limitations</div>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {modeDetails.cons.map((con, i) => <li key={i}>{con}</li>)}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TravelModeInfo;