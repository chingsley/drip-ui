import { useState, useEffect } from 'react';
import { LocationType } from '@/types/location';
import { LocationService } from '@/services/location/locationService';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean>(false);

  const requestLocationPermission = async () => {
    try {
      const granted = await LocationService.requestLocationPermission();
      console.log('1... ', { granted });
      setLocationPermissionGranted(granted);
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
        setLocation(result);
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
    LocationService.hasPermissions().then(setLocationPermissionGranted);
  }, []);

  return {
    location,
    loading,
    error,
    locationPermissionGranted,
    requestLocationPermission,
    getCurrentLocation,
  };
};

