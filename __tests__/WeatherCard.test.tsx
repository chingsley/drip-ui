import React from 'react';
import { render } from '@testing-library/react-native';
import { WeatherCard } from '@/components/suggestions/WeatherCard';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('WeatherCard Component - Task 3', () => {
  const defaultProps = {
    day: 'Today' as const,
    temperature: 15,
    feelsLike: 10,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy',
  };

  it('should render WeatherCard component', () => {
    const { getByTestId } = render(<WeatherCard {...defaultProps} />);
    const weatherCard = getByTestId('weather-card');
    expect(weatherCard).toBeTruthy();
  });

  it('should display the day text', () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText('Today')).toBeTruthy();
  });

  it('should display the temperature', () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText('15°C')).toBeTruthy();
  });

  it('should display the feels like temperature', () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText('Feels Like 10°C')).toBeTruthy();
  });

  it('should display the weather condition', () => {
    const { getByText } = render(<WeatherCard {...defaultProps} />);
    expect(getByText('Partly Cloudy')).toBeTruthy();
  });

  it('should render with "Tomorrow" day', () => {
    const { getByText } = render(
      <WeatherCard {...defaultProps} day="Tomorrow" />
    );
    expect(getByText('Tomorrow')).toBeTruthy();
  });

  it('should accept all required props', () => {
    const props = {
      day: 'Tomorrow' as const,
      temperature: 12,
      feelsLike: 8,
      condition: 'Cloudy',
      icon: 'cloudy',
    };

    const { getByText } = render(<WeatherCard {...props} />);
    expect(getByText('Tomorrow')).toBeTruthy();
    expect(getByText('12°C')).toBeTruthy();
    expect(getByText('Feels Like 8°C')).toBeTruthy();
    expect(getByText('Cloudy')).toBeTruthy();
  });

  it('should have proper TypeScript types', () => {
    // This test ensures TypeScript compilation works
    const props: React.ComponentProps<typeof WeatherCard> = {
      day: 'Today',
      temperature: 15,
      feelsLike: 10,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
    };

    expect(props).toBeDefined();
  });

  it('should render with different temperature values', () => {
    const { getByText } = render(
      <WeatherCard {...defaultProps} temperature={25} feelsLike={22} />
    );
    expect(getByText('25°C')).toBeTruthy();
    expect(getByText('Feels Like 22°C')).toBeTruthy();
  });
});

