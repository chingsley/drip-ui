import { useState, useEffect, useCallback } from 'react';
import { WeatherData, LocationCoordinates } from '@/types/weather';
import { WeatherService } from '@/services/weather/weatherService';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
    if (apiKey) {
      WeatherService.setApiKey(apiKey);
    } else {
      console.error('EXPO_PUBLIC_WEATHER_API_KEY is not set! Make sure .env file exists and restart the dev server.');
    }
  }, []);

  const fetchWeatherByCoordinates = useCallback(async (coords: LocationCoordinates) => {
    setLoading(true);
    setError(null);

    try {
      const data = await WeatherService.getWeatherByCoordinates(coords);

      if (data) {
        setWeather(data);
      } else {
        setError('Failed to fetch weather data');
      }
    } catch (err) {
      setError('Error fetching weather');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByLocation = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await WeatherService.getWeatherByLocation(location);

      if (data) {
        setWeather(data);
      } else {
        setError('Failed to fetch weather data');
      }
    } catch (err) {
      setError('Error fetching weather');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCache = async () => {
    await WeatherService.clearCache();
  };

  return {
    weather,
    loading,
    error,
    fetchWeatherByCoordinates,
    fetchWeatherByLocation,
    clearCache,
  };
};
