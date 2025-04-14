
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
import { 
  saveRingtone, 
  saveCustomRingtone, 
  getCustomRingtones, 
  getRingtone 
} from "@/utils/audioSettings";
import { toast } from "sonner";

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
  const [selectedRingtone, setSelectedRingtone] = useState(currentRingtone);
  const [customRingtones, setCustomRingtones] = useState<{ name: string; url: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom ringtones from localStorage
  useEffect(() => {
    const storedRingtones = getCustomRingtones();
    setCustomRingtones(storedRingtones);
    
    // Initialize audio element
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Clean up audio when dialog closes
  useEffect(() => {
    if (!isOpen && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingRingtone(null);
    }
  }, [isOpen, isPlaying]);

  const handlePlay = (url: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    if (isPlaying && playingRingtone === url) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingRingtone(null);
    } else {
      // Stop current audio if playing
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
      }
      
      try {
        audioRef.current.src = url;
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setPlayingRingtone(null);
        };
        
        // Play with error handling
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setPlayingRingtone(url);
            })
            .catch(error => {
              console.error("Error playing audio:", error);
              toast("Failed to play audio", {
                description: "There was an issue playing this sound.",
              });
              setIsPlaying(false);
              setPlayingRingtone(null);
            });
        }
      } catch (error) {
        console.error("Error setting up audio:", error);
        toast("Audio error", {
          description: "There was an issue with the audio player.",
        });
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      try {
        const objectUrl = URL.createObjectURL(file);
        
        // Create a new custom ringtone
        const newCustomRingtone = {
          name: file.name,
          url: objectUrl
        };
        
        // Save to localStorage
        saveCustomRingtone(file.name, objectUrl);
        
        // Update state
        setCustomRingtones([...customRingtones, newCustomRingtone]);
        setSelectedRingtone(objectUrl);
        onSelect(objectUrl);
        
        if (!isSettingsPage) {
          // Auto-save in dialog mode
          saveRingtone(objectUrl);
          setIsOpen(false);
        }
        
        toast("Sound added", {
          description: `Added ${file.name} to your custom sounds.`,
        });
      } catch (error) {
        console.error("Error handling file upload:", error);
        toast("Upload failed", {
          description: "There was an issue adding your custom sound.",
        });
      }
    } else if (file) {
      toast("Invalid file type", {
        description: "Please select an audio file (mp3, wav, etc.).",
      });
    }
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    onSelect(selectedRingtone);
    saveRingtone(selectedRingtone);
    setIsOpen(false);
    
    // Stop playing audio if active
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingRingtone(null);
    }
    
    toast("Settings saved", {
      description: "Your sound preferences have been updated.",
    });
  };

  // Settings page mode (full interface)
  if (isSettingsPage) {
    return (
      <div className="space-y-6 py-4">
        <audio ref={audioRef} />
        
        <RadioGroup 
          value={selectedRingtone} 
          onValueChange={(value) => {
            setSelectedRingtone(value);
            saveRingtone(value);
            onSelect(value);
            toast("Sound selected", { 
              description: "Your notification sound has been updated.",
            });
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
            <audio ref={audioRef} />
            
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
                  <div className="text-sm font-medium mb-2 mt-4">Your Custom Sounds</div>
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
                  ref={fileInputRef}
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
