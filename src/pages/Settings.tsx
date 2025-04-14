
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Volume2, ArrowLeft, Bell } from "lucide-react";
import RingtoneSelector from "@/components/RingtoneSelector";
import { 
  getVolume, 
  saveVolume, 
  getEnabled, 
  saveEnabled,
  getRingtone
} from "@/utils/audioSettings";

const Settings = () => {
  const [volume, setVolume] = useState<number>(getVolume());
  const [enabled, setEnabled] = useState<boolean>(getEnabled());
  const [currentRingtone, setCurrentRingtone] = useState<string>(getRingtone());

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    saveVolume(newVolume);
  };

  const handleEnabledChange = (value: boolean) => {
    setEnabled(value);
    saveEnabled(value);
  };

  const handleRingtoneSelect = (ringtoneUrl: string) => {
    setCurrentRingtone(ringtoneUrl);
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 md:px-0">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Sound Settings</h1>
          <p className="text-muted-foreground">
            Customize notification sounds and volume for hourly alerts
          </p>
        </div>

        <div className="border rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-lg font-medium">Hourly Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Enable or disable sound alerts when each hour passes
                </p>
              </div>
              <Switch checked={enabled} onCheckedChange={handleEnabledChange} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Volume</h3>
                <span className="text-sm text-muted-foreground">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Notification Sound</h3>
              <p className="text-sm text-muted-foreground">
                Select a sound that will play when an hour passes
              </p>
              <RingtoneSelector 
                onSelect={handleRingtoneSelect}
                currentRingtone={currentRingtone}
                isSettingsPage={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
