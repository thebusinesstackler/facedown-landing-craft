
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
import { Trash2, MapPin, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import PagePreview from '@/components/PagePreview';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';
import CustomersSection from '@/components/CustomersSection';

const AdminDashboard: React.FC = () => {
  const [cityName, setCityName] = useState('');
  const [regionName, setRegionName] = useState('');
  const [keyword, setKeyword] = useState('Face-Down Recovery Equipment Rentals');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [locationStats, setLocationStats] = useState({ total: 0, cities: 0, keywords: 0 });
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('customers');
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

  const previewLocation = (location: LocationData) => {
    setSelectedLocation(location);
    setShowPreview(true);
    setCurrentPreviewIndex(0);
  };

  const nextPreview = () => {
    setCurrentPreviewIndex(prev => (prev + 1) % 5);
  };

  const prevPreview = () => {
    setCurrentPreviewIndex(prev => (prev - 1 + 5) % 5);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedLocation(null);
  };

  const renderLocationsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Location Manager</h2>
          <div className="text-sm text-gray-500">
            {locationStats.total} Pages • {locationStats.cities} Cities • {locationStats.keywords} Keywords
          </div>
        </div>
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
                        onClick={() => previewLocation(location)}
                        title="Preview Page"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteLocation(location.id)}
                        title="Delete Location"
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
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
        />
        
        <SidebarInset className="flex-1">
          <header className="bg-medical-dark text-white p-4">
            <div className="container mx-auto">
              <h1 className="text-xl font-bold">Face Down Recovery Admin Dashboard</h1>
            </div>
          </header>

          <div className="container mx-auto py-8 px-4">
            {/* Preview Modal */}
            {showPreview && selectedLocation && (
              <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
                <div className="w-full h-full flex flex-col">
                  <div className="p-4 bg-medical-dark text-white flex items-center justify-between">
                    <h3 className="text-xl font-semibold">
                      Preview: {selectedLocation.city_name}, {selectedLocation.region_name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={prevPreview}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent border-white text-white hover:bg-white/10"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous Page
                      </Button>
                      
                      <div className="text-sm text-white px-4">
                        Page {currentPreviewIndex + 1} of 5
                      </div>
                      
                      <Button
                        onClick={nextPreview}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent border-white text-white hover:bg-white/10"
                      >
                        Next Page
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={closePreview} 
                        className="text-white hover:text-white hover:bg-medical-dark/50 ml-4"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <PagePreview 
                      location={selectedLocation}
                      pageIndex={currentPreviewIndex}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            {activeSection === 'customers' && <CustomersSection />}
            {activeSection === 'locations' && renderLocationsSection()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
