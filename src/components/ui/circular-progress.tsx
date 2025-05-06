
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  color?: string;
  indicatorColor?: string;
  backgroundCircleColor?: string;
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ 
    value = 0, 
    size = 64, 
    strokeWidth = 6, // Increased stroke width for more visibility
    showPercentage = true,
    color = "bg-primary text-primary-foreground",
    indicatorColor,
    backgroundCircleColor = "stroke-muted",
    className, 
    ...props 
  }, ref) => {
    // Calculate the radius and circumference
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    
    // Ensure value is between 0-100
    const normalizedValue = Math.min(100, Math.max(0, value));
    
    return (
      <div 
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        {/* Background circle */}
        <svg width={size} height={size} className="absolute">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className={cn("opacity-20", backgroundCircleColor)}
          />
        </svg>
        
        {/* Progress circle */}
        <svg 
          width={size} 
          height={size} 
          className="absolute -rotate-90 transform"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-500 ease-in-out",
              indicatorColor || color
            )}
          />
        </svg>
        
        {/* Percentage text */}
        {showPercentage && (
          <div className="absolute flex items-center justify-center text-center font-medium">
            <span className="flex items-center justify-center text-sm">
              {normalizedValue}%
            </span>
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
