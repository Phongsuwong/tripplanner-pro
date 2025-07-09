import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Location } from '../../types';
import { Card } from '../ui/card';
import { DotsSixVertical, TrashSimple, MapPin } from '@phosphor-icons/react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface SortableItemProps {
  id: string;
  location: Location;
  isDragging: boolean;
  isSelected: boolean;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}

export const SortableItem = ({
  id,
  location,
  isDragging,
  isSelected,
  onRemove,
  onSelect
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "location-card p-3 transition-all duration-300",
        isDragging && "opacity-50",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onSelect(id)}
    >
      <div className="flex gap-3 items-start">
        <div className="drag-handle cursor-grab touch-none flex items-center h-full py-2" {...attributes} {...listeners}>
          <DotsSixVertical size={24} className="text-muted-foreground" />
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-lg truncate">{location.name}</h3>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
            >
              <TrashSimple size={18} />
              <span className="sr-only">Remove location</span>
            </Button>
          </div>
          
          <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
            <MapPin size={14} />
            <span className="truncate">{location.address}</span>
          </p>
          
          {location.imageUrl && (
            <div className="mt-2 relative rounded-md overflow-hidden h-24">
              <img 
                src={location.imageUrl} 
                alt={location.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SortableItem;