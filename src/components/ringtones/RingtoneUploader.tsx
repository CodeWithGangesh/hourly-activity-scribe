
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { saveCustomRingtone } from "@/utils/audioSettings";
import { toast } from "sonner";

interface RingtoneUploaderProps {
  onRingtoneAdded: (name: string, url: string) => void;
}

const RingtoneUploader: React.FC<RingtoneUploaderProps> = ({ onRingtoneAdded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      try {
        const objectUrl = URL.createObjectURL(file);
        
        // Save to localStorage
        saveCustomRingtone(file.name, objectUrl);
        
        // Update parent component
        onRingtoneAdded(file.name, objectUrl);
        
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

  return (
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
  );
};

export default RingtoneUploader;
