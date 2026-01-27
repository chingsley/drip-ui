// Static weather data for initial implementation (TODO: delete after integrating weather API)

const weatherData = [
  {
    day: 'Today' as const,
    temperature: 15,
    feelsLike: 10,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy',
  },
  {
    day: 'Tomorrow' as const,
    temperature: 12,
    feelsLike: 8,
    condition: 'Cloudy',
    icon: 'cloudy',
  },
  {
    day: 'Tomorrow' as const,
    temperature: 12,
    feelsLike: 8,
    condition: 'Sunny',
    icon: 'cloudy',
  },
];

export default weatherData;