import { WeatherService } from '@/services/weather/weatherService';
import { LocationCoordinates, WeatherData } from '@/types/weather';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

// Mock fetch
global.fetch = jest.fn();

describe('WeatherService', () => {
  const mockCoords: LocationCoordinates = {
    latitude: 40.7128,
    longitude: -74.0060,
  };

  const mockApiResponse = {
    location: {
      name: 'New York',
      region: 'New York',
      country: 'USA',
    },
    current: {
      temp_c: 22,
      feelslike_c: 21,
      condition: {
        text: 'Partly cloudy',
        code: 1003,
      },
      humidity: 65,
      wind_kph: 15,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    WeatherService.setApiKey('test-api-key');
  });

  describe('getWeatherByCoordinates', () => {
    it('should fetch weather data successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const weather = await WeatherService.getWeatherByCoordinates(mockCoords);

      expect(weather).toBeDefined();
      expect(weather?.temperature).toBe(22);
      expect(weather?.location).toBe('New York');
      expect(weather?.condition).toBe('partly-cloudy');
    });

    it('should return cached data if available', async () => {
      const cachedData: WeatherData = {
        temperature: 20,
        condition: 'sunny',
        location: 'New York',
        timestamp: Date.now(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({
          data: cachedData,
          timestamp: Date.now(),
        })
      );

      const weather = await WeatherService.getWeatherByCoordinates(mockCoords);

      expect(weather).toEqual(cachedData);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const weather = await WeatherService.getWeatherByCoordinates(mockCoords);

      expect(weather).toBeNull();
    });

    it('should throw error if API key is not set', async () => {
      WeatherService.setApiKey('');

      const weather = await WeatherService.getWeatherByCoordinates(mockCoords);

      expect(weather).toBeNull();
    });
  });

  describe('getWeatherByLocation', () => {
    it('should fetch weather by location name', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const weather = await WeatherService.getWeatherByLocation('New York');

      expect(weather).toBeDefined();
      expect(weather?.temperature).toBe(22);
      expect(weather?.location).toBe('New York');
    });
  });

  describe('clearCache', () => {
    it('should clear all weather cache', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce([
        'weather_cache_40_-74',
        'weather_cache_new_york',
        'other_key',
      ]);

      await WeatherService.clearCache();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        'weather_cache_40_-74',
        'weather_cache_new_york',
      ]);
    });
  });
});

