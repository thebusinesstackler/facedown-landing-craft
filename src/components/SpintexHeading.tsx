
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SpintexHeadingProps {
  options: string[];
  className?: string;
  interval?: number;
}

export const SpintexHeading: React.FC<SpintexHeadingProps> = ({
  options,
  className,
  interval = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % options.length);
        setVisible(true);
      }, 500); // Fade out duration
      
    }, interval);

    return () => clearInterval(intervalId);
  }, [options.length, interval]);

  return (
    <h1 className={cn(
      visible ? "animate-fade-in" : "animate-fade-out",
      "transition-opacity duration-500",
      className
    )}>
      {options[currentIndex]}
    </h1>
  );
};

export default SpintexHeading;
