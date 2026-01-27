import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/constants/colors';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import { usePreferences } from '@/hooks/usePreferences';
import { useSuggestions } from '@/hooks/useSuggestions';
import { SwipeableStack } from '@/components/suggestions/SwipeableStack';

export default function SuggestionsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Hooks
  const {
    location,
    locationName,
    loading: locationLoading,
    error: locationError,
    locationPermissionGranted,
    requestLocationPermission,
    getCurrentLocation,
  } = useLocation();

  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    fetchWeatherByCoordinates,
  } = useWeather();

  const {
    preferences,
    toggleFavorite,
    isFavorite,
  } = usePreferences();

  const {
    suggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
    refreshSuggestions,
    updateFavoriteStatus,
  } = useSuggestions(weather, preferences);

  const initializeApp = useCallback(async () => {
    try {
      // Check/request location permission
      if (!locationPermissionGranted) {
        const granted = await requestLocationPermission();
        if (!granted) {
          Alert.alert(
            'Location Permission Required',
            'This app needs your location to suggest outfits based on your local weather.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Grant Permission', onPress: requestLocationPermission },
            ]
          );
          return;
        }
      }

      // Get current location
      await getCurrentLocation();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      Alert.alert('Error', 'Failed to initialize app. Please try again.');
    } finally {
      setInitializing(false);
    }
  }, [locationPermissionGranted, requestLocationPermission, getCurrentLocation]);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Fetch weather when location changes
  console.log('3. location: ', location);
  useEffect(() => {
    if (location) {
      fetchWeatherByCoordinates(location);
    }
  }, [location, fetchWeatherByCoordinates]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await getCurrentLocation();
      if (weather) {
        refreshSuggestions();
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFavoriteToggle = async (outfitId: string) => {
    try {
      await toggleFavorite(outfitId);
      const newStatus = isFavorite(outfitId);
      updateFavoriteStatus(outfitId, newStatus);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleSwipeLeft = () => {
    // User passed on this outfit
    console.log('Swiped left (pass)');
  };

  const handleSwipeRight = () => {
    // User liked this outfit
    console.log('Swiped right (like)');
  };

  const handleEmpty = () => {
    Alert.alert(
      'No More Suggestions',
      'Would you like to refresh for more outfit ideas?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => refreshSuggestions() },
      ]
    );
  };

  // Loading state
  if (initializing || locationLoading || (weatherLoading && !weather)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  // Error states
  if (locationError) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="location-outline" size={64} color="#E74C3C" />
        <Text style={styles.errorText}>Location Error</Text>
        <Text style={styles.errorSubtext}>{locationError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getCurrentLocation}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (weatherError) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cloud-offline-outline" size={64} color="#E74C3C" />
        <Text style={styles.errorText}>Weather Error</Text>
        <Text style={styles.errorSubtext}>{weatherError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => location && fetchWeatherByCoordinates(location)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (suggestionsError) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="shirt-outline" size={64} color="#E74C3C" />
        <Text style={styles.errorText}>No Suggestions Available</Text>
        <Text style={styles.errorSubtext}>{suggestionsError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshSuggestions}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Drip</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={colors.PRIMARY} />
              <Text style={styles.locationText}>{locationName || 'Unknown'}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="settings-outline" size={24} color={colors.BLACK} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weather Info */}
        {weather && (
          <View style={styles.weatherCard}>
            <View style={styles.weatherInfo}>
              <Ionicons name="thermometer-outline" size={32} color={colors.PRIMARY} />
              <Text style={styles.temperatureText}>{Math.round(weather.temperature)}°C</Text>
            </View>
            <Text style={styles.weatherCondition}>{weather.condition}</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => refreshSuggestions()}
            >
              <Ionicons name="refresh-outline" size={20} color={colors.PRIMARY} />
              <Text style={styles.refreshButtonText}>New Suggestions</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Suggestions */}
        {suggestionsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.PRIMARY} />
            <Text style={styles.loadingText}>Generating outfit suggestions...</Text>
          </View>
        ) : suggestions.length > 0 ? (
          <View style={styles.suggestionsContainer}>
            <SwipeableStack
              suggestions={suggestions.map(s => ({
                ...s,
                isFavorite: isFavorite(s.id),
              }))}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onFavoriteToggle={handleFavoriteToggle}
              onEmpty={handleEmpty}
            />
          </View>
        ) : (
          <View style={styles.noSuggestionsContainer}>
            <Ionicons name="shirt-outline" size={64} color="#CCC" />
            <Text style={styles.noSuggestionsText}>No suggestions available</Text>
            <Text style={styles.noSuggestionsSubtext}>
              Try adjusting your preferences or check back later
            </Text>
          </View>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.WHITE,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.BLACK,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  weatherCard: {
    backgroundColor: colors.WHITE,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.BLACK,
  },
  weatherCondition: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  refreshButtonText: {
    fontSize: 14,
    color: colors.PRIMARY,
    fontWeight: '600',
  },
  suggestionsContainer: {
    flex: 1,
    minHeight: 600,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  noSuggestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noSuggestionsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  noSuggestionsSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

