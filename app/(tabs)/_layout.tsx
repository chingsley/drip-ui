import FavoritesIcon from '@/components/svg/favorites';
import HomeIcon from '@/components/svg/home';
import ProfileIcon from '@/components/svg/profile';
import RefreshIcon from '@/components/svg/refresh';
import SettingsIcon from '@/components/svg/settings';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { drawBorder } from '@/utils';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.WHITE,
          borderRadius: 50,
          marginHorizontal: 10,
          marginBottom: 26,
          height: 62,
          overflow: 'hidden',
          ...drawBorder(2, colors.PRIMARY, true),
          zIndex: 100,

        },
        tabBarItemStyle: {
          ...drawBorder(1, 'red', true),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false, // comment this out to show 'Home' as title of this page
          tabBarIcon: ({ focused }) => (
            <HomeIcon isActive={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <ProfileIcon isActive={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="refresh"
        options={{
          title: 'Refresh',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <RefreshIcon isActive={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FavoritesIcon isActive={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <SettingsIcon isActive={focused} />
          )
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({
  icon: {

  }
});