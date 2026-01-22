import FavoritesIcon from '@/components/svg/favorites';
import HomeIcon from '@/components/svg/home';
import ProfileIcon from '@/components/svg/profile';
import RefreshIcon from '@/components/svg/refresh';
import SettingsIcon from '@/components/svg/settings';
import { colors } from '@/constants/colors';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const TabBarBackground = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.WHITE,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.PRIMARY,
      }}
    />
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: '#999',
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderRadius: 50,
          marginHorizontal: 10,
          marginBottom: 26,
          height: 62,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          borderWidth: 0,
          paddingHorizontal: 5,
          // paddingVertical: 5,

        },
        tabBarItemStyle: {
          // ...drawBorder(1, 'red', true),
        },
        tabBarLabelStyle: {
          fontSize: 13,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false, // comment this out to show 'Home' as title of this page
          tabBarIcon: ({ focused }) => <HomeIcon isActive={focused} />,
          tabBarLabel: "Home"
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => <ProfileIcon isActive={focused} />,
          tabBarLabel: "Profile"
        }}
      />
      <Tabs.Screen
        name="refresh"
        options={{
          title: 'Refresh',
          headerShown: false,
          tabBarIcon: ({ focused }) => <RefreshIcon isActive={focused} />,
          tabBarLabel: "Refresh"
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          headerShown: false,
          tabBarIcon: ({ focused }) => <FavoritesIcon isActive={focused} />,
          tabBarLabel: "Favorites"
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ focused }) => <SettingsIcon isActive={focused} />,
          tabBarLabel: "Settings"
        }}
      />
    </Tabs>
  );
};

export default _layout;