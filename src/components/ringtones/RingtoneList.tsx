
import React from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import RingtoneItem from "./RingtoneItem";
import { DEFAULT_RINGTONES } from "@/constants/ringtones";

interface RingtoneListProps {
  selectedRingtone: string;
  onSelectRingtone: (url: string) => void;
  customRingtones: Array<{ name: string; url: string }>;
  isPlaying: boolean;
  playingRingtone: string | null;
  onPlay: (url: string) => void;
}

const RingtoneList: React.FC<RingtoneListProps> = ({
  selectedRingtone,
  onSelectRingtone,
  customRingtones,
  isPlaying,
  playingRingtone,
  onPlay
}) => {
  return (
    <RadioGroup 
      value={selectedRingtone} 
      onValueChange={onSelectRingtone}
      className="space-y-3"
    >
      <div className="text-sm font-medium mb-2">Default Sounds</div>
      {DEFAULT_RINGTONES.map((ringtone) => (
        <RingtoneItem
          key={ringtone.id}
          id={ringtone.id}
          name={ringtone.name}
          url={ringtone.url}
          isPlaying={isPlaying && playingRingtone === ringtone.url}
          isSelected={selectedRingtone === ringtone.url}
          onPlay={onPlay}
        />
      ))}

      {customRingtones.length > 0 && (
        <>
          <div className="text-sm font-medium mb-2 mt-4">Your Custom Sounds</div>
          {customRingtones.map((ringtone, index) => (
            <RingtoneItem
              key={`custom-${index}`}
              id={`custom-${index}`}
              name={ringtone.name}
              url={ringtone.url}
              isPlaying={isPlaying && playingRingtone === ringtone.url}
              isSelected={selectedRingtone === ringtone.url}
              onPlay={onPlay}
            />
          ))}
        </>
      )}
    </RadioGroup>
  );
};

export default RingtoneList;
