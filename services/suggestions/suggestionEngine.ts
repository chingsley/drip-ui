import { ClothingItem, OutfitSuggestion } from '@/types/clothing';
import { WeatherData } from '@/types/weather';
import { UserPreferences } from '@/types/preferences';
import { getAllClothingItems } from './clothingDatabase';

export class SuggestionEngine {
  /**
   * Filter clothing items based on temperature
   * @param items Clothing items to filter
   * @param temperature Current temperature in Celsius
   * @returns Filtered clothing items suitable for the temperature
   */
  private static filterByTemperature(items: ClothingItem[], temperature: number): ClothingItem[] {
    return items.filter(item => {
      return temperature >= item.temperatureRange.min && temperature <= item.temperatureRange.max;
    });
  }

  /**
   * Filter clothing items based on user preferences
   * @param items Clothing items to filter
   * @param preferences User preferences
   * @returns Filtered clothing items matching user preferences
   */
  private static filterByPreferences(items: ClothingItem[], preferences: UserPreferences): ClothingItem[] {
    let filtered = [...items];

    // Filter by dress style
    if (preferences.dressStyle) {
      filtered = filtered.filter(
        item => item.style === preferences.dressStyle || item.style === 'unisex' || item.style === 'gender-fluid'
      );
    }

    // Filter by culture
    if (preferences.culture) {
      filtered = filtered.filter(item => item.culture === preferences.culture);
    }

    // Filter by dress code
    if (preferences.dressCode) {
      filtered = filtered.filter(item => item.dressCode === preferences.dressCode);
    }

    // Filter by preferred colors
    if (preferences.preferredColors && preferences.preferredColors.length > 0) {
      filtered = filtered.filter(item => {
        return preferences.preferredColors!.some(color => 
          item.color.toLowerCase().includes(color.toLowerCase())
        );
      });
    }

    // Filter by materials
    if (preferences.materials && preferences.materials.length > 0) {
      filtered = filtered.filter(item => {
        return preferences.materials!.some(material => 
          item.material.toLowerCase().includes(material.toLowerCase())
        );
      });
    }

    return filtered;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   * @param array Array to shuffle
   * @returns Shuffled array
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Create an outfit suggestion from clothing items
   * @param top Top clothing item
   * @param bottom Bottom clothing item
   * @param shoes Shoes clothing item
   * @param outerwear Optional outerwear item
   * @param accessory Optional accessory item
   * @returns OutfitSuggestion
   */
  private static createOutfit(
    top: ClothingItem,
    bottom: ClothingItem,
    shoes: ClothingItem,
    outerwear?: ClothingItem,
    accessory?: ClothingItem
  ): OutfitSuggestion {
    const items = [top, bottom, shoes];
    if (outerwear) items.unshift(outerwear);
    if (accessory) items.push(accessory);

    // Calculate combined temperature range
    const allRanges = items.map(item => item.temperatureRange);
    const totalTemperatureRange = {
      min: Math.max(...allRanges.map(r => r.min)),
      max: Math.min(...allRanges.map(r => r.max)),
    };

    return {
      id: `outfit_${items.map(i => i.id).join('_')}`,
      items,
      totalTemperatureRange,
      isFavorite: false,
    };
  }

  /**
   * Generate outfit suggestions based on weather and user preferences
   * @param weather Current weather data
   * @param preferences User preferences
   * @param count Number of suggestions to generate (default: 10)
   * @returns Array of outfit suggestions
   */
  static generateSuggestions(
    weather: WeatherData,
    preferences: UserPreferences = {},
    count: number = 10
  ): OutfitSuggestion[] {
    const allItems = getAllClothingItems();
    const temperature = weather.temperature;

    // Step 1: Filter by temperature
    let filtered = this.filterByTemperature(allItems, temperature);

    // Step 2: Apply user preferences if any
    if (Object.keys(preferences).length > 0) {
      filtered = this.filterByPreferences(filtered, preferences);
    }

    // If we don't have enough items after filtering, relax some constraints
    if (filtered.length < 20) {
      // Relax preferences but keep temperature filtering
      filtered = this.filterByTemperature(allItems, temperature);
    }

    // Group items by type
    const tops = this.shuffleArray(filtered.filter(item => item.type === 'top'));
    const bottoms = this.shuffleArray(filtered.filter(item => item.type === 'bottom'));
    const shoes = this.shuffleArray(filtered.filter(item => item.type === 'shoes'));
    const outerwear = this.shuffleArray(filtered.filter(item => item.type === 'outerwear'));
    const accessories = this.shuffleArray(filtered.filter(item => item.type === 'accessory'));

    // Ensure we have minimum items
    if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
      console.warn('Not enough clothing items to create outfits');
      return [];
    }

    // Generate outfits
    const suggestions: OutfitSuggestion[] = [];
    const maxIterations = count * 2; // Prevent infinite loop
    let iterations = 0;

    while (suggestions.length < count && iterations < maxIterations) {
      iterations++;

      const top = tops[iterations % tops.length];
      const bottom = bottoms[iterations % bottoms.length];
      const shoe = shoes[iterations % shoes.length];

      // Decide if we need outerwear based on temperature
      let outer: ClothingItem | undefined;
      if (temperature < 15 && outerwear.length > 0) {
        outer = outerwear[iterations % outerwear.length];
      }

      // Optionally add accessories (20% chance)
      let accessory: ClothingItem | undefined;
      if (accessories.length > 0 && Math.random() < 0.2) {
        accessory = accessories[iterations % accessories.length];
      }

      const outfit = this.createOutfit(top, bottom, shoe, outer, accessory);

      // Avoid duplicates
      const isDuplicate = suggestions.some(s => s.id === outfit.id);
      if (!isDuplicate) {
        suggestions.push(outfit);
      }
    }

    return suggestions;
  }

  /**
   * Get a single random suggestion
   * @param weather Current weather data
   * @param preferences User preferences
   * @returns Single outfit suggestion or null
   */
  static getRandomSuggestion(
    weather: WeatherData,
    preferences: UserPreferences = {}
  ): OutfitSuggestion | null {
    const suggestions = this.generateSuggestions(weather, preferences, 1);
    return suggestions.length > 0 ? suggestions[0] : null;
  }

  /**
   * Refresh suggestions by generating a new set
   * @param weather Current weather data
   * @param preferences User preferences
   * @param count Number of suggestions
   * @returns New array of outfit suggestions
   */
  static refreshSuggestions(
    weather: WeatherData,
    preferences: UserPreferences = {},
    count: number = 10
  ): OutfitSuggestion[] {
    // Regenerate with randomization
    return this.generateSuggestions(weather, preferences, count);
  }
}

