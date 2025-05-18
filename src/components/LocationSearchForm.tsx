
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { bulkSaveLocations, LocationData } from '@/utils/locationUtils';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Plus, ChevronRight, ChevronDown } from 'lucide-react';

interface City {
  city: string;
  state: string;
  distance: number;
  selected: boolean;
}

interface LocationSearchFormProps {
  onGenerate: (locations: LocationData[]) => void;
}

const LocationSearchForm: React.FC<LocationSearchFormProps> = ({ onGenerate }) => {
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('50');
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [keywords, setKeywords] = useState<string[]>(['Face-Down Recovery Equipment Rentals']);
  const [newKeyword, setNewKeyword] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [previewLocations, setPreviewLocations] = useState<LocationData[]>([]);

  const searchCities = async () => {
    if (!zipCode || !radius) {
      toast({
        title: "Validation Error",
        description: "Please enter a zip code and radius",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // For demo purposes, we'll use mock data
    // In a real app, you would call an API like zipcodeapi.com or similar
    setTimeout(() => {
      const mockCities: City[] = [
        { city: 'New York', state: 'NY', distance: 15, selected: false },
        { city: 'Brooklyn', state: 'NY', distance: 20, selected: false },
        { city: 'Queens', state: 'NY', distance: 25, selected: false },
        { city: 'Newark', state: 'NJ', distance: 30, selected: false },
        { city: 'Jersey City', state: 'NJ', distance: 35, selected: false },
        { city: 'Yonkers', state: 'NY', distance: 40, selected: false },
      ];
      
      setCities(mockCities);
      setIsLoading(false);
      toast({
        title: "Search Complete",
        description: `Found ${mockCities.length} cities within ${radius} miles`
      });
    }, 1500);
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    if (keywords.includes(newKeyword.trim())) {
      toast({
        title: "Duplicate Keyword",
        description: "This keyword already exists",
        variant: "destructive"
      });
      return;
    }
    
    setKeywords([...keywords, newKeyword.trim()]);
    setNewKeyword('');
  };

  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = [...keywords];
    updatedKeywords.splice(index, 1);
    setKeywords(updatedKeywords);
  };

  const toggleCitySelection = (index: number) => {
    const updatedCities = [...cities];
    updatedCities[index].selected = !updatedCities[index].selected;
    setCities(updatedCities);
  };

  const generatePreview = () => {
    const selectedCities = cities.filter(city => city.selected);
    
    if (selectedCities.length === 0) {
      toast({
        title: "No Cities Selected",
        description: "Please select at least one city",
        variant: "destructive"
      });
      return;
    }
    
    if (keywords.length === 0) {
      toast({
        title: "No Keywords",
        description: "Please add at least one keyword",
        variant: "destructive"
      });
      return;
    }
    
    const locations: LocationData[] = [];
    
    selectedCities.forEach(city => {
      keywords.forEach(keyword => {
        locations.push({
          id: uuidv4(),
          city_name: city.city,
          region_name: city.state,
          keyword
        });
      });
    });
    
    setPreviewLocations(locations);
    setExpanded(true);
  };

  const handleSaveAll = () => {
    if (previewLocations.length === 0) {
      toast({
        title: "No Locations",
        description: "Please generate locations first",
        variant: "destructive"
      });
      return;
    }
    
    bulkSaveLocations(previewLocations);
    toast({
      title: "Locations Saved",
      description: `Saved ${previewLocations.length} location pages successfully`
    });
    
    // Pass the generated locations up to the parent component
    onGenerate(previewLocations);
    
    // Reset the form
    setCities([]);
    setPreviewLocations([]);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Bulk Location Generator</CardTitle>
        <CardDescription>Search for cities by zip code and radius, then generate location pages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zip Code Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="zipCode">Zip Code</label>
            <Input
              id="zipCode"
              placeholder="e.g., 10001"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="radius">Search Radius (miles)</label>
            <Input
              id="radius"
              placeholder="e.g., 50"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={searchCities} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search Cities"}
            </Button>
          </div>
        </div>

        {/* Keywords Management */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium">Keywords</h3>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
            <Button onClick={handleAddKeyword} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <div key={index} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                {keyword}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 hover:bg-gray-200 rounded-full"
                  onClick={() => handleRemoveKeyword(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Cities Table */}
        {cities.length > 0 && (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities.map((city, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox 
                        checked={city.selected}
                        onCheckedChange={() => toggleCitySelection(index)}
                      />
                    </TableCell>
                    <TableCell>{city.city}</TableCell>
                    <TableCell>{city.state}</TableCell>
                    <TableCell className="text-right">{city.distance} mi</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Generate Button */}
        {cities.length > 0 && (
          <div className="flex justify-end">
            <Button onClick={generatePreview}>
              {previewLocations.length > 0 ? "Regenerate Preview" : "Generate Preview"}
            </Button>
          </div>
        )}

        {/* Preview Section */}
        {previewLocations.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <h3 className="text-lg font-medium">Preview ({previewLocations.length} pages)</h3>
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            
            {expanded && (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Keyword</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewLocations.map((location, index) => (
                      <TableRow key={index}>
                        <TableCell>{location.city_name}</TableCell>
                        <TableCell>{location.region_name}</TableCell>
                        <TableCell>{location.keyword}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {previewLocations.length > 0 && (
        <CardFooter>
          <Button onClick={handleSaveAll} className="w-full">
            Save All Location Pages ({previewLocations.length})
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LocationSearchForm;
