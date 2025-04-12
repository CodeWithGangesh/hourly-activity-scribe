
import { useState, useEffect, useCallback } from "react";

interface UseHourlyAlertProps {
  onHourChange: () => void;
}

export function useHourlyAlert({ onHourChange }: UseHourlyAlertProps) {
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  const [minutes, setMinutes] = useState<number>(new Date().getMinutes());
  const [seconds, setSeconds] = useState<number>(new Date().getSeconds());

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

  return {
    currentHour,
    minutes,
    seconds,
    formatTime,
    hourProgress,
  };
}
