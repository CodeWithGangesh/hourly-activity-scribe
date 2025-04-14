
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface RingtoneItemProps {
  id: string;
  name: string;
  url: string;
  isPlaying: boolean;
  isSelected: boolean;
  onPlay: (url: string) => void;
}

const RingtoneItem: React.FC<RingtoneItemProps> = ({
  id,
  name,
  url,
  isPlaying,
  isSelected,
  onPlay
}) => {
  return (
    <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={url} id={id} />
        <Label htmlFor={id} className="cursor-pointer">{name}</Label>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={(e) => {
          e.preventDefault();
          onPlay(url);
        }}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default RingtoneItem;
