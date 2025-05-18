
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

// Bulk save locations
export const bulkSaveLocations = (locationsList: LocationData[]): void => {
  const existingLocations = getLocations();
  const mergedLocations = [...existingLocations, ...locationsList];
  localStorage.setItem('fdr_locations', JSON.stringify(mergedLocations));
};

// Get counts of location pages
export const getLocationCounts = (): { total: number, cities: number, keywords: number } => {
  const locations = getLocations();
  const uniqueCities = new Set(locations.map(loc => `${loc.city_name}-${loc.region_name}`));
  const uniqueKeywords = new Set(locations.filter(loc => loc.keyword).map(loc => loc.keyword));
  
  return {
    total: locations.length,
    cities: uniqueCities.size,
    keywords: uniqueKeywords.size
  };
};

// Get unique keywords
export const getUniqueKeywords = (): string[] => {
  const locations = getLocations();
  const keywordsSet = new Set<string>();
  
  locations.forEach(location => {
    if (location.keyword) {
      keywordsSet.add(location.keyword);
    }
  });
  
  return Array.from(keywordsSet);
};

// Generate a preview of locations
export const generateLocationPreviews = (cities: {city_name: string, region_name: string}[], keywords: string[]): LocationData[] => {
  const previews: LocationData[] = [];
  
  cities.forEach(city => {
    keywords.forEach(keyword => {
      previews.push({
        id: `preview-${city.city_name}-${keyword.replace(/\s+/g, '-')}`,
        city_name: city.city_name,
        region_name: city.region_name,
        keyword: keyword
      });
    });
  });
  
  return previews;
};
