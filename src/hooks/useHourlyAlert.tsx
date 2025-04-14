
import { useState, useEffect, useCallback, useRef } from "react";
import { getRingtone, getEnabled } from "@/utils/audioSettings";

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
    audioRef.current = new Audio(getRingtone());
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
        if (getEnabled() && audioRef.current) {
          // Update the audio source in case it was changed
          audioRef.current.src = getRingtone();
          audioRef.current.play().catch(error => {
            console.error("Error playing audio:", error);
          });
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
    if (audioRef.current) {
      audioRef.current.src = getRingtone();
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
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
