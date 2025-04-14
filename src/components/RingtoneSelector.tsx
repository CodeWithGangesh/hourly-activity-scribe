
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Music } from "lucide-react";
import { 
  saveRingtone, 
  getCustomRingtones, 
} from "@/utils/audioSettings";
import { toast } from "sonner";
import RingtoneList from "./ringtones/RingtoneList";
import RingtoneUploader from "./ringtones/RingtoneUploader";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface RingtoneSelectorProps {
  onSelect: (ringtoneUrl: string) => void;
  currentRingtone: string;
  isSettingsPage?: boolean;
}

const RingtoneSelector: React.FC<RingtoneSelectorProps> = ({ 
  onSelect, 
  currentRingtone, 
  isSettingsPage = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRingtone, setSelectedRingtone] = useState(currentRingtone);
  const [customRingtones, setCustomRingtones] = useState<{ name: string; url: string }[]>([]);
  const { isPlaying, playingRingtone, handlePlay, stopPlayback } = useAudioPlayer();

  // Load custom ringtones from localStorage
  useEffect(() => {
    const storedRingtones = getCustomRingtones();
    setCustomRingtones(storedRingtones);
  }, []);

  // Clean up audio when dialog closes
  useEffect(() => {
    if (!isOpen && isPlaying) {
      stopPlayback();
    }
  }, [isOpen, isPlaying, stopPlayback]);

  const handleSave = () => {
    onSelect(selectedRingtone);
    saveRingtone(selectedRingtone);
    setIsOpen(false);
    
    // Stop playing audio if active
    stopPlayback();
    
    toast("Settings saved", {
      description: "Your sound preferences have been updated.",
    });
  };

  const handleRingtoneAdded = (name: string, url: string) => {
    // Update state
    setCustomRingtones([...customRingtones, { name, url }]);
    setSelectedRingtone(url);
    
    if (!isSettingsPage) {
      // Auto-save in dialog mode
      onSelect(url);
      saveRingtone(url);
      setIsOpen(false);
    }
  };

  // Settings page mode (full interface)
  if (isSettingsPage) {
    return (
      <div className="space-y-6 py-4">
        <RingtoneList 
          selectedRingtone={selectedRingtone} 
          onSelectRingtone={(value) => {
            setSelectedRingtone(value);
            saveRingtone(value);
            onSelect(value);
            toast("Sound selected", { 
              description: "Your notification sound has been updated.",
            });
          }}
          customRingtones={customRingtones}
          isPlaying={isPlaying}
          playingRingtone={playingRingtone}
          onPlay={handlePlay}
        />

        <RingtoneUploader onRingtoneAdded={handleRingtoneAdded} />
      </div>
    );
  }

  // Dialog mode for quick settings
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Music className="h-4 w-4" />
            <span>Sound Settings</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Notification Sound</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <RingtoneList 
              selectedRingtone={selectedRingtone} 
              onSelectRingtone={setSelectedRingtone}
              customRingtones={customRingtones}
              isPlaying={isPlaying}
              playingRingtone={playingRingtone}
              onPlay={handlePlay}
            />

            <RingtoneUploader onRingtoneAdded={handleRingtoneAdded} />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RingtoneSelector;
