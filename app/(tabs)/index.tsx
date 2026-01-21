import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { WeatherCard } from '@/components/suggestions/WeatherCard';
import { colors } from '@/constants/colors';
import OutfitCard from '@/components/suggestions/OutfitCard';
import { drawBorder } from '@/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.65; // 55% of screen width for main card
const CARD_SPACING = 12;
// const PAGE_WIDTH = SCREEN_WIDTH; // Full width for paging
const OUTFIT_CARD_WIDTH = 275;
const OUTFIT_CARD_GAP = 35;
const OUTFIT_SIDE_INSET = (SCREEN_WIDTH - OUTFIT_CARD_WIDTH) / 2;

export default function SuggestionsScreen() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Static weather data for initial implementation
  const weatherData = [
    {
      day: 'Today' as const,
      temperature: 15,
      feelsLike: 10,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
    },
    {
      day: 'Tomorrow' as const,
      temperature: 12,
      feelsLike: 8,
      condition: 'Cloudy',
      icon: 'cloudy',
    },
    {
      day: 'Tomorrow' as const,
      temperature: 12,
      feelsLike: 8,
      condition: 'Sunny',
      icon: 'cloudy',
    },
  ];

  const handleDayChange = (index: number) => {
    if (weatherData[index]) {
      console.log(`fetching weather info for the swiped day....`);
      console.log('Details of the swiped weather card:', weatherData[index]);
    }
    // In the future, you can fetch weather data for weatherData[index].day
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));

    if (newIndex !== selectedDayIndex) {
      setSelectedDayIndex(newIndex);
      handleDayChange(newIndex);
    }
    // TODO: Update suggestions based on selected day (Task 17)
  };

  const outfit1Images = [
    require('@/assets/clothes/shirt1.png'),
    require('@/assets/clothes/pants1.png'),
    require('@/assets/clothes/shoes1.png'),
  ];

  const outfit2Images = [
    require('@/assets/clothes/shirt2.png'),
    require('@/assets/clothes/pants2.png'),
    require('@/assets/clothes/shoes2.png'),
  ];

  const outfit3Images = [
    require('@/assets/clothes/shirt3.png'),
    require('@/assets/clothes/pants2.png'),
    require('@/assets/clothes/shoes1.png'),
  ];

  const outfit4Images = [
    require('@/assets/clothes/dress1.png'),
    // require('@/assets/clothes/pants2.png'),
    require('@/assets/clothes/shoes2.png'),
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View testID="header-section" style={styles.headerSection}>
          <View testID="header-content" style={styles.headerContent}>
            {/* Left side: Location icon + "Halifax" */}
            <View testID="header-left" style={styles.headerLeft}>
              <Image
                testID="location-icon"
                source={require('@/assets/images/location-icon.png')}
                style={styles.locationIcon}
              />
              <Text style={styles.locationText}>Halifax</Text>
            </View>

            {/* Right side: "My Outfits" text + outfit icon */}
            <View testID="header-right" style={styles.headerRight}>
              <Text style={styles.outfitText}>My Outfits</Text>
              <Image
                testID="outfit-icon"
                source={require('@/assets/images/outfit-icon.png')}
                style={styles.outfitIcon}
              />
            </View>
          </View>
        </View>

        {/* Weather Card Section */}
        <View testID="weather-card-section" style={styles.weatherCardSection}>
          <ScrollView
            testID="weather-scroll-view"
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weatherScrollContent}
            onMomentumScrollEnd={handleScroll}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            decelerationRate="fast"
          >
            {weatherData.map((weather, index) => (
              <View
                key={index}
                style={styles.weatherCardWrapper}
              >
                <WeatherCard
                  day={weather.day}
                  temperature={weather.temperature}
                  feelsLike={weather.feelsLike}
                  condition={weather.condition}
                  icon={weather.icon}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Outfit Suggestion Section */}
        <View testID="dress-suggestion-section" style={styles.outfitSuggestionSection}>
          <ScrollView
            testID="outfit-scroll-view"
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.outfitScrollContent}
            snapToInterval={OUTFIT_CARD_WIDTH + OUTFIT_CARD_GAP}
            decelerationRate="fast"
          >
            <View style={styles.outfitCardWrapper}><OutfitCard isActive imageUrls={outfit1Images} /></View>
            <View style={styles.outfitCardWrapper}><OutfitCard isActive={false} imageUrls={outfit2Images} /></View>
            <View style={styles.outfitCardWrapper}><OutfitCard isActive={false} imageUrls={outfit3Images} /></View>
            <View style={styles.outfitCardWrapper}><OutfitCard isActive={false} imageUrls={outfit4Images} /></View>
          </ScrollView>
          <View style={styles.outfitArea}>
            <Text style={styles.outfitAreaText}>Your daily outfit plan</Text>
          </View>
        </View>

        {/* Page-specific Tabs Section */}
        {/* <View testID="tabs-section" style={styles.tabsSection}>
          <Text style={styles.placeholderText}>Tabs Section</Text>
        </View> */}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    ...drawBorder(1, colors.BLACK),
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 60, // Account for status bar
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 5,
    // ...drawBorder(1, colors.BLACK, true),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: colors.PRIMARY,
  },
  locationText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
    letterSpacing: 0.5,
  },
  outfitText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
    letterSpacing: 0.5,
  },
  outfitIcon: {
    width: 24,
    height: 24,
    tintColor: colors.PRIMARY,
  },
  weatherCardSection: {
    ...drawBorder(1, 'red'),
    // paddingVertical: 1,
    marginBottom: 5,
  },
  weatherScrollContent: {
    alignItems: 'center',
    gap: CARD_SPACING,
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
  },
  weatherCardWrapper: {
    justifyContent: 'center',
    width: CARD_WIDTH,
  },
  outfitSuggestionSection: {
    flex: 1,
    ...drawBorder(2, 'yellow'),
    position: 'relative',
  },
  outfitArea: {
    borderWidth: 2,
    borderColor: colors.PRIMARY,
    borderRadius: 10,
    zIndex: -2,
    backgroundColor: colors.LIGHT_GRAY,
    left: '50%', // Move starting point to the middle of parent
    marginLeft: -150, // Shift left by exactly half the width (300 / 2)
    // transform: [{ translateX: -150 }], // 300 / 2 = 150 // Same as line above
    width: 300,
    position: 'absolute',
    height: '98%',
  },
  outfitAreaText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 8,
  },
  outfitScrollContent: {
    gap: 35,
    paddingHorizontal: OUTFIT_SIDE_INSET,
  },
  outfitCardWrapper: {
    justifyContent: 'center',
  },
  tabsSection: {
    minHeight: 90,
    ...drawBorder(1, colors.LIGHT_GRAY),
    padding: 10,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
