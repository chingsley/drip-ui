import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SuggestionsScreen from '@/app/suggestions';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock react-native-gesture-handler components
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'View',
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock the hooks
jest.mock('@/hooks/useLocation', () => ({
  useLocation: () => ({
    location: { latitude: 44.65, longitude: -63.58 },
    locationName: 'Halifax',
    loading: false,
    error: null,
    permissionGranted: true,
    requestPermission: jest.fn(),
    getCurrentLocation: jest.fn(),
  }),
}));

jest.mock('@/hooks/useWeather', () => ({
  useWeather: () => ({
    weather: {
      temperature: 15,
      condition: 'Partly Cloudy',
      feelsLike: 10,
    },
    loading: false,
    error: null,
    fetchWeatherByCoordinates: jest.fn(),
  }),
}));

jest.mock('@/hooks/usePreferences', () => ({
  usePreferences: () => ({
    preferences: {},
    favorites: [],
    toggleFavorite: jest.fn(),
    isFavorite: jest.fn(() => false),
  }),
}));

jest.mock('@/hooks/useSuggestions', () => ({
  useSuggestions: () => ({
    suggestions: [],
    loading: false,
    error: null,
    refreshSuggestions: jest.fn(),
    updateFavoriteStatus: jest.fn(),
  }),
}));

// Mock SwipeableStack component
jest.mock('@/components/suggestions/SwipeableStack', () => ({
  SwipeableStack: 'SwipeableStack',
}));

describe('SuggestionsScreen - Task 1: Page Layout Structure', () => {
  it('should render all four main sections with light gray outlines', async () => {
    const { getByTestId } = render(<SuggestionsScreen />);

    await waitFor(() => {
      // Header section
      const headerSection = getByTestId('header-section');
      expect(headerSection).toBeTruthy();

      // Weather card section
      const weatherCardSection = getByTestId('weather-card-section');
      expect(weatherCardSection).toBeTruthy();

      // Dress suggestion section
      const dressSuggestionSection = getByTestId('dress-suggestion-section');
      expect(dressSuggestionSection).toBeTruthy();

      // Tabs section
      const tabsSection = getByTestId('tabs-section');
      expect(tabsSection).toBeTruthy();
    });
  });

  it('should have header section at the top', async () => {
    const { getByTestId } = render(<SuggestionsScreen />);

    const headerSection = await waitFor(() => getByTestId('header-section'));

    expect(headerSection).toBeTruthy();
    // Check that header section has appropriate styling/positioning
    const headerStyles = headerSection.props.style;
    expect(headerStyles).toBeTruthy();
  });

  it('should have weather card section below header', async () => {
    const { getByTestId } = render(<SuggestionsScreen />);

    const weatherCardSection = await waitFor(() => getByTestId('weather-card-section'));

    expect(weatherCardSection).toBeTruthy();
  });

  it('should have dress suggestion section as main content area', async () => {
    const { getByTestId } = render(<SuggestionsScreen />);

    const dressSuggestionSection = await waitFor(() => getByTestId('dress-suggestion-section'));

    expect(dressSuggestionSection).toBeTruthy();
  });

  it('should have tabs section at the bottom', async () => {
    const { getByTestId } = render(<SuggestionsScreen />);

    const tabsSection = await waitFor(() => getByTestId('tabs-section'));

    expect(tabsSection).toBeTruthy();
  });

  it('should have light gray outline borders on all sections', async () => {
    const { getByTestId } = render(<SuggestionsScreen />);

    await waitFor(async () => {
      const sections = [
        getByTestId('header-section'),
        getByTestId('weather-card-section'),
        getByTestId('dress-suggestion-section'),
        getByTestId('tabs-section'),
      ];

      sections.forEach((section) => {
        expect(section).toBeTruthy();
        const styles = Array.isArray(section.props.style)
          ? section.props.style
          : [section.props.style];

        // Check for border color or border style that indicates outline
        const hasOutline = styles.some((style: any) => {
          if (!style) return false;
          return (
            style.borderColor === '#D3D3D3' || // Light gray
            style.borderColor === '#CCCCCC' ||
            style.borderWidth === 1 ||
            style.borderWidth === 2
          );
        });

        expect(hasOutline).toBe(true);
      });
    });
  });
});

describe('SuggestionsScreen - Task 2: Header Content', () => {
  it('should render location icon and "Halifax" text on the left side', async () => {
    const { getByTestId, getByText } = render(<SuggestionsScreen />);

    await waitFor(() => {
      const headerSection = getByTestId('header-section');
      expect(headerSection).toBeTruthy();

      // Check for "Halifax" text
      const halifaxText = getByText('Halifax');
      expect(halifaxText).toBeTruthy();

      // Check for location icon container
      const locationContainer = getByTestId('header-left');
      expect(locationContainer).toBeTruthy();
    });
  });

  it('should render "My Outfits" text and outfit icon on the right side', async () => {
    const { getByTestId, getByText } = render(<SuggestionsScreen />);

    await waitFor(() => {
      const headerSection = getByTestId('header-section');
      expect(headerSection).toBeTruthy();

      // Check for "My Outfits" text
      const myOutfitsText = getByText('My Outfits');
      expect(myOutfitsText).toBeTruthy();

      // Check for right side container
      const headerRight = getByTestId('header-right');
      expect(headerRight).toBeTruthy();
    });
  });

  it('should have proper flexbox layout with space-between alignment', async () => {
    const { getByTestId } = render(<SuggestionsScreen />);

    await waitFor(() => {
      const headerSection = getByTestId('header-section');
      const headerContent = getByTestId('header-content');

      expect(headerContent).toBeTruthy();

      // Check header content has flexDirection row and justifyContent space-between
      const styles = Array.isArray(headerContent.props.style)
        ? headerContent.props.style
        : [headerContent.props.style];

      const hasFlexRow = styles.some((style: any) =>
        style && style.flexDirection === 'row'
      );
      const hasSpaceBetween = styles.some((style: any) =>
        style && style.justifyContent === 'space-between'
      );

      expect(hasFlexRow).toBe(true);
      expect(hasSpaceBetween).toBe(true);
    });
  });

  it('should have location icon and text in left container', async () => {
    const { getByTestId } = render(<SuggestionsScreen />);

    await waitFor(() => {
      const leftContainer = getByTestId('header-left');
      expect(leftContainer).toBeTruthy();

      // Check that it contains both icon and text elements
      const locationIcon = getByTestId('location-icon');
      expect(locationIcon).toBeTruthy();
    });
  });

  it('should have outfit icon in right container', async () => {
    const { getByTestId } = render(<SuggestionsScreen />);

    await waitFor(() => {
      const rightContainer = getByTestId('header-right');
      expect(rightContainer).toBeTruthy();

      // Check that it contains the outfit icon
      const outfitIcon = getByTestId('outfit-icon');
      expect(outfitIcon).toBeTruthy();
    });
  });

  it('should align items center in header content', async () => {
    const { getByTestId } = render(<SuggestionsScreen />);

    await waitFor(() => {
      const headerContent = getByTestId('header-content');
      const styles = Array.isArray(headerContent.props.style)
        ? headerContent.props.style
        : [headerContent.props.style];

      const hasAlignCenter = styles.some((style: any) =>
        style && style.alignItems === 'center'
      );

      expect(hasAlignCenter).toBe(true);
    });
  });
});

