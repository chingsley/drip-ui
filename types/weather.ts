export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'clear' | 'partly-cloudy';

export interface WeatherData {
  temperature: number; // Celsius
  condition: WeatherCondition;
  location: string;
  timestamp: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    condition: {
      text: string;
      code: number;
    };
    humidity: number;
    wind_kph: number;
  };
}

