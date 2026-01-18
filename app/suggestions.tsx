import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function SuggestionsScreen() {
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
          <Text style={styles.placeholderText}>Weather Card Section</Text>
        </View>

        {/* Dress Suggestion Section */}
        <View testID="dress-suggestion-section" style={styles.dressSuggestionSection}>
          <Text style={styles.placeholderText}>Dress Suggestion Section</Text>
        </View>

        {/* Tabs Section */}
        <View testID="tabs-section" style={styles.tabsSection}>
          <Text style={styles.placeholderText}>Tabs Section</Text>
        </View>
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
  // Task 1: Page Layout Structure - Section outlines (light gray for visual feedback)
  headerSection: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#D3D3D3', // Light gray outline
    padding: 20,
    paddingTop: 60, // Account for status bar
    justifyContent: 'center',
  },
  // Task 2: Header Content
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    tintColor: '#6B46C1', // Purple color
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  outfitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  outfitIcon: {
    width: 24,
    height: 24,
    tintColor: '#6B46C1', // Purple color
  },
  weatherCardSection: {
    minHeight: 180,
    borderWidth: 2,
    borderColor: '#D3D3D3', // Light gray outline
    padding: 10,
    justifyContent: 'center',
  },
  dressSuggestionSection: {
    flex: 1,
    minHeight: 400,
    borderWidth: 2,
    borderColor: '#D3D3D3', // Light gray outline
    padding: 10,
    justifyContent: 'center',
  },
  tabsSection: {
    minHeight: 80,
    borderWidth: 2,
    borderColor: '#D3D3D3', // Light gray outline
    padding: 10,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
