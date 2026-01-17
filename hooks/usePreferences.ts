import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/preferences';
import { PreferencesService } from '@/services/preferences/preferencesService';

export const usePreferences = (uid?: string | null) => {
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreferences = async () => {
    setLoading(true);
    setError(null);

    try {
      let prefs: UserPreferences;

      if (uid) {
        // Try to load from cloud first if user is authenticated
        prefs = await PreferencesService.getPreferencesFromCloud(uid);

        // If no cloud prefs, fall back to local
        if (Object.keys(prefs).length === 0) {
          prefs = await PreferencesService.getPreferencesLocally();
        }
      } else {
        // Load from local storage
        prefs = await PreferencesService.getPreferencesLocally();
      }

      setPreferences(prefs);

      // Load favorites
      const favs = await PreferencesService.getFavorites();
      setFavorites(favs);
    } catch (err) {
      setError('Failed to load preferences');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    setError(null);

    try {
      await PreferencesService.syncPreferences(uid || null, newPreferences);
      setPreferences(newPreferences);
    } catch (err) {
      setError('Failed to save preferences');
      console.error(err);
    }
  };

  const toggleFavorite = async (outfitId: string) => {
    try {
      const isFav = favorites.includes(outfitId);

      if (isFav) {
        await PreferencesService.removeFavorite(outfitId);
        setFavorites(favorites.filter(id => id !== outfitId));
      } else {
        await PreferencesService.addFavorite(outfitId);
        setFavorites([...favorites, outfitId]);
      }
    } catch (err) {
      setError('Failed to update favorites');
      console.error(err);
    }
  };

  const isFavorite = (outfitId: string): boolean => {
    return favorites.includes(outfitId);
  };

  useEffect(() => {
    loadPreferences();
  }, [uid]);

  return {
    preferences,
    favorites,
    loading,
    error,
    savePreferences,
    toggleFavorite,
    isFavorite,
    reload: loadPreferences,
  };
};

