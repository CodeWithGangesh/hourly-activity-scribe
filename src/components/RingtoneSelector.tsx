
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Volume2, Upload, Play, Pause, Settings } from "lucide-react";

interface RingtoneSelectorProps {
  onSelect: (ringtoneUrl: string) => void;
  currentRingtone: string;
}

const DEFAULT_RINGTONES = [
  { id: "bell", name: "Bell", url: "/sounds/bell.mp3" },
  { id: "chime", name: "Chime", url: "/sounds/chime.mp3" },
  { id: "alert", name: "Alert", url: "/sounds/alert.mp3" },
];

const RingtoneSelector: React.FC<RingtoneSelectorProps> = ({ onSelect, currentRingtone }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customRingtone, setCustomRingtone] = useState<File | null>(null);
  const [selectedRingtone, setSelectedRingtone] = useState(currentRingtone);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Stop audio when dialog closes
    if (!isOpen && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen, isPlaying]);

  const handlePlay = (url: string) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setCustomRingtone(file);
      const objectUrl = URL.createObjectURL(file);
      setSelectedRingtone(objectUrl);
    }
  };

  const handleSave = () => {
    onSelect(selectedRingtone);
    setIsOpen(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            <span>Sound Settings</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Notification Sound</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
            
            <RadioGroup 
              value={selectedRingtone} 
              onValueChange={setSelectedRingtone}
              className="space-y-3"
            >
              {DEFAULT_RINGTONES.map((ringtone) => (
                <div key={ringtone.id} className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ringtone.url} id={ringtone.id} />
                    <Label htmlFor={ringtone.id} className="cursor-pointer">{ringtone.name}</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePlay(ringtone.url);
                    }}
                  >
                    {isPlaying && selectedRingtone === ringtone.url ? 
                      <Pause className="h-4 w-4" /> : 
                      <Play className="h-4 w-4" />
                    }
                  </Button>
                </div>
              ))}

              {customRingtone && (
                <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={URL.createObjectURL(customRingtone)} id="custom" />
                    <Label htmlFor="custom" className="cursor-pointer">
                      {customRingtone.name}
                    </Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePlay(URL.createObjectURL(customRingtone));
                    }}
                  >
                    {isPlaying && selectedRingtone === URL.createObjectURL(customRingtone) ? 
                      <Pause className="h-4 w-4" /> : 
                      <Play className="h-4 w-4" />
                    }
                  </Button>
                </div>
              )}
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="ringtone-upload">Upload your own sound</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="ringtone-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
              </div>
            </div>
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
