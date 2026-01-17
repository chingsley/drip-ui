import { PreferencesService } from '@/services/preferences/preferencesService';
import { UserPreferences } from '@/types/preferences';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('PreferencesService', () => {
  const mockPreferences: UserPreferences = {
    dressStyle: 'unisex',
    culture: 'western',
    dressCode: 'casual',
    preferredColors: ['black', 'white'],
    materials: ['cotton', 'denim'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Local Storage Operations', () => {
    describe('savePreferencesLocally', () => {
      it('should save preferences to AsyncStorage', async () => {
        await PreferencesService.savePreferencesLocally(mockPreferences);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'user_preferences',
          JSON.stringify(mockPreferences)
        );
      });
    });

    describe('getPreferencesLocally', () => {
      it('should retrieve preferences from AsyncStorage', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify(mockPreferences)
        );

        const preferences = await PreferencesService.getPreferencesLocally();

        expect(preferences).toEqual(mockPreferences);
      });

      it('should return empty object if no preferences exist', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

        const preferences = await PreferencesService.getPreferencesLocally();

        expect(preferences).toEqual({});
      });
    });
  });

  describe('Favorites Operations', () => {
    describe('addFavorite', () => {
      it('should add outfit to favorites', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify(['outfit1'])
        );

        await PreferencesService.addFavorite('outfit2');

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'user_favorites',
          JSON.stringify(['outfit1', 'outfit2'])
        );
      });

      it('should not duplicate favorites', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify(['outfit1'])
        );

        await PreferencesService.addFavorite('outfit1');

        expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      });
    });

    describe('removeFavorite', () => {
      it('should remove outfit from favorites', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify(['outfit1', 'outfit2'])
        );

        await PreferencesService.removeFavorite('outfit1');

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'user_favorites',
          JSON.stringify(['outfit2'])
        );
      });
    });

    describe('getFavorites', () => {
      it('should retrieve all favorites', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify(['outfit1', 'outfit2'])
        );

        const favorites = await PreferencesService.getFavorites();

        expect(favorites).toEqual(['outfit1', 'outfit2']);
      });

      it('should return empty array if no favorites exist', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

        const favorites = await PreferencesService.getFavorites();

        expect(favorites).toEqual([]);
      });
    });

    describe('isFavorite', () => {
      it('should return true if outfit is favorited', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify(['outfit1', 'outfit2'])
        );

        const result = await PreferencesService.isFavorite('outfit1');

        expect(result).toBe(true);
      });

      it('should return false if outfit is not favorited', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify(['outfit1'])
        );

        const result = await PreferencesService.isFavorite('outfit2');

        expect(result).toBe(false);
      });
    });
  });

  describe('clearAllLocal', () => {
    it('should clear all local preferences and favorites', async () => {
      await PreferencesService.clearAllLocal();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        'user_preferences',
        'user_favorites',
      ]);
    });
  });
});

