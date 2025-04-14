
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingRingtone, setPlayingRingtone] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  const stopPlayback = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingRingtone(null);
    }
  };

  return {
    isPlaying,
    playingRingtone,
    handlePlay,
    stopPlayback,
    audioRef
  };
}
