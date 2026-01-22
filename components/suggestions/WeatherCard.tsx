import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { images } from '@/constants/images';

export interface WeatherCardProps {
  day: 'Today' | 'Tomorrow';
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  day,
  temperature,
  feelsLike,
  condition,
  icon,
}) => {
  const isToday = day === 'Today';

  // Map icon string to Ionicons name
  const getIconName = (iconStr: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      'partly-cloudy': images.weather.partlyCloudy,
      'cloudy': images.weather.cloudy,
      'sunny': 'sunny',
      'rainy': 'rainy',
      'snowy': 'snow',
      'windy': 'wind',
      'clear': 'sunny',
    };
    return iconMap[iconStr.toLowerCase()] || 'partly-sunny';
  };

  return (
    <View
      testID="weather-card"
      style={[
        styles.card,
        isToday ? styles.todayCard : styles.tomorrowCard,
      ]}
    >
      <View style={styles.leftContainer}>
        <View style={styles.topBox}>
          <Text style={{ height: 10 }}> </Text>
        </View>
        <View style={styles.midBox}>
          <Image
            source={getIconName(icon) as ImageSourcePropType}
            style={styles.cloudImg}
          />
        </View>
        <View style={styles.bottomBox}>
          <Text
            style={[
              styles.conditionText,
              isToday ? styles.todayConditionText : styles.tomorrowConditionText,
            ]}
          >
            {condition}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.topBox}>
          <Text
            style={[
              styles.dayText,
              isToday ? styles.todayDayText : styles.tomorrowDayText,
            ]}
          >
            {day}
          </Text>
        </View>
        <View style={styles.midBox}>
          <Text
            style={[styles.temperatureText,
            isToday ? styles.todayTemperatureText : styles.tomorrowTemperatureText,
            ]}
          >
            {Math.round(temperature)}°c
          </Text>
        </View>
        <View style={styles.bottomBox}>
          <Text
            style={[
              styles.feelsLikeText,
              isToday ? styles.todayFeelsLikeText : styles.tomorrowFeelsLikeText,
            ]}
          >
            Feels Like {Math.round(feelsLike)}°C
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 30,
    marginRight: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  todayCard: {
    backgroundColor: colors.PRIMARY,
  },
  tomorrowCard: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cloudImg: {
    height: 60,
    width: 85,
    resizeMode: 'cover',
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '200',
    fontStyle: 'normal',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  todayConditionText: {
    color: colors.WHITE,
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  dayText: {
    fontSize: 20,
    fontWeight: '200',
    letterSpacing: 0.5,
  },
  todayDayText: {
    color: colors.WHITE,
  },
  tomorrowDayText: {
    color: '#666666',
  },
  temperatureText: {
    fontSize: 50,
    fontWeight: '200',
  },
  todayTemperatureText: {
    color: colors.WHITE,
  },
  tomorrowTemperatureText: {
    color: '#000000',
  },
  tomorrowConditionText: {
    color: '#666666',
  },
  feelsLikeText: {
    fontSize: 14,
    fontWeight: '200',
    fontStyle: 'normal',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  todayFeelsLikeText: {
    color: colors.WHITE,
  },
  tomorrowFeelsLikeText: {
    color: '#666666',
  },
  topBox: {
    height: 25,
    justifyContent: 'center',
    // borderWidth: 1,
  },
  midBox: {
    height: 60,
    justifyContent: 'center',
    // borderWidth: 1,
  },
  bottomBox: {
    height: 25,
    justifyContent: 'center',
  }

});

