
import React from 'react';
import { cn } from '@/lib/utils';

interface SpintexHeadingProps {
  options: string[];
  className?: string;
  interval?: number;
  locationData?: {
    city_name?: string;
    region_name?: string;
  };
}

export const SpintexHeading: React.FC<SpintexHeadingProps> = ({
  options,
  className,
  locationData,
}) => {
  // Replace location variables in the text if locationData is provided
  const processText = (text: string) => {
    if (!locationData) return text;
    
    let processed = text;
    if (locationData.city_name) {
      processed = processed.replace(/\{location\(city_name\)\}/g, locationData.city_name);
    }
    if (locationData.region_name) {
      processed = processed.replace(/\{location\(region_name\)\}/g, locationData.region_name);
    }
    return processed;
  };

  return (
    <h1 className={cn(className)}>
      {processText(options[0])}
    </h1>
  );
};

export default SpintexHeading;
