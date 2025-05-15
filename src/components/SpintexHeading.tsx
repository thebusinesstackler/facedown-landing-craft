
import React from 'react';
import { cn } from '@/lib/utils';

interface SpintexHeadingProps {
  options: string[];
  className?: string;
  interval?: number;
}

export const SpintexHeading: React.FC<SpintexHeadingProps> = ({
  options,
  className,
}) => {
  // Instead of cycling through options, just display the first one
  return (
    <h1 className={cn(className)}>
      {options[0]}
    </h1>
  );
};

export default SpintexHeading;
