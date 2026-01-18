// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  Accuracy: {
    High: 4,
  },
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      weatherApiKey: 'test-api-key',
      firebaseConfig: {},
    },
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(),
}));

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'View',
  GestureDetector: 'View',
  Gesture: {
    Pan: jest.fn(() => ({
      onUpdate: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis(),
    })),
  },
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

