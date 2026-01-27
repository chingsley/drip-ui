import { LocationService } from '@/services/location/locationService';
import * as Location from 'expo-location';

jest.mock('expo-location');

describe('LocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestLocationPermission', () => {
    it('should return true when permission is granted', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'granted',
      });

      const result = await LocationService.requestLocationPermission();

      expect(result).toBe(true);
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    });

    it('should return false when permission is denied', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'denied',
      });

      const result = await LocationService.requestLocationPermission();

      expect(result).toBe(false);
    });
  });

  describe('hasPermissions', () => {
    it('should return true if permissions are already granted', async () => {
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'granted',
      });

      const result = await LocationService.hasPermissions();

      expect(result).toBe(true);
    });

    it('should return false if permissions are not granted', async () => {
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'denied',
      });

      const result = await LocationService.hasPermissions();

      expect(result).toBe(false);
    });
  });

  describe('getCurrentLocation', () => {
    it('should return coordinates when permission is granted', async () => {
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'granted',
      });

      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValueOnce({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
      });

      const location = await LocationService.getCurrentLocation();

      expect(location).toEqual({
        latitude: 40.7128,
        longitude: -74.0060,
      });
    });

    it('should request permission if not granted', async () => {
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'denied',
      });

      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'granted',
      });

      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValueOnce({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
      });

      const location = await LocationService.getCurrentLocation();

      expect(location).toBeDefined();
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    });

    it('should return null if permission is denied', async () => {
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'denied',
      });

      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'denied',
      });

      const location = await LocationService.getCurrentLocation();

      expect(location).toBeNull();
    });
  });

  describe('getLocationName', () => {
    it('should return city name from reverse geocoding', async () => {
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValueOnce([
        {
          city: 'New York',
          region: 'NY',
          country: 'USA',
        },
      ]);

      const name = await LocationService.getLocationName({
        latitude: 40.7128,
        longitude: -74.0060,
      });

      expect(name).toBe('New York');
    });

    it('should return region if city is not available', async () => {
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValueOnce([
        {
          city: null,
          region: 'NY',
          country: 'USA',
        },
      ]);

      const name = await LocationService.getLocationName({
        latitude: 40.7128,
        longitude: -74.0060,
      });

      expect(name).toBe('NY');
    });

    it('should return null on error', async () => {
      (Location.reverseGeocodeAsync as jest.Mock).mockRejectedValueOnce(
        new Error('Geocoding failed')
      );

      const name = await LocationService.getLocationName({
        latitude: 40.7128,
        longitude: -74.0060,
      });

      expect(name).toBeNull();
    });
  });
});

