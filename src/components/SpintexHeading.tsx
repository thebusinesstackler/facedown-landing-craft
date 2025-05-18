
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SpintexHeadingProps {
  options: string[];
  className?: string;
  interval?: number;
  locationData?: {
    city_name?: string;
    region_name?: string;
    keyword?: string;
  };
}

export const SpintexHeading: React.FC<SpintexHeadingProps> = ({
  options,
  className,
  interval = 5000,
  locationData,
}) => {
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
  const [processedText, setProcessedText] = useState('');

  useEffect(() => {
    // Process the text initially
    setProcessedText(processText(options[currentOptionIndex]));

    // Set up interval if more than one option
    if (options.length > 1 && interval > 0) {
      const timer = setInterval(() => {
        setCurrentOptionIndex((prevIndex) => (prevIndex + 1) % options.length);
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [currentOptionIndex, options, interval]);

  useEffect(() => {
    // Update processed text when currentOptionIndex or locationData changes
    setProcessedText(processText(options[currentOptionIndex]));
  }, [currentOptionIndex, options, locationData]);

  // Process all types of placeholders in the text
  const processText = (text: string) => {
    if (!text) return '';
    
    let processed = text;
    
    // Handle location variables like {location(city_name)}
    if (locationData) {
      if (locationData.city_name) {
        processed = processed.replace(/\{location\(city_name\)\}/g, locationData.city_name);
      }
      if (locationData.region_name) {
        processed = processed.replace(/\{location\(region_name\)\}/g, locationData.region_name);
      }
      if (locationData.keyword) {
        processed = processed.replace(/\{keyword\}/g, locationData.keyword);
      }
      
      // Handle direct references like {city_name}
      processed = processed.replace(/\{city_name\}/g, locationData.city_name || '{city_name}');
      processed = processed.replace(/\{region_name\}/g, locationData.region_name || '{region_name}');
      processed = processed.replace(/\{keyword\}/g, locationData.keyword || '{keyword}');
    }
    
    // Handle spintex options like {discover|explore}
    processed = processed.replace(/\{([^{}]+\|[^{}]+)\}/g, (match) => {
      // Extract options from the match (remove the curly braces)
      const options = match.slice(1, -1).split('|');
      // Randomly select one option
      const randomIndex = Math.floor(Math.random() * options.length);
      return options[randomIndex];
    });
    
    return processed;
  };

  return (
    <h1 className={cn(className)}>
      {processedText}
    </h1>
  );
};

export default SpintexHeading;
