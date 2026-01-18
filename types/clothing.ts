export type ClothingType = 'top' | 'bottom' | 'shoes' | 'outerwear' | 'accessory';

export type Culture = 'western' | 'african' | 'indian' | 'east-asian' | 'middle-eastern';

export type DressStyle = 'masculine' | 'feminine' | 'unisex' | 'androgynous' | 'gender-fluid';

export type DressCode = 'formal' | 'casual' | 'semi-formal' | 'black-tie' | 'gala';

export interface ClothingItem {
  id: string;
  type: ClothingType;
  name: string;
  imageUrl: string;
  color: string;
  material: string;
  culture: Culture;
  style: DressStyle;
  dressCode: DressCode;
  buyLink?: string;
  temperatureRange: {
    min: number; // Celsius
    max: number; // Celsius
  };
}

export interface OutfitSuggestion {
  id: string;
  items: ClothingItem[];
  totalTemperatureRange: {
    min: number;
    max: number;
  };
  isFavorite?: boolean;
}

