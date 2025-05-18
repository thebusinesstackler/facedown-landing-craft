
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  saveLocation, 
  getLocations, 
  deleteLocation, 
  LocationData,
  getLocationCounts 
} from '@/utils/locationUtils';
import { Trash2, MapPin, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import LocationSearchForm from '@/components/LocationSearchForm';

const AdminDashboard: React.FC = () => {
  const [cityName, setCityName] = useState('');
  const [regionName, setRegionName] = useState('');
  const [keyword, setKeyword] = useState('Face-Down Recovery Equipment Rentals');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [expandedBulk, setExpandedBulk] = useState(false);
  const [locationStats, setLocationStats] = useState({ total: 0, cities: 0, keywords: 0 });
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('fdr_admin_auth') === 'true';
    if (!isAuth) {
      navigate('/admin');
      return;
    }

    // Load saved locations
    loadLocations();
  }, [navigate]);

  const loadLocations = () => {
    setLocations(getLocations());
    setLocationStats(getLocationCounts());
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityName.trim() === '' || regionName.trim() === '') {
      toast({
        title: "Validation Error",
        description: "City and region name are required",
        variant: "destructive"
      });
      return;
    }

    const newLocation = {
      id: uuidv4(),
      city_name: cityName.trim(),
      region_name: regionName.trim(),
      keyword: keyword.trim()
    };

    saveLocation(newLocation);
    loadLocations();
    setCityName('');
    setRegionName('');
    toast({
      title: "Location Added",
      description: `Added ${cityName}, ${regionName} successfully`
    });
  };

  const handleDeleteLocation = (id: string) => {
    deleteLocation(id);
    loadLocations();
    toast({
      title: "Location Deleted",
      description: "Location was removed successfully"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('fdr_admin_auth');
    navigate('/admin');
  };

  const viewLocationPage = (id: string) => {
    navigate(`/locations/${id}`);
  };

  const handleLocationGenerated = (newLocations: LocationData[]) => {
    loadLocations();
    setExpandedBulk(false);
  };

  const previewLocation = (location: LocationData) => {
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-medical-dark text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Face Down Recovery Admin</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg p-4 mb-6 shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Location Manager Dashboard</h2>
            <div className="text-sm text-gray-500">
              {locationStats.total} Pages • {locationStats.cities} Cities • {locationStats.keywords} Keywords
            </div>
          </div>
        </div>

        {/* Bulk Location Generator (expandable) */}
        <div className="mb-6">
          <div 
            className="bg-blue-50 rounded-lg p-4 shadow flex justify-between items-center cursor-pointer"
            onClick={() => setExpandedBulk(!expandedBulk)}
          >
            <div>
              <h3 className="text-xl font-bold text-blue-700">Bulk Location Generator</h3>
              <p className="text-sm text-gray-600">Search for cities by zip code and radius to generate multiple pages at once.</p>
            </div>
            {expandedBulk ? (
              <ChevronUp className="text-blue-700 h-6 w-6" />
            ) : (
              <ChevronDown className="text-blue-700 h-6 w-6" />
            )}
          </div>
          
          {expandedBulk && (
            <div className="mt-4">
              <LocationSearchForm onGenerate={handleLocationGenerated} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add New Location */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Location</CardTitle>
              <CardDescription>Create a new location-specific page</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddLocation}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cityName">City Name</label>
                  <Input
                    id="cityName"
                    placeholder="e.g., Miami"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="regionName">Region/State</label>
                  <Input
                    id="regionName"
                    placeholder="e.g., Florida"
                    value={regionName}
                    onChange={(e) => setRegionName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="keyword">Primary Keyword</label>
                  <Input
                    id="keyword"
                    placeholder="e.g., Face-Down Recovery Equipment Rentals"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">This keyword will replace the {"{keyword}"} variables throughout the page</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Add Location</Button>
              </CardFooter>
            </form>
          </Card>

          {/* Location List */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Managed Locations</CardTitle>
              <CardDescription>View and manage your location pages</CardDescription>
            </CardHeader>
            <CardContent>
              {locations.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No locations added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {locations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div className="flex items-center space-x-2">
                        <MapPin className="text-medical-blue" />
                        <div>
                          <p className="font-medium">{location.city_name}, {location.region_name}</p>
                          <p className="text-sm text-gray-500">{location.keyword || "No keyword"}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => viewLocationPage(location.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteLocation(location.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Location Preview */}
        {selectedLocation && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Location Preview: {selectedLocation.city_name}, {selectedLocation.region_name}</CardTitle>
                <CardDescription>Keyword: {selectedLocation.keyword}</CardDescription>
              </CardHeader>
              <CardContent>
                <iframe 
                  src={`/locations/${selectedLocation.id}`}
                  className="w-full h-96 border rounded"
                  title={`Preview of ${selectedLocation.city_name}`}
                ></iframe>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedLocation(null)}
                >
                  Close Preview
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
