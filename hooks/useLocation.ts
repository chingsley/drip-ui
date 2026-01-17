import { useState, useEffect } from 'react';
import { LocationCoordinates } from '@/types/weather';
import { LocationService } from '@/services/location/locationService';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const requestPermission = async () => {
    try {
      const granted = await LocationService.requestPermissions();
      console.log('1... ', { granted });
      setPermissionGranted(granted);
      return granted;
    } catch (err) {
      setError('Failed to request location permission');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await LocationService.getCurrentLocationWithName();
      console.log('2... ', { result });
      if (result) {
        setLocation(result.coordinates);
        setLocationName(result.name);
      } else {
        setError('Failed to get current location');
      }
    } catch (err) {
      setError('Error getting location');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check permission on mount
    LocationService.hasPermissions().then(setPermissionGranted);
  }, []);

  return {
    location,
    locationName,
    loading,
    error,
    permissionGranted,
    requestPermission,
    getCurrentLocation,
  };
};

