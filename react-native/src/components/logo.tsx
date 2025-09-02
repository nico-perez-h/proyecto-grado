import React from "react";
import { Icon } from "@iconify/react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = "md", showText = true }) => {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl"
  };
  
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Icon 
          icon="lucide:droplets" 
          className={`${sizeClasses[size]} text-primary`} 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-300/30 to-primary-600/30 blur-sm rounded-full -z-10"></div>
      </div>
      
      {showText && (
        <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent`}>
          AquaMonitor
        </h1>
      )}
    </div>
  );
};