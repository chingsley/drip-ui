# Drip - Weather-Informed Dress Suggestion App

A React Native mobile application that provides personalized clothing suggestions based on current weather conditions and user preferences.

## Overview

Drip is a dress-assist mobile application that suggests outfits to users based on:
- Real-time weather conditions
- User's location
- Personal style preferences (gender expression, culture, dress code)
- Favorite colors and materials

## Features

### MVP (Phase 1)
- ✅ **Weather-based suggestions**: Automatic outfit recommendations based on current temperature
- ✅ **Location detection**: Uses device GPS to determine local weather
- ✅ **Swipeable interface**: Tinder-style swipe to browse outfit suggestions
- ✅ **User preferences**: Customize suggestions by dress style, culture, dress code, colors, and materials
- ✅ **Favorites**: Save favorite outfit combinations
- ✅ **Offline support**: Cached suggestions and weather data
- ✅ **Buy links**: Affiliate marketing integration for outfit items

### Future Phases
- **Phase 2**: Personal wardrobe upload and management
- **Phase 3**: Natural language search ("I have a job interview tomorrow in Toronto")
- **Phase 4**: Visual cloth try-on AI model
- **Phase 5**: Social features (follow influencers, share picks)

## Tech Stack

### Frontend
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Gestures**: react-native-gesture-handler & react-native-reanimated
- **State Management**: React Context API + Custom Hooks
- **Type Safety**: TypeScript

### Backend Services
- **Weather API**: WeatherAPI.com (1M free calls/month)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore (user preferences)
- **Storage**: AsyncStorage (local caching)

### Testing & CI/CD
- **Unit Tests**: Jest + React Native Testing Library
- **CI/CD**: GitHub Actions
- **Build**: Expo EAS Build

## Project Structure

```
drip-ui/
├── app/                          # Screens (Expo Router)
│   ├── index.tsx                # Start/splash screen
│   ├── suggestions.tsx          # Main suggestions screen
│   └── settings.tsx             # User preferences screen
├── components/                   # Reusable components
│   ├── shared/                  # Shared UI components
│   │   └── Button.tsx
│   └── suggestions/             # Suggestion-specific components
│       ├── OutfitCard.tsx      # Individual outfit display
│       └── SwipeableStack.tsx  # Swipeable card container
├── services/                     # Business logic & API integrations
│   ├── location/               # Location services
│   ├── weather/                # Weather API integration
│   ├── suggestions/            # Outfit suggestion engine
│   ├── preferences/            # User preferences management
│   ├── firebase/               # Firebase configuration
│   └── auth/                   # Authentication service
├── hooks/                        # Custom React hooks
│   ├── useLocation.ts
│   ├── useWeather.ts
│   ├── useSuggestions.ts
│   └── usePreferences.ts
├── types/                        # TypeScript type definitions
│   ├── clothing.ts
│   ├── weather.ts
│   └── preferences.ts
├── constants/                    # App constants
│   ├── colors.ts
│   └── images.ts
└── __tests__/                    # Test files
    ├── suggestionEngine.test.ts
    ├── weatherService.test.ts
    ├── locationService.test.ts
    └── preferencesService.test.ts
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd drip/drip-ui
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in `drip-ui/`:
```env
WEATHER_API_KEY=your_weatherapi_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

4. **Start the development server**
```bash
npm start
```

5. **Run on device/simulator**
```bash
npm run ios     # iOS simulator
npm run android # Android emulator
```

### Running Tests

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

## API Keys Setup

### WeatherAPI.com
1. Sign up at https://www.weatherapi.com/
2. Get your free API key (1M calls/month)
3. Add to `.env` file

### Firebase
1. Create project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy configuration to `.env` file

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed setup instructions.

## Architecture

### Modular Design
The app follows a modular, scalable architecture:
- **Services Layer**: Encapsulates all external API calls and business logic
- **Hooks Layer**: React hooks for state management and side effects
- **Components Layer**: Reusable UI components
- **Screens Layer**: Full-page components using Expo Router

### Data Flow
```
User Location → Weather API → Suggestion Engine → UI
     ↓              ↓              ↓
User Prefs → Filter Logic → Cached Results
```

### Key Design Decisions
- **Weather Caching**: 15-minute cache to reduce API calls
- **Offline First**: Local storage with cloud sync
- **Modular Services**: Easy to swap APIs or add new features
- **Type Safety**: Full TypeScript coverage

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow Expo/React Native best practices
- Use functional components with hooks
- Write tests for business logic

### Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions/changes
- `refactor:` Code refactoring

### Testing Strategy
- **Unit Tests**: Services, hooks, utility functions (80%+ coverage)
- **Integration Tests**: User flows and screen interactions
- **Manual Testing**: UI/UX and device-specific features

## Performance Optimizations

- **Image Optimization**: Using Expo Image with lazy loading
- **Weather Caching**: Reduces redundant API calls
- **Memoization**: React.memo and useMemo for expensive computations
- **Lazy Loading**: Suggestions loaded in batches
- **Offline Support**: Cached data for offline usage

## Security & Privacy

- **Location**: Only requested when needed, with clear explanation
- **API Keys**: Stored in environment variables, never committed
- **User Data**: Encrypted in local storage
- **Firebase**: Firestore rules restrict access to authenticated users only

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for:
- EAS Build configuration
- CI/CD setup
- App Store submission
- Production deployment

## Roadmap

### Current (MVP - Phase 1)
- ✅ Weather-based suggestions
- ✅ User preferences
- ✅ Swipeable interface
- ✅ Favorites functionality

### Next (Phase 2)
- [ ] Personal wardrobe management
- [ ] Camera integration for clothing upload
- [ ] Outfit tracking

### Future (Phase 3+)
- [ ] Natural language search
- [ ] AI visual try-on
- [ ] Social features
- [ ] Style influencer following

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Contact

For questions or support, please contact the development team.

## Acknowledgments

- WeatherAPI.com for weather data
- Firebase for backend services
- Expo for the development framework
- Unsplash for sample clothing images

