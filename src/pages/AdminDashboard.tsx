
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { saveLocation, getLocations, deleteLocation, LocationData } from '@/utils/locationUtils';
import { Trash2, MapPin, Eye } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [cityName, setCityName] = useState('');
  const [regionName, setRegionName] = useState('');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('fdr_admin_auth') === 'true';
    if (!isAuth) {
      navigate('/admin');
      return;
    }
    
    // Load saved locations
    setLocations(getLocations());
  }, [navigate]);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityName.trim() === '' || regionName.trim() === '') {
      toast({
        title: "Validation Error",
        description: "City and region name are required",
        variant: "destructive",
      });
      return;
    }

    const newLocation: LocationData = {
      id: uuidv4(),
      city_name: cityName.trim(),
      region_name: regionName.trim()
    };

    saveLocation(newLocation);
    setLocations(getLocations());
    setCityName('');
    setRegionName('');

    toast({
      title: "Location Added",
      description: `Added ${cityName}, ${regionName} successfully`,
    });
  };

  const handleDeleteLocation = (id: string) => {
    deleteLocation(id);
    setLocations(getLocations());
    toast({
      title: "Location Deleted",
      description: "Location was removed successfully",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('fdr_admin_auth');
    navigate('/admin');
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
        <h2 className="text-2xl font-bold mb-6">Location Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Location Form */}
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
                    placeholder="e.g. Miami"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="regionName">Region Name</label>
                  <Input 
                    id="regionName"
                    placeholder="e.g. Florida"
                    value={regionName}
                    onChange={(e) => setRegionName(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Add Location
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Location List */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Existing Locations</CardTitle>
              <CardDescription>Manage your location pages</CardDescription>
            </CardHeader>
            <CardContent>
              {locations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p>No locations created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {locations.map(location => (
                    <div 
                      key={location.id} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{location.city_name}, {location.region_name}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/locations/${location.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
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

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                Use this admin panel to create location-specific pages for Face Down Recovery Equipment.
                Each page will use the same template but with customized city and region names.
                These pages will be available at /locations/[id] and can be accessed from the list above.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
