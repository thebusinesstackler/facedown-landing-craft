
export interface LocationData {
  id: string;
  city_name: string;
  region_name: string;
  keyword?: string;
}

// Save locations to localStorage
export const saveLocation = (location: LocationData): void => {
  const locations = getLocations();
  locations.push(location);
  localStorage.setItem('fdr_locations', JSON.stringify(locations));
};

// Get all saved locations
export const getLocations = (): LocationData[] => {
  const locationsJson = localStorage.getItem('fdr_locations');
  return locationsJson ? JSON.parse(locationsJson) : [];
};

// Get a specific location by ID
export const getLocationById = (id: string): LocationData | undefined => {
  const locations = getLocations();
  return locations.find(location => location.id === id);
};

// Delete a location by ID
export const deleteLocation = (id: string): void => {
  const locations = getLocations();
  const updatedLocations = locations.filter(location => location.id !== id);
  localStorage.setItem('fdr_locations', JSON.stringify(updatedLocations));
};
