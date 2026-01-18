import { Culture, DressCode, DressStyle } from './clothing';

export interface UserPreferences {
  dressStyle?: DressStyle;
  culture?: Culture;
  preferredColors?: string[];
  materials?: string[];
  dressCode?: DressCode;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  preferences: UserPreferences;
  favorites: string[]; // Array of outfit IDs
}

export interface PreferenceOption {
  value: string;
  label: string;
}

export const DRESS_STYLES: PreferenceOption[] = [
  { value: 'masculine', label: 'Masculine' },
  { value: 'feminine', label: 'Feminine' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'androgynous', label: 'Androgynous' },
  { value: 'gender-fluid', label: 'Gender-Fluid' },
];

export const CULTURES: PreferenceOption[] = [
  { value: 'western', label: 'Western' },
  { value: 'african', label: 'African' },
  { value: 'indian', label: 'Indian' },
  { value: 'east-asian', label: 'East Asian' },
  { value: 'middle-eastern', label: 'Middle Eastern' },
];

export const DRESS_CODES: PreferenceOption[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'semi-formal', label: 'Semi-Formal' },
  { value: 'formal', label: 'Formal' },
  { value: 'black-tie', label: 'Black Tie' },
  { value: 'gala', label: 'Gala' },
];

export const COMMON_COLORS: PreferenceOption[] = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'gray', label: 'Gray' },
  { value: 'navy', label: 'Navy' },
  { value: 'brown', label: 'Brown' },
  { value: 'beige', label: 'Beige' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'pink', label: 'Pink' },
  { value: 'purple', label: 'Purple' },
];

export const COMMON_MATERIALS: PreferenceOption[] = [
  { value: 'cotton', label: 'Cotton' },
  { value: 'silk', label: 'Silk' },
  { value: 'wool', label: 'Wool' },
  { value: 'linen', label: 'Linen' },
  { value: 'denim', label: 'Denim' },
  { value: 'leather', label: 'Leather' },
  { value: 'polyester', label: 'Polyester' },
  { value: 'cashmere', label: 'Cashmere' },
];

