
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
import { Volume2, Upload, Play, Pause, Settings, Music } from "lucide-react";
import { saveRingtone } from "@/utils/audioSettings";

interface RingtoneSelectorProps {
  onSelect: (ringtoneUrl: string) => void;
  currentRingtone: string;
  isSettingsPage?: boolean;
}

const DEFAULT_RINGTONES = [
  { id: "bell", name: "Bell", url: "/sounds/bell.mp3" },
  { id: "chime", name: "Chime", url: "/sounds/chime.mp3" },
  { id: "alert", name: "Alert", url: "/sounds/alert.mp3" },
];

const RingtoneSelector: React.FC<RingtoneSelectorProps> = ({ 
  onSelect, 
  currentRingtone, 
  isSettingsPage = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingRingtone, setPlayingRingtone] = useState<string | null>(null);
  const [customRingtone, setCustomRingtone] = useState<File | null>(null);
  const [selectedRingtone, setSelectedRingtone] = useState(currentRingtone);
  const [customRingtones, setCustomRingtones] = useState<{ name: string; url: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom ringtones from localStorage
  useEffect(() => {
    const storedRingtones = localStorage.getItem('custom-ringtones');
    if (storedRingtones) {
      try {
        setCustomRingtones(JSON.parse(storedRingtones));
      } catch (e) {
        console.error('Failed to parse custom ringtones', e);
      }
    }
  }, []);

  // Save custom ringtones to localStorage
  const saveCustomRingtones = (ringtones: { name: string; url: string }[]) => {
    localStorage.setItem('custom-ringtones', JSON.stringify(ringtones));
    setCustomRingtones(ringtones);
  };

  useEffect(() => {
    // Stop audio when dialog closes
    if (!isOpen && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingRingtone(null);
    }
  }, [isOpen, isPlaying]);

  const handlePlay = (url: string) => {
    if (audioRef.current) {
      if (isPlaying && playingRingtone === url) {
        audioRef.current.pause();
        setIsPlaying(false);
        setPlayingRingtone(null);
      } else {
        if (isPlaying) {
          audioRef.current.pause();
        }
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        setPlayingRingtone(url);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setCustomRingtone(file);
      const objectUrl = URL.createObjectURL(file);
      setSelectedRingtone(objectUrl);
      
      // Save to custom ringtones list
      const newCustomRingtone = {
        name: file.name,
        url: objectUrl
      };
      
      saveCustomRingtones([...customRingtones, newCustomRingtone]);
    }
  };

  const handleSave = () => {
    onSelect(selectedRingtone);
    saveRingtone(selectedRingtone);
    setIsOpen(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingRingtone(null);
    }
  };

  // Settings page mode doesn't need dialog
  if (isSettingsPage) {
    return (
      <div className="space-y-6 py-4">
        <audio ref={audioRef} onEnded={() => {
          setIsPlaying(false);
          setPlayingRingtone(null);
        }} />
        
        <RadioGroup 
          value={selectedRingtone} 
          onValueChange={(value) => {
            setSelectedRingtone(value);
            saveRingtone(value);
            onSelect(value);
          }}
          className="space-y-3"
        >
          <div className="text-sm font-medium mb-2">Default Sounds</div>
          {DEFAULT_RINGTONES.map((ringtone) => (
            <div key={ringtone.id} className="flex items-center justify-between space-x-2 border p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ringtone.url} id={`settings-${ringtone.id}`} />
                <Label htmlFor={`settings-${ringtone.id}`} className="cursor-pointer">{ringtone.name}</Label>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.preventDefault();
                  handlePlay(ringtone.url);
                }}
              >
                {isPlaying && playingRingtone === ringtone.url ? 
                  <Pause className="h-4 w-4" /> : 
                  <Play className="h-4 w-4" />
                }
              </Button>
            </div>
          ))}

          {customRingtones.length > 0 && (
            <>
              <div className="text-sm font-medium mb-2 mt-6">Your Custom Sounds</div>
              {customRingtones.map((ringtone, index) => (
                <div key={`custom-${index}`} className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ringtone.url} id={`settings-custom-${index}`} />
                    <Label htmlFor={`settings-custom-${index}`} className="cursor-pointer">
                      {ringtone.name}
                    </Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePlay(ringtone.url);
                    }}
                  >
                    {isPlaying && playingRingtone === ringtone.url ? 
                      <Pause className="h-4 w-4" /> : 
                      <Play className="h-4 w-4" />
                    }
                  </Button>
                </div>
              ))}
            </>
          )}
        </RadioGroup>

        <div className="space-y-2 mt-6">
          <Label htmlFor="ringtone-upload-settings">Upload a new sound</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="ringtone-upload-settings"
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="flex-1"
              ref={fileInputRef}
            />
          </div>
        </div>
      </div>
    );
  }

  // Dialog mode for inline usage
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
            <audio ref={audioRef} onEnded={() => {
              setIsPlaying(false);
              setPlayingRingtone(null);
            }} />
            
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
                    {isPlaying && playingRingtone === ringtone.url ? 
                      <Pause className="h-4 w-4" /> : 
                      <Play className="h-4 w-4" />
                    }
                  </Button>
                </div>
              ))}

              {customRingtones.length > 0 && (
                <>
                  {customRingtones.map((ringtone, index) => (
                    <div key={`custom-${index}`} className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={ringtone.url} id={`custom-${index}`} />
                        <Label htmlFor={`custom-${index}`} className="cursor-pointer">
                          {ringtone.name}
                        </Label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePlay(ringtone.url);
                        }}
                      >
                        {isPlaying && playingRingtone === ringtone.url ? 
                          <Pause className="h-4 w-4" /> : 
                          <Play className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  ))}
                </>
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
