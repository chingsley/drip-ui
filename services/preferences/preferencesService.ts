import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, UserProfile } from '@/types/preferences';
import { getFirebaseFirestore, isFirebaseInitialized } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const PREFERENCES_KEY = 'user_preferences';
const FAVORITES_KEY = 'user_favorites';

export class PreferencesService {
  /**
   * Save user preferences to AsyncStorage (local)
   * @param preferences User preferences to save
   */
  static async savePreferencesLocally(preferences: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences locally:', error);
      throw error;
    }
  }

  /**
   * Get user preferences from AsyncStorage (local)
   * @returns User preferences or empty object
   */
  static async getPreferencesLocally(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(PREFERENCES_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting preferences locally:', error);
      return {};
    }
  }

  /**
   * Save user preferences to Firestore (cloud)
   * @param uid User ID
   * @param preferences User preferences
   */
  static async savePreferencesToCloud(uid: string, preferences: UserPreferences): Promise<void> {
    if (!isFirebaseInitialized()) {
      console.warn('Firebase not initialized, skipping cloud save');
      return;
    }

    try {
      const firestore = getFirebaseFirestore();
      const userRef = doc(firestore, 'users', uid);
      
      await updateDoc(userRef, {
        preferences,
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        const firestore = getFirebaseFirestore();
        const userRef = doc(firestore, 'users', uid);
        await setDoc(userRef, {
          preferences,
          favorites: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        console.error('Error saving preferences to cloud:', error);
        throw error;
      }
    }
  }

  /**
   * Get user preferences from Firestore (cloud)
   * @param uid User ID
   * @returns User preferences or empty object
   */
  static async getPreferencesFromCloud(uid: string): Promise<UserPreferences> {
    if (!isFirebaseInitialized()) {
      console.warn('Firebase not initialized, returning empty preferences');
      return {};
    }

    try {
      const firestore = getFirebaseFirestore();
      const userRef = doc(firestore, 'users', uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.preferences || {};
      }
      return {};
    } catch (error) {
      console.error('Error getting preferences from cloud:', error);
      return {};
    }
  }

  /**
   * Sync preferences between local and cloud
   * @param uid User ID (if authenticated)
   * @param preferences Preferences to sync
   */
  static async syncPreferences(uid: string | null, preferences: UserPreferences): Promise<void> {
    // Always save locally
    await this.savePreferencesLocally(preferences);

    // If user is authenticated, also save to cloud
    if (uid) {
      try {
        await this.savePreferencesToCloud(uid, preferences);
      } catch (error) {
        console.error('Failed to sync preferences to cloud:', error);
        // Don't throw - local save succeeded
      }
    }
  }

  /**
   * Save favorite outfit ID locally
   * @param outfitId Outfit ID to favorite
   */
  static async addFavorite(outfitId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(outfitId)) {
        favorites.push(outfitId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  /**
   * Remove favorite outfit ID locally
   * @param outfitId Outfit ID to unfavorite
   */
  static async removeFavorite(outfitId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updated = favorites.filter(id => id !== outfitId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  /**
   * Get all favorite outfit IDs
   * @returns Array of favorite outfit IDs
   */
  static async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  /**
   * Check if outfit is favorited
   * @param outfitId Outfit ID to check
   * @returns true if favorited, false otherwise
   */
  static async isFavorite(outfitId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.includes(outfitId);
  }

  /**
   * Clear all local preferences and favorites
   */
  static async clearAllLocal(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([PREFERENCES_KEY, FAVORITES_KEY]);
    } catch (error) {
      console.error('Error clearing local preferences:', error);
      throw error;
    }
  }

  /**
   * Get complete user profile from cloud
   * @param uid User ID
   * @returns User profile or null
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!isFirebaseInitialized()) {
      return null;
    }

    try {
      const firestore = getFirebaseFirestore();
      const userRef = doc(firestore, 'users', uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          uid,
          email: data.email || '',
          displayName: data.displayName,
          photoURL: data.photoURL,
          preferences: data.preferences || {},
          favorites: data.favorites || [],
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
}

