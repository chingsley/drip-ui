import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OutfitSuggestion } from '@/types/clothing';
import { OutfitCard } from './OutfitCard_old';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const ROTATION_ANGLE = 25;

interface SwipeableStackProps {
  suggestions: OutfitSuggestion[];
  onSwipeLeft?: (outfit: OutfitSuggestion) => void;
  onSwipeRight?: (outfit: OutfitSuggestion) => void;
  onFavoriteToggle?: (outfitId: string) => void;
  onEmpty?: () => void;
}

export const SwipeableStack: React.FC<SwipeableStackProps> = ({
  suggestions,
  onSwipeLeft,
  onSwipeRight,
  onFavoriteToggle,
  onEmpty,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const currentOutfit = suggestions[currentIndex];
  const nextOutfit = suggestions[currentIndex + 1];

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    'worklet';

    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

    if (direction === 'left' && onSwipeLeft) {
      runOnJS(onSwipeLeft)(currentOutfit);
    } else if (direction === 'right' && onSwipeRight) {
      runOnJS(onSwipeRight)(currentOutfit);
    }

    const newIndex = currentIndex + 1;
    runOnJS(setCurrentIndex)(newIndex);

    if (newIndex >= suggestions.length && onEmpty) {
      runOnJS(onEmpty)();
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD;
      const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD;

      if (shouldSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(event.translationY, { duration: 300 });
        handleSwipeComplete('left');
      } else if (shouldSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(event.translationY, { duration: 300 });
        handleSwipeComplete('right');
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE]
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.5]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  const nextCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [0.9, 1]
    );

    return {
      transform: [{ scale }],
    };
  });

  if (!currentOutfit) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No more suggestions!</Text>
        <Text style={styles.emptySubtext}>Pull down to refresh</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Next Card (Behind) */}
      {nextOutfit && (
        <Animated.View style={[styles.cardContainer, styles.nextCard, nextCardStyle]}>
          <OutfitCard
            outfit={nextOutfit}
            onFavoriteToggle={onFavoriteToggle}
          />
        </Animated.View>
      )}

      {/* Current Card (Front) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <OutfitCard
            outfit={currentOutfit}
            onFavoriteToggle={onFavoriteToggle}
          />

          {/* Swipe Indicators */}
          <Animated.View
            style={[
              styles.swipeIndicator,
              styles.likeIndicator,
              useAnimatedStyle(() => ({
                opacity: interpolate(
                  translateX.value,
                  [0, SWIPE_THRESHOLD / 2],
                  [0, 1]
                ),
              })),
            ]}
          >
            <Text style={styles.indicatorText}>LIKE</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.swipeIndicator,
              styles.passIndicator,
              useAnimatedStyle(() => ({
                opacity: interpolate(
                  translateX.value,
                  [-SWIPE_THRESHOLD / 2, 0],
                  [1, 0]
                ),
              })),
            ]}
          >
            <Text style={styles.indicatorText}>PASS</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {/* Counter */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {suggestions.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: '85%',
    alignSelf: 'center',
    top: 20,
  },
  nextCard: {
    zIndex: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 3,
  },
  likeIndicator: {
    right: 30,
    borderColor: '#2ECC71',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  passIndicator: {
    left: 30,
    borderColor: '#E74C3C',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  indicatorText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
  },
  counter: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

