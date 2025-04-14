
import { useState, useEffect, useCallback, useRef } from "react";
import { getRingtone, getEnabled, getVolume } from "@/utils/audioSettings";
import { toast } from "sonner";

interface UseHourlyAlertProps {
  onHourChange: () => void;
}

export function useHourlyAlert({ onHourChange }: UseHourlyAlertProps) {
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  const [minutes, setMinutes] = useState<number>(new Date().getMinutes());
  const [seconds, setSeconds] = useState<number>(new Date().getSeconds());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Pre-load the current ringtone
    if (audioRef.current) {
      try {
        audioRef.current.src = getRingtone();
        audioRef.current.volume = getVolume();
        audioRef.current.load();
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setMinutes(now.getMinutes());
      setSeconds(now.getSeconds());
      
      // Check if the hour has changed
      const newHour = now.getHours();
      if (newHour !== currentHour) {
        setCurrentHour(newHour);
        onHourChange();
        
        // Play the notification sound if enabled
        if (getEnabled()) {
          playRingtone();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentHour, onHourChange]);

  // Format time as HH:MM:SS
  const formatTime = useCallback(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }, []);

  // Calculate progress of current hour (0-100)
  const hourProgress = useCallback(() => {
    return ((minutes * 60 + seconds) / 3600) * 100;
  }, [minutes, seconds]);

  // Function to manually play the current ringtone
  const playRingtone = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    try {
      // Get latest settings
      const ringtoneSrc = getRingtone();
      const volume = getVolume();

      // Configure audio
      audioRef.current.src = ringtoneSrc;
      audioRef.current.volume = volume;
      
      // Handle successful play
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing ringtone:", error);
          toast("Sound playback failed", {
            description: "There was an issue playing the notification sound."
          });
        });
      }
    } catch (error) {
      console.error("Error setting up ringtone playback:", error);
    }
  }, []);

  return {
    currentHour,
    minutes,
    seconds,
    formatTime,
    hourProgress,
    playRingtone,
  };
}
