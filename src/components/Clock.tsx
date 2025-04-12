
import React from "react";
import { Clock as ClockIcon } from "lucide-react";

interface ClockProps {
  time: string;
  progress: number;
}

const Clock: React.FC<ClockProps> = ({ time, progress }) => {
  // Calculate the stroke dash offset for the progress ring
  const circumference = 440;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-primary/10"></div>
        
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 160 160">
          <circle
            className="clock-ring text-primary"
            cx="80"
            cy="80"
            r="70"
            fill="none"
            strokeWidth="8"
            style={{
              strokeDashoffset: dashOffset,
              transition: "stroke-dashoffset 1s ease-in-out"
            }}
          />
        </svg>
        
        {/* Clock time and icon */}
        <div className="z-10 text-center flex flex-col items-center space-y-2">
          <ClockIcon className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">{time}</h2>
        </div>
      </div>
    </div>
  );
};

export default Clock;
