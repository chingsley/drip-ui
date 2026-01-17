import * as Location from 'expo-location';
import { LocationCoordinates } from '@/types/weather';

export class LocationService {
  /**
   * Requests location permissions from the user
   * @returns true if permission granted, false otherwise
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status, granted } = await Location.requestForegroundPermissionsAsync();
      console.log('Permission response:', { status, granted });
      return granted;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Checks if location permissions have been granted
   * @returns true if permission granted, false otherwise
   */
  static async hasPermissions(): Promise<boolean> {
    try {
      const { granted } = await Location.getForegroundPermissionsAsync();
      return granted;
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return false;
    }
  }

  /**
   * Gets the current location coordinates
   * @returns LocationCoordinates or null if failed
   */
  static async getCurrentLocation(): Promise<LocationCoordinates | null> {
    try {
      // Check if we have permissions
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Gets the location name from coordinates using reverse geocoding
   * @param coords LocationCoordinates
   * @returns Location name string or null if failed
   */
  static async getLocationName(coords: LocationCoordinates): Promise<string | null> {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (result.length > 0) {
        const location = result[0];
        // Return city, region format or best available
        return location.city || location.region || location.country || 'Unknown Location';
      }

      return null;
    } catch (error) {
      console.error('Error getting location name:', error);
      return null;
    }
  }

  /**
   * Complete flow: get current location and its name
   * @returns Object with coordinates and name, or null if failed
   */
  static async getCurrentLocationWithName(): Promise<{
    coordinates: LocationCoordinates;
    name: string;
  } | null> {
    try {
      const coordinates = await this.getCurrentLocation();
      if (!coordinates) {
        return null;
      }

      const name = await this.getLocationName(coordinates);
      return {
        coordinates,
        name: name || 'Unknown Location',
      };
    } catch (error) {
      console.error('Error getting location with name:', error);
      return null;
    }
  }
}

