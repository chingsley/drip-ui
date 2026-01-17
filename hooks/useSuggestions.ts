import { useState, useEffect } from 'react';
import { OutfitSuggestion } from '@/types/clothing';
import { WeatherData } from '@/types/weather';
import { UserPreferences } from '@/types/preferences';
import { SuggestionEngine } from '@/services/suggestions/suggestionEngine';

export const useSuggestions = (
  weather: WeatherData | null,
  preferences: UserPreferences = {},
  count: number = 10
) => {
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = () => {
    if (!weather) {
      setError('Weather data is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newSuggestions = SuggestionEngine.generateSuggestions(
        weather,
        preferences,
        count
      );

      if (newSuggestions.length === 0) {
        setError('No suggestions available for current conditions');
      }

      setSuggestions(newSuggestions);
    } catch (err) {
      setError('Failed to generate suggestions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshSuggestions = () => {
    if (!weather) {
      setError('Weather data is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newSuggestions = SuggestionEngine.refreshSuggestions(
        weather,
        preferences,
        count
      );

      setSuggestions(newSuggestions);
    } catch (err) {
      setError('Failed to refresh suggestions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFavoriteStatus = (outfitId: string, isFavorite: boolean) => {
    setSuggestions(prevSuggestions =>
      prevSuggestions.map(suggestion =>
        suggestion.id === outfitId
          ? { ...suggestion, isFavorite }
          : suggestion
      )
    );
  };

  useEffect(() => {
    if (weather) {
      generateSuggestions();
    }
  }, [weather, JSON.stringify(preferences)]);

  return {
    suggestions,
    loading,
    error,
    refreshSuggestions,
    updateFavoriteStatus,
  };
};

