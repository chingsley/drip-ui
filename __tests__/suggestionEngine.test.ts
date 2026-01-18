import { SuggestionEngine } from '@/services/suggestions/suggestionEngine';
import { WeatherData } from '@/types/weather';
import { UserPreferences } from '@/types/preferences';

describe('SuggestionEngine', () => {
  const mockWeather: WeatherData = {
    temperature: 20,
    condition: 'sunny',
    location: 'Test City',
    timestamp: Date.now(),
  };

  const coldWeather: WeatherData = {
    temperature: 5,
    condition: 'snowy',
    location: 'Cold City',
    timestamp: Date.now(),
  };

  const hotWeather: WeatherData = {
    temperature: 35,
    condition: 'sunny',
    location: 'Hot City',
    timestamp: Date.now(),
  };

  describe('generateSuggestions', () => {
    it('should generate suggestions based on weather', () => {
      const suggestions = SuggestionEngine.generateSuggestions(mockWeather, {}, 5);
      
      expect(suggestions).toBeDefined();
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should generate suggestions suitable for cold weather', () => {
      const suggestions = SuggestionEngine.generateSuggestions(coldWeather, {}, 3);
      
      suggestions.forEach(outfit => {
        outfit.items.forEach(item => {
          expect(item.temperatureRange.max).toBeGreaterThanOrEqual(coldWeather.temperature);
          expect(item.temperatureRange.min).toBeLessThanOrEqual(coldWeather.temperature);
        });
      });
    });

    it('should generate suggestions suitable for hot weather', () => {
      const suggestions = SuggestionEngine.generateSuggestions(hotWeather, {}, 3);
      
      suggestions.forEach(outfit => {
        outfit.items.forEach(item => {
          expect(item.temperatureRange.max).toBeGreaterThanOrEqual(hotWeather.temperature);
          expect(item.temperatureRange.min).toBeLessThanOrEqual(hotWeather.temperature);
        });
      });
    });

    it('should respect user dress style preferences', () => {
      const preferences: UserPreferences = {
        dressStyle: 'masculine',
      };

      const suggestions = SuggestionEngine.generateSuggestions(mockWeather, preferences, 5);
      
      suggestions.forEach(outfit => {
        outfit.items.forEach(item => {
          expect(['masculine', 'unisex', 'gender-fluid']).toContain(item.style);
        });
      });
    });

    it('should respect user culture preferences', () => {
      const preferences: UserPreferences = {
        culture: 'western',
      };

      const suggestions = SuggestionEngine.generateSuggestions(mockWeather, preferences, 5);
      
      suggestions.forEach(outfit => {
        outfit.items.forEach(item => {
          expect(item.culture).toBe('western');
        });
      });
    });

    it('should respect dress code preferences', () => {
      const preferences: UserPreferences = {
        dressCode: 'formal',
      };

      const suggestions = SuggestionEngine.generateSuggestions(mockWeather, preferences, 3);
      
      suggestions.forEach(outfit => {
        outfit.items.forEach(item => {
          expect(item.dressCode).toBe('formal');
        });
      });
    });

    it('should generate unique outfit combinations', () => {
      const suggestions = SuggestionEngine.generateSuggestions(mockWeather, {}, 10);
      
      const outfitIds = suggestions.map(s => s.id);
      const uniqueIds = new Set(outfitIds);
      
      expect(uniqueIds.size).toBe(outfitIds.length);
    });

    it('should include outerwear for cold temperatures', () => {
      const suggestions = SuggestionEngine.generateSuggestions(coldWeather, {}, 5);
      
      const hasOuterwear = suggestions.some(outfit =>
        outfit.items.some(item => item.type === 'outerwear')
      );
      
      expect(hasOuterwear).toBe(true);
    });
  });

  describe('refreshSuggestions', () => {
    it('should generate new suggestions on refresh', () => {
      const firstSuggestions = SuggestionEngine.generateSuggestions(mockWeather, {}, 5);
      const refreshedSuggestions = SuggestionEngine.refreshSuggestions(mockWeather, {}, 5);
      
      expect(refreshedSuggestions).toBeDefined();
      expect(refreshedSuggestions.length).toBe(firstSuggestions.length);
      
      // At least some should be different (due to randomization)
      const differentSuggestions = refreshedSuggestions.filter(
        (refreshed, index) => refreshed.id !== firstSuggestions[index]?.id
      );
      
      expect(differentSuggestions.length).toBeGreaterThan(0);
    });
  });

  describe('getRandomSuggestion', () => {
    it('should return a single suggestion', () => {
      const suggestion = SuggestionEngine.getRandomSuggestion(mockWeather);
      
      expect(suggestion).toBeDefined();
      expect(suggestion?.items).toBeDefined();
      expect(suggestion?.items.length).toBeGreaterThan(0);
    });

    it('should respect preferences for random suggestion', () => {
      const preferences: UserPreferences = {
        culture: 'african',
      };

      const suggestion = SuggestionEngine.getRandomSuggestion(mockWeather, preferences);
      
      if (suggestion) {
        suggestion.items.forEach(item => {
          expect(item.culture).toBe('african');
        });
      }
    });
  });
});

