import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData, WeatherCondition, LocationCoordinates, WeatherApiResponse } from '@/types/weather';

const CACHE_KEY = 'weather_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
}

export class WeatherService {
  private static apiKey: string = '';
  private static baseUrl: string = 'https://api.weatherapi.com/v1';

  /**
   * Set the API key for WeatherAPI.com
   * @param key The API key
   */
  static setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Map WeatherAPI condition text to our WeatherCondition type
   * @param conditionText The condition text from WeatherAPI
   * @returns WeatherCondition
   */
  private static mapCondition(conditionText: string): WeatherCondition {
    const text = conditionText.toLowerCase();

    if (text.includes('sunny') || text.includes('clear')) {
      return 'sunny';
    } else if (text.includes('rain') || text.includes('drizzle')) {
      return 'rainy';
    } else if (text.includes('snow') || text.includes('sleet') || text.includes('ice')) {
      return 'snowy';
    } else if (text.includes('wind')) {
      return 'windy';
    } else if (text.includes('cloudy') || text.includes('overcast')) {
      return 'cloudy';
    } else if (text.includes('partly')) {
      return 'partly-cloudy';
    }

    return 'clear';
  }

  /**
   * Get weather data from cache if available and not expired
   * @param cacheKey Unique cache key for the location
   * @returns Cached weather data or null
   */
  private static async getFromCache(cacheKey: string): Promise<WeatherData | null> {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_KEY}_${cacheKey}`);
      if (!cached) {
        return null;
      }

      const { data, timestamp }: CachedWeather = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }

      // Cache expired, remove it
      await AsyncStorage.removeItem(`${CACHE_KEY}_${cacheKey}`);
      return null;
    } catch (error) {
      console.error('Error reading from weather cache:', error);
      return null;
    }
  }

  /**
   * Save weather data to cache
   * @param cacheKey Unique cache key for the location
   * @param data Weather data to cache
   */
  private static async saveToCache(cacheKey: string, data: WeatherData): Promise<void> {
    try {
      const cached: CachedWeather = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(`${CACHE_KEY}_${cacheKey}`, JSON.stringify(cached));
    } catch (error) {
      console.error('Error saving to weather cache:', error);
    }
  }

  /**
   * Fetch weather data from WeatherAPI.com
   * @param coords Location coordinates
   * @returns Weather data or null if failed
   */
  static async getWeatherByCoordinates(coords: LocationCoordinates): Promise<WeatherData | null> {
    const cacheKey = `${coords.latitude.toFixed(2)}_${coords.longitude.toFixed(2)}`;

    // Try to get from cache first
    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from API
    try {
      if (!this.apiKey) {
        throw new Error('Weather API key not set');
      }

      const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${coords.latitude},${coords.longitude}&aqi=no`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherApiResponse = await response.json();

      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        condition: this.mapCondition(data.current.condition.text),
        location: data.location.name,
        timestamp: Date.now(),
        feelsLike: data.current.feelslike_c,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
      };

      // Save to cache
      await this.saveToCache(cacheKey, weatherData);

      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  /**
   * Fetch weather data by location name
   * @param location Location name (city, region, etc.)
   * @returns Weather data or null if failed
   */
  static async getWeatherByLocation(location: string): Promise<WeatherData | null> {
    const cacheKey = location.toLowerCase().replace(/\s+/g, '_');

    // Try to get from cache first
    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from API
    try {
      if (!this.apiKey) {
        throw new Error('Weather API key not set');
      }

      const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${encodeURIComponent(location)}&aqi=no`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherApiResponse = await response.json();

      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        condition: this.mapCondition(data.current.condition.text),
        location: data.location.name,
        timestamp: Date.now(),
        feelsLike: data.current.feelslike_c,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
      };

      // Save to cache
      await this.saveToCache(cacheKey, weatherData);

      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  /**
   * Clear all weather cache
   */
  static async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const weatherKeys = keys.filter(key => key.startsWith(CACHE_KEY));
      await AsyncStorage.multiRemove(weatherKeys);
    } catch (error) {
      console.error('Error clearing weather cache:', error);
    }
  }
}

