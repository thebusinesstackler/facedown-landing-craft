
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: number;
  selected?: boolean;
  onSelect: () => void;
  description?: string;
  features?: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  selected = false,
  onSelect,
  description,
  features = []
}) => {
  return (
    <Card 
      className={`border-2 transition-all ${
        selected 
          ? 'border-medical-green shadow-lg scale-105' 
          : 'border-border hover:border-medical-green/50'
      }`}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="mt-2">
          <span className="text-3xl font-bold">${price.toFixed(2)}</span>
        </div>
      </CardHeader>
      <CardContent>
        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check size={18} className="text-medical-green mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={onSelect}
          variant={selected ? "default" : "outline"}
          className={selected ? "bg-medical-green hover:bg-medical-green/90 w-full" : "w-full"}
        >
          {selected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
