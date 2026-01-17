import {
  getFirebaseAuth,
  isFirebaseInitialized,
} from '../firebase/firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

/**
 * Auth Service for Firebase Authentication
 * Note: Google OAuth on React Native requires additional setup with expo-auth-session
 * and Firebase native SDKs. For MVP, we provide email/password auth.
 * Google OAuth can be added in a future phase.
 */

export class AuthService {
  /**
   * Sign in with email and password
   * @param email User email
   * @param password User password
   * @returns User object or null
   */
  static async signInWithEmail(email: string, password: string): Promise<User | null> {
    if (!isFirebaseInitialized()) {
      console.warn('Firebase not initialized');
      return null;
    }

    try {
      const auth = getFirebaseAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Create account with email and password
   * @param email User email
   * @param password User password
   * @returns User object or null
   */
  static async signUpWithEmail(email: string, password: string): Promise<User | null> {
    if (!isFirebaseInitialized()) {
      console.warn('Firebase not initialized');
      return null;
    }

    try {
      const auth = getFirebaseAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    if (!isFirebaseInitialized()) {
      console.warn('Firebase not initialized');
      return;
    }

    try {
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   * @returns Current user or null
   */
  static getCurrentUser(): User | null {
    if (!isFirebaseInitialized()) {
      return null;
    }

    const auth = getFirebaseAuth();
    return auth.currentUser;
  }

  /**
   * Listen to auth state changes
   * @param callback Callback function to handle auth state changes
   * @returns Unsubscribe function
   */
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    if (!isFirebaseInitialized()) {
      return () => { };
    }

    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Convert Firebase auth error codes to user-friendly messages
   * @param errorCode Firebase error code
   * @returns User-friendly error message
   */
  private static getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }
}

/**
 * TODO: Google OAuth Integration
 * 
 * To add Google OAuth in a future phase:
 * 
 * 1. Install dependencies:
 *    npm install expo-auth-session expo-crypto
 * 
 * 2. Configure Firebase Console:
 *    - Enable Google Sign-In in Authentication > Sign-in method
 *    - Add OAuth 2.0 client IDs for iOS and Android
 * 
 * 3. Update app.json with Google sign-in configuration
 * 
 * 4. Implement Google Sign-In method:
 *    ```typescript
 *    import * as Google from 'expo-auth-session/providers/google';
 *    import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
 *    
 *    static async signInWithGoogle() {
 *      const [request, response, promptAsync] = Google.useAuthRequest({
 *        expoClientId: 'YOUR_EXPO_CLIENT_ID',
 *        iosClientId: 'YOUR_IOS_CLIENT_ID',
 *        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
 *      });
 *      
 *      // Handle response and sign in with Firebase
 *      if (response?.type === 'success') {
 *        const { id_token } = response.params;
 *        const credential = GoogleAuthProvider.credential(id_token);
 *        return await signInWithCredential(auth, credential);
 *      }
 *    }
 *    ```
 */

